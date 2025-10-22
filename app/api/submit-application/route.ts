import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { IncomingForm, File as FormidableFile } from 'formidable';
import { promises as fs } from 'fs';
import { Readable } from 'stream';
import { saveApplicationData, saveResumeFile } from '@/lib/storage';
import { ApplicationData, ScreeningResponse } from '@/lib/types';
import { SCREENING_QUESTIONS } from '@/lib/constants';
import { sendConfirmationEmail, sendToN8nWorkflow } from '@/lib/email';

// Disable body parsing for file uploads
export const runtime = 'nodejs';

// Helper to convert NextRequest to Node.js IncomingMessage
async function parseFormData(request: NextRequest): Promise<{ fields: any; files: any }> {
  return new Promise(async (resolve, reject) => {
    try {
      const formData = await request.formData();

      const fields: any = {};
      const files: any = {};

      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          const buffer = Buffer.from(await value.arrayBuffer());
          files[key] = {
            filepath: '', // Not needed, we'll use the buffer
            originalFilename: value.name,
            mimetype: value.type,
            size: value.size,
            buffer: buffer,
          };
        } else {
          fields[key] = value;
        }
      }

      resolve({ fields, files });
    } catch (error) {
      reject(error);
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const { fields, files } = await parseFormData(request);

    // Parse application data from JSON string
    const data = JSON.parse(fields.data);

    // Validate resume file
    if (!files.resume) {
      return NextResponse.json(
        { success: false, message: 'Resume file is required' },
        { status: 400 }
      );
    }

    const resumeFile = files.resume;

    // Generate application ID
    const applicationId = `ACE-${new Date().getFullYear()}-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Build screening responses array
    const screeningResponses: ScreeningResponse[] = SCREENING_QUESTIONS.map((question) => {
      let answer = data[question.id] || '';

      // Include conditional follow-up answer if applicable
      if (question.conditionalFollowUp && question.conditionalFollowUp.question) {
        const followUpAnswer = data[question.conditionalFollowUp.question.id];
        if (followUpAnswer) {
          answer = `${answer}\n\nClearance Details: ${followUpAnswer}`;
        }
      }

      return {
        questionId: question.id,
        questionText: question.label,
        answer,
      };
    });

    // Save resume file
    const { storedFilename, fileSize } = await saveResumeFile(
      applicationId,
      resumeFile.buffer,
      resumeFile.originalFilename,
      resumeFile.mimetype
    );

    // Build complete application data
    const applicationData: ApplicationData = {
      applicationId,
      timestamp: new Date().toISOString(),
      personalInfo: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        linkedin: data.linkedin || undefined,
      },
      screeningResponses,
      resume: {
        originalFilename: resumeFile.originalFilename,
        storedFilename,
        fileSize,
        mimeType: resumeFile.mimetype,
      },
    };

    // Save application data as JSON
    await saveApplicationData(applicationData);

    // Send confirmation email to applicant (don't wait for it)
    sendConfirmationEmail(applicationData).catch((error) => {
      console.error('Failed to send confirmation email:', error);
      // Don't fail the application submission if email fails
    });

    // Send to n8n workflow for AI analysis (don't wait for it)
    sendToN8nWorkflow(applicationData).catch((error) => {
      console.error('Failed to send to n8n workflow:', error);
      // Don't fail the application submission if n8n fails
    });

    // Return success response
    return NextResponse.json({
      success: true,
      applicationId,
      message: 'Application submitted successfully',
    });
  } catch (error) {
    console.error('Error processing application:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to process application',
      },
      { status: 500 }
    );
  }
}

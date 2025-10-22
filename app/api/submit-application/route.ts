import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { IncomingForm, File as FormidableFile } from 'formidable';
import { promises as fs } from 'fs';
import { Readable } from 'stream';
import { saveApplicationData, saveResumeFile } from '@/lib/storage';
import { ApplicationData, ScreeningResponse } from '@/lib/types';
import { SCREENING_QUESTIONS } from '@/lib/constants';
import { applyRateLimit } from '@/lib/rate-limit';
import { logger, getClientIP } from '@/lib/logger';

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
  // Extract IP address for logging
  const clientIP = getClientIP(request);

  try {
    // Apply rate limiting
    const rateLimitResult = applyRateLimit(request);

    if (!rateLimitResult.allowed) {
      // Log rate limit exceeded
      await logger.warn('validation_failed' as any, {
        reason: 'rate_limit_exceeded',
        retryAfter: rateLimitResult.retryAfter,
      }, { ip: clientIP, sanitize: false });

      return NextResponse.json(
        {
          success: false,
          message: 'Too many requests. Please try again later.',
          error: 'RATE_LIMIT_EXCEEDED',
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter.toString(),
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
          },
        }
      );
    }

    // Parse form data
    const { fields, files } = await parseFormData(request);

    // Parse application data from JSON string
    const data = JSON.parse(fields.data);

    // Validate resume file
    if (!files.resume) {
      // Log validation failure
      await logger.validationFailed({
        error: 'missing_resume_file',
        fullName: data.fullName,
        email: data.email,
      }, clientIP);

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

    // Log file upload success
    await logger.fileUploaded(
      applicationId,
      resumeFile.originalFilename,
      fileSize,
      clientIP
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

    // Log successful application submission
    await logger.applicationSubmitted(
      applicationId,
      clientIP,
      {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        resumeFilename: resumeFile.originalFilename,
        resumeSize: fileSize,
      }
    );

    // Return success response with rate limit headers
    return NextResponse.json(
      {
        success: true,
        applicationId,
        message: 'Application submitted successfully',
      },
      {
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
        },
      }
    );
  } catch (error) {
    // Log application failure
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await logger.applicationFailed(
      errorMessage,
      clientIP,
      {
        errorStack: error instanceof Error ? error.stack : undefined,
      }
    );

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

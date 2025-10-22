import sgMail from '@sendgrid/mail';
import { ApplicationData } from './types';

// Initialize SendGrid with API key
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@startguides.com';
const FROM_NAME = process.env.SENDGRID_FROM_NAME || 'StartGuides Hiring Team';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

/**
 * Generate HTML email template for applicant confirmation
 */
function generateConfirmationEmailHTML(applicationData: ApplicationData): string {
  const { applicationId, personalInfo, timestamp } = applicationData;
  const submissionDate = new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Confirmation</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #334155;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #1e293b;
      font-size: 20px;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .content p {
      margin: 16px 0;
    }
    .app-id-box {
      background-color: #f1f5f9;
      border: 2px solid #e2e8f0;
      border-radius: 6px;
      padding: 20px;
      margin: 24px 0;
      text-align: center;
    }
    .app-id-label {
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .app-id-value {
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
      font-family: 'Courier New', monospace;
      letter-spacing: 1px;
    }
    .next-steps {
      background-color: #eff6ff;
      border-left: 4px solid #2563eb;
      padding: 20px;
      margin: 24px 0;
      border-radius: 4px;
    }
    .next-steps h3 {
      margin-top: 0;
      color: #1e40af;
      font-size: 16px;
    }
    .next-steps ol {
      margin: 12px 0;
      padding-left: 20px;
    }
    .next-steps li {
      margin: 8px 0;
    }
    .footer {
      background-color: #f8fafc;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
    }
    .footer a {
      color: #2563eb;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #2563eb;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #1e40af;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✓ Application Received</h1>
    </div>
    
    <div class="content">
      <h2>Thank you for applying, ${personalInfo.fullName}!</h2>
      
      <p>We've successfully received your application for the <strong>Application Content Engineer</strong> position at StartGuides.</p>
      
      <div class="app-id-box">
        <div class="app-id-label">Your Application ID</div>
        <div class="app-id-value">${applicationId}</div>
      </div>
      
      <p><strong>Submitted on:</strong> ${submissionDate}</p>
      
      <div class="next-steps">
        <h3>What Happens Next?</h3>
        <ol>
          <li>Our team will review your application within 3-5 business days</li>
          <li>We'll reach out via email if we'd like to schedule an interview</li>
          <li>Please keep your Application ID for future reference</li>
        </ol>
      </div>
      
      <p>If you have any questions about your application, please reply to this email with your Application ID.</p>
      
      <p>We appreciate your interest in joining the StartGuides team and look forward to reviewing your qualifications.</p>
      
      <p style="margin-top: 30px;">Best regards,<br>
      <strong>The StartGuides Hiring Team</strong></p>
    </div>
    
    <div class="footer">
      <p>This is an automated confirmation email. Please do not reply directly to this message.</p>
      <p>&copy; ${new Date().getFullYear()} StartGuides. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text version of confirmation email
 */
function generateConfirmationEmailText(applicationData: ApplicationData): string {
  const { applicationId, personalInfo, timestamp } = applicationData;
  const submissionDate = new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
APPLICATION RECEIVED

Thank you for applying, ${personalInfo.fullName}!

We've successfully received your application for the Application Content Engineer position at StartGuides.

YOUR APPLICATION ID: ${applicationId}
Submitted on: ${submissionDate}

WHAT HAPPENS NEXT?

1. Our team will review your application within 3-5 business days
2. We'll reach out via email if we'd like to schedule an interview
3. Please keep your Application ID for future reference

If you have any questions about your application, please reply to this email with your Application ID.

We appreciate your interest in joining the StartGuides team and look forward to reviewing your qualifications.

Best regards,
The StartGuides Hiring Team

---
This is an automated confirmation email.
© ${new Date().getFullYear()} StartGuides. All rights reserved.
  `.trim();
}

/**
 * Send confirmation email to applicant
 */
export async function sendConfirmationEmail(
  applicationData: ApplicationData
): Promise<{ success: boolean; error?: string }> {
  if (!SENDGRID_API_KEY) {
    console.error('SendGrid API key is not configured');
    return {
      success: false,
      error: 'Email service is not configured',
    };
  }

  const { personalInfo, applicationId } = applicationData;

  const msg = {
    to: personalInfo.email,
    from: {
      email: FROM_EMAIL,
      name: FROM_NAME,
    },
    subject: `Application Received - ${applicationId}`,
    text: generateConfirmationEmailText(applicationData),
    html: generateConfirmationEmailHTML(applicationData),
  };

  try {
    await sgMail.send(msg);
    console.log(`Confirmation email sent to ${personalInfo.email}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

/**
 * Send application data to n8n webhook for AI analysis (future implementation)
 */
export async function sendToN8nWorkflow(
  applicationData: ApplicationData
): Promise<{ success: boolean; error?: string }> {
  // Placeholder for n8n integration
  // Will be implemented later with webhook URL
  const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

  if (!N8N_WEBHOOK_URL) {
    console.log('n8n webhook not configured - skipping AI analysis');
    return { success: true }; // Not an error, just not configured yet
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    });

    if (!response.ok) {
      throw new Error(`n8n webhook failed: ${response.statusText}`);
    }

    console.log('Application sent to n8n for AI analysis');
    return { success: true };
  } catch (error) {
    console.error('Error sending to n8n webhook:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send to n8n',
    };
  }
}

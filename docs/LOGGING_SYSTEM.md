# Audit Logging System Documentation

## Overview

The application includes a comprehensive audit logging system that tracks all critical operations, including application submissions, file uploads, validation failures, and errors. The system is designed with privacy in mind, automatically masking personally identifiable information (PII) before logging.

## Features

- **Structured JSON Logging**: All logs are written in JSON format for easy parsing and analysis
- **Log Levels**: INFO, WARN, ERROR for categorizing events
- **PII Masking**: Automatic masking of sensitive data (email, phone, names)
- **Daily Log Rotation**: Logs are automatically organized by date (app-YYYY-MM-DD.log)
- **IP Address Tracking**: Captures client IP for security auditing
- **Event Types**: Predefined event types for consistent logging
- **File-based Storage**: Logs stored in `data/logs/` directory
- **Console Fallback**: Falls back to console logging if file writing fails
- **Build-time Safety**: Skips file logging during Next.js build process

## Log File Location

Logs are stored in: `/data/logs/app-YYYY-MM-DD.log`

Example: `data/logs/app-2025-10-21.log`

## Log Format

Each log entry is a single-line JSON object with the following structure:

```json
{
  "timestamp": "2025-10-21T12:00:00.000Z",
  "level": "INFO",
  "event": "application_submitted",
  "ip": "192.168.1.100",
  "applicationId": "ACE-2025-XXXXX",
  "details": {
    "fullName": "J*** S***",
    "email": "joh**********",
    "phone": "555**********",
    "resumeFilename": "resume.pdf",
    "resumeSize": 1024000
  }
}
```

## Event Types

### 1. Application Submitted
**Event**: `application_submitted`
**Level**: INFO
**Logged When**: Successfully submitted application

```json
{
  "timestamp": "ISO8601",
  "level": "INFO",
  "event": "application_submitted",
  "ip": "x.x.x.x",
  "applicationId": "ACE-2025-XXXXX",
  "details": {
    "fullName": "J*** S***",
    "email": "joh**********",
    "phone": "555**********",
    "resumeFilename": "resume.pdf",
    "resumeSize": 1024000
  }
}
```

### 2. Application Failed
**Event**: `application_failed`
**Level**: ERROR
**Logged When**: Application submission fails

```json
{
  "timestamp": "ISO8601",
  "level": "ERROR",
  "event": "application_failed",
  "ip": "x.x.x.x",
  "details": {
    "error": "Error message",
    "errorStack": "Stack trace"
  }
}
```

### 3. File Uploaded
**Event**: `file_uploaded`
**Level**: INFO
**Logged When**: Resume file successfully uploaded

```json
{
  "timestamp": "ISO8601",
  "level": "INFO",
  "event": "file_uploaded",
  "ip": "x.x.x.x",
  "applicationId": "ACE-2025-XXXXX",
  "details": {
    "filename": "resume.pdf",
    "size": 1024000
  }
}
```

### 4. File Upload Failed
**Event**: `file_upload_failed`
**Level**: ERROR
**Logged When**: Resume file upload fails

```json
{
  "timestamp": "ISO8601",
  "level": "ERROR",
  "event": "file_upload_failed",
  "ip": "x.x.x.x",
  "details": {
    "error": "Error message",
    "filename": "resume.pdf"
  }
}
```

### 5. Validation Failed
**Event**: `validation_failed`
**Level**: WARN
**Logged When**: Form validation fails or rate limit exceeded

```json
{
  "timestamp": "ISO8601",
  "level": "WARN",
  "event": "validation_failed",
  "ip": "x.x.x.x",
  "details": {
    "error": "missing_resume_file",
    "fullName": "J*** D***",
    "email": "joh**********"
  }
}
```

### 6. Data Saved
**Event**: `data_saved`
**Level**: INFO
**Logged When**: Application data or resume successfully saved

```json
{
  "timestamp": "ISO8601",
  "level": "INFO",
  "event": "data_saved",
  "details": {
    "type": "application",
    "identifier": "ACE-2025-XXXXX",
    "filename": "ACE-2025-XXXXX.json",
    "timestamp": "ISO8601"
  }
}
```

### 7. Data Save Failed
**Event**: `data_save_failed`
**Level**: ERROR
**Logged When**: Data save operation fails

```json
{
  "timestamp": "ISO8601",
  "level": "ERROR",
  "event": "data_save_failed",
  "details": {
    "type": "application",
    "error": "Error message",
    "applicationId": "ACE-2025-XXXXX"
  }
}
```

## PII Masking Rules

The logging system automatically masks PII to protect applicant privacy:

### Email Addresses
- Shows first 3 characters + asterisks
- Example: `john.doe@example.com` → `joh**********`

### Phone Numbers
- Shows first 3 characters + asterisks
- Example: `555-123-4567` → `555**********`

### Full Names
- Shows first initial of first name + first initial of last name
- Example: `John Doe Smith` → `J*** S***`

### LinkedIn URLs
- Shows hostname only
- Example: `https://linkedin.com/in/johndoe` → `linkedin.com/***`

## Usage Examples

### In API Routes

```typescript
import { logger, getClientIP } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);

  try {
    // Your code here

    // Log success
    await logger.applicationSubmitted(
      applicationId,
      clientIP,
      {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
      }
    );

  } catch (error) {
    // Log error
    await logger.applicationFailed(
      error.message,
      clientIP,
      { errorStack: error.stack }
    );
  }
}
```

### In Storage Operations

```typescript
import { logger } from '@/lib/logger';

export async function saveApplicationData(data: ApplicationData) {
  try {
    // Save operation
    await fs.writeFile(filepath, JSON.stringify(data));

    // Log success
    await logger.dataSaved('application', data.applicationId, {
      filename: filepath,
      timestamp: data.timestamp,
    });
  } catch (error) {
    // Log failure
    await logger.dataSaveFailed('application', error.message, {
      applicationId: data.applicationId,
    });
    throw error;
  }
}
```

## Log Analysis

### Parse Logs with jq

```bash
# Get all ERROR level logs
cat data/logs/app-2025-10-21.log | jq 'select(.level == "ERROR")'

# Count events by type
cat data/logs/app-2025-10-21.log | jq -r '.event' | sort | uniq -c

# Get all logs for a specific application
cat data/logs/app-2025-10-21.log | jq 'select(.applicationId == "ACE-2025-XXXXX")'

# Get all logs from a specific IP
cat data/logs/app-2025-10-21.log | jq 'select(.ip == "192.168.1.100")'

# Count applications submitted today
cat data/logs/app-2025-10-21.log | jq 'select(.event == "application_submitted")' | wc -l
```

### Parse Logs with Python

```python
import json

def analyze_logs(filepath):
    events = {}
    errors = []

    with open(filepath, 'r') as f:
        for line in f:
            entry = json.loads(line)

            # Count events
            event = entry['event']
            events[event] = events.get(event, 0) + 1

            # Collect errors
            if entry['level'] == 'ERROR':
                errors.append(entry)

    print(f"Event Summary: {events}")
    print(f"Total Errors: {len(errors)}")
    return events, errors

events, errors = analyze_logs('data/logs/app-2025-10-21.log')
```

## Log Rotation and Cleanup

Logs are automatically organized by date. To clean up old logs:

```typescript
import { cleanupOldLogs } from '@/lib/logger';

// Delete logs older than 30 days
await cleanupOldLogs(30);
```

Or manually:

```bash
# Delete logs older than 30 days
find data/logs -name "app-*.log" -mtime +30 -delete
```

## Security Considerations

1. **PII Protection**: All PII is automatically masked before logging
2. **File Permissions**: Ensure log directory has restricted permissions (700 or 750)
3. **Log Access**: Limit access to log files to authorized personnel only
4. **Data Retention**: Implement log retention policies (e.g., 30-90 days)
5. **No Sensitive Data**: Never log passwords, tokens, or other secrets

## Environment Variables

```bash
# Disable file logging (logs to console only)
LOGGING_DISABLED=true

# Custom log directory
LOG_DIR=/custom/path/to/logs
```

## Monitoring and Alerting

Consider setting up automated monitoring for:

- High error rates
- Repeated validation failures from same IP
- Unusual file upload patterns
- Application submission spikes

## Troubleshooting

### Logs Not Being Written

1. Check directory permissions: `ls -la data/logs`
2. Verify disk space: `df -h`
3. Check console for error messages
4. Ensure `data/logs` directory exists

### Large Log Files

If log files grow too large:

1. Implement more aggressive rotation (daily → hourly)
2. Set up log compression
3. Archive old logs to cold storage
4. Adjust log retention period

## Integration Points

The logging system is integrated at:

1. **API Route** (`app/api/submit-application/route.ts`):
   - Application submissions
   - Rate limit violations
   - Validation failures
   - General errors

2. **Storage Module** (`lib/storage.ts`):
   - File operations
   - Directory creation
   - Data persistence

## Best Practices

1. **Always log critical operations**: Application submissions, errors, security events
2. **Use appropriate log levels**: INFO for normal operations, WARN for anomalies, ERROR for failures
3. **Include context**: Always include relevant IDs, timestamps, and IP addresses
4. **Sanitize data**: Let the system handle PII masking automatically
5. **Monitor logs regularly**: Set up automated analysis and alerting
6. **Rotate logs**: Don't let logs grow indefinitely
7. **Secure access**: Protect log files with proper permissions

## Example Log Output

```
data/logs/app-2025-10-21.log:
```

```json
{"timestamp":"2025-10-21T12:00:00.000Z","level":"INFO","event":"application_submitted","ip":"192.168.1.100","applicationId":"ACE-2025-EXAMPLE1","details":{"fullName":"J*** S***","email":"joh**********","phone":"555**********","resumeFilename":"resume.pdf","resumeSize":1024000}}
{"timestamp":"2025-10-21T12:01:00.000Z","level":"INFO","event":"file_uploaded","ip":"192.168.1.100","applicationId":"ACE-2025-EXAMPLE1","details":{"filename":"resume.pdf","size":1024000}}
{"timestamp":"2025-10-21T12:02:00.000Z","level":"WARN","event":"validation_failed","ip":"192.168.1.101","details":{"error":"missing_resume_file","fullName":"J*** D***","email":"jan**********"}}
{"timestamp":"2025-10-21T12:03:00.000Z","level":"ERROR","event":"application_failed","ip":"192.168.1.102","details":{"error":"Database connection timeout","errorStack":"Error: Connection timeout at line 123"}}
```

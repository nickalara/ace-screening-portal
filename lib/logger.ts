import { promises as fs } from 'fs';
import path from 'path';

// Log levels
export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

// Event types for structured logging
export enum LogEvent {
  APPLICATION_SUBMITTED = 'application_submitted',
  APPLICATION_FAILED = 'application_failed',
  FILE_UPLOADED = 'file_uploaded',
  FILE_UPLOAD_FAILED = 'file_upload_failed',
  VALIDATION_FAILED = 'validation_failed',
  DATA_SAVED = 'data_saved',
  DATA_SAVE_FAILED = 'data_save_failed',
  DIRECTORY_CREATED = 'directory_created',
  DIRECTORY_CREATE_FAILED = 'directory_create_failed',
}

// Log entry structure
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  event: LogEvent;
  ip?: string;
  applicationId?: string;
  details: Record<string, any>;
}

// PII Masking utility
export function maskPII(value: string, visibleChars: number = 3): string {
  if (!value || value.length <= visibleChars) {
    return '***';
  }
  return value.substring(0, visibleChars) + '*'.repeat(Math.min(value.length - visibleChars, 10));
}

// PII-safe data sanitization
export function sanitizeLogData(data: Record<string, any>): Record<string, any> {
  const sanitized = { ...data };

  // Mask email addresses
  if (sanitized.email && typeof sanitized.email === 'string') {
    sanitized.email = maskPII(sanitized.email, 3);
  }

  // Mask phone numbers
  if (sanitized.phone && typeof sanitized.phone === 'string') {
    sanitized.phone = maskPII(sanitized.phone, 3);
  }

  // Mask full name
  if (sanitized.fullName && typeof sanitized.fullName === 'string') {
    const parts = sanitized.fullName.split(' ');
    if (parts.length > 0) {
      sanitized.fullName = parts[0].substring(0, 1) + '*** ' + (parts.length > 1 ? parts[parts.length - 1].substring(0, 1) + '***' : '');
    }
  }

  // Mask LinkedIn URLs (keep domain only)
  if (sanitized.linkedin && typeof sanitized.linkedin === 'string') {
    try {
      const url = new URL(sanitized.linkedin);
      sanitized.linkedin = url.hostname + '/***';
    } catch {
      sanitized.linkedin = '***';
    }
  }

  return sanitized;
}

// Get log directory and filename
function getLogPath(): { dir: string; filename: string } {
  const logsDir = path.join(process.cwd(), 'data', 'logs');
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const filename = `app-${dateStr}.log`;

  return { dir: logsDir, filename };
}

// Ensure log directory exists
async function ensureLogDirectory(): Promise<string> {
  const { dir } = getLogPath();
  try {
    await fs.mkdir(dir, { recursive: true });
    return dir;
  } catch (error) {
    console.error('Failed to create log directory:', error);
    throw error;
  }
}

// Write log entry to file
async function writeLogEntry(entry: LogEntry): Promise<void> {
  // Skip file logging during build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return;
  }

  try {
    await ensureLogDirectory();
    const { dir, filename } = getLogPath();
    const logPath = path.join(dir, filename);

    // Format as JSON line (newline-delimited JSON for easy parsing)
    const logLine = JSON.stringify(entry) + '\n';

    // Append to log file
    await fs.appendFile(logPath, logLine, 'utf-8');
  } catch (error) {
    // Fallback to console if file logging fails
    console.error('Failed to write log entry to file:', error);
    console.log('Log entry (console fallback):', JSON.stringify(entry));
  }
}

// Main logging function
export async function log(
  level: LogLevel,
  event: LogEvent,
  details: Record<string, any> = {},
  options: { ip?: string; applicationId?: string; sanitize?: boolean } = {}
): Promise<void> {
  const { ip, applicationId, sanitize = true } = options;

  // Sanitize PII if enabled
  const logDetails = sanitize ? sanitizeLogData(details) : details;

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...(ip && { ip }),
    ...(applicationId && { applicationId }),
    details: logDetails,
  };

  // Write to file asynchronously (don't block on logging)
  writeLogEntry(entry).catch((error) => {
    console.error('Async log write failed:', error);
  });

  // Also log to console in development
  if (process.env.NODE_ENV !== 'production') {
    const consoleMethod = level === LogLevel.ERROR ? console.error : level === LogLevel.WARN ? console.warn : console.log;
    consoleMethod(`[${entry.timestamp}] ${level} - ${event}`, entry);
  }
}

// Convenience methods for different log levels
export const logger = {
  info: (event: LogEvent, details?: Record<string, any>, options?: { ip?: string; applicationId?: string; sanitize?: boolean }) =>
    log(LogLevel.INFO, event, details, options),

  warn: (event: LogEvent, details?: Record<string, any>, options?: { ip?: string; applicationId?: string; sanitize?: boolean }) =>
    log(LogLevel.WARN, event, details, options),

  error: (event: LogEvent, details?: Record<string, any>, options?: { ip?: string; applicationId?: string; sanitize?: boolean }) =>
    log(LogLevel.ERROR, event, details, options),

  // Special methods for common events
  applicationSubmitted: (applicationId: string, ip?: string, details?: Record<string, any>) =>
    log(LogLevel.INFO, LogEvent.APPLICATION_SUBMITTED, details, { applicationId, ip, sanitize: true }),

  applicationFailed: (error: string, ip?: string, details?: Record<string, any>) =>
    log(LogLevel.ERROR, LogEvent.APPLICATION_FAILED, { error, ...details }, { ip, sanitize: true }),

  fileUploaded: (applicationId: string, filename: string, size: number, ip?: string) =>
    log(LogLevel.INFO, LogEvent.FILE_UPLOADED, { filename, size }, { applicationId, ip, sanitize: false }),

  fileUploadFailed: (error: string, filename?: string, ip?: string) =>
    log(LogLevel.ERROR, LogEvent.FILE_UPLOAD_FAILED, { error, filename }, { ip, sanitize: false }),

  validationFailed: (errors: Record<string, any>, ip?: string) =>
    log(LogLevel.WARN, LogEvent.VALIDATION_FAILED, { errors }, { ip, sanitize: true }),

  dataSaved: (type: string, identifier: string, details?: Record<string, any>) =>
    log(LogLevel.INFO, LogEvent.DATA_SAVED, { type, identifier, ...details }, { sanitize: false }),

  dataSaveFailed: (type: string, error: string, details?: Record<string, any>) =>
    log(LogLevel.ERROR, LogEvent.DATA_SAVE_FAILED, { type, error, ...details }, { sanitize: false }),
};

// Utility to extract IP address from request
export function getClientIP(request: Request): string {
  // Check common headers for IP address
  const headers = request.headers;

  // Try X-Forwarded-For (common with proxies/load balancers)
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  // Try X-Real-IP
  const realIP = headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Try CF-Connecting-IP (Cloudflare)
  const cfIP = headers.get('cf-connecting-ip');
  if (cfIP) {
    return cfIP;
  }

  // Fallback
  return 'unknown';
}

// Log rotation cleanup utility (optional - can be called via cron job)
export async function cleanupOldLogs(daysToKeep: number = 30): Promise<void> {
  try {
    const { dir } = getLogPath();
    const files = await fs.readdir(dir);
    const now = Date.now();
    const maxAge = daysToKeep * 24 * 60 * 60 * 1000; // Convert days to milliseconds

    for (const file of files) {
      if (!file.endsWith('.log')) continue;

      const filePath = path.join(dir, file);
      const stats = await fs.stat(filePath);
      const age = now - stats.mtime.getTime();

      if (age > maxAge) {
        await fs.unlink(filePath);
        console.log(`Deleted old log file: ${file}`);
      }
    }
  } catch (error) {
    console.error('Error cleaning up old logs:', error);
  }
}

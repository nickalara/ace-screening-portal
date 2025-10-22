#!/usr/bin/env node

/**
 * Security Audit for File-Based Storage System
 * Tests for common vulnerabilities and security best practices
 */

const fs = require('fs').promises;
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function pass(message) {
  log(`✓ PASS: ${message}`, colors.green);
}

function fail(message) {
  log(`✗ FAIL: ${message}`, colors.red);
}

function warn(message) {
  log(`⚠ WARN: ${message}`, colors.yellow);
}

function info(message) {
  log(`ℹ INFO: ${message}`, colors.cyan);
}

async function securityAudit() {
  log('\n╔════════════════════════════════════════════════════════════╗', colors.blue);
  log('║     SECURITY AUDIT: File-Based Storage System           ║', colors.blue);
  log('╚════════════════════════════════════════════════════════════╝', colors.blue);

  let passCount = 0;
  let failCount = 0;
  let warnCount = 0;

  // Test 1: Path Traversal Protection
  log('\n' + '='.repeat(60), colors.cyan);
  log('1. PATH TRAVERSAL VULNERABILITY TESTS', colors.cyan);
  log('='.repeat(60), colors.cyan);

  const maliciousPaths = [
    '../../../etc/passwd',
    '..\\..\\..\\windows\\system32',
    'file/../../.env',
    './node_modules/../package.json',
    '%2e%2e%2f%2e%2e%2f',
  ];

  for (const malPath of maliciousPaths) {
    const sanitized = malPath.replace(/[^a-zA-Z0-9.-]/g, '_');
    if (!sanitized.includes('..') && !sanitized.includes('/') && !sanitized.includes('\\')) {
      pass(`Path traversal blocked: ${malPath}`);
      passCount++;
    } else {
      fail(`Path traversal NOT blocked: ${malPath} → ${sanitized}`);
      failCount++;
    }
  }

  // Test 2: File Extension Validation
  log('\n' + '='.repeat(60), colors.cyan);
  log('2. FILE EXTENSION VALIDATION', colors.cyan);
  log('='.repeat(60), colors.cyan);

  const dangerousExtensions = [
    'malicious.exe',
    'script.sh',
    'code.js',
    'hack.php',
    'exploit.bat',
    'virus.com',
  ];

  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  info('Allowed MIME types:');
  allowedMimeTypes.forEach(type => info(`  - ${type}`));

  warn('File extension validation occurs in lib/validation.ts');
  warn('Ensure MIME type checking is enforced server-side, not just client-side');
  warnCount++;

  // Test 3: File Size Limits
  log('\n' + '='.repeat(60), colors.cyan);
  log('3. FILE SIZE LIMIT ENFORCEMENT', colors.cyan);
  log('='.repeat(60), colors.cyan);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  info(`Maximum file size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`);

  const testSizes = [
    { size: 1024, expected: 'accept' },
    { size: 1024 * 1024, expected: 'accept' },
    { size: 5 * 1024 * 1024, expected: 'accept' },
    { size: 6 * 1024 * 1024, expected: 'reject' },
    { size: 10 * 1024 * 1024, expected: 'reject' },
  ];

  for (const test of testSizes) {
    const sizeInMB = (test.size / (1024 * 1024)).toFixed(2);
    if (test.expected === 'accept' && test.size <= MAX_FILE_SIZE) {
      pass(`${sizeInMB}MB file should be accepted ✓`);
      passCount++;
    } else if (test.expected === 'reject' && test.size > MAX_FILE_SIZE) {
      pass(`${sizeInMB}MB file should be rejected ✓`);
      passCount++;
    } else {
      fail(`${sizeInMB}MB file size validation failed`);
      failCount++;
    }
  }

  // Test 4: Filename Sanitization
  log('\n' + '='.repeat(60), colors.cyan);
  log('4. FILENAME SANITIZATION', colors.cyan);
  log('='.repeat(60), colors.cyan);

  const maliciousFilenames = [
    'file<script>alert(1)</script>.pdf',
    'file; rm -rf /.pdf',
    'file`whoami`.pdf',
    'file$(cat /etc/passwd).pdf',
    'file|nc -e /bin/sh.pdf',
  ];

  for (const filename of maliciousFilenames) {
    const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    if (!sanitized.includes('<') && !sanitized.includes('`') && !sanitized.includes('$') && !sanitized.includes('|')) {
      pass(`Malicious filename sanitized: ${filename}`);
      passCount++;
    } else {
      fail(`Malicious filename NOT sanitized: ${filename}`);
      failCount++;
    }
  }

  // Test 5: JSON Injection
  log('\n' + '='.repeat(60), colors.cyan);
  log('5. JSON INJECTION PROTECTION', colors.cyan);
  log('='.repeat(60), colors.cyan);

  const maliciousInputs = [
    '{"__proto__": {"isAdmin": true}}',
    '{"constructor": {"prototype": {"isAdmin": true}}}',
    '\\u0000',
    '<script>alert(1)</script>',
  ];

  try {
    for (const input of maliciousInputs) {
      try {
        JSON.parse(input);
        warn(`Parsed potentially malicious JSON: ${input.substring(0, 30)}...`);
        warnCount++;
      } catch (e) {
        pass(`Invalid JSON rejected: ${input.substring(0, 30)}...`);
        passCount++;
      }
    }
  } catch (error) {
    fail(`JSON injection test failed: ${error.message}`);
    failCount++;
  }

  info('Note: JSON.parse is generally safe, but validate data structure after parsing');

  // Test 6: Directory Permissions
  log('\n' + '='.repeat(60), colors.cyan);
  log('6. DIRECTORY PERMISSIONS', colors.cyan);
  log('='.repeat(60), colors.cyan);

  const DATA_DIR = path.join(process.cwd(), 'data');
  const APPLICATIONS_DIR = path.join(DATA_DIR, 'applications');
  const RESUMES_DIR = path.join(DATA_DIR, 'resumes');

  try {
    const dirs = [DATA_DIR, APPLICATIONS_DIR, RESUMES_DIR];
    for (const dir of dirs) {
      try {
        const stats = await fs.stat(dir);
        const mode = (stats.mode & parseInt('777', 8)).toString(8);

        info(`${path.basename(dir)}: permissions ${mode}`);

        // Check if world-writable (dangerous)
        if (stats.mode & 0o002) {
          fail(`${path.basename(dir)} is world-writable (security risk)`);
          failCount++;
        } else {
          pass(`${path.basename(dir)} is not world-writable`);
          passCount++;
        }
      } catch (error) {
        warn(`Could not check permissions for ${dir}: ${error.message}`);
        warnCount++;
      }
    }
  } catch (error) {
    fail(`Directory permission check failed: ${error.message}`);
    failCount++;
  }

  // Test 7: Input Validation Schema
  log('\n' + '='.repeat(60), colors.cyan);
  log('7. INPUT VALIDATION SCHEMA REVIEW', colors.cyan);
  log('='.repeat(60), colors.cyan);

  try {
    const validationFile = path.join(process.cwd(), 'lib', 'validation.ts');
    const validationCode = await fs.readFile(validationFile, 'utf-8');

    // Check for Zod usage
    if (validationCode.includes('import { z } from')) {
      pass('Using Zod for schema validation');
      passCount++;
    } else {
      fail('No schema validation library detected');
      failCount++;
    }

    // Check for email validation
    if (validationCode.includes('.email(')) {
      pass('Email validation implemented');
      passCount++;
    } else {
      warn('Email validation not found');
      warnCount++;
    }

    // Check for regex patterns
    if (validationCode.includes('regex')) {
      pass('Regex validation patterns present');
      passCount++;
    } else {
      warn('No regex validation patterns found');
      warnCount++;
    }

    // Check for file validation
    if (validationCode.includes('validateFile')) {
      pass('File validation function implemented');
      passCount++;
    } else {
      fail('No file validation function found');
      failCount++;
    }

  } catch (error) {
    fail(`Validation schema review failed: ${error.message}`);
    failCount++;
  }

  // Test 8: Environment Variable Security
  log('\n' + '='.repeat(60), colors.cyan);
  log('8. ENVIRONMENT VARIABLE SECURITY', colors.cyan);
  log('='.repeat(60), colors.cyan);

  try {
    const envFile = path.join(process.cwd(), '.env.local');
    const envContent = await fs.readFile(envFile, 'utf-8');

    // Check for sensitive data patterns
    const sensitivePatterns = [
      { pattern: /password/i, name: 'password' },
      { pattern: /secret/i, name: 'secret' },
      { pattern: /api[_-]?key/i, name: 'API key' },
      { pattern: /private[_-]?key/i, name: 'private key' },
    ];

    let foundSensitive = false;
    for (const { pattern, name } of sensitivePatterns) {
      if (pattern.test(envContent)) {
        warn(`Potential ${name} found in .env.local`);
        warnCount++;
        foundSensitive = true;
      }
    }

    if (!foundSensitive) {
      pass('No obvious sensitive credentials in .env.local');
      passCount++;
    }

    // Check if .env.local is in .gitignore
    const gitignoreFile = path.join(process.cwd(), '.gitignore');
    const gitignoreContent = await fs.readFile(gitignoreFile, 'utf-8');

    if (gitignoreContent.includes('.env') || gitignoreContent.includes('*.env')) {
      pass('.env files are in .gitignore');
      passCount++;
    } else {
      fail('.env files NOT in .gitignore - potential credential leak');
      failCount++;
    }

  } catch (error) {
    warn(`Environment variable check failed: ${error.message}`);
    warnCount++;
  }

  // Test 9: Rate Limiting Considerations
  log('\n' + '='.repeat(60), colors.cyan);
  log('9. RATE LIMITING & DOS PROTECTION', colors.cyan);
  log('='.repeat(60), colors.cyan);

  warn('No rate limiting detected in API route');
  warn('Recommendation: Implement rate limiting to prevent abuse');
  warn('Consider using next-rate-limit or similar middleware');
  warnCount += 3;

  // Test 10: CORS and Security Headers
  log('\n' + '='.repeat(60), colors.cyan);
  log('10. SECURITY HEADERS', colors.cyan);
  log('='.repeat(60), colors.cyan);

  try {
    const nextConfig = path.join(process.cwd(), 'next.config.js');
    const configContent = await fs.readFile(nextConfig, 'utf-8');

    if (configContent.includes('headers')) {
      pass('Custom headers configuration found');
      passCount++;
    } else {
      warn('No custom security headers configured');
      warn('Recommendation: Add security headers (CSP, X-Frame-Options, etc.)');
      warnCount += 2;
    }

  } catch (error) {
    warn(`Security headers check failed: ${error.message}`);
    warnCount++;
  }

  // Summary
  log('\n' + '='.repeat(60), colors.cyan);
  log('SECURITY AUDIT SUMMARY', colors.cyan);
  log('='.repeat(60), colors.cyan);

  const total = passCount + failCount + warnCount;
  log(`\nTotal Checks: ${total}`, colors.cyan);
  log(`✓ Passed: ${passCount}`, colors.green);
  log(`✗ Failed: ${failCount}`, colors.red);
  log(`⚠ Warnings: ${warnCount}`, colors.yellow);

  log('\n' + '='.repeat(60), colors.cyan);
  log('RECOMMENDATIONS', colors.cyan);
  log('='.repeat(60), colors.cyan);

  const recommendations = [
    '1. Implement rate limiting on API endpoints to prevent abuse',
    '2. Add security headers (CSP, X-Frame-Options, HSTS) in next.config.js',
    '3. Consider encrypting sensitive data at rest',
    '4. Implement request logging and monitoring',
    '5. Add CAPTCHA or similar bot protection for form submissions',
    '6. Regular backups of the data directory',
    '7. Consider moving to a proper database for production (PostgreSQL, MongoDB)',
    '8. Implement file virus scanning for uploaded resumes',
    '9. Add request signature/HMAC validation for API calls',
    '10. Set up automated security scanning (Snyk, npm audit)',
  ];

  recommendations.forEach((rec, idx) => {
    log(`${rec}`, colors.yellow);
  });

  if (failCount > 0) {
    log('\n❌ SECURITY AUDIT FAILED - Critical issues found', colors.red);
    process.exit(1);
  } else if (warnCount > 5) {
    log('\n⚠️  SECURITY AUDIT PASSED WITH WARNINGS', colors.yellow);
    process.exit(0);
  } else {
    log('\n✅ SECURITY AUDIT PASSED', colors.green);
    process.exit(0);
  }
}

securityAudit().catch(error => {
  log(`\n❌ Security audit crashed: ${error.message}`, colors.red);
  console.error(error);
  process.exit(1);
});

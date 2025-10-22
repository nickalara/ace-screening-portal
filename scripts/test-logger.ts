/**
 * Test script for audit logging system
 *
 * Run with: npx ts-node scripts/test-logger.ts
 */

import { logger, LogEvent, maskPII, sanitizeLogData } from '../lib/logger';

async function testLoggingSystem() {
  console.log('Testing Audit Logging System...\n');

  // Test 1: PII Masking
  console.log('Test 1: PII Masking');
  console.log('Original email: john.doe@example.com');
  console.log('Masked email:', maskPII('john.doe@example.com', 3));
  console.log('Original phone: 555-123-4567');
  console.log('Masked phone:', maskPII('555-123-4567', 3));
  console.log('');

  // Test 2: Data Sanitization
  console.log('Test 2: Data Sanitization');
  const testData = {
    fullName: 'John Doe Smith',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    linkedin: 'https://linkedin.com/in/johndoe',
    otherField: 'This should not be masked'
  };
  console.log('Original data:', testData);
  console.log('Sanitized data:', sanitizeLogData(testData));
  console.log('');

  // Test 3: Application Submitted Log
  console.log('Test 3: Application Submitted Log');
  await logger.applicationSubmitted(
    'ACE-2025-TEST001',
    '192.168.1.1',
    {
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '555-987-6543',
      resumeFilename: 'jane_smith_resume.pdf',
      resumeSize: 1024000,
    }
  );
  console.log('Logged application submission');
  console.log('');

  // Test 4: File Upload Log
  console.log('Test 4: File Upload Log');
  await logger.fileUploaded(
    'ACE-2025-TEST002',
    'test_resume.pdf',
    2048000,
    '10.0.0.1'
  );
  console.log('Logged file upload');
  console.log('');

  // Test 5: Validation Failed Log
  console.log('Test 5: Validation Failed Log');
  await logger.validationFailed(
    {
      error: 'missing_required_field',
      field: 'email',
      fullName: 'Test User',
      email: 'invalid-email',
    },
    '172.16.0.1'
  );
  console.log('Logged validation failure');
  console.log('');

  // Test 6: Application Failed Log
  console.log('Test 6: Application Failed Log');
  await logger.applicationFailed(
    'Database connection timeout',
    '192.168.100.50',
    {
      errorStack: 'Error: Connection timeout at line 123',
    }
  );
  console.log('Logged application failure');
  console.log('');

  // Test 7: Data Saved Log
  console.log('Test 7: Data Saved Log');
  await logger.dataSaved('application', 'ACE-2025-TEST003', {
    filename: 'ACE-2025-TEST003.json',
    timestamp: new Date().toISOString(),
  });
  console.log('Logged data save');
  console.log('');

  console.log('All tests completed! Check data/logs/ directory for log files.');
  console.log('Log file format: app-YYYY-MM-DD.log');
}

// Run tests
testLoggingSystem().catch(console.error);

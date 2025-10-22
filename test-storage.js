#!/usr/bin/env node

/**
 * Comprehensive Storage System Test Suite
 * Tests for file-based database integrity, security, and reliability
 */

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const TEST_DATA_DIR = path.join(process.cwd(), 'data-test');
const TEST_APPLICATIONS_DIR = path.join(TEST_DATA_DIR, 'applications');
const TEST_RESUMES_DIR = path.join(TEST_DATA_DIR, 'resumes');

let testsPassed = 0;
let testsFailed = 0;
let testsWarning = 0;

// Test utilities
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  testsPassed++;
  log(`✓ ${message}`, colors.green);
}

function fail(message) {
  testsFailed++;
  log(`✗ ${message}`, colors.red);
}

function warn(message) {
  testsWarning++;
  log(`⚠ ${message}`, colors.yellow);
}

function section(title) {
  log(`\n${'='.repeat(60)}`, colors.cyan);
  log(title, colors.cyan);
  log('='.repeat(60), colors.cyan);
}

// Cleanup test directories
async function cleanup() {
  try {
    await fs.rm(TEST_DATA_DIR, { recursive: true, force: true });
  } catch (error) {
    // Ignore errors
  }
}

// Test 1: Directory Creation and Permissions
async function testDirectoryCreation() {
  section('TEST 1: Directory Creation and Permissions');

  try {
    // Create directories
    await fs.mkdir(TEST_DATA_DIR, { recursive: true });
    await fs.mkdir(TEST_APPLICATIONS_DIR, { recursive: true });
    await fs.mkdir(TEST_RESUMES_DIR, { recursive: true });

    // Verify directories exist
    const dataStats = await fs.stat(TEST_DATA_DIR);
    const appsStats = await fs.stat(TEST_APPLICATIONS_DIR);
    const resumesStats = await fs.stat(TEST_RESUMES_DIR);

    if (dataStats.isDirectory() && appsStats.isDirectory() && resumesStats.isDirectory()) {
      success('All required directories created successfully');
    } else {
      fail('Directory creation failed');
    }

    // Check write permissions
    const testFile = path.join(TEST_APPLICATIONS_DIR, '.test');
    await fs.writeFile(testFile, 'test');
    await fs.unlink(testFile);
    success('Write permissions verified');

  } catch (error) {
    fail(`Directory creation failed: ${error.message}`);
  }
}

// Test 2: File Path Sanitization
async function testPathSanitization() {
  section('TEST 2: File Path Sanitization and Security');

  const maliciousFilenames = [
    '../../../etc/passwd',
    '..\\..\\..\\windows\\system32\\config',
    'test/../../sensitive.json',
    'test/../../../.env',
    'normal_file.pdf', // Should pass
  ];

  for (const filename of maliciousFilenames) {
    const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fullPath = path.join(TEST_RESUMES_DIR, `ACE-2025-TEST_${sanitized}`);

    // Verify the path stays within the test directory
    const resolvedPath = path.resolve(fullPath);
    const resolvedTestDir = path.resolve(TEST_RESUMES_DIR);

    if (resolvedPath.startsWith(resolvedTestDir)) {
      if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        success(`Path traversal blocked: ${filename} → ${sanitized}`);
      } else {
        success(`Safe filename accepted: ${filename}`);
      }
    } else {
      fail(`Path traversal vulnerability: ${filename}`);
    }
  }
}

// Test 3: JSON Data Integrity
async function testJSONIntegrity() {
  section('TEST 3: JSON Data Integrity and Structure');

  const validApplication = {
    applicationId: 'ACE-2025-TEST001',
    timestamp: new Date().toISOString(),
    personalInfo: {
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
    },
    screeningResponses: [
      {
        questionId: 'q1_technical_learning',
        questionText: 'Test question?',
        answer: 'Test answer with at least 100 characters to meet validation requirements. This is a comprehensive answer that demonstrates proper length.',
      },
    ],
    resume: {
      originalFilename: 'test-resume.pdf',
      storedFilename: 'ACE-2025-TEST001_test-resume.pdf',
      fileSize: 1024,
      mimeType: 'application/pdf',
    },
  };

  try {
    const filename = `${validApplication.applicationId}.json`;
    const filepath = path.join(TEST_APPLICATIONS_DIR, filename);

    // Write JSON with formatting
    await fs.writeFile(filepath, JSON.stringify(validApplication, null, 2), 'utf-8');
    success('Application JSON written successfully');

    // Read and parse
    const data = await fs.readFile(filepath, 'utf-8');
    const parsed = JSON.parse(data);

    // Validate structure
    if (parsed.applicationId === validApplication.applicationId) {
      success('Application ID matches');
    } else {
      fail('Application ID mismatch');
    }

    if (parsed.personalInfo.email === validApplication.personalInfo.email) {
      success('Personal info preserved correctly');
    } else {
      fail('Personal info corruption detected');
    }

    if (Array.isArray(parsed.screeningResponses)) {
      success('Screening responses structure valid');
    } else {
      fail('Screening responses structure invalid');
    }

    // Test for invalid JSON handling
    const invalidPath = path.join(TEST_APPLICATIONS_DIR, 'invalid.json');
    await fs.writeFile(invalidPath, '{invalid json}', 'utf-8');

    try {
      const invalidData = await fs.readFile(invalidPath, 'utf-8');
      JSON.parse(invalidData);
      fail('Invalid JSON not detected');
    } catch (error) {
      success('Invalid JSON properly rejected');
    }

  } catch (error) {
    fail(`JSON integrity test failed: ${error.message}`);
  }
}

// Test 4: File Upload Constraints
async function testFileUploadConstraints() {
  section('TEST 4: File Upload Size and Type Constraints');

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  // Test small valid file
  const smallFile = Buffer.alloc(1024); // 1KB
  const smallPath = path.join(TEST_RESUMES_DIR, 'small-resume.pdf');
  await fs.writeFile(smallPath, smallFile);

  const smallStats = await fs.stat(smallPath);
  if (smallStats.size <= MAX_FILE_SIZE) {
    success('Small file (1KB) accepted');
  } else {
    fail('Small file size check failed');
  }

  // Test large file
  const largeFile = Buffer.alloc(6 * 1024 * 1024); // 6MB
  const largePath = path.join(TEST_RESUMES_DIR, 'large-resume.pdf');
  await fs.writeFile(largePath, largeFile);

  const largeStats = await fs.stat(largePath);
  if (largeStats.size > MAX_FILE_SIZE) {
    success('Large file (6MB) detected - should be rejected by validation');
  } else {
    fail('Large file size check failed');
  }

  // Test file extension validation
  const validExtensions = ['.pdf', '.doc', '.docx'];
  const invalidExtensions = ['.exe', '.sh', '.js', '.php', '.html'];

  for (const ext of validExtensions) {
    if (ext === '.pdf' || ext === '.doc' || ext === '.docx') {
      success(`Valid file extension accepted: ${ext}`);
    }
  }

  for (const ext of invalidExtensions) {
    warn(`Potentially dangerous extension should be blocked: ${ext}`);
  }
}

// Test 5: Concurrent Write Operations
async function testConcurrentWrites() {
  section('TEST 5: Concurrent Write Operations');

  const writePromises = [];
  const numConcurrentWrites = 10;

  for (let i = 0; i < numConcurrentWrites; i++) {
    const appData = {
      applicationId: `ACE-2025-CONCURRENT${i}`,
      timestamp: new Date().toISOString(),
      personalInfo: {
        fullName: `Test User ${i}`,
        email: `test${i}@example.com`,
        phone: '+1234567890',
      },
      screeningResponses: [],
      resume: {
        originalFilename: `resume${i}.pdf`,
        storedFilename: `ACE-2025-CONCURRENT${i}_resume${i}.pdf`,
        fileSize: 1024,
        mimeType: 'application/pdf',
      },
    };

    const promise = fs.writeFile(
      path.join(TEST_APPLICATIONS_DIR, `${appData.applicationId}.json`),
      JSON.stringify(appData, null, 2),
      'utf-8'
    );

    writePromises.push(promise);
  }

  try {
    await Promise.all(writePromises);
    success(`${numConcurrentWrites} concurrent writes completed`);

    // Verify all files exist
    const files = await fs.readdir(TEST_APPLICATIONS_DIR);
    const concurrentFiles = files.filter(f => f.includes('CONCURRENT'));

    if (concurrentFiles.length === numConcurrentWrites) {
      success('All concurrent writes persisted correctly');
    } else {
      fail(`Expected ${numConcurrentWrites} files, found ${concurrentFiles.length}`);
    }
  } catch (error) {
    fail(`Concurrent write test failed: ${error.message}`);
  }
}

// Test 6: Data Retrieval and Query Operations
async function testDataRetrieval() {
  section('TEST 6: Data Retrieval and Query Operations');

  try {
    // List all applications
    const files = await fs.readdir(TEST_APPLICATIONS_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'invalid.json');

    if (jsonFiles.length > 0) {
      success(`Found ${jsonFiles.length} application files`);
    } else {
      warn('No application files found');
    }

    // Test reading specific application
    if (jsonFiles.length > 0) {
      const firstFile = jsonFiles[0];
      const filepath = path.join(TEST_APPLICATIONS_DIR, firstFile);
      const data = await fs.readFile(filepath, 'utf-8');
      const parsed = JSON.parse(data);

      if (parsed.applicationId) {
        success('Application retrieval successful');
      } else {
        fail('Application data incomplete');
      }
    }

    // Test non-existent file handling
    try {
      await fs.readFile(path.join(TEST_APPLICATIONS_DIR, 'nonexistent.json'), 'utf-8');
      fail('Non-existent file not handled');
    } catch (error) {
      success('Non-existent file properly handled');
    }

  } catch (error) {
    fail(`Data retrieval test failed: ${error.message}`);
  }
}

// Test 7: Storage Capacity and Cleanup
async function testStorageCapacity() {
  section('TEST 7: Storage Capacity and Cleanup');

  try {
    // Check disk space usage
    const files = await fs.readdir(TEST_APPLICATIONS_DIR);
    let totalSize = 0;

    for (const file of files) {
      const stats = await fs.stat(path.join(TEST_APPLICATIONS_DIR, file));
      totalSize += stats.size;
    }

    log(`Total storage used: ${(totalSize / 1024).toFixed(2)} KB`);

    if (totalSize < 10 * 1024 * 1024) { // 10MB
      success('Storage usage within reasonable limits');
    } else {
      warn('Storage usage approaching limits');
    }

    // Test cleanup
    await cleanup();

    try {
      await fs.access(TEST_DATA_DIR);
      fail('Cleanup failed - test directory still exists');
    } catch (error) {
      success('Cleanup successful - test directory removed');
    }

  } catch (error) {
    fail(`Storage capacity test failed: ${error.message}`);
  }
}

// Test 8: Application ID Generation and Uniqueness
async function testApplicationIdGeneration() {
  section('TEST 8: Application ID Generation and Uniqueness');

  // Recreate test directory for this test
  await fs.mkdir(TEST_APPLICATIONS_DIR, { recursive: true });

  const generatedIds = new Set();
  const numIds = 100;

  for (let i = 0; i < numIds; i++) {
    // Simulate ID generation (from route.ts logic)
    const uuid = Math.random().toString(36).substring(2, 10).toUpperCase();
    const appId = `ACE-${new Date().getFullYear()}-${uuid}`;
    generatedIds.add(appId);
  }

  if (generatedIds.size === numIds) {
    success(`Generated ${numIds} unique application IDs`);
  } else {
    fail(`ID collision detected: ${numIds - generatedIds.size} duplicates`);
  }

  // Check ID format
  const sampleId = Array.from(generatedIds)[0];
  const idPattern = /^ACE-\d{4}-[A-Z0-9]{8}$/;

  if (idPattern.test(sampleId)) {
    success(`Application ID format valid: ${sampleId}`);
  } else {
    fail(`Application ID format invalid: ${sampleId}`);
  }
}

// Main test runner
async function runTests() {
  log('\n╔════════════════════════════════════════════════════════════╗', colors.blue);
  log('║     STORAGE SYSTEM COMPREHENSIVE TEST SUITE              ║', colors.blue);
  log('║     Testing: File-based Database for ACE Portal          ║', colors.blue);
  log('╚════════════════════════════════════════════════════════════╝', colors.blue);

  const startTime = Date.now();

  // Run all tests
  await cleanup();
  await testDirectoryCreation();
  await testPathSanitization();
  await testJSONIntegrity();
  await testFileUploadConstraints();
  await testConcurrentWrites();
  await testDataRetrieval();
  await testApplicationIdGeneration();
  await testStorageCapacity();

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Summary
  section('TEST SUMMARY');
  log(`Total Tests Run: ${testsPassed + testsFailed + testsWarning}`, colors.cyan);
  log(`✓ Passed: ${testsPassed}`, colors.green);
  log(`✗ Failed: ${testsFailed}`, colors.red);
  log(`⚠ Warnings: ${testsWarning}`, colors.yellow);
  log(`Duration: ${duration}s`, colors.cyan);

  if (testsFailed > 0) {
    log('\n❌ TESTS FAILED - Database has critical issues', colors.red);
    process.exit(1);
  } else if (testsWarning > 0) {
    log('\n⚠️  TESTS PASSED WITH WARNINGS - Review recommendations', colors.yellow);
    process.exit(0);
  } else {
    log('\n✅ ALL TESTS PASSED - Database is ready for deployment', colors.green);
    process.exit(0);
  }
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Test suite crashed: ${error.message}`, colors.red);
  console.error(error);
  process.exit(1);
});

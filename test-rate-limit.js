/**
 * Rate Limiting Test Script
 *
 * This script tests the rate limiting implementation by simulating multiple
 * requests to the submit-application API endpoint.
 *
 * Usage: node test-rate-limit.js [base-url]
 * Example: node test-rate-limit.js http://localhost:3000
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = process.argv[2] || 'http://localhost:3000';
const API_ENDPOINT = `${BASE_URL}/api/submit-application`;
const NUM_REQUESTS = 15; // Exceed the limit of 10

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Create a mock resume file
function createMockResume() {
  const content = 'Mock Resume Content\nJohn Doe\nSoftware Engineer';
  return new Blob([content], { type: 'text/plain' });
}

// Create mock application data
function createMockApplicationData() {
  return {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-0123',
    linkedin: 'https://linkedin.com/in/johndoe',
    usAuthorized: 'yes',
    securityClearance: 'yes',
    clearanceLevel: 'Secret',
    currentLocation: 'Arlington, VA',
    relocationWilling: 'yes',
    inPersonAvailability: 'yes',
    compRequirements: '150000',
    noticePeriod: '2-weeks',
    availableStartDate: '2025-11-01',
  };
}

// Send a single request
async function sendRequest(requestNumber) {
  try {
    const formData = new FormData();

    // Add application data
    formData.append('data', JSON.stringify(createMockApplicationData()));

    // Add resume file
    const resume = createMockResume();
    formData.append('resume', resume, 'test-resume.txt');

    const startTime = Date.now();
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    const duration = Date.now() - startTime;
    const data = await response.json();

    // Extract rate limit headers
    const rateLimitHeaders = {
      limit: response.headers.get('X-RateLimit-Limit'),
      remaining: response.headers.get('X-RateLimit-Remaining'),
      reset: response.headers.get('X-RateLimit-Reset'),
      retryAfter: response.headers.get('Retry-After'),
    };

    return {
      requestNumber,
      status: response.status,
      statusText: response.statusText,
      duration,
      data,
      rateLimitHeaders,
    };
  } catch (error) {
    return {
      requestNumber,
      error: error.message,
    };
  }
}

// Main test function
async function runTest() {
  log('\n========================================', 'cyan');
  log('Rate Limiting Test', 'cyan');
  log('========================================', 'cyan');
  log(`API Endpoint: ${API_ENDPOINT}`, 'blue');
  log(`Number of Requests: ${NUM_REQUESTS}`, 'blue');
  log(`Expected Limit: 10 requests per 10 minutes`, 'blue');
  log('========================================\n', 'cyan');

  const results = [];
  let successCount = 0;
  let rateLimitedCount = 0;
  let errorCount = 0;

  // Send requests sequentially to better observe rate limiting
  for (let i = 1; i <= NUM_REQUESTS; i++) {
    log(`Sending request ${i}/${NUM_REQUESTS}...`, 'yellow');
    const result = await sendRequest(i);
    results.push(result);

    if (result.error) {
      log(`  ✗ Error: ${result.error}`, 'red');
      errorCount++;
    } else if (result.status === 429) {
      log(`  ✗ Rate Limited (429) - Retry After: ${result.rateLimitHeaders.retryAfter}s`, 'red');
      rateLimitedCount++;
    } else if (result.status === 200) {
      log(`  ✓ Success (200) - Remaining: ${result.rateLimitHeaders.remaining}`, 'green');
      successCount++;
    } else {
      log(`  ! Unexpected status: ${result.status}`, 'yellow');
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Summary
  log('\n========================================', 'cyan');
  log('Test Results Summary', 'cyan');
  log('========================================', 'cyan');
  log(`Total Requests: ${NUM_REQUESTS}`, 'blue');
  log(`Successful: ${successCount}`, successCount > 0 ? 'green' : 'reset');
  log(`Rate Limited: ${rateLimitedCount}`, rateLimitedCount > 0 ? 'yellow' : 'reset');
  log(`Errors: ${errorCount}`, errorCount > 0 ? 'red' : 'reset');
  log('========================================\n', 'cyan');

  // Detailed results
  log('Detailed Results:', 'cyan');
  results.forEach(result => {
    if (result.error) {
      log(`Request ${result.requestNumber}: ERROR - ${result.error}`, 'red');
    } else {
      const color = result.status === 200 ? 'green' : result.status === 429 ? 'yellow' : 'red';
      log(
        `Request ${result.requestNumber}: ${result.status} - ` +
        `Remaining: ${result.rateLimitHeaders.remaining || 'N/A'} - ` +
        `Duration: ${result.duration}ms`,
        color
      );
    }
  });

  // Validation
  log('\n========================================', 'cyan');
  log('Validation', 'cyan');
  log('========================================', 'cyan');

  const expectedSuccess = 10;
  const expectedRateLimited = NUM_REQUESTS - expectedSuccess;

  if (successCount === expectedSuccess) {
    log(`✓ Correct number of successful requests (${expectedSuccess})`, 'green');
  } else {
    log(`✗ Expected ${expectedSuccess} successful requests, got ${successCount}`, 'red');
  }

  if (rateLimitedCount === expectedRateLimited) {
    log(`✓ Correct number of rate limited requests (${expectedRateLimited})`, 'green');
  } else {
    log(`✗ Expected ${expectedRateLimited} rate limited requests, got ${rateLimitedCount}`, 'red');
  }

  if (errorCount === 0) {
    log('✓ No errors occurred', 'green');
  } else {
    log(`✗ ${errorCount} errors occurred`, 'red');
  }

  const allTestsPassed =
    successCount === expectedSuccess &&
    rateLimitedCount === expectedRateLimited &&
    errorCount === 0;

  log('\n========================================', 'cyan');
  if (allTestsPassed) {
    log('RESULT: ALL TESTS PASSED ✓', 'green');
  } else {
    log('RESULT: SOME TESTS FAILED ✗', 'red');
  }
  log('========================================\n', 'cyan');

  process.exit(allTestsPassed ? 0 : 1);
}

// Check if fetch is available (Node 18+)
if (typeof fetch === 'undefined') {
  log('Error: This script requires Node.js 18+ for native fetch support', 'red');
  log('Please upgrade Node.js or use a different testing method', 'yellow');
  process.exit(1);
}

// Run the test
runTest().catch(error => {
  log(`Fatal error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

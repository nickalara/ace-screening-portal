#!/usr/bin/env node

/**
 * Production Data Validation Test
 * Validates existing data integrity and storage functions
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

function success(message) {
  log(`✓ ${message}`, colors.green);
}

function fail(message) {
  log(`✗ ${message}`, colors.red);
}

function info(message) {
  log(`ℹ ${message}`, colors.cyan);
}

async function validateProductionData() {
  log('\n╔════════════════════════════════════════════════════════════╗', colors.blue);
  log('║     PRODUCTION DATA VALIDATION TEST                      ║', colors.blue);
  log('╚════════════════════════════════════════════════════════════╝', colors.blue);

  const DATA_DIR = path.join(process.cwd(), 'data');
  const APPLICATIONS_DIR = path.join(DATA_DIR, 'applications');
  const RESUMES_DIR = path.join(DATA_DIR, 'resumes');

  log('\n' + '='.repeat(60), colors.cyan);
  log('Directory Structure Validation', colors.cyan);
  log('='.repeat(60), colors.cyan);

  try {
    // Check directories exist
    await fs.access(DATA_DIR);
    success('data/ directory exists');

    await fs.access(APPLICATIONS_DIR);
    success('data/applications/ directory exists');

    await fs.access(RESUMES_DIR);
    success('data/resumes/ directory exists');

    // Check permissions
    const dataStats = await fs.stat(DATA_DIR);
    const appsStats = await fs.stat(APPLICATIONS_DIR);
    const resumesStats = await fs.stat(RESUMES_DIR);

    if (dataStats.mode & 0o200) {
      success('data/ directory is writable');
    } else {
      fail('data/ directory is not writable');
    }

  } catch (error) {
    fail(`Directory validation failed: ${error.message}`);
    return;
  }

  log('\n' + '='.repeat(60), colors.cyan);
  log('Application Data Validation', colors.cyan);
  log('='.repeat(60), colors.cyan);

  try {
    const applicationFiles = await fs.readdir(APPLICATIONS_DIR);
    const jsonFiles = applicationFiles.filter(f => f.endsWith('.json'));

    info(`Found ${jsonFiles.length} application(s)`);

    for (const file of jsonFiles) {
      const filepath = path.join(APPLICATIONS_DIR, file);
      const data = await fs.readFile(filepath, 'utf-8');
      const application = JSON.parse(data);

      log(`\n  Validating: ${file}`, colors.yellow);

      // Validate structure
      const requiredFields = [
        'applicationId',
        'timestamp',
        'personalInfo',
        'screeningResponses',
        'resume'
      ];

      for (const field of requiredFields) {
        if (application[field]) {
          success(`    ${field}: Present`);
        } else {
          fail(`    ${field}: Missing`);
        }
      }

      // Validate personal info
      if (application.personalInfo) {
        const pi = application.personalInfo;
        info(`    Name: ${pi.fullName}`);
        info(`    Email: ${pi.email}`);
        info(`    Phone: ${pi.phone}`);

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(pi.email)) {
          success('    Email format valid');
        } else {
          fail('    Email format invalid');
        }

        // Phone validation
        if (pi.phone && pi.phone.length >= 10) {
          success('    Phone format valid');
        } else {
          fail('    Phone format invalid');
        }
      }

      // Validate screening responses
      if (Array.isArray(application.screeningResponses)) {
        success(`    Screening responses: ${application.screeningResponses.length} questions answered`);

        let validResponses = 0;
        for (const response of application.screeningResponses) {
          if (response.questionId && response.answer) {
            validResponses++;
          }
        }

        if (validResponses === application.screeningResponses.length) {
          success(`    All ${validResponses} responses valid`);
        } else {
          fail(`    Only ${validResponses}/${application.screeningResponses.length} responses valid`);
        }
      }

      // Validate resume info
      if (application.resume) {
        const resume = application.resume;
        const resumePath = path.join(RESUMES_DIR, resume.storedFilename);

        try {
          await fs.access(resumePath);
          success(`    Resume file exists: ${resume.storedFilename}`);

          const resumeStats = await fs.stat(resumePath);
          const actualSize = resumeStats.size;
          const recordedSize = resume.fileSize;

          if (actualSize === recordedSize) {
            success(`    File size matches: ${(actualSize / 1024).toFixed(2)} KB`);
          } else {
            fail(`    File size mismatch: recorded=${recordedSize}, actual=${actualSize}`);
          }

          // Check file size constraints
          const MAX_SIZE = 5 * 1024 * 1024;
          if (actualSize <= MAX_SIZE) {
            success('    File size within limits (≤5MB)');
          } else {
            fail('    File size exceeds 5MB limit');
          }

          // Validate MIME type
          const validMimeTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ];

          if (validMimeTypes.includes(resume.mimeType)) {
            success(`    MIME type valid: ${resume.mimeType}`);
          } else {
            fail(`    MIME type invalid: ${resume.mimeType}`);
          }

        } catch (error) {
          fail(`    Resume file not found: ${resume.storedFilename}`);
        }
      }

      // Validate timestamp
      if (application.timestamp) {
        try {
          const date = new Date(application.timestamp);
          if (!isNaN(date.getTime())) {
            success(`    Timestamp valid: ${date.toLocaleString()}`);
          } else {
            fail('    Timestamp invalid');
          }
        } catch (error) {
          fail('    Timestamp parsing failed');
        }
      }

      // Validate application ID format
      const idPattern = /^ACE-\d{4}-[A-F0-9]{8}$/;
      if (idPattern.test(application.applicationId)) {
        success(`    Application ID format valid: ${application.applicationId}`);
      } else {
        fail(`    Application ID format invalid: ${application.applicationId}`);
      }
    }

  } catch (error) {
    fail(`Application validation failed: ${error.message}`);
  }

  log('\n' + '='.repeat(60), colors.cyan);
  log('Resume Files Validation', colors.cyan);
  log('='.repeat(60), colors.cyan);

  try {
    const resumeFiles = await fs.readdir(RESUMES_DIR);
    info(`Found ${resumeFiles.length} resume file(s)`);

    for (const file of resumeFiles) {
      const filepath = path.join(RESUMES_DIR, file);
      const stats = await fs.stat(filepath);

      log(`\n  ${file}`, colors.yellow);
      info(`    Size: ${(stats.size / 1024).toFixed(2)} KB`);
      info(`    Modified: ${stats.mtime.toLocaleString()}`);

      // Check if file is referenced by an application
      const applicationFiles = await fs.readdir(APPLICATIONS_DIR);
      let referenced = false;

      for (const appFile of applicationFiles) {
        if (appFile.endsWith('.json')) {
          const appData = JSON.parse(
            await fs.readFile(path.join(APPLICATIONS_DIR, appFile), 'utf-8')
          );
          if (appData.resume && appData.resume.storedFilename === file) {
            referenced = true;
            success(`    Referenced by: ${appData.applicationId}`);
            break;
          }
        }
      }

      if (!referenced) {
        fail('    Orphaned file - not referenced by any application');
      }
    }

  } catch (error) {
    fail(`Resume files validation failed: ${error.message}`);
  }

  log('\n' + '='.repeat(60), colors.cyan);
  log('Storage Statistics', colors.cyan);
  log('='.repeat(60), colors.cyan);

  try {
    const applicationFiles = await fs.readdir(APPLICATIONS_DIR);
    const resumeFiles = await fs.readdir(RESUMES_DIR);

    let totalAppSize = 0;
    for (const file of applicationFiles) {
      if (file.endsWith('.json')) {
        const stats = await fs.stat(path.join(APPLICATIONS_DIR, file));
        totalAppSize += stats.size;
      }
    }

    let totalResumeSize = 0;
    for (const file of resumeFiles) {
      const stats = await fs.stat(path.join(RESUMES_DIR, file));
      totalResumeSize += stats.size;
    }

    info(`Total Applications: ${applicationFiles.filter(f => f.endsWith('.json')).length}`);
    info(`Application Data Size: ${(totalAppSize / 1024).toFixed(2)} KB`);
    info(`Total Resumes: ${resumeFiles.length}`);
    info(`Resume Data Size: ${(totalResumeSize / 1024).toFixed(2)} KB`);
    info(`Total Storage: ${((totalAppSize + totalResumeSize) / 1024).toFixed(2)} KB`);

    const estimatedCapacity = Math.floor((1024 * 1024 * 1024) / (totalAppSize + totalResumeSize));
    info(`Estimated capacity (1GB): ~${estimatedCapacity} applications`);

  } catch (error) {
    fail(`Statistics calculation failed: ${error.message}`);
  }

  log('\n' + '='.repeat(60), colors.green);
  log('✅ PRODUCTION DATA VALIDATION COMPLETE', colors.green);
  log('='.repeat(60) + '\n', colors.green);
}

validateProductionData().catch(error => {
  log(`\n❌ Validation crashed: ${error.message}`, colors.red);
  console.error(error);
  process.exit(1);
});

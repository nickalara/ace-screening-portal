import { promises as fs } from 'fs';
import path from 'path';
import { ApplicationData } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const APPLICATIONS_DIR = path.join(DATA_DIR, 'applications');
const RESUMES_DIR = path.join(DATA_DIR, 'resumes');

// Ensure directories exist
export async function ensureDirectories() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(APPLICATIONS_DIR, { recursive: true });
    await fs.mkdir(RESUMES_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating directories:', error);
    throw error;
  }
}

// Save application data as JSON
export async function saveApplicationData(data: ApplicationData): Promise<void> {
  await ensureDirectories();

  const filename = `${data.applicationId}.json`;
  const filepath = path.join(APPLICATIONS_DIR, filename);

  try {
    await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Application saved:', filepath);
  } catch (error) {
    console.error('Error saving application:', error);
    throw error;
  }
}

// Save resume file
export async function saveResumeFile(
  applicationId: string,
  file: Buffer,
  originalFilename: string,
  mimeType: string
): Promise<{ storedFilename: string; fileSize: number }> {
  await ensureDirectories();

  // Sanitize filename and add application ID prefix
  const sanitizedFilename = originalFilename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storedFilename = `${applicationId}_${sanitizedFilename}`;
  const filepath = path.join(RESUMES_DIR, storedFilename);

  try {
    await fs.writeFile(filepath, file);
    console.log('Resume saved:', filepath);

    return {
      storedFilename,
      fileSize: file.length,
    };
  } catch (error) {
    console.error('Error saving resume:', error);
    throw error;
  }
}

// Get application by ID (for future use)
export async function getApplicationById(applicationId: string): Promise<ApplicationData | null> {
  const filename = `${applicationId}.json`;
  const filepath = path.join(APPLICATIONS_DIR, filename);

  try {
    const data = await fs.readFile(filepath, 'utf-8');
    return JSON.parse(data) as ApplicationData;
  } catch (error) {
    console.error('Error reading application:', error);
    return null;
  }
}

// List all applications (for future use)
export async function listApplications(): Promise<string[]> {
  try {
    const files = await fs.readdir(APPLICATIONS_DIR);
    return files.filter(file => file.endsWith('.json'));
  } catch (error) {
    console.error('Error listing applications:', error);
    return [];
  }
}

import { z } from 'zod';

// Personal Information Validation Schema
export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .regex(/^[\d\s\-\(\)\+]+$/, 'Please enter a valid phone number'),
  linkedin: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
});

// Screening Question Validation (dynamic based on question requirements)
export const createQuestionSchema = (minLength?: number) => {
  if (minLength) {
    return z.string().min(minLength, `Please provide at least ${minLength} characters`);
  }
  return z.string().min(1, 'This field is required');
};

// File Upload Validation
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: 'Please upload your resume' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 5MB. Please upload a smaller file.' };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload PDF, DOC, or DOCX.' };
  }

  return { valid: true };
};

// Full Application Form Validation Schema
export const applicationFormSchema = personalInfoSchema.extend({
  q1_technical_learning: z.string().min(100, 'Please provide at least 100 characters'),
  q2_field_work_comfort: z.string().min(75, 'Please provide at least 75 characters'),
  q3_ai_tools_proficiency: z.string().min(75, 'Please provide at least 75 characters'),
  q4_communication_style: z.string().min(75, 'Please provide at least 75 characters'),
  q5_clearance_status: z.string().min(1, 'Please select an option'),
  q5_clearance_detail: z.string().optional(),
  q6_travel_willingness: z.string().min(1, 'Please select an option'),
  q7_motivation: z.string().min(75, 'Please provide at least 75 characters'),
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

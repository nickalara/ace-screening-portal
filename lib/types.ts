// Type definitions for the ACE Role Screening Portal

export interface ScreeningQuestion {
  id: string;
  questionNumber: number;
  label: string;
  type: 'text' | 'textarea' | 'radio';
  required: boolean;
  placeholder?: string;
  helperText?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    errorMessage?: string;
  };
  options?: {
    label: string;
    value: string;
  }[];
  conditionalFollowUp?: {
    triggerValues: string[];
    question: {
      id: string;
      label: string;
      type: 'text' | 'textarea';
      required: boolean;
      placeholder?: string;
    };
  };
  category?: string;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  linkedin?: string;
}

export interface ScreeningResponse {
  questionId: string;
  questionText: string;
  answer: string;
}

export interface ResumeInfo {
  originalFilename: string;
  storedFilename: string;
  fileSize: number;
  mimeType: string;
}

export interface ApplicationData {
  applicationId: string;
  timestamp: string;
  personalInfo: PersonalInfo;
  screeningResponses: ScreeningResponse[];
  resume: ResumeInfo;
}

export interface ApplicationFormData extends PersonalInfo {
  [key: string]: string | File | undefined;
  resume?: File;
}

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { applicationFormSchema, ApplicationFormValues, validateFile } from '@/lib/validation';
import { SCREENING_SECTIONS } from '@/lib/constants';
import { TIMED_ASSESSMENT_QUESTIONS } from '@/lib/timed-questions';
import { PersonalInfoSection } from './PersonalInfoSection';
import { ScreeningSection } from './ScreeningSection';
import { FileUpload } from './FileUpload';
import { TimedAssessment } from './TimedAssessment';
import { Button } from '../ui/Button';
import { ErrorMessage } from '../ui/ErrorMessage';

export function ApplicationForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [showTimedAssessment, setShowTimedAssessment] = useState(false);
  const [timedAssessmentResponses, setTimedAssessmentResponses] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ApplicationFormValues) => {
    // Validate file
    if (!file) {
      setFileError('Please upload your resume');
      window.scrollTo({ top: document.getElementById('resume-section')?.offsetTop || 0, behavior: 'smooth' });
      return;
    }

    const fileValidation = validateFile(file);
    if (!fileValidation.valid) {
      setFileError(fileValidation.error);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(undefined);

    try {
      // Prepare form data with file
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      formData.append('resume', file);

      // Submit to API
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit application');
      }

      const result = await response.json();

      // Redirect to success page with application ID
      router.push(`/success?id=${result.applicationId}`);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit application. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    if (selectedFile) {
      const validation = validateFile(selectedFile);
      setFileError(validation.valid ? undefined : validation.error);
    } else {
      setFileError(undefined);
    }
  };

  const handleTimedAssessmentComplete = (responses: Record<string, string>) => {
    setTimedAssessmentResponses(responses);
    setShowTimedAssessment(false);
    console.log('Timed Assessment Responses:', responses);
  };

  const handleTimedAssessmentClose = () => {
    setShowTimedAssessment(false);
  };

  // Scroll to first error on validation fail
  React.useEffect(() => {
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      const element = document.getElementById(firstError);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [errors]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Error Summary */}
      {(Object.keys(errors).length > 0 || fileError || submitError) && (
        <ErrorMessage message="Please fix the errors below before submitting." />
      )}

      {submitError && (
        <ErrorMessage message={submitError} />
      )}

      {/* Personal Information */}
      <PersonalInfoSection register={register} errors={errors} />

      {/* Screening Questions */}
      <ScreeningSection
        sections={SCREENING_SECTIONS}
        register={register}
        errors={errors}
        watch={watch}
      />

      {/* Resume Upload */}
      <div id="resume-section" className="bg-white border border-gray-200 rounded-lg p-8 md:p-10 shadow-sm">
        <div className="pb-4 border-b border-gray-200 mb-6">
          <h2 className="text-2xl font-semibold text-slate-900">Resume Upload</h2>
        </div>
        <FileUpload onFileSelect={handleFileSelect} error={fileError} currentFile={file} />
      </div>

      {/* Timed Assessment Demo Button */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Timed Assessment</h3>
            <p className="text-sm text-slate-600">
              Complete a 4-question timed assessment (90 seconds per question)
            </p>
            {Object.keys(timedAssessmentResponses).length > 0 && (
              <p className="text-sm text-green-600 mt-1">
                ✓ Assessment completed
              </p>
            )}
          </div>
          <Button
            type="button"
            onClick={() => setShowTimedAssessment(true)}
            variant="primary"
            className="px-6"
          >
            {Object.keys(timedAssessmentResponses).length > 0 ? 'Retake Assessment' : 'Start Assessment'}
          </Button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <Button
          type="submit"
          size="large"
          variant="primary"
          loading={isSubmitting}
          disabled={isSubmitting}
          className="w-full md:w-auto px-16"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </div>

      {/* Timed Assessment Modal */}
      {showTimedAssessment && (
        <TimedAssessment
          questions={TIMED_ASSESSMENT_QUESTIONS}
          onComplete={handleTimedAssessmentComplete}
          onClose={handleTimedAssessmentClose}
        />
      )}
    </form>
  );
}

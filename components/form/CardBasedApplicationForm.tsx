'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { applicationFormSchema, ApplicationFormValues, validateFile } from '@/lib/validation';
import { SCREENING_SECTIONS } from '@/lib/constants';
import { TIMED_ASSESSMENT_QUESTIONS } from '@/lib/timed-questions';
import { PersonalInfoSection } from './PersonalInfoSection';
import { QuestionField } from './QuestionField';
import { FileUpload } from './FileUpload';
import { Button } from '../ui/Button';
import { ErrorMessage } from '../ui/ErrorMessage';
import { Textarea } from '../ui/Textarea';
import type { ScreeningQuestion } from '@/lib/types';
import type { TimedQuestion } from './TimedAssessment';

interface CardStep {
  id: string;
  type: 'personal_info' | 'intro' | 'question' | 'timed_question' | 'resume';
  question?: ScreeningQuestion;
  timedQuestion?: TimedQuestion;
  timeLimit?: number; // in seconds
  questionNumber?: number; // Sequential question number
}

export function CardBasedApplicationForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isTimerInitialized = useRef(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    mode: 'onBlur',
  });

  // Build card steps with sequential question numbering
  const cardSteps: CardStep[] = React.useMemo(() => {
    let questionCounter = 1;

    const steps: CardStep[] = [
      // Personal Info
      { id: 'personal_info', type: 'personal_info' },
      // Introduction card
      { id: 'intro', type: 'intro' },
    ];

    // All screening questions with timers where needed
    SCREENING_SECTIONS.forEach(section => {
      section.questions.forEach(q => {
        // Determine if this question should be timed
        let timeLimit: number | undefined;

        // Section 2, Question 2 (q5_manual_to_app) - 20 seconds (testing)
        if (q.id === 'q5_manual_to_app') {
          timeLimit = 20;
        }
        // Section 3, Question 1 (q7_technical_rewrite) - 20 seconds (testing)
        else if (q.id === 'q7_technical_rewrite') {
          timeLimit = 20;
        }
        // Section 4, Question 2 (q10_safety_scenario) - 20 seconds (testing)
        else if (q.id === 'q10_safety_scenario') {
          timeLimit = 20;
        }

        steps.push({
          id: q.id,
          type: 'question',
          question: q,
          timeLimit,
          questionNumber: questionCounter++,
        });
      });
    });

    // Timed assessment questions (20 seconds each for testing)
    TIMED_ASSESSMENT_QUESTIONS.forEach(tq => {
      steps.push({
        id: tq.id,
        type: 'timed_question',
        timedQuestion: tq,
        timeLimit: 20, // Override to 20 seconds for testing
        questionNumber: questionCounter++,
      });
    });

    // Resume upload
    steps.push({ id: 'resume', type: 'resume' });

    return steps;
  }, []);

  const currentCard = cardSteps[currentStep];

  // Initialize timer when entering a timed question (only once per question)
  useEffect(() => {
    // Clean up old timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    isTimerInitialized.current = false;

    if (currentCard.timeLimit) {
      // Set initial time
      setTimeRemaining(currentCard.timeLimit);

      // Load existing answer if any (only on mount)
      const existingAnswer = currentCard.question
        ? watch(currentCard.question.id as any)
        : currentCard.timedQuestion
        ? watch(currentCard.timedQuestion.id as any)
        : '';

      setCurrentAnswer(existingAnswer || '');
      isTimerInitialized.current = true;
    } else {
      setTimeRemaining(null);
      setCurrentAnswer('');
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentStep]); // Only depend on currentStep

  // Timer countdown effect
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || !isTimerInitialized.current) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          // Time's up - save and auto advance
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          handleNext(true);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timeRemaining, isTimerInitialized.current]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const canProceed = (): boolean => {
    if (currentCard.type === 'personal_info') {
      const fullName = watch('fullName');
      const email = watch('email');
      const phone = watch('phone');
      return !!(fullName && email && phone && !errors.fullName && !errors.email && !errors.phone);
    }

    if (currentCard.type === 'intro') {
      return true;
    }

    if (currentCard.type === 'resume') {
      return !!file && !fileError;
    }

    if (currentCard.type === 'question' && currentCard.question) {
      const q = currentCard.question;
      const answer = currentCard.timeLimit ? currentAnswer : watch(q.id as any);

      if (q.type === 'radio' || q.type === 'checkbox') {
        return !!answer;
      }

      if (q.type === 'textarea' || q.type === 'text') {
        if (!answer) return false;
        const charLength = answer.length;
        if (q.validation?.minLength && charLength < q.validation.minLength) {
          return false;
        }
        return true;
      }
    }

    if (currentCard.type === 'timed_question' && currentCard.timedQuestion) {
      const tq = currentCard.timedQuestion;
      const wordCount = countWords(currentAnswer);
      return wordCount >= tq.minWords && wordCount <= tq.maxWords;
    }

    return true;
  };

  const handleNext = (forceNext: boolean = false) => {
    // Save timed question answer
    if (currentCard.type === 'timed_question' && currentCard.timedQuestion) {
      setValue(currentCard.timedQuestion.id as any, currentAnswer);
    } else if (currentCard.type === 'question' && currentCard.question && currentCard.timeLimit) {
      setValue(currentCard.question.id as any, currentAnswer);
    }

    if (currentStep < cardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentAnswer('');
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

  const onSubmit = async (data: ApplicationFormValues) => {
    if (!file) {
      setFileError('Please upload your resume');
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
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      formData.append('resume', file);

      const response = await fetch('/api/submit-application', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit application');
      }

      const result = await response.json();
      router.push(`/success?id=${result.applicationId}`);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit application. Please try again.');
      setIsSubmitting(false);
    }
  };

  const renderCard = () => {
    if (currentCard.type === 'personal_info') {
      return (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900">Personal Information</h2>
            <p className="text-sm text-slate-600">Let&apos;s start with your basic information</p>
          </div>
          <PersonalInfoSection register={register} errors={errors} />
        </div>
      );
    }

    if (currentCard.type === 'intro') {
      return (
        <div className="space-y-6 text-center py-8">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900">Ready to Begin?</h2>
          <div className="space-y-4 text-slate-700 max-w-2xl mx-auto">
            <p>
              You&apos;re about to begin a series of questions to help us understand your qualifications and fit for the ACE role.
            </p>
            <p className="font-semibold text-lg text-blue-700">
              Some questions will be timed. Once the survey starts, you cannot go back, and you can only answer each question once.
            </p>
            <p>
              Read each question carefully and provide thoughtful responses.
            </p>
          </div>
        </div>
      );
    }

    if (currentCard.type === 'question' && currentCard.question) {
      const q = currentCard.question;
      const isTimedQuestion = !!currentCard.timeLimit;

      // For timed questions, we use local state; for untimed, use react-hook-form
      if (isTimedQuestion) {
        const wordCount = countWords(currentAnswer);
        const meetsMinimum = q.validation?.minLength ? currentAnswer.length >= q.validation.minLength : true;

        return (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between">
              <span className="text-sm font-medium text-red-900">Time Remaining:</span>
              <span className="text-lg font-mono font-bold text-red-600">
                {timeRemaining !== null ? formatTime(timeRemaining) : '0:00'}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Question {currentCard.questionNumber}
              </h3>
              <p className="text-base text-slate-900">{q.label}</p>
              {q.helperText && (
                <p className="text-sm text-slate-600 mt-1">{q.helperText}</p>
              )}
            </div>

            <div className="space-y-2">
              <Textarea
                label="Your Answer"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder={q.placeholder || "Type your answer here..."}
                rows={8}
              />
              <p className="text-sm text-slate-600">
                Characters: {currentAnswer.length}
                {q.validation?.minLength && ` (minimum ${q.validation.minLength})`}
              </p>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <QuestionField
            question={q}
            questionNumber={currentCard.questionNumber || q.questionNumber}
            totalQuestions={cardSteps.filter(s => s.type === 'question' || s.type === 'timed_question').length}
            register={register}
            errors={errors}
            watch={watch}
          />
        </div>
      );
    }

    if (currentCard.type === 'timed_question' && currentCard.timedQuestion) {
      const tq = currentCard.timedQuestion;
      const wordCount = countWords(currentAnswer);
      const meetsMinimum = wordCount >= tq.minWords;
      const exceedsMaximum = wordCount > tq.maxWords;

      return (
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between">
            <span className="text-sm font-medium text-red-900">Time Remaining:</span>
            <span className="text-lg font-mono font-bold text-red-600">
              {timeRemaining !== null ? formatTime(timeRemaining) : '0:00'}
            </span>
          </div>

          <div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">
              Question {currentCard.questionNumber}
            </h3>
            <p className="text-sm text-slate-600">
              ({tq.minWords}-{tq.maxWords} words)
            </p>
          </div>

          <div>
            <img
              src={tq.imageSrc}
              alt={`Question ${currentCard.questionNumber}`}
              className="w-full h-48 md:h-64 object-cover rounded-lg"
            />
          </div>

          <div>
            <p className="text-base md:text-lg text-slate-900">{tq.text}</p>
          </div>

          <div className="space-y-2">
            <Textarea
              label="Your Answer"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={6}
            />
            <div className={`text-sm ${
              exceedsMaximum ? 'text-red-600' :
              meetsMinimum ? 'text-green-600' :
              'text-slate-600'
            }`}>
              Word count: {wordCount} / {tq.maxWords}
              {wordCount < tq.minWords && ` (minimum ${tq.minWords})`}
            </div>
          </div>
        </div>
      );
    }

    if (currentCard.type === 'resume') {
      return (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900">Resume Upload</h2>
            <p className="text-sm text-slate-600">Please upload your resume to complete your application</p>
          </div>
          <FileUpload onFileSelect={handleFileSelect} error={fileError} currentFile={file} />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-4 md:py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress bar */}
        <div className="mb-6 md:mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs md:text-sm text-slate-600">
              Step {currentStep + 1} of {cardSteps.length}
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / cardSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 md:p-10">
          {submitError && (
            <div className="mb-6">
              <ErrorMessage message={submitError} />
            </div>
          )}

          {renderCard()}

          {/* Navigation */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
            {currentCard.type === 'resume' ? (
              <Button
                onClick={handleSubmit(onSubmit)}
                variant="primary"
                size="large"
                disabled={!canProceed() || isSubmitting}
                loading={isSubmitting}
                className="w-full md:w-auto px-12"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            ) : (
              <Button
                onClick={() => handleNext(false)}
                variant="primary"
                size="large"
                disabled={!canProceed()}
                className="w-full md:w-auto px-12"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

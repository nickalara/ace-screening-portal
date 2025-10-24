import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ScreeningQuestion } from '@/lib/types';
import { ApplicationFormValues } from '@/lib/validation';
import { Textarea } from '../ui/Textarea';

interface QuestionFieldProps {
  question: ScreeningQuestion;
  questionNumber: number;
  totalQuestions: number;
  register: UseFormRegister<any>;
  errors: FieldErrors<ApplicationFormValues>;
  watch: (name: string) => any;
}

export function QuestionField({ question, questionNumber, totalQuestions, register, errors, watch }: QuestionFieldProps) {
  const value = watch(question.id) || '';
  const error = errors[question.id as keyof ApplicationFormValues]?.message as string | undefined;

  // Handle textarea questions
  if (question.type === 'textarea') {
    return (
      <div className="space-y-3">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Question {questionNumber} of {totalQuestions}
        </div>
        <Textarea
          {...register(question.id as any)}
          label={question.label}
          placeholder={question.placeholder}
          helperText={question.helperText}
          error={error}
          required={question.required}
          showCharCount
          recommendedLength={500}
          value={value}
          minLength={question.validation?.minLength}
        />
      </div>
    );
  }

  // Handle checkbox questions
  if (question.type === 'checkbox') {
    return (
      <div className="space-y-4">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Question {questionNumber} of {totalQuestions}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            {question.label}
            {question.required && <span className="text-error-600 ml-1">*</span>}
          </label>

          <div className="space-y-2 mt-4">
            {question.options?.map((option) => (
              <label
                key={option.value}
                className="flex items-start gap-3 p-3 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  {...register(question.id as any)}
                  type="checkbox"
                  value={option.value}
                  className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-3 focus:ring-blue-100 focus:ring-offset-0"
                />
                <span className="text-base text-slate-700 leading-relaxed flex-1">{option.label}</span>
              </label>
            ))}
          </div>

          {error && (
            <p className="text-xs text-error-600 mt-2" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Handle radio questions
  if (question.type === 'radio') {
    const selectedValue = watch(question.id);
    const showConditional = question.conditionalFollowUp?.triggerValues.includes(selectedValue);

    return (
      <div className="space-y-4">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Question {questionNumber} of {totalQuestions}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            {question.label}
            {question.required && <span className="text-error-600 ml-1">*</span>}
          </label>

          <div className="space-y-2 mt-4">
            {question.options?.map((option) => (
              <label
                key={option.value}
                className="flex items-start gap-3 p-3 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  {...register(question.id as any)}
                  type="radio"
                  value={option.value}
                  className="mt-1 w-5 h-5 text-blue-600 border-gray-300 focus:ring-3 focus:ring-blue-100 focus:ring-offset-0"
                />
                <span className="text-base text-slate-700 leading-relaxed flex-1">{option.label}</span>
              </label>
            ))}
          </div>

          {error && (
            <p className="text-xs text-error-600 mt-2" role="alert">
              {error}
            </p>
          )}

          {/* Conditional follow-up question */}
          {showConditional && question.conditionalFollowUp && (
            <div className="mt-6 p-5 bg-blue-50 border border-blue-100 rounded-md animate-in slide-in-from-top-2 duration-300">
              <label htmlFor={question.conditionalFollowUp.question.id} className="block text-sm font-medium text-slate-700 mb-2">
                {question.conditionalFollowUp.question.label}
              </label>
              <input
                {...register(question.conditionalFollowUp.question.id as any)}
                type="text"
                id={question.conditionalFollowUp.question.id}
                placeholder={question.conditionalFollowUp.question.placeholder}
                className="w-full px-4 py-3 border border-blue-200 rounded-md text-base text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-3 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ApplicationFormValues } from '@/lib/validation';
import { ScreeningQuestion } from '@/lib/types';
import { QuestionField } from './QuestionField';

interface ScreeningSectionProps {
  questions: ScreeningQuestion[];
  register: UseFormRegister<ApplicationFormValues>;
  errors: FieldErrors<ApplicationFormValues>;
  watch: (name: string) => any;
}

export function ScreeningSection({ questions, register, errors, watch }: ScreeningSectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 md:p-10 shadow-sm space-y-8">
      <div className="pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-slate-900">Screening Questions</h2>
      </div>

      {questions.map((question, index) => (
        <div key={question.id}>
          <QuestionField
            question={question}
            questionNumber={index + 1}
            totalQuestions={questions.length}
            register={register}
            errors={errors}
            watch={watch}
          />
          {index < questions.length - 1 && <div className="h-px bg-gray-200 my-8" />}
        </div>
      ))}
    </div>
  );
}

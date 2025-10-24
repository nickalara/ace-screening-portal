import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ApplicationFormValues } from '@/lib/validation';
import { QuestionSection } from '@/lib/types';
import { QuestionField } from './QuestionField';

interface ScreeningSectionProps {
  sections: QuestionSection[];
  register: UseFormRegister<ApplicationFormValues>;
  errors: FieldErrors<ApplicationFormValues>;
  watch: (name: string) => any;
}

export function ScreeningSection({ sections, register, errors, watch }: ScreeningSectionProps) {
  return (
    <div className="space-y-8">
      {sections.map((section, sectionIndex) => (
        <div key={section.id} className="bg-white border border-gray-200 rounded-lg p-8 md:p-10 shadow-sm space-y-8">
          <div className="pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-slate-900">{section.title}</h2>
            {section.description && (
              <p className="text-sm text-slate-600 mt-2">{section.description}</p>
            )}
            {section.estimatedMinutes && (
              <p className="text-xs text-slate-500 mt-1">Estimated time: {section.estimatedMinutes} min</p>
            )}
          </div>

          {section.questions.map((question, questionIndex) => (
            <div key={question.id}>
              <QuestionField
                question={question}
                questionNumber={question.questionNumber}
                totalQuestions={section.questions.length}
                register={register}
                errors={errors}
                watch={watch}
              />
              {questionIndex < section.questions.length - 1 && <div className="h-px bg-gray-200 my-8" />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ApplicationFormValues } from '@/lib/validation';
import { Input } from '../ui/Input';

interface PersonalInfoSectionProps {
  register: UseFormRegister<ApplicationFormValues>;
  errors: FieldErrors<ApplicationFormValues>;
}

export function PersonalInfoSection({ register, errors }: PersonalInfoSectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 md:p-10 shadow-sm space-y-6">
      <div className="pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-slate-900">Personal Information</h2>
      </div>

      <Input
        {...register('fullName')}
        label="Full Name"
        placeholder="John Smith"
        required
        autoComplete="name"
        error={errors.fullName?.message}
      />

      <Input
        {...register('email')}
        type="email"
        label="Email Address"
        placeholder="john.smith@example.com"
        required
        autoComplete="email"
        error={errors.email?.message}
      />

      <Input
        {...register('phone')}
        type="tel"
        label="Phone Number"
        placeholder="(555) 123-4567"
        required
        autoComplete="tel"
        helperText="U.S. phone number"
        error={errors.phone?.message}
      />

      <Input
        {...register('linkedin')}
        type="url"
        label="LinkedIn Profile URL"
        placeholder="https://linkedin.com/in/yourprofile"
        autoComplete="url"
        helperText="Optional - Include if you have a profile"
        error={errors.linkedin?.message}
      />
    </div>
  );
}

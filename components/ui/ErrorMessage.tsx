import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  return (
    <div className={`flex items-start gap-2 p-4 bg-error-50 border border-error-600 rounded-md ${className}`} role="alert">
      <AlertCircle className="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-error-600">{message}</p>
    </div>
  );
}

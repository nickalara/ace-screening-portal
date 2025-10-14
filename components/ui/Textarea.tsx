import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
  showCharCount?: boolean;
  recommendedLength?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, showCharCount, recommendedLength, required, className = '', value = '', ...props }, ref) => {
    const inputId = props.id || props.name;
    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className="space-y-2">
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-error-600 ml-1">*</span>}
        </label>

        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-xs text-slate-500">
            {helperText}
          </p>
        )}

        <textarea
          ref={ref}
          id={inputId}
          className={`w-full px-4 py-3 border rounded-md text-base text-slate-900 placeholder:text-slate-400 transition-colors resize-y min-h-[150px]
            ${error ? 'border-error-600 bg-error-50' : 'border-gray-300 bg-white'}
            focus:outline-none focus:ring-3 focus:ring-blue-100 focus:border-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
            ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          value={value}
          {...props}
        />

        <div className="flex justify-between items-center">
          <div>
            {error && (
              <p id={`${inputId}-error`} className="text-xs text-error-600" role="alert">
                {error}
              </p>
            )}
          </div>
          {showCharCount && recommendedLength && (
            <p className={`text-xs ${charCount < (props.minLength || 0) ? 'text-warning-600' : 'text-slate-500'}`}>
              {charCount} / {recommendedLength} recommended
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

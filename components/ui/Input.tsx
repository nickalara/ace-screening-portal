import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, required, className = '', ...props }, ref) => {
    const inputId = props.id || props.name;

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

        <input
          ref={ref}
          id={inputId}
          className={`w-full px-4 py-3 border rounded-md text-base text-slate-900 placeholder:text-slate-400 transition-colors
            ${error ? 'border-error-600 bg-error-50' : 'border-gray-300 bg-white'}
            focus:outline-none focus:ring-3 focus:ring-blue-100 focus:border-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
            ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />

        {error && (
          <p id={`${inputId}-error`} className="text-xs text-error-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

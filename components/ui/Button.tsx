import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-md transition-all duration-150 focus:outline-none focus:ring-3 focus:ring-orange-100 disabled:opacity-60 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-orange-600 hover:bg-orange-700 text-white shadow-md hover:shadow-lg hover:scale-[1.02]',
    secondary: 'bg-white hover:bg-gray-50 text-slate-700 border border-gray-300',
    outline: 'bg-transparent hover:bg-orange-50 text-orange-600 border-2 border-orange-600',
    text: 'bg-transparent hover:underline text-orange-600',
  };

  const sizeStyles = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-10 py-4 text-lg',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

/**
 * Input Component
 * Reusable text input with error handling and accessibility
 * React 19: No manual memoization - let React Compiler optimize
 */

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'text' | 'email' | 'password' | 'number';
  icon?: React.ReactNode;
}

/**
 * Input component with semantic HTML, accessibility, and error states
 */
export function Input({
  label,
  error,
  helperText,
  variant = 'text',
  icon,
  className = '',
  id,
  ...props
}: InputProps)  {
  const inputId = id;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const baseStyles =
    'w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0';

  const borderStyle = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400';

  const inputClassName = `${baseStyles} ${borderStyle} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          type={variant}
          className={inputClassName}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          {...props}
        />
        {icon && <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</div>}
      </div>

      {error && (
        <p id={errorId} className="text-sm text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p id={helperId} className="text-sm text-gray-500 mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
}

'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

interface AuthTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: ReactNode;
  trailing?: ReactNode;
  error?: string;
}

export const AuthTextField = forwardRef<HTMLInputElement, AuthTextFieldProps>(
  function AuthTextField(
    { label, icon, trailing, id, error, className = '', ...inputProps },
    ref,
  ) {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div>
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-semibold text-gray-900"
        >
          {label}
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? true : undefined}
            className={`w-full rounded-lg border bg-white py-3.5 pl-11 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${trailing ? 'pr-12' : 'pr-4'} ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-300 focus:border-accent focus:ring-accent/20'
            } ${className}`}
            {...inputProps}
          />
          {trailing ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {trailing}
            </div>
          ) : null}
        </div>
        {error ? <p className="mt-1.5 text-sm text-red-600">{error}</p> : null}
      </div>
    );
  },
);

AuthTextField.displayName = 'AuthTextField';

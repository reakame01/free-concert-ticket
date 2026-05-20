'use client';

import type { InputHTMLAttributes, ReactNode } from 'react';

interface AuthTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: ReactNode;
  trailing?: ReactNode;
}

export const AuthTextField = ({
  label,
  icon,
  trailing,
  id,
  className = '',
  ...inputProps
}: AuthTextFieldProps) => {
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
          id={inputId}
          className={`w-full rounded-lg border border-gray-300 bg-white py-3.5 pl-11 text-gray-900 placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 ${trailing ? 'pr-12' : 'pr-4'} ${className}`}
          {...inputProps}
        />
        {trailing ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {trailing}
          </div>
        ) : null}
      </div>
    </div>
  );
};

'use client';

import { Eye, EyeOff, Lock } from 'lucide-react';
import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { AuthTextField } from '@/components/auth/auth-text-field';

interface AuthPasswordFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

export const AuthPasswordField = forwardRef<
  HTMLInputElement,
  AuthPasswordFieldProps
>(function AuthPasswordField(
  { label, error, disabled, placeholder, autoComplete, ...inputProps },
  ref,
) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthTextField
      ref={ref}
      label={label}
      type={showPassword ? 'text' : 'password'}
      autoComplete={autoComplete}
      placeholder={placeholder}
      disabled={disabled}
      error={error}
      icon={<Lock className="h-5 w-5" strokeWidth={1.5} />}
      trailing={
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="rounded p-1 text-gray-400 transition-colors hover:text-gray-600"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" strokeWidth={1.5} />
          ) : (
            <Eye className="h-5 w-5" strokeWidth={1.5} />
          )}
        </button>
      }
      {...inputProps}
    />
  );
});

AuthPasswordField.displayName = 'AuthPasswordField';

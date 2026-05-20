'use client';

import { Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';
import { AuthTextField } from './auth-text-field';

interface AuthPasswordFieldProps {
  label: string;
  name: string;
  placeholder: string;
  autoComplete?: string;
}

export const AuthPasswordField = ({
  label,
  name,
  placeholder,
  autoComplete,
}: AuthPasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthTextField
      label={label}
      type={showPassword ? 'text' : 'password'}
      name={name}
      autoComplete={autoComplete}
      placeholder={placeholder}
      required
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
    />
  );
};

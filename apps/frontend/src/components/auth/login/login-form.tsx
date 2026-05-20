'use client';

import { User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAccessMode } from '@/lib/access-mode';
import type { AccessMode } from '@/types/access-mode';
import { AuthActionButton } from '../auth-action-button';
import { AuthFooterLink } from '../auth-footer-link';
import { AuthFormHeading } from '../auth-form-heading';
import { AuthPasswordField } from '../auth-password-field';
import { AuthTextField } from '../auth-text-field';

const LOGIN_BUTTON_LABELS: Record<AccessMode, string> = {
  USER: 'Login as User',
  ADMIN: 'Login as Administrator',
};

export const LoginForm = () => {
  const [accessMode, setAccessMode] = useState<AccessMode | null>(null);

  useEffect(() => {
    setAccessMode(getAccessMode());
  }, []);

  const buttonLabel = accessMode
    ? LOGIN_BUTTON_LABELS[accessMode]
    : 'Login';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: call login API, then redirect via getPostLoginPathFromStorage()
  };

  return (
    <div className="w-full max-w-md">
      <AuthFormHeading title="Login" />

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <AuthTextField
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Enter your Email Address"
          required
          icon={<User className="h-5 w-5" strokeWidth={1.5} />}
        />

        <AuthPasswordField
          label="Password"
          name="password"
          placeholder="Enter your Password"
          autoComplete="current-password"
        />

        <AuthActionButton label={buttonLabel} />
      </form>

      <AuthFooterLink
        message="Don't have an account?"
        linkText="Create an account"
        href="/register"
      />
    </div>
  );
};

'use client';

import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getAccessMode,
  getPostLoginPathFromStorage,
  setAccessMode,
} from '@/lib/access-mode';
import { MOCK_PASSWORD } from '@/lib/mock-data';
import { setToken } from '@/lib/auth';
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
  const router = useRouter();
  const [accessMode, setAccessModeState] = useState<AccessMode | null>(null);

  useEffect(() => {
    const mode = getAccessMode();
    if (mode) {
      setAccessModeState(mode);
    } else {
      setAccessMode('USER');
      setAccessModeState('USER');
    }
  }, []);

  const buttonLabel = accessMode
    ? LOGIN_BUTTON_LABELS[accessMode]
    : 'Login';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = (formData.get('username') as string)?.trim();
    const password = formData.get('password') as string;

    if (password !== MOCK_PASSWORD) {
      toast.error('Invalid credentials. Use password: admin');
      return;
    }

    if (!username) {
      toast.error('Please enter your username');
      return;
    }

    const mode = getAccessMode() ?? 'USER';
    setAccessMode(mode);
    setToken('mock-auth-token');
    toast.success('Login successfully');
    router.push(getPostLoginPathFromStorage());
  };

  return (
    <div className="w-full max-w-md">
      <AuthFormHeading title="Login" />

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <AuthTextField
          label="Username"
          type="text"
          name="username"
          autoComplete="username"
          placeholder="admin"
          defaultValue="admin"
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

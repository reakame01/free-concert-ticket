'use client';

import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { getSignupRoleFromStorage } from '@/lib/access-mode';
import { SuccessDialog } from '@/components/ui/success-dialog';
import { AuthActionButton } from '../auth-action-button';
import { AuthFooterLink } from '../auth-footer-link';
import { AuthFormHeading } from '../auth-form-heading';
import { AuthPasswordField } from '../auth-password-field';
import { AuthTextField } from '../auth-text-field';

export const RegisterForm = () => {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    void getSignupRoleFromStorage();
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.push('/login');
  };

  return (
    <>
      <div className="w-full max-w-md">
        <AuthFormHeading title="Sign Up" />

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <AuthTextField
            label="Full name"
            type="text"
            name="fullName"
            autoComplete="name"
            placeholder="Enter your Full Name"
            required
            icon={<User className="h-5 w-5" strokeWidth={1.5} />}
          />

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
            placeholder="Create a Password"
            autoComplete="new-password"
          />

          <AuthPasswordField
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Confirm your Password"
            autoComplete="new-password"
          />

          <AuthActionButton label="Create an account" />
        </form>

        <AuthFooterLink
          message="Already have an account?"
          linkText="Login"
          href="/login"
        />
      </div>

      <SuccessDialog
        open={showSuccess}
        title="Registration successful"
        message="Your account has been registered successfully. Please log in to continue."
        onClose={handleSuccessClose}
      />
    </>
  );
};

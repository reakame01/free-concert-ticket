'use client';

import { User } from 'lucide-react';
import { AuthActionButton } from '../auth-action-button';
import { AuthFooterLink } from '../auth-footer-link';
import { AuthFormHeading } from '../auth-form-heading';
import { AuthPasswordField } from '../auth-password-field';
import { AuthTextField } from '../auth-text-field';

export const RegisterForm = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: call register API with getSignupRoleFromStorage() for account role
  };

  return (
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
  );
};

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm, type SubmitErrorHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useI18n } from '@/context/i18n-provider';
import { register as registerApi } from '@/lib/api/auth';
import { getApiErrorMessage } from '@/lib/api-error';
import { getSignupRoleFromStorage } from '@/lib/access-mode';
import { getFirstFieldError } from '@/lib/form-errors';
import {
  createRegisterSchema,
  type RegisterFormValues,
} from '@/lib/schemas/auth';
import { SuccessDialog } from '@/components/ui/success-dialog';
import { AuthActionButton } from '@/components/auth/auth-action-button';
import { AuthFooterLink } from '@/components/auth/auth-footer-link';
import { AuthFormHeading } from '@/components/auth/auth-form-heading';
import { AuthPasswordField } from '@/components/auth/auth-password-field';
import { AuthTextField } from '@/components/auth/auth-text-field';

export const RegisterForm = () => {
  const router = useRouter();
  const { t, locale, messages } = useI18n();
  const [showSuccess, setShowSuccess] = useState(false);

  const registerSchema = useMemo(
    () => createRegisterSchema(messages.validation.register),
    [messages],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerApi(
        values.username,
        values.password,
        getSignupRoleFromStorage(),
      );
      setShowSuccess(true);
    } catch (error) {
      toast.error(getApiErrorMessage(error, t('toast.registerFailed')));
    }
  };

  const onInvalid: SubmitErrorHandler<RegisterFormValues> = (fieldErrors) => {
    const message = getFirstFieldError(
      fieldErrors,
      t('validation.invalidInput'),
    );
    if (message) {
      toast.error(message);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.push('/login');
  };

  return (
    <>
      <div className="w-full max-w-md">
        <AuthFormHeading title={t('auth.register.title')} />

        <form
          key={locale}
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="mt-10 space-y-6"
          noValidate
        >
          <AuthTextField
            label={t('auth.register.username')}
            type="text"
            autoComplete="username"
            placeholder={t('auth.register.placeholderUsername')}
            disabled={isSubmitting}
            icon={<User className="h-5 w-5" strokeWidth={1.5} />}
            error={errors.username?.message}
            {...register('username')}
          />

          <AuthPasswordField
            label={t('auth.register.password')}
            autoComplete="new-password"
            placeholder={t('auth.register.placeholderPassword')}
            disabled={isSubmitting}
            error={errors.password?.message}
            {...register('password')}
          />

          <AuthPasswordField
            label={t('auth.register.confirmPassword')}
            autoComplete="new-password"
            placeholder={t('auth.register.placeholderConfirmPassword')}
            disabled={isSubmitting}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <AuthActionButton
            label={
              isSubmitting
                ? t('auth.register.creating')
                : t('auth.register.submit')
            }
            disabled={isSubmitting}
          />
        </form>

        <AuthFooterLink
          message={t('auth.register.hasAccount')}
          linkText={t('auth.register.loginLink')}
          href="/login"
        />
      </div>

      <SuccessDialog
        open={showSuccess}
        title={t('auth.register.successTitle')}
        message={t('auth.register.successMessage')}
        onClose={handleSuccessClose}
      />
    </>
  );
};

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm, type SubmitErrorHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useI18n } from '@/context/i18n-provider';
import { login } from '@/lib/api/auth';
import { getApiErrorMessage } from '@/lib/api-error';
import {
  getAccessMode,
  getPostLoginPathFromStorage,
  setAccessMode,
} from '@/lib/access-mode';
import { getFirstFieldError } from '@/lib/form-errors';
import {
  createLoginSchema,
  type LoginFormValues,
} from '@/lib/schemas/auth';
import { setToken } from '@/lib/auth';
import type { AccessMode } from '@/types/access-mode';
import { AuthActionButton } from '@/components/auth/auth-action-button';
import { AuthFooterLink } from '@/components/auth/auth-footer-link';
import { AuthFormHeading } from '@/components/auth/auth-form-heading';
import { AuthPasswordField } from '@/components/auth/auth-password-field';
import { AuthTextField } from '@/components/auth/auth-text-field';

export const LoginForm = () => {
  const router = useRouter();
  const { t, locale, messages } = useI18n();
  const [accessMode, setAccessModeState] = useState<AccessMode | null>(null);

  const loginSchema = useMemo(
    () => createLoginSchema(messages.validation.login),
    [messages],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: 'admin',
      password: 'admin',
    },
  });

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
    ? accessMode === 'ADMIN'
      ? t('auth.login.loginAsAdmin')
      : t('auth.login.loginAsUser')
    : t('auth.login.login');

  const onSubmit = async (values: LoginFormValues) => {
    const mode = getAccessMode() ?? 'USER';

    try {
      const { accessToken } = await login(
        values.username,
        values.password,
        mode,
      );
      setAccessMode(mode);
      setToken(accessToken);
      toast.success(t('toast.loginSuccess'));
      router.push(getPostLoginPathFromStorage());
    } catch (error) {
      toast.error(getApiErrorMessage(error, t('toast.loginFailed')));
    }
  };

  const onInvalid: SubmitErrorHandler<LoginFormValues> = (fieldErrors) => {
    const message = getFirstFieldError(
      fieldErrors,
      t('validation.invalidInput'),
    );
    if (message) {
      toast.error(message);
    }
  };

  return (
    <div className="w-full max-w-md">
      <AuthFormHeading title={t('auth.login.title')} />

      <form
        key={locale}
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="mt-10 space-y-6"
        noValidate
      >
        <AuthTextField
          label={t('auth.login.username')}
          type="text"
          autoComplete="username"
          placeholder={t('auth.login.placeholderUsername')}
          disabled={isSubmitting}
          icon={<User className="h-5 w-5" strokeWidth={1.5} />}
          error={errors.username?.message}
          {...register('username')}
        />

        <AuthPasswordField
          label={t('auth.login.password')}
          autoComplete="current-password"
          placeholder={t('auth.login.placeholderPassword')}
          disabled={isSubmitting}
          error={errors.password?.message}
          {...register('password')}
        />

        <AuthActionButton
          label={isSubmitting ? t('auth.login.loggingIn') : buttonLabel}
          disabled={isSubmitting}
        />
      </form>

      <AuthFooterLink
        message={t('auth.login.noAccount')}
        linkText={t('auth.login.createAccount')}
        href="/register"
      />
    </div>
  );
};

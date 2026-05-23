'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useForm, type SubmitErrorHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAppStore } from '@/context/app-store';
import { useI18n } from '@/context/i18n-provider';
import { getApiErrorMessage } from '@/lib/api-error';
import { getFirstFieldError } from '@/lib/form-errors';
import {
  createConcertSchema,
  type CreateConcertFormValues,
} from '@/lib/schemas/concert';

export const ConcertCreateForm = () => {
  const router = useRouter();
  const { addConcert, isCreatingConcert } = useAppStore();
  const { t, locale, messages } = useI18n();

  const concertSchema = useMemo(
    () => createConcertSchema(messages.validation.concert),
    [messages],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateConcertFormValues>({
    resolver: zodResolver(concertSchema),
    defaultValues: {
      name: '',
      description: '',
      totalSeats: Number.NaN,
    },
  });

  const busy = isSubmitting || isCreatingConcert;

  const onSubmit = async (values: CreateConcertFormValues) => {
    try {
      await addConcert({
        name: values.name,
        description: values.description,
        totalSeats: values.totalSeats,
      });
      toast.success(t('toast.createSuccess'));
      reset();
      router.push('/home');
    } catch (error) {
      toast.error(getApiErrorMessage(error, t('toast.createFailed')));
    }
  };

  const onInvalid: SubmitErrorHandler<CreateConcertFormValues> = (
    fieldErrors,
  ) => {
    const message = getFirstFieldError(
      fieldErrors,
      t('validation.invalidInput'),
    );
    if (message) {
      toast.error(message);
    }
  };

  const fieldClass = (hasError: boolean) =>
    `w-full rounded-lg border px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 ${
      hasError
        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
        : 'border-gray-300 focus:border-accent focus:ring-accent/20'
    }`;

  return (
    <form
      key={locale}
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      noValidate
    >
      <h2 className="text-xl font-bold text-[#2196F3]">
        {t('concert.createTitle')}
      </h2>
      <div className="mt-4 border-b border-gray-200" />

      <div className="mt-6 space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="concert-name"
              className="mb-2 block text-sm font-semibold text-gray-900"
            >
              {t('concert.name')}
            </label>
            <input
              id="concert-name"
              type="text"
              placeholder={t('concert.placeholderName')}
              disabled={busy}
              className={fieldClass(!!errors.name)}
              {...register('name')}
            />
            {errors.name ? (
              <p className="mt-1.5 text-sm text-red-600">{errors.name.message}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="total-seats"
              className="mb-2 block text-sm font-semibold text-gray-900"
            >
              {t('concert.totalSeats')}
            </label>
            <div className="relative">
              <input
                id="total-seats"
                type="number"
                min={1}
                placeholder={t('concert.placeholderSeats')}
                disabled={busy}
                className={`${fieldClass(!!errors.totalSeats)} pr-12`}
                {...register('totalSeats', { valueAsNumber: true })}
              />
              <User
                className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                strokeWidth={1.5}
              />
            </div>
            {errors.totalSeats ? (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.totalSeats.message}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-semibold text-gray-900"
          >
            {t('concert.description')}
          </label>
          <textarea
            id="description"
            placeholder={t('concert.placeholderDescription')}
            rows={5}
            disabled={busy}
            className={`${fieldClass(!!errors.description)} resize-none`}
            {...register('description')}
          />
          {errors.description ? (
            <p className="mt-1.5 text-sm text-red-600">
              {errors.description.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg bg-[#2196F3] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="h-5 w-5 animate-spin" strokeWidth={1.5} />
          ) : (
            <Save className="h-5 w-5" strokeWidth={1.5} />
          )}
          {busy ? t('concert.saving') : t('concert.save')}
        </button>
      </div>
    </form>
  );
};

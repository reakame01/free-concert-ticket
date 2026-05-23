'use client';

import { useI18n } from '@/context/i18n-provider';

export const AuthBrandContent = () => {
  const { t } = useI18n();

  return (
    <div className="mt-10 lg:mt-0">
      <blockquote className="text-2xl font-bold leading-snug sm:text-3xl lg:text-4xl xl:text-[2.75rem] xl:leading-tight">
        &ldquo;{t('auth.quote')}&rdquo;
      </blockquote>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base lg:mt-6">
        {t('auth.description')}
      </p>
    </div>
  );
};

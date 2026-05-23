'use client';

import { useI18n } from '@/context/i18n-provider';

export const LandingHeader = () => {
  const { t } = useI18n();

  return (
    <header className="flex items-center gap-3 px-4 py-4 sm:px-8 lg:px-12">
      <div
        className="h-10 w-10 shrink-0 rounded-full bg-brand"
        aria-hidden="true"
      />
      <span className="text-xl font-bold tracking-tight text-brand sm:text-2xl">
        {t('common.brand')}
      </span>
    </header>
  );
};


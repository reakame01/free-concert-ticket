'use client';

import type { ReactNode } from 'react';
import { I18nProvider } from '@/context/i18n-provider';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';

export const RootProviders = ({ children }: { children: ReactNode }) => {
  return (
    <I18nProvider>
      <LanguageSwitcher />
      {children}
    </I18nProvider>
  );
};

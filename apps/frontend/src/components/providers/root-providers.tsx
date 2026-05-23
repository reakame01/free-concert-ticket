'use client';

import type { ReactNode } from 'react';
import { I18nProvider } from '@/context/i18n-provider';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { HydrationGate } from '@/components/providers/hydration-gate';

export const RootProviders = ({ children }: { children: ReactNode }) => {
  return (
    <I18nProvider>
      <HydrationGate>
        <LanguageSwitcher />
        {children}
      </HydrationGate>
    </I18nProvider>
  );
};

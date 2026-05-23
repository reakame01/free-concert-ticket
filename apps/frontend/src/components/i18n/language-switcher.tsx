'use client';

import { Globe } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '@/context/i18n-provider';
import type { Locale } from '@/lib/i18n/types';

const LOCALE_OPTIONS: { value: Locale; label: string }[] = [
  { value: 'th', label: 'ไทย' },
  { value: 'en', label: 'English' },
];

export const LanguageSwitcher = () => {
  const { locale, setLocale, t } = useI18n();
  const [pinnedCollapsed, setPinnedCollapsed] = useState(false);

  const handleSelect = (value: Locale) => {
    setLocale(value);
    setPinnedCollapsed(true);
  };

  return (
    <div
      className="fixed right-4 top-4 z-[60]"
      onMouseLeave={() => setPinnedCollapsed(false)}
    >
      <div
        role="group"
        aria-label={t('common.language')}
        className={`group flex h-8 items-center overflow-hidden rounded-full bg-white/0 shadow-none transition-[width,background-color,box-shadow] duration-300 ease-in-out hover:bg-white hover:shadow-sm ${
          pinnedCollapsed ? 'w-8' : 'w-8 hover:w-[8.75rem]'
        }`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center text-gray-600">
          <Globe className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        </span>

        <div
          className={`flex shrink-0 items-center gap-0.5 overflow-hidden whitespace-nowrap pr-1 transition-[width,opacity] duration-300 ease-in-out ${
            pinnedCollapsed
              ? 'w-0 opacity-0'
              : 'w-0 opacity-0 group-hover:w-auto group-hover:opacity-100'
          }`}
        >
          {LOCALE_OPTIONS.map((option) => {
            const isActive = locale === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                aria-pressed={isActive}
                aria-label={option.label}
                className={`rounded px-2 py-1 text-sm transition-colors ${
                  isActive
                    ? 'font-semibold text-brand'
                    : 'font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import { en } from './locales/en';
import { th } from './locales/th';
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  type Locale,
  type Messages,
} from './types';

const locales: Record<Locale, Messages> = { en, th: th as Messages };

let currentLocale: Locale = DEFAULT_LOCALE;

const resolvePath = (messages: Messages, path: string): string | undefined => {
  const value = path.split('.').reduce<unknown>((obj, key) => {
    if (obj && typeof obj === 'object' && key in obj) {
      return (obj as Record<string, unknown>)[key];
    }
    return undefined;
  }, messages);

  return typeof value === 'string' ? value : undefined;
};

export const translate = (
  path: string,
  params?: Record<string, string | number>,
): string => {
  const template =
    resolvePath(locales[currentLocale], path) ??
    resolvePath(locales.en, path) ??
    path;

  if (!params) {
    return template;
  }

  return Object.entries(params).reduce(
    (result, [key, value]) =>
      result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value)),
    template,
  );
};

export const getLocale = (): Locale => currentLocale;

export const setLocale = (locale: Locale): void => {
  currentLocale = locale;
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }
};

export const getStoredLocale = (): Locale => {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return stored === 'en' || stored === 'th' ? stored : DEFAULT_LOCALE;
};

export const initLocale = (): Locale => {
  const locale = getStoredLocale();
  setLocale(locale);
  return locale;
};

export const getMessages = (locale: Locale = currentLocale): Messages =>
  locales[locale];

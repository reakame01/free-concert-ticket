import type { en } from './locales/en';

export type Locale = 'th' | 'en';

export type Messages = typeof en;

export const LOCALE_STORAGE_KEY = 'free-tick-locale';

export const DEFAULT_LOCALE: Locale = 'en';

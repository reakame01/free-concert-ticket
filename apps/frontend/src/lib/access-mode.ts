import type { AccessMode, UserRole } from '@/types/access-mode';

const ACCESS_MODE_KEY = 'access_mode';

export const setAccessMode = (mode: AccessMode): void => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(ACCESS_MODE_KEY, mode);
};

export const getAccessMode = (): AccessMode | null => {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(ACCESS_MODE_KEY);
  if (stored === 'USER' || stored === 'ADMIN') {
    return stored;
  }
  return null;
};

export const clearAccessMode = (): void => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ACCESS_MODE_KEY);
};

/** Redirect path after successful login, based on selected access mode */
export const getPostLoginPath = (): string => {
  return '/home';
};

/** Role sent on sign-up, derived from landing page selection */
export const getSignupRole = (mode: AccessMode): UserRole => {
  return mode;
};

export const getPostLoginPathFromStorage = (): string => getPostLoginPath();

export const getSignupRoleFromStorage = (): UserRole => {
  const mode = getAccessMode();
  return mode ? getSignupRole(mode) : 'USER';
};

import type { AccessMode } from '@/types/access-mode';

/** UI mode capped by real JWT role — non-admins always see user view */
export const getEffectiveAccessMode = (
  sessionMode: AccessMode,
  jwtRole: AccessMode | null,
): AccessMode => {
  if (jwtRole !== 'ADMIN') {
    return 'USER';
  }
  return sessionMode;
};

export const isAdminOnlyPath = (pathname: string): boolean =>
  pathname === '/history' || pathname.startsWith('/home/create');

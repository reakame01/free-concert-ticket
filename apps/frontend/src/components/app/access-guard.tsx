'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAppStore } from '@/context/app-store';
import { isAdminOnlyPath } from '@/lib/role-access';

interface AccessGuardProps {
  children: ReactNode;
}

export const AccessGuard = ({ children }: AccessGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { accessMode, isRoleReady } = useAppStore();

  useEffect(() => {
    if (!isRoleReady) {
      return;
    }
    if (accessMode !== 'ADMIN' && isAdminOnlyPath(pathname)) {
      router.replace('/home');
    }
  }, [isRoleReady, accessMode, pathname, router]);

  if (!isRoleReady) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
};

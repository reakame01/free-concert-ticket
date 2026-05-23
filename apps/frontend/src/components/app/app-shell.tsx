'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AppStoreProvider } from '@/context/app-store';
import { getAccessMode, setAccessMode } from '@/lib/access-mode';
import { isAuthenticated } from '@/lib/auth';
import { AccessGuard } from './access-guard';
import { SideNav } from './side-nav';

interface AppShellProps {
  children: ReactNode;
}

const AppShellInner = ({ children }: AppShellProps) => {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/');
      return;
    }
    const mode = getAccessMode();
    if (!mode) {
      setAccessMode('USER');
    }
  }, [router]);

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <SideNav />
      <main className="ml-56 h-screen overflow-y-auto p-6 lg:ml-64 lg:p-8">
        <AccessGuard>{children}</AccessGuard>
      </main>
    </div>
  );
};

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <AppStoreProvider>
      <AppShellInner>{children}</AppShellInner>
    </AppStoreProvider>
  );
};

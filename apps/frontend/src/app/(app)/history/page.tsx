'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HistoryTable } from '@/components/app/history-table';
import { useAppStore } from '@/context/app-store';

export default function HistoryPage() {
  const router = useRouter();
  const { accessMode, isRoleReady } = useAppStore();

  useEffect(() => {
    if (isRoleReady && accessMode === 'USER') {
      router.replace('/home');
    }
  }, [isRoleReady, accessMode, router]);

  if (!isRoleReady || accessMode === 'USER') {
    return null;
  }

  return <HistoryTable />;
}

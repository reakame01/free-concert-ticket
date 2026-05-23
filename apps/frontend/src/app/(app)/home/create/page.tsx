'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHomeTabs } from '@/components/app/admin-home-tabs';
import { ConcertCreateForm } from '@/components/app/concert-create-form';
import { StatCards } from '@/components/app/stat-cards';
import { useAppStore } from '@/context/app-store';

export default function HomeCreatePage() {
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

  return (
    <>
      <StatCards />
      <AdminHomeTabs />
      <ConcertCreateForm />
    </>
  );
}

'use client';

import { AdminHomeTabs } from '@/components/app/admin-home-tabs';
import { ConcertOverviewList } from '@/components/app/concert-overview-list';
import { StatCards } from '@/components/app/stat-cards';
import { useAppStore } from '@/context/app-store';

export default function HomePage() {
  const { accessMode } = useAppStore();

  if (accessMode === 'USER') {
    return <ConcertOverviewList mode="user" />;
  }

  return (
    <>
      <StatCards />
      <AdminHomeTabs />
      <ConcertOverviewList mode="admin" />
    </>
  );
}

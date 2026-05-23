'use client';

import dynamic from 'next/dynamic';
import { AdminHomeTabs } from '@/components/app/admin-home-tabs';
import { ConcertListSkeleton } from '@/components/app/concert-list-skeleton';
import { StatCards } from '@/components/app/stat-cards';
import { useAppStore } from '@/context/app-store';

const ConcertOverviewList = dynamic(
  () =>
    import('@/components/app/concert-overview-list').then(
      (mod) => mod.ConcertOverviewList,
    ),
  {
    loading: () => <ConcertListSkeleton />,
    ssr: false,
  },
);

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
};

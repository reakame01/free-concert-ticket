'use client';

import { useAppStore } from '@/context/app-store';
import { ConcertCard } from './concert-card';

interface ConcertOverviewListProps {
  mode: 'admin' | 'user';
}

export const ConcertOverviewList = ({ mode }: ConcertOverviewListProps) => {
  const { concerts } = useAppStore();

  return (
    <div className="mt-6 space-y-4">
      {concerts.map((concert) => (
        <ConcertCard key={concert.id} concert={concert} mode={mode} />
      ))}
    </div>
  );
};

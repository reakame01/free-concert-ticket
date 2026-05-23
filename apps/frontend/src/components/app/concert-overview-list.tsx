'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAppStore } from '@/context/app-store';
import { useI18n } from '@/context/i18n-provider';
import { ConcertCard } from './concert-card';

interface ConcertOverviewListProps {
  mode: 'admin' | 'user';
}

export const ConcertOverviewList = ({ mode }: ConcertOverviewListProps) => {
  const {
    concerts,
    isLoadingConcerts,
    isLoadingMoreConcerts,
    hasMoreConcerts,
    isRoleReady,
    loadConcerts,
    loadMoreConcerts,
  } = useAppStore();
  const { t } = useI18n();

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isRoleReady) {
      return;
    }
    void loadConcerts();
  }, [isRoleReady, loadConcerts]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (
        entry?.isIntersecting &&
        hasMoreConcerts &&
        !isLoadingConcerts &&
        !isLoadingMoreConcerts
      ) {
        void loadMoreConcerts();
      }
    },
    [
      hasMoreConcerts,
      isLoadingConcerts,
      isLoadingMoreConcerts,
      loadMoreConcerts,
    ],
  );

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !isRoleReady) {
      return;
    }

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '120px',
      threshold: 0,
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [handleObserver, isRoleReady, concerts.length, hasMoreConcerts]);

  if (!isRoleReady || (isLoadingConcerts && concerts.length === 0)) {
    return (
      <div className="mt-6 flex items-center justify-center py-16 text-gray-500">
        {t('concert.loading')}
      </div>
    );
  }

  if (concerts.length === 0) {
    return (
      <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center text-gray-500">
        {t('concert.empty')}
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {concerts.map((concert) => (
        <ConcertCard key={concert.id} concert={concert} mode={mode} />
      ))}

      <div ref={loadMoreRef} className="h-4 w-full" aria-hidden />

      {isLoadingMoreConcerts ? (
        <div className="py-6 text-center text-sm text-gray-500">
          {t('concert.loadingMore')}
        </div>
      ) : null}

      {!hasMoreConcerts && concerts.length > 0 ? (
        <p className="py-4 text-center text-sm text-gray-400">
          {t('concert.allLoaded')}
        </p>
      ) : null}
    </div>
  );
};

'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import { useAppStore } from '@/context/app-store';
import { useI18n } from '@/context/i18n-provider';
import { HISTORY_PAGE_SIZE } from '@/lib/constants/history';
import type { HistoryEntry } from '@/types/concert';

const getActionLabel = (
  action: HistoryEntry['action'],
  t: (path: string, params?: Record<string, string | number>) => string,
): string => {
  const key = `history.actions.${action}`;
  const label = t(key);
  return label === key ? action : label;
};

export const HistoryTable = () => {
  const {
    history,
    historyPage,
    historyTotal,
    historyHasMore,
    isLoadingHistory,
    loadHistory,
  } = useAppStore();
  const { t } = useI18n();

  useEffect(() => {
    void loadHistory(1);
  }, [loadHistory]);

  const totalPages = Math.max(1, Math.ceil(historyTotal / HISTORY_PAGE_SIZE));

  const handlePrevious = () => {
    if (historyPage > 1 && !isLoadingHistory) {
      void loadHistory(historyPage - 1);
    }
  };

  const handleNext = () => {
    if (historyHasMore && !isLoadingHistory) {
      void loadHistory(historyPage + 1);
    }
  };

  if (isLoadingHistory && history.length === 0) {
    return (
      <div className="mt-6 flex items-center justify-center rounded-lg border border-gray-200 bg-white py-16 text-gray-500 shadow-sm">
        {t('history.loading')}
      </div>
    );
  }

  if (!isLoadingHistory && historyTotal === 0) {
    return (
      <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center text-gray-500 shadow-sm">
        {t('history.empty')}
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 font-semibold text-gray-900">
                {t('history.dateTime')}
              </th>
              <th className="px-6 py-4 font-semibold text-gray-900">
                {t('history.username')}
              </th>
              <th className="px-6 py-4 font-semibold text-gray-900">
                {t('history.concertName')}
              </th>
              <th className="px-6 py-4 font-semibold text-gray-900">
                {t('history.action')}
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map((row, index) => (
              <tr
                key={row.id}
                className={
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/80'
                }
              >
                <td className="px-6 py-4 text-gray-700">{row.dateTime}</td>
                <td className="px-6 py-4 text-gray-700">{row.username}</td>
                <td className="px-6 py-4 text-gray-700">{row.concertName}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      row.action === 'Cancel'
                        ? 'bg-red-100 text-red-700'
                        : row.action === 'Delete'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {getActionLabel(row.action, t)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={historyPage <= 1 || isLoadingHistory}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('history.previous')}
        </button>

        <span className="text-sm text-gray-600">
          {t('history.pageInfo', {
            page: historyPage,
            totalPages,
          })}
        </span>

        <button
          type="button"
          onClick={handleNext}
          disabled={!historyHasMore || isLoadingHistory}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t('history.next')}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

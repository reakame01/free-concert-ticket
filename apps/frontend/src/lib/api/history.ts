import api from '@/lib/api';
import { HISTORY_PAGE_SIZE } from '@/lib/constants/history';
import type { HistoryEntry } from '@/types/concert';

export interface PaginatedHistory {
  items: HistoryEntry[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export const fetchHistoryPage = async (
  page: number,
  limit: number = HISTORY_PAGE_SIZE,
): Promise<PaginatedHistory> => {
  const { data } = await api.get<PaginatedHistory>('/history', {
    params: { page, limit },
  });
  return data;
};

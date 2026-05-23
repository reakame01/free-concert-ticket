import api from '@/lib/api';
import { CONCERT_PAGE_SIZE } from '@/lib/constants/concerts';
import type { Concert } from '@/types/concert';

export interface ConcertStats {
  totalSeats: number;
  totalReserved: number;
  totalCancelled: number;
}

export interface PaginatedConcerts {
  items: Concert[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface CreateConcertPayload {
  name: string;
  description: string;
  totalSeats: number;
}

export const fetchConcertsPage = async (
  page: number,
  limit: number = CONCERT_PAGE_SIZE,
): Promise<PaginatedConcerts> => {
  const { data } = await api.get<PaginatedConcerts>('/concerts', {
    params: { page, limit },
  });
  return data;
};

export const fetchConcertStats = async (): Promise<ConcertStats> => {
  const { data } = await api.get<ConcertStats>('/concerts/stats');
  return data;
};

export const createConcert = async (
  payload: CreateConcertPayload,
): Promise<Concert> => {
  const { data } = await api.post<Concert>('/concerts', payload);
  return data;
};

export const deleteConcert = async (concertId: string): Promise<void> => {
  await api.delete(`/concerts/${concertId}`);
};

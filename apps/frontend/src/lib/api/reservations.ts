import api from '@/lib/api';

export const fetchMyReservations = async (): Promise<string[]> => {
  const { data } = await api.get<string[]>('/reservations/me');
  return data;
};

export const reserveConcert = async (concertId: string): Promise<void> => {
  await api.post(`/reservations/concert/${concertId}`);
};

export const cancelReservation = async (concertId: string): Promise<void> => {
  await api.delete(`/reservations/concert/${concertId}`);
};

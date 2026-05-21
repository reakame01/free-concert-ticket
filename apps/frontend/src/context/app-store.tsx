'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getAccessMode, setAccessMode } from '@/lib/access-mode';
import type { AccessMode } from '@/types/access-mode';
import { INITIAL_CONCERTS, INITIAL_HISTORY } from '@/lib/mock-data';
import type { Concert, HistoryEntry } from '@/types/concert';

interface AppStoreContextValue {
  accessMode: AccessMode;
  concerts: Concert[];
  history: HistoryEntry[];
  userReservations: string[];
  totalSeats: number;
  totalReserved: number;
  totalCancelled: number;
  switchRole: () => void;
  addConcert: (data: {
    name: string;
    description: string;
    totalSeats: number;
  }) => void;
  deleteConcert: (id: string) => void;
  reserveConcert: (id: string, username: string) => void;
  cancelReservation: (id: string, username: string) => void;
  isUserReserved: (concertId: string) => boolean;
}

const AppStoreContext = createContext<AppStoreContextValue | null>(null);

const formatDateTime = (): string => {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

export const AppStoreProvider = ({ children }: { children: ReactNode }) => {
  const [accessMode, setAccessModeState] = useState<AccessMode>(
    () => getAccessMode() ?? 'USER',
  );
  const [concerts, setConcerts] = useState<Concert[]>(INITIAL_CONCERTS);
  const [history, setHistory] = useState<HistoryEntry[]>(INITIAL_HISTORY);
  const [userReservations, setUserReservations] = useState<string[]>(['1']);

  const totalSeats = useMemo(
    () => concerts.reduce((sum, c) => sum + c.totalSeats, 0),
    [concerts],
  );

  const totalReserved = useMemo(
    () => concerts.reduce((sum, c) => sum + c.reservedCount, 0),
    [concerts],
  );

  const totalCancelled = useMemo(
    () => concerts.reduce((sum, c) => sum + c.cancelledCount, 0),
    [concerts],
  );

  const switchRole = useCallback(() => {
    const next: AccessMode = accessMode === 'ADMIN' ? 'USER' : 'ADMIN';
    setAccessMode(next);
    setAccessModeState(next);
  }, [accessMode]);

  const addHistory = useCallback(
    (
      entry: Omit<HistoryEntry, 'id' | 'dateTime'> & { dateTime?: string },
    ) => {
      setHistory((prev) => [
        {
          id: `h-${Date.now()}`,
          dateTime: entry.dateTime ?? formatDateTime(),
          username: entry.username,
          concertName: entry.concertName,
          action: entry.action,
        },
        ...prev,
      ]);
    },
    [],
  );

  const addConcert = useCallback(
    (data: { name: string; description: string; totalSeats: number }) => {
      const newConcert: Concert = {
        id: `c-${Date.now()}`,
        name: data.name,
        description: data.description,
        totalSeats: data.totalSeats,
        reservedCount: 0,
        cancelledCount: 0,
      };
      setConcerts((prev) => [...prev, newConcert]);
    },
    [],
  );

  const deleteConcert = useCallback(
    (id: string) => {
      const concert = concerts.find((c) => c.id === id);
      setConcerts((prev) => prev.filter((c) => c.id !== id));
      setUserReservations((prev) => prev.filter((rid) => rid !== id));
      if (concert) {
        addHistory({
          username: 'Admin',
          concertName: concert.name,
          action: 'Delete',
        });
      }
    },
    [concerts, addHistory],
  );

  const reserveConcert = useCallback(
    (id: string, username: string) => {
      setConcerts((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, reservedCount: c.reservedCount + 1 } : c,
        ),
      );
      setUserReservations((prev) =>
        prev.includes(id) ? prev : [...prev, id],
      );
      const concert = concerts.find((c) => c.id === id);
      if (concert) {
        addHistory({
          username,
          concertName: concert.name,
          action: 'Reserve',
        });
      }
    },
    [concerts, addHistory],
  );

  const cancelReservation = useCallback(
    (id: string, username: string) => {
      setConcerts((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                reservedCount: Math.max(0, c.reservedCount - 1),
                cancelledCount: c.cancelledCount + 1,
              }
            : c,
        ),
      );
      setUserReservations((prev) => prev.filter((rid) => rid !== id));
      const concert = concerts.find((c) => c.id === id);
      if (concert) {
        addHistory({
          username,
          concertName: concert.name,
          action: 'Cancel',
        });
      }
    },
    [concerts, addHistory],
  );

  const isUserReserved = useCallback(
    (concertId: string) => userReservations.includes(concertId),
    [userReservations],
  );

  const value = useMemo(
    () => ({
      accessMode,
      concerts,
      history,
      userReservations,
      totalSeats,
      totalReserved,
      totalCancelled,
      switchRole,
      addConcert,
      deleteConcert,
      reserveConcert,
      cancelReservation,
      isUserReserved,
    }),
    [
      accessMode,
      concerts,
      history,
      userReservations,
      totalSeats,
      totalReserved,
      totalCancelled,
      switchRole,
      addConcert,
      deleteConcert,
      reserveConcert,
      cancelReservation,
      isUserReserved,
    ],
  );

  return (
    <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
  );
};

export const useAppStore = (): AppStoreContextValue => {
  const ctx = useContext(AppStoreContext);
  if (!ctx) {
    throw new Error('useAppStore must be used within AppStoreProvider');
  }
  return ctx;
};

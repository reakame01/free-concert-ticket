'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import toast from 'react-hot-toast';
import { getMe } from '@/lib/api/auth';
import {
  createConcert,
  deleteConcert as deleteConcertApi,
  fetchConcertStats,
  fetchConcertsPage,
} from '@/lib/api/concerts';
import { CONCERT_PAGE_SIZE } from '@/lib/constants/concerts';
import { fetchHistoryPage } from '@/lib/api/history';
import { HISTORY_PAGE_SIZE } from '@/lib/constants/history';
import {
  cancelReservation as cancelReservationApi,
  fetchMyReservations,
  reserveConcert as reserveConcertApi,
} from '@/lib/api/reservations';
import { getApiErrorMessage, isAdminForbiddenError } from '@/lib/api-error';
import { translate } from '@/lib/i18n/translate';
import { getAccessMode, setAccessMode } from '@/lib/access-mode';
import { getEffectiveAccessMode } from '@/lib/role-access';
import type { AccessMode } from '@/types/access-mode';
import type { Concert, HistoryEntry } from '@/types/concert';

interface AppStoreContextValue {
  accessMode: AccessMode;
  isRoleReady: boolean;
  concerts: Concert[];
  history: HistoryEntry[];
  historyPage: number;
  historyTotal: number;
  historyHasMore: boolean;
  userReservations: string[];
  totalSeats: number;
  totalReserved: number;
  totalCancelled: number;
  isLoadingConcerts: boolean;
  isLoadingMoreConcerts: boolean;
  hasMoreConcerts: boolean;
  isLoadingHistory: boolean;
  isCreatingConcert: boolean;
  switchRole: () => void;
  loadConcerts: () => Promise<void>;
  loadMoreConcerts: () => Promise<void>;
  loadHistory: (page?: number) => Promise<void>;
  addConcert: (data: {
    name: string;
    description: string;
    totalSeats: number;
  }) => Promise<void>;
  deleteConcert: (id: string) => Promise<void>;
  reserveConcert: (id: string) => Promise<void>;
  cancelReservation: (id: string) => Promise<void>;
  isUserReserved: (concertId: string) => boolean;
}

const AppStoreContext = createContext<AppStoreContextValue | null>(null);

export const AppStoreProvider = ({ children }: { children: ReactNode }) => {
  const [sessionAccessMode, setSessionAccessMode] = useState<AccessMode>(
    () => getAccessMode() ?? 'USER',
  );
  const [userRole, setUserRole] = useState<AccessMode | null>(null);
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [historyHasMore, setHistoryHasMore] = useState(false);
  const [userReservations, setUserReservations] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalSeats: 0,
    totalReserved: 0,
    totalCancelled: 0,
  });
  const [isLoadingConcerts, setIsLoadingConcerts] = useState(false);
  const [isLoadingMoreConcerts, setIsLoadingMoreConcerts] = useState(false);
  const [hasMoreConcerts, setHasMoreConcerts] = useState(true);
  const [concertsPage, setConcertsPage] = useState(0);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isCreatingConcert, setIsCreatingConcert] = useState(false);

  const isRoleReady = userRole !== null;

  const accessMode = useMemo(
    () => getEffectiveAccessMode(sessionAccessMode, userRole),
    [sessionAccessMode, userRole],
  );

  const applyConcertPage = useCallback(async (page: number, append: boolean) => {
    const data = await fetchConcertsPage(page, CONCERT_PAGE_SIZE);
    setConcerts((prev) => (append ? [...prev, ...data.items] : data.items));
    setConcertsPage(page);
    setHasMoreConcerts(data.hasMore);
  }, []);

  const refreshConcerts = useCallback(async () => {
    try {
      await applyConcertPage(1, false);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, translate('toast.loadConcertsFailed')),
      );
      throw error;
    }
  }, [applyConcertPage]);

  const refreshUserReservations = useCallback(async () => {
    try {
      const data = await fetchMyReservations();
      setUserReservations(data);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, translate('toast.loadReservationsFailed')),
      );
    }
  }, []);

  const loadConcerts = useCallback(async () => {
    setIsLoadingConcerts(true);
    try {
      await applyConcertPage(1, false);
      await refreshUserReservations();
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, translate('toast.loadConcertsFailed')),
      );
    } finally {
      setIsLoadingConcerts(false);
    }
  }, [applyConcertPage, refreshUserReservations]);

  const loadMoreConcerts = useCallback(async () => {
    if (!hasMoreConcerts || isLoadingMoreConcerts || isLoadingConcerts) {
      return;
    }
    setIsLoadingMoreConcerts(true);
    try {
      await applyConcertPage(concertsPage + 1, true);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, translate('toast.loadMoreConcertsFailed')),
      );
    } finally {
      setIsLoadingMoreConcerts(false);
    }
  }, [
    applyConcertPage,
    concertsPage,
    hasMoreConcerts,
    isLoadingConcerts,
    isLoadingMoreConcerts,
  ]);

  const refreshStats = useCallback(async () => {
    if (accessMode !== 'ADMIN') {
      return;
    }
    try {
      const data = await fetchConcertStats();
      setStats(data);
    } catch (error) {
      if (isAdminForbiddenError(error)) {
        return;
      }
      toast.error(
        getApiErrorMessage(error, translate('toast.loadStatsFailed')),
      );
    }
  }, [accessMode]);

  const loadHistory = useCallback(
    async (page = 1) => {
      if (accessMode !== 'ADMIN') {
        return;
      }
      setIsLoadingHistory(true);
      try {
        const data = await fetchHistoryPage(page, HISTORY_PAGE_SIZE);
        setHistory(data.items);
        setHistoryPage(data.page);
        setHistoryTotal(data.total);
        setHistoryHasMore(data.hasMore);
      } catch (error) {
        if (isAdminForbiddenError(error)) {
          return;
        }
        toast.error(
          getApiErrorMessage(error, translate('toast.loadHistoryFailed')),
        );
      } finally {
        setIsLoadingHistory(false);
      }
    },
    [accessMode],
  );

  const refreshHistory = useCallback(async () => {
    await loadHistory(1);
  }, [loadHistory]);

  const refreshAfterMutation = useCallback(async () => {
    setIsLoadingConcerts(true);
    const tasks: Promise<void>[] = [
      refreshConcerts(),
      refreshUserReservations(),
    ];
    if (accessMode === 'ADMIN') {
      tasks.push(refreshStats(), refreshHistory());
    }
    try {
      await Promise.all(tasks);
    } finally {
      setIsLoadingConcerts(false);
    }
  }, [
    accessMode,
    refreshConcerts,
    refreshStats,
    refreshUserReservations,
    refreshHistory,
  ]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await getMe();
        setUserRole(user.role);

        const storedMode = getAccessMode() ?? 'USER';
        if (storedMode === 'ADMIN' && user.role !== 'ADMIN') {
          setAccessMode('USER');
          setSessionAccessMode('USER');
          toast.error(translate('toast.noAdminAccess'));
        }
      } catch {
        setUserRole('USER');
      }
    };
    void loadProfile();
  }, []);


  useEffect(() => {
    if (!isRoleReady || accessMode !== 'ADMIN') {
      return;
    }
    void refreshStats();
  }, [isRoleReady, accessMode, refreshStats]);

  const computedTotals = useMemo(
    () => ({
      totalSeats: concerts.reduce((sum, c) => sum + c.totalSeats, 0),
      totalReserved: concerts.reduce((sum, c) => sum + c.reservedCount, 0),
      totalCancelled: concerts.reduce((sum, c) => sum + c.cancelledCount, 0),
    }),
    [concerts],
  );

  const totalSeats =
    accessMode === 'ADMIN' ? stats.totalSeats : computedTotals.totalSeats;
  const totalReserved =
    accessMode === 'ADMIN' ? stats.totalReserved : computedTotals.totalReserved;
  const totalCancelled =
    accessMode === 'ADMIN'
      ? stats.totalCancelled
      : computedTotals.totalCancelled;

  const switchRole = useCallback(() => {
    if (sessionAccessMode === 'ADMIN') {
      setAccessMode('USER');
      setSessionAccessMode('USER');
      return;
    }

    if (userRole !== 'ADMIN') {
      toast.error(translate('toast.noAdminAccess'));
      return;
    }

    setAccessMode('ADMIN');
    setSessionAccessMode('ADMIN');
  }, [sessionAccessMode, userRole]);

  const addConcert = useCallback(
    async (data: { name: string; description: string; totalSeats: number }) => {
      setIsCreatingConcert(true);
      try {
        await createConcert(data);
        await refreshAfterMutation();
      } catch (error) {
        throw error;
      } finally {
        setIsCreatingConcert(false);
      }
    },
    [refreshAfterMutation],
  );

  const deleteConcert = useCallback(
    async (id: string) => {
      await deleteConcertApi(id);
      await refreshAfterMutation();
    },
    [refreshAfterMutation],
  );

  const reserveConcert = useCallback(
    async (id: string) => {
      await reserveConcertApi(id);
      await refreshAfterMutation();
    },
    [refreshAfterMutation],
  );

  const cancelReservation = useCallback(
    async (id: string) => {
      await cancelReservationApi(id);
      await refreshAfterMutation();
    },
    [refreshAfterMutation],
  );

  const isUserReserved = useCallback(
    (concertId: string) => userReservations.includes(concertId),
    [userReservations],
  );

  const value = useMemo(
    () => ({
      accessMode,
      isRoleReady,
      concerts,
      history,
      historyPage,
      historyTotal,
      historyHasMore,
      userReservations,
      totalSeats,
      totalReserved,
      totalCancelled,
      isLoadingConcerts,
      isLoadingMoreConcerts,
      hasMoreConcerts,
      isLoadingHistory,
      isCreatingConcert,
      switchRole,
      loadConcerts,
      loadMoreConcerts,
      loadHistory,
      addConcert,
      deleteConcert,
      reserveConcert,
      cancelReservation,
      isUserReserved,
    }),
    [
      accessMode,
      isRoleReady,
      concerts,
      history,
      historyPage,
      historyTotal,
      historyHasMore,
      userReservations,
      totalSeats,
      totalReserved,
      totalCancelled,
      isLoadingConcerts,
      isLoadingMoreConcerts,
      hasMoreConcerts,
      isLoadingHistory,
      isCreatingConcert,
      switchRole,
      loadConcerts,
      loadMoreConcerts,
      loadHistory,
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

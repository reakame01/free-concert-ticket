import type { Concert, HistoryEntry } from '@/types/concert';

export const MOCK_PASSWORD = 'admin';

export const INITIAL_CONCERTS: Concert[] = [
  {
    id: '1',
    name: 'Concert Name 1',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    totalSeats: 500,
    reservedCount: 120,
    cancelledCount: 12,
  },
  {
    id: '2',
    name: 'Concert Name 2',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    totalSeats: 200,
    reservedCount: 0,
    cancelledCount: 0,
  },
];

export const INITIAL_HISTORY: HistoryEntry[] = [
  {
    id: 'h1',
    dateTime: '12/09/2024 15:00:00',
    username: 'Sara John',
    concertName: 'The festival Int 2024',
    action: 'Cancel',
  },
  {
    id: 'h2',
    dateTime: '12/09/2024 15:00:00',
    username: 'Sara John',
    concertName: 'The festival Int 2024',
    action: 'Reserve',
  },
  {
    id: 'h3',
    dateTime: '12/09/2024 15:00:00',
    username: 'Sara John',
    concertName: 'The festival Int 2024',
    action: 'Reserve',
  },
];

export interface Concert {
  id: string;
  name: string;
  description: string;
  totalSeats: number;
  reservedCount: number;
  cancelledCount: number;
}

export interface HistoryEntry {
  id: string;
  dateTime: string;
  username: string;
  concertName: string;
  action: 'Reserve' | 'Cancel' | 'Delete';
}

export type ConcertCardAction = 'delete' | 'reserve' | 'cancel';

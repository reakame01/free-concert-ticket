export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
}

export interface Concert {
  id: string;
  name: string;
  description: string;
  totalSeats: number;
  availableSeats: number;
  createdAt: string;
}

export interface Reservation {
  id: string;
  userId: string;
  concertId: string;
  concert?: Concert;
  user?: User;
  createdAt: string;
}

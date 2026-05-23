import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Reservation } from '@/reservations/entities/reservation.entity';
import { HistoryLog } from '@/history/entities/history-log.entity';

@Entity('concerts')
export class Concert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'total_seats', type: 'int' })
  totalSeats: number;

  @Column({ name: 'reserved_count', type: 'int', default: 0 })
  reservedCount: number;

  @Column({ name: 'cancelled_count', type: 'int', default: 0 })
  cancelledCount: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => Reservation, (reservation) => reservation.concert)
  reservations: Reservation[];

  @OneToMany(() => HistoryLog, (log) => log.concert)
  historyLogs: HistoryLog[];
}

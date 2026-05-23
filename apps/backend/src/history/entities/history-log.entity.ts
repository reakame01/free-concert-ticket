import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HistoryAction } from '@/common/enums/history-action.enum';
import { Concert } from '@/concerts/entities/concert.entity';

@Entity('history_logs')
export class HistoryLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'concert_id', type: 'uuid', nullable: true })
  concertId: string | null;

  @Column({ length: 100 })
  username: string;

  @Column({ name: 'concert_name', length: 255 })
  concertName: string;

  @Column({ type: 'enum', enum: HistoryAction })
  action: HistoryAction;

  @CreateDateColumn({ name: 'date_time', type: 'timestamptz' })
  dateTime: Date;

  @ManyToOne(() => Concert, (concert) => concert.historyLogs, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'concert_id' })
  concert: Concert | null;
}

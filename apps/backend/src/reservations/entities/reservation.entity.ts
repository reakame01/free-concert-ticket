import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ReservationStatus } from '@/common/enums/reservation-status.enum';
import { Concert } from '@/concerts/entities/concert.entity';
import { User } from '@/users/entities/user.entity';

@Entity('reservations')
@Unique('UQ_reservations_user_concert', ['userId', 'concertId'])
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'concert_id', type: 'uuid' })
  concertId: string;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.ACTIVE,
  })
  status: ReservationStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.reservations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Concert, (concert) => concert.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'concert_id' })
  concert: Concert;
}

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { HistoryAction } from '@/common/enums/history-action.enum';
import { ReservationStatus } from '@/common/enums/reservation-status.enum';
import { Concert } from '@/concerts/entities/concert.entity';
import { HistoryService } from '@/history/history.service';
import { Reservation } from '@/reservations/entities/reservation.entity';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly historyService: HistoryService,
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
  ) {}

  async getActiveReservationConcertIds(userId: string): Promise<string[]> {
    const reservations = await this.reservationsRepository.find({
      where: { userId, status: ReservationStatus.ACTIVE },
      select: ['concertId'],
    });
    return reservations.map((r) => r.concertId);
  }

  /**
   * Reserves a seat using pessimistic row lock (FOR UPDATE) to prevent race conditions.
   * Unique constraint on (user_id, concert_id) prevents duplicate reservations.
   */
  async reserveConcert(
    userId: string,
    username: string,
    concertId: string,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const concert = await manager
        .getRepository(Concert)
        .createQueryBuilder('concert')
        .setLock('pessimistic_write')
        .where('concert.id = :id', { id: concertId })
        .getOne();

      if (!concert) {
        throw new NotFoundException('Concert not found');
      }

      if (concert.reservedCount >= concert.totalSeats) {
        throw new BadRequestException('Tickets are full');
      }

      const existingActive = await manager.findOne(Reservation, {
        where: {
          userId,
          concertId,
          status: ReservationStatus.ACTIVE,
        },
      });

      if (existingActive) {
        throw new BadRequestException('You have already reserved this concert');
      }

      try {
        const reservation = manager.create(Reservation, {
          userId,
          concertId,
          status: ReservationStatus.ACTIVE,
        });
        await manager.save(reservation);
      } catch (error: unknown) {
        if (this.isUniqueViolation(error)) {
          throw new ConflictException('You have already reserved this concert');
        }
        throw error;
      }

      concert.reservedCount += 1;
      await manager.save(concert);

      await this.historyService.logAction(manager, {
        concertId: concert.id,
        username,
        concertName: concert.name,
        action: HistoryAction.RESERVE,
      });
    });
  }

  async cancelReservation(
    userId: string,
    username: string,
    concertId: string,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const concert = await manager
        .getRepository(Concert)
        .createQueryBuilder('concert')
        .setLock('pessimistic_write')
        .where('concert.id = :id', { id: concertId })
        .getOne();

      if (!concert) {
        throw new NotFoundException('Concert not found');
      }

      const reservation = await manager.findOne(Reservation, {
        where: {
          userId,
          concertId,
          status: ReservationStatus.ACTIVE,
        },
      });

      if (!reservation) {
        throw new BadRequestException('No active reservation found');
      }

      reservation.status = ReservationStatus.CANCELLED;
      await manager.save(reservation);

      concert.reservedCount = Math.max(0, concert.reservedCount - 1);
      concert.cancelledCount += 1;
      await manager.save(concert);

      await this.historyService.logAction(manager, {
        concertId: concert.id,
        username,
        concertName: concert.name,
        action: HistoryAction.CANCEL,
      });
    });
  }

  private isUniqueViolation(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === '23505'
    );
  }
}

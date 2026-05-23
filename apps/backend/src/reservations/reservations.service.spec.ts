import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { HistoryAction } from '@/common/enums/history-action.enum';
import { ReservationStatus } from '@/common/enums/reservation-status.enum';
import { Concert } from '@/concerts/entities/concert.entity';
import { HistoryService } from '@/history/history.service';
import { Reservation } from '@/reservations/entities/reservation.entity';
import { ReservationsService } from '@/reservations/reservations.service';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let reservationsRepository: jest.Mocked<Repository<Reservation>>;
  let dataSource: { transaction: jest.Mock };
  let historyService: { logAction: jest.Mock };

  const userId = 'user-1';
  const username = 'alice';
  const concertId = 'concert-1';

  const mockConcert: Concert = {
    id: concertId,
    name: 'Jazz Night',
    description: 'Live',
    totalSeats: 2,
    reservedCount: 1,
    cancelledCount: 0,
    createdAt: new Date(),
    reservations: [],
    historyLogs: [],
  };

  const buildTransaction = (options: {
    concert?: Concert | null;
    existingReservation?: Reservation | null;
    saveError?: unknown;
  }) => {
    const concertQb = {
      setLock: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(
        options.concert === undefined ? mockConcert : options.concert,
      ),
    };

    const manager = {
      getRepository: jest.fn().mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue(concertQb),
      }),
      findOne: jest.fn().mockResolvedValue(options.existingReservation ?? null),
      create: jest.fn().mockImplementation((_entity, data) => data),
      save: jest.fn().mockImplementation(async (entity) => {
        if (options.saveError) {
          throw options.saveError;
        }
        return entity;
      }),
    };

    dataSource.transaction.mockImplementation(async (cb) => cb(manager));

    return { manager, concertQb };
  };

  beforeEach(async () => {
    dataSource = { transaction: jest.fn() };
    historyService = { logAction: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: { find: jest.fn() },
        },
        { provide: DataSource, useValue: dataSource },
        { provide: HistoryService, useValue: historyService },
      ],
    }).compile();

    service = module.get(ReservationsService);
    reservationsRepository = module.get(getRepositoryToken(Reservation));
  });

  describe('getActiveReservationConcertIds', () => {
    it('returns concert ids for active reservations', async () => {
      reservationsRepository.find.mockResolvedValue([
        { concertId: 'c-1' } as Reservation,
        { concertId: 'c-2' } as Reservation,
      ]);

      await expect(
        service.getActiveReservationConcertIds(userId),
      ).resolves.toEqual(['c-1', 'c-2']);

      expect(reservationsRepository.find).toHaveBeenCalledWith({
        where: { userId, status: ReservationStatus.ACTIVE },
        select: ['concertId'],
      });
    });

    it('returns empty array when user has no active reservations', async () => {
      reservationsRepository.find.mockResolvedValue([]);

      await expect(
        service.getActiveReservationConcertIds(userId),
      ).resolves.toEqual([]);
    });
  });

  describe('reserveConcert', () => {
    it('throws NotFoundException when concert does not exist', async () => {
      buildTransaction({ concert: null });

      await expect(
        service.reserveConcert(userId, username, concertId),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException when tickets are full', async () => {
      buildTransaction({
        concert: { ...mockConcert, reservedCount: 2, totalSeats: 2 },
      });

      await expect(
        service.reserveConcert(userId, username, concertId),
      ).rejects.toThrow(new BadRequestException('Tickets are full'));
    });

    it('throws BadRequestException when user already has active reservation', async () => {
      buildTransaction({
        existingReservation: {
          id: 'res-1',
          userId,
          concertId,
          status: ReservationStatus.ACTIVE,
        } as Reservation,
      });

      await expect(
        service.reserveConcert(userId, username, concertId),
      ).rejects.toThrow(
        new BadRequestException('You have already reserved this concert'),
      );
    });

    it('throws ConflictException on unique constraint violation', async () => {
      buildTransaction({
        saveError: { code: '23505' },
      });

      await expect(
        service.reserveConcert(userId, username, concertId),
      ).rejects.toThrow(ConflictException);
    });

    it('rethrows non-unique database errors', async () => {
      const dbError = new Error('connection lost');
      buildTransaction({ saveError: dbError });

      await expect(
        service.reserveConcert(userId, username, concertId),
      ).rejects.toThrow('connection lost');
    });

    it('increments reserved count and logs reserve on success', async () => {
      const { manager } = buildTransaction({});

      await service.reserveConcert(userId, username, concertId);

      expect(mockConcert.reservedCount).toBe(2);
      expect(manager.save).toHaveBeenCalledWith(mockConcert);
      expect(historyService.logAction).toHaveBeenCalledWith(manager, {
        concertId,
        username,
        concertName: 'Jazz Night',
        action: HistoryAction.RESERVE,
      });
    });
  });

  describe('cancelReservation', () => {
    it('throws NotFoundException when concert does not exist', async () => {
      buildTransaction({ concert: null });

      await expect(
        service.cancelReservation(userId, username, concertId),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException when no active reservation exists', async () => {
      buildTransaction({ existingReservation: null });

      await expect(
        service.cancelReservation(userId, username, concertId),
      ).rejects.toThrow(
        new BadRequestException('No active reservation found'),
      );
    });

    it('cancels reservation, updates counts, and logs cancel', async () => {
      const reservation = {
        id: 'res-1',
        userId,
        concertId,
        status: ReservationStatus.ACTIVE,
      } as Reservation;
      const concert = { ...mockConcert, reservedCount: 0 };
      const { manager } = buildTransaction({
        concert,
        existingReservation: reservation,
      });

      await service.cancelReservation(userId, username, concertId);

      expect(reservation.status).toBe(ReservationStatus.CANCELLED);
      expect(concert.reservedCount).toBe(0);
      expect(concert.cancelledCount).toBe(1);
      expect(manager.save).toHaveBeenCalledWith(reservation);
      expect(manager.save).toHaveBeenCalledWith(concert);
      expect(historyService.logAction).toHaveBeenCalledWith(manager, {
        concertId,
        username,
        concertName: 'Jazz Night',
        action: HistoryAction.CANCEL,
      });
    });

    it('does not let reservedCount go below zero', async () => {
      const reservation = {
        id: 'res-1',
        userId,
        concertId,
        status: ReservationStatus.ACTIVE,
      } as Reservation;
      const concert = { ...mockConcert, reservedCount: 0 };
      buildTransaction({ concert, existingReservation: reservation });

      await service.cancelReservation(userId, username, concertId);

      expect(concert.reservedCount).toBe(0);
    });
  });
});

import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { HistoryAction } from '@/common/enums/history-action.enum';
import { HistoryService } from '@/history/history.service';
import { Concert } from './entities/concert.entity';
import { ConcertsService } from './concerts.service';

describe('ConcertsService', () => {
  let service: ConcertsService;
  let concertsRepository: jest.Mocked<Repository<Concert>>;
  let dataSource: { transaction: jest.Mock };
  let historyService: { logAction: jest.Mock };

  const mockConcert: Concert = {
    id: 'concert-1',
    name: '  Jazz Night  ',
    description: '  Live music  ',
    totalSeats: 100,
    reservedCount: 10,
    cancelledCount: 2,
    createdAt: new Date('2026-01-01'),
    reservations: [],
    historyLogs: [],
  };

  beforeEach(async () => {
    dataSource = { transaction: jest.fn() };
    historyService = { logAction: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertsService,
        {
          provide: getRepositoryToken(Concert),
          useValue: {
            findAndCount: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        { provide: DataSource, useValue: dataSource },
        { provide: HistoryService, useValue: historyService },
      ],
    }).compile();

    service = module.get(ConcertsService);
    concertsRepository = module.get(getRepositoryToken(Concert));
  });

  describe('findPaginated', () => {
    it('returns first page with hasMore true when more items exist', async () => {
      concertsRepository.findAndCount.mockResolvedValue([
        [mockConcert],
        10,
      ]);

      const result = await service.findPaginated(1, 4);

      expect(concertsRepository.findAndCount).toHaveBeenCalledWith({
        order: { createdAt: 'ASC' },
        skip: 0,
        take: 4,
      });
      expect(result).toEqual({
        items: [
          {
            id: 'concert-1',
            name: '  Jazz Night  ',
            description: '  Live music  ',
            totalSeats: 100,
            reservedCount: 10,
            cancelledCount: 2,
          },
        ],
        total: 10,
        page: 1,
        limit: 4,
        hasMore: true,
      });
    });

    it('returns hasMore false on last page', async () => {
      concertsRepository.findAndCount.mockResolvedValue([[], 8]);

      const result = await service.findPaginated(2, 4);

      expect(result.hasMore).toBe(false);
      expect(result.items).toEqual([]);
    });

    it('calculates skip for page 3', async () => {
      concertsRepository.findAndCount.mockResolvedValue([[mockConcert], 9]);

      await service.findPaginated(3, 4);

      expect(concertsRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 8, take: 4 }),
      );
    });
  });

  describe('getStats', () => {
    it('returns zeros when query returns undefined', async () => {
      const qb = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(undefined),
      };
      concertsRepository.createQueryBuilder.mockReturnValue(
        qb as never,
      );

      await expect(service.getStats()).resolves.toEqual({
        totalSeats: 0,
        totalReserved: 0,
        totalCancelled: 0,
      });
    });

    it('parses string aggregates from database', async () => {
      const qb = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({
          totalSeats: '500',
          totalReserved: '120',
          totalCancelled: '12',
        }),
      };
      concertsRepository.createQueryBuilder.mockReturnValue(
        qb as never,
      );

      await expect(service.getStats()).resolves.toEqual({
        totalSeats: 500,
        totalReserved: 120,
        totalCancelled: 12,
      });
    });
  });

  describe('create', () => {
    it('trims name and description and initializes counts', async () => {
      const created = { ...mockConcert, name: 'Jazz Night', description: 'Live music' };
      concertsRepository.create.mockReturnValue(created as Concert);
      concertsRepository.save.mockResolvedValue(created as Concert);

      const result = await service.create({
        name: '  Jazz Night  ',
        description: '  Live music  ',
        totalSeats: 100,
      });

      expect(concertsRepository.create).toHaveBeenCalledWith({
        name: 'Jazz Night',
        description: 'Live music',
        totalSeats: 100,
        reservedCount: 0,
        cancelledCount: 0,
      });
      expect(result.name).toBe('Jazz Night');
    });
  });

  describe('delete', () => {
    it('throws NotFoundException when concert does not exist', async () => {
      const concertQb = {
        setLock: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      const manager = {
        getRepository: jest.fn().mockReturnValue({
          createQueryBuilder: jest.fn().mockReturnValue(concertQb),
        }),
        remove: jest.fn(),
      };

      dataSource.transaction.mockImplementation(async (cb) => cb(manager));

      await expect(
        service.delete('missing', 'admin'),
      ).rejects.toThrow(NotFoundException);
      expect(historyService.logAction).not.toHaveBeenCalled();
    });

    it('logs delete action and removes concert', async () => {
      const concertQb = {
        setLock: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockConcert),
      };
      const manager = {
        getRepository: jest.fn().mockReturnValue({
          createQueryBuilder: jest.fn().mockReturnValue(concertQb),
        }),
        remove: jest.fn().mockResolvedValue(undefined),
      };

      dataSource.transaction.mockImplementation(async (cb) => cb(manager));

      await service.delete('concert-1', 'admin');

      expect(historyService.logAction).toHaveBeenCalledWith(manager, {
        concertId: 'concert-1',
        username: 'admin',
        concertName: '  Jazz Night  ',
        action: HistoryAction.DELETE,
      });
      expect(manager.remove).toHaveBeenCalledWith(mockConcert);
    });
  });
});

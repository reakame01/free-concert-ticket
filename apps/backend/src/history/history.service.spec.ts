import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { HistoryAction } from '@/common/enums/history-action.enum';
import { HistoryLog } from './entities/history-log.entity';
import { HistoryService } from './history.service';

describe('HistoryService', () => {
  let service: HistoryService;
  let repository: jest.Mocked<Repository<HistoryLog>>;

  const logDate = new Date('2026-05-20T14:30:45Z');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistoryService,
        {
          provide: getRepositoryToken(HistoryLog),
          useValue: { findAndCount: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(HistoryService);
    repository = module.get(getRepositoryToken(HistoryLog));
  });

  describe('findPaginated', () => {
    it('returns empty first page when no logs exist', async () => {
      repository.findAndCount.mockResolvedValue([[], 0]);

      await expect(service.findPaginated(1, 10)).resolves.toEqual({
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        hasMore: false,
      });
    });

    it('maps logs with formatted date and pagination metadata', async () => {
      repository.findAndCount.mockResolvedValue([
        [
          {
            id: 'log-1',
            dateTime: logDate,
            username: 'alice',
            concertName: 'Jazz Night',
            action: HistoryAction.RESERVE,
            concertId: 'concert-1',
          } as HistoryLog,
        ],
        25,
      ]);

      const result = await service.findPaginated(1, 10);

      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toMatchObject({
        id: 'log-1',
        username: 'alice',
        concertName: 'Jazz Night',
        action: HistoryAction.RESERVE,
      });
      expect(result.items[0].dateTime).toMatch(
        /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/,
      );
      expect(result.hasMore).toBe(true);
      expect(result.total).toBe(25);
    });

    it('returns hasMore true when more pages exist', async () => {
      repository.findAndCount.mockResolvedValue([[], 25]);

      const result = await service.findPaginated(1, 10);

      expect(result.hasMore).toBe(true);
      expect(result.total).toBe(25);
    });

    it('calculates skip for page 2', async () => {
      repository.findAndCount.mockResolvedValue([[], 25]);

      await service.findPaginated(2, 10);

      expect(repository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 10 }),
      );
    });
  });

  describe('logAction', () => {
    it('creates and saves history log via entity manager', async () => {
      const createdLog = { id: 'new-log' };
      const manager = {
        create: jest.fn().mockReturnValue(createdLog),
        save: jest.fn().mockResolvedValue(createdLog),
      } as unknown as EntityManager;

      await service.logAction(manager, {
        concertId: 'concert-1',
        username: 'alice',
        concertName: 'Jazz Night',
        action: HistoryAction.CANCEL,
      });

      expect(manager.create).toHaveBeenCalledWith(HistoryLog, {
        concertId: 'concert-1',
        username: 'alice',
        concertName: 'Jazz Night',
        action: HistoryAction.CANCEL,
      });
      expect(manager.save).toHaveBeenCalledWith(createdLog);
    });

    it('allows null concertId for deleted concerts', async () => {
      const manager = {
        create: jest.fn().mockReturnValue({}),
        save: jest.fn().mockResolvedValue({}),
      } as unknown as EntityManager;

      await service.logAction(manager, {
        concertId: null,
        username: 'admin',
        concertName: 'Removed Show',
        action: HistoryAction.DELETE,
      });

      expect(manager.create).toHaveBeenCalledWith(
        HistoryLog,
        expect.objectContaining({ concertId: null }),
      );
    });
  });
});

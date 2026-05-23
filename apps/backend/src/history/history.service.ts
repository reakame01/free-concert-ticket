import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { HistoryAction } from '@/common/enums/history-action.enum';
import { formatDateTimeDisplay } from '@/common/utils/format-datetime';
import { HistoryResponseDto } from '@/history/dto/history-response.dto';
import { HistoryLog } from '@/history/entities/history-log.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(HistoryLog)
    private readonly historyRepository: Repository<HistoryLog>,
  ) {}

  async findPaginated(
    page: number,
    limit: number,
  ): Promise<{
    items: HistoryResponseDto[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }> {
    const [logs, total] = await this.historyRepository.findAndCount({
      order: { dateTime: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items: logs.map((log) => this.toResponse(log)),
      total,
      page,
      limit,
      hasMore: page * limit < total,
    };
  }

  private toResponse(log: HistoryLog): HistoryResponseDto {
    return {
      id: log.id,
      dateTime: formatDateTimeDisplay(log.dateTime),
      username: log.username,
      concertName: log.concertName,
      action: log.action,
    };
  }

  async logAction(
    manager: EntityManager,
    data: {
      concertId: string | null;
      username: string;
      concertName: string;
      action: HistoryAction;
    },
  ): Promise<void> {
    const log = manager.create(HistoryLog, {
      concertId: data.concertId,
      username: data.username,
      concertName: data.concertName,
      action: data.action,
    });
    await manager.save(log);
  }
}

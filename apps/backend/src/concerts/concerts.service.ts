import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { HistoryAction } from '@/common/enums/history-action.enum';
import { HistoryService } from '@/history/history.service';
import { Concert } from './entities/concert.entity';
import { CreateConcertDto } from './dto/create-concert.dto';
import {
  ConcertResponseDto,
  ConcertStatsResponseDto,
} from './dto/concert-response.dto';
import { PaginatedConcertsResponseDto } from './dto/paginated-concerts-response.dto';

@Injectable()
export class ConcertsService {
  constructor(
    @InjectRepository(Concert)
    private readonly concertsRepository: Repository<Concert>,
    private readonly dataSource: DataSource,
    private readonly historyService: HistoryService,
  ) {}

  async findPaginated(
    page: number,
    limit: number,
  ): Promise<PaginatedConcertsResponseDto> {
    const [concerts, total] = await this.concertsRepository.findAndCount({
      order: { createdAt: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items: concerts.map((concert) => this.toResponse(concert)),
      total,
      page,
      limit,
      hasMore: page * limit < total,
    };
  }

  async getStats(): Promise<ConcertStatsResponseDto> {
    const result = await this.concertsRepository
      .createQueryBuilder('concert')
      .select('COALESCE(SUM(concert.totalSeats), 0)', 'totalSeats')
      .addSelect('COALESCE(SUM(concert.reservedCount), 0)', 'totalReserved')
      .addSelect('COALESCE(SUM(concert.cancelledCount), 0)', 'totalCancelled')
      .getRawOne<{
        totalSeats: string;
        totalReserved: string;
        totalCancelled: string;
      }>();

    return {
      totalSeats: Number(result?.totalSeats ?? 0),
      totalReserved: Number(result?.totalReserved ?? 0),
      totalCancelled: Number(result?.totalCancelled ?? 0),
    };
  }

  async create(dto: CreateConcertDto): Promise<ConcertResponseDto> {
    const concert = this.concertsRepository.create({
      name: dto.name.trim(),
      description: dto.description.trim(),
      totalSeats: dto.totalSeats,
      reservedCount: 0,
      cancelledCount: 0,
    });

    const saved = await this.concertsRepository.save(concert);
    return this.toResponse(saved);
  }

  async delete(concertId: string, adminUsername: string): Promise<void> {
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

      await this.historyService.logAction(manager, {
        concertId: concert.id,
        username: adminUsername,
        concertName: concert.name,
        action: HistoryAction.DELETE,
      });

      await manager.remove(concert);
    });
  }

  private toResponse(concert: Concert): ConcertResponseDto {
    return {
      id: concert.id,
      name: concert.name,
      description: concert.description,
      totalSeats: concert.totalSeats,
      reservedCount: concert.reservedCount,
      cancelledCount: concert.cancelledCount,
    };
  }
}

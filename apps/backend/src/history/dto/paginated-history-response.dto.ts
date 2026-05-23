import { ApiProperty } from '@nestjs/swagger';
import { HistoryResponseDto } from '@/history/dto/history-response.dto';

export class PaginatedHistoryResponseDto {
  @ApiProperty({ type: [HistoryResponseDto] })
  items: HistoryResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  hasMore: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import { ConcertResponseDto } from './concert-response.dto';

export class PaginatedConcertsResponseDto {
  @ApiProperty({ type: [ConcertResponseDto] })
  items: ConcertResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  hasMore: boolean;
}

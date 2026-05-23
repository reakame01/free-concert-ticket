import { ApiProperty } from '@nestjs/swagger';

export class ConcertResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  totalSeats: number;

  @ApiProperty()
  reservedCount: number;

  @ApiProperty()
  cancelledCount: number;
}

export class ConcertStatsResponseDto {
  @ApiProperty()
  totalSeats: number;

  @ApiProperty()
  totalReserved: number;

  @ApiProperty()
  totalCancelled: number;
}

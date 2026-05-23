import { ApiProperty } from '@nestjs/swagger';
import { HistoryAction } from '@/common/enums/history-action.enum';

export class HistoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: '12/09/2024 15:00:00' })
  dateTime: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  concertName: string;

  @ApiProperty({ enum: HistoryAction })
  action: HistoryAction;
}

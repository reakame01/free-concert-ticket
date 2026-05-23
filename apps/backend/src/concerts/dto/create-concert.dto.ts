import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateConcertDto {
  @ApiProperty({ example: 'Summer Festival 2026' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'An amazing outdoor concert experience.' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  description: string;

  @ApiProperty({ example: 500 })
  @IsInt()
  @Min(1)
  totalSeats: number;
}

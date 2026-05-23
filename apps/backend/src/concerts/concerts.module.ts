import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryModule } from '@/history/history.module';
import { Concert } from '@/concerts/entities/concert.entity';
import { ConcertsController } from '@/concerts/concerts.controller';
import { ConcertsService } from '@/concerts/concerts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Concert]), HistoryModule],
  controllers: [ConcertsController],
  providers: [ConcertsService],
})
export class ConcertsModule {}

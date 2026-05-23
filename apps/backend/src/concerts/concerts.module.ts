import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryModule } from '@/history/history.module';
import { Concert } from './entities/concert.entity';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Concert]), HistoryModule],
  controllers: [ConcertsController],
  providers: [ConcertsService],
})
export class ConcertsModule {}

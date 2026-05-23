import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryLog } from '@/history/entities/history-log.entity';
import { HistoryController } from '@/history/history.controller';
import { HistoryService } from '@/history/history.service';

@Module({
  imports: [TypeOrmModule.forFeature([HistoryLog])],
  controllers: [HistoryController],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}

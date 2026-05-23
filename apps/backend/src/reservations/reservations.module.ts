import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryModule } from '@/history/history.module';
import { Reservation } from '@/reservations/entities/reservation.entity';
import { ReservationsController } from '@/reservations/reservations.controller';
import { ReservationsService } from '@/reservations/reservations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation]), HistoryModule],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { SeatsModule } from '../seats/seats.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    SeatsModule, // 🔴 IMPORT SeatsModule
  ],
  providers: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule {}

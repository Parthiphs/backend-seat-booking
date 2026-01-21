import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat } from './seat.entity';
import { SeatsService } from './seats.service';
import { SeatsController } from './seats.controller';
import { SeatsSeedService } from './seats.seed';

@Module({
  imports: [TypeOrmModule.forFeature([Seat])],
  providers: [SeatsService, SeatsSeedService],
  controllers: [SeatsController],
  exports: [TypeOrmModule], // 🔴 VERY IMPORTANT
})
export class SeatsModule {}


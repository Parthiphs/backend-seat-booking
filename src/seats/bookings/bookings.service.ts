import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seat, SeatStatus } from '../seats/seat.entity';
import { Booking } from './booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Seat)
    private seatRepo: Repository<Seat>,
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
  ) {}

  async confirmBooking(seatId: number) {
    const seat = await this.seatRepo.findOne({ where: { id: seatId } });

    if (!seat || seat.status !== SeatStatus.HELD) {
      throw new Error('Seat not available for booking');
    }

    seat.status = SeatStatus.BOOKED;
    seat.holdExpiresAt = null;
    await this.seatRepo.save(seat);

    const booking = this.bookingRepo.create({
      seatId: seat.id,
      showId: seat.showId,
      status: 'CONFIRMED',
    });

    return this.bookingRepo.save(booking);
  }
}

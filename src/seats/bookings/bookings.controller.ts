import { Controller, Post, Param } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post(':seatId/confirm')
  async confirm(@Param('seatId') seatId: number) {
    return this.bookingsService.confirmBooking(seatId);
  }
}

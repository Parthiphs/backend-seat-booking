import { Controller, Get, Post, Param, Body, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { SeatsService } from './seats.service';

@Controller('seats')
export class SeatsController {
  constructor(private seatsService: SeatsService) {}

  @Get('shows/all')
  async getAllShows() {
    try {
      return await this.seatsService.getAllShows();
    } catch (error) {
      throw new HttpException('Failed to fetch shows', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':showId/availability')
  async getAvailability(@Param('showId') showId: number) {
    try {
      return await this.seatsService.getAvailability(showId);
    } catch (error) {
      throw new HttpException('Failed to fetch availability', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':showId/list')
  async getAllSeats(@Param('showId') showId: number) {
    try {
      return await this.seatsService.getAllSeats(showId);
    } catch (error) {
      throw new HttpException('Failed to fetch seats', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(':showId/hold')
  async holdSeats(
    @Param('showId') showId: number,
    @Body() body: { seatIds: number[] }
  ) {
    if (!body || !body.seatIds || !Array.isArray(body.seatIds) || body.seatIds.length === 0) {
      throw new BadRequestException('seatIds must be a non-empty array');
    }

    try {
      const success = await this.seatsService.holdSeats(showId, body.seatIds);
      
      if (!success) {
        throw new HttpException(
          'Failed to hold seats. Some seats may not be available.',
          HttpStatus.BAD_REQUEST
        );
      }

      return { 
        success: true, 
        message: `${body.seatIds.length} seat(s) held for 5 minutes. Complete your booking!`,
        seatIds: body.seatIds,
        expiresIn: 300 // 5 minutes in seconds
      };
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error?.message || 'Failed to hold seats',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post(':showId/book')
  async bookSeats(
    @Param('showId') showId: number,
    @Body() body: { seatIds: number[] }
  ) {
    if (!body || !body.seatIds || !Array.isArray(body.seatIds) || body.seatIds.length === 0) {
      throw new BadRequestException('seatIds must be a non-empty array');
    }

    try {
      const success = await this.seatsService.bookSeats(body.seatIds);

      if (!success) {
        throw new HttpException(
          'Failed to book seats. Hold period may have expired or seats are no longer held.',
          HttpStatus.BAD_REQUEST
        );
      }

      return { 
        success: true, 
        message: `${body.seatIds.length} seat(s) successfully booked!`,
        seatIds: body.seatIds
      };
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error?.message || 'Failed to book seats',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

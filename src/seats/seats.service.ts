// This module handles seat availability and booking behavior for movie shows.
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, In } from 'typeorm';
import { Seat, SeatStatus } from './seat.entity';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seat)
    private seatRepo: Repository<Seat>,
  ) {}

  async getAvailability(showId: number) {
    await this.releaseExpiredHolds();

    return {
      available: await this.seatRepo.count({ where: { showId, status: SeatStatus.AVAILABLE } }),
      held: await this.seatRepo.count({ where: { showId, status: SeatStatus.HELD } }),
      booked: await this.seatRepo.count({ where: { showId, status: SeatStatus.BOOKED } }),
    };
  }

  async getAllShows() {
    await this.releaseExpiredHolds();

    // Get all unique showIds
    const shows = await this.seatRepo
      .createQueryBuilder('seat')
      .select('DISTINCT seat.showId', 'showId')
      .orderBy('seat.showId', 'ASC')
      .getRawMany();

    // For each show, get availability
    const showsWithAvailability = await Promise.all(
      shows.map(async (show) => ({
        id: show.showId,
        ...await this.getAvailability(show.showId),
      })),
    );

    return showsWithAvailability;
  }

  async getAllSeats(showId: number) {
    await this.releaseExpiredHolds();
    
    return this.seatRepo.find({
      where: { showId },
      order: { id: 'ASC' },
    });
  }

  async holdSeat(showId: number) {
    await this.releaseExpiredHolds();
    // Atomically update a single available seat to HELD
    const holdExpiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 mins
    const qb = this.seatRepo.createQueryBuilder();
    const result = await qb
      .update(Seat)
      .set({ status: SeatStatus.HELD, holdExpiresAt })
      .where('showId = :showId', { showId })
      .andWhere('status = :available', { available: SeatStatus.AVAILABLE })
      .limit(1)
      .execute();

    if (!result.affected || result.affected === 0) {
      throw new Error('No seats available');
    }

    // Return the seat by querying the first held seat for this show
    const seat = await this.seatRepo.findOne({ where: { showId, status: SeatStatus.HELD } });
    return seat;
  }

  async releaseExpiredHolds() {
    await this.seatRepo.update(
      {
        status: SeatStatus.HELD,
        holdExpiresAt: LessThan(new Date()),
      },
      {
        status: SeatStatus.AVAILABLE,
        holdExpiresAt: null,
      },
    );
  }

  async holdSeats(showId: number, seatIds: number[]): Promise<boolean> {
    await this.releaseExpiredHolds();
    // Atomically update the requested seats to HELD only if they are all AVAILABLE
    const holdExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    const qb = this.seatRepo.createQueryBuilder();
    const result = await qb
      .update(Seat)
      .set({ status: SeatStatus.HELD, holdExpiresAt })
      .where('showId = :showId', { showId })
      .andWhere('id IN (:...ids)', { ids: seatIds })
      .andWhere('status = :available', { available: SeatStatus.AVAILABLE })
      .execute();

    // If the number of affected rows doesn't match requested seats, rollback (release any partial changes)
    if (!result.affected || result.affected !== seatIds.length) {
      // best-effort release of any seats that may have been set to HELD
      await this.releaseHeldSeats(seatIds);
      return false;
    }

    return true;
  }

  async releaseHeldSeats(seatIds: number[]): Promise<void> {
    await this.seatRepo.update(
      { id: In(seatIds), status: SeatStatus.HELD },
      { status: SeatStatus.AVAILABLE, holdExpiresAt: null },
    );
  }

  async bookSeats(seatIds: number[]): Promise<boolean> {
    // Atomically book seats only if they are currently HELD
    const qb = this.seatRepo.createQueryBuilder();
    const result = await qb
      .update(Seat)
      .set({ status: SeatStatus.BOOKED, holdExpiresAt: null })
      .where('id IN (:...ids)', { ids: seatIds })
      .andWhere('status = :held', { held: SeatStatus.HELD })
      .execute();

    if (!result.affected || result.affected !== seatIds.length) {
      // release any held seats to avoid partial holds
      await this.releaseHeldSeats(seatIds);
      return false;
    }

    return true;
  }

  async getHeldSeatsCount(showId: number): Promise<number> {
    return this.seatRepo.count({ where: { showId, status: SeatStatus.HELD } });
  }

  async getBookedSeatsCount(showId: number): Promise<number> {
    return this.seatRepo.count({ where: { showId, status: SeatStatus.BOOKED } });
  }

  async getAvailableSeatsCount(showId: number): Promise<number> {
    return this.seatRepo.count({ where: { showId, status: SeatStatus.AVAILABLE } });
  }
}

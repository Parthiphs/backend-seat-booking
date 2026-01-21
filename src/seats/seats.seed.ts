import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seat, SeatStatus } from './seat.entity';

@Injectable()
export class SeatsSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Seat)
    private seatRepo: Repository<Seat>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    // Check if seats already exist
    const existingSeats = await this.seatRepo.count();
    
    if (existingSeats > 0) {
      console.log('Seats already exist. Skipping seed.');
      return;
    }

    console.log('Seeding seats for 3 shows...');
    
    const seats: Seat[] = [];

    // Show 1: The Avengers: Endgame (25 Available, 14 On Hold, 11 Booked)
    console.log('Show 1: The Avengers: Endgame - 25 Available, 14 On Hold, 11 Booked');
    const holdExpiresAt1 = new Date(Date.now() + 5 * 60 * 1000);
    for (let i = 1; i <= 25; i++) {
      seats.push(this.seatRepo.create({ showId: 1, status: SeatStatus.AVAILABLE, holdExpiresAt: null }));
    }
    for (let i = 26; i <= 39; i++) {
      seats.push(this.seatRepo.create({ showId: 1, status: SeatStatus.HELD, holdExpiresAt: holdExpiresAt1 }));
    }
    for (let i = 40; i <= 50; i++) {
      seats.push(this.seatRepo.create({ showId: 1, status: SeatStatus.BOOKED, holdExpiresAt: null }));
    }

    // Show 2: Inception (35 Available, 8 On Hold, 7 Booked)
    console.log('Show 2: Inception - 35 Available, 8 On Hold, 7 Booked');
    const holdExpiresAt2 = new Date(Date.now() + 5 * 60 * 1000);
    for (let i = 1; i <= 35; i++) {
      seats.push(this.seatRepo.create({ showId: 2, status: SeatStatus.AVAILABLE, holdExpiresAt: null }));
    }
    for (let i = 36; i <= 43; i++) {
      seats.push(this.seatRepo.create({ showId: 2, status: SeatStatus.HELD, holdExpiresAt: holdExpiresAt2 }));
    }
    for (let i = 44; i <= 50; i++) {
      seats.push(this.seatRepo.create({ showId: 2, status: SeatStatus.BOOKED, holdExpiresAt: null }));
    }

    // Show 3: The Dark Knight (20 Available, 18 On Hold, 12 Booked)
    console.log('Show 3: The Dark Knight - 20 Available, 18 On Hold, 12 Booked');
    const holdExpiresAt3 = new Date(Date.now() + 5 * 60 * 1000);
    for (let i = 1; i <= 20; i++) {
      seats.push(this.seatRepo.create({ showId: 3, status: SeatStatus.AVAILABLE, holdExpiresAt: null }));
    }
    for (let i = 21; i <= 38; i++) {
      seats.push(this.seatRepo.create({ showId: 3, status: SeatStatus.HELD, holdExpiresAt: holdExpiresAt3 }));
    }
    for (let i = 39; i <= 50; i++) {
      seats.push(this.seatRepo.create({ showId: 3, status: SeatStatus.BOOKED, holdExpiresAt: null }));
    }

    await this.seatRepo.save(seats);
    console.log('✅ Successfully seeded seats for 3 shows (150 total seats)');
  }
}

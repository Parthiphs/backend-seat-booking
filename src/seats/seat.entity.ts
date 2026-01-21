import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  HELD = 'HELD',
  BOOKED = 'BOOKED',
}

@Entity()
export class Seat {
  isBooked: boolean;
  isHeld: boolean;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  showId: number;

  @Column({
    type: 'varchar',
    default: SeatStatus.AVAILABLE,
  })
  status: SeatStatus;

  @Column({ type: 'datetime', nullable: true })
  holdExpiresAt: Date | null;
}

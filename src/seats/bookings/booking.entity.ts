import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seatId: number;

  @Column()
  showId: number;

  @Column()
  status: string;
}


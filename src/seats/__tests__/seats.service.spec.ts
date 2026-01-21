import { Repository } from 'typeorm';
import { SeatsService } from '../seats.service';
import { Seat, SeatStatus } from '../seat.entity';

type MockRepo = Partial<Record<keyof Repository<Seat>, jest.Mock>>;

const createMockRepo = (overrides: MockRepo = {}) => {
  return {
    count: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn(),
    ...overrides,
  } as unknown as Repository<Seat>;
};

describe('SeatsService', () => {
  let service: SeatsService;
  let repo: Repository<Seat> & Record<string, jest.Mock>;

  beforeEach(() => {
    repo = createMockRepo() as any;
    service = new SeatsService(repo as any);
  });

  test('getAvailability returns counts and calls releaseExpiredHolds', async () => {
    repo.update.mockResolvedValue(undefined);
    repo.count.mockImplementation(({ where }: any) => {
      if (where.status === SeatStatus.AVAILABLE) return Promise.resolve(10);
      if (where.status === SeatStatus.HELD) return Promise.resolve(2);
      if (where.status === SeatStatus.BOOKED) return Promise.resolve(3);
      return Promise.resolve(0);
    });

    const result = await service.getAvailability(1);

    expect(result).toEqual({ available: 10, held: 2, booked: 3 });
    expect(repo.update).toHaveBeenCalled(); // releaseExpiredHolds invoked
  });

  test('holdSeats returns false when some seats are missing', async () => {
    // simulate query builder affected only 1 when 2 requested
    const qb = {
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    repo.createQueryBuilder.mockReturnValue(qb as any);

    const ok = await service.holdSeats(1, [1, 2]);
    expect(ok).toBe(false);
  });

  test('holdSeats returns false when seats not all available', async () => {
    const qb = {
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    repo.createQueryBuilder.mockReturnValue(qb as any);

    const ok = await service.holdSeats(1, [1, 2]);
    expect(ok).toBe(false);
  });

  test('holdSeats holds seats and sets expiry', async () => {
    const qb = {
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ affected: 2 }),
    };
    repo.createQueryBuilder.mockReturnValue(qb as any);

    const ok = await service.holdSeats(1, [1, 2]);
    expect(ok).toBe(true);
  });

  test('bookSeats returns false when seats length mismatch', async () => {
    const qb = {
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    repo.createQueryBuilder.mockReturnValue(qb as any);

    const ok = await service.bookSeats([1, 2]);
    expect(ok).toBe(false);
  });

  test('bookSeats returns false and releases held seats when not all HELD', async () => {
    const qb = {
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    repo.createQueryBuilder.mockReturnValue(qb as any);
    const releaseSpy = jest.spyOn(service, 'releaseHeldSeats');

    const ok = await service.bookSeats([1, 2]);
    expect(ok).toBe(false);
    expect(releaseSpy).toHaveBeenCalledWith([1, 2]);
  });

  test('bookSeats books seats when all HELD', async () => {
    const qb = {
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ affected: 2 }),
    };
    repo.createQueryBuilder.mockReturnValue(qb as any);

    const ok = await service.bookSeats([1, 2]);
    expect(ok).toBe(true);
  });

  test('releaseExpiredHolds calls repo.update', async () => {
    repo.update.mockResolvedValue(undefined);
    await service.releaseExpiredHolds();
    expect(repo.update).toHaveBeenCalled();
  });
});

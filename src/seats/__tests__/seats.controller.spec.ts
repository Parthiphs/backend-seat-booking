import { SeatsController } from '../seats.controller';
import { SeatsService } from '../seats.service';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

describe('SeatsController', () => {
  let controller: SeatsController;
  let mockService: Partial<Record<keyof SeatsService, jest.Mock>>;

  beforeEach(() => {
    mockService = {
      holdSeats: jest.fn(),
      bookSeats: jest.fn(),
      getAllShows: jest.fn(),
      getAvailability: jest.fn(),
      getAllSeats: jest.fn(),
    };

    controller = new SeatsController(mockService as any);
  });

  describe('holdSeats', () => {
    test('throws BadRequestException when seatIds missing or empty', async () => {
      await expect(controller.holdSeats(1, { seatIds: [] })).rejects.toThrow(BadRequestException);
      // also missing
      // @ts-ignore - pass empty body
      await expect(controller.holdSeats(1, undefined as any)).rejects.toThrow(BadRequestException);
    });

    test('throws HttpException when service returns false', async () => {
      (mockService.holdSeats as jest.Mock).mockResolvedValue(false);
      await expect(controller.holdSeats(1, { seatIds: [1, 2] })).rejects.toThrow(HttpException);
      try {
        await controller.holdSeats(1, { seatIds: [1, 2] });
      } catch (err: any) {
        expect(err.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    test('returns success payload when service holds seats', async () => {
      (mockService.holdSeats as jest.Mock).mockResolvedValue(true);
      const res = await controller.holdSeats(1, { seatIds: [1, 2] });
      expect(res).toHaveProperty('success', true);
      expect(res).toHaveProperty('seatIds');
      expect(res).toHaveProperty('expiresIn', 300);
    });
  });

  describe('bookSeats', () => {
    test('throws BadRequestException when seatIds missing or empty', async () => {
      await expect(controller.bookSeats(1, { seatIds: [] })).rejects.toThrow(BadRequestException);
      // @ts-ignore
      await expect(controller.bookSeats(1, undefined as any)).rejects.toThrow(BadRequestException);
    });

    test('throws HttpException when service returns false', async () => {
      (mockService.bookSeats as jest.Mock).mockResolvedValue(false);
      await expect(controller.bookSeats(1, { seatIds: [1] })).rejects.toThrow(HttpException);
      try {
        await controller.bookSeats(1, { seatIds: [1] });
      } catch (err: any) {
        expect(err.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    test('returns success payload when service books seats', async () => {
      (mockService.bookSeats as jest.Mock).mockResolvedValue(true);
      const res = await controller.bookSeats(1, { seatIds: [1] });
      expect(res).toHaveProperty('success', true);
      expect(res).toHaveProperty('seatIds');
    });
  });
});

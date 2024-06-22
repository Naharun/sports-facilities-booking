import { Request, Response, NextFunction } from 'express';
import { BookingService } from './booking.service';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';

const bookingExists = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const booking = await BookingService.getBookingById(req.params.id);
    if (!booking) {
      return next(new AppError(httpStatus.NOT_FOUND, 'Booking not found'));
    }
    next();
  },
);

export const BookingMiddleware = {
  bookingExists,
};

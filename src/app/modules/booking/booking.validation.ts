import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import AppError from '../../errors/AppError';

const createBookingSchema = z.object({
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  facility: z.string(),
});

const validateCreateBooking = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    createBookingSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(400, 'Validation Error', error.errors));
    }
    next(error);
  }
};

export const BookingValidation = {
  validateCreateBooking,
};

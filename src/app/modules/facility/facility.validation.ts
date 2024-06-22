import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import AppError from '../../errors/AppError';

const createFacilitySchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  pricePerHour: z.number().positive(),
  location: z.string().nonempty(),
});

const updateFacilitySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  pricePerHour: z.number().positive().optional(),
  location: z.string().optional(),
});

const validateCreateFacility = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    createFacilitySchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(400, 'Validation Error', error.errors));
    }
    next(error);
  }
};

const validateUpdateFacility = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    updateFacilitySchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(400, 'Validation Error', error.errors));
    }
    next(error);
  }
};

export const FacilityValidation = {
  validateCreateFacility,
  validateUpdateFacility,
};

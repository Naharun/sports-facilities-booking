import { Request, Response, NextFunction } from 'express';
import { FacilityService } from './facility.service';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';

const facilityExists = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const facility = await FacilityService.getFacilityById(req.params.id);
    if (!facility) {
      return next(new AppError(httpStatus.NOT_FOUND, 'Facility not found'));
    }
    next();
  },
);

export const FacilityMiddleware = {
  facilityExists,
};

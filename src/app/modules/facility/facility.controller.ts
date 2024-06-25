import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { Facility } from './facility.model';

const createFacility = catchAsync(async (req: Request, res: Response) => {
  const facility = await Facility.create(req.body);
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Facility added successfully',
    data: facility,
  });
});

const getAllFacilities = catchAsync(async (req: Request, res: Response) => {
  const facilities = await Facility.find();
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Facilities retrieved successfully',
    data: facilities,
  });
});

const getFacilityById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const facility = await Facility.findById(req.params.id);

    if (!facility) {
      return next(new AppError(httpStatus.NOT_FOUND, 'Facility not found'));
    }

    res.status(httpStatus.OK).json({ facility });
  },
);

const updateFacility = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const facility = await Facility.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!facility) {
      return next(new AppError(httpStatus.NOT_FOUND, 'Facility not found'));
    }
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: 'Facility updated successfully',
      data: facility,
    });
  },
);

const deleteFacility = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const facility = await Facility.findByIdAndDelete(req.params.id);

    if (!facility) {
      return next(new AppError(httpStatus.NOT_FOUND, 'Facility not found'));
    }

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: 'Facility deleted successfully',
      data: facility,
    });
  },
);

export const FacilityController = {
  getAllFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
};

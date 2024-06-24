import { Response, NextFunction, Request } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { Facility } from '../facility/facility.model';
import { BookingService, getAvailableTimeSlots } from './booking.service';
import { Booking } from './booking.model';

const checkAvailability = async (req: Request, res: Response) => {
  const date =
    (req.query.date as string) || new Date().toISOString().split('T')[0];
  const availableSlots = await getAvailableTimeSlots(date);

  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Availability checked successfully',
    data: availableSlots,
  });
};
const createBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { facility, date, startTime, endTime } = req.body;

    const existingFacility = await Facility.findById(facility);
    if (!existingFacility) {
      throw new AppError(httpStatus.NOT_FOUND, 'Facility not found');
    }

    if (!req.user) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }

    const startDateTime = new Date(`${date}T${startTime}:00.000Z`);
    const endDateTime = new Date(`${date}T${endTime}:00.000Z`);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid start or end time format',
      );
    }

    const durationInHours =
      (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);

    const payableAmount = existingFacility.pricePerHour * durationInHours;

    const userId = req.user.userId;
    const bookingData = req.body;
    const response = await BookingService.createBooking(
      userId,
      bookingData,
      payableAmount,
    );
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: 'Booking created successfully',
      data: response,
    });
  },
);

const getAllBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const response = await BookingService.getAllBookings();
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: 'Bookings retrieved successfully',
      data: response,
    });
  },
);

export const getUserBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }
    const userId = req.user.userId;
    const response = await BookingService.getUserBookings(userId);
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: 'Bookings retrieved successfully',
      data: response,
    });
  },
);
const cancelBooking = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.id;

  const booking = await Booking.findOne({ _id: bookingId }).populate(
    'facility',
  );

  if (!booking) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Booking not found or you do not have permission',
    );
  }

  if (booking.isBooked === 'canceled') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Booking is already cancelled');
  }

  booking.isBooked = 'canceled';
  await booking.save();

  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Booking cancelled successfully',
    data: booking,
  });
});

export const BookingController = {
  checkAvailability,
  createBooking,
  getAllBookings,
  getUserBookings,
  cancelBooking,
};

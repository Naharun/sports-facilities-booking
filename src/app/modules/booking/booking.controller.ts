import { Response, NextFunction, Request } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { Facility } from '../facility/facility.model';
import { BookingService, getAvailableTimeSlots } from './booking.service';
import { Booking } from './booking.model';
import { formatDate } from '../../utils/dateFormatter';
import stripe from '../../config/stripe.config';

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

    const formattedDate = formatDate(new Date(response.date));

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: 'Booking created successfully',
      data: {
        ...response.toObject(),
        date: formattedDate,
      },
    });
  },
);

const getAllBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const response = await BookingService.getAllBookings();

    const formattedResponse = response.map((booking) => ({
      ...booking.toObject(),
      date: formatDate(new Date(booking.date)),
    }));

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: 'Bookings retrieved successfully',
      data: formattedResponse,
    });
  },
);

const getUserBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }
    const userId = req.user.userId;
    const response = await BookingService.getUserBookings(userId);

    const formattedResponse = response.map((booking) => ({
      ...booking.toObject(),
      date: formatDate(new Date(booking.date)),
    }));

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: 'Bookings retrieved successfully',
      data: formattedResponse,
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

  const formattedDate = formatDate(new Date(booking.date));

  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Booking cancelled successfully',
    data: {
      ...booking.toObject(),
      date: formattedDate,
    },
  });
});
////////////////////////////////////////////////////////

const processPayment = async (req: Request, res: Response) => {
  const { bookingId, paymentMethodId } = req.body;

  // Retrieve booking details
  const booking = await Booking.findById(bookingId).populate('facility');
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }

  const amount = (Number(booking.payableAmount) || 0) * 100;
  try {
    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd', // Specify your currency
      payment_method: paymentMethodId,
      confirm: true,
    });

    if (paymentIntent.status === 'succeeded') {
      booking.isBooked = 'confirmed';
      booking.transactionId = paymentIntent.id;
      await booking.save();

      res.status(httpStatus.OK).json({
        success: true,
        message: 'Payment successful and booking confirmed',
        data: booking,
      });
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, 'Payment failed');
    }
  } catch (error) {
    console.error('Payment error:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Payment processing failed',
    );
  }
};

const proceedToPay = catchAsync(async (req: Request, res: Response) => {
  await processPayment(req, res); // Call the processPayment function
});

export const BookingController = {
  checkAvailability,
  createBooking,
  getAllBookings,
  getUserBookings,
  cancelBooking,
  proceedToPay,
};

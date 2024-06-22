import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { Facility } from '../facility/facility.model';
import Booking from './booking.model';
import { BookingService } from './booking.service';

const checkAvailability = catchAsync(async (req: Request, res: Response) => {
  const date = req.query.date ? new Date(req.query.date as string) : new Date();

  const availableSlots = [
    { startTime: '08:00', endTime: '10:00' },
    { startTime: '14:00', endTime: '16:00' },
  ];

  res.status(httpStatus.OK).json({
    success: true,
    statusCode: 200,
    message: 'Availability checked successfully',
    data: availableSlots,
  });
});

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const { facility, date, startTime, endTime } = req.body;

  // Verify the facility exists
  const existingFacility = await Facility.findById(facility);
  if (!existingFacility) {
    throw new AppError(httpStatus.NOT_FOUND, 'Facility not found');
  }

  // Convert startTime and endTime strings to Date objects
  const startDateTime = new Date(`${date}T${startTime}:00.000Z`);
  const endDateTime = new Date(`${date}T${endTime}:00.000Z`);

  // Check if startDateTime and endDateTime are valid Date objects
  if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid start or end time format',
    );
  }

  // Calculate the duration in hours
  const durationInHours =
    (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);

  // Calculate payable amount based on duration and facility price per hour
  const payableAmount = existingFacility.pricePerHour * durationInHours;

  const bookingData = {
    facility: facility,
    date: date,
    startTime: startDateTime, // Use parsed Date objects
    endTime: endDateTime, // Use parsed Date objects
    user: req.user.id,
    payableAmount: payableAmount,
    isBooked: 'confirmed',
  };

  const booking = await Booking.create(bookingData);

  // Prepare the response in the desired format
  const responseData = {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Booking created successfully',
    data: {
      ...booking.toObject(), // Convert Mongoose document to plain object
      facility: facility, // Ensure facility ID is included
      date: date, // Ensure date is in YYYY-MM-DD format
      startTime: startTime, // Ensure startTime is the original string
      endTime: endTime, // Ensure endTime is the original string
      user: req.user.id,
      payableAmount: payableAmount,
      isBooked: 'confirmed',
    },
  };

  res.status(httpStatus.CREATED).json(responseData);
});

// const getAllBookings = catchAsync(async (req: Request, res: Response) => {
//   try {
//     // Retrieve all bookings and populate facility and user details
//     const bookings = await Booking.find()
//       .populate(
//         'facility',
//         '_id name description pricePerHour location isDeleted',
//       )
//       .populate('user', '_id name email phone role address') // Ensure 'user' matches the field name in your Booking schema
//       .exec();

//     // Check if no bookings found, return an empty array
//     if (bookings.length === 0) {
//       return res.status(httpStatus.OK).json({
//         success: true,
//         statusCode: httpStatus.OK,
//         message: 'No bookings found',
//         data: [],
//       });
//     }

//     // Prepare the response in the desired format
//     const formattedBookings = bookings.map((booking) => ({
//       _id: booking._id,
//       facility: booking.facility,
//       date: booking.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
//       startTime: booking.startTime
//         ? booking.startTime.toISOString().split('T')[1].substring(0, 5)
//         : null,
//       endTime: booking.endTime
//         ? booking.endTime.toISOString().split('T')[1].substring(0, 5)
//         : null,
//       user: booking.user,
//       payableAmount: booking.payableAmount,
//       isBooked: booking.isBooked,
//     }));

//     res.status(httpStatus.OK).json({
//       success: true,
//       statusCode: httpStatus.OK,
//       message: 'Bookings retrieved successfully',
//       data: formattedBookings,
//     });
//   } catch (error) {
//     // Handle database errors or unexpected errors
//     console.error('Error fetching bookings:', error);
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       statusCode: httpStatus.INTERNAL_SERVER_ERROR,
//       message: 'Failed to retrieve bookings',
//       error: error.message,
//     });
//   }
// });
export const getAllBookings = catchAsync(
  async (req: Request, res: Response) => {
    const bookings = await Booking.find()
      .populate(
        'facility',
        '_id name description pricePerHour location isDeleted',
      )
      .populate('user', '_id name email phone role address')
      .exec();

    if (!bookings) {
      throw new AppError(httpStatus.NOT_FOUND, 'No bookings found');
    }

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: 'Bookings retrieved successfully',
      data: bookings,
    });
  },
);

// Get bookings by authenticated user
export const getBookingsByUser = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user._id;

    const bookings = await Booking.find({ user: userId })
      .populate(
        'facility',
        '_id name description pricePerHour location isDeleted',
      )
      .exec();

    if (!bookings) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'No bookings found for this user',
      );
    }

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: 'Bookings retrieved successfully',
      data: bookings,
    });
  },
);
const getUserBookings = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user._id;

  // Log user ID from JWT
  console.log(`User ID from JWT: ${userId}`);

  // Retrieve bookings for the user
  const bookings = await Booking.find({ user: userId })
    .populate(
      'facility',
      '_id name description pricePerHour location isDeleted',
    )
    .populate('user', '_id name email phone role address')
    .exec();

  // Log retrieved bookings
  console.log(`Retrieved bookings: ${JSON.stringify(bookings, null, 2)}`);

  if (!bookings || bookings.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No bookings found for this user');
  }

  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Bookings retrieved successfully',
    data: bookings,
  });
});
const cancelBooking = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.id;
  const userId = req.user._id;

  // Find the booking by ID and verify it exists
  const booking = await Booking.findOne({ _id: bookingId, user: userId })
    .populate('facility')
    .exec();

  if (!booking) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Booking not found or you do not have permission',
    );
  }

  // Check if the booking is already cancelled
  if (booking.isBooked === 'cancelled') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Booking is already cancelled');
  }

  // Update booking status to "cancelled"
  booking.isBooked = 'cancelled';
  await booking.save();

  // Prepare response data
  const responseData = {
    _id: booking._id,
    facility: booking.facility,
    date: booking.date.toISOString().split('T')[0], // Ensure date is in YYYY-MM-DD format
    startTime: booking.startTime.toISOString().split('T')[1].slice(0, 5), // Ensure startTime is in HH:mm format
    endTime: booking.endTime.toISOString().split('T')[1].slice(0, 5), // Ensure endTime is in HH:mm format
    payableAmount: booking.payableAmount,
    isBooked: booking.isBooked,
  };

  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Booking cancelled successfully',
    data: responseData,
  });
});

export const BookingController = {
  checkAvailability,
  createBooking,
  getAllBookings,
  getUserBookings,
  cancelBooking,
};

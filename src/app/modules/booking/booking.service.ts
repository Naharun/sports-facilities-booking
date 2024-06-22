import { Facility } from '../facility/facility.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import Booking from './booking.model';
import { IBooking } from './booking.interface';

const checkAvailability = async (date: string) => {
  const bookings = await Booking.find({ date: new Date(date) });
  // Logic to find available slots based on bookings
  return bookings;
};

const createBooking = async (
  userId: string,
  bookingData: Partial<IBooking>,
) => {
  const facility = await Facility.findById(bookingData.facility);
  if (!facility) {
    throw new AppError(httpStatus.NOT_FOUND, 'Facility not found');
  }
  const booking = new Booking({ ...bookingData, user: userId });
  return await booking.save();
};

// const getAllBookings = async () => {
//   return await Booking.find();
// };
const getAllBookings = async () => {
  try {
    const bookings = await Booking.find()
      .populate(
        'facility',
        '_id name description pricePerHour location isDeleted',
      )
      .populate('user', '_id name email phone role address')
      .exec();

    return bookings;
  } catch (error) {
    // Handle the error according to your application's error handling strategy
    throw error; // Re-throwing for now, consider logging or custom error handling
  }
};

const getUserBookings = async (userId: string) => {
  return await Booking.find({ user: userId });
};

const cancelBooking = async (id: string, userId: string) => {
  const booking = await Booking.findOneAndUpdate(
    { _id: id, user: userId },
    { isBooked: 'canceled' },
    { new: true },
  );
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Facility not found');
  }
  return booking;
};

const getBookingById = async (id: string) => {
  return await Booking.findById(id);
};

export const BookingService = {
  checkAvailability,
  createBooking,
  getAllBookings,
  getUserBookings,
  cancelBooking,
  getBookingById,
};

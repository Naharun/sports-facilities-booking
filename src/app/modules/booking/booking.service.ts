import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Booking } from './booking.model';

export const getAvailableTimeSlots = async (date: string) => {
  const totalSlots = [
    { startTime: '08:00', endTime: '10:00' },
    { startTime: '10:00', endTime: '12:00' },
    { startTime: '12:00', endTime: '14:00' },
    { startTime: '14:00', endTime: '16:00' },
    { startTime: '16:00', endTime: '18:00' },
    { startTime: '18:00', endTime: '20:00' },
  ];

  return totalSlots;
};

const createBooking = async (
  userId: string,
  bookingData: any,
  payableAmount: number,
) => {
  const booking = new Booking({
    ...bookingData,
    user: userId,
    payableAmount: payableAmount,
  });
  await booking.save();
  return booking;
};

const getAllBookings = async () => {
  const bookings = await Booking.find({ isBooked: { $ne: 'canceled' } })
    .populate({
      path: 'facility',
      select: '_id name description pricePerHour location isDeleted',
    })
    .populate({
      path: 'user',
      select: '_id name email phone role address',
    });
  return bookings;
};

const getUserBookings = async (userId: string) => {
  const bookings = await Booking.find({
    user: userId,
    isBooked: { $ne: 'canceled' },
  }).populate('facility');
  return bookings;
};

const cancelBooking = async (bookingId: string, userId: string) => {
  const booking = await Booking.findOneAndUpdate(
    { _id: bookingId, user: userId },
    { isBooked: 'canceled' },
    { new: true },
  ).populate('facility');
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Facility not found');
  }
  return booking;
};

const getBookingById = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId).populate('facility user');
  return booking;
};

export const BookingService = {
  createBooking,
  getAllBookings,
  getUserBookings,
  cancelBooking,
  getBookingById,
};

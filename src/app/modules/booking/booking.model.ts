import mongoose, { Schema } from 'mongoose';
import { IBooking } from './booking.interface';

const bookingSchema = new Schema<IBooking>({
  facility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    required: true,
  },
  date: { type: Date, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  payableAmount: { type: Number, required: true },
  isBooked: { type: String, enum: ['confirmed', 'cancelled'], required: true },
});

const BookingModel = mongoose.model<IBooking>('Booking', bookingSchema);

export default BookingModel;

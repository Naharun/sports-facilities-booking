import { Schema, model } from 'mongoose';
import { IBooking } from './booking.interface';

const bookingSchema = new Schema<IBooking>(
  {
    facility: {
      type: Schema.Types.ObjectId,
      ref: 'Facility',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    payableAmount: {
      type: Number,
      required: false,
    },
    isBooked: {
      type: String,
      enum: ['confirmed', 'canceled'],
      default: 'confirmed',
    },
  },
  { timestamps: true },
);

export const Booking = model<IBooking>('Booking', bookingSchema);

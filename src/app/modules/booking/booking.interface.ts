import mongoose, { Schema } from 'mongoose';
import { Document } from 'mongoose';

// export interface IBooking extends Document {
//   facility: mongoose.Types.ObjectId | string;
//   date: Date;
//   startTime: Date;
//   endTime: Date;
//   user: mongoose.Types.ObjectId;
//   payableAmount: number;
//   isBooked: 'confirmed' | 'cancelled';
// }
export interface IBooking extends Document {
  facility: mongoose.Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  user: mongoose.Types.ObjectId;
  payableAmount: number | string;
  isBooked: 'confirmed' | 'canceled';
}

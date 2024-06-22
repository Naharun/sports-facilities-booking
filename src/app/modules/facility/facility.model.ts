import { Schema, model } from 'mongoose';
import { IFacility } from './facility.interface';

const facilitySchema = new Schema<IFacility>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  pricePerHour: { type: Number, required: true },
  location: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
});

export const Facility = model<IFacility>('Facility', facilitySchema);

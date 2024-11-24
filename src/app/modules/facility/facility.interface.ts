import { Document } from 'mongoose';

export interface IFacility extends Document {
  name: string;
  description: string;
  pricePerHour: number;
  location: string;
  isDeleted: boolean;
  image: string;
}

import { Document, Model } from 'mongoose';

export type TUserRole = 'admin' | 'user';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  isDeleted: boolean;
  status: 'active' | 'blocked';
  passwordChangedAt?: Date;
  phone: string;
  address: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: TUserRole;
}

export interface UserDocument extends IUser, Document {}

export interface UserModel extends Model<UserDocument> {
  isUserExistsByEmail(email: string): Promise<UserDocument | null>;
  isUserExistsByCustomId(id: string): Promise<UserDocument | null>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedAt: Date,
    iat: number,
  ): boolean;
}

import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserDocument, UserModel } from './user.interface';

const userSchema = new Schema<UserDocument>(
  {
    id: { type: String, unique: true, default: uuidv4 },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    passwordChangedAt: Date,
  },
  { timestamps: true },
);

userSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  next();
});

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

userSchema.statics.isUserExistsByCustomId = async function (userId: string) {
  return await this.findOne({ _id: userId });
};

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await this.findOne({ email });
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedAt: Date,
  iat: number,
) {
  if (passwordChangedAt) {
    const changedTimestamp = passwordChangedAt.getTime() / 1000;
    return iat < changedTimestamp;
  }
  return false;
};

export const User = model<UserDocument, UserModel>('User', userSchema);

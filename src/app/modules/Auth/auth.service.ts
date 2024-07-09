import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { User } from '../users/user.model';
import {
  TDecodedToken,
  TLoginResponse,
  TLoginUser,
  TRefreshTokenResponse,
  TSignupUser,
} from './auth.interface';

const signup = async (payload: TSignupUser): Promise<TLoginResponse> => {
  const { email, password, ...userData } = payload;

  const userExists = await User.isUserExistsByEmail(email);

  if (userExists) {
    throw new AppError(409, 'User already exists with this email');
  }

  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(config.bcrypt_salt_rounds as string, 10),
  );

  const newUser = await User.create({
    ...userData,
    email,
    password: hashedPassword,
  });

  const accessToken = jwt.sign(
    {
      userId: newUser._id,
    },
    config.jwt_access_secret as string,
    {
      expiresIn: config.jwt_access_expires_in,
    },
  );

  const refreshToken = jwt.sign(
    {
      userId: newUser._id,
    },
    config.jwt_refresh_secret as string,
    {
      expiresIn: config.jwt_refresh_expires_in,
    },
  );

  return {
    success: true,
    statusCode: 200,
    message: 'User registered successfully',
    accessToken,
    refreshToken,
    data: {
      _id: newUser._id as string,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      address: newUser.address,
    },
  };
};

const login = async (payload: TLoginUser): Promise<TLoginResponse> => {
  const { email, password } = payload;

  const user = await User.isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(401, 'User not found');
  }

  // const isPasswordMatch = await bcrypt.compare(password, user.password);

  // if (!isPasswordMatch) {
  //   throw new AppError(401, 'Incorrect email or password');
  // }

  const accessToken = jwt.sign(
    {
      userId: user._id,
    },
    config.jwt_access_secret as string,
    {
      expiresIn: config.jwt_access_expires_in,
    },
  );

  const refreshToken = jwt.sign(
    {
      userId: user._id,
    },
    config.jwt_refresh_secret as string,
    {
      expiresIn: config.jwt_refresh_expires_in,
    },
  );

  return {
    success: true,
    statusCode: 200,
    message: 'User logged in successfully',
    accessToken,
    refreshToken,
    data: {
      _id: user._id as string,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
    },
  };
};

const refreshToken = async (token: string): Promise<TRefreshTokenResponse> => {
  let decoded: TDecodedToken;

  try {
    decoded = jwt.verify(
      token,
      config.jwt_refresh_secret as string,
    ) as TDecodedToken;
  } catch (error) {
    throw new AppError(403, 'Invalid refresh token');
  }

  const { userId } = decoded;

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const accessToken = jwt.sign(
    {
      userId: user._id,
    },
    config.jwt_access_secret as string,
    {
      expiresIn: config.jwt_access_expires_in,
    },
  );

  return { accessToken };
};

export const AuthService = {
  signup,
  login,
  refreshToken,
};

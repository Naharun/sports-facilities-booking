import { JwtPayload } from 'jsonwebtoken';

export type TLoginUser = {
  email: string;
  password: string;
};

export type TSignupUser = {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  phone: string;
  address: string;
};

export type TLoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type TRefreshTokenResponse = {
  accessToken: string;
};

export type TDecodedToken = JwtPayload & {
  userId: string;
};

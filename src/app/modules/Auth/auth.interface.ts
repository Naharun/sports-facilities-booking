export type TSignupUser = {
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  address: string;
};

export type TLoginUser = {
  email: string;
  password: string;
};
// export type TDecodedToken = JwtPayload & {
//   userId: string;
//   iat: number;
//   exp: number;
// };

export type TDecodedToken = {
  userId: string;
  iat: number;
  exp: number;
};

export type TLoginResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  token?: string;
  data: {
    _id: string;
    name: string;
    email: string;
    role: string;
    phone: string;
    address: string;
    accessToken?: string;
    refreshToken?: string;
  };
};

export type TRefreshTokenResponse = {
  accessToken: string;
};

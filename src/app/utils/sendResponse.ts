import { Response } from 'express';

type TResponse<T> = {
  success: boolean;
  statusCode: number;
  message?: string;
  token?: string;
  data: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  const {
    success = true,
    statusCode = 200,
    message,
    token,
    data: responseData,
  } = data;

  res.status(statusCode).json({
    success,
    statusCode,
    message,
    token,
    data: responseData,
  });
};

export default sendResponse;

import { Response } from 'express';

// Define a type for your response structure
type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
};

// Define the sendResponse function
const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  const {
    statusCode = 200,
    success = true,
    message,
    data: responseData,
  } = data;

  res.status(statusCode).json({
    success,
    message,
    data: responseData,
  });
};

export default sendResponse;

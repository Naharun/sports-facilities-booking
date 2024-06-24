// import { Request, Response, NextFunction } from 'express';
// import httpStatus from 'http-status';
// import { User } from './user.model';
// import AppError from '../../errors/AppError';
// import catchAsync from '../../utils/catchAsync';

// const getUserById = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { userId } = req.params;
//     const user = await User.findById(userId);

//     if (!user) {
//       throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//     }

//     req.user = user;
//     next();
//   },
// );

// export const UserMiddleware = {
//   getUserById,
// };

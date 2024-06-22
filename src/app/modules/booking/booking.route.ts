import { Router } from 'express';
import { BookingController } from './booking.controller';
import { AuthMiddleware } from '../Auth/auth.middlewares';
import { BookingMiddleware } from './booking.middlewares';
import { BookingValidation } from './booking.validation';

const router = Router();

router.get('/check-availability', BookingController.checkAvailability);
router.post(
  '/bookings',
  AuthMiddleware.isAuthenticated,
  BookingValidation.validateCreateBooking,
  BookingController.createBooking,
);
router.get(
  '/bookings',
  AuthMiddleware.isAuthenticated,
  BookingController.getAllBookings,
);

router.get(
  '/bookings/user',
  AuthMiddleware.isAuthenticated,
  BookingController.getUserBookings,
);
router.delete(
  '/bookings/:id',
  AuthMiddleware.isAuthenticated,
  BookingMiddleware.bookingExists,
  BookingController.cancelBooking,
);

export const BookingRoutes = router;

import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler'; // Ensure correct path
import notFound from './app/middlewares/notFound'; // Ensure correct path
import { AuthRoutes } from './app/modules/Auth/auth.route';
import { FacilityRoutes } from './app/modules/facility/facility.route';
import { BookingRoutes } from './app/modules/booking/booking.route';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Application routes
app.use('/api/auth', AuthRoutes);
app.use('/api/facility', FacilityRoutes);
app.use('/api', BookingRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Global error handler
app.use(globalErrorHandler);

// 404 Not Found handler
app.use(notFound);

export default app;

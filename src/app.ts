// import cors from 'cors';
// import express, { Application, Request, Response } from 'express';
// import globalErrorHandler from './app/middlewares/globalErrorHandler';
// import notFound from './app/middlewares/notFound';
// import { AuthRoutes } from './app/modules/Auth/auth.route';
// import { FacilityRoutes } from './app/modules/facility/facility.route';
// import { BookingRoutes } from './app/modules/booking/booking.route';

// const app: Application = express();

// // Middleware configuration for CORS
// const allowedOrigins = ['https://sports-facilities-booking-client.vercel.app/'];

// const corsOptions = {
//   origin: allowedOrigins,
//   credentials: true, // Allow cookies and credentials
// };

// app.use(cors(corsOptions));
// app.use(express.json());

// // Application routes
// app.use('/api/auth', AuthRoutes);
// app.use('/api/facility', FacilityRoutes);
// app.use('/api', BookingRoutes);

// // Root route
// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello World!');
// });

// // Global error handler
// app.use(globalErrorHandler);

// // 404 Not Found handler
// app.use(notFound);

// export default app;
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import { AuthRoutes } from './app/modules/Auth/auth.route';
import { FacilityRoutes } from './app/modules/facility/facility.route';
import { BookingRoutes } from './app/modules/booking/booking.route';

const app: Application = express();

// Updated CORS configuration
const allowedOrigins = [
  'https://sports-facilities-booking-client.vercel.app', // Live frontend
  'http://localhost:5173', // Local testing
];

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Allow cookies and credentials
};

app.use(cors(corsOptions));
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

# sports-facilities-booking

sports-facilities-booking- created by Ain Naharun Jannat Sraboni GitHub

## Summery of this project

<p align="center">Live Link : https://sports-facilities-booking.vercel.app/ <p />

## Backend Development:

Node.js
Express.js
Mongoose
TypeScript

## Package Management

- npm i uuidv4

##

- Validation with Zod
- For Code Style Use ESLint
- Use ESLint Prettier
- Use JWT_TOKEN

- Sport-Facilities-Booking Data Types
- Create user module for user functionality
- Create auth module for authentication and authorization functionality
- Create facility module for facility functionality
- Create booking module for booking functionality
- Create middlewares folder. Under the folder have
  -> globalErrorHandler
  -> notFound for Not Found Route
  -> validateRequest
- Create errors folder for "Error Handling" under the folder have
  -> AppError
  -> handleCastError
  -> handleDuplicateError
  -> handleValidationError
  -> handleZodError
- Authentication Middleware in auth.middlewares.ts file
- No Data Found in modules middlewares files
- Zod Validation in modules validation files
- Create utils under the folder have
  -> catchAsync for try, catch to clean code.
  -> sendResponse to clean code.
- Create interface folder under the folder have
  -> error.ts
  -> index.d.ts

## admin role

{
"email": "naharunrtjannat@gmail.com",
"password": "tysraboni123456!"
}

## user role

{
"email": "iserrrlamjannat@gmail.com",
"password": "sporetIslam23y@!"
}

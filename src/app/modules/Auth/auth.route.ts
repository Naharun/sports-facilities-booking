import express from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(AuthValidation.signup),
  AuthController.signup,
);
router.post(
  '/login',
  validateRequest(AuthValidation.login),
  AuthController.login,
);
router.post('/refresh-token', AuthController.refreshToken);

export const AuthRoutes = router;

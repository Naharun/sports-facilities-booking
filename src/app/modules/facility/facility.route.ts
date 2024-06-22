import { Router } from 'express';
import { FacilityController } from './facility.controller';
import { AuthMiddleware } from '../Auth/auth.middlewares';
import { FacilityMiddleware } from './facility.middlewares';
import { FacilityValidation } from './facility.validation';

const router = Router();

router.post(
  '/',
  AuthMiddleware.isAuthenticated,
  FacilityValidation.validateCreateFacility,
  FacilityController.createFacility,
);
router.put(
  '/:id',
  AuthMiddleware.isAuthenticated,
  FacilityMiddleware.facilityExists,
  FacilityValidation.validateUpdateFacility,
  FacilityController.updateFacility,
);
router.delete(
  '/:id',
  AuthMiddleware.isAuthenticated,
  FacilityMiddleware.facilityExists,
  FacilityController.deleteFacility,
);
router.get('/', FacilityController.getAllFacilities);

export const FacilityRoutes = router;

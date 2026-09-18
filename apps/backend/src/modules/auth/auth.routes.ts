import { Router } from 'express';
import {
  registerUserSchema,
  loginUserSchema,
  refreshTokenSchema,
  userAddressSchema,
  updateAddressSchema,
  updateProfileSchema,
} from '@repo/shared-types';
import { validateRequest } from '../../shared/middlewares/validateRequest.js';
import { authGuard } from '../../shared/middlewares/authGuard.js';
import * as authController from './auth.controller.js';

const router = Router();

// Public Authentication Endpoints
router.post(
  '/register',
  validateRequest({ body: registerUserSchema }),
  authController.register,
);

router.post(
  '/login',
  validateRequest({ body: loginUserSchema }),
  authController.login,
);

router.post(
  '/refresh-token',
  validateRequest({ body: refreshTokenSchema }),
  authController.refreshToken,
);

// Protected User Profile Endpoints (/profile & /me aliases)
router.get(
  '/profile',
  authGuard,
  authController.getProfile,
);

router.get(
  '/me',
  authGuard,
  authController.getProfile,
);

router.patch(
  '/profile',
  authGuard,
  validateRequest({ body: updateProfileSchema }),
  authController.updateProfile,
);

router.patch(
  '/me',
  authGuard,
  validateRequest({ body: updateProfileSchema }),
  authController.updateProfile,
);

// Protected Delivery Addresses Endpoints
router.get(
  '/addresses',
  authGuard,
  authController.getAddresses,
);

router.post(
  '/addresses',
  authGuard,
  validateRequest({ body: userAddressSchema }),
  authController.addAddress,
);

router.patch(
  '/addresses/:addressId',
  authGuard,
  validateRequest({ body: updateAddressSchema }),
  authController.updateAddress,
);

router.patch(
  '/addresses/:addressId/default',
  authGuard,
  authController.setDefaultAddress,
);

router.delete(
  '/addresses/:addressId',
  authGuard,
  authController.deleteAddress,
);

router.post(
  '/logout',
  authGuard,
  authController.logout,
);

export const authRouter = router;


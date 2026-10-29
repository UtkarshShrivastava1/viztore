import { Router } from 'express';
import {
  UserRole,
  createCouponSchema,
  validateCouponSchema,
} from '@repo/shared-types';
import { authGuard } from '../../shared/middlewares/authGuard.js';
import { roleGuard } from '../../shared/middlewares/roleGuard.js';
import { validateBody } from '../../shared/middlewares/validateRequest.js';
import { couponController } from './coupon.controller.js';

export function createCouponRouter(guard = authGuard): Router {
  const router = Router();

  // Public/Customer endpoints:
  router.get('/', couponController.getActiveCoupons);
  router.post('/validate', validateBody(validateCouponSchema), couponController.validateCoupon);

  // Protected Merchant / Admin endpoints:
  router.post('/', guard, roleGuard(UserRole.MERCHANT, UserRole.ADMIN), validateBody(createCouponSchema), couponController.createCoupon);
  router.delete('/:id', guard, roleGuard(UserRole.MERCHANT, UserRole.ADMIN), couponController.deleteCoupon);

  return router;
}

export const couponRouter = createCouponRouter();

import { Router } from 'express';
import type { DeliveryController } from './delivery.controller.js';
import { authGuard } from '../../shared/middlewares/authGuard.js';
import { roleGuard } from '../../shared/middlewares/roleGuard.js';
import { validateBody } from '../../shared/middlewares/validateRequest.js';
import {
  assignRiderSchema,
  broadcastDeliverySchema,
  claimDeliverySchema,
  updateDeliveryStatusSchema,
  verifyDeliveryOtpSchema,
} from './delivery.validator.js';
import { UserRole } from '@repo/shared-types';

export function createDeliveryRouter(controller: DeliveryController): Router {
  const router = Router();

  // Public/Customer tracking view
  router.get('/orders/:orderId/track', controller.getTracking);

  // Available open pool jobs for nearby delivery partners
  router.get('/jobs/available', authGuard, controller.getAvailableJobs);

  // Broadcast unassigned delivery job to nearby open pool
  router.post(
    '/orders/:orderId/broadcast',
    authGuard,
    roleGuard(UserRole.MERCHANT, UserRole.ADMIN),
    validateBody(broadcastDeliverySchema),
    controller.broadcastJob,
  );

  // Claim a broadcasted delivery job atomically
  router.post(
    '/orders/:orderId/claim',
    authGuard,
    validateBody(claimDeliverySchema),
    controller.claimJob,
  );

  // Merchant or Admin assigns rider partner directly
  router.post(
    '/orders/:orderId/assign',
    authGuard,
    roleGuard(UserRole.MERCHANT, UserRole.ADMIN),
    validateBody(assignRiderSchema),
    controller.assignRider,
  );

  // Status transition update (Rider or Merchant)
  router.patch(
    '/orders/:orderId/status',
    authGuard,
    validateBody(updateDeliveryStatusSchema),
    controller.updateStatus,
  );

  // Final 4-digit OTP verification upon customer delivery handoff
  router.post(
    '/orders/:orderId/verify-otp',
    authGuard,
    validateBody(verifyDeliveryOtpSchema),
    controller.verifyOtp,
  );

  return router;
}


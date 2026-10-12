import { Router } from 'express';
import type { createOrderController } from './order.controller.js';
import { authGuard } from '../../shared/middlewares/authGuard.js';
import { roleGuard } from '../../shared/middlewares/roleGuard.js';
import { idempotencyMiddleware } from '../../shared/middlewares/idempotency.middleware.js';
import { validateRequest } from '../../shared/middlewares/validateRequest.js';
import { deliveryOtpRateLimiter } from '../../shared/middlewares/rateLimiter.js';
import { createOrderSchema, updateOrderStatusSchema, verifyOtpSchema } from './order.validator.js';
import { UserRole } from '@repo/shared-types';

type Controller = ReturnType<typeof createOrderController>;

export function createOrderRouter(
  controller: Controller,
  guard = authGuard,
): Router {
  const router = Router();

  // All order routes require authentication
  router.use(guard);

  // Customer & Merchant order routes (Idempotency Key protected against double-submit)
  router.post(
    '/',
    idempotencyMiddleware({ ttlSeconds: 300 }),
    validateRequest({ body: createOrderSchema }),
    controller.createOrder,
  );
  router.get('/', controller.getMyOrders);
  router.get('/my-orders', controller.getMyOrders);
  router.get('/store/:storeId', controller.getStoreOrders);
  router.get('/all', roleGuard(UserRole.ADMIN, UserRole.MERCHANT), controller.getAllOrders);
  router.get('/:id', controller.getOrder);
  router.get('/:id/invoice', controller.getInvoice);
  router.patch(
    '/:id/status',
    validateRequest({ body: updateOrderStatusSchema }),
    controller.updateStatus,
  );
  router.post(
    '/:id/verify-otp',
    deliveryOtpRateLimiter,
    validateRequest({ body: verifyOtpSchema }),
    controller.verifyOtp,
  );
  router.post('/:id/cancel', idempotencyMiddleware({ ttlSeconds: 300 }), controller.cancel);

  return router;
}

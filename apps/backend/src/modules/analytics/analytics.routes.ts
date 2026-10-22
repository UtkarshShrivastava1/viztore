import { Router } from 'express';
import { UserRole } from '@repo/shared-types';
import { authGuard } from '../../shared/middlewares/authGuard.js';
import { roleGuard } from '../../shared/middlewares/roleGuard.js';
import { analyticsController } from './analytics.controller.js';

export function createAnalyticsRouter(guard = authGuard): Router {
  const router = Router();

  // All analytics routes require merchant or admin authentication
  router.use(guard);
  router.use(roleGuard(UserRole.MERCHANT, UserRole.ADMIN));

  router.get('/overview', analyticsController.getOverview);
  router.get('/profit-loss', analyticsController.getProfitLoss);
  router.get('/products', analyticsController.getProductWise);
  router.get('/orders', analyticsController.getTotalOrders);
  router.get('/offline-billing', analyticsController.getOfflineBilling);
  router.get('/gst', analyticsController.getGSTReport);
  router.get('/payouts', analyticsController.getPayouts);
  router.get('/settlements', analyticsController.getSettlements);
  router.get('/transactions', analyticsController.getTransactions);
  router.get('/export', analyticsController.exportCsv);

  return router;
}

export const analyticsRouter = createAnalyticsRouter();

import { Router } from 'express';
import { billingController } from './billing.controller.js';
import { authGuard } from '../../shared/middlewares/authGuard.js';
import { roleGuard } from '../../shared/middlewares/roleGuard.js';
import { idempotencyMiddleware } from '../../shared/middlewares/idempotency.middleware.js';
import { UserRole } from '@repo/shared-types';
import {
  validateCreateInvoice,
  validateRecordPayment,
  validateInvoiceQuery,
  validateCreateQuote,
  validateQuoteQuery,
  validateUpdateBillingSettings,
} from './billing.validation.js';

export function createBillingRouter(guard = authGuard): Router {
  const router = Router();

  // All billing routes require merchant or admin authentication
  router.use(guard);
  router.use(roleGuard(UserRole.MERCHANT, UserRole.ADMIN));

  // Invoices CRUD & Workflow (5.0, 5.1, 5.2.png)
  router.get('/invoices', validateInvoiceQuery, billingController.getInvoices);
  router.post(
    '/invoices',
    idempotencyMiddleware({ ttlSeconds: 300 }),
    validateCreateInvoice,
    billingController.createInvoice,
  );
  router.get('/invoices/:id', billingController.getInvoiceById);
  router.patch('/invoices/:id/payment', validateRecordPayment, billingController.recordPayment);
  router.patch('/invoices/:id/cancel', billingController.cancelInvoice);

  // Estimates / Quotes (5.5, 5.6.png)
  router.get('/quotes', validateQuoteQuery, billingController.getQuotes);
  router.post('/quotes', validateCreateQuote, billingController.createQuote);
  router.post('/quotes/:id/convert', billingController.convertQuoteToInvoice);

  // Billing & Invoicing Preferences (5.3.png)
  router.get('/settings', billingController.getSettings);
  router.put('/settings', validateUpdateBillingSettings, billingController.updateSettings);

  return router;
}

export const billingRouter = createBillingRouter();

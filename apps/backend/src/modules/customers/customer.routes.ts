import { Router } from 'express';
import { customerController } from './customer.controller.js';
import { authGuard } from '../../shared/middlewares/authGuard.js';
import { roleGuard } from '../../shared/middlewares/roleGuard.js';
import { UserRole } from '@repo/shared-types';
import {
  validateCreateCustomer,
  validateUpdateCustomer,
  validateAdjustCredit,
  validateRecordPayment,
  validateCustomerQuery,
} from './customer.validation.js';

export function createCustomerRouter(guard = authGuard): Router {
  const router = Router();

  // All customer CRM routes require merchant or admin authorization
  router.use(guard);
  router.use(roleGuard(UserRole.MERCHANT, UserRole.ADMIN));

  router.get('/', validateCustomerQuery, customerController.getCustomers);
  router.get('/store/:storeId', validateCustomerQuery, customerController.getCustomers);
  router.post('/', validateCreateCustomer, customerController.createCustomer);
  router.get('/:id', customerController.getCustomerById);
  router.patch('/:id', validateUpdateCustomer, customerController.updateCustomer);
  router.delete('/:id', customerController.deleteCustomer);

  router.post('/:id/credit', validateAdjustCredit, customerController.adjustCredit);
  router.post('/:id/payments', validateRecordPayment, customerController.recordPayment);

  return router;
}

export const customerRouter = createCustomerRouter();


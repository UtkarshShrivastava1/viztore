import { Router } from 'express';
import {
  UserRole,
  createExpenseSchema,
  createVendorSchema,
  createPurchaseBillSchema,
  createCreditNoteSchema,
  createEWayBillSchema,
} from '@repo/shared-types';
import { authGuard } from '../../shared/middlewares/authGuard.js';
import { roleGuard } from '../../shared/middlewares/roleGuard.js';
import { validateBody } from '../../shared/middlewares/validateRequest.js';
import { expenseController } from './expense.controller.js';

export function createExpenseRouter(guard = authGuard): Router {
  const router = Router();

  // All expense & purchase routes require merchant or admin authentication
  router.use(guard);
  router.use(roleGuard(UserRole.MERCHANT, UserRole.ADMIN));

  // Overview & Feed
  router.get('/overview', expenseController.getOverview);
  router.get('/transactions', expenseController.getAllTransactions);

  // Operating Expenses
  router.get('/', expenseController.getExpenses);
  router.post('/', validateBody(createExpenseSchema), expenseController.createExpense);
  router.delete('/:id', expenseController.deleteExpense);

  // Vendors
  router.get('/vendors', expenseController.getVendors);
  router.post('/vendors', validateBody(createVendorSchema), expenseController.createVendor);

  // Purchase Bills & POs
  router.get('/purchases', expenseController.getPurchases);
  router.post('/purchases', validateBody(createPurchaseBillSchema), expenseController.createPurchase);

  // Credit Notes
  router.get('/credit-notes', expenseController.getCreditNotes);
  router.post('/credit-notes', validateBody(createCreditNoteSchema), expenseController.createCreditNote);

  // E-Way Bills
  router.get('/eway-bills', expenseController.getEWayBills);
  router.post('/eway-bills', validateBody(createEWayBillSchema), expenseController.createEWayBill);

  return router;
}

export const expenseRouter = createExpenseRouter();

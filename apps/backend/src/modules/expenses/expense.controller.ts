import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../shared/types/authenticated-request.js';
import { storeModule } from '../stores/index.js';
import { AppError } from '../../shared/utils/AppError.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import { ApiResponse } from '../../shared/utils/ApiResponse.js';
import { expenseService } from './expense.service.js';

async function extractStoreId(req: Request): Promise<string> {
  const authReq = req as AuthenticatedRequest;
  let storeId =
    authReq.user?.storeId ||
    req.params.storeId ||
    (req.query.storeId as string) ||
    (req.headers['x-store-id'] as string) ||
    (req.body as any)?.storeId;

  if (!storeId && authReq.user) {
    const userId = (authReq.user as any)._id || authReq.user.id || (authReq.user as any).sub;
    if (userId) {
      const store = await storeModule.getStoreByOwnerId(userId);
      if (store) {
        storeId = store.id;
      }
    }
  }

  if (!storeId) {
    throw AppError.badRequest('Store context is required for expense operations', 'STORE_ID_REQUIRED');
  }

  return storeId;
}

export const expenseController = {
  getOverview: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const kpis = await expenseService.getOverviewKPIs(storeId);
    return ApiResponse.success(res, kpis);
  }),

  getAllTransactions: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const txns = await expenseService.getAllTransactions(storeId);
    return ApiResponse.success(res, txns);
  }),

  getExpenses: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const expenses = await expenseService.getExpenses(storeId);
    return ApiResponse.success(res, expenses);
  }),

  createExpense: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const expense = await expenseService.createExpense(storeId, req.body);
    return ApiResponse.created(res, expense, 'Expense recorded successfully');
  }),

  deleteExpense: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const expenseId = req.params.id as string;
    const result = await expenseService.deleteExpense(storeId, expenseId);
    return ApiResponse.success(res, result, 'Expense deleted successfully');
  }),

  getVendors: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const vendors = await expenseService.getVendors(storeId);
    return ApiResponse.success(res, vendors);
  }),

  createVendor: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const vendor = await expenseService.createVendor(storeId, req.body);
    return ApiResponse.created(res, vendor, 'Vendor added successfully');
  }),

  getPurchases: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const type = req.query.type as string | undefined;
    const purchases = await expenseService.getPurchaseBills(storeId, type);
    return ApiResponse.success(res, purchases);
  }),

  createPurchase: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const purchase = await expenseService.createPurchaseBill(storeId, req.body);
    return ApiResponse.created(res, purchase, 'Purchase record created successfully');
  }),

  getCreditNotes: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const creditNotes = await expenseService.getCreditNotes(storeId);
    return ApiResponse.success(res, creditNotes);
  }),

  createCreditNote: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const creditNote = await expenseService.createCreditNote(storeId, req.body);
    return ApiResponse.created(res, creditNote, 'Credit note issued successfully');
  }),

  getEWayBills: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const bills = await expenseService.getEWayBills(storeId);
    return ApiResponse.success(res, bills);
  }),

  createEWayBill: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const ewayBill = await expenseService.createEWayBill(storeId, req.body);
    return ApiResponse.created(res, ewayBill, 'E-Way bill generated successfully');
  }),
};

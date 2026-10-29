import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../shared/types/authenticated-request.js';
import { SettlementService } from './settlement.service.js';
import { storeModule } from '../stores/index.js';
import { AppError } from '../../shared/utils/AppError.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import { ApiResponse } from '../../shared/utils/ApiResponse.js';

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
    throw AppError.badRequest('Store context is required for settlement operations', 'STORE_ID_REQUIRED');
  }

  return storeId;
}

export class SettlementController {
  /**
   * Get store settlement overview & KPIs
   */
  static getOverview = catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const overview = await SettlementService.getStoreSettlementOverview(storeId);
    return ApiResponse.success(res, overview);
  });

  /**
   * Get paginated past settlements history
   */
  static getHistory = catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const result = await SettlementService.getStoreSettlements(storeId, {
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      status: req.query.status as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
    });
    return ApiResponse.success(res, result);
  });

  /**
   * Get single settlement by ID
   */
  static getById = catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const settlement = await SettlementService.getSettlementById(req.params.id, storeId);
    return ApiResponse.success(res, settlement);
  });

  /**
   * Save verified merchant bank account
   */
  static saveBankAccount = catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const account = await SettlementService.saveBankAccount(storeId, req.body);
    return ApiResponse.success(res, account, 'Bank account updated successfully');
  });

  /**
   * Get store payout bank account
   */
  static getBankAccount = catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const account = await SettlementService.getBankAccount(storeId);
    return ApiResponse.success(res, account);
  });

  /**
   * Request manual payout withdrawal
   */
  static requestPayout = catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const request = await SettlementService.requestPayout(
      storeId,
      req.body.amount,
      req.body.remarks
    );
    return ApiResponse.created(res, request, 'Payout request submitted successfully');
  });
}


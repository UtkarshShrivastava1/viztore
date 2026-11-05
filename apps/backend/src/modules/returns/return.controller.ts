import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../shared/types/authenticated-request.js';
import { ReturnService } from './return.service.js';
import { storeModule } from '../stores/index.js';
import { AppError } from '../../shared/utils/AppError.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import { ApiResponse } from '../../shared/utils/ApiResponse.js';

async function extractStoreId(req: Request): Promise<string> {
  const authReq = req as AuthenticatedRequest;
  const headerStoreId =
    (req.headers['x-store-id'] as string) ||
    (req.headers['X-Store-Id'] as string) ||
    (req.headers['store-id'] as string) ||
    (req.headers['Store-Id'] as string);

  let storeId =
    headerStoreId ||
    authReq.user?.storeId ||
    req.params.storeId ||
    (req.query.storeId as string) ||
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

  // Graceful fallback for single-store / staging environment
  if (!storeId) {
    try {
      const fallbackStore = await storeModule.getStoreById('fallback');
      if (fallbackStore) {
        storeId = fallbackStore.id;
      }
    } catch {}
  }

  if (!storeId) {
    throw AppError.badRequest('Store context is required for return operations', 'STORE_ID_REQUIRED');
  }

  return storeId;
}

export class ReturnController {
  /**
   * Create new return (Customer or Merchant)
   */
  static createReturn = catchAsync(async (req: Request, res: Response) => {
    let storeId: string | undefined;
    try {
      storeId = await extractStoreId(req);
    } catch {
      storeId = req.body.storeId;
    }

    const returnItem = await ReturnService.createReturn(req.body, storeId);
    return ApiResponse.created(res, returnItem, 'Return request initiated successfully');
  });

  /**
   * Get store returns with search, filters and KPI summary
   */
  static getStoreReturns = catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const result = await ReturnService.getStoreReturns(storeId, {
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      status: req.query.status as string,
      type: req.query.type as string,
      search: req.query.search as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
    });

    return ApiResponse.success(res, result);
  });

  /**
   * Get single return by ID
   */
  static getReturnById = catchAsync(async (req: Request, res: Response) => {
    let storeId: string | undefined;
    try {
      storeId = await extractStoreId(req);
    } catch {
      // Allow customers to fetch their return by ID without merchant store context
    }

    const returnItem = await ReturnService.getReturnById((req.params.id || ''), storeId);
    return ApiResponse.success(res, returnItem);
  });

  /**
   * Approve return request
   */
  static approveReturn = catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const approved = await ReturnService.approveReturn((req.params.id || ''), storeId, req.body);
    return ApiResponse.success(res, approved, 'Return request approved successfully');
  });

  /**
   * Reject return request
   */
  static rejectReturn = catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const rejected = await ReturnService.rejectReturn((req.params.id || ''), storeId, req.body.reason);
    return ApiResponse.success(res, rejected, 'Return request rejected successfully');
  });

  /**
   * Process refund for return
   */
  static processRefund = catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const refunded = await ReturnService.processRefund((req.params.id || ''), storeId, req.body);
    return ApiResponse.success(res, refunded, 'Refund processed successfully');
  });

  /**
   * Get customer's own returns
   */
  static getMyReturns = catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const phone = authReq.user?.phone || (req.query.phone as string);
    const email = authReq.user?.email || (req.query.email as string);
    const customerId = (authReq.user as any)?.sub || (authReq.user as any)?.id || (req.query.customerId as string);
    const returns = await ReturnService.getMyReturns({ phone, email, customerId });
    return ApiResponse.success(res, returns);
  });
}


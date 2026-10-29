import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../shared/types/authenticated-request.js';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  AdjustCustomerCreditDto,
  RecordCustomerPaymentDto,
} from '@repo/shared-types';
import { customerService } from './customer.service.js';
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
    throw AppError.badRequest('Store context is required for customer operations', 'STORE_ID_REQUIRED');
  }

  return storeId;
}

export const customerController = {
  getCustomers: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const result = await customerService.getCustomers(storeId, req.query as any);
    return ApiResponse.success(res, result);
  }),

  getCustomerById: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const id = req.params.id as string;
    const result = await customerService.getCustomerById(storeId, id);
    return ApiResponse.success(res, result);
  }),

  createCustomer: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const customer = await customerService.createCustomer(
      storeId,
      req.body as CreateCustomerDto,
    );
    return ApiResponse.created(
      res,
      customer,
      `Customer ${customer.name} created successfully`,
    );
  }),

  updateCustomer: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const id = req.params.id as string;
    const customer = await customerService.updateCustomer(
      storeId,
      id,
      req.body as UpdateCustomerDto,
    );
    return ApiResponse.success(res, customer, 'Customer updated successfully');
  }),

  deleteCustomer: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const id = req.params.id as string;
    await customerService.deleteCustomer(storeId, id);
    return ApiResponse.success(res, null, 'Customer archived successfully');
  }),

  adjustCredit: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const id = req.params.id as string;
    const customer = await customerService.adjustStoreCredit(
      storeId,
      id,
      req.body as AdjustCustomerCreditDto,
    );
    return ApiResponse.success(res, customer, 'Store credit updated successfully');
  }),

  recordPayment: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const id = req.params.id as string;
    const customer = await customerService.recordPayment(
      storeId,
      id,
      req.body as RecordCustomerPaymentDto,
    );
    return ApiResponse.success(res, customer, 'Payment recorded successfully');
  }),
};


import { Request, Response, RequestHandler } from 'express';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import { ApiResponse } from '../../shared/utils/ApiResponse.js';
import { AppError } from '../../shared/utils/AppError.js';
import { StoreApprovalStatus, NearbyStoresQueryDto } from '@repo/shared-types';
import * as storeService from './store.service.js';

export const createStore: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized();
  }
  const store = await storeService.createStore(req.user.sub, req.body);
  return ApiResponse.created(res, store, 'Store registered successfully');
});

export const getNearbyStores: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as unknown as NearbyStoresQueryDto;
  const stores = await storeService.findNearbyStores(query);
  return ApiResponse.success(res, stores);
});

export const getStoreById: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw AppError.badRequest('Store ID is required');
  const store = await storeService.getStoreById(id);
  return ApiResponse.success(res, store);
});

export const getStoreBySlug: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  if (!slug) throw AppError.badRequest('Store slug is required');
  const store = await storeService.getStoreBySlug(slug);
  return ApiResponse.success(res, store);
});

export const updateStore: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw AppError.unauthorized();
  const { id } = req.params;
  if (!id) throw AppError.badRequest('Store ID is required');

  const body = { ...req.body };
  if (body.isOpen !== undefined && body.isActive === undefined) {
    body.isActive = body.isOpen;
  }

  const updatedStore = await storeService.updateStore(id, req.user.sub, body);
  return ApiResponse.success(res, updatedStore, 'Store updated successfully');
});

export const approveStore: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as { status: StoreApprovalStatus };
  if (!id) throw AppError.badRequest('Store ID is required');
  const store = await storeService.setStoreApprovalStatus(id, status);
  return ApiResponse.success(res, store, `Store status set to ${status}`);
});

export const getMyStores: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw AppError.unauthorized();
  const stores = await storeService.getMerchantStores(req.user.sub);
  return ApiResponse.success(res, stores);
});

export const listStores: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const result = await storeService.listAllStores(req.query as any);
  return ApiResponse.success(res, result.stores, undefined, undefined, result.meta);
});

export const rateStore: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw AppError.unauthorized();
  const { id } = req.params;
  if (!id) throw AppError.badRequest('Store ID is required');

  const result = await storeService.rateStore(id, req.user.sub, req.body);
  return ApiResponse.success(res, result, result.message);
});

export const getStoreRatings: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw AppError.badRequest('Store ID is required');

  const result = await storeService.getStoreRatings(id);
  return ApiResponse.success(res, result);
});


export const getStoreSettings: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw AppError.unauthorized();
  const { id } = req.params;
  if (!id) throw AppError.badRequest('Store ID is required');

  const settings = await storeService.getStoreSettings(id, req.user.sub);
  return ApiResponse.success(res, settings, 'Store settings fetched successfully');
});

export const updateStoreSettings: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw AppError.unauthorized();
  const { id } = req.params;
  if (!id) throw AppError.badRequest('Store ID is required');

  const updatedSettings = await storeService.updateStoreSettings(id, req.user.sub, req.body, req.user.role);
  return ApiResponse.success(res, updatedSettings, 'Store settings updated and persisted successfully');
});

export const verifyPan: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const { pan } = req.body;
  if (!pan || typeof pan !== 'string') {
    throw AppError.badRequest('PAN number string is required', 'PAN_REQUIRED');
  }

  const result = await storeService.verifyPan(pan);
  return ApiResponse.success(res, result, result.message);
});

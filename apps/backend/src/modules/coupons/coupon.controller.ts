import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../shared/types/authenticated-request.js';
import { ApiResponse } from '../../shared/utils/ApiResponse.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import { couponService } from './coupon.service.js';

export const couponController = {
  getActiveCoupons: catchAsync(async (req: Request, res: Response) => {
    const storeId = (req.query.storeId as string) || (req.headers['x-store-id'] as string) || undefined;
    const coupons = await couponService.getActiveCoupons(storeId);
    return ApiResponse.success(res, coupons);
  }),

  validateCoupon: catchAsync(async (req: Request, res: Response) => {
    const { code, subtotal, storeId } = req.body;
    const result = await couponService.validateCoupon(code, Number(subtotal), storeId);
    return ApiResponse.success(res, result, `Coupon ${result.coupon.code} applied successfully!`);
  }),

  createCoupon: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const storeId = authReq.user?.storeId || req.body.storeId || null;
    const coupon = await couponService.createCoupon(storeId, req.body);
    return ApiResponse.created(res, coupon, 'Coupon created successfully');
  }),

  deleteCoupon: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const storeId = authReq.user?.storeId;
    const { id } = req.params;
    const result = await couponService.deleteCoupon(id, storeId);
    return ApiResponse.success(res, result, 'Coupon deleted successfully');
  }),
};


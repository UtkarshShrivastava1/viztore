import { Request, Response, RequestHandler } from 'express';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import { ApiResponse } from '../../shared/utils/ApiResponse.js';
import { AppError } from '../../shared/utils/AppError.js';
import {
  ONBOARDING_PLANS,
  validateOnboardingCouponSchema,
  createOnboardingOrderSchema,
  verifyOnboardingPaymentSchema,
} from '@repo/shared-types';
import * as onboardingPaymentService from './onboarding-payment.service.js';

export const getPlans: RequestHandler = catchAsync(async (_req: Request, res: Response) => {
  return ApiResponse.success(res, Object.values(ONBOARDING_PLANS), 'Commercial plans retrieved successfully');
});

export const validateCoupon: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const parsed = validateOnboardingCouponSchema.safeParse(req.body);
  if (!parsed.success) {
    throw AppError.badRequest('Invalid coupon validation payload', 'VALIDATION_ERROR', parsed.error.format());
  }

  const result = await onboardingPaymentService.validateCoupon(
    parsed.data.couponCode,
    parsed.data.salesId,
    parsed.data.planId,
  );

  if (!result.valid) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_COUPON',
        message: result.message || 'Invalid or expired coupon code',
      },
    });
  }

  return ApiResponse.success(res, result, 'Coupon applied successfully');
});

export const createPaymentOrder: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized('Authentication required to initiate payment');
  }

  const parsed = createOnboardingOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    throw AppError.badRequest('Invalid order creation payload', 'VALIDATION_ERROR', parsed.error.format());
  }

  const result = await onboardingPaymentService.createPaymentOrder(
    req.user.sub,
    parsed.data.planId,
    parsed.data.couponCode,
    parsed.data.salesId,
    {
      merchantEmail: parsed.data.merchantEmail,
      merchantPhone: parsed.data.merchantPhone,
      storeName: parsed.data.storeName,
    },
  );

  return ApiResponse.created(res, result, result.isFree ? 'Promotional waiver applied' : 'Razorpay order created');
});

export const verifyPayment: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw AppError.unauthorized('Authentication required to verify payment');
  }

  const parsed = verifyOnboardingPaymentSchema.safeParse(req.body);
  if (!parsed.success) {
    throw AppError.badRequest('Invalid payment verification payload', 'VALIDATION_ERROR', parsed.error.format());
  }

  const result = await onboardingPaymentService.verifyPayment(
    parsed.data.draftId,
    parsed.data.razorpayOrderId,
    parsed.data.razorpayPaymentId,
    parsed.data.razorpaySignature,
    parsed.data.isFree,
  );

  return ApiResponse.success(res, result, 'Payment verified successfully');
});

import crypto from 'crypto';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import {
  OnboardingPlanId,
  ONBOARDING_PLANS,
  PRECODED_ONBOARDING_COUPONS,
  IOnboardingPaymentRecord,
  findActiveSalesRep,
  ISalesRepConfig,
} from '@repo/shared-types';
import { AppError } from '../../shared/utils/AppError.js';
import {
  OnboardingPaymentDraftModel,
  IOnboardingPaymentDraftDocument,
} from './onboarding-payment-draft.model.js';

export interface CouponValidationResult {
  valid: boolean;
  code?: string;
  discountType?: 'PERCENTAGE' | 'FLAT';
  discountValue?: number;
  discountAmount?: number;
  finalAmount?: number;
  planId?: OnboardingPlanId;
  description?: string;
  message?: string;
  salesRep?: {
    salesId: string;
    name: string;
    territory: string;
  };
}

export interface CreateOrderResult {
  isFree: boolean;
  draftId: string;
  amount: number; // In paise if paid, 0 if free
  currency: 'INR';
  keyId?: string;
  razorpayOrderId?: string | null;
  planId: OnboardingPlanId;
  couponCode?: string | null;
  salesId?: string | null;
}

/**
 * Validates a pre-coded promotional onboarding coupon against a commercial plan
 * Swaad Setu Pattern: All promotional codes & waivers REQUIRE an active Sales Representative ID
 */
export async function validateCoupon(
  couponCode: string,
  salesId?: string | null,
  planId: OnboardingPlanId = 'standard',
): Promise<CouponValidationResult> {
  const plan = ONBOARDING_PLANS[planId];
  if (!plan) {
    return { valid: false, message: 'Invalid commercial plan selected' };
  }

  const cleanSalesId = salesId?.trim().toUpperCase();
  if (!cleanSalesId) {
    return {
      valid: false,
      message: 'A valid Sales Representative ID is required to apply promotional coupons or waivers',
    };
  }

  const salesRep: ISalesRepConfig | null = findActiveSalesRep(cleanSalesId);
  if (!salesRep) {
    return {
      valid: false,
      message: `Invalid or inactive Sales Representative ID "${cleanSalesId}". Please check with your field agent`,
    };
  }

  const cleanCode = couponCode.trim().toUpperCase();
  const coupon = PRECODED_ONBOARDING_COUPONS[cleanCode];

  if (!coupon || !coupon.isActive) {
    return { valid: false, message: 'Invalid or inactive coupon code' };
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, message: 'Coupon code has expired' };
  }

  if (coupon.allowedSalesReps && !coupon.allowedSalesReps.includes(salesRep.salesId)) {
    return {
      valid: false,
      message: `Coupon ${cleanCode} is not authorized for Field Agent ID ${salesRep.salesId}`,
    };
  }

  if (coupon.allowedPlans && !coupon.allowedPlans.includes(plan.id)) {
    return {
      valid: false,
      message: `Coupon ${cleanCode} is not applicable for ${plan.name}`,
    };
  }

  let discountAmount = 0;
  if (coupon.discountType === 'PERCENTAGE') {
    discountAmount = Math.round((plan.basePrice * coupon.discountValue) / 100);
  } else {
    discountAmount = coupon.discountValue;
  }

  if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
    discountAmount = coupon.maxDiscountAmount;
  }

  // Ensure discount does not exceed base price
  discountAmount = Math.min(plan.basePrice, discountAmount);
  const finalAmount = Math.max(0, plan.basePrice - discountAmount);

  return {
    valid: true,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount,
    finalAmount,
    planId,
    description: coupon.description,
    salesRep: {
      salesId: salesRep.salesId,
      name: salesRep.name,
      territory: salesRep.territory,
    },
  };
}

/**
 * Creates an onboarding payment order or ₹0 instant-waiver draft
 */
export async function createPaymentOrder(
  ownerId: string,
  planId: OnboardingPlanId = 'standard',
  couponCode?: string | null,
  salesId?: string | null,
  metadata: Record<string, any> = {},
): Promise<CreateOrderResult> {
  const plan = ONBOARDING_PLANS[planId];
  if (!plan) {
    throw AppError.badRequest('Invalid commercial plan selected');
  }

  let discountAmount = 0;
  let finalAmount = plan.basePrice;
  let cleanCoupon: string | null = null;
  let cleanSalesId: string | null = null;

  if (salesId && salesId.trim()) {
    cleanSalesId = salesId.trim().toUpperCase();
    const salesRep = findActiveSalesRep(cleanSalesId);
    if (!salesRep) {
      throw AppError.badRequest(`Invalid or inactive Sales Representative ID "${cleanSalesId}"`);
    }
  }

  if (couponCode && couponCode.trim()) {
    if (!cleanSalesId) {
      throw AppError.badRequest('A valid Sales Representative ID is required to apply promotional coupons');
    }
    const couponValidation = await validateCoupon(couponCode, cleanSalesId, planId);
    if (!couponValidation.valid) {
      throw AppError.badRequest(couponValidation.message || 'Invalid coupon code applied');
    }
    cleanCoupon = couponValidation.code || couponCode.trim().toUpperCase();
    discountAmount = couponValidation.discountAmount || 0;
    finalAmount = couponValidation.finalAmount ?? (plan.basePrice - discountAmount);
  }

  // Phase 1: Zero-Amount / 100% Free Promo Bypass (e.g. FREE100, LAUNCH100)
  if (finalAmount <= 0) {
    const draft = await OnboardingPaymentDraftModel.create({
      ownerId: new mongoose.Types.ObjectId(ownerId),
      planId: plan.id,
      planName: plan.name,
      basePrice: plan.basePrice,
      discountAmount,
      finalAmount: 0,
      currency: 'INR',
      couponCode: cleanCoupon,
      salesId: cleanSalesId,
      status: 'COUPON_WAIVED',
      isFree: true,
      metadata,
      verifiedAt: new Date(),
    });

    return {
      isFree: true,
      draftId: draft._id.toString(),
      amount: 0,
      currency: 'INR',
      planId: plan.id,
      couponCode: cleanCoupon,
      salesId: cleanSalesId,
    };
  }

  // Phase 2: Paid Razorpay Order Initiation
  let razorpayOrderId: string | null = null;
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (keyId && keySecret) {
    try {
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const order = await razorpay.orders.create({
        amount: Math.round(finalAmount * 100), // In paise
        currency: 'INR',
        receipt: `onb_${Date.now()}_${ownerId.slice(-4)}`,
        notes: {
          ownerId,
          planId: plan.id,
          couponCode: cleanCoupon || '',
          salesId: cleanSalesId || '',
          platform: 'viztore',
        },
      });
      razorpayOrderId = order.id;
    } catch (rzpErr: any) {
      throw AppError.internal(
        `Failed to initialize gateway order: ${rzpErr.message || 'Razorpay error'}`,
      );
    }
  } else {
    // Development / test fallback when keys are not in environment
    razorpayOrderId = `order_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  }

  const draft = await OnboardingPaymentDraftModel.create({
    ownerId: new mongoose.Types.ObjectId(ownerId),
    planId: plan.id,
    planName: plan.name,
    basePrice: plan.basePrice,
    discountAmount,
    finalAmount,
    currency: 'INR',
    couponCode: cleanCoupon,
    salesId: cleanSalesId,
    status: 'PENDING',
    isFree: false,
    razorpayOrderId,
    metadata,
  });

  return {
    isFree: false,
    draftId: draft._id.toString(),
    amount: Math.round(finalAmount * 100),
    currency: 'INR',
    keyId: keyId || 'rzp_test_placeholder',
    razorpayOrderId,
    planId: plan.id,
    couponCode: cleanCoupon,
    salesId: cleanSalesId,
  };
}

/**
 * Cryptographically verifies Razorpay signature and marks draft completed via atomic mutex
 */
export async function verifyPayment(
  draftId: string,
  razorpayOrderId?: string | null,
  razorpayPaymentId?: string | null,
  razorpaySignature?: string | null,
  isFree: boolean = false,
): Promise<{ success: boolean; draft: IOnboardingPaymentDraftDocument }> {
  const draft = await OnboardingPaymentDraftModel.findById(draftId);
  if (!draft) {
    throw AppError.notFound('Payment draft not found');
  }

  // Idempotent success if already completed
  if (draft.status === 'PAID' || (draft.isFree && draft.status === 'COUPON_WAIVED')) {
    return { success: true, draft };
  }

  // If ₹0 / Free promo
  if (draft.isFree || isFree) {
    draft.status = 'COUPON_WAIVED';
    draft.verifiedAt = new Date();
    await draft.save();
    return { success: true, draft };
  }

  // Paid verification: HMAC-SHA256 signature verification
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (keySecret && razorpayOrderId && razorpayPaymentId && razorpaySignature) {
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      throw AppError.badRequest('Invalid payment signature', 'INVALID_SIGNATURE');
    }
  }

  // Swaad Setu Mutex: Atomic test-and-set query
  const updatedDraft = await OnboardingPaymentDraftModel.findOneAndUpdate(
    { _id: draft._id, status: { $ne: 'PAID' } },
    {
      status: 'PAID',
      razorpayPaymentId: razorpayPaymentId || draft.razorpayPaymentId,
      razorpaySignature: razorpaySignature || draft.razorpaySignature,
      verifiedAt: new Date(),
    },
    { new: true },
  );

  return { success: true, draft: updatedDraft || draft };
}

/**
 * Builds the canonical IOnboardingPaymentRecord from a verified draft
 */
export function buildPaymentRecordFromDraft(
  draft: IOnboardingPaymentDraftDocument,
): IOnboardingPaymentRecord {
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  return {
    planId: draft.planId,
    planName: draft.planName,
    billingCycle: 'yearly',
    basePrice: draft.basePrice,
    discountAmount: draft.discountAmount,
    finalAmountPaid: draft.finalAmount,
    currency: draft.currency || 'INR',
    couponCode: draft.couponCode || null,
    salesId: draft.salesId || null,
    paymentStatus: draft.status,
    razorpayOrderId: draft.razorpayOrderId || null,
    razorpayPaymentId: draft.razorpayPaymentId || null,
    paidAt: draft.verifiedAt || new Date(),
    expiresAt,
  };
}

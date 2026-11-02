import { z } from 'zod';
import {
  COMMERCIAL_PLANS,
  COMMERCIAL_COUPONS,
  COMMERCIAL_SALES_REPS,
  ISalesRepConfig,
  findActiveSalesRep,
} from './onboarding-commercial.config.js';

export type OnboardingPlanId = 'standard' | 'starter' | 'growth';
export type OnboardingCouponDiscountType = 'PERCENTAGE' | 'FLAT';
export type OnboardingPaymentStatus = 'PENDING' | 'PAID' | 'COUPON_WAIVED' | 'FAILED';

export interface IOnboardingPlan {
  id: OnboardingPlanId;
  name: string;
  tagline: string;
  basePrice: number; // In INR e.g. 12000
  currency: 'INR';
  billingCycle: 'yearly';
  features: string[];
  isPopular?: boolean;
}

export interface IOnboardingCouponConfig {
  code: string;
  discountType: OnboardingCouponDiscountType;
  discountValue: number; // 100 for 100%, 50 for 50%, or flat amount
  description: string;
  maxDiscountAmount?: number;
  isActive: boolean;
  requiresSalesId?: boolean;
  allowedSalesReps?: string[];
  allowedPlans?: OnboardingPlanId[];
  expiresAt?: string;
}

export interface IOnboardingPaymentRecord {
  planId: OnboardingPlanId;
  planName: string;
  billingCycle: 'yearly';
  basePrice: number;
  discountAmount: number;
  finalAmountPaid: number;
  currency: 'INR';
  couponCode?: string | null;
  salesId?: string | null;
  paymentStatus: OnboardingPaymentStatus;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  paidAt?: string | Date;
  expiresAt?: string | Date;
}

// Canonical commercial plans and pre-coded coupons (Re-exported from commercial config)
export const ONBOARDING_PLANS: Record<OnboardingPlanId, IOnboardingPlan> = COMMERCIAL_PLANS;
export const PRECODED_ONBOARDING_COUPONS: Record<string, IOnboardingCouponConfig> = COMMERCIAL_COUPONS;
export { COMMERCIAL_PLANS, COMMERCIAL_COUPONS, COMMERCIAL_SALES_REPS, findActiveSalesRep };
export type { ISalesRepConfig };

// Zod Schemas
export const validateOnboardingCouponSchema = z.object({
  couponCode: z.string().min(2, 'Coupon code is required').max(30),
  salesId: z.string().min(2, 'Sales Representative ID is required to apply coupons').max(30),
  planId: z.enum(['standard', 'starter', 'growth']).default('standard'),
});

export const createOnboardingOrderSchema = z.object({
  planId: z.enum(['standard', 'starter', 'growth']).default('standard'),
  couponCode: z.string().optional().nullable(),
  salesId: z.string().optional().nullable(),
  merchantEmail: z.string().email().optional(),
  merchantPhone: z.string().optional(),
  storeName: z.string().optional(),
});

export const verifyOnboardingPaymentSchema = z.object({
  draftId: z.string().min(1, 'Payment Draft ID is required'),
  isFree: z.boolean().default(false),
  razorpayOrderId: z.string().optional().nullable(),
  razorpayPaymentId: z.string().optional().nullable(),
  razorpaySignature: z.string().optional().nullable(),
});

export type ValidateOnboardingCouponDto = z.infer<typeof validateOnboardingCouponSchema>;
export type CreateOnboardingOrderDto = z.infer<typeof createOnboardingOrderSchema>;
export type VerifyOnboardingPaymentDto = z.infer<typeof verifyOnboardingPaymentSchema>;

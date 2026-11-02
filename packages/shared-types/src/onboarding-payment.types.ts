import { z } from 'zod';

export type OnboardingPlanId = 'starter' | 'growth';
export type OnboardingCouponDiscountType = 'PERCENTAGE' | 'FLAT';
export type OnboardingPaymentStatus = 'PENDING' | 'PAID' | 'COUPON_WAIVED' | 'FAILED';

export interface IOnboardingPlan {
  id: OnboardingPlanId;
  name: string;
  tagline: string;
  basePrice: number; // In INR e.g. 4999
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
  paymentStatus: OnboardingPaymentStatus;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  paidAt?: string | Date;
  expiresAt?: string | Date;
}

// Pre-configured default commercial plans
export const ONBOARDING_PLANS: Record<OnboardingPlanId, IOnboardingPlan> = {
  starter: {
    id: 'starter',
    name: 'Starter Hyperlocal Storefront',
    tagline: 'Ideal for local retailers digitizing for the first time',
    basePrice: 4999,
    currency: 'INR',
    billingCycle: 'yearly',
    features: [
      'Discoverable within 3–4 km customer delivery radius',
      'Automated WhatsApp Rider Dispatch integration',
      '0% commission on direct customer store pickups',
      'Live 8-stage merchant order fulfillment board',
      'Single-store cart checkout & digital tax invoices',
      'Standard email & dashboard support',
    ],
    isPopular: true,
  },
  growth: {
    id: 'growth',
    name: 'Growth Pro Storefront & Multi-POS',
    tagline: 'For busy shops wanting high-speed counter billing & priority delivery',
    basePrice: 9999,
    currency: 'INR',
    billingCycle: 'yearly',
    features: [
      'Everything in Starter Hyperlocal Storefront',
      'High-speed In-House Counter POS Billing module',
      'Multi-staff cash register PIN management',
      'Priority delivery dispatch routing & runner broadcasting',
      'Thermal 58mm/80mm receipt generation & barcode printing',
      'Dedicated partner manager & priority WhatsApp support',
    ],
    isPopular: false,
  },
};

// Pre-coded coupon codes engine
export const PRECODED_ONBOARDING_COUPONS: Record<string, IOnboardingCouponConfig> = {
  FREE100: {
    code: 'FREE100',
    discountType: 'PERCENTAGE',
    discountValue: 100,
    description: '100% Free Storefront Onboarding (Full Waiver)',
    isActive: true,
  },
  WELCOME50: {
    code: 'WELCOME50',
    discountType: 'PERCENTAGE',
    discountValue: 50,
    description: '50% Welcome Discount on First Year Onboarding',
    isActive: true,
  },
  LAUNCH100: {
    code: 'LAUNCH100',
    discountType: 'PERCENTAGE',
    discountValue: 100,
    description: '100% Launch Pilot Partner Waiver',
    isActive: true,
  },
  STORE100: {
    code: 'STORE100',
    discountType: 'PERCENTAGE',
    discountValue: 100,
    description: '100% Field Sales Representative Onboarding Pass',
    isActive: true,
  },
  TRIAL30: {
    code: 'TRIAL30',
    discountType: 'PERCENTAGE',
    discountValue: 30,
    description: '30% Introductory Retail Discount',
    isActive: true,
  },
  FESTIVE25: {
    code: 'FESTIVE25',
    discountType: 'PERCENTAGE',
    discountValue: 25,
    description: '25% Festive Seasonal Partner Discount',
    isActive: true,
  },
};

// Zod Schemas
export const validateOnboardingCouponSchema = z.object({
  couponCode: z.string().min(2, 'Coupon code is required').max(30),
  planId: z.enum(['starter', 'growth']).default('starter'),
});

export const createOnboardingOrderSchema = z.object({
  planId: z.enum(['starter', 'growth']),
  couponCode: z.string().optional().nullable(),
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


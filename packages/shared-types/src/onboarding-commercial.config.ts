import {
  OnboardingPlanId,
  IOnboardingPlan,
  IOnboardingCouponConfig,
} from './onboarding-payment.types.js';

export interface ISalesRepConfig {
  salesId: string;
  name: string;
  phone: string;
  territory: string;
  commissionRatePct: number;
  isActive: boolean;
  notes?: string;
}

/**
 * ==============================================================================
 * CENTRAL COMMERCIAL ONBOARDING CONFIGURATION (Superadmin Baseline)
 * ==============================================================================
 * Single source of truth for:
 * 1. Subscription Plans (Single standard 12k all-inclusive plan)
 * 2. Field Sales Representatives (Authorized Salesperson IDs)
 * 3. Promotional Coupons (Bound to Sales Rep authorization)
 */

// 1. All-Inclusive Standard Commercial Plan (₹12,000/year)
export const COMMERCIAL_PLANS: Record<OnboardingPlanId, IOnboardingPlan> = {
  standard: {
    id: 'standard',
    name: 'Standard All-Inclusive Storefront & Retail OS',
    tagline: 'Complete retail suite: Hyperlocal discovery, in-house counter POS, delivery & billing',
    basePrice: 12000,
    currency: 'INR',
    billingCycle: 'yearly',
    isPopular: true,
    features: [
      'Discoverable within 3–4 km customer delivery radius',
      'Unlimited catalog products & real-time inventory management',
      'In-House High-Speed Counter POS Billing module',
      'Automated WhatsApp Delivery Partner Dispatch & OTP handshake',
      'Single-store cart checkout & digital GST tax invoices',
      'Thermal 58mm/80mm receipt printing & barcode generation',
      'Multi-staff cash register PIN management',
      'Customer Khata credit ledger & CRM purchase history',
      '0% commission on direct customer store pickups',
      'Dedicated onboarding specialist & priority support',
    ],
  },
  // Legacy aliases for backward compatibility
  starter: {
    id: 'starter',
    name: 'Standard All-Inclusive Storefront & Retail OS',
    tagline: 'Complete retail suite: Hyperlocal discovery, in-house counter POS, delivery & billing',
    basePrice: 12000,
    currency: 'INR',
    billingCycle: 'yearly',
    isPopular: true,
    features: [
      'Discoverable within 3–4 km customer delivery radius',
      'Unlimited catalog products & real-time inventory management',
      'In-House High-Speed Counter POS Billing module',
      'Automated WhatsApp Delivery Partner Dispatch & OTP handshake',
      'Single-store cart checkout & digital GST tax invoices',
      'Thermal 58mm/80mm receipt printing & barcode generation',
      'Multi-staff cash register PIN management',
      'Customer Khata credit ledger & CRM purchase history',
      '0% commission on direct customer store pickups',
      'Dedicated onboarding specialist & priority support',
    ],
  },
  growth: {
    id: 'growth',
    name: 'Growth Enterprise Multi-Outlet',
    tagline: 'For multi-outlet retail chains and franchise networks',
    basePrice: 24000,
    currency: 'INR',
    billingCycle: 'yearly',
    isPopular: false,
    features: [
      'Everything in Standard All-Inclusive',
      'Multi-outlet franchise centralized inventory dashboard',
      'Advanced role-based access control (RBAC)',
      'Custom ERP API data synchronization',
      'Dedicated 24/7 account manager',
    ],
  },
};

// 2. Active Authorized Field Sales Representatives
export const COMMERCIAL_SALES_REPS: Record<string, ISalesRepConfig> = {
  'SALES-01': {
    salesId: 'SALES-01',
    name: 'Harish Kumar',
    phone: '9876543210',
    territory: 'Bhilai / Durg',
    commissionRatePct: 15,
    isActive: true,
    notes: 'Field Operations Lead',
  },
  'SALES-02': {
    salesId: 'SALES-02',
    name: 'XYX',
    phone: '9876543211',
    territory: 'Raipur Central',
    commissionRatePct: 15,
    isActive: true,
    notes: 'Platform Solutions Lead',
  },
  'AGENT-PILOT': {
    salesId: 'AGENT-PILOT',
    name: 'Pilot Launch Field Team',
    phone: '9876543212',
    territory: 'Chhattisgarh Region',
    commissionRatePct: 0,
    isActive: true,
    notes: 'Universal Pilot Onboarding Pass',
  },
  'SALES-HARISH': {
    salesId: 'SALES-HARISH',
    name: 'Harish Kumar',
    phone: '9876543210',
    territory: 'Bhilai / Durg Urban',
    commissionRatePct: 15,
    isActive: true,
  },
  'SALES-UTKARSH': {
    salesId: 'Harish Kumar',
    name: 'Utkarsh Shrivastava',
    phone: '9876543211',
    territory: 'Raipur Central',
    commissionRatePct: 15,
    isActive: true,
  },
};

// 3. Promotional Coupons (Bound strictly to active Sales IDs)
export const COMMERCIAL_COUPONS: Record<string, IOnboardingCouponConfig> = {
  FREE100: {
    code: 'FREE100',
    discountType: 'PERCENTAGE',
    discountValue: 100,
    description: '100% Free Storefront Onboarding (Field Agent Pilot Waiver)',
    requiresSalesId: true,
    isActive: true,
  },
  WELCOME50: {
    code: 'WELCOME50',
    discountType: 'PERCENTAGE',
    discountValue: 50,
    description: '50% Welcome Discount on First Year Onboarding',
    requiresSalesId: true,
    isActive: true,
  },
  LAUNCH100: {
    code: 'LAUNCH100',
    discountType: 'PERCENTAGE',
    discountValue: 100,
    description: '100% Launch Pilot Partner Waiver',
    requiresSalesId: true,
    isActive: true,
  },
  STORE100: {
    code: 'STORE100',
    discountType: 'PERCENTAGE',
    discountValue: 100,
    description: '100% Field Representative Onboarding Pass',
    requiresSalesId: true,
    isActive: true,
  },
  TRIAL30: {
    code: 'TRIAL30',
    discountType: 'PERCENTAGE',
    discountValue: 30,
    description: '30% Introductory Retail Discount',
    requiresSalesId: true,
    isActive: true,
  },
  FESTIVE25: {
    code: 'FESTIVE25',
    discountType: 'PERCENTAGE',
    discountValue: 25,
    description: '25% Festive Seasonal Partner Discount',
    requiresSalesId: true,
    isActive: true,
  },
};

/**
 * Validates whether a Sales Representative ID exists and is active
 */
export function findActiveSalesRep(rawSalesId?: string | null): ISalesRepConfig | null {
  if (!rawSalesId) return null;
  const cleanId = rawSalesId.trim().toUpperCase();
  const rep = COMMERCIAL_SALES_REPS[cleanId];
  if (rep && rep.isActive) return rep;
  return null;
}


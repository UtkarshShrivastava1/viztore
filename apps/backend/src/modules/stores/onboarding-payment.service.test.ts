import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import * as onboardingPaymentService from './onboarding-payment.service.js';
import { OnboardingPaymentDraftModel } from './onboarding-payment-draft.model.js';

describe('Onboarding Payment & Pre-coded Coupon Pipeline', () => {
  const dummyOwnerId = new mongoose.Types.ObjectId().toString();

  describe('Coupon Validation Engine with Sales Representative Binding', () => {
    it('should validate FREE100 with valid salesId and provide 100% waiver (finalAmount = 0 on 12k standard plan)', async () => {
      const result = await onboardingPaymentService.validateCoupon('FREE100', 'SALES-01', 'standard');
      expect(result.valid).toBe(true);
      expect(result.code).toBe('FREE100');
      expect(result.discountValue).toBe(100);
      expect(result.discountAmount).toBe(12000);
      expect(result.finalAmount).toBe(0);
      expect(result.salesRep?.salesId).toBe('SALES-01');
      expect(result.salesRep?.name).toBe('Harish Kumar');
    });

    it('should reject coupon application if salesId is missing', async () => {
      const result = await onboardingPaymentService.validateCoupon('FREE100', null, 'standard');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Sales Representative ID is required');
    });

    it('should reject coupon application if salesId is invalid or inactive', async () => {
      const result = await onboardingPaymentService.validateCoupon('FREE100', 'INVALID_REP', 'standard');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Invalid or inactive Sales Representative ID');
    });

    it('should normalize lowercase and whitespace in coupon and sales IDs', async () => {
      const result = await onboardingPaymentService.validateCoupon('   free100  ', '  sales-01  ', 'standard');
      expect(result.valid).toBe(true);
      expect(result.code).toBe('FREE100');
      expect(result.salesRep?.salesId).toBe('SALES-01');
      expect(result.finalAmount).toBe(0);
    });

    it('should calculate 50% discount with WELCOME50 on 12k standard plan', async () => {
      const result = await onboardingPaymentService.validateCoupon('WELCOME50', 'SALES-02', 'standard');
      expect(result.valid).toBe(true);
      expect(result.code).toBe('WELCOME50');
      expect(result.discountAmount).toBe(6000);
      expect(result.finalAmount).toBe(6000);
      expect(result.salesRep?.salesId).toBe('SALES-02');
    });

    it('should reject invalid or non-existent coupon codes even with valid salesId', async () => {
      const result = await onboardingPaymentService.validateCoupon('INVALID99', 'SALES-01', 'standard');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Invalid or inactive coupon code');
    });
  });

  describe('Order Creation & Zero-Amount Bypass with Sales Rep Attribution', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('should bypass gateway and return isFree=true when FREE100 is applied with salesId', async () => {
      const mockDraft = {
        _id: new mongoose.Types.ObjectId(),
        ownerId: dummyOwnerId,
        planId: 'standard',
        planName: 'Standard All-Inclusive Storefront & Retail OS',
        basePrice: 12000,
        discountAmount: 12000,
        finalAmount: 0,
        currency: 'INR',
        couponCode: 'FREE100',
        salesId: 'SALES-01',
        status: 'COUPON_WAIVED',
        isFree: true,
      };

      vi.spyOn(OnboardingPaymentDraftModel, 'create').mockResolvedValue(mockDraft as any);

      const orderResult = await onboardingPaymentService.createPaymentOrder(
        dummyOwnerId,
        'standard',
        'FREE100',
        'SALES-01',
      );

      expect(orderResult.isFree).toBe(true);
      expect(orderResult.amount).toBe(0);
      expect(orderResult.couponCode).toBe('FREE100');
      expect(orderResult.salesId).toBe('SALES-01');
      expect(orderResult.draftId).toBe(mockDraft._id.toString());
    });

    it('should create a paid order with discount when WELCOME50 is applied', async () => {
      const mockDraft = {
        _id: new mongoose.Types.ObjectId(),
        ownerId: dummyOwnerId,
        planId: 'standard',
        planName: 'Standard All-Inclusive Storefront & Retail OS',
        basePrice: 12000,
        discountAmount: 6000,
        finalAmount: 6000,
        currency: 'INR',
        couponCode: 'WELCOME50',
        salesId: 'SALES-01',
        status: 'PENDING',
        isFree: false,
        razorpayOrderId: 'order_sim_12345',
      };

      vi.spyOn(OnboardingPaymentDraftModel, 'create').mockResolvedValue(mockDraft as any);

      const orderResult = await onboardingPaymentService.createPaymentOrder(
        dummyOwnerId,
        'standard',
        'WELCOME50',
        'SALES-01',
      );

      expect(orderResult.isFree).toBe(false);
      expect(orderResult.amount).toBe(600000); // 6000 INR in paise
      expect(orderResult.couponCode).toBe('WELCOME50');
      expect(orderResult.salesId).toBe('SALES-01');
      expect(orderResult.razorpayOrderId).toBeTruthy();
    });
  });

  describe('Payment Verification & Mutex Concurrency', () => {
    it('should verify free waiver draft without requiring razorpay signature', async () => {
      const mockDraft = {
        _id: new mongoose.Types.ObjectId(),
        status: 'COUPON_WAIVED',
        isFree: true,
        save: vi.fn().mockResolvedValue(true),
      };

      vi.spyOn(OnboardingPaymentDraftModel, 'findById').mockResolvedValue(mockDraft as any);

      const verifyResult = await onboardingPaymentService.verifyPayment(
        mockDraft._id.toString(),
        null,
        null,
        null,
        true,
      );

      expect(verifyResult.success).toBe(true);
      expect(verifyResult.draft.status).toBe('COUPON_WAIVED');
    });

    it('should return idempotent success when draft is already marked paid', async () => {
      const mockDraft = {
        _id: new mongoose.Types.ObjectId(),
        status: 'PAID',
        isFree: false,
      };

      vi.spyOn(OnboardingPaymentDraftModel, 'findById').mockResolvedValue(mockDraft as any);

      const verifyResult = await onboardingPaymentService.verifyPayment(
        mockDraft._id.toString(),
        'order_123',
        'pay_123',
        'sig_123',
        false,
      );

      expect(verifyResult.success).toBe(true);
      expect(verifyResult.draft.status).toBe('PAID');
    });
  });

  describe('Payment Record Generation for Store Entity', () => {
    it('should generate standard 1-year valid IOnboardingPaymentRecord with salesId attribution', () => {
      const mockDraft: any = {
        planId: 'standard',
        planName: 'Standard All-Inclusive Storefront & Retail OS',
        basePrice: 12000,
        discountAmount: 12000,
        finalAmount: 0,
        couponCode: 'FREE100',
        salesId: 'SALES-01',
        status: 'COUPON_WAIVED',
        isFree: true,
        verifiedAt: new Date(),
        razorpayOrderId: null,
        razorpayPaymentId: null,
      };

      const record = onboardingPaymentService.buildPaymentRecordFromDraft(mockDraft);

      expect(record.planId).toBe('standard');
      expect(record.paymentStatus).toBe('COUPON_WAIVED');
      expect(record.finalAmountPaid).toBe(0);
      expect(record.couponCode).toBe('FREE100');
      expect(record.salesId).toBe('SALES-01');
      expect(record.billingCycle).toBe('yearly');
      expect(record.expiresAt).toBeInstanceOf(Date);
    });
  });
});

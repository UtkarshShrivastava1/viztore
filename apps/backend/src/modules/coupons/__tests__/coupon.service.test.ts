import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { couponService } from '../coupon.service.js';
import { CouponModel } from '../coupon.model.js';

describe('CouponService Unit Tests (AUDIT-050)', () => {
  const storeId = new mongoose.Types.ObjectId().toString();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ensureSeedCoupons', () => {
    it('should seed default platform coupons when count is 0', async () => {
      vi.spyOn(CouponModel, 'countDocuments').mockResolvedValueOnce(0 as any);
      const insertSpy = vi.spyOn(CouponModel, 'insertMany').mockResolvedValueOnce([] as any);

      await couponService.ensureSeedCoupons();

      expect(insertSpy).toHaveBeenCalled();
    });

    it('should not seed if coupons already exist', async () => {
      vi.spyOn(CouponModel, 'countDocuments').mockResolvedValueOnce(5 as any);
      const insertSpy = vi.spyOn(CouponModel, 'insertMany');

      await couponService.ensureSeedCoupons();

      expect(insertSpy).not.toHaveBeenCalled();
    });
  });

  describe('validateCoupon', () => {
    it('should validate fixed discount coupon and calculate discount', async () => {
      vi.spyOn(CouponModel, 'countDocuments').mockResolvedValue(5 as any);
      vi.spyOn(CouponModel, 'findOne').mockReturnValueOnce({
        lean: vi.fn().mockResolvedValue({
          _id: new mongoose.Types.ObjectId(),
          code: 'SAVE100',
          title: 'Flat 100 Off',
          discountType: 'fixed',
          discountValue: 100,
          minOrderValue: 500,
          usedCount: 10,
          usageLimit: 1000,
          isActive: true,
        }),
      } as any);

      const result = await couponService.validateCoupon('save100', 1200);

      expect(result.valid).toBe(true);
      expect(result.discountAmount).toBe(100);
      expect(result.finalSubtotal).toBe(1100);
    });

    it('should validate percentage discount coupon and apply maxDiscount cap', async () => {
      vi.spyOn(CouponModel, 'countDocuments').mockResolvedValue(5 as any);
      vi.spyOn(CouponModel, 'findOne').mockReturnValueOnce({
        lean: vi.fn().mockResolvedValue({
          _id: new mongoose.Types.ObjectId(),
          code: 'EXTRA10',
          title: '10% Off',
          discountType: 'percentage',
          discountValue: 10,
          maxDiscount: 150,
          minOrderValue: 500,
          usedCount: 0,
          isActive: true,
        }),
      } as any);

      // 10% of 2000 is 200, but capped at 150
      const result = await couponService.validateCoupon('EXTRA10', 2000);

      expect(result.valid).toBe(true);
      expect(result.discountAmount).toBe(150);
      expect(result.finalSubtotal).toBe(1850);
    });

    it('should throw error when minOrderValue is not met', async () => {
      vi.spyOn(CouponModel, 'countDocuments').mockResolvedValue(5 as any);
      vi.spyOn(CouponModel, 'findOne').mockReturnValueOnce({
        lean: vi.fn().mockResolvedValue({
          _id: new mongoose.Types.ObjectId(),
          code: 'LOCAL200',
          discountType: 'fixed',
          discountValue: 200,
          minOrderValue: 1499,
          usedCount: 0,
          isActive: true,
        }),
      } as any);

      await expect(couponService.validateCoupon('LOCAL200', 800)).rejects.toThrow(
        /requires a minimum order value/i,
      );
    });

    it('should throw error when coupon code does not exist or is inactive', async () => {
      vi.spyOn(CouponModel, 'countDocuments').mockResolvedValue(5 as any);
      vi.spyOn(CouponModel, 'findOne').mockReturnValueOnce({
        lean: vi.fn().mockResolvedValue(null),
      } as any);

      await expect(couponService.validateCoupon('INVALIDCODE', 1000)).rejects.toThrow(
        /invalid or expired coupon/i,
      );
    });

    it('should throw error when usageLimit is exceeded', async () => {
      vi.spyOn(CouponModel, 'countDocuments').mockResolvedValue(5 as any);
      vi.spyOn(CouponModel, 'findOne').mockReturnValueOnce({
        lean: vi.fn().mockResolvedValue({
          _id: new mongoose.Types.ObjectId(),
          code: 'LIMITED50',
          discountType: 'fixed',
          discountValue: 50,
          minOrderValue: 200,
          usageLimit: 100,
          usedCount: 100,
          isActive: true,
        }),
      } as any);

      await expect(couponService.validateCoupon('LIMITED50', 500)).rejects.toThrow(
        /usage limit has been reached/i,
      );
    });
  });

  describe('createCoupon & incrementCouponUsage', () => {
    it('should create a new uppercase coupon', async () => {
      vi.spyOn(CouponModel, 'findOne').mockResolvedValueOnce(null);
      vi.spyOn(CouponModel, 'create').mockResolvedValueOnce({
        _id: new mongoose.Types.ObjectId(),
        code: 'SUMMER25',
        title: 'Summer 25% Off',
        discountType: 'percentage',
        discountValue: 25,
        minOrderValue: 1000,
        startDate: '01 Jun 2026',
        endDate: '30 Jun 2026',
        usedCount: 0,
        isActive: true,
      } as any);

      const created = await couponService.createCoupon(storeId, {
        code: 'summer25',
        title: 'Summer 25% Off',
        discountType: 'percentage',
        discountValue: 25,
        minOrderValue: 1000,
      });

      expect(created.code).toBe('SUMMER25');
      expect(created.discountValue).toBe(25);
    });

    it('should increment coupon usedCount', async () => {
      const updateSpy = vi.spyOn(CouponModel, 'updateOne').mockResolvedValueOnce({} as any);

      await couponService.incrementCouponUsage('LOCAL200');

      expect(updateSpy).toHaveBeenCalledWith(
        { code: 'LOCAL200' },
        { $inc: { usedCount: 1 } },
      );
    });
  });
});

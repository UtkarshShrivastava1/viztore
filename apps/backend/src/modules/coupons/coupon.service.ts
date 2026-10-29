import mongoose from 'mongoose';
import { CreateCouponDto, ICoupon } from '@repo/shared-types';
import { CouponModel } from './coupon.model.js';
import { AppError } from '../../shared/utils/AppError.js';

export const couponService = {
  /**
   * Seed default platform coupons if collection is empty
   */
  async ensureSeedCoupons(): Promise<void> {
    const count = await CouponModel.countDocuments();
    if (count > 0) return;

    const currentYear = new Date().getFullYear();
    const defaultCoupons = [
      {
        code: 'LOCAL200',
        title: 'Get flat ₹200 off on orders above ₹1499',
        description: 'Applicable across all local stores on platform',
        discountType: 'fixed',
        discountValue: 200,
        minOrderValue: 1499,
        startDate: `01 Jan ${currentYear}`,
        endDate: `31 Dec ${currentYear + 1}`,
        usageLimit: 10000,
        usedCount: 0,
        isActive: true,
        tag: 'Best Deal',
        applicableOn: 'All Products',
      },
      {
        code: 'SAVE100',
        title: 'Get flat ₹100 off on orders above ₹999',
        description: 'Instant discount on checkout',
        discountType: 'fixed',
        discountValue: 100,
        minOrderValue: 999,
        startDate: `01 Jan ${currentYear}`,
        endDate: `31 Dec ${currentYear + 1}`,
        usageLimit: 10000,
        usedCount: 0,
        isActive: true,
        tag: 'Popular',
        applicableOn: 'All Products',
      },
      {
        code: 'WELCOME50',
        title: 'Flat ₹50 off for new users on orders above ₹499',
        description: 'Welcome gift for first-time shoppers',
        discountType: 'fixed',
        discountValue: 50,
        minOrderValue: 499,
        startDate: `01 Jan ${currentYear}`,
        endDate: `31 Dec ${currentYear + 1}`,
        usageLimit: 50000,
        usedCount: 0,
        isActive: true,
        tag: 'New User',
        applicableOn: 'All Products',
      },
      {
        code: 'EXTRA5',
        title: 'Get extra 5% off on all orders above ₹499',
        description: 'Extra 5% savings on cart total',
        discountType: 'percentage',
        discountValue: 5,
        maxDiscount: 150,
        minOrderValue: 499,
        startDate: `01 Jan ${currentYear}`,
        endDate: `31 Dec ${currentYear + 1}`,
        usageLimit: 20000,
        usedCount: 0,
        isActive: true,
        tag: null,
        applicableOn: 'All Products',
      },
      {
        code: 'WEEKEND10',
        title: 'Extra 10% off on minimum order of ₹1999',
        description: 'Weekend shopping extravaganza discount',
        discountType: 'percentage',
        discountValue: 10,
        maxDiscount: 500,
        minOrderValue: 1999,
        startDate: `01 Jan ${currentYear}`,
        endDate: `31 Dec ${currentYear + 1}`,
        usageLimit: 10000,
        usedCount: 0,
        isActive: true,
        tag: null,
        applicableOn: 'All Products',
      },
    ];

    await CouponModel.insertMany(defaultCoupons);
  },

  /**
   * Fetch active, usable coupons for customer or store
   */
  async getActiveCoupons(storeId?: string): Promise<ICoupon[]> {
    await this.ensureSeedCoupons();

    const query: Record<string, any> = { isActive: true };
    if (storeId) {
      query.$or = [{ storeId: null }, { storeId: new mongoose.Types.ObjectId(storeId) }];
    } else {
      query.storeId = null;
    }

    const coupons = await CouponModel.find(query).sort({ discountValue: -1 }).lean();
    return coupons.map((c) => ({
      id: c._id.toString(),
      code: c.code,
      title: c.title,
      description: c.description,
      storeId: c.storeId?.toString() || null,
      discountType: c.discountType as any,
      discountValue: c.discountValue,
      minOrderValue: c.minOrderValue,
      maxDiscount: c.maxDiscount,
      startDate: c.startDate,
      endDate: c.endDate,
      usageLimit: c.usageLimit,
      usedCount: c.usedCount,
      isActive: c.isActive,
      applicableOn: c.applicableOn,
      tag: c.tag,
    }));
  },

  /**
   * Validate coupon code against cart and calculate exact discount
   */
  async validateCoupon(
    rawCode: string,
    subtotal: number,
    storeId?: string,
  ): Promise<{
    valid: boolean;
    coupon: ICoupon;
    discountAmount: number;
    finalSubtotal: number;
  }> {
    await this.ensureSeedCoupons();

    const code = rawCode.trim().toUpperCase();
    const query: Record<string, any> = { code, isActive: true };

    if (storeId) {
      query.$or = [{ storeId: null }, { storeId: new mongoose.Types.ObjectId(storeId) }];
    }

    const couponDoc = await CouponModel.findOne(query).lean();
    if (!couponDoc) {
      throw AppError.badRequest(`Invalid or expired coupon code "${code}"`, 'COUPON_NOT_FOUND');
    }

    // Check minimum order value
    if (subtotal < couponDoc.minOrderValue) {
      throw AppError.badRequest(
        `Coupon "${code}" requires a minimum order value of ₹${couponDoc.minOrderValue}. Current order is ₹${subtotal}.`,
        'MIN_ORDER_VALUE_NOT_MET',
      );
    }

    // Check usage limits
    if (couponDoc.usageLimit && couponDoc.usedCount >= couponDoc.usageLimit) {
      throw AppError.badRequest(`Coupon "${code}" usage limit has been reached`, 'COUPON_LIMIT_REACHED');
    }

    // Compute exact discount
    let discountAmount = 0;
    if (couponDoc.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * couponDoc.discountValue) / 100);
      if (couponDoc.maxDiscount && discountAmount > couponDoc.maxDiscount) {
        discountAmount = couponDoc.maxDiscount;
      }
    } else if (couponDoc.discountType === 'fixed') {
      discountAmount = Math.min(couponDoc.discountValue, subtotal);
    } else if (couponDoc.discountType === 'free_shipping') {
      discountAmount = 0; // Handled as shipping discount in checkout
    }

    const finalSubtotal = Math.max(0, subtotal - discountAmount);

    const coupon: ICoupon = {
      id: couponDoc._id.toString(),
      code: couponDoc.code,
      title: couponDoc.title,
      description: couponDoc.description,
      storeId: couponDoc.storeId?.toString() || null,
      discountType: couponDoc.discountType as any,
      discountValue: couponDoc.discountValue,
      minOrderValue: couponDoc.minOrderValue,
      maxDiscount: couponDoc.maxDiscount,
      startDate: couponDoc.startDate,
      endDate: couponDoc.endDate,
      usageLimit: couponDoc.usageLimit,
      usedCount: couponDoc.usedCount,
      isActive: couponDoc.isActive,
      applicableOn: couponDoc.applicableOn,
      tag: couponDoc.tag,
    };

    return {
      valid: true,
      coupon,
      discountAmount,
      finalSubtotal,
    };
  },

  /**
   * Create a new coupon (Store-scoped or platform-wide)
   */
  async createCoupon(storeId: string | null, dto: CreateCouponDto): Promise<ICoupon> {
    const code = dto.code.trim().toUpperCase();
    const existing = await CouponModel.findOne({ code });
    if (existing) {
      throw AppError.conflict(`Coupon code "${code}" already exists`, 'COUPON_ALREADY_EXISTS');
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const startDate = dto.startDate || now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const endDate = dto.endDate || `31 Dec ${currentYear + 1}`;

    const created = await CouponModel.create({
      code,
      title: dto.title,
      description: dto.description || '',
      storeId: storeId ? new mongoose.Types.ObjectId(storeId) : null,
      discountType: dto.discountType,
      discountValue: dto.discountValue,
      minOrderValue: dto.minOrderValue,
      maxDiscount: dto.maxDiscount,
      startDate,
      endDate,
      usageLimit: dto.usageLimit,
      usedCount: 0,
      isActive: true,
      applicableOn: dto.applicableOn || 'All Products',
      tag: dto.tag,
    });

    return {
      id: created._id.toString(),
      code: created.code,
      title: created.title,
      description: created.description,
      storeId: created.storeId?.toString() || null,
      discountType: created.discountType as any,
      discountValue: created.discountValue,
      minOrderValue: created.minOrderValue,
      maxDiscount: created.maxDiscount,
      startDate: created.startDate,
      endDate: created.endDate,
      usageLimit: created.usageLimit,
      usedCount: created.usedCount,
      isActive: created.isActive,
      applicableOn: created.applicableOn,
      tag: created.tag,
    };
  },

  /**
   * Increment usedCount upon confirmed order placement
   */
  async incrementCouponUsage(code: string): Promise<void> {
    await CouponModel.updateOne(
      { code: code.trim().toUpperCase() },
      { $inc: { usedCount: 1 } },
    );
  },

  /**
   * Delete coupon
   */
  async deleteCoupon(id: string, storeId?: string): Promise<{ success: boolean }> {
    const filter: Record<string, any> = { _id: id };
    if (storeId) {
      filter.storeId = new mongoose.Types.ObjectId(storeId);
    }
    const deleted = await CouponModel.findOneAndDelete(filter);
    if (!deleted) {
      throw AppError.notFound('Coupon not found');
    }
    return { success: true };
  },
};


import { z } from 'zod';

export type CouponDiscountType = 'percentage' | 'fixed' | 'free_shipping';

export interface ICoupon {
  id: string;
  code: string;
  title: string;
  description?: string;
  storeId?: string | null; // null for platform-wide coupons
  discountType: CouponDiscountType;
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  applicableOn?: string;
  tag?: string;
}

export const createCouponSchema = z.object({
  code: z
    .string()
    .min(3, 'Coupon code must be at least 3 characters')
    .max(20, 'Coupon code cannot exceed 20 characters')
    .regex(/^[A-Z0-9_-]+$/, 'Coupon code must contain only uppercase alphanumeric characters, dashes, or underscores'),
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  storeId: z.string().optional().nullable(),
  discountType: z.enum(['percentage', 'fixed', 'free_shipping']).default('percentage'),
  discountValue: z.number().positive('Discount value must be positive'),
  minOrderValue: z.number().min(0, 'Minimum order value cannot be negative').default(0),
  maxDiscount: z.number().positive('Max discount must be positive').optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  usageLimit: z.number().int().positive().optional(),
  applicableOn: z.string().optional().default('All Products'),
  tag: z.string().optional(),
});

export const validateCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
  subtotal: z.number().nonnegative('Subtotal must be non-negative'),
  storeId: z.string().optional(),
});

export type CreateCouponDto = z.infer<typeof createCouponSchema>;
export type ValidateCouponDto = z.infer<typeof validateCouponSchema>;

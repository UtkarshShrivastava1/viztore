import { api } from './client.js';
import type { ICoupon } from '@repo/shared-types';

export interface CouponValidationResult {
  valid: boolean;
  coupon: ICoupon;
  discountAmount: number;
  finalSubtotal: number;
}

export const couponsApi = {
  /**
   * Fetch active coupons for store or platform
   */
  getActiveCoupons: async (storeId?: string): Promise<ICoupon[]> => {
    const qs = storeId ? `?storeId=${encodeURIComponent(storeId)}` : '';
    const res = await api.get<ICoupon[]>(`/coupons${qs}`);
    return res.data;
  },

  /**
   * Validate coupon against order subtotal and store
   */
  validateCoupon: async (code: string, subtotal: number, storeId?: string): Promise<CouponValidationResult> => {
    const res = await api.post<CouponValidationResult>('/coupons/validate', {
      code,
      subtotal,
      storeId,
    });
    return res.data;
  },
};

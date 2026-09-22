import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FulfillmentType = 'deliver' | 'pickup' | 'reserve';
export type PaymentMethodType = 'upi' | 'card' | 'netbanking' | 'cod';

export interface CheckoutState {
  fulfillmentType: FulfillmentType;
  setFulfillmentType: (type: FulfillmentType) => void;
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string) => void;
  paymentMethod: PaymentMethodType;
  setPaymentMethod: (method: PaymentMethodType) => void;
  reserveDateTime: string | null;
  setReserveDateTime: (dt: string | null) => void;
  couponCode: string | null;
  discountAmount: number;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  isPlacingOrder: boolean;
  setIsPlacingOrder: (loading: boolean) => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      fulfillmentType: 'deliver',
      setFulfillmentType: (type) => set({ fulfillmentType: type }),
      selectedAddressId: null,
      setSelectedAddressId: (id) => set({ selectedAddressId: id }),
      paymentMethod: 'upi',
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      reserveDateTime: null,
      setReserveDateTime: (dt) => set({ reserveDateTime: dt }),
      couponCode: null,
      discountAmount: 0,
      applyCoupon: (code) => set({ couponCode: code, discountAmount: 100 }), // Mock discount for now
      removeCoupon: () => set({ couponCode: null, discountAmount: 0 }),
      isPlacingOrder: false,
      setIsPlacingOrder: (loading) => set({ isPlacingOrder: loading }),
    }),
    {
      name: 'platform-checkout-storage',
      partialize: (state) => ({
        fulfillmentType: state.fulfillmentType,
        selectedAddressId: state.selectedAddressId,
        paymentMethod: state.paymentMethod,
        reserveDateTime: state.reserveDateTime,
      }),
    }
  )
);

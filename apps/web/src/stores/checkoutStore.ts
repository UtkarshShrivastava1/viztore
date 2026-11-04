import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FulfillmentType = 'deliver' | 'pickup' | 'reserve';
export type PaymentMethodType = 'upi' | 'card' | 'netbanking' | 'cod';
export type PlacementStage = 'idle' | 'submitting' | 'confirmed' | 'error';

export interface ConfirmedOrderData {
  id: string;
  number: string;
  storeName?: string;
  grandTotal?: number;
  itemCount?: number;
}

export interface ShippingAddressData {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  phone: string;
}

export interface CheckoutState {
  fulfillmentType: FulfillmentType;
  setFulfillmentType: (type: FulfillmentType) => void;
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string) => void;
  shippingAddress: ShippingAddressData | null;
  setShippingAddress: (addr: ShippingAddressData | null) => void;
  paymentMethod: PaymentMethodType;
  setPaymentMethod: (method: PaymentMethodType) => void;
  reserveDateTime: string | null;
  setReserveDateTime: (dt: string | null) => void;
  couponCode: string | null;
  discountAmount: number;
  applyCouponDiscount: (code: string, discount: number) => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  isPlacingOrder: boolean;
  setIsPlacingOrder: (loading: boolean) => void;
  placementStage: PlacementStage;
  setPlacementStage: (stage: PlacementStage) => void;
  confirmedOrder: ConfirmedOrderData | null;
  setConfirmedOrder: (order: ConfirmedOrderData | null) => void;
  resetPlacement: () => void;
  isAddressModalOpen: boolean;
  setIsAddressModalOpen: (open: boolean) => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      fulfillmentType: 'deliver',
      setFulfillmentType: (type) => set({ fulfillmentType: type }),
      selectedAddressId: null,
      setSelectedAddressId: (id) => set({ selectedAddressId: id }),
      shippingAddress: null,
      setShippingAddress: (addr) => set({ shippingAddress: addr }),
      paymentMethod: 'upi',
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      reserveDateTime: null,
      setReserveDateTime: (dt) => set({ reserveDateTime: dt }),
      couponCode: null,
      discountAmount: 0,
      applyCouponDiscount: (code, discount) => set({ couponCode: code, discountAmount: discount }),
      applyCoupon: (code) => set({ couponCode: code, discountAmount: 100 }),
      removeCoupon: () => set({ couponCode: null, discountAmount: 0 }),
      isPlacingOrder: false,
      setIsPlacingOrder: (loading) => set({ isPlacingOrder: loading }),
      placementStage: 'idle',
      setPlacementStage: (stage) => set({ placementStage: stage }),
      confirmedOrder: null,
      setConfirmedOrder: (order) => set({ confirmedOrder: order }),
      resetPlacement: () => set({ placementStage: 'idle', confirmedOrder: null, isPlacingOrder: false }),
      isAddressModalOpen: false,
      setIsAddressModalOpen: (open) => set({ isAddressModalOpen: open }),
    }),
    {
      name: 'platform-checkout-storage',
      partialize: (state) => ({
        fulfillmentType: state.fulfillmentType,
        selectedAddressId: state.selectedAddressId,
        shippingAddress: state.shippingAddress,
        paymentMethod: state.paymentMethod,
        reserveDateTime: state.reserveDateTime,
        couponCode: state.couponCode,
        discountAmount: state.discountAmount,
      }),
    }
  )
);

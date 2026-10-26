import { create } from 'zustand';

export interface PdpState {
  selectedSize: string | null;
  selectedColor: string | null;
  activeImageIndex: number;
  deliveryPincode: string;
  isPincodeValid: boolean;
  deliveryEstimate: string | null;
  upvotedReviews: Record<string, boolean>;
  setSelectedSize: (size: string | null) => void;
  setSelectedColor: (color: string | null) => void;
  setActiveImageIndex: (index: number) => void;
  setDeliveryPincode: (pincode: string) => void;
  validatePincode: (pincode: string) => boolean;
  toggleReviewUpvote: (reviewId: string) => void;
  resetPdpState: () => void;
}

const PINCODE_REGEX = /^[1-9][0-9]{5}$/;

export const usePdpStore = create<PdpState>((set) => ({
  selectedSize: null,
  selectedColor: null,
  activeImageIndex: 0,
  deliveryPincode: '',
  isPincodeValid: false,
  deliveryEstimate: null,
  upvotedReviews: {},

  setSelectedSize: (size) => set({ selectedSize: size }),
  setSelectedColor: (color) => set({ selectedColor: color }),
  setActiveImageIndex: (index) => set({ activeImageIndex: index }),

  setDeliveryPincode: (pincode) => {
    const isValid = PINCODE_REGEX.test(pincode.trim());
    set({
      deliveryPincode: pincode,
      isPincodeValid: isValid,
      deliveryEstimate: isValid ? '⚡ Delivery by Tomorrow, 2:00 PM • FREE Delivery' : null,
    });
  },

  validatePincode: (pincode) => {
    const isValid = PINCODE_REGEX.test(pincode.trim());
    set({
      deliveryPincode: pincode,
      isPincodeValid: isValid,
      deliveryEstimate: isValid ? '⚡ Delivery by Tomorrow, 2:00 PM • FREE Delivery' : null,
    });
    return isValid;
  },

  toggleReviewUpvote: (reviewId) =>
    set((state) => ({
      upvotedReviews: {
        ...state.upvotedReviews,
        [reviewId]: !state.upvotedReviews[reviewId],
      },
    })),

  resetPdpState: () =>
    set({
      selectedSize: null,
      selectedColor: null,
      activeImageIndex: 0,
      deliveryPincode: '',
      isPincodeValid: false,
      deliveryEstimate: null,
      upvotedReviews: {},
    }),
}));

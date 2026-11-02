import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  OnboardingStep1Dto,
  OnboardingStep2Dto,
  OnboardingStep3Dto,
  OnboardingStep4Dto,
  OnboardingStep5Dto,
  OnboardingStep6Dto,
  StoreCategory,
} from '@repo/shared-types';

interface OnboardingDraft {
  step1?: Partial<OnboardingStep1Dto>;
  step2?: Partial<OnboardingStep2Dto>;
  step3?: Partial<OnboardingStep3Dto>;
  step4?: Partial<OnboardingStep4Dto>;
  step5?: Partial<OnboardingStep5Dto>;
  step6?: Partial<OnboardingStep6Dto>;
}

interface OnboardingStore {
  currentStep: number;
  draft: OnboardingDraft;
  isSubmitting: boolean;
  isUnderReview: boolean;
  storeId?: string;

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateDraft: <K extends keyof OnboardingDraft>(stepKey: K, data: OnboardingDraft[K]) => void;
  updateStep: (stepNumber: 1 | 2 | 3 | 4 | 5 | 6, data: any) => void;
  setUnderReview: (underReview: boolean, storeId?: string) => void;
  setIsUnderReview: (underReview: boolean, storeId?: string) => void;
  resetOnboarding: () => void;
}

const defaultStep5: OnboardingStep5Dto = {
  primaryCategory: StoreCategory.FASHION,
  operatingHours: {
    monday: { open: '09:00', close: '21:00', isOpen: true },
    tuesday: { open: '09:00', close: '21:00', isOpen: true },
    wednesday: { open: '09:00', close: '21:00', isOpen: true },
    thursday: { open: '09:00', close: '21:00', isOpen: true },
    friday: { open: '09:00', close: '21:00', isOpen: true },
    saturday: { open: '09:00', close: '21:00', isOpen: true },
    sunday: { open: '10:00', close: '20:00', isOpen: true },
  },
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      currentStep: 1,
      draft: {
        step5: defaultStep5,
        step4: {
          location: { type: 'Point', coordinates: [81.3780, 21.1920] },
          deliveryRadiusKm: 4,
        },
      },
      isSubmitting: false,
      isUnderReview: false,
      storeId: undefined,

      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: Math.min(6, state.currentStep + 1) })),
      prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),

      updateDraft: (stepKey, data) =>
        set((state) => ({
          draft: {
            ...state.draft,
            [stepKey]: {
              ...state.draft[stepKey],
              ...data,
            },
          },
        })),

      updateStep: (stepNumber, data) =>
        set((state) => {
          const key = `step${stepNumber}` as keyof OnboardingDraft;
          return {
            draft: {
              ...state.draft,
              [key]: {
                ...state.draft[key],
                ...data,
              },
            },
          };
        }),

      setUnderReview: (underReview, storeId) =>
        set({ isUnderReview: underReview, storeId }),

      setIsUnderReview: (underReview, storeId) =>
        set({ isUnderReview: underReview, storeId }),

      resetOnboarding: () =>
        set({
          currentStep: 1,
          draft: {
            step5: defaultStep5,
            step4: {
              location: { type: 'Point', coordinates: [81.3780, 21.1920] },
              deliveryRadiusKm: 4,
            },
          },
          isSubmitting: false,
          isUnderReview: false,
          storeId: undefined,
        }),
    }),
    {
      name: 'merchant_onboarding_draft',
      partialize: (state) => ({
        currentStep: state.currentStep,
        draft: state.draft,
        isUnderReview: state.isUnderReview,
        storeId: state.storeId,
      }),
    }
  )
);


import { z } from 'zod';
import { StoreCategory, geoPointSchema, storeAddressSchema, storeOperatingHoursSchema } from './store.types.js';
import { GSTIN_REGEX, PAN_REGEX, IFSC_REGEX } from './standardFields.js';
export { GSTIN_REGEX, PAN_REGEX, IFSC_REGEX };

/**
 * Step 1: Account & Credentials Setup
 */
export const onboardingStep1Schema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, 'Invalid 10-digit mobile number starting with 6-9'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

/**
 * Step 2: Legal & Identity Verification
 */
export const onboardingStep2Schema = z.object({
  gstin: z.string().regex(GSTIN_REGEX, 'Invalid GSTIN format (e.g. 29ABCDE1234F1Z5)'),
  pan: z.string().regex(PAN_REGEX, 'Invalid PAN format (e.g. ABCDE1234F)'),
  legalBusinessName: z.string().min(2, 'Legal business name is required').max(200),
});

/**
 * Step 3: Electronic Signature
 */
export const onboardingStep3Schema = z.object({
  signatureType: z.enum(['draw', 'generate']),
  signatureData: z.string().min(1, 'Signature data is required'), // Base64 data URL or generated SVG/text
  authorizedSignatoryName: z.string().min(2).max(100),
});

/**
 * Step 4: Store Setup & Geolocation
 */
export const onboardingStep4Schema = z.object({
  merchantFullName: z.string().min(2).max(100),
  storeDisplayName: z.string().min(2, 'Store name must be at least 2 characters').max(100),
  description: z.string().max(1000).optional(),
  address: storeAddressSchema,
  location: geoPointSchema,
  deliveryRadiusKm: z.number().min(0.5).max(15).default(4),
});

/**
 * Step 5: Business Operations Information
 */
export const onboardingStep5Schema = z.object({
  primaryCategory: z.nativeEnum(StoreCategory),
  operatingHours: storeOperatingHoursSchema,
});

/**
 * Step 6: Financial Details (Bank Account Mapping)
 */
export const onboardingStep6Schema = z.object({
  accountNumber: z.string().regex(/^\d{9,18}$/, 'Account number must be 9 to 18 digits'),
  confirmAccountNumber: z.string(),
  ifscCode: z.string().regex(IFSC_REGEX, 'Invalid IFSC format (e.g. HDFC0001234)'),
  accountHolderName: z.string().min(2).max(100),
  bankName: z.string().min(2).max(100),
}).refine((data) => data.accountNumber === data.confirmAccountNumber, {
  message: "Account numbers don't match",
  path: ['confirmAccountNumber'],
});

/**
 * Complete Full Onboarding Submission Schema
 */
export const completeOnboardingSchema = z.object({
  step1: onboardingStep1Schema.optional(), // If already registered user
  step2: onboardingStep2Schema,
  step3: onboardingStep3Schema,
  step4: onboardingStep4Schema,
  step5: onboardingStep5Schema,
  step6: onboardingStep6Schema,
  paymentDraftId: z.string().optional(),
});

export type OnboardingStep1Dto = z.infer<typeof onboardingStep1Schema>;
export type OnboardingStep2Dto = z.infer<typeof onboardingStep2Schema>;
export type OnboardingStep3Dto = z.infer<typeof onboardingStep3Schema>;
export type OnboardingStep4Dto = z.infer<typeof onboardingStep4Schema>;
export type OnboardingStep5Dto = z.infer<typeof onboardingStep5Schema>;
export type OnboardingStep6Dto = z.infer<typeof onboardingStep6Schema>;
export type CompleteOnboardingDto = z.infer<typeof completeOnboardingSchema>;

export interface MerchantOnboardingState {
  currentStep: number;
  isComplete: boolean;
  step1Data?: Partial<OnboardingStep1Dto>;
  step2Data?: Partial<OnboardingStep2Dto>;
  step3Data?: Partial<OnboardingStep3Dto>;
  step4Data?: Partial<OnboardingStep4Dto>;
  step5Data?: Partial<OnboardingStep5Dto>;
  step6Data?: Partial<OnboardingStep6Dto>;
  storeId?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected' | 'suspended';
}

import mongoose, { Document, Model, Schema } from 'mongoose';
import { OnboardingPlanId, OnboardingPaymentStatus } from '@repo/shared-types';

export interface IOnboardingPaymentDraftDocument extends Document {
  ownerId: mongoose.Types.ObjectId;
  planId: OnboardingPlanId;
  planName: string;
  basePrice: number;
  discountAmount: number;
  finalAmount: number;
  currency: 'INR';
  couponCode?: string | null;
  salesId?: string | null;
  status: OnboardingPaymentStatus;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  razorpaySignature?: string | null;
  isFree: boolean;
  metadata?: Record<string, any>;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const onboardingPaymentDraftSchema = new Schema<IOnboardingPaymentDraftDocument>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    planId: {
      type: String,
      enum: ['standard', 'starter', 'growth'],
      required: true,
      default: 'standard',
    },
    planName: {
      type: String,
      required: true,
      default: 'Standard All-Inclusive Storefront & Retail OS',
    },
    basePrice: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    couponCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
    },
    salesId: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'PAID', 'COUPON_WAIVED', 'FAILED'],
      default: 'PENDING',
      index: true,
    },
    razorpayOrderId: {
      type: String,
      default: null,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    razorpaySignature: {
      type: String,
      default: null,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: () => ({}),
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// TTL index to automatically purge abandoned drafts after 7 days
onboardingPaymentDraftSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 7 * 24 * 60 * 60 },
);

export const OnboardingPaymentDraftModel: Model<IOnboardingPaymentDraftDocument> =
  mongoose.models.OnboardingPaymentDraft ||
  mongoose.model<IOnboardingPaymentDraftDocument>(
    'OnboardingPaymentDraft',
    onboardingPaymentDraftSchema,
  );

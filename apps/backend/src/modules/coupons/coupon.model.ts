import mongoose, { Document, Model, Schema } from 'mongoose';
import { ICoupon } from '@repo/shared-types';

export interface ICouponDocument extends Document, Omit<ICoupon, 'id'> {
  storeId?: mongoose.Types.ObjectId | null;
}

const couponSchema = new Schema<ICouponDocument>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    storeId: {
      type: Schema.Types.ObjectId as any,
      ref: 'Store',
      default: null,
      index: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed', 'free_shipping'],
      default: 'percentage',
      required: true,
    },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderValue: { type: Number, default: 0, min: 0 },
    maxDiscount: { type: Number, min: 0 },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    usageLimit: { type: Number, min: 1 },
    usedCount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
    applicableOn: { type: String, default: 'All Products' },
    tag: { type: String, trim: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = ret._id?.toString();
        delete ret.__v;
        return ret;
      },
    },
  },
);

couponSchema.index({ code: 1, isActive: 1 });
couponSchema.index({ storeId: 1, isActive: 1 });

export const CouponModel: Model<ICouponDocument> =
  (mongoose.models.Coupon as Model<ICouponDocument>) ||
  mongoose.model<ICouponDocument>('Coupon', couponSchema);

import mongoose, { Document, Schema } from 'mongoose';
import type { IReturn, ReturnStatus, ReturnType } from '@repo/shared-types';

export interface IReturnDoc extends Omit<IReturn, '_id' | 'id'>, Document {}

const ReturnItemSchema = new Schema(
  {
    productId: { type: String, required: false },
    name: { type: String, required: true },
    variant: { type: String, default: 'Standard' },
    sku: { type: String, default: 'SKU-001' },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    returnQuantity: { type: Number, required: true, min: 1, default: 1 },
    imageUrl: { type: String, default: '' },
  },
  { _id: false }
);

const ReturnCustomerSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
  },
  { _id: false }
);

const ReturnSchema = new Schema<IReturnDoc>(
  {
    returnNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    orderId: {
      type: String,
      required: true,
      index: true,
    },
    orderNumber: {
      type: String,
      required: true,
      index: true,
    },
    storeId: {
      type: String,
      required: true,
      index: true,
    },
    customerId: {
      type: String,
      required: false,
      index: true,
    },
    customer: {
      type: ReturnCustomerSchema,
      required: true,
    },
    product: {
      type: ReturnItemSchema,
      required: true,
    },
    items: {
      type: [ReturnItemSchema],
      default: [],
    },
    returnType: {
      type: String,
      enum: ['Return', 'Exchange', 'Refund Only'],
      default: 'Return',
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Refunded', 'Rejected', 'Exchange Initiated'],
      default: 'Pending',
      index: true,
    },
    returnDate: {
      type: String,
      required: true,
    },
    returnTime: {
      type: String,
      default: '',
    },
    refundMethod: {
      type: String,
      default: 'Original Payment',
    },
    refundAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    pickupDate: {
      type: String,
      default: '',
    },
    pickupTime: {
      type: String,
      default: '',
    },
    pickupAddress: {
      type: String,
      default: '',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    comments: {
      type: String,
      default: '',
    },
    internalNote: {
      type: String,
      default: '',
    },
    notifyCustomer: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

ReturnSchema.index({ storeId: 1, status: 1 });
ReturnSchema.index({ storeId: 1, createdAt: -1 });
ReturnSchema.index({ 'customer.phone': 1 });

export const ReturnModel =
  mongoose.models.Return || mongoose.model<IReturnDoc>('Return', ReturnSchema);


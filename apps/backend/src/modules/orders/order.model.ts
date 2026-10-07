import mongoose, { Schema } from 'mongoose';
import { OrderStatus, type OrderDocument } from './order.types.js';

const orderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    sku: { type: String },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    storeId: { type: String, required: true },
  },
  { _id: false },
);

const shippingAddressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: 'IN' },
    phone: { type: String, required: true },
  },
  { _id: false },
);

const statusHistorySchema = new Schema(
  {
    status: { type: String, required: true },
    changedBy: { type: String },
    reason: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

const orderSchema = new Schema<OrderDocument>(
  {
    userId: { type: String, required: true, index: true },
    storeId: { type: String, required: true, index: true },
    orderNumber: { type: String, required: true, unique: true, index: true },
    items: { type: [orderItemSchema], required: true },
    shippingAddress: { type: shippingAddressSchema, required: true },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
      index: true,
    },
    deliveryOtp: { type: String, required: true },
    deliveredAt: { type: Date },
    statusHistory: { type: [statusHistorySchema], default: [] },
    version: { type: Number, required: true, default: 1, min: 1, index: true },
  },
  { timestamps: true, versionKey: false },
);

// Compound indexes strictly following the ESR Rule (Equality, Sort, Range)
orderSchema.index({ storeId: 1, status: 1, createdAt: -1 });
orderSchema.index({ userId: 1, createdAt: -1 });

export const OrderModel =
  (mongoose.models.Order as mongoose.Model<OrderDocument>) ||
  mongoose.model<OrderDocument>('Order', orderSchema);

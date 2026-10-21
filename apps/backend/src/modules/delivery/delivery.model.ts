import mongoose, { Schema, Model } from 'mongoose';
import { DeliveryStatus, VehicleType, type IDeliveryDocument } from './delivery.types.js';

const pointSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
    addressText: {
      type: String,
      required: true,
      default: '',
    },
  },
  { _id: false },
);

const riderSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    vehicleType: {
      type: String,
      enum: Object.values(VehicleType),
      default: VehicleType.MOTORCYCLE,
    },
    vehicleNumber: { type: String },
  },
  { _id: false },
);

const timelineSchema = new Schema(
  {
    status: {
      type: String,
      enum: Object.values(DeliveryStatus),
      required: true,
    },
    timestamp: {
      type: String,
      required: true,
      default: () => new Date().toISOString(),
    },
    note: { type: String },
  },
  { _id: false },
);

const deliverySchema = new Schema<IDeliveryDocument>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    orderNumber: { type: String, required: true, index: true },
    storeId: { type: String, required: true, index: true },
    customerId: { type: String, required: true, index: true },
    rider: { type: riderSchema },
    pickupLocation: { type: pointSchema, required: true },
    dropoffLocation: { type: pointSchema, required: true },
    distanceKm: { type: Number, required: true, default: 0 },
    estimatedMinutes: { type: Number, required: true, default: 30 },
    status: {
      type: String,
      enum: Object.values(DeliveryStatus),
      default: DeliveryStatus.PENDING_ASSIGNMENT,
      index: true,
    },
    dispatchMessage: { type: String },
    timeline: { type: [timelineSchema], default: [] },
    estimatedPayout: { type: Number, default: 45 },
    broadcastedAt: { type: Date },
    claimedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = ret._id ? String(ret._id) : undefined;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// ── Compound Indexes Enforcing ESR Rule (Equality, Sort, Range) ────────
deliverySchema.index({ storeId: 1, status: 1, createdAt: -1 });
deliverySchema.index({ orderId: 1, status: 1 });
deliverySchema.index({ 'rider.id': 1, status: 1, createdAt: -1 });
deliverySchema.index({ status: 1, createdAt: -1 });
deliverySchema.index({ 'pickupLocation.coordinates': '2dsphere' });

export const DeliveryModel: Model<IDeliveryDocument> =
  (mongoose.models.Delivery as Model<IDeliveryDocument>) ||
  mongoose.model<IDeliveryDocument>('Delivery', deliverySchema);

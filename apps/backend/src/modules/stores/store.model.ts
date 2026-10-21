import mongoose, { Document, Model, Schema } from 'mongoose';
import {
  IStore,
  StoreCategory,
  StoreApprovalStatus,
  IGeoPoint,
  IStoreAddress,
  IStoreOperatingHours,
  IStoreLegalDetails,
  IStoreBankDetails,
  IStoreSection,
} from '@repo/shared-types';

export interface IStoreDocument extends Omit<IStore, '_id'>, Document {}

const geoPointSchema = new Schema<IGeoPoint>(
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
  },
  { _id: false },
);

const storeAddressSchema = new Schema<IStoreAddress>(
  {
    street: { type: String, required: true, trim: true },
    landmark: { type: String, trim: true },
    city: { type: String, required: true, trim: true, index: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true, index: true },
  },
  { _id: false },
);

const dayHoursSchema = new Schema(
  {
    open: { type: String, default: '09:00' },
    close: { type: String, default: '21:00' },
    isOpen: { type: Boolean, default: true },
  },
  { _id: false },
);

const operatingHoursSchema = new Schema<IStoreOperatingHours>(
  {
    monday: { type: dayHoursSchema, default: () => ({}) },
    tuesday: { type: dayHoursSchema, default: () => ({}) },
    wednesday: { type: dayHoursSchema, default: () => ({}) },
    thursday: { type: dayHoursSchema, default: () => ({}) },
    friday: { type: dayHoursSchema, default: () => ({}) },
    saturday: { type: dayHoursSchema, default: () => ({}) },
    sunday: { type: dayHoursSchema, default: () => ({}) },
  },
  { _id: false },
);

const legalDetailsSchema = new Schema<IStoreLegalDetails>(
  {
    gstin: { type: String, trim: true, uppercase: true },
    pan: { type: String, trim: true, uppercase: true },
    legalBusinessName: { type: String, trim: true },
    signatureUrl: { type: String },
    isGstVerified: { type: Boolean, default: false },
  },
  { _id: false },
);

const bankDetailsSchema = new Schema<IStoreBankDetails>(
  {
    accountNumber: { type: String, trim: true },
    ifscCode: { type: String, trim: true, uppercase: true },
    accountHolderName: { type: String, trim: true },
    bankName: { type: String, trim: true },
    isVerified: { type: Boolean, default: false },
  },
  { _id: false },
);

const storeSectionSchema = new Schema<IStoreSection>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    badge: {
      type: String,
      enum: ['Special', 'New', 'Popular', 'Category', 'Brand', 'Default'],
      default: 'Default',
    },
    type: {
      type: String,
      enum: ['Automatic', 'Manual'],
      default: 'Manual',
    },
    sectionType: {
      type: String,
      enum: ['product', 'category', 'banner', 'brand'],
      default: 'product',
    },
    productCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isAlwaysOn: { type: Boolean, default: false },
    displayOn: { type: String, default: 'Home' },
    priority: { type: Number, default: 1 },
    productIds: [{ type: String }],
    description: { type: String, trim: true },
  },
  { _id: false },
);

const storeSchema = new Schema<IStoreDocument>(
  {
    ownerId: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
      required: [true, 'Owner ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Store name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      enum: Object.values(StoreCategory),
      required: [true, 'Store category is required'],
      index: true,
    },
    logoUrl: { type: String },
    bannerUrl: { type: String },
    location: {
      type: geoPointSchema,
      required: true,
      index: '2dsphere', // Crucial: Native 2dsphere spatial index
    },
    address: {
      type: storeAddressSchema,
      required: true,
    },
    operatingHours: {
      type: operatingHoursSchema,
      default: () => ({}),
    },
    deliveryRadiusKm: {
      type: Number,
      default: 4, // 3-4km default radius
      min: 0.5,
      max: 15,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    approvalStatus: {
      type: String,
      enum: Object.values(StoreApprovalStatus),
      default: StoreApprovalStatus.PENDING,
      index: true,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    legalDetails: {
      type: legalDetailsSchema,
    },
    bankDetails: {
      type: bankDetailsSchema,
    },
    customTaxonomy: {
      categories: [{ type: String, trim: true }],
      subCategories: { type: Map, of: [String] },
      productTypes: { type: Map, of: [String] },
      brands: [{ type: String, trim: true }],
    },
    sections: [storeSectionSchema],
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Compound indexes for fast discovery queries
storeSchema.index({ approvalStatus: 1, isActive: 1, category: 1 });

export const StoreModel: Model<IStoreDocument> = mongoose.model<IStoreDocument>('Store', storeSchema);

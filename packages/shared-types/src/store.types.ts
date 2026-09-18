import { z } from 'zod';

export enum StoreCategory {
  FASHION = 'fashion',
  FOOTWEAR = 'footwear',
  JEWELLERY = 'jewellery',
  ELECTRONICS = 'electronics',
  HOME_LIVING = 'home_living',
  BEAUTY_CARE = 'beauty_care',
  GROCERY_STAPLES = 'grocery_staples',
  GIFTS = 'gifts',
  SPORTS_FITNESS = 'sports_fitness',
  TOYS_BABY = 'toys_baby',
  BOOKS_STATIONERY = 'books_stationery',
  OTHER = 'other',
}

export enum StoreApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

export interface IGeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface IStoreAddress {
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface IOperatingDayHours {
  open: string; // '09:00'
  close: string; // '21:00'
  isOpen: boolean;
}

export interface IStoreOperatingHours {
  monday: IOperatingDayHours;
  tuesday: IOperatingDayHours;
  wednesday: IOperatingDayHours;
  thursday: IOperatingDayHours;
  friday: IOperatingDayHours;
  saturday: IOperatingDayHours;
  sunday: IOperatingDayHours;
}

export interface IStoreLegalDetails {
  gstin?: string;
  pan?: string;
  legalBusinessName?: string;
  signatureUrl?: string;
  isGstVerified?: boolean;
}

export interface IStoreBankDetails {
  accountNumber?: string;
  ifscCode?: string;
  accountHolderName?: string;
  bankName?: string;
  isVerified?: boolean;
}

export interface IStore {
  _id: string;
  ownerId: string;
  name: string;
  slug: string;
  description?: string;
  category: StoreCategory;
  logoUrl?: string;
  bannerUrl?: string;
  location: IGeoPoint;
  address: IStoreAddress;
  operatingHours?: IStoreOperatingHours;
  deliveryRadiusKm: number;
  isActive: boolean;
  approvalStatus: StoreApprovalStatus;
  rating: number;
  reviewCount: number;
  legalDetails?: IStoreLegalDetails;
  bankDetails?: IStoreBankDetails;
  createdAt: string;
  updatedAt: string;
  distanceKm?: number; // Computed during proximity scans
}

// Zod Schemas for Validation
export const geoPointSchema = z.object({
  type: z.literal('Point').default('Point'),
  coordinates: z.tuple([
    z.number().min(-180).max(180), // Longitude
    z.number().min(-90).max(90),   // Latitude
  ]),
});

export const storeAddressSchema = z.object({
  street: z.string().min(3).max(250),
  landmark: z.string().max(100).optional(),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  pincode: z.string().regex(/^\d{6}$/, 'Must be a valid 6-digit PIN code'),
});

const dayHoursSchema = z.object({
  open: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  close: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  isOpen: z.boolean().default(true),
});

export const storeOperatingHoursSchema = z.object({
  monday: dayHoursSchema,
  tuesday: dayHoursSchema,
  wednesday: dayHoursSchema,
  thursday: dayHoursSchema,
  friday: dayHoursSchema,
  saturday: dayHoursSchema,
  sunday: dayHoursSchema,
});

export const createStoreSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters').max(100),
  description: z.string().max(1000).optional(),
  category: z.nativeEnum(StoreCategory),
  location: geoPointSchema,
  address: storeAddressSchema,
  operatingHours: storeOperatingHoursSchema.optional(),
  deliveryRadiusKm: z.number().min(0.5).max(15).default(4),
  logoUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
});

export const updateStoreSchema = createStoreSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const nearbyStoresQuerySchema = z.object({
  lng: z.coerce.number().min(-180).max(180),
  lat: z.coerce.number().min(-90).max(90),
  radiusKm: z.coerce.number().min(0.1).max(25).default(4),
  category: z.nativeEnum(StoreCategory).optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});

export const approveStoreSchema = z.object({
  status: z.enum([StoreApprovalStatus.APPROVED, StoreApprovalStatus.REJECTED, StoreApprovalStatus.SUSPENDED]),
  remarks: z.string().max(500).optional(),
});

export const rateStoreSchema = z.object({
  rating: z.number().int().min(1).max(5),
  orderId: z.string().min(1, 'Order ID is required'),
  feedback: z.string().max(500).optional(),
});

export type CreateStoreDto = z.infer<typeof createStoreSchema>;
export type UpdateStoreDto = z.infer<typeof updateStoreSchema>;
export type NearbyStoresQueryDto = z.infer<typeof nearbyStoresQuerySchema>;
export type ApproveStoreDto = z.infer<typeof approveStoreSchema>;
export type RateStoreDto = z.infer<typeof rateStoreSchema>;


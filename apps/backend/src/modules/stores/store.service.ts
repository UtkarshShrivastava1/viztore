import mongoose from 'mongoose';
import {
  CreateStoreDto,
  UpdateStoreDto,
  NearbyStoresQueryDto,
  StoreApprovalStatus,
  IStore,
  StoreCategory,
  RateStoreDto,
} from '@repo/shared-types';
import { StoreModel } from './store.model.js';
import { StoreRatingModel } from './store-rating.model.js';
import { AppError } from '../../shared/utils/AppError.js';

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${randomSuffix}`;
}

/**
 * Create a new Store linked to a Merchant
 */
export async function createStore(ownerId: string, dto: CreateStoreDto): Promise<IStore> {
  const slug = generateSlug(dto.name);

  const store = new StoreModel({
    ...dto,
    ownerId,
    slug,
    approvalStatus: StoreApprovalStatus.APPROVED, // Auto-approved in development; admin workflow in Phase 2
    isActive: true,
  });

  await store.save();
  return store.toJSON() as unknown as IStore;
}

/**
 * Hyperlocal Store Discovery via Native 2dsphere $near Spatial Query
 */
export async function findNearbyStores(query: NearbyStoresQueryDto): Promise<IStore[]> {
  const { lng, lat, radiusKm = 4, category, search } = query;
  const maxDistanceInMeters = radiusKm * 1000;

  const filter: Record<string, unknown> = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        $maxDistance: maxDistanceInMeters,
      },
    },
    isActive: true,
    approvalStatus: StoreApprovalStatus.APPROVED,
  };

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  const stores = await StoreModel.find(filter)
    .limit(query.limit || 20)
    .lean();

  return stores as unknown as IStore[];
}

/**
 * Fetch Store by ID or Slug
 */
export async function getStoreById(storeId: string): Promise<IStore> {
  let store = null;
  if (mongoose.isValidObjectId(storeId)) {
    store = await StoreModel.findById(storeId);
  }
  if (!store) {
    store = await StoreModel.findOne({ slug: storeId });
  }
  if (!store) {
    throw AppError.notFound('Store not found', 'STORE_NOT_FOUND');
  }
  return store.toJSON() as unknown as IStore;
}

/**
 * Fetch Store by Slug
 */
export async function getStoreBySlug(slug: string): Promise<IStore> {
  const store = await StoreModel.findOne({ slug, isActive: true });
  if (!store) {
    throw AppError.notFound('Store not found', 'STORE_NOT_FOUND');
  }
  return store.toJSON() as unknown as IStore;
}

/**
 * Update Store (Merchant Owner only)
 */
export async function updateStore(
  storeId: string,
  ownerId: string,
  dto: UpdateStoreDto,
): Promise<IStore> {
  const store = await StoreModel.findById(storeId);
  if (!store) {
    throw AppError.notFound('Store not found', 'STORE_NOT_FOUND');
  }

  if (store.ownerId.toString() !== ownerId) {
    throw AppError.forbidden('You are not authorized to update this store', 'STORE_ACCESS_DENIED');
  }

  Object.assign(store, dto);
  await store.save();

  return store.toJSON() as unknown as IStore;
}

/**
 * Admin: Approve / Reject / Suspend Store
 */
export async function setStoreApprovalStatus(
  storeId: string,
  status: StoreApprovalStatus,
): Promise<IStore> {
  const store = await StoreModel.findByIdAndUpdate(
    storeId,
    { $set: { approvalStatus: status } },
    { new: true },
  );

  if (!store) {
    throw AppError.notFound('Store not found', 'STORE_NOT_FOUND');
  }

  return store.toJSON() as unknown as IStore;
}

/**
 * List Merchant's Owned Stores
 */
export async function getMerchantStores(ownerId: string): Promise<IStore[]> {
  const stores = await StoreModel.find({ ownerId }).lean();
  return stores as unknown as IStore[];
}

/**
 * Paginated Directory Listing with Filters
 */
export async function listAllStores(params: {
  page?: number;
  limit?: number;
  category?: StoreCategory;
  search?: string;
  city?: string;
}) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 20));
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {
    isActive: true,
    approvalStatus: StoreApprovalStatus.APPROVED,
  };

  if (params.category) filter.category = params.category;
  if (params.city) filter['address.city'] = new RegExp(params.city, 'i');
  if (params.search) filter.name = new RegExp(params.search, 'i');

  const [stores, total] = await Promise.all([
    StoreModel.find(filter).skip(skip).limit(limit).sort({ rating: -1, createdAt: -1 }).lean(),
    StoreModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    stores: stores as unknown as IStore[],
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

/**
 * Public Inter-Module Contract Functions
 */
export async function findStoreById(id: string): Promise<IStore | null> {
  const store = await StoreModel.findById(id).lean();
  return store as unknown as IStore | null;
}

export async function verifyStoreIsOpen(storeId: string): Promise<boolean> {
  const store = await StoreModel.findById(storeId);
  if (!store || !store.isActive || store.approvalStatus !== StoreApprovalStatus.APPROVED) {
    return false;
  }
  return true;
}

/**
 * Submit Store Rating & Feedback (1 to 5 stars)
 */
export async function rateStore(
  storeId: string,
  userId: string,
  dto: RateStoreDto,
): Promise<{ storeId: string; rating: number; reviewCount: number; message: string }> {
  const store = await StoreModel.findById(storeId);
  if (!store) {
    throw AppError.notFound('Store not found', 'STORE_NOT_FOUND');
  }

  // Prevent duplicate rating for the same order
  const existingRating = await StoreRatingModel.findOne({
    storeId,
    orderId: dto.orderId,
  });

  if (existingRating) {
    throw AppError.badRequest('This order has already been rated for this store', 'DUPLICATE_RATING');
  }

  // Record rating entry
  await StoreRatingModel.create({
    storeId,
    userId,
    orderId: dto.orderId,
    rating: dto.rating,
    feedback: dto.feedback,
  });

  // Rolling rating computation
  const currentReviews = store.reviewCount || 0;
  const currentRating = store.rating || 5.0;

  const newTotalReviews = currentReviews + 1;
  const newAverage =
    currentReviews === 0
      ? dto.rating
      : Math.round(((currentRating * currentReviews + dto.rating) / newTotalReviews) * 10) / 10;

  store.rating = newAverage;
  store.reviewCount = newTotalReviews;
  await store.save();

  return {
    storeId,
    rating: newAverage,
    reviewCount: newTotalReviews,
    message: 'Store rating submitted successfully',
  };
}

/**
 * Retrieve Store Rating Summary and Recent Reviews
 */
export async function getStoreRatings(storeId: string): Promise<{
  storeId: string;
  rating: number;
  reviewCount: number;
  recentRatings: Array<{ rating: number; feedback?: string; createdAt: Date }>;
}> {
  const store = await StoreModel.findById(storeId);
  if (!store) {
    throw AppError.notFound('Store not found', 'STORE_NOT_FOUND');
  }

  const recentRatings = await StoreRatingModel.find({ storeId })
    .sort({ createdAt: -1 })
    .limit(10)
    .select('rating feedback createdAt')
    .lean();

  return {
    storeId,
    rating: store.rating,
    reviewCount: store.reviewCount,
    recentRatings: recentRatings as unknown as Array<{ rating: number; feedback?: string; createdAt: Date }>,
  };
}


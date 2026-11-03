import type { Model } from 'mongoose';
import {
  CreateStoreDto,
  UpdateStoreDto,
  NearbyStoresQueryDto,
  StoreApprovalStatus,
  IStore,
  IStoreRepository,
  IStoreDocument,
} from './store.types.js';

import { cacheAside } from '../../shared/redis/cache.js';

export function createStoreRepository(
  storeModel: Model<IStoreDocument>,
): IStoreRepository {
  async function create(ownerId: string, dto: CreateStoreDto & { slug: string }): Promise<IStore> {
    const store = new storeModel({
      ...dto,
      ownerId,
      approvalStatus: StoreApprovalStatus.APPROVED,
      isActive: true,
    });
    await store.save();
    return (store.toJSON ? store.toJSON() : store) as unknown as IStore;
  }

  async function findById(id: string): Promise<IStore | null> {
    return cacheAside(`stores:id:${id}`, 180, async () => {
      const store = await storeModel.findById(id).read('secondaryPreferred');
      return store ? ((store.toJSON ? store.toJSON() : store) as unknown as IStore) : null;
    });
  }

  async function findBySlug(slug: string): Promise<IStore | null> {
    return cacheAside(`stores:slug:${slug}`, 180, async () => {
      const store = await storeModel.findOne({ slug, isActive: true }).read('secondaryPreferred');
      return store ? ((store.toJSON ? store.toJSON() : store) as unknown as IStore) : null;
    });
  }

  async function findByOwnerId(ownerId: string): Promise<IStore[]> {
    const stores = await storeModel.find({ ownerId }).read('secondaryPreferred').lean();
    return stores as unknown as IStore[];
  }


    async function findNearby(query: NearbyStoresQueryDto): Promise<IStore[]> {
    const { lng, lat, radiusKm = 50, category, search, city } = query;
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

    if (city) {
      const cleanCity = city.trim().toLowerCase();
      if (
        cleanCity.includes('bhilai') ||
        cleanCity.includes('durg') ||
        cleanCity.includes('supela') ||
        cleanCity.includes('power house')
      ) {
        filter['address.city'] = { $in: [/bhilai/i, /durg/i] };
      } else {
        filter['address.city'] = new RegExp(cleanCity, 'i');
      }
    }

    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const stores = await storeModel.find(filter).limit(query.limit || 50).lean();
    return stores as unknown as IStore[];
  }

async function update(id: string, dto: UpdateStoreDto): Promise<IStore | null> {
    const store = await storeModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true, runValidators: true },
    );
    return store ? ((store.toJSON ? store.toJSON() : store) as unknown as IStore) : null;
  }

  async function deleteStore(id: string): Promise<boolean> {
    const res = await storeModel.findByIdAndUpdate(id, { isActive: false });
    return !!res;
  }

  return {
    create,
    findById,
    findBySlug,
    findByOwnerId,
    findNearby,
    update,
    delete: deleteStore,
  };
}

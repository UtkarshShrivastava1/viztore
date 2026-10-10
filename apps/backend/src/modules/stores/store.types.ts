import {
  CreateStoreDto,
  UpdateStoreDto,
  NearbyStoresQueryDto,
  StoreApprovalStatus,
  IStore,
  StoreCategory,
} from '@repo/shared-types';
import type { IStoreDocument } from './store.model.js';

export { StoreApprovalStatus, StoreCategory };
export type { CreateStoreDto, UpdateStoreDto, NearbyStoresQueryDto, IStore, IStoreDocument };

export interface IStoreRepository {
  create(ownerId: string, dto: CreateStoreDto & { slug: string }): Promise<IStore>;
  findById(id: string): Promise<IStore | null>;
  findBySlug(slug: string): Promise<IStore | null>;
  findByOwnerId(ownerId: string): Promise<IStore[]>;
  findNearby(query: NearbyStoresQueryDto): Promise<IStore[]>;
  update(id: string, dto: UpdateStoreDto): Promise<IStore | null>;
  delete(id: string): Promise<boolean>;
}

export interface IStoreService {
  createStore(ownerId: string, dto: CreateStoreDto): Promise<IStore>;
  findNearbyStores(query: NearbyStoresQueryDto): Promise<IStore[]>;
  getStoreById(storeId: string): Promise<IStore>;
  getStoreBySlug(slug: string): Promise<IStore>;
  updateStore(storeId: string, ownerId: string, dto: UpdateStoreDto): Promise<IStore>;
}

export interface IStoreFacade {
  getStoreById(id: string): Promise<{
    id: string;
    name: string;
    isActive: boolean;
    ownerId: string;
    city: string;
  } | null>;
  isStoreActive(id: string): Promise<boolean>;
  verifyStoreExists(id: string): Promise<boolean>;
  getStoreProfile(id: string): Promise<{
    id: string;
    name: string;
    phone: string;
    address: string;
    gstin?: string;
  } | null>;
}

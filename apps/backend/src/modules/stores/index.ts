/**
 * STORES MODULE — Public Facade
 * ONLY file other modules and app.ts may import from stores/
 */
import { createStoreModule } from './store.module.js';
import * as storeService from './store.service.js';
import type { IStoreFacade } from './store.types.js';

const defaultStoreModule = createStoreModule();

export const storeRouter = defaultStoreModule.router;
export const storeRepository = defaultStoreModule.repository;

export const storeModule: IStoreFacade = {
  getStoreById: async (id: string) => {
    try {
      const store = await storeService.getStoreById(id);
      if (!store) return null;
      return {
        id: store._id,
        name: store.name,
        isActive: store.isActive,
        ownerId: store.ownerId,
        city: store.address?.city || '',
      };
    } catch {
      return null;
    }
  },
  isStoreActive: async (id: string) => {
    try {
      const store = await storeService.getStoreById(id);
      return store?.isActive ?? false;
    } catch {
      return false;
    }
  },
  verifyStoreExists: async (id: string) => {
    try {
      const store = await storeService.getStoreById(id);
      return !!store;
    } catch {
      return false;
    }
  },
  getStoreProfile: async (id: string) => {
    try {
      const store = await storeService.getStoreById(id);
      if (!store) return null;
      const street = store.address?.street || '';
      const city = store.address?.city || '';
      const state = store.address?.state || '';
      const pincode = store.address?.pincode || '';
      const addressParts = [street, city, state, pincode].filter(Boolean);
      return {
        id: store._id,
        name: store.name,
        phone: store.phone || '',
        address: addressParts.join(', '),
        gstin: store.legalDetails?.gstin,
      };
    } catch {
      return null;
    }
  },
};

export { createStoreModule, storeService };
export * from './store.types.js';
export * from './store.validator.js';
export { StoreModel } from './store.model.js';

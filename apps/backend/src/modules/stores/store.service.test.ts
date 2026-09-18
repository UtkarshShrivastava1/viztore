import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StoreCategory, StoreApprovalStatus } from '@repo/shared-types';
import * as storeService from './store.service.js';
import { StoreModel } from './store.model.js';

vi.mock('./store.model.js');
vi.mock('./store-rating.model.js');

describe('Store Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findNearbyStores', () => {
    it('should construct 2dsphere $near query with coordinates and max distance in meters', async () => {
      const mockStores = [
        {
          _id: 'store_1',
          name: 'City Supermarket',
          category: StoreCategory.GROCERY_STAPLES,
          location: { type: 'Point', coordinates: [77.5946, 12.9716] },
          isActive: true,
          approvalStatus: StoreApprovalStatus.APPROVED,
        },
      ];

      vi.spyOn(StoreModel, 'find').mockReturnValue({
        limit: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue(mockStores),
        }),
      } as any);

      const result = await storeService.findNearbyStores({
        lng: 77.5946,
        lat: 12.9716,
        radiusKm: 3,
      });

      expect(result).toEqual(mockStores);
      expect(StoreModel.find).toHaveBeenCalledWith({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [77.5946, 12.9716],
            },
            $maxDistance: 3000, // 3km in meters
          },
        },
        isActive: true,
        approvalStatus: StoreApprovalStatus.APPROVED,
      });
    });
  });

  describe('verifyStoreIsOpen', () => {
    it('should return true for active and approved store', async () => {
      vi.spyOn(StoreModel, 'findById').mockResolvedValue({
        isActive: true,
        approvalStatus: StoreApprovalStatus.APPROVED,
      } as any);

      const isOpen = await storeService.verifyStoreIsOpen('store_1');
      expect(isOpen).toBe(true);
    });

    it('should return false for inactive or unapproved store', async () => {
      vi.spyOn(StoreModel, 'findById').mockResolvedValue({
        isActive: false,
        approvalStatus: StoreApprovalStatus.PENDING,
      } as any);

      const isOpen = await storeService.verifyStoreIsOpen('store_1');
      expect(isOpen).toBe(false);
    });
  });

  describe('rateStore', () => {
    it('should calculate rolling average and update store review count', async () => {
      const { StoreRatingModel } = await import('./store-rating.model.js');

      const mockStore = {
        _id: 'store_1',
        rating: 4.0,
        reviewCount: 3,
        save: vi.fn().mockResolvedValue(true),
      };

      vi.spyOn(StoreModel, 'findById').mockResolvedValue(mockStore as any);
      vi.spyOn(StoreRatingModel, 'findOne').mockResolvedValue(null);
      vi.spyOn(StoreRatingModel, 'create').mockResolvedValue({} as any);

      const result = await storeService.rateStore('store_1', 'user_1', {
        orderId: 'order_1',
        rating: 5,
        feedback: 'Fast delivery!',
      });

      // Old: 4.0 * 3 = 12. New: (12 + 5) / 4 = 17 / 4 = 4.25 -> 4.3 rounded
      expect(result.rating).toBe(4.3);
      expect(result.reviewCount).toBe(4);
      expect(mockStore.save).toHaveBeenCalled();
    });

    it('should prevent duplicate rating for the same order', async () => {
      const { StoreRatingModel } = await import('./store-rating.model.js');

      vi.spyOn(StoreModel, 'findById').mockResolvedValue({ _id: 'store_1' } as any);
      vi.spyOn(StoreRatingModel, 'findOne').mockResolvedValue({ _id: 'existing_rating' } as any);

      await expect(
        storeService.rateStore('store_1', 'user_1', {
          orderId: 'order_1',
          rating: 5,
        }),
      ).rejects.toThrow('This order has already been rated for this store');
    });
  });
});

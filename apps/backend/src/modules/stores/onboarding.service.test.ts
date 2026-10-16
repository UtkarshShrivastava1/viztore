import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as onboardingService from './onboarding.service.js';
import { StoreModel } from './store.model.js';
import { UserModel } from '../auth/auth.model.js';
import { StoreApprovalStatus, StoreCategory } from '@repo/shared-types';

vi.mock('./store.model.js');
vi.mock('../auth/auth.model.js');

describe('Onboarding Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('verifyGstin', () => {
    it('should validate standard 15-char Indian GSTIN and parse state code & PAN', async () => {
      const validGstin = '27AAPFU0939F1ZV';
      const result = await onboardingService.verifyGstin(validGstin);

      expect(result.isValid).toBe(true);
      expect(result.gstin).toBe('27AAPFU0939F1ZV');
      expect(result.stateCode).toBe('27');
      expect(result.pan).toBe('AAPFU0939F');
    });

    it('should throw badRequest for invalid GSTIN format', async () => {
      await expect(onboardingService.verifyGstin('INVALID123')).rejects.toThrow(
        /Invalid GSTIN format/,
      );
    });
  });

  describe('getMerchantOnboardingStatus', () => {
    it('should return hasStore: false if merchant has no store record', async () => {
      vi.spyOn(StoreModel, 'findOne').mockReturnValue({
        lean: vi.fn().mockResolvedValue(null),
      } as any);

      const result = await onboardingService.getMerchantOnboardingStatus('user_123');
      expect(result.hasStore).toBe(false);
    });

    it('should return store and auto-approved status if store exists', async () => {
      const mockStore = {
        _id: 'store_123',
        name: 'Sharma Apparels',
        approvalStatus: StoreApprovalStatus.PENDING,
      };

      vi.spyOn(StoreModel, 'findOne').mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockStore),
      } as any);
      vi.spyOn(StoreModel, 'updateOne').mockResolvedValue({} as any);

      const result = await onboardingService.getMerchantOnboardingStatus('user_123');
      expect(result.hasStore).toBe(true);
      expect(result.approvalStatus).toBe(StoreApprovalStatus.APPROVED);
    });
  });
});

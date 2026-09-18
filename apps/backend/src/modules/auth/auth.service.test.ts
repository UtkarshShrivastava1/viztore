import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserRole } from '@repo/shared-types';
import * as authService from './auth.service.js';
import { UserModel } from './auth.model.js';

vi.mock('./auth.model.js');

describe('Auth Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateTokenPair', () => {
    it('should generate valid access and refresh tokens', () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        role: UserRole.CUSTOMER,
        email: 'customer@example.com',
        phone: '9876543210',
      };

      const tokens = authService.generateTokenPair(mockUser);
      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
      expect(typeof tokens.accessToken).toBe('string');
      expect(typeof tokens.refreshToken).toBe('string');
      expect(tokens.expiresIn).toBe(900);
    });
  });

  describe('findUserById', () => {
    it('should query UserModel by id and return user', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        fullName: 'Test User',
        email: 'test@example.com',
        role: UserRole.CUSTOMER,
      };

      vi.spyOn(UserModel, 'findById').mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockUser),
      } as any);

      const result = await authService.findUserById('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockUser);
      expect(UserModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should return null when user is not found', async () => {
      vi.spyOn(UserModel, 'findById').mockReturnValue({
        lean: vi.fn().mockResolvedValue(null),
      } as any);

      const result = await authService.findUserById('nonexistent_id');
      expect(result).toBeNull();
    });
  });

  describe('Address Management CRUD', () => {
    it('should retrieve addresses for a user', async () => {
      const mockAddresses = [
        {
          _id: 'addr-1',
          label: 'Home',
          recipientName: 'Test User',
          phone: '9876543210',
          street: '123 Main St',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          isDefault: true,
        },
      ];

      vi.spyOn(UserModel, 'findById').mockReturnValue({
        select: vi.fn().mockResolvedValue({ addresses: mockAddresses }),
      } as any);

      const result = await authService.getAddresses('user-1');
      expect(result).toHaveLength(1);
      expect(result[0].label).toBe('Home');
    });

    it('should add an address and set it as default if it is the first address', async () => {
      const mockUserDoc = {
        _id: 'user-1',
        addresses: [] as any[],
        save: vi.fn().mockResolvedValue(true),
        toJSON: vi.fn().mockReturnValue({ _id: 'user-1', addresses: [] }),
      };

      vi.spyOn(UserModel, 'findById').mockResolvedValue(mockUserDoc as any);

      const newAddr = {
        label: 'Work',
        recipientName: 'Test User',
        phone: '9876543210',
        street: '456 Tech Park',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
      };

      await authService.addAddress('user-1', newAddr as any);
      expect(mockUserDoc.addresses).toHaveLength(1);
      expect(mockUserDoc.addresses[0].isDefault).toBe(true);
      expect(mockUserDoc.save).toHaveBeenCalled();
    });

    it('should toggle default address when setDefaultAddress is called', async () => {
      const mockUserDoc = {
        _id: 'user-1',
        addresses: [
          { _id: 'addr-1', label: 'Home', isDefault: true },
          { _id: 'addr-2', label: 'Work', isDefault: false },
        ],
        save: vi.fn().mockResolvedValue(true),
        toJSON: vi.fn().mockReturnValue({ _id: 'user-1' }),
      };

      vi.spyOn(UserModel, 'findById').mockResolvedValue(mockUserDoc as any);

      await authService.setDefaultAddress('user-1', 'addr-2');
      expect(mockUserDoc.addresses[0].isDefault).toBe(false);
      expect(mockUserDoc.addresses[1].isDefault).toBe(true);
      expect(mockUserDoc.save).toHaveBeenCalled();
    });

    it('should promote the first remaining address to default when default address is deleted', async () => {
      const mockUserDoc = {
        _id: 'user-1',
        addresses: [
          { _id: 'addr-1', label: 'Home', isDefault: true },
          { _id: 'addr-2', label: 'Work', isDefault: false },
        ],
        save: vi.fn().mockResolvedValue(true),
        toJSON: vi.fn().mockReturnValue({ _id: 'user-1' }),
      };

      vi.spyOn(UserModel, 'findById').mockResolvedValue(mockUserDoc as any);

      await authService.deleteAddress('user-1', 'addr-1');
      expect(mockUserDoc.addresses).toHaveLength(1);
      expect(mockUserDoc.addresses[0]._id).toBe('addr-2');
      expect(mockUserDoc.addresses[0].isDefault).toBe(true);
      expect(mockUserDoc.save).toHaveBeenCalled();
    });
  });
});

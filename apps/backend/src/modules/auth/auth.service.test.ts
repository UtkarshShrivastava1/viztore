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
      expect(tokens.expiresIn).toBe(30 * 24 * 60 * 60);
    });
  });

  describe('registerUser & Role-Scoped Tenancy (AUDIT-004 & AUDIT-013)', () => {
    it('should register a customer successfully when no conflict in customer namespace', async () => {
      vi.spyOn(UserModel, 'findOne').mockResolvedValue(null);

      const mockSave = vi.fn().mockResolvedValue(true);
      const mockUserDoc = {
        _id: 'cust-123',
        fullName: 'Rahul Sharma',
        email: 'rahul@example.com',
        phone: '9876543210',
        role: UserRole.CUSTOMER,
        save: mockSave,
        toJSON: vi.fn().mockReturnValue({
          _id: 'cust-123',
          fullName: 'Rahul Sharma',
          email: 'rahul@example.com',
          phone: '9876543210',
          role: UserRole.CUSTOMER,
        }),
      };

      (UserModel as any).mockImplementation(function () {
        return mockUserDoc;
      });

      const result = await authService.registerUser({
        fullName: 'Rahul Sharma',
        email: 'rahul@example.com',
        phone: '9876543210',
        password: 'Password@123',
        role: UserRole.CUSTOMER,
      });

      expect(result.user.email).toBe('rahul@example.com');
      expect(result.user.role).toBe(UserRole.CUSTOMER);
      expect(result.tokens).toHaveProperty('accessToken');
      expect(UserModel.findOne).toHaveBeenCalledWith({
        email: 'rahul@example.com',
        role: UserRole.CUSTOMER,
      });
    });

    it('should allow merchant registration with the same email/phone as an existing customer (AUDIT-004)', async () => {
      // UserModel.findOne checks { email, role: 'merchant' } -> returns null (no merchant exists with this email)
      vi.spyOn(UserModel, 'findOne').mockResolvedValue(null);

      const mockSave = vi.fn().mockResolvedValue(true);
      const mockMerchantDoc = {
        _id: 'merch-456',
        fullName: 'Rahul Merchant',
        email: 'rahul@example.com',
        phone: '9876543210',
        role: UserRole.MERCHANT,
        save: mockSave,
        toJSON: vi.fn().mockReturnValue({
          _id: 'merch-456',
          fullName: 'Rahul Merchant',
          email: 'rahul@example.com',
          phone: '9876543210',
          role: UserRole.MERCHANT,
        }),
      };

      (UserModel as any).mockImplementation(function () {
        return mockMerchantDoc;
      });

      const result = await authService.registerUser({
        fullName: 'Rahul Merchant',
        email: 'rahul@example.com',
        phone: '9876543210',
        password: 'Password@123',
        role: UserRole.MERCHANT,
      });

      expect(result.user.role).toBe(UserRole.MERCHANT);
      expect(UserModel.findOne).toHaveBeenCalledWith({
        email: 'rahul@example.com',
        role: UserRole.MERCHANT,
      });
    });

    it('should reject registration if email is already registered under the SAME role (AUDIT-013)', async () => {
      vi.spyOn(UserModel, 'findOne').mockResolvedValueOnce({ _id: 'existing-cust' } as any);

      await expect(
        authService.registerUser({
          fullName: 'Duplicate User',
          email: 'rahul@example.com',
          phone: '9876543210',
          password: 'Password@123',
          role: UserRole.CUSTOMER,
        }),
      ).rejects.toThrow(/already exists for role: customer/);
    });

    it('should reject registration if mobile number is already registered under the SAME role (AUDIT-013)', async () => {
      vi.spyOn(UserModel, 'findOne')
        .mockResolvedValueOnce(null) // email check passes
        .mockResolvedValueOnce({ _id: 'existing-phone' } as any); // phone check fails

      await expect(
        authService.registerUser({
          fullName: 'Duplicate Phone',
          email: 'unique@example.com',
          phone: '9876543210',
          password: 'Password@123',
          role: UserRole.CUSTOMER,
        }),
      ).rejects.toThrow(/already exists for role: customer/);
    });
  });

  describe('loginUser & Role-Scoped Authentication (AUDIT-004)', () => {
    it('should authenticate user for specified role when credentials match', async () => {
      const mockUser = {
        _id: 'merch-1',
        fullName: 'Store Owner',
        email: 'owner@example.com',
        role: UserRole.MERCHANT,
        isActive: true,
        comparePassword: vi.fn().mockResolvedValue(true),
        save: vi.fn().mockResolvedValue(true),
        toJSON: vi.fn().mockReturnValue({ _id: 'merch-1', role: UserRole.MERCHANT }),
      };

      vi.spyOn(UserModel, 'findOne').mockReturnValue({
        select: vi.fn().mockResolvedValue(mockUser),
      } as any);

      const result = await authService.loginUser({
        identifier: 'owner@example.com',
        password: 'Password@123',
        role: UserRole.MERCHANT,
      });

      expect(result.user._id).toBe('merch-1');
      expect(mockUser.comparePassword).toHaveBeenCalledWith('Password@123');
    });

    it('should throw ROLE_MISMATCH if user exists under another role', async () => {
      vi.spyOn(UserModel, 'findOne')
        .mockReturnValueOnce({
          select: vi.fn().mockResolvedValue(null), // merchant lookup returns null
        } as any)
        .mockResolvedValueOnce({ _id: 'cust-1', role: UserRole.CUSTOMER } as any); // general lookup finds customer

      await expect(
        authService.loginUser({
          identifier: 'user@example.com',
          password: 'Password@123',
          role: UserRole.MERCHANT,
        }),
      ).rejects.toThrow(/No merchant account found/);
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

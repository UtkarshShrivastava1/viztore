import { api } from './client.js';
import type {
  IAddress,
  CreateAddressDto,
  UpdateAddressDto,
  UpdateProfileDto,
  IUserProfile,
} from '@repo/shared-types';

export const userApi = {
  /**
   * Fetch all saved addresses for current customer
   */
  getAddresses: async (): Promise<IAddress[]> => {
    const res = await api.get<IAddress[]>('/users/addresses');
    return res.data;
  },

  /**
   * Add a new shipping/delivery address
   */
  addAddress: async (dto: CreateAddressDto): Promise<IAddress[]> => {
    const res = await api.post<IAddress[]>('/users/addresses', dto);
    return res.data;
  },

  /**
   * Update an existing address by its subdocument ID
   */
  updateAddress: async (addressId: string, dto: UpdateAddressDto): Promise<IAddress[]> => {
    const res = await api.patch<IAddress[]>(`/users/addresses/${addressId}`, dto);
    return res.data;
  },

  /**
   * Designate an address as the default delivery destination
   */
  setDefaultAddress: async (addressId: string): Promise<IAddress[]> => {
    const res = await api.patch<IAddress[]>(`/users/addresses/${addressId}/default`);
    return res.data;
  },

  /**
   * Delete an address
   */
  deleteAddress: async (addressId: string): Promise<IAddress[]> => {
    const res = await api.delete<IAddress[]>(`/users/addresses/${addressId}`);
    return res.data;
  },

  /**
   * Fetch user profile metadata
   */
  getProfile: async (): Promise<IUserProfile> => {
    const res = await api.get<IUserProfile>('/users/me');
    return res.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (dto: UpdateProfileDto): Promise<IUserProfile> => {
    const res = await api.patch<IUserProfile>('/users/me', dto);
    return res.data;
  },
};

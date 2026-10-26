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
    const res = await api.get<IAddress[] | { addresses?: IAddress[] }>('/users/addresses');
    if (Array.isArray(res.data)) return res.data;
    if (res.data && 'addresses' in res.data && Array.isArray(res.data.addresses)) return res.data.addresses;
    return [];
  },

  /**
   * Add a new shipping/delivery address
   */
  addAddress: async (dto: CreateAddressDto): Promise<IAddress[]> => {
    const res = await api.post<IAddress[] | { addresses?: IAddress[] }>('/users/addresses', dto);
    if (Array.isArray(res.data)) return res.data;
    if (res.data && 'addresses' in res.data && Array.isArray(res.data.addresses)) return res.data.addresses;
    return [];
  },

  /**
   * Update an existing address by its subdocument ID
   */
  updateAddress: async (addressId: string, dto: UpdateAddressDto): Promise<IAddress[]> => {
    const res = await api.patch<IAddress[] | { addresses?: IAddress[] }>(`/users/addresses/${addressId}`, dto);
    if (Array.isArray(res.data)) return res.data;
    if (res.data && 'addresses' in res.data && Array.isArray(res.data.addresses)) return res.data.addresses;
    return [];
  },

  /**
   * Designate an address as the default delivery destination
   */
  setDefaultAddress: async (addressId: string): Promise<IAddress[]> => {
    const res = await api.patch<IAddress[] | { addresses?: IAddress[] }>(`/users/addresses/${addressId}/default`);
    if (Array.isArray(res.data)) return res.data;
    if (res.data && 'addresses' in res.data && Array.isArray(res.data.addresses)) return res.data.addresses;
    return [];
  },

  /**
   * Delete an address
   */
  deleteAddress: async (addressId: string): Promise<IAddress[]> => {
    const res = await api.delete<IAddress[] | { addresses?: IAddress[] }>(`/users/addresses/${addressId}`);
    if (Array.isArray(res.data)) return res.data;
    if (res.data && 'addresses' in res.data && Array.isArray(res.data.addresses)) return res.data.addresses;
    return [];
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

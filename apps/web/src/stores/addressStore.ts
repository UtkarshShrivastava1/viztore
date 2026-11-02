import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userApi } from '@/lib/api/user.js';
import { useAuthStore } from '@/stores/auth.store';
import { useLocationStore } from '@/stores/location.store';
import type { CreateAddressDto } from '@repo/shared-types';

export interface CustomerAddress {
  id: string;
  _id?: string;
  type: string;
  label: string;
  name: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  lines: string[];
  country: string;
  phone: string;
  isDefault: boolean;
  coordinates?: [number, number]; // [lng, lat]
}

interface AddressState {
  addresses: CustomerAddress[];
  activeAddressId: string | null;
  isLoading: boolean;
  error: string | null;

  fetchAddresses: () => Promise<CustomerAddress[]>;
  addAddress: (dto: {
    label: string;
    street: string;
    city: string;
    state?: string;
    pincode: string;
    landmark?: string;
    recipientName?: string;
    phone?: string;
    isDefault?: boolean;
    coordinates?: [number, number];
  }) => Promise<boolean>;
  deleteAddress: (id: string) => Promise<boolean>;
  setDefaultAddress: (id: string) => Promise<boolean>;
  selectDeliveryAddress: (address: CustomerAddress) => void;
}

export const mapBackendToCustomerAddress = (addr: any, index = 0): CustomerAddress => {
  const street = addr.street || addr.addressLine1 || '';
  const landmark = addr.landmark || '';
  const city = addr.city || 'Bhilai';
  const state = addr.state || 'Chhattisgarh';
  const pincode = addr.pincode || addr.zipCode || '490006';
  const recipientName = addr.recipientName || addr.name || 'Customer';
  const phone = addr.phone || '';

  return {
    id: addr._id || addr.id || `addr-${index}`,
    _id: addr._id || addr.id,
    type: (addr.label || 'home').toLowerCase(),
    label: addr.label || 'Home',
    name: recipientName,
    street,
    landmark,
    city,
    state,
    pincode,
    lines: [
      street,
      [landmark, city, state, pincode ? `- ${pincode}` : ''].filter(Boolean).join(', '),
    ].filter(Boolean),
    country: 'India',
    phone,
    isDefault: Boolean(addr.isDefault),
    coordinates: Array.isArray(addr.coordinates) ? addr.coordinates : [81.3800, 21.1938],
  };
};

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: [],
      activeAddressId: null,
      isLoading: false,
      error: null,

      fetchAddresses: async () => {
        const { isAuthenticated, user } = useAuthStore.getState();
        if (!isAuthenticated) {
          return get().addresses;
        }

        set({ isLoading: true, error: null });
        try {
          const raw = await userApi.getAddresses();
          if (Array.isArray(raw)) {
            const mapped = raw.map(mapBackendToCustomerAddress);
            set({ addresses: mapped, isLoading: false });

            // If user has addresses, sync default into activeAddressId
            const defaultAddr = mapped.find((a) => a.isDefault) || mapped[0];
            if (defaultAddr && !get().activeAddressId) {
              set({ activeAddressId: defaultAddr.id });
            }

            // Sync with useAuthStore
            if (user) {
              useAuthStore.getState().updateUser({
                addresses: raw as any,
              });
            }

            return mapped;
          }
        } catch (err: any) {
          set({ error: err?.message || 'Failed to fetch addresses', isLoading: false });
        }
        set({ isLoading: false });
        return get().addresses;
      },

      addAddress: async (dto) => {
        set({ isLoading: true, error: null });
        try {
          const user = useAuthStore.getState().user;
          const payload: CreateAddressDto = {
            label: (dto.label as any) || 'home',
            street: dto.street,
            city: dto.city,
            state: dto.state || 'Chhattisgarh',
            pincode: dto.pincode,
            landmark: dto.landmark || '',
            recipientName: dto.recipientName || (user as any)?.fullName || (user as any)?.name || 'Customer',
            phone: dto.phone || user?.phone || '9999999999',
            isDefault: dto.isDefault ?? false,
            coordinates: dto.coordinates,
          };
          const res = await userApi.addAddress(payload);
          if (res) {
            await get().fetchAddresses();
            return true;
          }
        } catch (err: any) {
          set({ error: err?.message || 'Failed to add address', isLoading: false });
        }
        set({ isLoading: false });
        return false;
      },

      deleteAddress: async (id: string) => {
        try {
          await userApi.deleteAddress(id);
          set((state) => ({
            addresses: state.addresses.filter((a) => a.id !== id && a._id !== id),
            activeAddressId: state.activeAddressId === id ? null : state.activeAddressId,
          }));
          return true;
        } catch (err: any) {
          set({ error: err?.message || 'Failed to delete address' });
          return false;
        }
      },

      setDefaultAddress: async (id: string) => {
        try {
          await userApi.setDefaultAddress(id);
          set((state) => ({
            addresses: state.addresses.map((a) => ({
              ...a,
              isDefault: a.id === id || a._id === id,
            })),
            activeAddressId: id,
          }));
          return true;
        } catch (err: any) {
          set({ error: err?.message || 'Failed to set default address' });
          return false;
        }
      },

      selectDeliveryAddress: (address: CustomerAddress) => {
        set({ activeAddressId: address.id });
        const coords = address.coordinates || [81.3800, 21.1938];
        const full = `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`;
        useLocationStore.getState().setLocation(coords[0], coords[1], full, {
          locality: address.street.split(',')[0],
          city: address.city,
          pincode: address.pincode,
          formattedAddress: full,
        });
      },
    }),
    {
      name: 'platform_user_addresses',
      partialize: (state) => ({
        addresses: state.addresses,
        activeAddressId: state.activeAddressId,
      }),
    }
  )
);


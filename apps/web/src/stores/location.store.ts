import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocationState {
  lng: number;
  lat: number;
  address: string;
  isSet: boolean;
  setLocation: (lng: number, lat: number, address: string) => void;
  clearLocation: () => void;
}

/**
 * Customer location store — persisted to localStorage.
 * Defaults to central Delhi coordinates if not set.
 */
export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      lng: 81.3800,
      lat: 21.1938,
      address: 'Bhilai, Chhattisgarh',
      isSet: false,
      setLocation: (lng, lat, address) =>
        set({ lng, lat, address, isSet: true }),
      clearLocation: () =>
        set({ lng: 81.3800, lat: 21.1938, address: 'Bhilai, Chhattisgarh', isSet: false }),
    }),
    {
      name: 'customer-location',
    },
  ),
);

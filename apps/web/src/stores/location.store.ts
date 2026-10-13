import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LocationDetails {
  locality?: string;
  city?: string;
  state?: string;
  pincode?: string;
  formattedAddress?: string;
}

interface LocationState {
  lng: number;
  lat: number;
  address: string;
  locality: string;
  city: string;
  pincode?: string;
  formattedAddress: string;
  isSet: boolean;
  setLocation: (
    lng: number,
    lat: number,
    address: string,
    details?: LocationDetails
  ) => void;
  clearLocation: () => void;
}

const DEFAULT_ADDRESS = 'Sector 6, Central Avenue, Near Civic Centre, Bhilai, Chhattisgarh - 490006';

/**
 * Customer location store — persisted to localStorage.
 * Defaults to primary launch hub in Bhilai, Chhattisgarh.
 */
export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      lng: 81.3800,
      lat: 21.1938,
      address: DEFAULT_ADDRESS,
      locality: 'Sector 6',
      city: 'Bhilai',
      pincode: '490006',
      formattedAddress: DEFAULT_ADDRESS,
      isSet: false,

      setLocation: (lng, lat, address, details) => {
        const parts = address.split(',').map((s) => s.trim());
        const detectedLocality = details?.locality || parts[0] || 'Local Area';
        const detectedCity = details?.city || parts[1] || 'Bhilai';
        const formatted = details?.formattedAddress || address;

        set({
          lng,
          lat,
          address: formatted,
          locality: detectedLocality,
          city: detectedCity,
          pincode: details?.pincode,
          formattedAddress: formatted,
          isSet: true,
        });
      },

      clearLocation: () =>
        set({
          lng: 81.3800,
          lat: 21.1938,
          address: DEFAULT_ADDRESS,
          locality: 'Sector 6',
          city: 'Bhilai',
          pincode: '490006',
          formattedAddress: DEFAULT_ADDRESS,
          isSet: false,
        }),
    }),
    {
      name: 'customer-location',
    },
  ),
);

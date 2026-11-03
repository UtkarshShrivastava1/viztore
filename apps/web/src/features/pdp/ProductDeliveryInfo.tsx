'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Truck, Box, Zap } from 'lucide-react';
import { useLocationStore } from '@/stores/location.store';
import { useAddressStore } from '@/stores/addressStore';
import { LocationModal } from '@/components/layout/LocationModal';

interface ProductDeliveryInfoProps {
  returnDays?: number;
}

export function ProductDeliveryInfo({ returnDays = 7 }: ProductDeliveryInfoProps) {
  const [mounted, setMounted] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const { addresses, activeAddressId } = useAddressStore();
  const { locality, city, pincode, formattedAddress } = useLocationStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeAddress = addresses.find((a) => a.id === activeAddressId) ||
    addresses.find((a) => a.isDefault) ||
    addresses[0];

  const displayAddress = mounted
    ? activeAddress
      ? `${activeAddress.street}${activeAddress.landmark ? `, ${activeAddress.landmark}` : ''}, ${activeAddress.city}, ${activeAddress.state} - ${activeAddress.pincode}`
      : formattedAddress || (locality ? `${locality}, ${city || 'Bhilai'}${pincode ? ` - ${pincode}` : ''}` : 'Supela, Bhilai, Chhattisgarh - 490023')
    : 'Detecting delivery location...';

  return (
    <div className="space-y-5 py-2">
      <h2 className="text-[15px] font-extrabold text-[#192168]">Delivery Details</h2>
      <div className="space-y-6">
        
        {/* Delivery Address Pin */}
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex-1 pr-4">
            <p className="text-[13px] font-extrabold text-[#192168] mb-0.5">Deliver to</p>
            <p className="text-[12px] font-medium text-surface-600 line-clamp-2">
              {displayAddress}
            </p>
          </div>
          <button 
            type="button"
            onClick={() => setIsLocationModalOpen(true)}
            className="text-xs font-bold text-[#1668F6] hover:underline"
          >
            Change
          </button>
        </div>
        
        {/* Hyperlocal Express Speed */}
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Zap className="w-4 h-4 text-[#1668F6] fill-[#1668F6]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-extrabold text-[#192168]">Express Hyperlocal Delivery</p>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-700">30–45 Mins</span>
            </div>
            <p className="text-[11px] font-medium text-surface-500 mt-0.5">Dispatched directly from neighborhood partner store</p>
            <p className="text-[11px] font-extrabold text-emerald-600 mt-1">Instant delivery available</p>
          </div>
          <span className="text-[13px] font-extrabold text-emerald-600 mt-0.5">FREE</span>
        </div>

        {/* Return & Warranty Policy */}
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-[#f4f5f9] flex items-center justify-center flex-shrink-0 mt-0.5">
            <Box className="w-4 h-4 text-[#1668F6]" />
          </div>
          <div className="flex-1 pr-4">
            <p className="text-[13px] font-extrabold text-[#192168] mb-0.5">Return & Exchange Policy</p>
            <p className="text-[11px] font-medium text-surface-600">{returnDays} Days hassle-free return or replacement</p>
          </div>
          <span className="text-xs font-bold text-surface-400">Verified</span>
        </div>

      </div>

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useLocationStore } from "@/stores/location.store";
import { LocationModal } from "./LocationModal";

interface LocationBarProps {
  name?: string;
  address?: string;
}

export default function LocationBar({
  name: propName,
  address: propAddress,
}: LocationBarProps) {
  const [mounted, setMounted] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const locationAddress = useLocationStore((state) => state.address);
  const locationLocality = useLocationStore((state) => state.locality);
  const locationFormatted = useLocationStore((state) => state.formattedAddress);
  const locationIsSet = useLocationStore((state) => state.isSet);
  const setStoreLocation = useLocationStore((state) => state.setLocation);

  useEffect(() => {
    setMounted(true);
    if (!locationIsSet && authUser?.addresses?.[0]) {
      const primary = authUser.addresses[0];
      const coords = primary.coordinates || [81.3800, 21.1938];
      setStoreLocation(coords[0], coords[1], `${primary.street}, ${primary.city}`);
    }
  }, [authUser, locationIsSet, setStoreLocation]);

  const address = mounted 
    ? (propAddress || (locationIsSet ? locationAddress : (authUser?.addresses?.[0] ? `${authUser.addresses[0].street}, ${authUser.addresses[0].city}` : locationAddress))) 
    : "Sector 6, Central Avenue, Bhilai - 490006";
  const locality = mounted ? (locationLocality || address.split(',')[0]) : "Sector 6";
  const displayFullAddress = mounted ? (locationFormatted || address) : "Sector 6, Central Avenue, Bhilai - 490006";

  return (
    <div className="px-4 mb-3.5">
      <button
        type="button"
        onClick={() => setIsLocationModalOpen(true)}
        className="w-full flex items-center gap-3 rounded-2xl bg-[#021d5c]/70 hover:bg-[#021d5c] transition-colors border border-white/10 px-4 py-2 text-left backdrop-blur-md shadow-sm cursor-pointer group"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1668F6]/20 border border-[#4C82FB]/30 text-[#4C82FB] shrink-0">
          <MapPin
            className="h-4 w-4"
            fill="#4C82FB"
            strokeWidth={0}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 leading-tight">
            <span className="text-[13px] font-bold text-white truncate">
              {locality}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-white/80 shrink-0 group-hover:translate-y-0.5 transition-transform" strokeWidth={2.5} />
          </div>
          <p className="text-[11px] text-white/70 truncate mt-0.5 leading-snug">
            {displayFullAddress}
          </p>
        </div>
      </button>

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
}

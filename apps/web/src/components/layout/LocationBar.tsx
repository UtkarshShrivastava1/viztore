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

  const name = mounted ? (propName || authUser?.fullName || "Customer") : "Customer";
  const address = mounted 
    ? (propAddress || (locationIsSet ? locationAddress : (authUser?.addresses?.[0] ? `${authUser.addresses[0].street}, ${authUser.addresses[0].city}` : locationAddress))) 
    : "Bhilai, Chhattisgarh";

  return (
    <div className="px-4 mb-3.5">
      <button
        type="button"
        onClick={() => setIsLocationModalOpen(true)}
        className="w-full flex items-center gap-2.5 rounded-full bg-[#021d5c]/60 hover:bg-[#021d5c]/80 transition-colors border border-white/10 px-4 py-2.5 text-left backdrop-blur-md shadow-sm cursor-pointer"
      >
        <MapPin
          className="h-4 w-4 shrink-0 text-[#4C82FB]"
          fill="#4C82FB"
          strokeWidth={0}
        />
        <span className="flex-1 truncate text-[12px] text-white">
          <span className="font-normal">Deliver to </span>
          <span className="font-medium">{name}</span>
          <span className="text-white/90"> - {address}</span>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-white" strokeWidth={2.2} />
      </button>

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
}

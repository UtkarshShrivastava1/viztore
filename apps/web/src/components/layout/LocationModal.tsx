'use client';

import React, { useState } from 'react';
import { MapPin, X, Navigation, Check, Search, Home, Briefcase } from 'lucide-react';
import { useLocationStore } from '@/stores/location.store';
import { useAuthStore } from '@/stores/auth.store';

import { reverseGeocode, forwardGeocode } from '@/lib/location/geocoding';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_HUBS = [
  { name: 'Bhilai', state: 'Chhattisgarh', lng: 81.3800, lat: 21.1938, isLaunch: true },
  { name: 'Durg', state: 'Chhattisgarh', lng: 81.2849, lat: 21.1904, isLaunch: true },
  { name: 'Raipur', state: 'Chhattisgarh', lng: 81.6296, lat: 21.2514, isLaunch: true },
  { name: 'Mumbai', state: 'Maharashtra', lng: 72.8777, lat: 19.0760 },
  { name: 'New Delhi', state: 'Delhi', lng: 77.2090, lat: 28.6139 },
  { name: 'Bengaluru', state: 'Karnataka', lng: 77.5946, lat: 12.9716 },
  { name: 'Hyderabad', state: 'Telangana', lng: 78.4867, lat: 17.3850 },
  { name: 'Indore', state: 'Madhya Pradesh', lng: 75.8577, lat: 22.7196 },
];

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const { setLocation, address: currentAddress, lng: currentLng, lat: currentLat } = useLocationStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [customInput, setCustomInput] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectHub = (hub: typeof POPULAR_HUBS[0]) => {
    setLocation(hub.lng, hub.lat, `${hub.name}, ${hub.state}`);
    onClose();
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetecting(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { longitude, latitude } = position.coords;
          const geocoded = await reverseGeocode(latitude, longitude);
          setLocation(longitude, latitude, geocoded.address);
          setIsDetecting(false);
          onClose();
        } catch {
          const { longitude, latitude } = position.coords;
          setLocation(longitude, latitude, `Current Location (${latitude.toFixed(3)}°N, ${longitude.toFixed(3)}°E)`);
          setIsDetecting(false);
          onClose();
        }
      },
      (error) => {
        setIsDetecting(false);
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMsg('Location permission was denied. Please select your city or area below.');
        } else {
          setErrorMsg('Unable to retrieve your location. Please enter your area or pincode below.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim() || isSearching) return;

    setIsSearching(true);
    setErrorMsg(null);

    try {
      const geocoded = await forwardGeocode(customInput.trim());
      if (geocoded) {
        setLocation(geocoded.lng, geocoded.lat, geocoded.address);
        setIsSearching(false);
        onClose();
      } else {
        setLocation(currentLng || 81.3800, currentLat || 21.1938, customInput.trim());
        setIsSearching(false);
        onClose();
      }
    } catch {
      setLocation(currentLng || 81.3800, currentLat || 21.1938, customInput.trim());
      setIsSearching(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-surface-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-surface-100 bg-surface-50/50">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-blue-50 text-[#1668F6]">
              <MapPin className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#192168]">Select Delivery Location</h2>
              <p className="text-xs text-surface-500">Pick your delivery zone to discover nearby stores</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-surface-400 hover:text-[#192168] hover:bg-surface-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* GPS Auto-Detect Button */}
          <div>
            <button
              type="button"
              onClick={handleDetectGPS}
              disabled={isDetecting}
              className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-[#1668F6]/20 bg-blue-50/50 hover:bg-blue-50 transition-colors group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1668F6] text-white group-hover:scale-105 transition-transform shadow-md shadow-blue-500/20">
                  <Navigation className={`w-5 h-5 ${isDetecting ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <span className="block text-sm font-bold text-[#192168]">
                    {isDetecting ? 'Locating your address...' : 'Use current location'}
                  </span>
                  <span className="block text-xs text-surface-500 mt-0.5">Using GPS for fastest local delivery</span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#1668F6] px-3 py-1 bg-white rounded-full border border-[#1668F6]/30">
                Detect
              </span>
            </button>
            {errorMsg && (
              <p className="text-xs font-medium text-rose-500 mt-2 px-1">{errorMsg}</p>
            )}
          </div>

          {/* Search/Custom Address Input */}
          <div>
            <form onSubmit={handleCustomSubmit} className="relative">
              <div className="flex items-center gap-2 rounded-2xl border-2 border-surface-200 px-4 py-3 focus-within:border-[#1668F6] transition-colors bg-surface-50/30">
                <Search className="w-5 h-5 text-surface-400 shrink-0" />
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter your area, street, or pincode..."
                  className="w-full bg-transparent text-sm text-[#192168] placeholder:text-surface-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!customInput.trim() || isSearching}
                  className="shrink-0 px-3.5 py-1.5 rounded-xl bg-[#1668F6] text-white text-xs font-bold disabled:opacity-40 hover:bg-blue-700 transition-colors"
                >
                  {isSearching ? 'Locating...' : 'Apply'}
                </button>
              </div>
            </form>
          </div>

          {/* Saved Addresses (if authenticated) */}
          {isAuthenticated && user?.addresses && user.addresses.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                Saved Addresses
              </h3>
              <div className="space-y-2">
                {user.addresses.map((addr) => {
                  const isCurrent = currentAddress.includes(addr.street);
                  return (
                    <button
                      key={addr._id || addr.street}
                      type="button"
                      onClick={() => {
                        const coords = addr.coordinates || [77.2090, 28.6139];
                        setLocation(coords[0], coords[1], `${addr.street}, ${addr.city}`);
                        onClose();
                      }}
                      className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                        isCurrent 
                          ? 'border-[#1668F6] bg-blue-50/30 ring-1 ring-[#1668F6]' 
                          : 'border-surface-200 hover:border-surface-300 bg-white'
                      }`}
                    >
                      <div className="mt-0.5 p-1.5 rounded-lg bg-surface-100 text-[#192168]">
                        {addr.label === 'Work' ? <Briefcase className="w-4 h-4" /> : <Home className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#192168]">{addr.label}</span>
                          {isCurrent && <Check className="w-4 h-4 text-[#1668F6]" strokeWidth={3} />}
                        </div>
                        <p className="text-xs text-surface-600 mt-0.5 line-clamp-1">{addr.street}, {addr.city}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Popular Cities */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider">
              Popular Cities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {POPULAR_HUBS.map((hub) => {
                const isSelected = currentAddress.toLowerCase().includes(hub.name.toLowerCase());
                return (
                  <button
                    key={hub.name}
                    type="button"
                    onClick={() => handleSelectHub(hub)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'border-[#1668F6] bg-[#1668F6] text-white shadow-sm'
                        : 'border-surface-200 hover:border-surface-300 text-[#192168] bg-white hover:bg-surface-50'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {hub.name}
                      {(hub as any).isLaunch && (
                        <span className={`text-[8px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        }`}>
                          Launch
                        </span>
                      )}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-surface-50 border-t border-surface-100 text-center">
          <p className="text-[11px] text-surface-500">
            Currently delivering in selected 3–4 km merchant radius zones.
          </p>
        </div>
      </div>
    </div>
  );
};

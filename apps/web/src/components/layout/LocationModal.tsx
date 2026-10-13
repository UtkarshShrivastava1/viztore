'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, X, Navigation, Check, Search, Home, Briefcase, 
  Building2, Sparkles, Compass, Loader2
} from 'lucide-react';
import { useLocationStore } from '@/stores/location.store';
import { useAuthStore } from '@/stores/auth.store';
import { 
  reverseGeocode, 
  searchLocalities, 
  KNOWN_HUBS, 
  type GeocodedLocation 
} from '@/lib/location/geocoding';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const { 
    setLocation, 
    locality: currentLocality,
    formattedAddress: currentFormatted,
    address: currentAddress 
  } = useLocationStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodedLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSearchInput('');
      setSearchResults([]);
      setErrorMsg(null);
      setIsDetecting(false);
      setIsSearching(false);
    }
  }, [isOpen]);

  // Live autocomplete search with 280ms debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const query = searchInput.trim();
    if (query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchLocalities(query);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  if (!isOpen) return null;

  const handleSelectLocation = async (loc: GeocodedLocation & { placeId?: string }) => {
    let resolvedLoc = { ...loc };

    // If result has a Google Place ID, resolve high-precision coordinates and address components
    if (loc.placeId && !loc.placeId.startsWith('hub_')) {
      try {
        const res = await fetch(`/api/location/place-details?placeId=${encodeURIComponent(loc.placeId)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            resolvedLoc = json.data;
          }
        }
      } catch (err) {
        console.warn('Place details resolution skipped, using fallback coordinates', err);
      }
    }

    setLocation(resolvedLoc.lng, resolvedLoc.lat, resolvedLoc.formattedAddress, {
      locality: resolvedLoc.locality,
      city: resolvedLoc.city,
      pincode: resolvedLoc.pincode,
      formattedAddress: resolvedLoc.formattedAddress,
    });
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
          handleSelectLocation(geocoded);
        } catch {
          const { longitude, latitude } = position.coords;
          const fallback = `Near ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E, Bhilai Region - 490006`;
          setLocation(longitude, latitude, fallback, {
            locality: 'Current Location',
            city: 'Bhilai',
            pincode: '490006',
            formattedAddress: fallback,
          });
          onClose();
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        setIsDetecting(false);
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMsg('Location access was denied. Please pick a locality from the list or search below.');
        } else {
          setErrorMsg('Could not detect GPS location. Please search your area or street below.');
        }
      },
      { timeout: 9000, enableHighAccuracy: true }
    );
  };

  const hubList = Object.values(KNOWN_HUBS);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-blue-50 text-[#1668F6]">
              <Compass className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#192168] leading-tight">Delivery Location</h2>
              <p className="text-xs text-slate-500">Fast hyperlocal delivery within 3–4 km merchant radius</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Map Pin-Drop Preview */}
          <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-surface-200 cursor-pointer group" onClick={handleDetectGPS}>
            <div className="absolute inset-0 bg-blue-50/50">
              <svg viewBox="0 0 700 220" preserveAspectRatio="xMidYMid slice" className="h-full w-full opacity-60">
                <path d="M-10 160 C 120 120, 220 190, 340 140 S 560 90, 710 130" stroke="#C7DCF7" strokeWidth="10" fill="none" />
                <g stroke="#FFFFFF" strokeWidth="2.2" opacity="0.85">
                  <path d="M0 20 L700 35" /><path d="M0 55 L700 45" /><path d="M40 0 L60 220" /><path d="M120 0 L100 220" />
                </g>
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                  <MapPin className="w-5 h-5 text-[#1668F6]" fill="#1668F6" fillOpacity={0.2} />
               </div>
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded-full shadow-sm">
               <span className="text-[10px] font-bold text-[#192168]">Click to pin drop</span>
            </div>
          </div>

          {/* GPS Auto-Detect Button */}
          <div>
            <button
              type="button"
              onClick={handleDetectGPS}
              disabled={isDetecting}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border-2 border-[#1668F6]/25 bg-blue-50/30 hover:bg-blue-50/70 transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1668F6] text-white group-hover:scale-105 transition-transform shadow-md shadow-blue-500/20">
                  {isDetecting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Navigation className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <span className="block text-sm font-bold text-[#192168]">
                    {isDetecting ? 'Locating exact coordinates...' : 'Use current location'}
                  </span>
                  <span className="block text-xs text-slate-500 mt-0.5">
                    {isDetecting ? 'Fetching street & sector details via GPS' : 'High-precision GPS location detection'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#1668F6] px-3 py-1 bg-white rounded-full border border-blue-200 shadow-xs">
                Detect
              </span>
            </button>
            {errorMsg && (
              <p className="text-xs font-medium text-rose-500 mt-2 px-1">{errorMsg}</p>
            )}
          </div>

          {/* Search/Autocomplete Box */}
          <div className="relative">
            <div className="flex items-center gap-2.5 rounded-2xl border-2 border-slate-200 px-4 py-3 focus-within:border-[#1668F6] transition-colors bg-slate-50/50">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search area, street, landmark, or sector..."
                className="w-full bg-transparent text-sm text-[#192168] placeholder:text-slate-400 focus:outline-none"
              />
              {isSearching && (
                <Loader2 className="w-4 h-4 animate-spin text-[#1668F6] shrink-0" />
              )}
              {searchInput && !isSearching && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Autocomplete Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="mt-2 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden divide-y divide-slate-100">
                <div className="bg-slate-50 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Search Results
                </div>
                {searchResults.map((result, idx) => (
                  <button
                    key={`${result.formattedAddress}-${idx}`}
                    type="button"
                    onClick={() => handleSelectLocation(result)}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-blue-50/60 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-[#1668F6] group-hover:bg-[#1668F6] group-hover:text-white transition-colors shrink-0 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#192168] truncate group-hover:text-[#1668F6] transition-colors">
                        {result.locality}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {result.formattedAddress}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Saved Addresses (if authenticated) */}
          {isAuthenticated && user?.addresses && user.addresses.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Saved Delivery Addresses
              </h3>
              <div className="space-y-2">
                {user.addresses.map((addr) => {
                  const isCurrent = currentFormatted.includes(addr.street) || currentAddress.includes(addr.street);
                  return (
                    <button
                      key={addr._id || addr.street}
                      type="button"
                      onClick={() => {
                        const coords = addr.coordinates || [81.3800, 21.1938];
                        const full = `${addr.street}, ${addr.city}, ${addr.state || 'Chhattisgarh'} - ${addr.pincode || '490006'}`;
                        setLocation(coords[0], coords[1], full, {
                          locality: addr.street.split(',')[0],
                          city: addr.city,
                          pincode: addr.pincode,
                          formattedAddress: full,
                        });
                        onClose();
                      }}
                      className={`w-full flex items-start gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isCurrent 
                          ? 'border-[#1668F6] bg-blue-50/30 ring-1 ring-[#1668F6]' 
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="mt-0.5 p-2 rounded-xl bg-slate-100 text-[#192168]">
                        {addr.label === 'Work' ? <Briefcase className="w-4 h-4" /> : <Home className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#192168]">{addr.label}</span>
                          {isCurrent && <Check className="w-4 h-4 text-[#1668F6]" strokeWidth={3} />}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                          {addr.street}, {addr.city} {addr.pincode ? `- ${addr.pincode}` : ''}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Popular Hyperlocal Delivery Hubs */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Popular Localities in Delivery Zone
              </h3>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Active Hubs
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {hubList.map((hub) => {
                const isSelected = currentFormatted.includes(hub.locality);
                return (
                  <button
                    key={`${hub.locality}-${hub.city}`}
                    type="button"
                    onClick={() => handleSelectLocation({
                      lng: hub.lng,
                      lat: hub.lat,
                      locality: hub.locality,
                      city: hub.city,
                      state: hub.state,
                      pincode: hub.pincode,
                      formattedAddress: hub.formattedAddress,
                      address: hub.formattedAddress,
                    })}
                    className={`flex items-start gap-2.5 p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#1668F6] bg-blue-50/60 ring-1 ring-[#1668F6]'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-blue-50 text-[#1668F6] shrink-0 mt-0.5">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[#192168] truncate">
                          {hub.locality}
                        </h4>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#1668F6] stroke-[3]" />}
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                        {hub.city} {hub.pincode ? `(${hub.pincode})` : ''}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info ribbon */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center shrink-0">
          <p className="text-[11px] text-slate-500">
            Delivering within 3–4 km radius from nearby verified retailers.
          </p>
        </div>
      </div>
    </div>
  );
};

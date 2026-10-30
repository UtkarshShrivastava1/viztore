import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Info, Search, Navigation, ArrowRight, ArrowLeft, ChevronDown, CheckCircle2, Loader2, MapPin } from 'lucide-react';
import { useOnboardingStore } from '../../stores/onboardingStore.js';
import { MapPicker } from './MapPicker.js';
import { reverseGeocode, searchLocations, GeocodedLocation, LocationSearchResult } from '../../lib/location/geocoding.js';

const CHHATTISGARH_CITIES = [
  'Bhilai',
  'Durg',
  'Raipur',
  'Bilaspur',
  'Rajnandgaon',
  'Korba',
  'Raigarh',
  'Jagdalpur',
  'Ambikapur',
  'Dhamtari',
  'Mahasamund',
  'Kanker',
  'Kawardha',
  'Champa',
  'Bhatapara',
  'Other',
];

const STATES_LIST = [
  'Chhattisgarh',
  'Madhya Pradesh',
  'Maharashtra',
  'Delhi',
  'Karnataka',
  'Uttar Pradesh',
  'Gujarat',
  'Rajasthan',
  'Odisha',
  'Other',
];

interface Step3StoreDetailsProps {
  onContinue: () => void;
  onBack?: () => void;
}

export const Step3StoreDetails: React.FC<Step3StoreDetailsProps> = ({
  onContinue,
  onBack,
}) => {
  const { draft, updateStep } = useOnboardingStore();

  const [fullName, setFullName] = useState(
    draft.step4?.merchantFullName || draft.step1?.fullName || '',
  );
  const [storeName, setStoreName] = useState(draft.step4?.storeDisplayName || '');
  const [storeDetails, setStoreDetails] = useState(draft.step4?.description || '');

  // Address Fields
  const [building, setBuilding] = useState(draft.step4?.address?.street?.split(',')?.[0]?.trim() || '');
  const [area, setArea] = useState(
    draft.step4?.address?.street?.includes(',')
      ? draft.step4?.address?.street?.split(',').slice(1).join(',').trim()
      : draft.step4?.address?.street || 'Akashganga, Supela Market',
  );
  const [landmark, setLandmark] = useState(draft.step4?.address?.landmark || 'Near GE Road');
  const [city, setCity] = useState(draft.step4?.address?.city || 'Bhilai');
  const [customCity, setCustomCity] = useState('');
  const [state, setState] = useState(draft.step4?.address?.state || 'Chhattisgarh');
  const [pincode, setPincode] = useState(draft.step4?.address?.pincode || '490023');

  // Coordinates [lng, lat] default to Bhilai / Durg commercial district [81.3780, 21.1920]
  const [coordinates, setCoordinates] = useState<[number, number]>(
    draft.step4?.location?.coordinates || [81.378, 21.192],
  );
  const [pickupSearch, setPickupSearch] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [geoNotification, setGeoNotification] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper to apply reverse geocoded details to form fields
  const applyResolvedLocation = useCallback((loc: GeocodedLocation, updateSearchText = true) => {
    if (loc.roadOrArea) {
      setArea(loc.roadOrArea);
    }
    if (loc.shopOrBuilding) {
      setBuilding(loc.shopOrBuilding);
    } else if (!building.trim()) {
      setBuilding('Shop 1, Ground Floor');
    }
    if (loc.landmark) {
      setLandmark(loc.landmark);
    }
    if (loc.city) {
      if (CHHATTISGARH_CITIES.includes(loc.city)) {
        setCity(loc.city);
        setCustomCity('');
      } else {
        setCity('Other');
        setCustomCity(loc.city);
      }
    }
    if (loc.state) {
      setState(loc.state);
    }
    if (loc.pincode) {
      setPincode(loc.pincode);
    }
    if (updateSearchText && loc.formattedAddress) {
      setPickupSearch(loc.formattedAddress);
    }

    setGeoNotification(`✓ Address auto-filled: ${loc.roadOrArea}, ${loc.city}${loc.pincode ? ' (' + loc.pincode + ')' : ''}`);
    setTimeout(() => {
      setGeoNotification(null);
    }, 4500);
  }, [building]);

  // Handle GPS "Use Current Location"
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      setError(null);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const newCoords: [number, number] = [lng, lat];
          setCoordinates(newCoords);
          setPickupSearch('Resolving detected location address...');
          setIsGeocoding(true);

          try {
            const resolved = await reverseGeocode(lat, lng);
            applyResolvedLocation(resolved, true);
          } catch {
            setPickupSearch(`GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          } finally {
            setIsGeocoding(false);
            setIsLocating(false);
          }
        },
        () => {
          setError('Could not access current location. Please allow GPS permission or click on the map to pin your store.');
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  // Handle Map Pin Drag / Click
  const handleMapPinChange = (newCoords: [number, number]) => {
    setCoordinates(newCoords);

    // Debounce reverse geocoding to avoid flooding API requests
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsGeocoding(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const lng = newCoords[0];
        const lat = newCoords[1];
        const resolved = await reverseGeocode(lat, lng);
        applyResolvedLocation(resolved, true);
      } catch {
        // Fallback silently if offline
      } finally {
        setIsGeocoding(false);
      }
    }, 350);
  };

  // Handle Search Input Change with Autocomplete
  const handleSearchChange = (value: string) => {
    setPickupSearch(value);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    if (!value.trim() || value.trim().length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    setIsSearching(true);
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const results = await searchLocations(value);
        setSearchResults(results);
        setShowSearchDropdown(results.length > 0);
      } catch {
        setSearchResults([]);
        setShowSearchDropdown(false);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  // Select Search Autocomplete Item
  const handleSelectSearchResult = (result: LocationSearchResult) => {
    const newCoords: [number, number] = [result.lng, result.lat];
    setCoordinates(newCoords);
    setShowSearchDropdown(false);

    applyResolvedLocation({
      lat: result.lat,
      lng: result.lng,
      roadOrArea: result.roadOrArea,
      city: result.city,
      state: result.state,
      pincode: result.pincode,
      formattedAddress: result.displayName,
    }, true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) {
      setError('Please enter a store display name');
      return;
    }
    if (!area.trim() || !pincode.trim()) {
      setError('Please complete the store address fields');
      return;
    }

    const finalCity = city === 'Other' ? customCity.trim() || 'Bhilai' : city;
    const finalState = state.trim() || 'Chhattisgarh';
    const finalBuilding = building.trim() || 'Shop 1, Ground Floor';

    updateStep(4, {
      merchantFullName: fullName,
      storeDisplayName: storeName,
      description: storeDetails,
      address: {
        street: area ? `${finalBuilding}, ${area}` : finalBuilding,
        landmark,
        city: finalCity,
        state: finalState,
        pincode,
      },
      location: {
        type: 'Point',
        coordinates,
      },
      deliveryRadiusKm: 4,
    });

    onContinue();
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 lg:p-9 shadow-xl shadow-slate-200/40 relative">
      {/* Header with Step 3 Badge */}
      <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0038ed] to-blue-500 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-blue-600/25 shrink-0">
            3
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-black tracking-wider text-[#0038ed] uppercase">
              Store Profile &amp; Location
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Physical store presence &amp; customer discovery</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200/60 font-medium">
          <Navigation className="w-3.5 h-3.5 text-blue-600" />
          <span>Hyperlocal 4 km Radius</span>
        </div>
      </div>

      <p className="text-xs text-slate-500 mb-5 leading-relaxed">
        Enter your store details and pin your retail shop location. Form fields will <strong>automatically populate</strong> when you use GPS or drop a pin on the map.
      </p>

      {error && (
        <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200/80 rounded-xl text-rose-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {geoNotification && (
        <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-emerald-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in transition-all">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{geoNotification}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name & Store Display Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Proprietor / Representative Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl px-3.5 py-3 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed] focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs font-medium"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-800">
                Enter Store Display Name *
              </label>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Enter your store display name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed]"
              required
            />
          </div>
        </div>

        {/* Store Details Textarea with 0/500 counter */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1.5">
            Enter Store Details *
          </label>
          <div className="relative">
            <textarea
              rows={3}
              maxLength={500}
              placeholder="Tell customers about your store, products, and services"
              value={storeDetails}
              onChange={(e) => setStoreDetails(e.target.value)}
              className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg p-3 pb-6 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed] resize-none"
            />
            <span className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-medium">
              {storeDetails.length}/500
            </span>
          </div>
        </div>

        {/* Store Address Section */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold text-slate-900">Store Address</h3>
            {isGeocoding && (
              <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1 animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" />
                Auto-filling address from map...
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            <div>
              <input
                type="text"
                placeholder="Shop No., Building Name, Floor *"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed]"
                required
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Road Name, Area, Colony *"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed]"
                required
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Nearby Landmark"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* City Dropdown */}
              <div className="relative">
                <select
                  value={CHHATTISGARH_CITIES.includes(city) ? city : 'Other'}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setCity(selected);
                    if (selected !== 'Other') {
                      setCustomCity('');
                    }
                  }}
                  className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg px-3.5 py-2.5 bg-white text-slate-900 focus:outline-none focus:border-[#0038ed] appearance-none cursor-pointer pr-9 font-medium"
                  required
                >
                  <option value="" disabled>Select City *</option>
                  {CHHATTISGARH_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {/* State Dropdown (Fixed / Preselected to Chhattisgarh) */}
              <div className="relative">
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg px-3.5 py-2.5 bg-white text-slate-900 focus:outline-none focus:border-[#0038ed] appearance-none cursor-pointer pr-9 font-medium"
                  required
                >
                  {STATES_LIST.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Custom City Input when 'Other' is chosen */}
            {(city === 'Other' || (!CHHATTISGARH_CITIES.includes(city) && city)) && (
              <div>
                <input
                  type="text"
                  placeholder="Enter your City / Town name *"
                  value={city === 'Other' ? customCity : city}
                  onChange={(e) => {
                    setCustomCity(e.target.value);
                    setCity('Other');
                  }}
                  className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed]"
                  required
                />
              </div>
            )}

            <div>
              <input
                type="text"
                maxLength={6}
                placeholder="Pin Code *"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed] font-mono"
                required
              />
            </div>
          </div>
        </div>

        {/* Pickup Address Section with Interactive MapPicker */}
        <div className="pt-1 space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-xs font-bold text-slate-900">
                Pickup Address &amp; Map Pin *
              </label>
              <span className="text-[11px] text-slate-500">
                Click map or drag the pin to pinpoint pickup spot. Address above auto-syncs.
              </span>
            </div>
            {isGeocoding && (
              <span className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Detecting address...
              </span>
            )}
          </div>

          <div ref={searchContainerRef} className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              {isSearching ? (
                <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin absolute left-3 top-3" />
              ) : (
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              )}
              <input
                type="text"
                placeholder="Search pickup area (e.g. Supela, Civic Centre, Durg)"
                value={pickupSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowSearchDropdown(true);
                }}
                className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg pl-9 pr-3 py-2 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed]"
              />

              {/* Autocomplete Suggestions Dropdown */}
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-[600] max-h-56 overflow-y-auto">
                  {searchResults.map((res, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSearchResult(res)}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-blue-50/70 border-b border-slate-100 last:border-0 flex items-start gap-2.5 transition-colors cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-800">{res.roadOrArea}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{res.displayName}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-xs text-slate-400 text-center font-medium">or</span>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating || isGeocoding}
              className="px-4 py-2 text-xs font-semibold text-[#0038ed] border border-[#0038ed] rounded-lg hover:bg-blue-50/60 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer disabled:opacity-60"
            >
              {isLocating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Detecting GPS...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Use Current Location</span>
                </>
              )}
            </button>
          </div>

          {/* Interactive Leaflet Map Picker */}
          <MapPicker
            coordinates={coordinates}
            onChange={handleMapPinChange}
            className="h-44 sm:h-48"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-32 py-3.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          <button
            type="submit"
            className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#0038ed] to-blue-600 hover:from-[#002fcf] hover:to-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <span>Proceed to Business Category</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

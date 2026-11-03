import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Info,
  Search,
  Navigation,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  CheckCircle2,
  Loader2,
  MapPin,
  Store,
  Check,
} from 'lucide-react';
import { useOnboardingStore } from '../../stores/onboardingStore.js';
import { MapPicker } from './MapPicker.js';
import {
  reverseGeocode,
  searchLocations,
  GeocodedLocation,
  LocationSearchResult,
} from '../../lib/location/geocoding.js';

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

  // Sub-tab Navigation: 'profile' (Store Identity) vs 'location' (Address & Interactive Map)
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'location'>('profile');

  // Store Profile Fields
  const [fullName, setFullName] = useState(
    draft.step4?.merchantFullName || draft.step1?.fullName || '',
  );
  const [storeName, setStoreName] = useState(draft.step4?.storeDisplayName || '');
  const [storeDetails, setStoreDetails] = useState(draft.step4?.description || '');

  // Address Fields
  const [building, setBuilding] = useState(
    draft.step4?.address?.street?.split(',')?.[0]?.trim() || '',
  );
  const [area, setArea] = useState(
    draft.step4?.address?.street?.includes(',')
      ? draft.step4?.address?.street?.split(',').slice(1).join(',').trim()
      : draft.step4?.address?.street || 'Akashganga, Supela Market',
  );
  const [landmark, setLandmark] = useState(
    draft.step4?.address?.landmark || 'Near GE Road',
  );
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
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper to apply reverse geocoded details to form fields
  const applyResolvedLocation = useCallback(
    (loc: GeocodedLocation, updateSearchText = true) => {
      if (loc.roadOrArea) {
        setArea(loc.roadOrArea);
      }
      if (loc.shopOrBuilding) {
        setBuilding(loc.shopOrBuilding);
      } else if (!building.trim()) {
        setBuilding('Shop 1, Ground Floor');
      }
      setLandmark(loc.landmark || (loc.roadOrArea ? `Near ${loc.roadOrArea}` : ''));
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

      setGeoNotification(
        `✓ Address auto-filled: ${loc.roadOrArea || ''}, ${loc.city || ''}${
          loc.pincode ? ' (' + loc.pincode + ')' : ''
        }`,
      );
      setTimeout(() => {
        setGeoNotification(null);
      }, 4500);
    },
    [building],
  );

  // Handle GPS "Use Current Location"
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      setError(null);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const newCoords: [number, number] = [
            pos.coords.longitude,
            pos.coords.latitude,
          ];
          setCoordinates(newCoords);
          setIsLocating(false);

          setIsGeocoding(true);
          try {
            const loc = await reverseGeocode(newCoords[1], newCoords[0]);
            applyResolvedLocation(loc);
          } catch {
            setGeoNotification('GPS location acquired! Coordinates updated.');
          } finally {
            setIsGeocoding(false);
          }
        },
        (_err) => {
          setIsLocating(false);
          setError(
            'Could not retrieve GPS location. Please drop a pin on the map or type your address.',
          );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  // Handle Map Pin Drag / Click
  const handleMapPinChange = (coords: [number, number]) => {
    setCoordinates(coords);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsGeocoding(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const loc = await reverseGeocode(coords[1], coords[0]);
        applyResolvedLocation(loc);
      } catch {
        setGeoNotification('Pin dropped! Coordinates updated.');
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

    applyResolvedLocation(
      {
        lat: result.lat,
        lng: result.lng,
        roadOrArea: result.roadOrArea,
        city: result.city,
        state: result.state,
        pincode: result.pincode,
        formattedAddress: result.displayName,
      },
      true,
    );
  };

  // Validation for Sub-Tab 1 (Store Profile)
  const validateProfileTab = (): boolean => {
    if (!fullName.trim() || fullName.trim().length < 2) {
      setError('Please enter your full proprietor or representative name.');
      return false;
    }
    if (!storeName.trim() || storeName.trim().length < 2) {
      setError('Please enter a valid store display name (at least 2 characters).');
      return false;
    }
    if (!storeDetails.trim() || storeDetails.trim().length < 5) {
      setError('Please provide a brief store description (at least 5 characters).');
      return false;
    }
    setError(null);
    return true;
  };

  const handleProceedToLocationTab = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (validateProfileTab()) {
      setActiveSubTab('location');
    }
  };

  // Submission for Sub-Tab 2 (Store Address & Interactive Map)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfileTab()) {
      setActiveSubTab('profile');
      return;
    }
    if (!area.trim() || !pincode.trim() || pincode.trim().length < 6) {
      setError('Please complete the store address fields and enter a valid 6-digit pin code.');
      return;
    }

    const finalCity = city === 'Other' ? customCity.trim() || 'Bhilai' : city;
    const finalState = state.trim() || 'Chhattisgarh';
    const finalBuilding = building.trim() || 'Shop 1, Ground Floor';

    updateStep(4, {
      merchantFullName: fullName.trim(),
      storeDisplayName: storeName.trim(),
      description: storeDetails.trim(),
      address: {
        street: area ? `${finalBuilding}, ${area}` : finalBuilding,
        landmark: landmark.trim(),
        city: finalCity,
        state: finalState,
        pincode: pincode.trim(),
      },
      location: {
        type: 'Point',
        coordinates,
      },
      deliveryRadiusKm: 4,
    });

    onContinue();
  };

  const isProfileComplete = Boolean(
    fullName.trim().length >= 2 &&
      storeName.trim().length >= 2 &&
      storeDetails.trim().length >= 5,
  );

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 lg:p-7 shadow-xl shadow-slate-200/40 relative lg:h-full flex flex-col justify-between overflow-hidden">
      {/* Header with Step 3 Badge & Sub-Tab Switcher */}
      <div className="pb-3 mb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0038ed] to-blue-500 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-blue-600/25 shrink-0">
              3
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black tracking-wider text-[#0038ed] uppercase">
                Store Profile &amp; Location
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Physical retail presence &amp; customer discovery
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200/60 font-medium">
            <Navigation className="w-3.5 h-3.5 text-blue-600" />
            <span>Hyperlocal 4 km Radius</span>
          </div>
        </div>

        {/* 2 Clean Sub-Tabs */}
        <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-xl max-w-md">
          <button
            type="button"
            onClick={() => setActiveSubTab('profile')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeSubTab === 'profile'
                ? 'bg-white text-[#0038ed] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                isProfileComplete
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-blue-100 text-[#0038ed]'
              }`}
            >
              {isProfileComplete ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '1'}
            </span>
            <span>Store Profile</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (validateProfileTab()) {
                setActiveSubTab('location');
              }
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeSubTab === 'location'
                ? 'bg-white text-[#0038ed] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">
              2
            </span>
            <span>Address &amp; Map Pin</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200/80 rounded-xl text-rose-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {geoNotification && (
        <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-emerald-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in transition-all shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{geoNotification}</span>
        </div>
      )}

      {/* SUB-TAB 1: STORE PROFILE */}
      {activeSubTab === 'profile' && (
        <form
          onSubmit={handleProceedToLocationTab}
          className="flex-1 flex flex-col justify-between overflow-hidden min-h-0"
        >
          <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 min-h-0 space-y-3.5 scrollbar-thin">
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter your public store details. This information helps nearby customers in your neighborhood identify your store.
            </p>

            {/* Proprietor & Store Name in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Proprietor / Representative Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setError(null);
                  }}
                  className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed] focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs font-medium"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Store Display Name <span className="text-rose-500">*</span>
                  </label>
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kirana &amp; Provisions"
                  value={storeName}
                  onChange={(e) => {
                    setStoreName(e.target.value);
                    setError(null);
                  }}
                  className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed] focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs font-medium"
                  required
                />
              </div>
            </div>

            {/* Store Description with 0/500 counter */}
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Store Description &amp; Specialities <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  rows={4}
                  maxLength={500}
                  placeholder="Tell nearby customers about your retail store, product categories, brands, and customer services..."
                  value={storeDetails}
                  onChange={(e) => {
                    setStoreDetails(e.target.value);
                    setError(null);
                  }}
                  className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl p-3 pb-6 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed] focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs resize-none font-medium leading-relaxed"
                  required
                />
                <span className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-medium">
                  {storeDetails.length}/500
                </span>
              </div>
            </div>

            {/* Tip Callout Box */}
            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center gap-2.5 text-xs text-slate-600">
              <Store className="w-4 h-4 text-[#0038ed] shrink-0" />
              <span>
                Your store name and description will be published to the customer shopping web and app catalog.
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="shrink-0 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 bg-white">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="w-32 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#0038ed] to-blue-600 hover:from-[#002fcf] hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <span>Next: Address &amp; Map Pin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 2: ADDRESS & INTERACTIVE MAP PIN */}
      {activeSubTab === 'location' && (
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col justify-between overflow-hidden min-h-0"
        >
          <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 min-h-0 space-y-3.5 scrollbar-thin">
            <p className="text-xs text-slate-500 leading-relaxed">
              Pin your physical shop location on the map. Address fields will <strong>automatically populate</strong> when you use GPS or drop a pin.
            </p>

            {/* 2-Column Desktop Split: Address Form (Left) & Map Picker (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* Left Column: Address Inputs */}
              <div className="lg:col-span-6 space-y-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Building / Flat / Shop Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shop 4, Ground Floor"
                    value={building}
                    onChange={(e) => {
                      setBuilding(e.target.value);
                      setError(null);
                    }}
                    className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed] focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Street / Colony / Area <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Main Market, Borsi Colony"
                    value={area}
                    onChange={(e) => {
                      setArea(e.target.value);
                      setError(null);
                    }}
                    className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed] focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Near Shiv Mandir / SBI ATM"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed] focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* City Dropdown */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      City <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          if (e.target.value !== 'Other') setCustomCity('');
                        }}
                        className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-[#0038ed] appearance-none cursor-pointer pr-8 font-medium"
                        required
                      >
                        {CHHATTISGARH_CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* State Dropdown */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      State <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-[#0038ed] appearance-none cursor-pointer pr-8 font-medium"
                        required
                      >
                        {STATES_LIST.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {city === 'Other' && (
                  <div>
                    <input
                      type="text"
                      placeholder="Enter City name *"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed]"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Pin Code (6 Digits) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 490023"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value.replace(/\D/g, ''));
                      setError(null);
                    }}
                    className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed] font-mono tracking-wider font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Right Column: Search + GPS + Interactive Map */}
              <div className="lg:col-span-6 space-y-2">
                {/* Search Bar + GPS */}
                <div className="flex items-center gap-2">
                  <div ref={searchContainerRef} className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search area or market..."
                      value={pickupSearch}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-xl pl-8 pr-3 py-2 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed]"
                    />
                    {isSearching && (
                      <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin absolute right-3 top-2.5" />
                    )}

                    {showSearchDropdown && searchResults.length > 0 && (
                      <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto divide-y divide-slate-100">
                        {searchResults.map((r, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleSelectSearchResult(r)}
                            className="p-2.5 hover:bg-blue-50 cursor-pointer text-xs text-slate-700 flex items-start gap-2 transition-colors"
                          >
                            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{r.displayName}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-[#0038ed] bg-blue-50 hover:bg-blue-100 border border-blue-200/60 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {isLocating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Locating...</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-3.5 h-3.5" />
                        <span>GPS</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Interactive Leaflet Map Picker */}
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xs">
                  <MapPicker
                    coordinates={coordinates}
                    onChange={handleMapPinChange}
                    className="h-52 sm:h-56"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block text-center font-medium">
                  Drag the pin or click on the map to pinpoint your exact shop door.
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="shrink-0 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 bg-white">
            <button
              type="button"
              onClick={() => setActiveSubTab('profile')}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store Profile</span>
            </button>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#0038ed] to-blue-600 hover:from-[#002fcf] hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <span>Proceed to Business Category</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

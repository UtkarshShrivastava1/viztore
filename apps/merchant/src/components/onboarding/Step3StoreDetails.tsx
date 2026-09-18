import React, { useState } from 'react';
import { Info, Search, Navigation, ArrowRight, ArrowLeft } from 'lucide-react';
import { useOnboardingStore } from '../../stores/onboardingStore.js';
import { MapPicker } from './MapPicker.js';

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
    draft.step4?.merchantFullName || draft.step1?.fullName || 'Thoufiq Ahmed',
  );
  const [storeName, setStoreName] = useState(draft.step4?.storeDisplayName || '');
  const [storeDetails, setStoreDetails] = useState(draft.step4?.description || '');

  // Address
  const [building, setBuilding] = useState(draft.step4?.address?.street || '');
  const [area, setArea] = useState('Commercial District');
  const [landmark, setLandmark] = useState(draft.step4?.address?.landmark || '');
  const [city, setCity] = useState(draft.step4?.address?.city || 'Bengaluru');
  const [state, setState] = useState(draft.step4?.address?.state || 'Karnataka');
  const [pincode, setPincode] = useState(draft.step4?.address?.pincode || '560001');

  // Coordinates [lng, lat]
  const [coordinates, setCoordinates] = useState<[number, number]>(
    draft.step4?.location?.coordinates || [77.5946, 12.9716],
  );
  const [pickupSearch, setPickupSearch] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoordinates([pos.coords.longitude, pos.coords.latitude]);
          setPickupSearch('Current GPS Location Detected');
          setIsLocating(false);
        },
        () => {
          setError('Could not access current location. You can click on the map to pin your store.');
          setIsLocating(false);
        },
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) {
      setError('Please enter a store display name');
      return;
    }
    if (!building.trim() || !pincode.trim()) {
      setError('Please complete the store address fields');
      return;
    }

    updateStep(4, {
      merchantFullName: fullName,
      storeDisplayName: storeName,
      description: storeDetails,
      address: {
        street: area ? `${building}, ${area}` : building,
        landmark,
        city,
        state,
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
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 lg:p-9 shadow-xs">
      {/* Header with Step 3 Badge */}
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-7 h-7 rounded-full bg-[#0038ed] text-white font-bold text-xs flex items-center justify-center shadow-2xs shrink-0">
          3
        </div>
        <h2 className="text-xs sm:text-[13px] font-bold tracking-wider text-[#0038ed] uppercase">
          CREATE YOUR STORE
        </h2>
      </div>

      <p className="text-xs text-slate-500 mb-5">
        Enter your store details to help customers discover your business.
      </p>

      {error && (
        <div className="mb-5 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name & Store Display Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Enter Your Full Name *
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed]"
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
          <h3 className="text-xs font-bold text-slate-900 mb-2.5">Store Address</h3>

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
              <input
                type="text"
                placeholder="Enter City *"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed]"
                required
              />
              <input
                type="text"
                placeholder="Enter State *"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed]"
                required
              />
            </div>

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
          <div>
            <label className="block text-xs font-bold text-slate-900">
              Pickup Address *
            </label>
            <span className="text-[11px] text-slate-500">
              Add pickup address where your orders will be picked up.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search your pickup area"
                value={pickupSearch}
                onChange={(e) => setPickupSearch(e.target.value)}
                className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg pl-9 pr-3 py-2 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed]"
              />
            </div>

            <span className="text-xs text-slate-400 text-center font-medium">or</span>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="px-4 py-2 text-xs font-semibold text-[#0038ed] border border-[#0038ed] rounded-lg hover:bg-blue-50/60 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer disabled:opacity-60"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{isLocating ? 'Locating...' : 'Use Current Location'}</span>
            </button>
          </div>

          {/* Interactive Leaflet Map Picker */}
          <MapPicker
            coordinates={coordinates}
            onChange={(newCoords) => setCoordinates(newCoords)}
            className="h-40 sm:h-44"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-3 flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-32 py-3 px-4 rounded-lg border border-[#0038ed] text-[#0038ed] font-semibold text-sm hover:bg-blue-50/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          <button
            type="submit"
            className="flex-1 py-3 px-6 rounded-lg bg-[#0038ed] hover:bg-[#002fcf] text-white font-semibold text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

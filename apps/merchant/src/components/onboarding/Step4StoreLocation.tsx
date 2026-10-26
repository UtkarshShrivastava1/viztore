import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardingStep4Schema, OnboardingStep4Dto } from '@repo/shared-types';
import { useOnboardingStore } from '../../stores/onboardingStore.js';
import { Input } from '../ui/Input.js';
import { Button } from '../ui/Button.js';
import { Card } from '../ui/Card.js';
import { MapPin, Store, Navigation, ArrowRight, ArrowLeft, Crosshair } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Custom Map Marker Icon
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({
  coords,
  setCoords,
}: {
  coords: [number, number]; // [lat, lng]
  setCoords: (coords: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      setCoords([e.latlng.lat, e.latlng.lng]);
    },
  });

  return <Marker position={coords} icon={markerIcon} />;
}

export const Step4StoreLocation: React.FC = () => {
  const { draft, updateDraft, nextStep, prevStep } = useOnboardingStore();

  const [mapCoords, setMapCoords] = useState<[number, number]>([
    draft.step4?.location?.coordinates?.[1] || 12.9716, // lat
    draft.step4?.location?.coordinates?.[0] || 77.5946, // lng
  ]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OnboardingStep4Dto>({
    resolver: zodResolver(onboardingStep4Schema),
    defaultValues: {
      merchantFullName: draft.step4?.merchantFullName || draft.step1?.fullName || '',
      storeDisplayName: draft.step4?.storeDisplayName || '',
      description: draft.step4?.description || '',
      deliveryRadiusKm: draft.step4?.deliveryRadiusKm || 4,
      address: {
        street: draft.step4?.address?.street || '',
        landmark: draft.step4?.address?.landmark || '',
        city: draft.step4?.address?.city || 'Bhilai',
        state: draft.step4?.address?.state || 'Chhattisgarh',
        pincode: draft.step4?.address?.pincode || '490023',
      },
      location: {
        type: 'Point',
        coordinates: [mapCoords[1], mapCoords[0]], // [lng, lat]
      },
    },
  });

  const deliveryRadius = watch('deliveryRadiusKm');

  const handleMapCoordChange = (newCoords: [number, number]) => {
    setMapCoords(newCoords);
    setValue('location', {
      type: 'Point',
      coordinates: [newCoords[1], newCoords[0]], // [lng, lat]
    });
  };

  const handleDetectGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleMapCoordChange([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {
          // Ignore if user denies
        },
      );
    }
  };

  const onSubmit = (data: OnboardingStep4Dto) => {
    updateDraft('step4', {
      ...data,
      location: {
        type: 'Point',
        coordinates: [mapCoords[1], mapCoords[0]],
      },
    });
    nextStep();
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="mb-6">
        <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Step 4 of 6</span>
        <h2 className="text-2xl font-bold text-slate-100 mt-1">Store Setup & Geolocation</h2>
        <p className="text-sm text-slate-400 mt-1">
          Set up your digital storefront name and map coordinates for nearby customer discovery (3–4 km).
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Merchant Full Name"
            placeholder="Owner / Proprietor Name"
            error={errors.merchantFullName?.message}
            {...register('merchantFullName')}
          />

          <Input
            label="Store Display Name"
            placeholder="e.g. Royal Footwear & Accessories"
            leftIcon={<Store className="w-4 h-4" />}
            error={errors.storeDisplayName?.message}
            {...register('storeDisplayName')}
          />
        </div>

        <Input
          label="Detailed Store Description"
          placeholder="Briefly describe the categories and products you sell"
          error={errors.description?.message}
          {...register('description')}
        />

        {/* Detailed Address Block */}
        <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/40 space-y-3">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Physical Shop Address</span>

          <Input
            placeholder="Shop No., Building Name, Street"
            error={errors.address?.street?.message}
            {...register('address.street')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              placeholder="Landmark (Optional)"
              {...register('address.landmark')}
            />
            <Input
              placeholder="City (e.g. Bengaluru)"
              error={errors.address?.city?.message}
              {...register('address.city')}
            />
            <Input
              placeholder="6-digit Pincode"
              error={errors.address?.pincode?.message}
              {...register('address.pincode')}
            />
          </div>
        </div>

        {/* Interactive Map Pin Drop */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-400" />
              <span>Map Pin Drop & Hyperlocal Delivery Radius</span>
            </label>
            <button
              type="button"
              onClick={handleDetectGPS}
              className="inline-flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Detect My GPS</span>
            </button>
          </div>

          <div className="h-56 w-full rounded-xl overflow-hidden border border-slate-800 relative shadow-inner">
            <MapContainer
              center={mapCoords}
              zoom={14}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker coords={mapCoords} setCoords={handleMapCoordChange} />
            </MapContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Coordinates: [{mapCoords[0].toFixed(4)}, {mapCoords[1].toFixed(4)}]</span>
            <span>Delivery Radius: <strong className="text-brand-400 font-semibold">{deliveryRadius || 4} km</strong></span>
          </div>

          {/* Delivery radius slider */}
          <div className="pt-2">
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
              {...register('deliveryRadiusKm', { valueAsNumber: true })}
            />
            <div className="flex justify-between text-[10px] text-slate-500 px-1 mt-1">
              <span>1 km (Neighbourhood)</span>
              <span>4 km (Optimal Hyperlocal)</span>
              <span>10 km (Extended)</span>
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between">
          <Button type="button" variant="outline" onClick={prevStep}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Back</span>
          </Button>

          <Button type="submit">
            <span>Continue to Operations</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </Card>
  );
};

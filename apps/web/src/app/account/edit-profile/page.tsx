'use client';

import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Calendar, MapPin, ChevronDown, Camera, ShieldCheck, Navigation, Loader2, Check } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useLocationStore } from '@/stores/location.store';
import { reverseGeocode } from '@/lib/location/geocoding';

export default function EditProfilePage() {
  const user = useAuthStore((state) => state.user);
  const locationAddress = useLocationStore((state) => state.address);
  const setStoreLocation = useLocationStore((state) => state.setLocation);

  const [isDetecting, setIsDetecting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const initialLocation = 
    user?.addresses?.[0]
      ? `${user.addresses[0].street}, ${user.addresses[0].city}`
      : locationAddress || 'Bhilai, Chhattisgarh';

  const [formData, setFormData] = useState({
    fullName: user?.fullName || 'Customer Account',
    mobileNumber: user?.phone ? `+91 ${user.phone}` : '+91 98765 43210',
    email: user?.email || 'customer@example.com',
    dob: '12 Apr 1998',
    gender: 'Male',
    location: initialLocation,
  });

  useEffect(() => {
    if (user) {
      const userLoc = user.addresses?.[0] 
        ? `${user.addresses[0].street}, ${user.addresses[0].city}`
        : locationAddress;
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
        mobileNumber: user.phone ? `+91 ${user.phone}` : prev.mobileNumber,
        location: userLoc || prev.location,
      }));
    }
  }, [user, locationAddress]);

  const handleDetectGPS = () => {
    if (!navigator.geolocation) return;
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const geocoded = await reverseGeocode(latitude, longitude);
          setFormData((prev) => ({ ...prev, location: geocoded.address }));
          setStoreLocation(longitude, latitude, geocoded.address);
        } catch {
          // ignore
        } finally {
          setIsDetecting(false);
        }
      },
      () => {
        setIsDetecting(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24 pt-4">
      <div className="mx-auto max-w-3xl rounded-t-3xl bg-white px-5 py-6 shadow-sm min-h-screen border-t flex flex-col">
        {/* Title */}
        <h1 className="text-xl font-bold text-[#192168] mb-8">Edit Profile</h1>

        {/* Profile Picture */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-sm font-bold text-[#192168]">Profile Picture</h2>
            <p className="text-xs text-gray-500 mt-0.5">Update your profile picture</p>
          </div>
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F0FE]">
              <User className="h-10 w-10 text-[#1668F6]" />
            </div>
            <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white border border-gray-100 shadow-sm text-[#1668F6]">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 flex-1">
          <FormField
            label="Full Name"
            value={formData.fullName}
            onChange={(v) => handleChange('fullName', v)}
            icon={<User className="h-5 w-5 text-gray-400" />}
          />
          <FormField
            label="Mobile Number"
            value={formData.mobileNumber}
            onChange={(v) => handleChange('mobileNumber', v)}
            icon={<Phone className="h-5 w-5 text-gray-400" />}
          />
          <FormField
            label="Email Address"
            value={formData.email}
            onChange={(v) => handleChange('email', v)}
            icon={<Mail className="h-5 w-5 text-gray-400" />}
          />
          <FormField
            label="Date of Birth"
            value={formData.dob}
            onChange={(v) => handleChange('dob', v)}
            icon={<Calendar className="h-5 w-5 text-gray-400" />}
          />
          <FormField
            label="Gender"
            value={formData.gender}
            onChange={(v) => handleChange('gender', v)}
            icon={<ChevronDown className="h-5 w-5 text-gray-400" />}
            isDropdown
          />
          <FormField
            label="Delivery Location / City"
            value={formData.location}
            onChange={(v) => handleChange('location', v)}
            icon={<MapPin className="h-5 w-5 text-gray-400" />}
            rightAction={
              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={isDetecting}
                title="Detect Current GPS Location"
                className="flex items-center gap-1 text-[11px] font-bold text-[#1668F6] bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
              >
                <Navigation className={`w-3 h-3 ${isDetecting ? 'animate-spin' : ''}`} />
                {isDetecting ? 'Locating...' : 'Detect'}
              </button>
            }
          />
        </div>

        {/* Security Banner */}
        <div className="mt-8 flex items-center gap-3 rounded-xl bg-[#F5F9FE] p-4 text-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#1668F6] shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">Your information is safe with us</h4>
            <p className="mt-0.5 text-[11px] text-gray-500 leading-tight">We never share your personal details with anyone.</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="fixed bottom-[72px] left-0 right-0 z-40 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:bottom-0 md:relative md:shadow-none md:p-0 md:mt-8">
          <div className="mx-auto max-w-3xl">
            <button 
              type="button"
              onClick={handleSave}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold text-white shadow-md transition ${
                saveSuccess ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#1668F6] hover:bg-blue-700'
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-5 h-5 text-white stroke-[3]" />
                  Profile Saved Successfully!
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function FormField({
  label,
  value,
  onChange,
  icon,
  isDropdown = false,
  rightAction,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  isDropdown?: boolean;
  rightAction?: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-[11px] font-bold text-[#192168] ml-1 mb-1 block">
        {label}
      </label>
      <div className="relative flex items-center rounded-xl border border-gray-200 bg-white focus-within:border-[#1668F6] focus-within:ring-1 focus-within:ring-[#1668F6] transition-all">
        {isDropdown ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none bg-transparent py-3 pl-4 pr-10 text-sm font-medium text-gray-900 focus:outline-none"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent py-3 pl-4 pr-24 text-sm font-medium text-gray-900 focus:outline-none placeholder:text-gray-400"
          />
        )}
        <div className="absolute right-3 flex items-center gap-2">
          {rightAction}
          <span className="pointer-events-none">{icon}</span>
        </div>
      </div>
    </div>
  );
}

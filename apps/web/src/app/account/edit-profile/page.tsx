'use client';

import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Calendar, MapPin, ChevronDown, Camera, ShieldCheck, Navigation, Check, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useLocationStore } from '@/stores/location.store';
import { reverseGeocode } from '@/lib/location/geocoding';
import { userApi } from '@/lib/api/user';

export default function EditProfilePage() {
  const { user, isAuthenticated, openAuthModal, updateUser } = useAuthStore();
  const locationAddress = useLocationStore((state) => state.address);
  const setStoreLocation = useLocationStore((state) => state.setLocation);

  const [isDetecting, setIsDetecting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const initialLocation = 
    user?.addresses?.[0]
      ? `${user.addresses[0].street}, ${user.addresses[0].city}`
      : locationAddress || 'Bhilai, Chhattisgarh';

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    mobileNumber: user?.phone ? (user.phone.startsWith('+91') ? user.phone : `+91 ${user.phone}`) : '',
    email: user?.email || '',
    dob: (user as any)?.dateOfBirth || '',
    gender: (user as any)?.gender ? (((user as any).gender.charAt(0).toUpperCase() + (user as any).gender.slice(1))) : 'Male',
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
        dob: (user as any).dateOfBirth || prev.dob,
        gender: (user as any).gender ? ((user as any).gender.charAt(0).toUpperCase() + (user as any).gender.slice(1)) : prev.gender,
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

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const cleanPhone = formData.mobileNumber.replace(/\D/g, '').slice(-10);
      const genderMap: Record<string, 'male' | 'female' | 'other' | 'prefer_not_to_say'> = {
        'Male': 'male',
        'Female': 'female',
        'Other': 'other',
      };

      const updated = await userApi.updateProfile({
        fullName: formData.fullName.trim() || undefined,
        phone: cleanPhone.length === 10 ? cleanPhone : undefined,
        dateOfBirth: formData.dob || undefined,
        gender: genderMap[formData.gender] || 'prefer_not_to_say',
      });

      updateUser(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    if (field === 'mobileNumber') {
      const digits = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, [field]: digits ? `+91 ${digits}` : '' }));
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (mounted && !isAuthenticated) {
    return (
      <main className="min-h-[70vh] bg-white font-sans flex flex-col items-center justify-center px-4 py-20">
        <div className="w-16 h-16 bg-[#E8F0FE] rounded-full flex items-center justify-center text-[#1668F6] mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#192168] mb-2">Sign in to edit your profile</h2>
        <p className="text-sm text-surface-500 text-center max-w-sm mb-6">
          Please sign in to view and update your personal information.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-8 py-3 bg-[#1668F6] text-white text-sm font-bold rounded-xl shadow-sm hover:bg-blue-700 transition cursor-pointer"
        >
          Sign In / Create Account
        </button>
      </main>
    );
  }

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
            <button 
              type="button"
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white border border-gray-100 shadow-sm text-[#1668F6]"
              aria-label="Upload profile picture"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

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
              disabled={isSaving}
              onClick={handleSave}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold text-white shadow-md transition disabled:opacity-75 ${
                saveSuccess ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#1668F6] hover:bg-blue-700'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving Changes...
                </>
              ) : saveSuccess ? (
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
            type={label === 'Mobile Number' ? 'tel' : 'text'}
            inputMode={label === 'Mobile Number' ? 'numeric' : undefined}
            maxLength={label === 'Mobile Number' ? 14 : undefined}
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

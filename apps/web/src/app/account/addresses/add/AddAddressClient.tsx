'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  ArrowLeft,
  Crosshair,
  Home,
  Briefcase,
  Building,
  Tag,
  Phone,
  User,
  Navigation,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { userApi } from '@/lib/api/user.js';
import type { CreateAddressDto } from '@repo/shared-types';

export function AddAddressClient() {
  const router = useRouter();
  const { user, isAuthenticated, openAuthModal } = useAuthStore();

  const [addressType, setAddressType] = useState<'home' | 'work' | 'other'>('home');
  const [customLabel, setCustomLabel] = useState('');
  
  // Form fields
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [mobileNumber, setMobileNumber] = useState(user?.phone || '');
  const [pincode, setPincode] = useState('');
  const [locality, setLocality] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [landmark, setLandmark] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [isDefault, setIsDefault] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          // Reverse geocode via free nominatim API
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.address) {
            if (data.address.postcode) setPincode(data.address.postcode);
            if (data.address.city || data.address.town || data.address.village) {
              setCity(data.address.city || data.address.town || data.address.village);
            }
            if (data.address.state) setState(data.address.state);
            if (data.address.suburb || data.address.neighbourhood) {
              setLocality(data.address.suburb || data.address.neighbourhood);
            }
          }
        } catch (err) {
          console.warn('Could not reverse geocode location:', err);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn('Location permission denied or unavailable:', err);
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !mobileNumber.trim() || !pincode.trim() || !streetAddress.trim() || !city.trim()) {
      setErrorMsg('Please fill in all required fields (Full Name, Phone, Pincode, Address, City).');
      return;
    }

    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    const labelName = addressType === 'other' ? (customLabel.trim() || 'Other') : (addressType === 'work' ? 'Work' : 'Home');

    const dto: CreateAddressDto = {
      label: labelName,
      recipientName: fullName.trim(),
      phone: mobileNumber.trim(),
      street: locality ? `${streetAddress.trim()}, ${locality.trim()}` : streetAddress.trim(),
      city: city.trim(),
      state: state.trim() || 'Maharashtra',
      pincode: pincode.trim(),
      isDefault: isDefault,
    };

    try {
      setIsSubmitting(true);
      await userApi.addAddress(dto);
      router.push('/account/addresses');
    } catch (err: unknown) {
      console.error('Error saving address:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] relative font-sans pb-24">
      <main className="max-w-[1680px] mx-auto px-4 lg:px-8 pt-4 pb-6 relative z-10 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* ================= DESKTOP LEFT SIDEBAR ================= */}
        <AccountSidebar />

        {/* ================= RIGHT MAIN CONTENT ================= */}
        <div className="flex-1 w-full flex flex-col gap-4 min-h-screen bg-transparent lg:bg-white lg:rounded-xl lg:shadow-sm lg:border lg:border-surface-200/60 lg:p-6">
          
          {/* Header */}
          <div className="px-0 w-full pt-2 pb-2">
            <div className="flex items-start gap-3">
              <button onClick={() => router.back()} className="mt-1 shrink-0 lg:hidden">
                <ArrowLeft className="w-6 h-6 text-[#192168]" />
              </button>
              <div>
                <h1 className="text-[22px] lg:text-[28px] font-extrabold text-[#192168] leading-tight">
                  Add New Address
                </h1>
                <p className="text-[12px] lg:text-[14px] text-surface-500 mt-1">
                  Add your delivery location for faster single-store ordering.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-surface-200/60 p-4 lg:p-8">
            
            {/* Map Pin-Drop Preview */}
            <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-surface-200 cursor-pointer group mb-6" onClick={handleUseCurrentLocation}>
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
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 px-4 py-1.5 rounded-full shadow-sm">
                 <span className="text-[11px] font-bold text-[#192168]">Click map to set location</span>
              </div>
            </div>

            {/* Current Location Block */}
            <div className="bg-[#F8FAFF] border border-[#E5E7EB] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8F0FE] rounded-full flex items-center justify-center shrink-0">
                  <Crosshair className={`w-5 h-5 text-[#1668F6] ${isLocating ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-[#1668F6]">Use device location</h4>
                  <p className="text-[11px] text-surface-500 mt-0.5">Auto-fill city, state, and area using your device GPS.</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#1668F6] text-[#1668F6] rounded-lg text-[12px] font-bold shrink-0 w-full sm:w-auto hover:bg-blue-50 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" /> {isLocating ? 'Detecting...' : 'Use Current Location'}
              </button>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-[#192168]">Full Name <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="w-4 h-4 text-surface-400" />
                    </div>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter full name" 
                      required
                      className="bg-white w-full pl-10 pr-4 py-3 rounded-lg border border-surface-200 focus:outline-none focus:border-[#1668F6] text-[13px] text-surface-800 placeholder:text-surface-400" 
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-[#192168]">Mobile Number <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="w-4 h-4 text-surface-400" />
                    </div>
                    <input 
                      type="tel" 
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="Enter 10-digit mobile number" 
                      required
                      className="bg-white w-full pl-10 pr-4 py-3 rounded-lg border border-surface-200 focus:outline-none focus:border-[#1668F6] text-[13px] text-surface-800 placeholder:text-surface-400" 
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-[#192168]">Pincode <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <MapPin className="w-4 h-4 text-surface-400" />
                    </div>
                    <input 
                      type="text" 
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Enter 6-digit pincode" 
                      required
                      className="bg-white w-full pl-10 pr-4 py-3 rounded-lg border border-surface-200 focus:outline-none focus:border-[#1668F6] text-[13px] text-surface-800 placeholder:text-surface-400" 
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-[#192168]">Locality / Area</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Navigation className="w-4 h-4 text-surface-400" />
                    </div>
                    <input 
                      type="text" 
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      placeholder="Enter locality or area" 
                      className="bg-white w-full pl-10 pr-4 py-3 rounded-lg border border-surface-200 focus:outline-none focus:border-[#1668F6] text-[13px] text-surface-800 placeholder:text-surface-400" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-[#192168]">Address (House No., Building, Street) <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none">
                    <Home className="w-4 h-4 text-surface-400" />
                  </div>
                  <textarea 
                    rows={3} 
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="Enter house no., building name, street, etc." 
                    required
                    className="bg-white w-full pl-10 pr-4 py-3 rounded-lg border border-surface-200 focus:outline-none focus:border-[#1668F6] text-[13px] text-surface-800 placeholder:text-surface-400 resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-[#192168]">City / District / Town <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Building2 className="w-4 h-4 text-surface-400" />
                    </div>
                    <input 
                      type="text" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Enter city or district" 
                      required
                      className="bg-white w-full pl-10 pr-4 py-3 rounded-lg border border-surface-200 focus:outline-none focus:border-[#1668F6] text-[13px] text-surface-800 placeholder:text-surface-400" 
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-[#192168]">State <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <FileSpreadsheet className="w-4 h-4 text-surface-400" />
                    </div>
                    <select 
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-surface-200 focus:outline-none focus:border-[#1668F6] text-[13px] text-surface-800 bg-white appearance-none cursor-pointer"
                    >
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Rajasthan">Rajasthan</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                      <ChevronRight className="w-4 h-4 text-surface-400 rotate-90" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-[#192168]">Landmark (Optional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <MapPin className="w-4 h-4 text-surface-400" />
                    </div>
                    <input 
                      type="text" 
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="Enter landmark (e.g. near metro, hospital)" 
                      className="bg-white w-full pl-10 pr-4 py-3 rounded-lg border border-surface-200 focus:outline-none focus:border-[#1668F6] text-[13px] text-surface-800 placeholder:text-surface-400" 
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-[#192168]">Alternate Phone (Optional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="w-4 h-4 text-surface-400" />
                    </div>
                    <input 
                      type="tel" 
                      value={alternatePhone}
                      onChange={(e) => setAlternatePhone(e.target.value)}
                      placeholder="Enter alternate phone number" 
                      className="bg-white w-full pl-10 pr-4 py-3 rounded-lg border border-surface-200 focus:outline-none focus:border-[#1668F6] text-[13px] text-surface-800 placeholder:text-surface-400" 
                    />
                  </div>
                </div>
              </div>

              {/* Address Type Selection */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-[12px] font-bold text-[#192168]">Address Type <span className="text-rose-500">*</span></label>
                <div className="grid grid-cols-3 gap-3">
                  <label className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl cursor-pointer transition-all border ${addressType === 'home' ? 'border-[#1668F6] bg-[#F8FAFF]' : 'border-surface-200 bg-white hover:bg-surface-50'}`}>
                    <Home className={`w-6 h-6 ${addressType === 'home' ? 'text-[#1668F6]' : 'text-[#192168]'}`} />
                    <span className={`text-[12px] font-bold ${addressType === 'home' ? 'text-[#1668F6]' : 'text-[#192168]'}`}>Home</span>
                    <div className={`w-4 h-4 rounded-full border-[4px] ${addressType === 'home' ? 'border-[#1668F6] bg-white' : 'border-surface-300 bg-transparent'}`}></div>
                    <input type="radio" name="addressType" value="home" checked={addressType === 'home'} onChange={() => setAddressType('home')} className="hidden" />
                  </label>

                  <label className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl cursor-pointer transition-all border ${addressType === 'work' ? 'border-[#1668F6] bg-[#F8FAFF]' : 'border-surface-200 bg-white hover:bg-surface-50'}`}>
                    <Briefcase className={`w-6 h-6 ${addressType === 'work' ? 'text-[#1668F6]' : 'text-[#192168]'}`} />
                    <span className={`text-[12px] font-bold ${addressType === 'work' ? 'text-[#1668F6]' : 'text-[#192168]'}`}>Work</span>
                    <div className={`w-4 h-4 rounded-full border-[4px] ${addressType === 'work' ? 'border-[#1668F6] bg-white' : 'border-surface-300 bg-transparent'}`}></div>
                    <input type="radio" name="addressType" value="work" checked={addressType === 'work'} onChange={() => setAddressType('work')} className="hidden" />
                  </label>

                  <label className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl cursor-pointer transition-all border ${addressType === 'other' ? 'border-[#1668F6] bg-[#F8FAFF]' : 'border-surface-200 bg-white hover:bg-surface-50'}`}>
                    <Building className={`w-6 h-6 ${addressType === 'other' ? 'text-[#1668F6]' : 'text-[#192168]'}`} />
                    <span className={`text-[12px] font-bold ${addressType === 'other' ? 'text-[#1668F6]' : 'text-[#192168]'}`}>Other</span>
                    <div className={`w-4 h-4 rounded-full border-[4px] ${addressType === 'other' ? 'border-[#1668F6] bg-white' : 'border-surface-300 bg-transparent'}`}></div>
                    <input type="radio" name="addressType" value="other" checked={addressType === 'other'} onChange={() => setAddressType('other')} className="hidden" />
                  </label>
                </div>
                
                {addressType === 'other' && (
                  <div className="relative mt-2">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Tag className="w-4 h-4 text-surface-400" />
                    </div>
                    <input 
                      type="text" 
                      value={customLabel}
                      onChange={(e) => setCustomLabel(e.target.value)}
                      placeholder="Enter custom label (e.g. Friends Flat, Warehouse)" 
                      className="bg-white w-full pl-10 pr-4 py-3 rounded-lg border border-surface-200 focus:outline-none focus:border-[#1668F6] text-[13px] text-surface-800 placeholder:text-surface-400"
                    />
                  </div>
                )}
              </div>

              {/* Set Default Checkbox */}
              <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                <input 
                  type="checkbox" 
                  checked={isDefault} 
                  onChange={(e) => setIsDefault(e.target.checked)} 
                  className="w-4 h-4 text-[#1668F6] rounded border-surface-300 focus:ring-0" 
                />
                <span className="text-[13px] font-medium text-[#192168]">Make this my default shipping destination</span>
              </label>

              {/* Security Banner */}
              <div className="bg-[#F8FAFF] rounded-xl p-4 mt-2 flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 border border-blue-100 shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-[#1668F6]" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-[#192168]">Your information is safe with us</h4>
                  <p className="text-[11px] text-surface-600 mt-0.5">We encrypt your delivery location and never share it with third parties.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#0F53FB] text-white rounded-xl text-[14px] font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving Address...
                    </>
                  ) : (
                    'Save Address'
                  )}
                </button>
                <Link href="/account/addresses" className="w-full py-3.5 bg-white border border-[#1668F6] text-[#1668F6] rounded-xl text-[14px] font-bold hover:bg-blue-50 transition-colors text-center block">
                  Cancel
                </Link>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

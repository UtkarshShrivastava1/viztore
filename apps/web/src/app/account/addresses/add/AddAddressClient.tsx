'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Store,
  MapPin,
  Ticket,
  MessageSquare,
  HeadphonesIcon,
  Shield,
  FileText,
  LogOut,
  User,
  Bell,
  ShoppingBasket,
  ShoppingBag,
  Calendar,
  ChevronRight,
  ArrowLeft,
  Crosshair,
  Home,
  Briefcase,
  Tag,
  Phone,
  Building,
  Navigation,
  ShieldCheck,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import { branding } from '@repo/shared-types';
import { useAuthStore } from '@/stores/auth.store';
import { AccountSidebar } from '@/components/account/AccountSidebar';

export function AddAddressClient() {
  const router = useRouter();
  const { user, isAuthenticated, openAuthModal } = useAuthStore();
  const [addressType, setAddressType] = useState('home');

  const formData = {
    fullName: user?.fullName || 'Harish Kumar',
    mobileNumber: user?.phone ? `+91 ${user.phone}` : '+91 91234 56789',
    email: user?.email || 'harishkumar@gmail.com',
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
                  Add your address details for a smooth delivery experience.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-surface-200/60 p-4 lg:p-8">
            
            {/* Current Location Block */}
            <div className="bg-[#F8FAFF] border border-[#E5E7EB] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8F0FE] rounded-full flex items-center justify-center shrink-0">
                  <Crosshair className="w-5 h-5 text-[#1668F6]" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-[#1668F6]">Use my current location</h4>
                  <p className="text-[11px] text-surface-500 mt-0.5">Auto-fill your address using your device's location.</p>
                </div>
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#1668F6] text-[#1668F6] rounded-lg text-[12px] font-bold shrink-0 w-full sm:w-auto">
                <MapPin className="w-3.5 h-3.5" /> Use Current Location
              </button>
            </div>

            {/* Form */}
            <form className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-[#192168]">Full Name <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="w-4 h-4 text-surface-400" />
                    </div>
                    <input type="text" placeholder="Enter full name" className="bg-white w-full pl-10 pr-4 py-3 rounded-lg border border-surface-200 focus:outline-none focus:border-[#1668F6] text-[13px] text-surface-800 placeholder:text-surface-400" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-[#192168]">Mobile Number <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="w-4 h-4 text-surface-400" />
                    </div>
                    <input type="tel" placeholder="Enter 10-digit mobile number" className="bg-white w-full pl-10 pr-4 py-3 rounded-lg border border-surface-200 focus:outline-none focus:border-[#1668F6] text-[13px] text-surface-800 placeholder:text-surface-400" />
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
                    <input type="text" placeholder="Enter pincode" className="bg-white w-full pl-10 pr-4 py-3 rounded-lg border border-surface-200 focus:outline-none focus:border-[#1668F6] text-[13px] text-surface-800 placeholder:text-surface-400" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-[#192168]">Locality / Area <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Navigation className="w-4 h-4 text-surface-400" />
                    </div>
                    <input type="text" placeholder="Enter locality or area" className="bg-white w-full pl-10 pr-4 py-3 rounded-lg border border-surface-200 focus:outline-none focus:border-[#1668F6] text-[13px] text-surface-800 placeholder:text-surface-400" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-[#192168]">Address (House No., Building, Street) <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none">
                    <Home className="w-4 h-4 text-surface-400" />
                  </div>
                  <textarea rows={3} placeholder="Enter house no., building name, street, etc." className="bg-white w-full pl-10 pr-4 py-3 rounded-lg border border-surface-200 focus:outline-none focus:border-[#1668F6] text-[13px] text-surface-800 placeholder:text-surface-400 resize-none"></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-[#192168]">City / District / Town <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Building2 className="w-4 h-4 text-surface-400" />
                    </div>
                    <input type="text" placeholder="Enter city, district or town" className="bg-white w-full pl-10 pr-4 py-3 rounded-lg border border-surface-200 focus:outline-none focus:border-[#1668F6] text-[13px] text-surface-800 placeholder:text-surface-400" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-[#192168]">State <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <FileSpreadsheet className="w-4 h-4 text-surface-400" />
                    </div>
                    <select className="w-full pl-10 pr-4 py-3 rounded-lg border border-surface-200 focus:outline-none focus:border-[#1668F6] text-[13px] text-surface-800 bg-white appearance-none cursor-pointer">
                      <option value="" disabled selected>-- Select State --</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
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
                    <input type="text" placeholder="Enter landmark (e.g. near school, temple, etc.)" className="bg-white w-full pl-10 pr-4 py-3 rounded-lg border border-surface-200 focus:outline-none focus:border-[#1668F6] text-[13px] text-surface-800 placeholder:text-surface-400" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-[#192168]">Alternate Phone (Optional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="w-4 h-4 text-surface-400" />
                    </div>
                    <input type="tel" placeholder="Enter alternate phone number" className="bg-white w-full pl-10 pr-4 py-3 rounded-lg border border-surface-200 focus:outline-none focus:border-[#1668F6] text-[13px] text-surface-800 placeholder:text-surface-400" />
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
                      placeholder="Enter address type (e.g. Office, Friends, etc.)" 
                      className="bg-white w-full pl-10 pr-4 py-3 rounded-lg border border-surface-200 focus:outline-none focus:border-[#1668F6] text-[13px] text-surface-800 placeholder:text-surface-400"
                    />
                  </div>
                )}
              </div>

              {/* Security Banner */}
              <div className="bg-[#F8FAFF] rounded-xl p-4 mt-2 flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 border border-blue-100 shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-[#1668F6]" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-[#192168]">Your information is safe with us</h4>
                  <p className="text-[11px] text-surface-600 mt-0.5">We never share your addresses with anyone.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-4">
                <button type="button" className="w-full py-3.5 bg-[#0F53FB] text-white rounded-xl text-[14px] font-bold hover:bg-blue-700 transition-colors">
                  Save Address
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

function MenuLink({ icon, title, href = "#", isActive = false }: { icon: React.ReactNode, title: string, href?: string, isActive?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-5 py-2.5 transition-colors ${
        isActive 
          ? 'bg-[#E8F0FE] text-[#1668F6] border-r-2 border-[#1668F6]' 
          : 'hover:bg-surface-50 text-surface-600'
      }`}
    >
      <div className={`${isActive ? 'text-[#1668F6]' : ''}`}>
        {icon}
      </div>
      <span className={`text-[13px] ${isActive ? 'font-bold' : 'font-semibold text-[#192168]'}`}>
        {title}
      </span>
    </Link>
  );
}

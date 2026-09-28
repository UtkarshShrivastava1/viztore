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
  Plus,
  Home,
  Briefcase,
  Trash2,
  Pencil,
  CheckCircle2,
  Circle,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { branding } from '@repo/shared-types';
import { useAuthStore } from '@/stores/auth.store';
import { AccountSidebar } from '@/components/account/AccountSidebar';

interface AddressData {
  id: string;
  type: 'home' | 'work' | 'parents' | 'other';
  label: string;
  name: string;
  lines: string[];
  country: string;
  phone: string;
  isDefault: boolean;
}

const dummyAddresses: AddressData[] = [
  {
    id: '1',
    type: 'home',
    label: 'Home',
    name: 'Harish Kumar',
    lines: ['House No. 123, Boring Road,', 'Patna, Bihar - 800001'],
    country: 'India',
    phone: '+91 91234 56789',
    isDefault: true,
  },
  {
    id: '2',
    type: 'work',
    label: 'Work',
    name: 'Harish Kumar',
    lines: ['Zager Technologies Pvt. Ltd.,', '3rd Floor, West Boring Canal Road,', 'Patna, Bihar - 800001'],
    country: 'India',
    phone: '+91 91234 56789',
    isDefault: false,
  },
  {
    id: '3',
    type: 'parents',
    label: 'Parents Home',
    name: 'Harish Kumar',
    lines: ['House No. 45, Park Road,', 'Kankarbagh, Patna, Bihar - 800020'],
    country: 'India',
    phone: '+91 91234 56789',
    isDefault: false,
  },
  {
    id: '4',
    type: 'other',
    label: 'Other',
    name: 'Harish Kumar',
    lines: ['Flat No. 5B, Shanti Apartments,', 'Exhibition Road, Patna, Bihar - 800001'],
    country: 'India',
    phone: '+91 91234 56789',
    isDefault: false,
  },
];

export function AddressesClient() {
  const router = useRouter();
  const { user, isAuthenticated, openAuthModal } = useAuthStore();
  const [addresses, setAddresses] = useState<AddressData[]>(dummyAddresses);

  // Leave space for backend fetch in the future
  // useEffect(() => {
  //   const fetchAddresses = async () => { ... }
  // }, []);

  const formData = {
    fullName: user?.fullName || 'Harish Kumar',
    mobileNumber: user?.phone ? `+91 ${user.phone}` : '+91 91234 56789',
    email: user?.email || 'harishkumar@gmail.com',
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: addr.id === id })));
    // TODO: Connect to backend API endpoint to update default address
  };

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    // TODO: Connect to backend API endpoint to delete address
  };

  const getIconConfig = (type: string) => {
    switch (type) {
      case 'home':
        return { icon: <Home className="w-5 h-5 lg:w-6 lg:h-6 text-[#1668F6]" />, bg: 'bg-[#E8F0FE]' };
      case 'work':
        return { icon: <Briefcase className="w-5 h-5 lg:w-6 lg:h-6 text-[#EA580C]" />, bg: 'bg-[#FFEDD5]' };
      case 'parents':
        return { icon: <MapPin className="w-5 h-5 lg:w-6 lg:h-6 text-[#16A34A]" />, bg: 'bg-[#DCFCE7]' };
      case 'other':
      default:
        return { icon: <Store className="w-5 h-5 lg:w-6 lg:h-6 text-[#9333EA]" />, bg: 'bg-[#F3E8FF]' };
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[22px] lg:text-[28px] font-extrabold text-[#192168] leading-tight flex items-center gap-2">
                  <button onClick={() => router.back()} className="lg:hidden">
                    <ArrowLeft className="w-6 h-6 text-[#192168]" />
                  </button>
                  <span className={""}>My Addresses</span>
                </h1>
              </div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[12px] lg:text-[14px] text-surface-600 font-medium">Manage your saved addresses</p>
              <Link href="/account/addresses/add" className="flex items-center gap-1.5 text-[#1668F6] text-[13px] font-bold shrink-0 hover:underline">
                <Plus className="w-4 h-4" /> Add New Address
              </Link>
            </div>
          </div>

          {/* Addresses List */}
          <div className="flex flex-col gap-4 mt-2">
            {addresses.map((address) => {
              const { icon, bg } = getIconConfig(address.type);
              
              // Styling for default vs normal card
              const isDefault = address.isDefault;
              const cardBg = isDefault ? 'bg-[#F8FAFF]' : 'bg-white';
              const cardBorder = isDefault ? 'border-[#C7D9FE]' : 'border-[#E5E7EB]';
              
              return (
                <div key={address.id} className={`border ${cardBorder} ${cardBg} rounded-[14px] p-4 lg:p-5 hover:shadow-sm transition-all relative`}>
                  
                  {/* Top Right Actions */}
                  <div className="absolute top-4 right-4 flex items-center gap-3 text-[12px] lg:text-[13px] font-bold">
                    <button className="flex items-center gap-1 text-[#1668F6] hover:underline">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button onClick={() => handleDelete(address.id)} className="flex items-center gap-1 text-surface-400 hover:text-rose-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex gap-4">
                    {/* Icon Container with Optional Badge */}
                    <div className="flex flex-col items-center gap-2">
                      {isDefault ? (
                        <div className="bg-[#BFDBFE] text-[#1D4ED8] text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider h-[18px] flex items-center justify-center">
                          Default
                        </div>
                      ) : (
                        <div className="h-[18px]"></div> // Spacer for alignment
                      )}
                      <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                        {icon}
                      </div>
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 min-w-0 pr-12 pt-[18px]">
                      <h3 className="text-[15px] lg:text-[16px] font-bold text-[#192168] mb-1.5">{address.label}</h3>
                      <p className="text-[13px] lg:text-[14px] text-surface-600 font-medium mb-1">{address.name}</p>
                      
                      <div className="text-[12px] lg:text-[13px] text-surface-500 leading-relaxed mb-2">
                        {address.lines.map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                        <p>{address.country}</p>
                      </div>
                      
                      <p className="text-[12px] lg:text-[13px] font-medium text-surface-600">{address.phone}</p>
                    </div>
                  </div>

                  {/* Bottom Right Default Status */}
                  <div className="absolute bottom-4 right-4 flex items-center justify-end">
                    {isDefault ? (
                      <div className="flex items-center gap-1.5 text-[#1668F6] font-bold text-[11px] lg:text-[13px]">
                        <CheckCircle2 className="w-4 h-4 fill-[#1668F6] text-white" /> Default Address
                      </div>
                    ) : (
                      <button onClick={() => handleSetDefault(address.id)} className="flex items-center gap-1.5 text-surface-500 font-medium text-[11px] lg:text-[13px] hover:text-[#192168] transition-colors">
                        <Circle className="w-4 h-4 text-surface-300" /> Set as Default
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Security Banner */}
          <div className="bg-[#F8FAFF] rounded-xl p-4 mt-2 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 border border-blue-100 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-[#1668F6]" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-[#192168]">Your addresses are 100% secure</h4>
              <p className="text-[11px] text-surface-600 mt-0.5">We never share your addresses with anyone.</p>
            </div>
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

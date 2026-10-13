'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  Briefcase, 
  MapPin, 
  Store, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  ShieldCheck, 
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { userApi } from '@/lib/api/user.js';
import type { IAddress } from '@repo/shared-types';

interface AddressData {
  id: string;
  type: string;
  label: string;
  name: string;
  lines: string[];
  country: string;
  phone: string;
  isDefault: boolean;
}

export function AddressesClient() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const mapBackendAddress = (addr: IAddress, index: number): AddressData => ({
    id: addr._id || `addr-${index}`,
    type: (addr.label || 'home').toLowerCase(),
    label: addr.label || 'Home',
    name: addr.recipientName || user?.fullName || 'Customer',
    lines: [
      addr.street,
      [addr.landmark, addr.city, addr.state, addr.pincode ? `- ${addr.pincode}` : ''].filter(Boolean).join(', ')
    ].filter(Boolean),
    country: 'India',
    phone: addr.phone || user?.phone || '',
    isDefault: Boolean(addr.isDefault),
  });

  const loadAddresses = async () => {
    try {
      setIsLoading(true);
      if (isAuthenticated) {
        const rawAddresses = await userApi.getAddresses();
        if (Array.isArray(rawAddresses)) {
          setAddresses(rawAddresses.map(mapBackendAddress));
          return;
        }
      }
      setAddresses([]);
    } catch (err) {
      console.warn('Failed to fetch addresses from API:', err);
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, [isAuthenticated]);

  const handleSetDefault = async (id: string) => {
    try {
      setActionLoadingId(id);
      if (isAuthenticated) {
        const updated = await userApi.setDefaultAddress(id);
        if (Array.isArray(updated)) {
          setAddresses(updated.map(mapBackendAddress));
          return;
        }
      }
      setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: addr.id === id })));
    } catch (err) {
      console.error('Failed to set default address:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      setActionLoadingId(id);
      if (isAuthenticated) {
        const updated = await userApi.deleteAddress(id);
        if (Array.isArray(updated)) {
          setAddresses(updated.map(mapBackendAddress));
          return;
        }
      }
      setAddresses(prev => prev.filter(addr => addr.id !== id));
    } catch (err) {
      console.error('Failed to delete address:', err);
    } finally {
      setActionLoadingId(null);
    }
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
                  <span>My Addresses</span>
                </h1>
              </div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[12px] lg:text-[14px] text-surface-600 font-medium">Manage your saved delivery destinations</p>
              <Link href="/account/addresses/add" className="flex items-center gap-1.5 text-[#1668F6] text-[13px] font-bold shrink-0 hover:underline">
                <Plus className="w-4 h-4" /> Add New Address
              </Link>
            </div>
          </div>

          {/* Loading Indicator */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-surface-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#1668F6] mb-3" />
              <p className="text-sm font-medium">Loading your saved addresses...</p>
            </div>
          ) : addresses.length === 0 ? (
            /* Empty State */
            <div className="border border-dashed border-[#E5E7EB] bg-white rounded-[14px] p-8 lg:p-12 text-center flex flex-col items-center justify-center my-4">
              <div className="w-16 h-16 rounded-full bg-[#E8F0FE] flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-[#1668F6]" />
              </div>
              <h3 className="text-[16px] lg:text-[18px] font-bold text-[#192168] mb-1">No Addresses Saved Yet</h3>
              <p className="text-[13px] text-surface-500 max-w-md mb-6 leading-relaxed">
                Add your home or office address to enable instant 1-click checkout and hyperlocal delivery tracking.
              </p>
              <Link 
                href="/account/addresses/add" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1668F6] text-white text-[13px] font-bold rounded-xl shadow-sm hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Your First Address
              </Link>
            </div>
          ) : (
            /* Addresses List */
            <div className="flex flex-col gap-4 mt-2">
              {addresses.map((address) => {
                const { icon, bg } = getIconConfig(address.type);
                const isDefault = address.isDefault;
                const cardBg = isDefault ? 'bg-[#F8FAFF]' : 'bg-white';
                const cardBorder = isDefault ? 'border-[#C7D9FE]' : 'border-[#E5E7EB]';
                const isItemLoading = actionLoadingId === address.id;
                
                return (
                  <div key={address.id} className={`border ${cardBorder} ${cardBg} rounded-[14px] p-4 lg:p-5 hover:shadow-sm transition-all relative ${isItemLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                    
                    {/* Top Right Actions */}
                    <div className="absolute top-4 right-4 flex items-center gap-3 text-[12px] lg:text-[13px] font-bold">
                      <button onClick={() => handleDelete(address.id)} className="flex items-center gap-1 text-surface-400 hover:text-rose-500 transition-colors p-1" title="Delete Address">
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
                          <div className="h-[18px]"></div>
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
                        
                        {address.phone && (
                          <p className="text-[12px] lg:text-[13px] font-medium text-surface-600">{address.phone}</p>
                        )}
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
          )}

          {/* Security Banner */}
          <div className="bg-[#F8FAFF] rounded-xl p-4 mt-2 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 border border-blue-100 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-[#1668F6]" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-[#192168]">Your addresses are 100% secure</h4>
              <p className="text-[11px] text-surface-600 mt-0.5">We encrypt your saved delivery details and never share them with third parties.</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

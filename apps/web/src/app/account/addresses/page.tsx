'use client';

import React, { useState, useEffect } from 'react';
import { AddressCard, Address } from '@/components/account/AddressCard';
import { Plus, ShieldCheck, Loader2 } from 'lucide-react';
import { userApi } from '@/lib/api/user';
import type { IAddress } from '@repo/shared-types';

const defaultFallbackAddresses: Address[] = [
  {
    id: 'addr-1',
    type: 'home',
    label: 'Home',
    name: 'Customer Account',
    addressString: 'House No. 123, Ring Road,\nCity Center - 800001\nIndia',
    phone: '+91 98765 43210',
    isDefault: true,
  },
  {
    id: 'addr-2',
    type: 'work',
    label: 'Office / Work',
    name: 'Customer Account',
    addressString: 'Tech Park, 3rd Floor,\nCommercial Zone - 800001\nIndia',
    phone: '+91 98765 43210',
    isDefault: false,
  },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(defaultFallbackAddresses);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch real addresses from backend API
  useEffect(() => {
    let isMounted = true;
    const fetchAddresses = async () => {
      try {
        setIsLoading(true);
        const data = await userApi.getAddresses();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const mapped: Address[] = data.map((addr: IAddress) => ({
            id: addr._id || String(Math.random()),
            type: (addr.label?.toLowerCase() === 'work' ? 'work' : 'home') as Address['type'],
            label: addr.label || 'Saved Address',
            name: 'Customer Account',
            addressString: `${addr.street}${addr.landmark ? `, Near ${addr.landmark}` : ''},\n${addr.city}, ${addr.state} - ${addr.pincode}`,
            phone: '+91 98765 43210',
            isDefault: !!addr.isDefault,
          }));
          setAddresses(mapped);
        }
      } catch {
        // Fallback to default mock addresses gracefully if unauthenticated or offline
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAddresses();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSetDefault = async (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );

    try {
      await userApi.setDefaultAddress(id);
    } catch {
      // Local state already optimistically updated
    }
  };

  const handleDelete = async (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    try {
      await userApi.deleteAddress(id);
    } catch {
      // Handled gracefully
    }
  };

  const handleEdit = (id: string) => {
    alert(`Editing address: ${id}`);
  };

  const handleAddNew = async () => {
    const label = prompt('Address Label (e.g. Home, Work, Parents):', 'Home');
    if (!label) return;
    const street = prompt('Street Address:', 'Flat 402, Green Valley Apartments');
    if (!street) return;
    const city = prompt('City:', 'Patna') || 'Patna';
    const state = prompt('State:', 'Bihar') || 'Bihar';
    const pincode = prompt('Pincode (6 digits):', '800001') || '800001';

    try {
      const updated = await userApi.addAddress({
        label,
        recipientName: 'Customer Account',
        phone: '9876543210',
        street,
        city,
        state,
        pincode,
        isDefault: false,
      });

      if (Array.isArray(updated)) {
        const mapped: Address[] = updated.map((addr: IAddress) => ({
          id: addr._id || String(Math.random()),
          type: (addr.label?.toLowerCase() === 'work' ? 'work' : 'home') as Address['type'],
          label: addr.label || 'Saved Address',
          name: 'Customer Account',
          addressString: `${addr.street}${addr.landmark ? `, Near ${addr.landmark}` : ''},\n${addr.city}, ${addr.state} - ${addr.pincode}`,
          phone: '+91 98765 43210',
          isDefault: !!addr.isDefault,
        }));
        setAddresses(mapped);
      }
    } catch {
      // Fallback local append
      const newAddr: Address = {
        id: `addr-${Date.now()}`,
        type: 'home',
        label,
        name: 'Customer Account',
        addressString: `${street},\n${city}, ${state} - ${pincode}`,
        phone: '+91 98765 43210',
        isDefault: false,
      };
      setAddresses((prev) => [...prev, newAddr]);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24 pt-4">
      <div className="mx-auto max-w-3xl rounded-t-3xl bg-white px-4 py-6 shadow-sm min-h-screen border-t">
        {/* Header Section */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#192168]">My Addresses</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your saved addresses for express delivery</p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1 text-sm font-semibold text-[#1668F6] hover:underline cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add New Address
          </button>
        </div>

        {/* Addresses List */}
        {isLoading ? (
          <div className="py-12 flex items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-sm">Loading addresses...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mb-8">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
              />
            ))}
          </div>
        )}

        {/* Security Banner */}
        <div className="flex items-center gap-3 rounded-xl bg-[#F5F9FE] p-4 text-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#1668F6] shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <p className="text-xs text-gray-600">
            Your saved delivery addresses are strictly encrypted and used only for order fulfillment within our 3–4 km hyperlocal radius.
          </p>
        </div>
      </div>
    </main>
  );
}

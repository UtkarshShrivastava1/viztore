'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Check, Edit2, X } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useLocationStore } from '@/stores/location.store';
import { useCheckoutStore, ShippingAddressData } from '@/stores/checkoutStore';
import { userApi } from '@/lib/api/user';
import type { IAddress } from '@repo/shared-types';

export function DeliveryAddressSection() {
  const { user, isAuthenticated } = useAuthStore();
  const { address: locationAddress } = useLocationStore();
  const { shippingAddress, setShippingAddress } = useCheckoutStore();

  const [savedAddresses, setSavedAddresses] = useState<IAddress[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Default initial address setup
  useEffect(() => {
    if (!shippingAddress) {
      setShippingAddress({
        fullName: user?.fullName || 'Customer',
        phone: user?.phone || '9876543210',
        street: locationAddress || '123 Market Street',
        city: 'Local City',
        state: 'State',
        postalCode: '452001',
        country: 'IN',
      });
    }
  }, [user, locationAddress, shippingAddress, setShippingAddress]);

  // Fetch saved user addresses if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      userApi.getAddresses()
        .then((addrs) => {
          if (Array.isArray(addrs)) {
            setSavedAddresses(addrs);
            const defaultAddr = addrs.find((a) => a.isDefault) || addrs[0];
            if (defaultAddr && (!shippingAddress || shippingAddress.fullName === 'Customer')) {
              setShippingAddress({
                fullName: defaultAddr.recipientName || user?.fullName || 'Customer',
                phone: defaultAddr.phone || user?.phone || '9876543210',
                street: `${defaultAddr.street}${defaultAddr.landmark ? `, Near ${defaultAddr.landmark}` : ''}`,
                city: defaultAddr.city,
                state: defaultAddr.state,
                postalCode: defaultAddr.pincode,
                country: 'IN',
              });
            }
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, user]);

  const handleOpenEdit = () => {
    setFullName(shippingAddress?.fullName || user?.fullName || '');
    setPhone(shippingAddress?.phone || user?.phone || '');
    setStreet(shippingAddress?.street || locationAddress || '');
    setCity(shippingAddress?.city || 'Local City');
    setState(shippingAddress?.state || 'State');
    setPostalCode(shippingAddress?.postalCode || '452001');
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSaveCustomAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !street || !postalCode) return;

    const newAddress: ShippingAddressData = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      street: street.trim(),
      city: (city.trim() || 'Local City'),
      state: (state.trim() || 'State'),
      postalCode: postalCode.trim(),
      country: 'IN',
    };

    setShippingAddress(newAddress);
    setIsModalOpen(false);
    setIsEditing(false);
  };

  const handleSelectSaved = (addr: IAddress) => {
    setShippingAddress({
      fullName: addr.recipientName || user?.fullName || 'Customer',
      phone: addr.phone || user?.phone || '9876543210',
      street: `${addr.street}${addr.landmark ? `, Near ${addr.landmark}` : ''}`,
      city: addr.city,
      state: addr.state,
      postalCode: addr.pincode,
      country: 'IN',
    });
    setIsModalOpen(false);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-[#192168]">1. Delivery Address</h2>
        <button 
          type="button" 
          onClick={handleOpenEdit}
          className="text-[11px] font-bold text-[#1668F6] hover:underline flex items-center gap-1"
        >
          <Edit2 className="w-3 h-3" />
          <span>Change</span>
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#1668F6]">
          <MapPin className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-bold text-gray-900">
              {shippingAddress?.fullName || user?.fullName || 'Customer Delivery'}
            </h3>
            <span className="inline-block rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
              Primary
            </span>
          </div>
          <p className="text-[11px] font-medium text-gray-700 mb-1">
            {shippingAddress?.phone || user?.phone || '+91 98765 43210'}
          </p>
          <p className="text-[12px] text-gray-600 leading-snug pr-4">
            {shippingAddress?.street || locationAddress || '123 Commercial Hub, Main Road'}<br />
            {shippingAddress?.city || 'Local City'}, {shippingAddress?.state || 'State'} - {shippingAddress?.postalCode || '452001'}
          </p>
        </div>
      </div>

      {/* Address Picker / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-base font-bold text-[#192168]">
                {isEditing ? 'Delivery Address' : 'Select Delivery Address'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Saved Addresses list */}
            {!isEditing && savedAddresses.length > 0 && (
              <div className="space-y-2 mb-4 max-h-56 overflow-y-auto pr-1">
                {savedAddresses.map((addr, idx) => (
                  <div
                    key={addr._id || `addr-${idx}`}
                    onClick={() => handleSelectSaved(addr)}
                    className="p-3 rounded-xl border border-gray-200 hover:border-[#1668F6] bg-gray-50/50 hover:bg-blue-50/30 cursor-pointer transition flex items-start justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">{addr.recipientName}</span>
                        <span className="text-[10px] font-medium text-gray-500 uppercase">{addr.label}</span>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-1 leading-snug">
                        {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{addr.phone}</p>
                    </div>
                    <div className="h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center shrink-0 mt-1">
                      {shippingAddress?.postalCode === addr.pincode && shippingAddress?.street?.includes(addr.street) && (
                        <Check className="w-3.5 h-3.5 text-[#1668F6]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Form for new/edited address */}
            <form onSubmit={handleSaveCustomAddress} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1668F6]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">10-Digit Mobile Number</label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1668F6]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Street Address / Locality</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="House/Flat No., Street, Landmark"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1668F6]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full px-2 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1668F6]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    className="w-full px-2 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1668F6]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    pattern="[0-9]{6}"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="6 Digits"
                    className="w-full px-2 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1668F6]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 rounded-xl hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#1668F6] hover:bg-blue-700 rounded-xl transition shadow-sm"
                >
                  Save & Use Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

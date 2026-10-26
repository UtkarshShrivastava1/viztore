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
  const { address: locationAddress, city: locationCity, pincode: locationPincode, isSet: isLocationSet } = useLocationStore();
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

  // Fetch saved user addresses if authenticated, or use active GPS if available
  useEffect(() => {
    if (isAuthenticated) {
      userApi.getAddresses()
        .then((addrs) => {
          if (Array.isArray(addrs) && addrs.length > 0) {
            setSavedAddresses(addrs);
            const defaultAddr = addrs.find((a) => a.isDefault) || addrs[0];
            if (defaultAddr && (!shippingAddress?.street || shippingAddress.fullName === 'Customer')) {
              setShippingAddress({
                fullName: defaultAddr.recipientName || user?.fullName || 'Customer',
                phone: defaultAddr.phone || user?.phone || '9876543210',
                street: `${defaultAddr.street}${defaultAddr.landmark ? `, Near ${defaultAddr.landmark}` : ''}`,
                city: defaultAddr.city || locationCity || 'Bhilai',
                state: defaultAddr.state || 'Chhattisgarh',
                postalCode: defaultAddr.pincode || locationPincode || '490006',
                country: 'IN',
              });
              return;
            }
          }
          // If no saved addresses exist on profile, but user has detected GPS location
          if (isLocationSet && locationAddress && !shippingAddress?.street) {
            setShippingAddress({
              fullName: user?.fullName || '',
              phone: user?.phone || '',
              street: locationAddress,
              city: locationCity || 'Bhilai',
              state: 'Chhattisgarh',
              postalCode: locationPincode || '490006',
              country: 'IN',
            });
          }
        })
        .catch(() => {});
    } else if (isLocationSet && locationAddress && !shippingAddress?.street) {
      setShippingAddress({
        fullName: '',
        phone: '',
        street: locationAddress,
        city: locationCity || 'Bhilai',
        state: 'Chhattisgarh',
        postalCode: locationPincode || '490006',
        country: 'IN',
      });
    }
  }, [isAuthenticated, user, isLocationSet, locationAddress, locationCity, locationPincode, shippingAddress?.street, setShippingAddress]);

  const handleOpenEdit = () => {
    setFullName(shippingAddress?.fullName || user?.fullName || '');
    setPhone(shippingAddress?.phone || user?.phone || '');
    setStreet(shippingAddress?.street || (isLocationSet ? locationAddress : ''));
    setCity(shippingAddress?.city && shippingAddress.city !== 'Local City' ? shippingAddress.city : (locationCity || 'Bhilai'));
    setState(shippingAddress?.state && shippingAddress.state !== 'State' ? shippingAddress.state : 'Chhattisgarh');
    setPostalCode(shippingAddress?.postalCode && shippingAddress.postalCode !== '452001' ? shippingAddress.postalCode : (locationPincode || '490006'));
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
      city: city.trim() && city.trim() !== 'Local City' ? city.trim() : (locationCity || 'Bhilai'),
      state: state.trim() && state.trim() !== 'State' ? state.trim() : 'Chhattisgarh',
      postalCode: postalCode.trim() && postalCode.trim() !== '452001' ? postalCode.trim() : (locationPincode || '490006'),
      country: 'IN',
    };

    setShippingAddress(newAddress);
    setIsModalOpen(false);
    setIsEditing(false);

    // Auto-save to customer profile if authenticated
    if (isAuthenticated) {
      userApi.addAddress({
        label: 'Home',
        recipientName: newAddress.fullName,
        phone: newAddress.phone,
        street: newAddress.street,
        city: newAddress.city,
        state: newAddress.state,
        pincode: newAddress.postalCode,
        isDefault: savedAddresses.length === 0,
      }).then((updatedList) => {
        if (Array.isArray(updatedList) && updatedList.length > 0) {
          setSavedAddresses(updatedList);
        }
      }).catch((err) => console.warn('Could not auto-save address to profile:', err));
    }
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

  const hasStreet = Boolean(shippingAddress?.street?.trim());
  const isGpsDetected = isLocationSet && locationAddress && shippingAddress?.street?.includes(locationAddress);
  const isSavedProfileAddress = savedAddresses.some(
    (a) => shippingAddress?.street && shippingAddress.street.includes(a.street)
  );

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-[#192168]">1. Delivery Address</h2>
        {hasStreet ? (
          <button 
            type="button" 
            onClick={handleOpenEdit}
            className="text-[11px] font-bold text-[#1668F6] hover:underline flex items-center gap-1"
          >
            <Edit2 className="w-3 h-3" />
            <span>Change</span>
          </button>
        ) : null}
      </div>

      {!hasStreet ? (
        <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/50 p-4 text-center">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-gray-900 mb-1">No Delivery Address Set</h3>
          <p className="text-[11px] text-gray-600 mb-3 max-w-sm mx-auto">
            Please add your delivery destination to ensure accurate hyperlocal delivery.
          </p>
          <button
            type="button"
            data-testid="add-delivery-address-btn"
            onClick={handleOpenEdit}
            className="px-4 py-2 bg-[#1668F6] text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition shadow-sm inline-flex items-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Add Delivery Address</span>
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#1668F6]">
            <MapPin className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-sm font-bold text-gray-900">
                {shippingAddress?.fullName || user?.fullName || 'Customer Delivery'}
              </h3>
              {isSavedProfileAddress ? (
                <span className="inline-block rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                  Saved Address
                </span>
              ) : isGpsDetected ? (
                <span className="inline-block rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-blue-700">
                  📍 GPS Detected
                </span>
              ) : (
                <span className="inline-block rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[9px] font-bold text-gray-700">
                  Custom
                </span>
              )}
            </div>
            <p className="text-[11px] font-medium text-gray-700 mb-1">
              {shippingAddress?.phone || user?.phone || '+91 98765 43210'}
            </p>
            <p className="text-[12px] text-gray-600 leading-snug pr-4">
              {shippingAddress?.street}<br />
              {(shippingAddress?.city && shippingAddress.city !== 'Local City') ? shippingAddress.city : (locationCity || 'Bhilai')}, {(shippingAddress?.state && shippingAddress.state !== 'State') ? shippingAddress.state : 'Chhattisgarh'} - {(shippingAddress?.postalCode && shippingAddress.postalCode !== '452001') ? shippingAddress.postalCode : (locationPincode || '490006')}
            </p>
          </div>
        </div>
      )}

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
                  <select
                    value={city || 'Bhilai'}
                    onChange={(e) => {
                      const newCity = e.target.value;
                      setCity(newCity);
                      if (!postalCode || postalCode === '490006' || postalCode === '491001') {
                        setPostalCode(newCity === 'Durg' ? '491001' : '490006');
                      }
                    }}
                    className="w-full px-2 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1668F6] bg-white cursor-pointer font-medium"
                  >
                    <option value="Bhilai">Bhilai</option>
                    <option value="Durg">Durg</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1">State</label>
                  <select
                    value={state || 'Chhattisgarh'}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-2 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1668F6] bg-slate-50 cursor-pointer font-medium"
                  >
                    <option value="Chhattisgarh">Chhattisgarh</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    pattern="[0-9]{6}"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="490006"
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

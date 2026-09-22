'use client';

import React from 'react';
import { useCartStore } from '@/stores/cart.store';
import { ShieldCheck, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';

import { FulfillmentPicker } from './FulfillmentPicker';
import { PaymentMethodPicker } from './PaymentMethodPicker';
import { CheckoutOrderSummary } from './CheckoutOrderSummary';
import { useCheckoutStore } from '@/stores/checkoutStore';

export function CheckoutView() {
  const { items } = useCartStore();
  const { fulfillmentType } = useCheckoutStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500">Your cart is empty.</p>
        <Link href="/" className="mt-4 rounded-lg bg-indigo-600 px-6 py-2 text-white font-medium">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start mt-6">
      <div className="flex-1 w-full pb-20 lg:pb-0">
        {/* Secure Banner */}
        {fulfillmentType === 'reserve' ? (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-4 py-2.5 text-xs font-bold text-green-700 shadow-sm">
            <Calendar className="h-4 w-4 shrink-0" />
            Reserve your order now! Pay later at the time of pickup or delivery.
          </div>
        ) : (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 shadow-sm">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            Shop with confidence! Your order is 100% safe and secure.
          </div>
        )}

        {/* 1. Delivery Address (Placeholder for DeliveryAddressCard) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#192168]">1. Delivery Address</h2>
            <button type="button" className="text-[11px] font-bold text-[#1668F6] hover:underline">
              Change
            </button>
          </div>
          <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm flex items-start gap-3">
             <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#1668F6]">
                <MapPin className="h-4 w-4" />
             </div>
             <div>
                <h3 className="text-sm font-bold text-gray-900 mb-0.5">Harish Kumar</h3>
                <p className="text-[11px] font-medium text-gray-700 mb-1">+91 98765 43210</p>
                <p className="text-[12px] text-gray-600 leading-snug pr-4 mb-2">123, MG Road, Near City Mall<br/>Indore, Madhya Pradesh - 452001</p>
                <span className="inline-block rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                  Home
                </span>
             </div>
          </div>
        </div>

        {/* 2. Delivery Options */}
        <FulfillmentPicker />

        {/* 3. Payment Methods */}
        <PaymentMethodPicker />
      </div>

      {/* Right Column: Order Summary */}
      <CheckoutOrderSummary />
    </div>
  );
}

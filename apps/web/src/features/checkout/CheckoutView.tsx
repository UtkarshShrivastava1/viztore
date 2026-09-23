'use client';

import React from 'react';
import { useCartStore } from '@/stores/cart.store';
import { ShieldCheck, Calendar, RotateCcw, CheckCircle } from 'lucide-react';
import Link from 'next/link';

import { DeliveryAddressSection } from './DeliveryAddressSection';
import { FulfillmentPicker } from './FulfillmentPicker';
import { PaymentMethodPicker } from './PaymentMethodPicker';
import { CheckoutOrderSummary } from './CheckoutOrderSummary';
import { CheckoutPriceDetails } from './CheckoutPriceDetails';
import { useCheckoutStore } from '@/stores/checkoutStore';

export function CheckoutView({ storeId }: { storeId?: string }) {
  const { items } = useCartStore();
  const { fulfillmentType } = useCheckoutStore();

  const checkoutItems = storeId ? items.filter(item => item.storeId === storeId) : items;

  if (checkoutItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500">Your cart for this order is empty.</p>
        <Link href="/" className="mt-4 rounded-lg bg-[#1668F6] px-6 py-2 text-white font-medium">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start mt-6">
      <div className="flex-1 w-full lg:pb-0">
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

        {/* 1. Delivery Address */}
        <DeliveryAddressSection />

        {/* 2. Delivery Options */}
        <FulfillmentPicker />

        {/* 3. Payment Methods */}
        <PaymentMethodPicker />

        {/* Trust Badges */}
        <div className="flex justify-between items-center bg-gray-50 rounded-xl p-4 border border-gray-100 mt-6 lg:mt-8 hidden lg:flex">
          <TrustBadge icon={<ShieldCheck className="h-4 w-4 text-emerald-500" />} title="Secure Payments" desc="100% Secure" />
          <TrustBadge icon={<RotateCcw className="h-4 w-4 text-[#1668F6]" />} title="Easy Returns" desc="7 Days Return" />
          <TrustBadge icon={<CheckCircle className="h-4 w-4 text-[#1668F6]" />} title="Top Quality" desc="Trusted Products" />
        </div>
      </div>

      {/* Right Column: Order Summary & Price Details */}
      <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-24 flex flex-col gap-4">
        <CheckoutOrderSummary storeId={storeId} />
        <CheckoutPriceDetails storeId={storeId} />
      </div>
    </div>
  );
}

function TrustBadge({ icon, title, desc }: any) {
  return (
    <div className="flex flex-col items-center text-center gap-1">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
        {icon}
      </div>
      <div>
        <h5 className="text-[9px] font-bold text-gray-900 leading-tight">{title}</h5>
        <p className="text-[8px] text-gray-500 leading-tight">{desc}</p>
      </div>
    </div>
  );
}

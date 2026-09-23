'use client';

import React from 'react';
import { useCartStore } from '@/stores/cart.store';
import { CartPriceDetails } from './CartPriceDetails';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CartView() {
  const router = useRouter();
  const { items, getItemCount, getSubtotal } = useCartStore();

  const totalItemCount = getItemCount();
  const subtotal = getSubtotal();

  const totalMrp = items.reduce((sum, item) => sum + Math.round(item.unitPrice * 1.15) * item.quantity, 0);
  const discountOnMrp = totalMrp - subtotal;

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
      <div className="flex-1 w-full">
        {/* Savings Banner */}
        {discountOnMrp > 0 && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            You're saving ₹{discountOnMrp} on this order!
          </div>
        )}

        {/* Cart Items Area - Placeholder for CartSingleStoreView/CartMultiStoreView */}
        <div className="mb-6 flex flex-col gap-4">
          <p className="text-gray-500">Cart items will be displayed here.</p>
        </div>
      </div>

      {/* Right Column: Order Summary & Checkout */}
      <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-24">
        <CartPriceDetails onCheckout={() => router.push('/checkout')} />
      </div>

      {/* Sticky Checkout Button (Mobile Only) */}
      <div className="lg:hidden fixed bottom-[72px] left-0 right-0 z-40 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:bottom-0">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => router.push('/checkout')}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1668F6] py-3.5 text-base font-bold text-white shadow-md hover:bg-blue-700 transition"
          >
            Proceed to Checkout
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

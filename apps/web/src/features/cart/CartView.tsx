'use client';

import React from 'react';
import { useCartStore } from '@/stores/cart.store';
import Link from 'next/link';
import { StoreCartView } from './StoreCartView';

export function CartView() {
  const { items } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-[#1668F6] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          🛒
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Your cart is empty</h2>
        <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
          Explore products from top local verified shops near your area and add them to your cart.
        </p>
        <Link
          href="/products"
          className="rounded-xl bg-[#1668F6] px-6 py-2.5 text-white font-semibold text-sm hover:bg-blue-700 transition shadow-sm"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  // Under Section 4.4 single-store invariant, all active cart items belong to a single store
  const activeStoreId = items[0].storeId;
  return <StoreCartView storeId={activeStoreId} />;
}

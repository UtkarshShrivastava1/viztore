import React from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export function OrderSuccessView() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mb-6 text-green-500">
        <CheckCircle2 className="h-16 w-16" />
      </div>
      <h1 className="text-2xl font-bold text-[#192168] mb-2">Order Placed Successfully!</h1>
      <p className="text-gray-500 mb-6">Your order #ORD-10045 has been confirmed.</p>
      
      <div className="flex gap-4">
        <Link 
          href="/account/orders/ORD-10045"
          className="rounded-xl bg-[#1668F6] px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 transition"
        >
          Track Order
        </Link>
        <Link 
          href="/"
          className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

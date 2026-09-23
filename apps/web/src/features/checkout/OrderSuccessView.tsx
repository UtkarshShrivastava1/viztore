'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, PackageCheck, ArrowRight } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const orderNumber = searchParams.get('orderNumber');

  const displayOrderNumber = orderNumber
    ? (orderNumber.startsWith('#') ? orderNumber : `#${orderNumber}`)
    : orderId
    ? (orderId.startsWith('#') ? orderId : `#ORD-${orderId.slice(-6).toUpperCase()}`)
    : '#ORD-10045';

  const trackHref = orderId ? `/account/orders/${orderId}` : '/account/orders';

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 shadow-sm border border-emerald-100 animate-in zoom-in-95 duration-200">
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#192168] mb-2">Order Placed Successfully!</h1>
      <p className="text-gray-500 mb-6 max-w-md text-sm">
        Your order <span className="font-bold text-gray-900">{displayOrderNumber}</span> has been confirmed and forwarded to the local merchant store.
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link 
          href={trackHref}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1668F6] px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 transition shadow-sm"
        >
          <PackageCheck className="w-4 h-4" />
          <span>Track Order</span>
        </Link>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export function OrderSuccessView() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-gray-500">Loading order details...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}

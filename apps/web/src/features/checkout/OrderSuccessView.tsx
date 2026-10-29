'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, PackageCheck, ArrowRight, Calendar, Copy, Check } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const orderNumber = searchParams.get('orderNumber');

  const isReserve = (orderNumber && orderNumber.toUpperCase().includes('RES-')) || false;
  const [copied, setCopied] = React.useState(false);

  const displayOrderNumber = orderNumber
    ? (orderNumber.startsWith('#') ? orderNumber : `#${orderNumber}`)
    : orderId
    ? (orderId.startsWith('#') ? orderId : (isReserve ? `#RES-${orderId.slice(-5).toUpperCase()}` : `#ORD-${orderId.slice(-6).toUpperCase()}`))
    : '#ORD-10045';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(displayOrderNumber.replace('#', ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const trackHref = orderId ? `/account/orders/${orderId}` : '/account/orders';

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      {isReserve ? (
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-200 animate-in zoom-in-95 duration-200">
          <Calendar className="h-10 w-10 text-indigo-600" />
        </div>
      ) : (
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 shadow-sm border border-emerald-100 animate-in zoom-in-95 duration-200">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
      )}

      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#192168] mb-2">
        {isReserve ? 'Reservation Confirmed! 🛍️' : 'Order Placed Successfully!'}
      </h1>

      <p className="text-gray-500 mb-6 max-w-md text-sm">
        {isReserve ? (
          <>
            Your in-store reservation <span className="font-bold text-indigo-600">{displayOrderNumber}</span> is active and held exclusively for you.
          </>
        ) : (
          <>
            Your order <span className="font-bold text-gray-900">{displayOrderNumber}</span> has been confirmed and forwarded to the local merchant store.
          </>
        )}
      </p>

      {isReserve && (
        <div className="mb-8 w-full max-w-md rounded-2xl border border-indigo-200 bg-gradient-to-b from-indigo-50/80 to-white p-5 text-left shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-indigo-900 uppercase tracking-wider">Reserve Code</span>
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700">
              2-Hour In-Store Hold
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-white border border-indigo-100 p-3 shadow-2xs mb-3">
            <span className="font-mono text-xl font-extrabold text-indigo-900 tracking-wide">{displayOrderNumber}</span>
            <button
              onClick={handleCopyCode}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            ⏱️ <strong>Hold Instructions:</strong> Your items will be held at the store counter for the next <strong>2 hours</strong>. Please visit the store, show this Reserve Code to the storekeeper, inspect your items, and pay at the counter.
          </p>
        </div>
      )}
      
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

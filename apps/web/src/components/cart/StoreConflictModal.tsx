'use client';

import React from 'react';
import { useCartStore } from '@/stores/cart.store';
import { Store, AlertTriangle, ArrowRight, X } from 'lucide-react';

export const StoreConflictModal: React.FC = () => {
  const { storeConflict, resolveStoreConflict } = useCartStore();

  if (!storeConflict) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => resolveStoreConflict(false)}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => resolveStoreConflict(false)}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          title="Cancel"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Warning Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              Replace cart items?
            </h3>
            <span className="text-xs text-amber-600 font-semibold flex items-center gap-1 mt-0.5">
              <AlertTriangle className="h-3 w-3" />
              Single-Store Delivery Rule
            </span>
          </div>
        </div>

        {/* Description Body */}
        <div className="mt-4 text-xs text-slate-600 leading-relaxed space-y-2">
          <p>
            Your cart already contains items from{' '}
            <strong className="text-slate-900 font-semibold">{storeConflict.existingStoreName}</strong>.
          </p>
          <p>
            Hyperlocal delivery fulfills orders from a single store at a time. Would you like to clear your existing cart to add items from{' '}
            <strong className="text-blue-600 font-semibold">{storeConflict.newStoreName}</strong>?
          </p>
        </div>

        {/* Pending Item Preview Chip */}
        <div className="mt-3.5 flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-200/80">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {storeConflict.pendingItem.imageUrl ? (
              <img
                src={storeConflict.pendingItem.imageUrl}
                alt={storeConflict.pendingItem.name}
                className="h-9 w-9 rounded-lg object-cover shrink-0 border border-slate-200"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 font-bold text-xs">
                {storeConflict.pendingItem.name.slice(0, 1)}
              </div>
            )}
            <div className="truncate">
              <p className="truncate text-xs font-semibold text-slate-800">
                {storeConflict.pendingItem.name}
              </p>
              <p className="text-[11px] font-bold text-slate-600">
                ₹{storeConflict.pendingItem.unitPrice.toLocaleString('en-IN')} × {storeConflict.pendingQuantity}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => resolveStoreConflict(false)}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Keep Existing Cart
          </button>
          <button
            type="button"
            onClick={() => resolveStoreConflict(true)}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>Clear & Add</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

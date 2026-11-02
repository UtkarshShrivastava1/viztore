'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { ordersApi } from '@/lib/api/orders.js';
import type { IOrder } from '@repo/shared-types';

interface CustomerCancelOrderModalProps {
  orderId: string;
  orderNumber: string;
  expectedVersion?: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedOrder: IOrder) => void;
}

const CANCELLATION_REASONS = [
  'Ordered by mistake',
  'Need to change delivery address',
  'Delivery time is longer than expected',
  'Found a better price or alternative locally',
  'Decided to purchase in-store instead',
  'Other reasons',
];

export function CustomerCancelOrderModal({
  orderId,
  orderNumber,
  expectedVersion,
  isOpen,
  onClose,
  onSuccess,
}: CustomerCancelOrderModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>(CANCELLATION_REASONS[0]);
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const fullReason = additionalNotes.trim()
        ? `${selectedReason}: ${additionalNotes.trim()}`
        : selectedReason;

      const updated = await ordersApi.cancelOrder(orderId, fullReason, expectedVersion);
      onSuccess(updated);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to cancel order. It may have already been packed or dispatched.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-6 overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2 text-rose-600">
            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Cancel Order</h3>
              <p className="text-[11px] text-gray-500 font-medium">Order {orderNumber}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Please tell us why you want to cancel:
            </label>
            <div className="space-y-2">
              {CANCELLATION_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                    selectedReason === reason
                      ? 'border-[#1668F6] bg-blue-50/50 font-bold text-blue-900'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700 font-medium'
                  }`}
                >
                  <input
                    type="radio"
                    name="cancellationReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="w-4 h-4 text-[#1668F6] focus:ring-[#1668F6] border-gray-300"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              Additional Details (Optional)
            </label>
            <textarea
              rows={2}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Provide any additional comments to help us improve..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1668F6] resize-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-800 leading-snug">
            <strong>Note:</strong> Cancellation is irreversible. If prepaid online, your full payment will be refunded to your original payment method.
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold text-gray-600 rounded-xl hover:bg-gray-100 transition cursor-pointer"
            >
              Keep Order
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Cancelling...</span>
                </>
              ) : (
                <span>Confirm Cancellation</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { X, RotateCcw, CheckCircle2, AlertCircle, Loader2, Package } from 'lucide-react';
import { returnsApi } from '@/lib/api/returns.js';
import type { IOrder, IOrderItem } from '@repo/shared-types';

interface CustomerReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: IOrder | null;
}

const RETURN_REASONS = [
  'Size / Fit issue',
  'Damaged or broken product',
  'Defective or not functioning',
  'Wrong item delivered',
  'Quality not as expected',
  'Item no longer needed',
  'Other',
];

export const CustomerReturnModal: React.FC<CustomerReturnModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const [returnType, setReturnType] = useState<'Return' | 'Exchange'>('Return');
  const [reason, setReason] = useState(RETURN_REASONS[0]);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedReturnNumber, setSubmittedReturnNumber] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const firstItem: IOrderItem | undefined = order.items?.[0];
  const itemPrice = firstItem ? firstItem.unitPrice * firstItem.quantity : order.grandTotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        orderId: order.id || (order as any)._id,
        orderNumber: order.orderNumber || (order.id ? `#${order.id.slice(-6).toUpperCase()}` : '#ORD-10025'),
        storeId: order.storeId,
        returnType,
        reason,
        amount: itemPrice,
        customer: {
          name: order.shippingAddress?.fullName || 'Customer',
          phone: order.shippingAddress?.phone || '9876543210',
          address: order.shippingAddress
            ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}`
            : 'Delivery Address',
        },
        product: {
          productId: firstItem?.productId,
          name: firstItem?.name || 'Delivered Store Item',
          variant: 'Standard',
          sku: firstItem?.sku || 'SKU-001',
          price: itemPrice,
          quantity: firstItem?.quantity || 1,
          returnQuantity: firstItem?.quantity || 1,
        },
        refundMethod: 'Original Payment',
        comments,
      };

      const res = await returnsApi.requestReturn(payload);
      setSubmittedReturnNumber((res as any)?.returnNumber || 'RTN-PENDING');
    } catch (err: any) {
      setError(err?.message || 'Failed to submit return request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Request Return / Exchange</h3>
              <p className="text-xs text-slate-500">
                Order #{order.orderNumber || order.id?.slice(-6).toUpperCase()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {submittedReturnNumber ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-extrabold text-slate-900">Return Request Received!</h4>
              <p className="text-xs text-slate-500 mt-1">
                Your request <span className="font-bold text-slate-900">#{submittedReturnNumber}</span> has been transmitted to the store partner.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs text-slate-600 text-left space-y-2">
              <p className="font-semibold text-slate-900">What happens next?</p>
              <p>1. The store partner will review and approve your return within 24 hours.</p>
              <p>2. A pickup agent will be assigned to collect the product from your address.</p>
              <p>3. Your refund of ₹{itemPrice.toLocaleString('en-IN')} will be credited automatically upon pickup verification.</p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Product Snapshot */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 text-xs">
                <p className="font-bold text-slate-900 truncate">
                  {firstItem?.name || 'Delivered Store Item'}
                </p>
                <p className="text-slate-500 mt-0.5">
                  Qty: {firstItem?.quantity || 1} • Amount: ₹{itemPrice.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Return Type Segment */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Action Requested</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setReturnType('Return')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                    returnType === 'Return'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Return & Refund
                </button>
                <button
                  type="button"
                  onClick={() => setReturnType('Exchange')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                    returnType === 'Exchange'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Exchange Size / Item
                </button>
              </div>
            </div>

            {/* Reason Select */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Reason for Return</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {RETURN_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Comments */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Additional Comments (Optional)
              </label>
              <textarea
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Describe any issues with the item..."
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{submitting ? 'Submitting...' : 'Submit Request'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};


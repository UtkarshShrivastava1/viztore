import React from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Package,
  Calendar,
  Clock,
  Printer,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { useReturnsStore, ReturnRecord } from '../../stores/returnsStore.js';

interface ReturnDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  returnRecord: ReturnRecord | null;
  onOpenSlipModal: () => void;
}

export const ReturnDetailsDrawer: React.FC<ReturnDetailsDrawerProps> = ({
  isOpen,
  onClose,
  returnRecord,
  onOpenSlipModal,
}) => {
  const {
    approveReturn,
    initiateRefund,
    markAsRefunded,
    setIsRejectModalOpen,
    setReturnToReject,
  } = useReturnsStore();

  if (!isOpen || !returnRecord) return null;

  const getStatusBadge = (status: ReturnRecord['status']) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Pending
          </span>
        );
      case 'Approved':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Approved
          </span>
        );
      case 'Exchange Initiated':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Exchange Initiated
          </span>
        );
      case 'Refunded':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
            Refunded
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const drawerContent = (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col h-screen animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-black text-slate-900">
                  {returnRecord.returnNumber}
                </h2>
                {getStatusBadge(returnRecord.status)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Order {returnRecord.orderNumber} &bull; Created on {returnRecord.returnDate}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Bar */}
          <div className="px-5 py-3 border-b border-slate-100 bg-white flex flex-wrap items-center gap-2">
            {returnRecord.status === 'Pending' && (
              <>
                <button
                  onClick={() => approveReturn(returnRecord.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>

                <button
                  onClick={() => {
                    setReturnToReject(returnRecord);
                    setIsRejectModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </>
            )}

            {returnRecord.status === 'Approved' && (
              <button
                onClick={() => initiateRefund(returnRecord.id)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Process Refund (₹ {returnRecord.refundAmount})</span>
              </button>
            )}

            <button
              onClick={onOpenSlipModal}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors ml-auto shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print RMA Slip</span>
            </button>
          </div>

          {/* Drawer Body Scrollable */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Customer Details */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Customer Details
              </span>
              <p className="font-bold text-slate-900 text-sm">{returnRecord.customer.name}</p>
              <p className="text-xs text-slate-600">{returnRecord.customer.email}</p>
              <p className="text-xs text-slate-600">{returnRecord.customer.phone}</p>
              <p className="text-xs text-slate-500 mt-1">{returnRecord.customer.address || '-'}</p>
            </div>

            {/* Product Details */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Item Being Returned
              </span>
              <div className="flex items-center gap-3">
                <img
                  src={returnRecord.product.imageUrl}
                  alt={returnRecord.product.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900 text-sm truncate">
                    {returnRecord.product.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    Variant: {returnRecord.product.variant} &bull; SKU: {returnRecord.product.sku}
                  </p>
                  <p className="text-xs font-semibold text-slate-800 mt-1">
                    Qty: {returnRecord.product.returnQuantity || 1} &bull; Price: ₹{' '}
                    {returnRecord.product.price}
                  </p>
                </div>
              </div>
            </div>

            {/* Return Reason & Notes */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Return Reason
              </span>
              <p className="font-semibold text-slate-800 text-xs">{returnRecord.reason}</p>
              {returnRecord.comments && (
                <div className="mt-2 p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600">
                  <span className="font-semibold text-slate-700 block mb-1">Customer Note:</span>
                  <p>"{returnRecord.comments}"</p>
                </div>
              )}
            </div>

            {/* Pickup Schedule */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Pickup Schedule
              </span>
              <div className="flex items-center gap-4 text-slate-700 text-xs">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold">{returnRecord.pickupDate || '19 May 2024'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold">{returnRecord.pickupTime || '10:00 AM - 01:00 PM'}</span>
                </div>
              </div>
              <p className="text-slate-500 text-[11px]">
                Address: {returnRecord.pickupAddress || returnRecord.customer.address || '-'}
              </p>
            </div>

            {/* Quality Inspection Checklist */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900">
                  RMA Quality Inspection Checklist
                </span>
              </div>

              <div className="space-y-2 text-slate-600 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Product packaging original and intact</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>No visible usage marks, tears or stains</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Tags, labels, and warranty seals verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">
              Refund Amount: <span className="font-bold text-slate-900">₹ {returnRecord.amount}</span>
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
};

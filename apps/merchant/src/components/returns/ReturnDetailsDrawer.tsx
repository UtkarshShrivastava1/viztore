import React from 'react';
import {
  X,
  Package,
  Calendar,
  Clock,
  Printer,
  CheckCircle2,
  XCircle,
  RotateCcw,
  CheckSquare,
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
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
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
                  className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 flex items-center gap-1.5 transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </>
            )}

            {returnRecord.status === 'Approved' && (
              <button
                onClick={() => initiateRefund(returnRecord.id)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Initiate Refund</span>
              </button>
            )}

            {returnRecord.status !== 'Refunded' && returnRecord.status !== 'Rejected' && (
              <button
                onClick={() => markAsRefunded(returnRecord.id)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <CheckSquare className="w-3.5 h-3.5 text-slate-600" />
                <span>Mark Refunded</span>
              </button>
            )}

            <button
              onClick={onOpenSlipModal}
              className="ml-auto px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Return Slip</span>
            </button>
          </div>

          {/* Drawer Body Scrollable */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
            {/* Customer Information */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Customer Details
              </span>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900">
                  {returnRecord.customer.name}
                </p>
                <p className="text-slate-600">{returnRecord.customer.email}</p>
                <p className="text-slate-600">{returnRecord.customer.phone}</p>
                <p className="text-slate-500 pt-1 border-t border-slate-200/60 mt-2">
                  {returnRecord.customer.address}
                </p>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Item & Return Quantity
              </span>

              <div className="flex items-center gap-3">
                <img
                  src={returnRecord.product.imageUrl}
                  alt={returnRecord.product.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">
                    {returnRecord.product.name}
                  </p>
                  <p className="text-slate-500">Variant: {returnRecord.product.variant}</p>
                  <p className="text-slate-400 text-[11px]">
                    SKU: {returnRecord.product.sku}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-500">
                    Qty: {returnRecord.product.returnQuantity} of {returnRecord.product.quantity}
                  </p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">
                    ₹ {returnRecord.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            {/* Return & Refund Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                  Return Type
                </span>
                <p className="font-bold text-slate-900">{returnRecord.returnType}</p>
              </div>

              <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                  Reason for Return
                </span>
                <p className="font-bold text-slate-900">{returnRecord.reason}</p>
              </div>

              <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                  Refund Method
                </span>
                <p className="font-bold text-slate-900">{returnRecord.refundMethod}</p>
              </div>

              <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                  Total Refund
                </span>
                <p className="font-bold text-slate-900 text-sm">
                  ₹ {returnRecord.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Pickup Schedule */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Pickup Schedule
              </span>
              <div className="flex items-center gap-4 text-slate-700">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold">{returnRecord.pickupDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold">{returnRecord.pickupTime}</span>
                </div>
              </div>
              <p className="text-slate-500 text-[11px]">
                Address: {returnRecord.pickupAddress}
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

              <div className="space-y-2 text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Item condition checked against original dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Brand security tag & labels intact</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Original box & packaging included</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>No unwashed odor, stains, or fabric tear</span>
                </div>
              </div>
            </div>

            {/* Customer & Merchant Notes */}
            {returnRecord.comments && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Customer Comments
                </span>
                <p className="text-slate-700 italic">"{returnRecord.comments}"</p>
              </div>
            )}

            {returnRecord.rejectionReason && (
              <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200">
                <span className="text-[10px] font-semibold text-rose-500 uppercase tracking-wider block mb-1">
                  Rejection Reason
                </span>
                <p className="text-rose-700 font-medium">{returnRecord.rejectionReason}</p>
              </div>
            )}

            {returnRecord.internalNote && (
              <div className="p-3.5 bg-blue-50/40 rounded-xl border border-blue-200">
                <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider block mb-1">
                  Internal Staff Note
                </span>
                <p className="text-slate-700">{returnRecord.internalNote}</p>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-2xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, ShoppingBag, MessageSquareText, ExternalLink } from 'lucide-react';
import { ReturnRecord } from '../../stores/returnsStore.js';

interface ReturnDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  returnRecord: ReturnRecord | null;
}

export const ReturnDetailsModal: React.FC<ReturnDetailsModalProps> = ({
  isOpen,
  onClose,
  returnRecord,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !returnRecord) return null;

  const getStatusBadge = (status: ReturnRecord['status']) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Pending
          </span>
        );
      case 'Approved':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Approved
          </span>
        );
      case 'Refunded':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Refunded
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  // Determine active step index
  // 1: Requested, 2: Under Review, 3: Approved, 4: Refunded
  let currentStep = 1;
  if (returnRecord.status === 'Approved') currentStep = 3;
  if (returnRecord.status === 'Refunded') currentStep = 4;

  const steps = [
    { number: 1, label: 'Return Requested', time: `${returnRecord.returnDate}, ${returnRecord.returnTime || '10:30 AM'}` },
    { number: 2, label: 'Under Review', time: currentStep >= 2 ? 'In Review' : '--' },
    { number: 3, label: 'Approved', time: currentStep >= 3 ? 'Completed' : '--' },
    { number: 4, label: 'Refunded', time: currentStep >= 4 ? 'Processed' : '--' },
  ];

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Return Details
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              View complete details of this return request.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[calc(85vh-130px)] overflow-y-auto">
          {/* Top Return Strip */}
          <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Return ID
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-bold text-slate-900 text-sm">
                  {returnRecord.returnNumber}
                </span>
                {getStatusBadge(returnRecord.status)}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Requested on {returnRecord.returnDate}, {returnRecord.returnTime || '10:30 AM'}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Order ID
              </span>
              <p className="font-bold text-slate-900 text-sm mt-1">
                {returnRecord.orderNumber}
              </p>
              <button
                onClick={() => alert(`Navigating to order ${returnRecord.orderNumber}`)}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 mt-0.5"
              >
                <span>View Order</span>
                <span className="text-xs">&rarr;</span>
              </button>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Return Type
              </span>
              <p className="font-bold text-slate-900 text-sm mt-1">
                {returnRecord.returnType}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Reason
              </span>
              <p className="font-bold text-slate-900 text-sm mt-1">
                {returnRecord.reason}
              </p>
            </div>
          </div>

          {/* Stepper matching 9.1.png */}
          <div className="p-4 bg-white rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between relative">
              {/* Stepper connecting line */}
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

              {steps.map((s, idx) => {
                const isPassed = s.number <= currentStep;
                return (
                  <div key={idx} className="flex flex-col items-center text-center relative z-10 w-1/4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                        isPassed
                          ? 'bg-blue-600 text-white ring-4 ring-blue-50'
                          : 'bg-white text-slate-400 border-2 border-slate-300'
                      }`}
                    >
                      {s.number}
                    </div>
                    <span
                      className={`text-xs mt-2 font-semibold ${
                        isPassed ? 'text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      {s.label}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      {s.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2 Information Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Information */}
            <div className="p-4 bg-white rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold text-xs">
                <User className="w-4 h-4 text-blue-600" />
                <span>Customer Information</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Name</span>
                  <span className="font-semibold text-slate-900">
                    {returnRecord.customer.name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Email</span>
                  <span className="font-semibold text-slate-900">
                    {returnRecord.customer.email}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Phone</span>
                  <span className="font-semibold text-slate-900">
                    {returnRecord.customer.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Return Summary */}
            <div className="p-4 bg-white rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold text-xs">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
                <span>Return Summary</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Total Items</span>
                  <span className="font-semibold text-slate-900">
                    {returnRecord.product.quantity}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Return Amount</span>
                  <span className="font-bold text-slate-900">
                    ₹ {returnRecord.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Refund Status</span>
                  {getStatusBadge(returnRecord.status)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Refund Method</span>
                  <span className="font-semibold text-slate-900">
                    {returnRecord.refundMethod}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Returned Items Table */}
          <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-200/80">
              <h4 className="text-xs font-bold text-slate-900">Returned Items</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-500 bg-slate-50/30">
                    <th className="py-2.5 px-4">Product</th>
                    <th className="py-2.5 px-3">Variant</th>
                    <th className="py-2.5 px-3">Price</th>
                    <th className="py-2.5 px-3">Qty</th>
                    <th className="py-2.5 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={returnRecord.product.imageUrl}
                          alt={returnRecord.product.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 bg-slate-100 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">
                            {returnRecord.product.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            SKU: {returnRecord.product.sku}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {returnRecord.product.variant}
                    </td>
                    <td className="py-3 px-3 text-slate-900 font-medium">
                      ₹ {returnRecord.product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-slate-900 font-medium">
                      {returnRecord.product.quantity}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      ₹ {returnRecord.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Note */}
          <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
              <MessageSquareText className="w-4 h-4 text-blue-600" />
              <span>Customer Note</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700">
              <p>"{returnRecord.comments || 'No customer note provided.'}"</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

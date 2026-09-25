import React from 'react';
import { X, Printer, CheckSquare } from 'lucide-react';
import { ReturnRecord } from '../../stores/returnsStore.js';
import { branding } from '../../lib/branding.js';

interface ReturnSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  returnRecord: ReturnRecord | null;
}

export const ReturnSlipModal: React.FC<ReturnSlipModalProps> = ({
  isOpen,
  onClose,
  returnRecord,
}) => {
  if (!isOpen || !returnRecord) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-200">
        {/* Header Actions (hidden in print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Printable Return Slip (RMA)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Return Slip Content */}
        <div className="mt-4 border border-slate-300 rounded-xl p-6 bg-white text-slate-800 text-xs space-y-5">
          {/* Slip Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {branding.appName}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Merchant Fulfillment Center &bull; Reverse Logistics
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Return Merchandise Authorization (RMA)
              </p>
            </div>

            {/* Barcode Visualization */}
            <div className="flex flex-col items-end">
              <svg className="w-40 h-10" viewBox="0 0 160 40">
                <rect x="0" y="0" width="4" height="32" fill="#0f172a" />
                <rect x="6" y="0" width="2" height="32" fill="#0f172a" />
                <rect x="10" y="0" width="6" height="32" fill="#0f172a" />
                <rect x="18" y="0" width="3" height="32" fill="#0f172a" />
                <rect x="23" y="0" width="5" height="32" fill="#0f172a" />
                <rect x="30" y="0" width="2" height="32" fill="#0f172a" />
                <rect x="34" y="0" width="6" height="32" fill="#0f172a" />
                <rect x="42" y="0" width="4" height="32" fill="#0f172a" />
                <rect x="48" y="0" width="3" height="32" fill="#0f172a" />
                <rect x="53" y="0" width="5" height="32" fill="#0f172a" />
                <rect x="60" y="0" width="2" height="32" fill="#0f172a" />
                <rect x="64" y="0" width="6" height="32" fill="#0f172a" />
                <rect x="72" y="0" width="3" height="32" fill="#0f172a" />
                <rect x="77" y="0" width="6" height="32" fill="#0f172a" />
                <rect x="85" y="0" width="4" height="32" fill="#0f172a" />
                <rect x="91" y="0" width="2" height="32" fill="#0f172a" />
                <rect x="95" y="0" width="5" height="32" fill="#0f172a" />
                <rect x="102" y="0" width="4" height="32" fill="#0f172a" />
                <rect x="108" y="0" width="3" height="32" fill="#0f172a" />
                <rect x="113" y="0" width="5" height="32" fill="#0f172a" />
                <rect x="120" y="0" width="2" height="32" fill="#0f172a" />
                <rect x="124" y="0" width="6" height="32" fill="#0f172a" />
                <rect x="132" y="0" width="4" height="32" fill="#0f172a" />
                <rect x="138" y="0" width="3" height="32" fill="#0f172a" />
                <rect x="143" y="0" width="5" height="32" fill="#0f172a" />
                <rect x="150" y="0" width="3" height="32" fill="#0f172a" />
                <rect x="155" y="0" width="5" height="32" fill="#0f172a" />
              </svg>
              <span className="text-[10px] font-mono tracking-widest text-slate-600 mt-1">
                {returnRecord.returnNumber}
              </span>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Order & RMA Details
              </span>
              <p>
                <span className="font-semibold text-slate-600">RMA Number:</span>{' '}
                <span className="font-bold text-slate-900">{returnRecord.returnNumber}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-600">Order ID:</span>{' '}
                <span className="font-bold text-slate-900">{returnRecord.orderNumber}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-600">Date Issued:</span>{' '}
                {returnRecord.returnDate}
              </p>
              <p>
                <span className="font-semibold text-slate-600">Status:</span>{' '}
                <span className="font-semibold uppercase text-slate-800">
                  {returnRecord.status}
                </span>
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Pickup Address & Customer
              </span>
              <p className="font-bold text-slate-900">{returnRecord.customer.name}</p>
              <p className="text-slate-600">{returnRecord.customer.phone}</p>
              <p className="text-slate-600 leading-tight">
                {returnRecord.customer.address}
              </p>
            </div>
          </div>

          {/* Product Items Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[10px] uppercase">
                  <th className="py-2 px-3">Item Description</th>
                  <th className="py-2 px-3">SKU / Variant</th>
                  <th className="py-2 px-3 text-center">Qty</th>
                  <th className="py-2 px-3">Reason</th>
                  <th className="py-2 px-3 text-right">Refund Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    {returnRecord.product.name}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {returnRecord.product.sku} ({returnRecord.product.variant})
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                    {returnRecord.product.returnQuantity}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{returnRecord.reason}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                    ₹ {returnRecord.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Warehouse Inspection Checklist Form */}
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 space-y-2">
            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
              Inward Warehouse Quality Verification (Official Use Only)
            </span>
            <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                <span>Original Packaging [ ]</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                <span>Tags & Seals Intact [ ]</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                <span>No Physical Wear [ ]</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-end text-[10px] text-slate-500">
              <div>
                <span>Inspected By: ___________________</span>
              </div>
              <div>
                <span>Signature & Stamp: ___________________</span>
              </div>
            </div>
          </div>

          {/* Courier Instructions */}
          <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-3">
            <p>
              Note: This RMA document must accompany the returned package. The runner/courier
              partner will verify the package seal before dispatching to the central return warehouse.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

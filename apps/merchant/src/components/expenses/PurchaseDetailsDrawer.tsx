import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Edit2,
  Download,
  ChevronDown,
  Building,
  FileText,
  Printer,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

import { useBodyScrollLock } from '../../hooks/useBodyScrollLock.js';

interface PurchaseDetailsDrawerProps {
  purchase: any | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export const PurchaseDetailsDrawer: React.FC<PurchaseDetailsDrawerProps> = ({
  purchase,
  isOpen,
  onClose,
  onEdit,
}) => {
  useBodyScrollLock(isOpen, onClose);

  const [activeTab, setActiveTab] = useState<'overview' | 'items' | 'payments' | 'eway' | 'notes' | 'activity'>('overview');

  if (!isOpen || !purchase) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Panel matching mockup 8.2.png */}
      <div className="relative w-full max-w-lg bg-white h-screen shadow-2xl z-10 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header - flush with top edge */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-start justify-between bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Purchase - Details</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                Purchase
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <h2 className="text-xl font-black text-slate-900">
                {purchase.referenceNo || purchase.billNumber || 'BILL-2024-000123'}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Paid
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {purchase.date || '11 May 2024'}, {purchase.time || '11:24 AM'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="px-6 py-2.5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
          <button
            type="button"
            onClick={onEdit}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={() => alert('Downloading invoice...')}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download Invoice</span>
          </button>

          <button
            type="button"
            onClick={() => alert('Additional purchase actions')}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors shadow-2xs"
          >
            <span>More Actions</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Drawer Tabs */}
        <div className="px-6 pt-2 border-b border-slate-100 flex items-center gap-5 overflow-x-auto text-xs">
          {(['overview', 'items', 'payments', 'eway', 'notes', 'activity'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 font-bold capitalize transition-colors relative whitespace-nowrap ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab === 'eway' ? 'E-Way Bill' : tab}
            </button>
          ))}
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Vendor Details Card */}
          <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {purchase.vendorOrPaidTo || purchase.vendor || 'Sharma Enterprises'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Plot No. 12, Industrial Area, Durg,
                    <br />
                    Chhattisgarh - 490024
                  </p>
                  <p className="text-[11px] font-mono text-slate-500 mt-1">
                    GSTIN: 22ABCDE1234F1Z5
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert('View Vendor Profile')}
                className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors shadow-2xs shrink-0"
              >
                View Vendor
              </button>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Invoice No.</span>
              <span className="font-mono font-medium text-slate-900 mt-0.5 block">
                {purchase.referenceNo || purchase.billNumber || 'BILL-2024-000123'}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Vendor GSTIN</span>
              <span className="font-mono font-medium text-slate-900 mt-0.5 block">
                22ABCDE1234F1Z5
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Invoice Date</span>
              <span className="font-medium text-slate-900 mt-0.5 block">11 May 2024</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Place of Supply</span>
              <span className="font-medium text-slate-900 mt-0.5 block">Chhattisgarh (22)</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Due Date</span>
              <span className="font-medium text-slate-900 mt-0.5 block">11 May 2024</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Payment Terms</span>
              <span className="font-medium text-slate-900 mt-0.5 block">Due on Receipt</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Purchase Order</span>
              <span className="font-mono font-medium text-blue-600 mt-0.5 block">
                PO-2024-000021
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Reference</span>
              <span className="font-medium text-slate-500 mt-0.5 block">—</span>
            </div>
          </div>

          {/* Amount Summary */}
          <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2 text-xs">
            <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
              Amount Summary
            </h4>
            <div className="flex items-center justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-medium text-slate-900">₹ 23,809.52</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>CGST (9%)</span>
              <span className="font-medium text-slate-900">₹ 1,071.43</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>SGST (9%)</span>
              <span className="font-medium text-slate-900">₹ 1,071.43</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">Total Amount</span>
              <span className="font-black text-slate-900 text-base">₹ 25,000.00</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

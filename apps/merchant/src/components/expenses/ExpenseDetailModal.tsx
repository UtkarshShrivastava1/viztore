import React from 'react';
import { X, Receipt, Printer, CheckCircle2, AlertTriangle, FileText, Download } from 'lucide-react';
import { Expense } from '../../stores/expenseStore.js';
import { branding } from '../../lib/branding.js';

interface ExpenseDetailModalProps {
  expense: Expense | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExpenseDetailModal: React.FC<ExpenseDetailModalProps> = ({
  expense,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !expense) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Expense Voucher</h3>
              <p className="text-xs text-slate-500 font-mono">{expense.id}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {expense.category}
            </span>
            <div className="text-3xl font-black text-rose-600 mt-1">
              ₹ {expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{expense.status}</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Expense Name:</span>
              <span className="font-semibold text-slate-800">{expense.name}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Vendor / Payee:</span>
              <span className="font-semibold text-slate-800">{expense.vendor}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Date & Time:</span>
              <span className="font-semibold text-slate-800">
                {expense.date} • {expense.time}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Payment Method:</span>
              <span className="font-semibold text-slate-800">{expense.paymentMethod}</span>
            </div>
            {expense.referenceNumber && (
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Reference:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {expense.referenceNumber}
                </span>
              </div>
            )}
            {expense.receiptName && (
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Attached Receipt:</span>
                <span className="font-semibold text-blue-600 flex items-center gap-1 cursor-pointer">
                  <FileText className="w-3.5 h-3.5" />
                  {expense.receiptName}
                </span>
              </div>
            )}
          </div>

          <div className="text-center text-[10px] text-slate-400">
            Recorded in {branding.appName} Merchant Operations Hub
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Voucher
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

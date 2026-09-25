import React from 'react';
import { X, Receipt, Printer, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { WalletTransaction } from '../../stores/walletStore.js';
import { branding } from '../../lib/branding.js';

interface TransactionDetailModalProps {
  transaction: WalletTransaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !transaction) return null;

  const isPositive = transaction.amount > 0;

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
              <h3 className="text-sm font-bold text-slate-900">Transaction Receipt</h3>
              <p className="text-xs text-slate-500 font-mono">{transaction.id}</p>
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

        {/* Receipt Content */}
        <div className="p-6 space-y-5">
          {/* Amount Badge Banner */}
          <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {transaction.type} Transaction
            </span>
            <div
              className={`text-3xl font-black mt-1 ${
                isPositive ? 'text-emerald-600' : 'text-slate-900'
              }`}
            >
              {isPositive ? '+ ' : '- '}₹{' '}
              {Math.abs(transaction.amount).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
              })}
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{transaction.status}</span>
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Date & Time:</span>
              <span className="font-semibold text-slate-800">{transaction.dateTime}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Description:</span>
              <span className="font-semibold text-slate-800 text-right max-w-[240px]">
                {transaction.description}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Payment Method:</span>
              <span className="font-semibold text-slate-800">{transaction.paymentMethod}</span>
            </div>
            {transaction.referenceId && (
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Gateway Ref:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {transaction.referenceId}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Closing Balance:</span>
              <span className="font-bold text-slate-900">
                ₹ {transaction.closingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Merchant Watermark */}
          <div className="text-center text-[10px] text-slate-400">
            Certified by {branding.appName} Merchant Operations Hub
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Receipt
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

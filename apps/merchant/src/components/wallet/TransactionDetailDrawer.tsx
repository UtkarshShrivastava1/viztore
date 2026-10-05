import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Copy,
  Check,
  CheckCircle2,
  Headphones,
  RotateCcw,
} from 'lucide-react';
import { WalletTransaction } from '../../stores/walletStore.js';

interface TransactionDetailDrawerProps {
  transaction: WalletTransaction | null;
  isOpen: boolean;
  onClose: () => void;
  onContactSupport?: () => void;
}

export const TransactionDetailDrawer: React.FC<TransactionDetailDrawerProps> = ({
  transaction,
  isOpen,
  onClose,
  onContactSupport,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen || !transaction) return null;

  const isPositive = transaction.amount > 0;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const renderMethodBadge = () => {
    if (transaction.methodType === 'razorpay') {
      return (
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-[#072654] text-white flex items-center justify-center text-[9px] font-black italic">
            R
          </div>
          <span className="font-semibold text-slate-800 text-xs">Razorpay</span>
        </div>
      );
    }
    if (transaction.methodType === 'hdfc') {
      return (
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-[#ed1c24] text-white flex items-center justify-center text-[8px] font-bold">
            +
          </div>
          <span className="font-semibold text-slate-800 text-xs">{transaction.paymentMethod}</span>
        </div>
      );
    }
    if (transaction.methodType === 'upi') {
      return (
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold">
            UPI
          </div>
          <span className="font-semibold text-slate-800 text-xs">UPI Instant</span>
        </div>
      );
    }
    return <span className="font-semibold text-slate-800 text-xs">{transaction.paymentMethod}</span>;
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Panel matching 7.1.png */}
      <div className="relative w-full max-w-md bg-white h-screen shadow-2xl z-10 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header - flush with top edge */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-base font-bold text-slate-900">Transaction Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Hero Card matching 7.1.png */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  isPositive
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : 'bg-rose-50 text-rose-600 border-rose-200'
                }`}
              >
                {transaction.type === 'Refund' ? (
                  <RotateCcw className="w-5 h-5 text-purple-600" />
                ) : isPositive ? (
                  <span className="font-bold text-base text-emerald-600">+</span>
                ) : (
                  <span className="font-bold text-base text-rose-600">-</span>
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {transaction.type === 'Added'
                    ? 'Money Added'
                    : transaction.type === 'Refund'
                      ? 'Refund Received'
                      : 'Payment Deducted'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {transaction.date} {transaction.time}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`text-base font-black ${
                  isPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {isPositive ? '+' : '-'} ₹{' '}
                {Math.abs(transaction.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <div className="mt-0.5">
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                  {transaction.status}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Metadata List */}
          <div className="rounded-xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden bg-white text-xs">
            {/* Transaction ID */}
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Transaction ID</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-semibold text-slate-800">{transaction.id}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(transaction.id, 'id')}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                  title="Copy ID"
                >
                  {copiedKey === 'id' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Reference Number */}
            {transaction.referenceId && (
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Reference Number</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-semibold text-slate-800">
                    {transaction.referenceId}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(transaction.referenceId!, 'ref')}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                    title="Copy Reference"
                  >
                    {copiedKey === 'ref' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Payment Method</span>
              {renderMethodBadge()}
            </div>

            {/* Closing Balance */}
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Closing Balance</span>
              <span className="font-bold text-slate-900">
                ₹ {transaction.closingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Description */}
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Description</span>
              <span className="font-semibold text-slate-800 text-right max-w-[200px]">
                {transaction.description}
              </span>
            </div>
          </div>

          {/* Help & Support Card */}
          <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Have questions about this transaction?</p>
                <p className="text-[10px] text-slate-500">Contact merchant support 24/7</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onContactSupport || (() => alert('Opening merchant support desk...'))}
              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg shrink-0 transition-colors shadow-2xs"
            >
              Get Help
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-white shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

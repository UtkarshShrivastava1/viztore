import React from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowUpDown, User, CreditCard, ShoppingCart } from 'lucide-react';
import { PayoutTransaction } from '../../stores/payoutsStore.js';

interface TransactionDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: PayoutTransaction | null;
}

export const TransactionDetailDrawer: React.FC<TransactionDetailDrawerProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  if (!isOpen || !transaction) return null;

  const drawerContent = (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-screen animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">
                  {transaction.transactionId}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {transaction.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{transaction.dateTime}</p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {/* Amount Banner */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">
                  Net Amount
                </span>
                <span
                  className={`text-2xl font-black ${
                    transaction.netAmount < 0 ? 'text-rose-600' : 'text-slate-900'
                  }`}
                >
                  ₹ {transaction.netAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-200/60 text-slate-700 flex items-center justify-center">
                <ArrowUpDown className="w-5 h-5" />
              </div>
            </div>

            {/* Transaction Info */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Transaction Details
              </span>
              <div className="flex justify-between text-slate-600">
                <span>Transaction Type</span>
                <span className="font-semibold text-slate-900">{transaction.type}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Order ID</span>
                <span className="font-semibold text-blue-600">{transaction.orderId}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Customer</span>
                <span className="font-semibold text-slate-900">{transaction.customer}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Method</span>
                <span className="font-semibold text-slate-900">{transaction.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Description</span>
                <span className="font-medium text-slate-800 text-right max-w-[200px]">
                  {transaction.description}
                </span>
              </div>
            </div>

            {/* Fee & Calculation */}
            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Fee & Settlement Accounting
              </span>
              <div className="flex justify-between text-slate-600">
                <span>Gross Amount</span>
                <span className="font-semibold text-slate-900">
                  ₹ {transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Gateway & Commission Fee</span>
                <span className="font-semibold text-rose-600">
                  {transaction.fee !== null ? `- ₹ ${transaction.fee.toFixed(2)}` : '₹ 0.00'}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900">
                <span>Net Credited to Wallet</span>
                <span>
                  ₹ {transaction.netAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 pt-1 text-[11px]">
                <span>Running Balance After Txn</span>
                <span className="font-bold text-slate-800">
                  ₹ {transaction.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
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

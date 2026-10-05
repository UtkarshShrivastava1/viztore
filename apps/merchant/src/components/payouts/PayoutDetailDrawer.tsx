import React from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, XCircle, CreditCard, Calendar, Hash, Building2 } from 'lucide-react';
import { PayoutRecord } from '../../stores/payoutsStore.js';

interface PayoutDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  payout: PayoutRecord | null;
}

export const PayoutDetailDrawer: React.FC<PayoutDetailDrawerProps> = ({
  isOpen,
  onClose,
  payout,
}) => {
  if (!isOpen || !payout) return null;

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
                <h2 className="text-lg font-black text-slate-900">{payout.payoutId}</h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    payout.status === 'Paid'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {payout.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{payout.dateTime}</p>
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
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/70 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-emerald-900 block">
                  Transferred Amount
                </span>
                <span className="text-2xl font-black text-emerald-800">
                  ₹ {payout.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>

            {/* Payout Information */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Transfer Details
              </span>
              <div className="flex justify-between text-slate-600">
                <span>Bank Account</span>
                <span className="font-semibold text-slate-900">{payout.bankAccount}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>UTR / Ref No.</span>
                <span className="font-mono font-medium text-slate-900">{payout.utr}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Orders Included</span>
                <span className="font-semibold text-slate-900">{payout.orderCount} orders</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payout Status</span>
                <span className="font-semibold text-slate-900">{payout.status}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Transfer Lifecycle
              </span>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Payout Initiated</p>
                    <p className="text-[10px] text-slate-400">{payout.dateTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Bank Gateway Confirmed</p>
                    <p className="text-[10px] text-slate-400">UTR: {payout.utr}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      payout.status === 'Paid' ? 'text-emerald-600' : 'text-rose-500'
                    }`}
                  />
                  <div>
                    <p className="font-bold text-slate-900">
                      {payout.status === 'Paid' ? 'Credited to Account' : 'Transfer Failed'}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {payout.status === 'Paid' ? 'Funds settled successfully' : 'Contact support for details'}
                    </p>
                  </div>
                </div>
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

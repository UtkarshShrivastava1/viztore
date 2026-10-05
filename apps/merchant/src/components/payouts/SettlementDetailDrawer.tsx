import React from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, Boxes, Calendar, Hash } from 'lucide-react';
import { SettlementRecord } from '../../stores/payoutsStore.js';

interface SettlementDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settlement: SettlementRecord | null;
}

export const SettlementDetailDrawer: React.FC<SettlementDetailDrawerProps> = ({
  isOpen,
  onClose,
  settlement,
}) => {
  if (!isOpen || !settlement) return null;

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
                <h2 className="text-lg font-black text-slate-900">{settlement.settlementId}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {settlement.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{settlement.settlementDate}</p>
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
            <div className="p-4 bg-blue-50/70 border border-blue-200/70 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-blue-900 block">
                  Net Settlement Amount
                </span>
                <span className="text-2xl font-black text-blue-800">
                  ₹ {settlement.settlementAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Boxes className="w-5 h-5" />
              </div>
            </div>

            {/* Settlement Details */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Settlement Period & Account
              </span>
              <div className="flex justify-between text-slate-600">
                <span>Period</span>
                <span className="font-semibold text-slate-900">{settlement.period}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Account</span>
                <span className="font-semibold text-slate-900">{settlement.payoutAccount}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>UTR Reference</span>
                <span className="font-mono font-medium text-slate-900">{settlement.utr}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Orders Count</span>
                <span className="font-semibold text-slate-900">{settlement.orderCount} orders</span>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Financial Breakdown
              </span>
              <div className="flex justify-between text-slate-600">
                <span>Gross Order Value</span>
                <span className="font-semibold text-slate-900">
                  ₹ {settlement.grossAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Platform Deductions</span>
                <span className="font-semibold text-rose-600">
                  - ₹ {settlement.deductions.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900">
                <span>Net Credited</span>
                <span>
                  ₹ {settlement.settlementAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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

import React, { useState } from 'react';
import { X, Wallet } from 'lucide-react';
import { usePayoutsStore } from '../../stores/payoutsStore.js';

export const NewPayoutRequestModal: React.FC = () => {
  const {
    isNewRequestModalOpen,
    setIsNewRequestModalOpen,
    availableForPayout,
    settings,
    createPayoutRequest,
  } = usePayoutsStore();

  const [amount, setAmount] = useState<number>(availableForPayout);
  const [remarks, setRemarks] = useState('');

  if (!isNewRequestModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || amount > availableForPayout) {
      alert(`Please enter an amount between ₹1 and ₹${availableForPayout.toLocaleString('en-IN')}`);
      return;
    }

    createPayoutRequest(amount, remarks);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsNewRequestModalOpen(false)}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                New Payout Request
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Transfer available funds to your linked bank account.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsNewRequestModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Available for Payout</span>
              <span className="font-bold text-slate-900">
                ₹ {availableForPayout.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>Destination Account</span>
              <span className="font-medium text-slate-700">
                {settings.bankName} - {settings.accountNumber}
              </span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Withdrawal Amount (₹) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                ₹
              </span>
              <input
                type="number"
                min={1}
                max={availableForPayout}
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-bold text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Remarks <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Urgent operational settlement"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsNewRequestModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-2xs"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

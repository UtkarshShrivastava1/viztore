import React, { useState } from 'react';
import { X, Wallet, ShieldCheck, ArrowRight } from 'lucide-react';
import { useWalletStore } from '../../stores/walletStore.js';

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddMoneyModal: React.FC<AddMoneyModalProps> = ({ isOpen, onClose }) => {
  const { addMoney, currentBalance } = useWalletStore();

  const [amount, setAmount] = useState('5000');
  const [selectedMethod, setSelectedMethod] = useState<'razorpay' | 'hdfc' | 'upi'>('razorpay');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const quickAmounts = [1000, 2500, 5000, 10000, 20000];
  const numAmount = parseFloat(amount) || 0;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount < 100) {
      setErrorMsg('Minimum top-up amount is ₹100.');
      return;
    }

    let methodName = 'Razorpay';
    if (selectedMethod === 'hdfc') methodName = 'HDFC Bank **** 4567';
    if (selectedMethod === 'upi') methodName = 'UPI';

    addMoney(numAmount, methodName, selectedMethod);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Add Money to Wallet</h3>
              <p className="text-xs text-slate-500">
                Current balance: ₹{currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleAdd} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Enter Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                ₹
              </span>
              <input
                type="number"
                min="100"
                step="50"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Quick Amount Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmount(amt.toString())}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  amount === amt.toString()
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                +₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Select Payment Method
            </label>
            <div className="space-y-2">
              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedMethod === 'razorpay'
                    ? 'border-blue-500 bg-blue-50/40 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="walletMethod"
                    checked={selectedMethod === 'razorpay'}
                    onChange={() => setSelectedMethod('razorpay')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center text-[10px] font-black italic">
                    R
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Razorpay Gateway
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Credit / Debit Card, Net Banking, PayLater
                    </span>
                  </div>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedMethod === 'upi'
                    ? 'border-blue-500 bg-blue-50/40 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="walletMethod"
                    checked={selectedMethod === 'upi'}
                    onChange={() => setSelectedMethod('upi')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="w-5 h-5 rounded bg-amber-500 text-white flex items-center justify-center text-[8px] font-black">
                    UPI
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Instant UPI</span>
                    <span className="text-[10px] text-slate-500">GPay, PhonePe, Paytm, BHIM</span>
                  </div>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedMethod === 'hdfc'
                    ? 'border-blue-500 bg-blue-50/40 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="walletMethod"
                    checked={selectedMethod === 'hdfc'}
                    onChange={() => setSelectedMethod('hdfc')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="w-5 h-5 rounded bg-red-600 text-white flex items-center justify-center text-[9px] font-black">
                    +
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      HDFC Bank Direct Transfer
                    </span>
                    <span className="text-[10px] text-slate-500">Primary Linked Business Account</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Security Assurance */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>256-bit encrypted checkout with instant credit confirmation.</span>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <span>Add ₹{numAmount.toLocaleString('en-IN')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

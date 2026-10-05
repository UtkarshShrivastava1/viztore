import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, CreditCard, Building2 } from 'lucide-react';
import { useWalletStore } from '../../stores/walletStore.js';

interface AddMoneyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddMoneyDrawer: React.FC<AddMoneyDrawerProps> = ({ isOpen, onClose }) => {
  const { addMoney } = useWalletStore();
  const [amount, setAmount] = useState('10000');
  const [selectedMethod, setSelectedMethod] = useState<'razorpay' | 'upi' | 'card' | 'bank'>('razorpay');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const quickAmounts = [1000, 5000, 10000, 25000];
  const numAmount = parseFloat(amount.replace(/,/g, '')) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount < 100) {
      setErrorMsg('Minimum amount is ₹100.');
      return;
    }

    let methodName = 'Razorpay';
    let methodType: 'razorpay' | 'hdfc' | 'upi' | 'wallet' | 'bank' = 'razorpay';

    if (selectedMethod === 'razorpay') {
      methodName = 'Razorpay';
      methodType = 'razorpay';
    } else if (selectedMethod === 'upi') {
      methodName = 'UPI';
      methodType = 'upi';
    } else if (selectedMethod === 'card') {
      methodName = 'HDFC Bank **** 4567';
      methodType = 'hdfc';
    } else if (selectedMethod === 'bank') {
      methodName = 'Net Banking';
      methodType = 'bank';
    }

    addMoney(numAmount, methodName, methodType);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Panel matching 7.2.png */}
      <div className="relative w-full max-w-md bg-white h-screen shadow-2xl z-10 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header - flush with top edge */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-start justify-between bg-white shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">Add Money to Wallet</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Add funds to pay platform fees, ads, delivery charges and refunds.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Amount input block */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Enter Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-500">
                ₹
              </span>
              <input
                type="text"
                value={amount}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setAmount(val);
                  setErrorMsg('');
                }}
                className="w-full pl-8 pr-4 py-2 text-lg font-bold text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
                placeholder="0"
                autoFocus
              />
            </div>
            {errorMsg && <p className="text-xs text-red-500 mt-1 font-medium">{errorMsg}</p>}

            {/* Quick chips */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(q.toString())}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                    numAmount === q
                      ? 'bg-blue-50 border-blue-600 text-blue-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  + ₹{q.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Select Payment Method
            </label>
            <div className="space-y-2">
              {/* Razorpay */}
              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedMethod === 'razorpay'
                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#072654] text-white flex items-center justify-center font-black italic text-xs">
                    R
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Razorpay Secure</p>
                    <p className="text-[10px] text-slate-500">Cards, UPI, Netbanking & Wallets</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedMethod === 'razorpay'}
                  onChange={() => setSelectedMethod('razorpay')}
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
              </label>

              {/* UPI */}
              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedMethod === 'upi'
                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    UPI
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">UPI Instant</p>
                    <p className="text-[10px] text-slate-500">GPay, PhonePe, Paytm or any UPI ID</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedMethod === 'upi'}
                  onChange={() => setSelectedMethod('upi')}
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
              </label>

              {/* Credit / Debit Card */}
              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedMethod === 'card'
                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Credit / Debit Card</p>
                    <p className="text-[10px] text-slate-500">Visa, Mastercard, RuPay</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedMethod === 'card'}
                  onChange={() => setSelectedMethod('card')}
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
              </label>

              {/* Net Banking */}
              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedMethod === 'bank'
                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Net Banking (NEFT / IMPS)</p>
                    <p className="text-[10px] text-slate-500">Direct bank transfer</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedMethod === 'bank'}
                  onChange={() => setSelectedMethod('bank')}
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          {/* Secure transaction notice */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-[11px] text-slate-600 leading-tight">
              256-bit SSL encrypted. Funds reflect immediately in your wallet.
            </p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            Add ₹ {numAmount.toLocaleString('en-IN')} Now
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

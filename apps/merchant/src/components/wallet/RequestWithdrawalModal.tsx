import React, { useState } from 'react';
import { X, Landmark, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useWalletStore } from '../../stores/walletStore.js';

interface RequestWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestWithdrawalModal: React.FC<RequestWithdrawalModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentBalance, bankAccounts, withdrawMoney } = useWalletStore();

  const [selectedBankId, setSelectedBankId] = useState(
    bankAccounts[0]?.id || 'BANK-01'
  );
  const [amount, setAmount] = useState(currentBalance.toString());
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const numAmount = parseFloat(amount) || 0;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) {
      setErrorMsg('Please enter a valid withdrawal amount.');
      return;
    }
    if (numAmount > currentBalance) {
      setErrorMsg(`Amount cannot exceed available balance (₹${currentBalance.toLocaleString('en-IN')}).`);
      return;
    }

    withdrawMoney(numAmount, selectedBankId, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Request Bank Settlement</h3>
              <p className="text-xs text-slate-500">Withdraw wallet balance to your bank account</p>
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

        {/* Form Content */}
        <form onSubmit={handleWithdraw} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Available Balance Box */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Available for Settlement
              </span>
              <span className="text-lg font-black text-slate-900 mt-0.5 block">
                ₹{currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAmount(currentBalance.toString())}
              className="px-2.5 py-1 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Withdraw All
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Settlement Amount (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="100"
              max={currentBalance}
              step="1"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrorMsg('');
              }}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          {/* Bank Account Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Destination Bank Account <span className="text-rose-500">*</span>
            </label>
            <div className="space-y-2">
              {bankAccounts.map((acc) => (
                <label
                  key={acc.id}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedBankId === acc.id
                      ? 'border-blue-500 bg-blue-50/40 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="bankAcc"
                      checked={selectedBankId === acc.id}
                      onChange={() => setSelectedBankId(acc.id)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">{acc.bankName}</span>
                        {acc.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        {acc.isPrimary && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-50 text-blue-700">
                            Primary
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        A/C: {acc.accountNumberMasked} • IFSC: {acc.ifscCode}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Reference / Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Weekly sales settlement"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          {/* Info note */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>NEFT/IMPS transfers are typically settled within 2 to 4 business hours.</span>
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
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
            >
              Confirm Settlement (₹{numAmount.toLocaleString('en-IN')})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

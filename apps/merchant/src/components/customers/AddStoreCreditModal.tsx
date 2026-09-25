import React, { useState } from 'react';
import { X, CreditCard, Plus, Minus } from 'lucide-react';
import { useCustomerStore, Customer } from '../../stores/customerStore.js';

interface AddStoreCreditModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AddStoreCreditModal: React.FC<AddStoreCreditModalProps> = ({
  customer,
  isOpen,
  onClose,
}) => {
  const { addStoreCredit, deductStoreCredit } = useCustomerStore();

  const [mode, setMode] = useState<'add' | 'deduct'>('add');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !customer) return null;

  const currentCredit = customer.storeCredit || 0;
  const numAmount = parseFloat(amount) || 0;
  const projectedBalance =
    mode === 'add' ? currentCredit + numAmount : Math.max(0, currentCredit - numAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) {
      setErrorMsg('Please enter a valid credit amount.');
      return;
    }
    if (!reason.trim()) {
      setErrorMsg('Please enter a reason for this adjustment.');
      return;
    }

    if (mode === 'add') {
      addStoreCredit(customer.id, numAmount, reason);
    } else {
      if (numAmount > currentCredit) {
        setErrorMsg('Cannot deduct more than current available store credit.');
        return;
      }
      deductStoreCredit(customer.id, numAmount, reason);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Manage Store Credit</h3>
              <p className="text-xs text-slate-500">{customer.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Current Balance & Action Mode */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Current Store Credit
              </span>
              <span className="text-lg font-black text-slate-900 mt-0.5 block">
                ₹{currentCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setMode('add')}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                  mode === 'add'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
              <button
                type="button"
                onClick={() => setMode('deduct')}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                  mode === 'deduct'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Minus className="w-3 h-3" />
                Deduct
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Adjustment Amount (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="1"
              min="1"
              placeholder="Enter amount (e.g. 500)"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrorMsg('');
              }}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
            />
          </div>

          {/* Quick Amount suggestions */}
          <div className="flex items-center gap-2">
            {[100, 250, 500, 1000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmount(amt.toString())}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                +₹{amt}
              </button>
            ))}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Reason / Reference <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Goodwill credit, return adjustment #RET-3049"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setErrorMsg('');
              }}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
            />
          </div>

          {/* Projected Balance preview */}
          {numAmount > 0 && (
            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between text-xs font-semibold text-indigo-900">
              <span>Projected Balance After:</span>
              <span className="font-mono text-sm">
                ₹{projectedBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs ${
                mode === 'add' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              Confirm {mode === 'add' ? 'Credit' : 'Deduction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

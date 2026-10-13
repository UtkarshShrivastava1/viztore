import React, { useState } from 'react';
import { X, CreditCard, Plus, Minus, Wallet, CheckCircle, ArrowDownLeft } from 'lucide-react';
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
  const { addStoreCredit, deductStoreCredit, recordPayment } = useCustomerStore();

  const [activeTab, setActiveTab] = useState<'khata' | 'store_credit'>(
    customer && customer.outstandingAmount > 0 ? 'khata' : 'store_credit'
  );

  // Khata Payment State
  const [khataAmount, setKhataAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque'>('UPI');
  const [paymentNote, setPaymentNote] = useState('');

  // Store Credit State
  const [creditMode, setCreditMode] = useState<'add' | 'deduct'>('add');
  const [creditAmount, setCreditAmount] = useState('');
  const [creditReason, setCreditReason] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !customer) return null;

  const currentOutstanding = customer.outstandingAmount || 0;
  const currentCredit = customer.storeCredit || 0;

  const handleKhataSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(khataAmount) || 0;
    if (numAmount <= 0) {
      setErrorMsg('Please enter a valid payment amount.');
      return;
    }
    if (numAmount > currentOutstanding) {
      setErrorMsg('Payment amount exceeds current outstanding balance.');
      return;
    }

    recordPayment(customer.id, numAmount, paymentMethod, paymentNote);
    onClose();
  };

  const handleCreditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(creditAmount) || 0;
    if (numAmount <= 0) {
      setErrorMsg('Please enter a valid credit amount.');
      return;
    }
    if (!creditReason.trim()) {
      setErrorMsg('Please enter a reason for this credit adjustment.');
      return;
    }

    if (creditMode === 'add') {
      addStoreCredit(customer.id, numAmount, creditReason);
    } else {
      if (numAmount > currentCredit) {
        setErrorMsg('Cannot deduct more than current available store credit.');
        return;
      }
      deductStoreCredit(customer.id, numAmount, creditReason);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              {activeTab === 'khata' ? (
                <ArrowDownLeft className="w-5 h-5" />
              ) : (
                <CreditCard className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {activeTab === 'khata' ? 'Record Khata / Udhar Payment' : 'Manage Store Credit'}
              </h3>
              <p className="text-xs text-slate-500">{customer.name} ({customer.id})</p>
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

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('khata');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'khata'
                ? 'bg-white text-blue-700 shadow-2xs border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Settle Khata (₹{currentOutstanding.toLocaleString('en-IN')})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('store_credit');
              setErrorMsg('');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'store_credit'
                ? 'bg-white text-blue-700 shadow-2xs border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Store Credit (₹{currentCredit.toLocaleString('en-IN')})
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Tab 1: Khata Debt Settlement */}
        {activeTab === 'khata' ? (
          <form onSubmit={handleKhataSubmit} className="p-6 space-y-4">
            <div className="p-3.5 bg-rose-50/70 rounded-xl border border-rose-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">
                  Current Outstanding Due
                </span>
                <span className="text-lg font-black text-rose-700 mt-0.5 block">
                  ₹{currentOutstanding.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setKhataAmount(currentOutstanding.toString())}
                className="px-2.5 py-1.5 bg-white hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg transition-colors shadow-2xs"
              >
                Clear Full Due
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Payment Amount Received (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                max={currentOutstanding}
                placeholder="Enter amount paid"
                value={khataAmount}
                onChange={(e) => {
                  setKhataAmount(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>

            {/* Quick Pills */}
            {currentOutstanding > 0 && (
              <div className="flex items-center gap-2">
                {[0.25, 0.5, 1].map((pct) => {
                  const val = Math.round(currentOutstanding * pct);
                  return (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setKhataAmount(val.toString())}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      {pct * 100}% (₹{val.toLocaleString('en-IN')})
                    </button>
                  );
                })}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Payment Mode
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['UPI', 'Cash', 'Bank Transfer', 'Cheque'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`py-2 text-xs font-bold rounded-xl border text-center transition-all ${
                      paymentMethod === m
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Transaction Ref / Note
              </label>
              <input
                type="text"
                placeholder="e.g. Google Pay UTR #41029482, Cash counter receipt"
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>

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
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirm Payment</span>
              </button>
            </div>
          </form>
        ) : (
          /* Tab 2: Store Credit Adjustment */
          <form onSubmit={handleCreditSubmit} className="p-6 space-y-4">
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
                  onClick={() => setCreditMode('add')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                    creditMode === 'add'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setCreditMode('deduct')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                    creditMode === 'deduct'
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Minus className="w-3 h-3" />
                  Deduct
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Adjustment Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="1"
                min="1"
                placeholder="Enter amount (e.g. 500)"
                value={creditAmount}
                onChange={(e) => {
                  setCreditAmount(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-2">
              {[100, 250, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setCreditAmount(amt.toString())}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  +₹{amt}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Reason / Reference <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Goodwill credit, return adjustment #RET-3049"
                value={creditReason}
                onChange={(e) => {
                  setCreditReason(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>

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
                className={`px-5 py-2 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer ${
                  creditMode === 'add' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Confirm {creditMode === 'add' ? 'Credit' : 'Deduction'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

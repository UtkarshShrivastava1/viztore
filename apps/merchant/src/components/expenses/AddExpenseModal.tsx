import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Calendar } from 'lucide-react';
import { useExpenseStore } from '../../stores/expenseStore.js';

export const AddExpenseModal: React.FC = () => {
  const { isAddExpenseModalOpen, setIsAddExpenseModalOpen, setIsAddVendorOpen } = useExpenseStore();

  const [expenseType, setExpenseType] = useState('');
  const [vendor, setVendor] = useState('');
  const [date, setDate] = useState('2024-05-11');
  const [referenceNo, setReferenceNo] = useState('');
  const [notes, setNotes] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [tax, setTax] = useState<number | ''>('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Immediate');

  if (!isAddExpenseModalOpen) return null;

  const numAmount = typeof amount === 'number' ? amount : 0;
  const numTax = typeof tax === 'number' ? tax : 0;
  const totalAmount = numAmount + numTax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Expense of ₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} recorded successfully!`);
    setIsAddExpenseModalOpen(false);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Add Expense</h2>
            <p className="text-xs text-slate-500">Record a new expense for your business.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddExpenseModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expense For / Description <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={expenseType}
                    onChange={(e) => setExpenseType(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                    required
                  >
                    <option value="">Select or add expense type</option>
                    <option value="Electricity Bill">Electricity Bill</option>
                    <option value="Office Rent">Office Rent</option>
                    <option value="Internet / Wi-Fi">Internet / Wi-Fi</option>
                    <option value="Fuel / Travel">Fuel / Travel</option>
                    <option value="Store Maintenance">Store Maintenance</option>
                    <option value="Marketing Campaign">Marketing Campaign</option>
                    <option value="Staff Refreshment">Staff Refreshment</option>
                    <option value="Packaging Supplies">Packaging Supplies</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const newType = prompt('Enter new expense type:');
                      if (newType) setExpenseType(newType);
                    }}
                    className="px-2.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center transition-colors"
                    title="Add new expense category"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  e.g. Electricity Bill, Office Rent, Internet, Fuel, Maintenance, Marketing, etc.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vendor / Paid To <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                    required
                  >
                    <option value="">Select or add vendor</option>
                    <option value="Airtel Broadband">Airtel Broadband</option>
                    <option value="Jio Telecom">Jio Telecom</option>
                    <option value="Office Landlord">Office Landlord</option>
                    <option value="Sharma Enterprises">Sharma Enterprises</option>
                    <option value="Local Stationery Store">Local Stationery Store</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Meta Ads">Meta Ads</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsAddVendorOpen(true)}
                    className="px-2.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center transition-colors"
                    title="Add new vendor"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  e.g. Jio, Airtel, Rent Owner, Local Vendor, etc.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expense Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                    required
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reference No. (Optional)
                </label>
                <input
                  type="text"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  placeholder="e.g. EXP-2024-001, Bill No., Receipt No."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Notes (Optional)</label>
                  <span className="text-[10px] text-slate-400">{notes.length}/250</span>
                </div>
                <textarea
                  value={notes}
                  maxLength={250}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes, remarks or description..."
                  rows={3}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Amount (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-semibold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) =>
                      setAmount(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)
                    }
                    placeholder="Enter amount"
                    className="w-full pl-7 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tax (₹) (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-semibold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={tax}
                    onChange={(e) =>
                      setTax(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)
                    }
                    placeholder="Enter tax amount"
                    className="w-full pl-7 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-500">₹</span>
                  <input
                    type="text"
                    readOnly
                    value={totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    className="w-full pl-7 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >
                  <option value="">Select payment method</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI / QR">UPI / QR</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Terms (Optional)
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Immediate">Immediate</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 45">Net 45</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddExpenseModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

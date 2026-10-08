import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Trash2, Calendar, FileText } from 'lucide-react';

interface CreateCreditNoteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const CreateCreditNoteDrawer: React.FC<CreateCreditNoteDrawerProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [vendor, setVendor] = useState('Sharma Enterprises');
  const [cnNumber, setCnNumber] = useState('CN-2024-000013');
  const [cnDate, setCnDate] = useState('11/05/2024');
  const [refPurchase, setRefPurchase] = useState('BILL-2024-000123');
  const [reasonType, setReasonType] = useState('Purchase Return');
  const [notes, setNotes] = useState('');
  const [tds, setTds] = useState('0.00');

  const [items, setItems] = useState([
    { id: 1, name: "Men's T-Shirt", hsn: '6109', qty: 10, unit: 'Pcs', rate: 400.0, amount: 4000.0 },
    { id: 2, name: "Men's Jeans", hsn: '6203', qty: 5, unit: 'Pcs', rate: 500.0, amount: 2500.0 },
  ]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const total = subtotal - (parseFloat(tds) || 0);

  const handleDeleteItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAddItem = () => {
    const nextId = items.length + 1;
    setItems((prev) => [
      ...prev,
      { id: nextId, name: 'Returned Product', hsn: '6109', qty: 2, unit: 'Pcs', rate: 400.0, amount: 800.0 },
    ]);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Panel matching mockup 8.4.png */}
      <div className="relative w-full max-w-xl bg-white h-screen shadow-2xl z-10 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header - flush with top edge */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-start justify-between bg-white shrink-0">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 mt-0.5">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Create Credit Note</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Create a credit note for a purchase return, vendor credit or adjustment.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Basic Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">Basic Details</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Vendor */}
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Vendor <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  >
                    <option value="Sharma Enterprises">Sharma Enterprises</option>
                    <option value="Gupta Traders">Gupta Traders</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => alert('Add New Vendor')}
                    className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-2xs"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Credit Note No */}
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Credit Note No. <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={cnNumber}
                  onChange={(e) => setCnNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs font-mono"
                />
              </div>

              {/* Credit Note Date */}
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Credit Note Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cnDate}
                    onChange={(e) => setCnDate(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Reference (Purchase) */}
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Reference (Purchase)
                </label>
                <input
                  type="text"
                  value={refPurchase}
                  onChange={(e) => setRefPurchase(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs font-mono"
                />
              </div>

              {/* Reason / Type */}
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Reason / Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={reasonType}
                  onChange={(e) => setReasonType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                >
                  <option value="Purchase Return">Purchase Return</option>
                  <option value="Damaged Goods">Damaged Goods</option>
                  <option value="Price Adjustment">Price Adjustment</option>
                  <option value="Wrong Item">Wrong Item</option>
                  <option value="Quality Issue">Quality Issue</option>
                </select>
              </div>

              {/* Notes */}
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  placeholder="Add any notes..."
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* 2. Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 tracking-tight">Items</h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-blue-200 text-blue-600 text-[11px] font-bold rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <tr>
                    <th className="py-2 px-2.5 w-6">#</th>
                    <th className="py-2 px-2.5">Item Name</th>
                    <th className="py-2 px-2">HSN Code</th>
                    <th className="py-2 px-2">Qty</th>
                    <th className="py-2 px-2">Unit</th>
                    <th className="py-2 px-2 text-right">Rate (₹)</th>
                    <th className="py-2 px-2 text-right">Amount (₹)</th>
                    <th className="py-2 px-2 text-center w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((it, idx) => (
                    <tr key={it.id}>
                      <td className="py-2 px-2.5 text-slate-400 font-medium">{idx + 1}</td>
                      <td className="py-2 px-2.5 font-bold text-blue-600">{it.name}</td>
                      <td className="py-2 px-2 font-mono text-slate-600">{it.hsn}</td>
                      <td className="py-2 px-2 text-slate-800">{it.qty}</td>
                      <td className="py-2 px-2 text-slate-600">{it.unit}</td>
                      <td className="py-2 px-2 text-right font-medium text-slate-800">
                        {it.rate.toFixed(2)}
                      </td>
                      <td className="py-2 px-2 text-right font-bold text-slate-900">
                        {it.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(it.id)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Amount Summary */}
          <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2 text-xs">
            <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
              Amount Summary
            </h4>
            <div className="flex items-center justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-medium text-slate-900">
                ₹ {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Less: TDS (0%)</span>
              <input
                type="text"
                value={tds}
                onChange={(e) => setTds(e.target.value)}
                className="w-24 px-2 py-0.5 bg-white border border-slate-200 rounded text-right text-xs"
              />
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Round Off</span>
              <span className="font-medium text-slate-900">0.00</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">Total Credit Note Amount</span>
              <span className="font-black text-slate-900 text-base">
                ₹ {total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors shadow-2xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onCreated();
              onClose();
            }}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
          >
            Create Credit Note
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Trash2, Calendar } from 'lucide-react';

interface EditPurchaseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const EditPurchaseDrawer: React.FC<EditPurchaseDrawerProps> = ({
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [vendor, setVendor] = useState('Sharma Enterprises');
  const [invoiceNo, setInvoiceNo] = useState('BILL-2024-000123');
  const [invoiceDate, setInvoiceDate] = useState('11/05/2024');
  const [dueDate, setDueDate] = useState('11/05/2024');
  const [poRef, setPoRef] = useState('PO-2024-000021');
  const [paymentTerms, setPaymentTerms] = useState('Due on Receipt');
  const [vendorGstin, setVendorGstin] = useState('22ABCDE1234F1Z5');
  const [placeOfSupply, setPlaceOfSupply] = useState('Chhattisgarh (22)');
  const [notes, setNotes] = useState('Stock purchase for May.');

  const [items, setItems] = useState([
    { id: 1, name: "Men's T-Shirt", hsn: '6109', qty: 100, unit: 'Pcs', rate: 400.0, amount: 40000.0 },
    { id: 2, name: "Men's Jeans", hsn: '6203', qty: 50, unit: 'Pcs', rate: 500.0, amount: 25000.0 },
  ]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const total = subtotal + cgst + sgst;

  const handleDeleteItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAddItem = () => {
    const nextId = items.length + 1;
    setItems((prev) => [
      ...prev,
      { id: nextId, name: 'New Item', hsn: '6109', qty: 10, unit: 'Pcs', rate: 250.0, amount: 2500.0 },
    ]);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Panel matching mockup 8.3.png */}
      <div className="relative w-full max-w-xl bg-white h-screen shadow-2xl z-10 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header - flush with top edge */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-start justify-between bg-white shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">Edit Purchase</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Update purchase details, items, taxes and other information.
            </p>
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
                    <option value="Verma Distributors">Verma Distributors</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => alert('Quick Add Vendor')}
                    className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-2xs"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Invoice No */}
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Invoice No. <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs font-mono"
                />
              </div>

              {/* Invoice Date */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Invoice Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Due Date</label>
                <div className="relative">
                  <input
                    type="text"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Purchase Order */}
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Purchase Order
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={poRef}
                    onChange={(e) => setPoRef(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs font-mono"
                  />
                  {poRef && (
                    <button
                      type="button"
                      onClick={() => setPoRef('')}
                      className="absolute right-2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Payment Terms */}
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Payment Terms
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                >
                  <option value="Due on Receipt">Due on Receipt</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                </select>
              </div>

              {/* Vendor GSTIN */}
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Vendor GSTIN
                </label>
                <input
                  type="text"
                  value={vendorGstin}
                  onChange={(e) => setVendorGstin(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs font-mono"
                />
              </div>

              {/* Place of Supply */}
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Place of Supply <span className="text-rose-500">*</span>
                </label>
                <select
                  value={placeOfSupply}
                  onChange={(e) => setPlaceOfSupply(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                >
                  <option value="Chhattisgarh (22)">Chhattisgarh (22)</option>
                  <option value="Madhya Pradesh (23)">Madhya Pradesh (23)</option>
                  <option value="Maharashtra (27)">Maharashtra (27)</option>
                </select>
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

          {/* 3. Notes */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-700">Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          {/* 4. Bill Summary */}
          <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2 text-xs">
            <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
              Bill Summary
            </h4>
            <div className="flex items-center justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-medium text-slate-900">
                {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>CGST (9%)</span>
              <span className="font-medium text-slate-900">
                {cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>SGST (9%)</span>
              <span className="font-medium text-slate-900">
                {sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">Total Amount</span>
              <span className="font-black text-slate-900 text-base">
                {total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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
              onUpdate();
              onClose();
            }}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
          >
            Update Purchase
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

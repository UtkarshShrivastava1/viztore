import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Trash2, Calendar, Search } from 'lucide-react';
import { useExpenseStore } from '../../stores/expenseStore.js';

interface ReturnLineItem {
  id: string;
  name: string;
  description: string;
  returnQty: number;
  unit: string;
  rate: number;
}

export const CreatePurchaseReturnModal: React.FC = () => {
  const { isCreateReturnModalOpen, setIsCreateReturnModalOpen, setIsAddVendorOpen } = useExpenseStore();

  const [vendor, setVendor] = useState('Sharma Enterprises');
  const [billNumber, setBillNumber] = useState('BILL-2024-000127');
  const [returnDate, setReturnDate] = useState('2024-05-11');
  const [originalBillDate, setOriginalBillDate] = useState('2024-05-08');
  const [referenceNo, setReferenceNo] = useState('');
  const [warehouse, setWarehouse] = useState('Main Warehouse');
  const [reason, setReason] = useState('');
  const [creditNoteRequired, setCreditNoteRequired] = useState('Yes (Generate Credit Note)');
  const [notes, setNotes] = useState('');
  const [returnNote, setReturnNote] = useState('');
  const [taxRate, setTaxRate] = useState(18);
  const [settledAmount, setSettledAmount] = useState(0);

  const [items, setItems] = useState<ReturnLineItem[]>([
    { id: '1', name: 'Men T-Shirt (M)', description: 'Cotton T-Shirt - Size M', returnQty: 5, unit: 'Pcs', rate: 250 },
    { id: '2', name: 'Men T-Shirt (L)', description: 'Cotton T-Shirt - Size L', returnQty: 5, unit: 'Pcs', rate: 250 },
    { id: '3', name: 'Women Kurti (M)', description: 'Printed Kurti - Size M', returnQty: 3, unit: 'Pcs', rate: 450 },
    { id: '4', name: 'Women Kurti (L)', description: 'Printed Kurti - Size L', returnQty: 2, unit: 'Pcs', rate: 450 },
  ]);

  if (!isCreateReturnModalOpen) return null;

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: '',
        description: '',
        returnQty: 1,
        unit: 'Pcs',
        rate: 0,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleUpdateItem = (id: string, field: keyof ReturnLineItem, value: any) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const subtotal = items.reduce((acc, item) => acc + item.returnQty * item.rate, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const totalReturnAmount = subtotal + taxAmount;
  const pendingCredit = Math.max(0, totalReturnAmount - (settledAmount || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Purchase Return for ${billNumber} created successfully! Credit note generated.`);
    setIsCreateReturnModalOpen(false);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Create Purchase Return</h2>
            <p className="text-xs text-slate-500">Record a purchase return for a vendor.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateReturnModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Vendor <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddVendorOpen(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                >
                  + Add New Vendor
                </button>
              </div>
              <select
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                <option value="Sharma Enterprises">Sharma Enterprises</option>
                <option value="Gupta Traders">Gupta Traders</option>
                <option value="Verma Distributors">Verma Distributors</option>
                <option value="Agarwal & Co.">Agarwal & Co.</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Purchase Bill No. <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Return Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Original Bill Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={originalBillDate}
                  onChange={(e) => setOriginalBillDate(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
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
                placeholder="e.g. RMA No. / Note"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Warehouse / Store
              </label>
              <select
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Main Warehouse">Main Warehouse</option>
                <option value="North Storage Depot">North Storage Depot</option>
                <option value="Retail Outlet Stockroom">Retail Outlet Stockroom</option>
              </select>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for Return <span className="text-red-500">*</span>
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                <option value="">Select Reason</option>
                <option value="Damaged Goods / Packaging">Damaged Goods / Packaging</option>
                <option value="Quality Defect / Expired">Quality Defect / Expired</option>
                <option value="Incorrect Items Delivered">Incorrect Items Delivered</option>
                <option value="Excess Quantity Supplied">Excess Quantity Supplied</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Credit Note Required
              </label>
              <select
                value={creditNoteRequired}
                onChange={(e) => setCreditNoteRequired(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Yes (Generate Credit Note)">Yes (Generate Credit Note)</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Damaged items, wrong items, etc."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          {/* Items to Return Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800">
                Items to Return <span className="text-red-500">*</span>
              </label>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3 w-8 text-center">#</th>
                    <th className="py-2.5 px-3 min-w-[140px]">Product / Item</th>
                    <th className="py-2.5 px-3 min-w-[140px]">Description</th>
                    <th className="py-2.5 px-2 w-20">Return Qty</th>
                    <th className="py-2.5 px-2 w-20">Unit</th>
                    <th className="py-2.5 px-2 w-24">Rate (₹)</th>
                    <th className="py-2.5 px-3 w-28 text-right">Amount (₹)</th>
                    <th className="py-2.5 px-2 w-10 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 text-center text-slate-400 font-medium">{index + 1}</td>
                      <td className="py-2 px-3">
                        <div className="relative">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                            placeholder="Search or enter item"
                            className="w-full pr-7 pl-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                            required
                          />
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                          placeholder="Description"
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          min="1"
                          value={item.returnQty}
                          onChange={(e) =>
                            handleUpdateItem(item.id, 'returnQty', Math.max(1, parseInt(e.target.value) || 0))
                          }
                          className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg text-center focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <select
                          value={item.unit}
                          onChange={(e) => handleUpdateItem(item.id, 'unit', e.target.value)}
                          className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 bg-white"
                        >
                          <option value="Pcs">Pcs</option>
                          <option value="Box">Box</option>
                          <option value="Kg">Kg</option>
                          <option value="Metre">Metre</option>
                        </select>
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) =>
                            handleUpdateItem(item.id, 'rate', Math.max(0, parseFloat(e.target.value) || 0))
                          }
                          className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg text-right focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-2 px-3 text-right font-medium text-slate-800">
                        ₹ {(item.returnQty * item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={items.length <= 1}
                          className="p-1 text-red-500 hover:bg-red-50 rounded disabled:opacity-30 disabled:pointer-events-none"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              className="mt-2.5 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Item</span>
            </button>
          </div>

          {/* Bottom Section: Notes & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Return Note (Optional)
              </label>
              <textarea
                value={returnNote}
                onChange={(e) => setReturnNote(e.target.value)}
                placeholder="Add any additional information about this return..."
                rows={4}
                className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Sub Total</span>
                <span className="font-semibold text-slate-800">
                  ₹ {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Tax (Optional)</span>
                <div className="flex items-center gap-2">
                  <select
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value={0}>GST 0%</option>
                    <option value={5}>GST 5%</option>
                    <option value={12}>GST 12%</option>
                    <option value={18}>GST 18%</option>
                    <option value={28}>GST 28%</option>
                  </select>
                  <span className="font-semibold text-slate-800 min-w-[70px] text-right">
                    ₹ {taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
                <span className="text-xs font-bold">Total Return Amount</span>
                <span className="text-sm font-bold">
                  ₹ {totalReturnAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Settled Amount</span>
                <div className="w-28">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settledAmount || ''}
                    onChange={(e) => setSettledAmount(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg text-right bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
                <span className="text-xs font-bold">Pending Credit</span>
                <span className="text-sm font-bold">
                  ₹ {pendingCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateReturnModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Create Purchase Return
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

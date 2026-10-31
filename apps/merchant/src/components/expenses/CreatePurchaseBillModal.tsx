import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar } from 'lucide-react';
import { useExpenseStore } from '../../stores/expenseStore.js';
import { LineItemsTable, LineItem } from './LineItemsTable.js';

export const CreatePurchaseBillModal: React.FC = () => {
  const {
    isCreateBillModalOpen,
    setIsCreateBillModalOpen,
    setIsAddVendorOpen,
    createPurchaseRecord,
    isSubmitting,
    vendors,
    purchaseBills,
    purchaseOrders,
  } = useExpenseStore();

  const generateNextBillNumber = () => {
    const year = new Date().getFullYear();
    const count = (purchaseBills?.length || 0) + 1;
    return `BILL-${year}-${String(count).padStart(6, '0')}`;
  };

  const defaultVendor = vendors?.[0]?.vendorName || 'Sharma Enterprises';

  const [vendor, setVendor] = useState(defaultVendor);
  const [billNumber, setBillNumber] = useState(generateNextBillNumber());
  const [billDate, setBillDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedPO, setSelectedPO] = useState('');
  const [invoiceRefNo, setInvoiceRefNo] = useState('');
  const [warehouse, setWarehouse] = useState('Main Warehouse');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [dueDate, setDueDate] = useState(
    () => new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(18);
  const [settledAmount, setSettledAmount] = useState(0);

  // Fresh initial line item ready for entry
  const [items, setItems] = useState<LineItem[]>([
    { id: 'item-1', name: '', description: '', qty: 1, unit: 'Pcs', rate: 0 },
  ]);

  useEffect(() => {
    if (isCreateBillModalOpen) {
      setBillNumber(generateNextBillNumber());
      if (vendors && vendors.length > 0 && (!vendor || vendor === 'Sharma Enterprises')) {
        setVendor(vendors[0]?.vendorName || 'Sharma Enterprises');
      }
    }
  }, [isCreateBillModalOpen, purchaseBills?.length, vendors]);

  if (!isCreateBillModalOpen) return null;

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: '',
        description: '',
        qty: 1,
        unit: 'Pcs',
        rate: 0,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleUpdateItem = (id: string, field: keyof LineItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleClearItems = () => {
    setItems([{ id: 'item-1', name: '', description: '', qty: 1, unit: 'Pcs', rate: 0 }]);
  };

  const subtotal = items.reduce((acc, item) => acc + (item.qty || 0) * (item.rate || 0), 0);
  const discountedSubtotal = Math.max(0, subtotal - (discount || 0));
  const taxAmount = (discountedSubtotal * taxRate) / 100;
  const totalAmount = discountedSubtotal + taxAmount;
  const pendingAmount = Math.max(0, totalAmount - (settledAmount || 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validItems = items.filter((i) => i.name.trim() !== '');
    const itemsToSubmit =
      validItems.length > 0
        ? validItems
        : [{ id: '1', name: 'General Inventory Goods', description: '', qty: 1, unit: 'Pcs', rate: subtotal || 100 }];

    const ok = await createPurchaseRecord({
      billNumber: billNumber || generateNextBillNumber(),
      vendorName: vendor || 'Sharma Enterprises',
      billDate: billDate ? new Date(billDate).toISOString() : new Date().toISOString(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
      items: itemsToSubmit.map((i) => ({
        productName: i.name,
        name: i.name,
        description: i.description,
        hsnCode: '3004',
        quantity: i.qty > 0 ? i.qty : 1,
        unit: i.unit || 'Pcs',
        purchaseRate: i.rate > 0 ? i.rate : 0,
        rate: i.rate > 0 ? i.rate : 0,
        taxPercent: taxRate,
        taxAmount: (i.qty * i.rate * taxRate) / 100,
        totalAmount: i.qty * i.rate + (i.qty * i.rate * taxRate) / 100,
      })),
      subtotal,
      taxAmount,
      discountAmount: discount || 0,
      totalAmount: totalAmount > 0 ? totalAmount : 1,
      settledAmount: settledAmount || 0,
      paymentStatus:
        settledAmount >= totalAmount ? 'Paid' : settledAmount > 0 ? 'Partially Paid' : 'Unpaid',
      notes: notes || undefined,
    });

    if (ok) {
      setIsCreateBillModalOpen(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Create Purchase Bill</h2>
            <p className="text-xs text-slate-500">Record a verified purchase invoice from your vendor.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateBillModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Row 1: Vendor, Bill Number, Date */}
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
                {vendors && vendors.length > 0 ? (
                  vendors.map((v) => (
                    <option key={v.id || v.vendorName} value={v.vendorName}>
                      {v.vendorName} {v.city ? `(${v.city})` : ''}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Sharma Enterprises">Sharma Enterprises</option>
                    <option value="Gupta Traders">Gupta Traders</option>
                    <option value="Verma Distributors">Verma Distributors</option>
                    <option value="Agarwal & Co.">Agarwal & Co.</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bill Number <span className="text-red-500">*</span>
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
                Bill Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={billDate}
                  onChange={(e) => setBillDate(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 2: PO Link, Vendor Invoice Ref, Warehouse */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Purchase Order (Optional)
              </label>
              <select
                value={selectedPO}
                onChange={(e) => setSelectedPO(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">None (Direct Invoicing)</option>
                {purchaseOrders && purchaseOrders.length > 0 ? (
                  purchaseOrders.map((po) => (
                    <option key={po.id || po.poNumber} value={po.poNumber}>
                      {po.poNumber} • {po.vendor} (₹{po.totalAmount})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="PO-2024-000125">PO-2024-000125</option>
                    <option value="PO-2024-000021">PO-2024-000021</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Invoice / Reference No. (Optional)
              </label>
              <input
                type="text"
                value={invoiceRefNo}
                onChange={(e) => setInvoiceRefNo(e.target.value)}
                placeholder="e.g. Vendor Invoice No."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Warehouse / Store (Optional)
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

          {/* Row 3: Payment Method & Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                required
              >
                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS/IMPS)</option>
                <option value="UPI / QR">UPI / Instant QR</option>
                <option value="Cash">Cash on Delivery / Counter</option>
                <option value="Cheque">Cheque</option>
                <option value="Credit / Debit Card">Credit / Debit Card</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Due Date (Optional)
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Line Items Table with Live Catalog Autocomplete */}
          <LineItemsTable
            items={items}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onUpdateItem={handleUpdateItem}
            onClearItems={handleClearItems}
          />

          {/* Bottom Section: Notes & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Notes & Terms (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any goods received notes, challan references or payment remarks..."
                rows={4}
                className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none bg-white"
              />
            </div>

            <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">
                  ₹ {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Discount (Optional)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount || ''}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-24 px-2 py-1 text-right text-xs border border-slate-200 rounded-lg bg-white"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span>Tax (Optional)</span>
                  <select
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="px-2 py-0.5 text-[11px] border border-slate-200 rounded-lg bg-white"
                  >
                    <option value={0}>GST 0%</option>
                    <option value={5}>GST 5%</option>
                    <option value={12}>GST 12%</option>
                    <option value={18}>GST 18%</option>
                    <option value={28}>GST 28%</option>
                  </select>
                </div>
                <span className="font-semibold text-slate-800">
                  ₹ {taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-sm font-bold text-slate-900">
                <span>Total Amount</span>
                <span>₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-dashed border-slate-200">
                <span className="text-slate-500">Settled / Paid (₹)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={settledAmount || ''}
                  onChange={(e) => setSettledAmount(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-24 px-2 py-1 text-right text-xs border border-slate-200 rounded-lg bg-white"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-amber-700">
                <span>Pending Due Balance</span>
                <span>₹ {pendingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateBillModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Recording Bill...' : 'Create Purchase Bill'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

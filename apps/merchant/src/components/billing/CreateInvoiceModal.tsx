import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, Trash2, Printer, CheckCircle2, ShieldAlert } from 'lucide-react';
import { IInvoice, IInvoiceItem, useBillingStore } from '../../stores/billingStore.js';
import { useInventoryStore } from '../../stores/inventoryStore.js';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<IInvoice> | null;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { createInvoice } = useBillingStore();
  const { items: inventoryProducts } = useInventoryStore();

  // Customer & Billing details
  const [customerName, setCustomerName] = useState('Ramesh Stores');
  const [customerPhone, setCustomerPhone] = useState('9876543210');
  const [billingAddress, setBillingAddress] = useState(
    '12, MG Road, Commercial Area, Indore, Madhya Pradesh - 452001'
  );
  const [state, setState] = useState('Madhya Pradesh (23)');
  const [gstin, setGstin] = useState('23ABCDE1234F1Z5');

  // Invoice Details
  const [invoiceType, setInvoiceType] = useState<'Tax Invoice' | 'Bill of Supply'>('Tax Invoice');
  const [invoiceDate, setInvoiceDate] = useState('11 May 2024');
  const [dueDate, setDueDate] = useState('25 May 2024');
  const [placeOfSupply, setPlaceOfSupply] = useState('Madhya Pradesh (23)');
  const [paymentTerms, setPaymentTerms] = useState('15 Days');

  // Notes
  const [notes, setNotes] = useState('');

  // Items
  const [items, setItems] = useState<IInvoiceItem[]>([
    {
      id: 'it-1',
      productId: 'inv-1',
      name: 'Men Black Round Neck T-Shirt',
      hsnSac: '61091000',
      quantity: 1,
      rate: 450.0,
      discountPercent: 0,
      taxPercent: 18,
      amount: 450.0,
    },
  ]);

  // Discounts
  const [overallDiscountPercent, setOverallDiscountPercent] = useState<number>(0);

  // Settlement & Payment
  const [paymentReceived, setPaymentReceived] = useState<number>(0);
  const [settlementMode, setSettlementMode] = useState<'upi' | 'cash' | 'card' | 'bank_transfer'>('upi');
  const [paymentDate, setPaymentDate] = useState('11 May 2024');
  const [paidStatusOption, setPaidStatusOption] = useState<'unpaid' | 'partial' | 'full'>('unpaid');
  const [saveAsDraft, setSaveAsDraft] = useState(false);

  // Prepopulate if initialData exists (e.g. from Convert Quote to Invoice)
  useEffect(() => {
    if (initialData) {
      if (initialData.customerName) setCustomerName(initialData.customerName);
      if (initialData.customerPhone) setCustomerPhone(initialData.customerPhone);
      if (initialData.customerAddress) setBillingAddress(initialData.customerAddress);
      if (initialData.customerGstin) setGstin(initialData.customerGstin);
      if (initialData.placeOfSupply) setPlaceOfSupply(initialData.placeOfSupply);
      if (initialData.type) setInvoiceType(initialData.type);
      if (initialData.items && initialData.items.length > 0) {
        setItems(initialData.items);
      }
    }
  }, [initialData]);

  if (!isOpen) return null;

  // Recalculate totals
  const subTotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const discountAmount = (subTotal * overallDiscountPercent) / 100;
  const taxableAmount = Math.max(0, subTotal - discountAmount);
  // standard 18% GST (9% CGST + 9% SGST)
  const taxTotal = Math.round((taxableAmount * 0.18) * 100) / 100;
  const totalAmount = Math.round((taxableAmount + taxTotal) * 100) / 100;

  // Auto handle settlement amounts based on paid radio
  const effectiveReceived =
    paidStatusOption === 'full'
      ? totalAmount
      : paidStatusOption === 'unpaid'
      ? 0
      : Math.min(totalAmount, paymentReceived);

  const balanceDue = Math.max(0, totalAmount - effectiveReceived);

  const handleAddItem = () => {
    const defaultProd = inventoryProducts[0];
    const newItem: IInvoiceItem = {
      id: 'it-' + Date.now(),
      productId: defaultProd ? defaultProd.id : 'PRD-' + (100 + items.length + 1),
      name: defaultProd ? defaultProd.name : 'Cotton T-Shirt',
      hsnSac: '61091000',
      quantity: 1,
      rate: 450.0,
      discountPercent: 0,
      taxPercent: 18,
      amount: 450.0,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((it) => it.id !== id));
  };

  const handleItemChange = (id: string, field: keyof IInvoiceItem, value: any) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const updated = { ...it, [field]: value };
        if (field === 'productId') {
          const matched = inventoryProducts.find((p) => p.id === value);
          if (matched) {
            updated.name = matched.name;
            updated.rate = 450; // default rate
          }
        }
        if (field === 'quantity' || field === 'rate') {
          updated.amount = updated.quantity * updated.rate;
        }
        return updated;
      })
    );
  };

  const handleSubmit = (withPrint: boolean = false) => {
    if (!customerName.trim()) {
      alert('Please enter a customer name.');
      return;
    }

    let status: any = 'issued';
    if (saveAsDraft) {
      status = 'draft';
    } else if (balanceDue === 0) {
      status = 'paid';
    } else if (effectiveReceived > 0) {
      status = 'partially_paid';
    }

    createInvoice({
      invoiceNo: '',
      date: invoiceDate,
      dueDate: dueDate,
      customerName,
      customerPhone,
      customerGstin: gstin || undefined,
      customerAddress: billingAddress,
      state,
      placeOfSupply,
      paymentTerms,
      notes,
      type: invoiceType,
      items,
      subTotal,
      discountTotal: discountAmount,
      taxTotal,
      totalAmount,
      paidAmount: effectiveReceived,
      dueAmount: balanceDue,
      status,
      settlementMode,
    });

    if (withPrint) {
      window.print();
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between shrink-0 bg-white">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Create Invoice</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Add invoice details below to create a new invoice.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - 2 Columns */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#fcfcfd]">
          {/* Left Column (Customer & Metadata) - 5 cols */}
          <div className="lg:col-span-5 space-y-5">
            {/* 1. Customer & Billing Details */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600">
                1. Customer & Billing Details
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (e.target.value === 'Ramesh Stores') setCustomerPhone('9876543210');
                      if (e.target.value === 'Sharma Garments') setCustomerPhone('8765432109');
                      if (e.target.value === 'Kiran Collection') setCustomerPhone('7654321098');
                    }}
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  >
                    <option value="Ramesh Stores">Ramesh Stores (9876543210)</option>
                    <option value="Sharma Garments">Sharma Garments (8765432109)</option>
                    <option value="Kiran Collection">Kiran Collection (7654321098)</option>
                    <option value="New Look Fashion">New Look Fashion (6543210987)</option>
                    <option value="Walk-in Retail Customer">Walk-in Retail Customer</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const name = prompt('Enter customer name:');
                      if (name) setCustomerName(name);
                    }}
                    className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold text-blue-600 flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Billing Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value.slice(0, 300))}
                    placeholder="Enter billing address"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-normal text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                  <span className="absolute right-2.5 bottom-2 text-[10px] text-slate-400">
                    {billingAddress.length}/300
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  >
                    <option value="Madhya Pradesh (23)">Madhya Pradesh (23)</option>
                    <option value="Maharashtra (27)">Maharashtra (27)</option>
                    <option value="Delhi (07)">Delhi (07)</option>
                    <option value="Gujarat (24)">Gujarat (24)</option>
                    <option value="Rajasthan (08)">Rajasthan (08)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    GSTIN (If applicable)
                  </label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="Enter GSTIN"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* 2. Invoice Details */}
            <div className="space-y-3.5 pt-4 border-t border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600">
                2. Invoice Details
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Invoice Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={invoiceType}
                    onChange={(e) => setInvoiceType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  >
                    <option value="Tax Invoice">Tax Invoice</option>
                    <option value="Bill of Supply">Bill of Supply</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Invoice Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="w-full px-3 py-2 pr-8 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Due Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3 py-2 pr-8 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Place of Supply <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={placeOfSupply}
                    onChange={(e) => setPlaceOfSupply(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  >
                    <option value="Madhya Pradesh (23)">Madhya Pradesh (23)</option>
                    <option value="Maharashtra (27)">Maharashtra (27)</option>
                    <option value="Delhi (07)">Delhi (07)</option>
                    <option value="Gujarat (24)">Gujarat (24)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment Terms
                  </label>
                  <select
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  >
                    <option value="Immediate">Immediate / Due on Receipt</option>
                    <option value="15 Days">15 Days</option>
                    <option value="30 Days">30 Days</option>
                    <option value="45 Days">45 Days</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Notes (Optional) */}
            <div className="space-y-2 pt-4 border-t border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600">
                3. Notes (Optional)
              </h3>
              <div className="relative">
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value.slice(0, 300))}
                  placeholder="Add notes or additional information..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-normal text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
                <span className="absolute right-2.5 bottom-2 text-[10px] text-slate-400">
                  {notes.length}/300
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (Items & Calculations) - 7 cols */}
          <div className="lg:col-span-7 space-y-5">
            {/* 4. Add Items */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600">
                4. Add Items
              </h3>

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                      <th className="py-2 px-3">Item / Product *</th>
                      <th className="py-2 px-2">HSN / SAC</th>
                      <th className="py-2 px-2 text-center w-14">Qty *</th>
                      <th className="py-2 px-2 text-right w-20">Rate (₹) *</th>
                      <th className="py-2 px-3 text-right w-24">Amount (₹)</th>
                      <th className="py-2 px-2 w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="p-2">
                          <select
                            value={item.productId}
                            onChange={(e) => handleItemChange(item.id, 'productId', e.target.value)}
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                          >
                            {inventoryProducts.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                            <option value="PRD-CUSTOM">Custom Line Item</option>
                          </select>
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={item.hsnSac}
                            onChange={(e) => handleItemChange(item.id, 'hsnSac', e.target.value)}
                            placeholder="HSN"
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-normal text-slate-800 focus:outline-none focus:border-blue-500"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemChange(item.id, 'quantity', Math.max(1, Number(e.target.value)))
                            }
                            className="w-full px-1.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-center text-slate-800 focus:outline-none focus:border-blue-500"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) =>
                              handleItemChange(item.id, 'rate', Math.max(0, Number(e.target.value)))
                            }
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-right text-slate-800 focus:outline-none focus:border-blue-500"
                          />
                        </td>
                        <td className="p-2 text-right font-bold text-slate-900">
                          ₹{item.amount.toFixed(2)}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={items.length <= 1}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors disabled:opacity-30"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-blue-600 hover:bg-blue-50/50 flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Another Item
                </button>

                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="font-medium">Discount:</span>
                  <select
                    value={overallDiscountPercent}
                    onChange={(e) => setOverallDiscountPercent(Number(e.target.value))}
                    className="px-2 py-1 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white"
                  >
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="10">10%</option>
                    <option value="15">15%</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 5. Total Amount Summary */}
            <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2 text-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
                5. Total Amount Summary
              </h3>

              <div className="flex justify-between text-slate-600">
                <span>Sub Total</span>
                <span className="font-semibold text-slate-800">₹{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Discount ({overallDiscountPercent}%)</span>
                <span className="font-semibold text-emerald-600">(-) ₹{discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax (CGST 9% + SGST 9%)</span>
                <span className="font-semibold text-slate-800">₹{taxTotal.toFixed(2)}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-900">
                <span>Total Amount</span>
                <span className="text-base text-blue-700 font-extrabold">₹{totalAmount.toFixed(2)}</span>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <span className="font-medium text-slate-700">Payment Received</span>
                <div className="w-36">
                  <input
                    type="number"
                    min="0"
                    max={totalAmount}
                    value={effectiveReceived}
                    onChange={(e) => {
                      setPaymentReceived(Number(e.target.value));
                      setPaidStatusOption('partial');
                    }}
                    placeholder="0.00"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-right font-bold text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <span className="font-semibold text-emerald-800">Balance / Settle Amount</span>
                <span className="font-extrabold text-emerald-700 text-sm">
                  ₹{balanceDue.toFixed(2)}
                </span>
              </div>
            </div>

            {/* 6. Payment & Settlement */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600">
                6. Payment & Settlement
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Settlement Mode
                  </label>
                  <select
                    value={settlementMode}
                    onChange={(e) => setSettlementMode(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="upi">UPI</option>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full px-3 py-2 pr-8 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 text-xs">
                  <span className="font-semibold text-slate-700 block mb-1">Mark as Paid</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paidStatus"
                      checked={paidStatusOption === 'full'}
                      onChange={() => setPaidStatusOption('full')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700">Yes, mark as fully paid</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paidStatus"
                      checked={paidStatusOption === 'partial'}
                      onChange={() => setPaidStatusOption('partial')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700">Yes, mark as partially paid</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paidStatus"
                      checked={paidStatusOption === 'unpaid'}
                      onChange={() => setPaidStatusOption('unpaid')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700">No, mark as unpaid</span>
                  </label>
                </div>

                <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl flex flex-col justify-between h-full">
                  <div>
                    <span className="text-xs font-medium text-slate-600">Settle Amount (₹)</span>
                    <div className="text-xl font-black text-emerald-600 mt-1">
                      ₹{balanceDue.toFixed(2)}
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-800 flex items-center gap-1.5 mt-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Settle amount is the balance to be received from customer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              checked={saveAsDraft}
              onChange={(e) => setSaveAsDraft(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Save as Draft</span>
          </label>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
            >
              Create Invoice
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Create Invoice & Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

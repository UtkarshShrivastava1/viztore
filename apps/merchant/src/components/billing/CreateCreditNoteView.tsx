import React, { useState } from 'react';
import {
  Calendar,
  Settings,
  Info,
  Scan,
  BadgePercent,
  Plus,
  Trash2,
  Printer,
  Send,
  Save,
  ChevronDown,
  Search,
} from 'lucide-react';
import { useBillingStore, INoteItem } from '../../stores/billingStore.js';
import { useInventoryStore } from '../../stores/inventoryStore.js';

interface CreateCreditNoteViewProps {
  onBack: () => void;
}

export const CreateCreditNoteView: React.FC<CreateCreditNoteViewProps> = ({ onBack }) => {
  const { createCreditNote } = useBillingStore();
  const { items: inventoryProducts } = useInventoryStore();

  // Customer State
  const [customerName, setCustomerName] = useState('Ramesh Stores');
  const [customerPhone, setCustomerPhone] = useState('9876543210');
  const [customerEmail, setCustomerEmail] = useState('ramesh@stores.com');
  const [customerGstin, setCustomerGstin] = useState('23ABCDE1234F1Z5');
  const [customerAddress, setCustomerAddress] = useState(
    '12, MG Road, Commercial Area, Indore, Madhya Pradesh - 452001, India'
  );
  const [placeOfSupply, setPlaceOfSupply] = useState('Madhya Pradesh (23)');

  // Credit Note Details
  const [noteNo, setNoteNo] = useState('CN-1003');
  const [invoiceNo, setInvoiceNo] = useState('INV-1456');
  const [noteDate, setNoteDate] = useState('05 May 2024');
  const [originalInvoiceDate, setOriginalInvoiceDate] = useState('05 May 2024');
  const [reason, setReason] = useState('Goods Returned');

  // Other Details
  const [currency, setCurrency] = useState('INR - Indian Rupee (₹)');
  const [paymentTerms, setPaymentTerms] = useState('30 Days');
  const [salesPerson, setSalesPerson] = useState('Harish Kumar');
  const [notes, setNotes] = useState('');

  // Barcode scanner simulation
  const [isBarcodeScanning, setIsBarcodeScanning] = useState(false);

  // Line items matching mockup 5.7.png
  const [items, setItems] = useState<INoteItem[]>([
    {
      id: 'cni-1',
      productId: 'PRD-101',
      name: 'Cotton T-Shirt (M)',
      hsnSac: '61091000',
      description: '100% Cotton T-Shirt Size: M, Color: Blue',
      invoicedQty: 100,
      returnedQty: 20,
      quantity: 20,
      unit: 'Pcs',
      rate: 450.0,
      discountPercent: 5,
      taxPercent: 18,
      amount: 8478.0,
    },
    {
      id: 'cni-2',
      productId: 'PRD-102',
      name: 'Denim Jeans (32)',
      hsnSac: '62034200',
      description: 'Denim Jeans Size: 32',
      invoicedQty: 20,
      returnedQty: 5,
      quantity: 5,
      unit: 'Pcs',
      rate: 850.0,
      discountPercent: 0,
      taxPercent: 18,
      amount: 4465.0,
    },
    {
      id: 'cni-3',
      productId: 'PRD-103',
      name: 'Sneakers',
      hsnSac: '64039990',
      description: 'Sports Sneakers Size: 9',
      invoicedQty: 10,
      returnedQty: 2,
      quantity: 2,
      unit: 'Pair',
      rate: 1200.0,
      discountPercent: 10,
      taxPercent: 18,
      amount: 2025.6,
    },
  ]);

  const [terms, setTerms] = useState(
    `1. This credit note is issued against the original invoice mentioned above.\n2. The amount will be adjusted in your next invoice or refunded as per agreed terms.\n3. This credit note is valid only for the items and quantity mentioned.\n4. Goods once sold will not be taken back unless agreed.`
  );

  // Recompute totals dynamically based on Returned Qty
  const totalBeforeDiscount = items.reduce(
    (sum, item) => sum + item.returnedQty * item.rate,
    0
  );
  const totalDiscount = items.reduce(
    (sum, item) => sum + (item.returnedQty * item.rate * (item.discountPercent || 0)) / 100,
    0
  );
  const taxableAmount = Math.max(0, totalBeforeDiscount - totalDiscount);
  const totalTax = items.reduce((sum, item) => {
    const itemNet = item.returnedQty * item.rate * (1 - (item.discountPercent || 0) / 100);
    return sum + (itemNet * (item.taxPercent || 18)) / 100;
  }, 0);
  const totalCreditAmount = Math.round((taxableAmount + totalTax) * 100) / 100;
  const youSavePercent =
    totalBeforeDiscount > 0 ? (totalDiscount / totalBeforeDiscount) * 100 : 0;

  const handleReturnedQtyChange = (id: string, qty: number) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const validQty = Math.max(0, Math.min(it.invoicedQty, qty));
        const gross = validQty * it.rate;
        const disc = (gross * (it.discountPercent || 0)) / 100;
        const net = gross - disc;
        const tax = (net * (it.taxPercent || 18)) / 100;
        return {
          ...it,
          returnedQty: validQty,
          quantity: validQty,
          amount: Math.round((net + tax) * 100) / 100,
        };
      })
    );
  };

  const handleAddItem = () => {
    const defaultProd = inventoryProducts[0];
    const newItem: INoteItem = {
      id: 'cni-' + Date.now(),
      productId: defaultProd ? defaultProd.id : 'PRD-' + (100 + items.length + 1),
      name: defaultProd ? defaultProd.name : 'Casual Shirt',
      hsnSac: '62052000',
      description: 'Goods returned from invoice',
      invoicedQty: 20,
      returnedQty: 5,
      quantity: 5,
      unit: 'Pcs',
      rate: 550.0,
      discountPercent: 0,
      taxPercent: 18,
      amount: 3245.0,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((it) => it.id !== id));
  };

  // Barcode scanner simulation
  const handleBarcodeScan = () => {
    setIsBarcodeScanning(true);
    setTimeout(() => {
      setIsBarcodeScanning(false);
      const randomProduct = inventoryProducts[0];
      if (randomProduct) {
        alert(
          `Scanned product "${randomProduct.name}" (Barcode: ${randomProduct.barcode || '8901234567890'}). Item matched in original invoice INV-1456.`
        );
      }
    }, 800);
  };

  const handleSave = (status: 'draft' | 'issued' = 'issued', print: boolean = false) => {
    createCreditNote({
      noteNo,
      invoiceNo,
      date: noteDate,
      originalInvoiceDate,
      expiryDate: '04 Nov 2024',
      customerName,
      customerPhone,
      customerEmail,
      customerGstin,
      customerAddress,
      placeOfSupply,
      reason,
      salesPerson,
      paymentTerms,
      notes,
      terms,
      items,
      subTotal: totalBeforeDiscount,
      discountTotal: totalDiscount,
      taxTotal: totalTax,
      totalAmount: totalCreditAmount,
      usedAmount: 0,
      unusedAmount: totalCreditAmount,
      status,
    });

    if (print) {
      window.print();
    }
    onBack();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Create Credit Note</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create a credit note to reduce the amount for a customer.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSave('draft')}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave('issued')}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </button>
          <button
            type="button"
            onClick={() => handleSave('issued', true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Save & Print
          </button>
          <button
            type="button"
            onClick={() => handleSave('issued')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-800 hover:bg-blue-900 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            Send Credit Note
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 4 Cards Row: Customer, Address, Credit Note Details, Other Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Customer Details */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
          <span className="block text-[11px] font-bold text-slate-700">Customer Details</span>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Customer <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-1.5">
              <select
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Ramesh Stores">Ramesh Stores</option>
                <option value="Sharma Electronics">Sharma Electronics</option>
                <option value="Kiran Mart">Kiran Mart</option>
              </select>
              <button
                type="button"
                className="p-1.5 border border-slate-300 rounded-xl text-blue-600 hover:bg-slate-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50/70 border border-slate-200/70 rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">{customerName}</span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                GST Registered
              </span>
            </div>
            <div className="text-slate-500 font-mono text-[11px]">GSTIN: {customerGstin}</div>
            <div className="text-slate-500 text-[11px]">
              Phone: {customerPhone} &bull; Email: {customerEmail}
            </div>
            <button
              type="button"
              className="text-[11px] font-semibold text-blue-600 hover:underline pt-1 inline-block"
            >
              View Full Details
            </button>
          </div>
        </div>

        {/* Card 2: Billing Address */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
          <span className="block text-[11px] font-bold text-slate-700">Billing Address</span>
          <div className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-2.5 rounded-xl border border-slate-200/60">
            <div className="font-semibold text-slate-800">{customerName}</div>
            <div>{customerAddress}</div>
            <div className="mt-1 font-medium text-slate-700">State: Madhya Pradesh (23)</div>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <label className="text-[11px] font-semibold text-slate-600">Place of Supply</label>
              <Info className="w-3 h-3 text-slate-400" />
            </div>
            <select
              value={placeOfSupply}
              onChange={(e) => setPlaceOfSupply(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="Madhya Pradesh (23)">Madhya Pradesh (23)</option>
              <option value="Maharashtra (27)">Maharashtra (27)</option>
            </select>
          </div>
        </div>

        {/* Card 3: Credit Note Details */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-2.5">
          <span className="block text-[11px] font-bold text-slate-700">Credit Note Details</span>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Credit Note No. <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={noteNo}
                onChange={(e) => setNoteNo(e.target.value)}
                className="w-full px-2.5 py-1.5 pr-8 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
              />
              <Settings className="w-3.5 h-3.5 text-blue-600 absolute right-2.5 top-2.5 cursor-pointer" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Invoice No. <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                className="w-full px-2.5 py-1.5 pr-8 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-blue-600 absolute right-2.5 top-2.5 cursor-pointer" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Credit Note Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={noteDate}
                onChange={(e) => setNoteDate(e.target.value)}
                className="w-full px-2.5 py-1.5 pr-8 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Reason <span className="text-rose-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="Goods Returned">Goods Returned</option>
              <option value="Pricing Error">Pricing Error</option>
              <option value="Damaged Goods">Damaged Goods</option>
              <option value="Order Cancellation">Order Cancellation</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Card 4: Other Details */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-2.5">
          <span className="block text-[11px] font-bold text-slate-700">Other Details</span>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="INR - Indian Rupee (₹)">INR - Indian Rupee (₹)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Payment Terms
            </label>
            <select
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="30 Days">30 Days</option>
              <option value="Immediate">Immediate</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Sales Person
            </label>
            <select
              value={salesPerson}
              onChange={(e) => setSalesPerson(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="Harish Kumar">Harish Kumar</option>
              <option value="Sujal Verma">Sujal Verma</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes or special instructions (optional)"
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-normal text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Items Section (5.7.png) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Items (Select items to apply credit)
          </h3>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleBarcodeScan}
              disabled={isBarcodeScanning}
              className="px-3 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Scan className="w-4 h-4" />
              <span>{isBarcodeScanning ? 'Scanning...' : 'Scan & Add Items'}</span>
            </button>
            <button
              type="button"
              className="px-3 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <BadgePercent className="w-4 h-4" />
              <span>Price List</span>
            </button>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                <th className="py-2.5 px-3 w-8">#</th>
                <th className="py-2.5 px-3 w-44">Item / Product *</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-2 text-center w-24">Qty (Invoiced)</th>
                <th className="py-2.5 px-2 text-center w-24">Returned Qty *</th>
                <th className="py-2.5 px-2 text-center w-14">Unit</th>
                <th className="py-2.5 px-2 text-right w-24">Unit Price (₹)</th>
                <th className="py-2.5 px-2 text-center w-24">Discount</th>
                <th className="py-2.5 px-2 text-center w-24">Tax</th>
                <th className="py-2.5 px-3 text-right w-28">Amount (₹)</th>
                <th className="py-2.5 px-2 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {items.map((item, idx) => {
                const gross = item.returnedQty * item.rate;
                const disc = (gross * (item.discountPercent || 0)) / 100;
                const net = gross - disc;
                const tax = (net * (item.taxPercent || 18)) / 100;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="p-2.5 text-center text-slate-400 font-mono">{idx + 1}</td>
                    <td className="p-2.5">
                      <div className="font-bold text-slate-800">{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {item.hsnSac}
                      </div>
                    </td>
                    <td className="p-2.5 text-slate-700">{item.description}</td>
                    <td className="p-2 text-center font-medium text-slate-600 bg-slate-50/50">
                      {item.invoicedQty} {item.unit}
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        max={item.invoicedQty}
                        value={item.returnedQty}
                        onChange={(e) =>
                          handleReturnedQtyChange(item.id, Number(e.target.value))
                        }
                        className="w-full px-2 py-1 bg-white border border-blue-400 rounded-lg text-xs font-black text-center text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </td>
                    <td className="p-2 text-center text-slate-700">{item.unit}</td>
                    <td className="p-2 text-right font-semibold text-slate-800">
                      {item.rate.toFixed(2)}
                    </td>
                    <td className="p-2 text-center">
                      <div className="text-[11px] font-semibold text-slate-700">
                        {item.discountPercent}%
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">₹{disc.toFixed(2)}</div>
                    </td>
                    <td className="p-2 text-center">
                      <div className="text-[11px] font-semibold text-slate-700">
                        {item.taxPercent}% (IGST)
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">₹{tax.toFixed(2)}</div>
                    </td>
                    <td className="p-2.5 text-right font-black text-slate-900 tabular-nums">
                      ₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-2.5 text-center">
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
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddItem}
              className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold text-blue-600 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Item
            </button>
            <button
              type="button"
              onClick={handleAddItem}
              className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold text-blue-600 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Row
            </button>
          </div>
          <span className="text-[11px] text-slate-400">You can add maximum 500 items</span>
        </div>
      </div>

      {/* Bottom Section: Terms & Conditions + Credit Summary (5.7.png) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Terms & Conditions */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
          <span className="block text-xs font-bold text-slate-800">Terms & Conditions</span>
          <div className="relative">
            <textarea
              rows={6}
              value={terms}
              onChange={(e) => setTerms(e.target.value.slice(0, 500))}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-normal text-slate-700 leading-relaxed focus:outline-none focus:border-blue-500"
            />
            <span className="absolute right-3 bottom-2 text-[10px] text-slate-400">
              {terms.length} / 500
            </span>
          </div>
        </div>

        {/* Right: Summary calculation */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Total Before Discount</span>
              <span className="font-semibold text-slate-900 tabular-nums">
                ₹ {totalBeforeDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span>Total Discount</span>
              <span className="font-semibold tabular-nums">
                - ₹ {totalDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Taxable Amount</span>
              <span className="font-semibold text-slate-900 tabular-nums">
                ₹ {taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-emerald-600">
              <span>Total Tax (IGST 18%)</span>
              <span className="font-semibold tabular-nums">
                + ₹ {totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-extrabold text-slate-900">Total Credit Amount</span>
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                ₹ {totalCreditAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 italic text-right mt-1">
              (Fifteen Thousand Seven Hundred Seventy Three Rupees Sixty Paise Only)
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-800">You Save</span>
            <span className="font-bold text-emerald-700">
              ₹ {totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (14.44%)
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => handleSave('draft')}
          className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={() => handleSave('issued')}
          className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => handleSave('issued', true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          Save & Print
        </button>
        <button
          type="button"
          onClick={() => handleSave('issued')}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-800 hover:bg-blue-900 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          Send Credit Note
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

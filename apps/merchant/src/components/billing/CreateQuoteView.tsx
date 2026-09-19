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
} from 'lucide-react';
import { useBillingStore, IInvoiceItem } from '../../stores/billingStore.js';
import { useInventoryStore } from '../../stores/inventoryStore.js';

interface CreateQuoteViewProps {
  onBack: () => void;
}

export const CreateQuoteView: React.FC<CreateQuoteViewProps> = ({ onBack }) => {
  const { createQuote } = useBillingStore();
  const { items: inventoryProducts } = useInventoryStore();

  // Header & Customer State
  const [customerName, setCustomerName] = useState('Ramesh Stores');
  const [customerPhone, setCustomerPhone] = useState('9876543210');
  const [customerEmail, setCustomerEmail] = useState('ramesh@stores.com');
  const [customerGstin, setCustomerGstin] = useState('23ABCDE1234F1Z5');
  const [customerAddress, setCustomerAddress] = useState(
    '12, MG Road, Commercial Area, Indore, Madhya Pradesh - 452001, India'
  );
  const [placeOfSupply, setPlaceOfSupply] = useState('Madhya Pradesh (23)');

  // Quote Metadata
  const [quoteNo, setQuoteNo] = useState('Q-1025');
  const [quoteDate, setQuoteDate] = useState('11 May 2024');
  const [validUntil, setValidUntil] = useState('25 May 2024');
  const [referenceNo, setReferenceNo] = useState('PO-4587');
  const [currency, setCurrency] = useState('INR - Indian Rupee (₹)');
  const [paymentTerms, setPaymentTerms] = useState('30 Days');
  const [salesPerson, setSalesPerson] = useState('Harish Kumar');
  const [notes, setNotes] = useState('');

  // Barcode scanner modal simulation
  const [isBarcodeScanning, setIsBarcodeScanning] = useState(false);

  // Line items matching mockup 5.5.png
  const [items, setItems] = useState<IInvoiceItem[]>([
    {
      id: 'qi-1',
      productId: 'PRD-101',
      name: 'Cotton T-Shirt (M)',
      hsnSac: '61091000',
      description: '100% Cotton T-Shirt Size: M, Color: Blue',
      quantity: 50,
      unit: 'Pcs',
      rate: 450.0,
      discountPercent: 5,
      taxPercent: 18,
      amount: 51975.0,
    },
    {
      id: 'qi-2',
      productId: 'PRD-102',
      name: 'Denim Jeans (32)',
      hsnSac: '62034200',
      description: 'Denim Jeans Size: 32',
      quantity: 20,
      unit: 'Pcs',
      rate: 850.0,
      discountPercent: 0,
      taxPercent: 18,
      amount: 20060.0,
    },
    {
      id: 'qi-3',
      productId: 'PRD-103',
      name: 'Sneakers',
      hsnSac: '64039990',
      description: 'Sports Sneakers Size: 9',
      quantity: 10,
      unit: 'Pair',
      rate: 1200.0,
      discountPercent: 10,
      taxPercent: 18,
      amount: 10980.0,
    },
  ]);

  const [terms, setTerms] = useState(
    `1. This is an estimate/quote only and not a final invoice.\n2. Prices are valid till the expiry date mentioned above.\n3. Goods once sold will not be taken back.\n4. Payment to be made as per the agreed payment terms.`
  );

  // Compute live totals
  const totalBeforeDiscount = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const totalDiscount = items.reduce(
    (sum, item) => sum + (item.quantity * item.rate * (item.discountPercent || 0)) / 100,
    0
  );
  const taxableAmount = Math.max(0, totalBeforeDiscount - totalDiscount);
  const totalTax = items.reduce((sum, item) => {
    const itemNet = item.quantity * item.rate * (1 - (item.discountPercent || 0) / 100);
    return sum + (itemNet * (item.taxPercent || 18)) / 100;
  }, 0);
  const grandTotal = Math.round((taxableAmount + totalTax) * 100) / 100;
  const youSavePercent = totalBeforeDiscount > 0 ? (totalDiscount / totalBeforeDiscount) * 100 : 0;

  const handleAddItem = () => {
    const defaultProd = inventoryProducts[0];
    const newItem: IInvoiceItem = {
      id: 'qi-' + Date.now(),
      productId: defaultProd ? defaultProd.id : 'PRD-' + (100 + items.length + 1),
      name: defaultProd ? defaultProd.name : 'Formal Shirt',
      hsnSac: '62052000',
      description: 'Standard product line',
      quantity: 10,
      unit: 'Pcs',
      rate: 550.0,
      discountPercent: 0,
      taxPercent: 18,
      amount: 6490.0,
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
        const gross = updated.quantity * updated.rate;
        const disc = (gross * (updated.discountPercent || 0)) / 100;
        const net = gross - disc;
        const tax = (net * (updated.taxPercent || 18)) / 100;
        updated.amount = Math.round((net + tax) * 100) / 100;
        return updated;
      })
    );
  };

  // Barcode scanner simulator
  const handleBarcodeScan = () => {
    setIsBarcodeScanning(true);
    setTimeout(() => {
      setIsBarcodeScanning(false);
      const randomProduct = inventoryProducts[Math.floor(Math.random() * inventoryProducts.length)];
      if (randomProduct) {
        const scannedItem: IInvoiceItem = {
          id: 'qi-' + Date.now(),
          productId: randomProduct.id,
          name: randomProduct.name,
          hsnSac: '61091000',
          description: `${randomProduct.brand || 'Apparel'} - ${randomProduct.color || 'Standard'} (${randomProduct.size || 'M'})`,
          quantity: 12,
          unit: 'Pcs',
          rate: randomProduct.stockValue ? Math.round(randomProduct.stockValue / Math.max(1, randomProduct.stock)) : 499,
          discountPercent: 5,
          taxPercent: 18,
          amount: 5888.0,
        };
        const gross = scannedItem.quantity * scannedItem.rate;
        const disc = (gross * scannedItem.discountPercent) / 100;
        const tax = ((gross - disc) * scannedItem.taxPercent) / 100;
        scannedItem.amount = Math.round((gross - disc + tax) * 100) / 100;

        setItems((prev) => [...prev, scannedItem]);
        alert(`Barcode scanned: Added "${randomProduct.name}" (Barcode: ${randomProduct.barcode || '8901234567890'})`);
      }
    }, 900);
  };

  const handleSave = (status: 'draft' | 'sent' = 'sent', print: boolean = false) => {
    createQuote({
      quoteNo,
      date: quoteDate,
      validUntil,
      validDaysText: '(14 days left)',
      customerName,
      customerPhone,
      customerEmail,
      customerGstin,
      customerAddress,
      placeOfSupply,
      referenceNo,
      currency,
      paymentTerms,
      salesPerson,
      notes,
      terms,
      items,
      subTotal: totalBeforeDiscount,
      discountTotal: totalDiscount,
      taxTotal: totalTax,
      totalAmount: grandTotal,
      status,
      createdBy: salesPerson,
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
          <h2 className="text-xl font-bold text-slate-900">Create Estimate / Quote</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create a new estimate/quote for your customer.
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
            onClick={() => handleSave('sent')}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </button>
          <button
            type="button"
            onClick={() => handleSave('sent', true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Save & Print
          </button>
          <button
            type="button"
            onClick={() => handleSave('sent')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-800 hover:bg-blue-900 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            Send Quote
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 4 Cards Row: Customer, Address, Quote Details, Other Details */}
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
                <option value="Sharma Garments">Sharma Garments</option>
                <option value="Kiran Collection">Kiran Collection</option>
              </select>
              <button
                type="button"
                onClick={() => alert('Add customer dialog')}
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
              <option value="Gujarat (24)">Gujarat (24)</option>
            </select>
          </div>
        </div>

        {/* Card 3: Quote Details */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-2.5">
          <span className="block text-[11px] font-bold text-slate-700">Quote Details</span>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Quote No. <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={quoteNo}
                onChange={(e) => setQuoteNo(e.target.value)}
                className="w-full px-2.5 py-1.5 pr-8 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
              />
              <Settings className="w-3.5 h-3.5 text-blue-600 absolute right-2.5 top-2.5 cursor-pointer" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Quote Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={quoteDate}
                onChange={(e) => setQuoteDate(e.target.value)}
                className="w-full px-2.5 py-1.5 pr-8 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-600">
                Valid Until <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-emerald-600 font-semibold">(14 days left)</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-2.5 py-1.5 pr-8 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Reference (PO / ENQ No.)
            </label>
            <input
              type="text"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
            />
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
              <option value="USD - US Dollar ($)">USD - US Dollar ($)</option>
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
              <option value="15 Days">15 Days</option>
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

      {/* Items Section (5.5.png) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Items</h3>
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
              onClick={() => alert('Opening product price list catalog')}
              className="px-3 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <BadgePercent className="w-4 h-4" />
              <span>Price List</span>
            </button>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                <th className="py-2.5 px-3 w-8">#</th>
                <th className="py-2.5 px-3 w-48">Item / Product *</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-2 text-center w-16">Qty *</th>
                <th className="py-2.5 px-2 text-center w-16">Unit</th>
                <th className="py-2.5 px-2 text-right w-24">Price (₹)</th>
                <th className="py-2.5 px-2 text-center w-28">Discount</th>
                <th className="py-2.5 px-2 text-center w-28">Tax</th>
                <th className="py-2.5 px-3 text-right w-28">Amount (₹)</th>
                <th className="py-2.5 px-2 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {items.map((item, idx) => {
                const itemGross = item.quantity * item.rate;
                const itemDisc = (itemGross * (item.discountPercent || 0)) / 100;
                const itemTax = ((itemGross - itemDisc) * (item.taxPercent || 18)) / 100;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="p-2.5 text-center text-slate-400 font-mono">{idx + 1}</td>
                    <td className="p-2.5">
                      <select
                        value={item.name}
                        onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                      >
                        <option value="Cotton T-Shirt (M)">Cotton T-Shirt (M)</option>
                        <option value="Denim Jeans (32)">Denim Jeans (32)</option>
                        <option value="Sneakers">Sneakers</option>
                        <option value="Polo T-Shirt">Polo T-Shirt</option>
                      </select>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {item.hsnSac}
                      </div>
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={item.description || ''}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700"
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
                        className="w-full px-1.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center text-slate-800"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="text"
                        value={item.unit || 'Pcs'}
                        onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                        className="w-full px-1 py-1 bg-white border border-slate-200 rounded-lg text-xs text-center text-slate-700"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        value={item.rate}
                        onChange={(e) =>
                          handleItemChange(item.id, 'rate', Math.max(0, Number(e.target.value)))
                        }
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-right text-slate-800"
                      />
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discountPercent || 0}
                          onChange={(e) =>
                            handleItemChange(item.id, 'discountPercent', Number(e.target.value))
                          }
                          className="w-10 px-1 py-1 bg-white border border-slate-200 rounded-lg text-xs text-center"
                        />
                        <span className="text-[11px] font-mono text-slate-500">
                          ₹{itemDisc.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <select
                          value={item.taxPercent || 18}
                          onChange={(e) =>
                            handleItemChange(item.id, 'taxPercent', Number(e.target.value))
                          }
                          className="px-1 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-medium"
                        >
                          <option value="18">18% (IGST)</option>
                          <option value="12">12%</option>
                          <option value="5">5%</option>
                          <option value="0">0%</option>
                        </select>
                        <span className="text-[11px] font-mono text-slate-500">
                          ₹{itemTax.toFixed(2)}
                        </span>
                      </div>
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

      {/* Bottom Section: Terms & Conditions + Tax/Amount Summary (5.5.png) */}
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
              <span className="text-sm font-extrabold text-slate-900">Total Amount</span>
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                ₹ {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 italic text-right mt-1">
              (Ninety Four Thousand Nine Hundred Seven Rupees Only)
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-800">You Save</span>
            <span className="font-bold text-emerald-700">
              ₹ {totalDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} ({youSavePercent.toFixed(2)}%)
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
          onClick={() => handleSave('sent')}
          className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => handleSave('sent', true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          Save & Print
        </button>
        <button
          type="button"
          onClick={() => handleSave('sent')}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-800 hover:bg-blue-900 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          Send Quote
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

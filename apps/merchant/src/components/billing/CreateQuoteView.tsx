import React, { useState, useMemo, useEffect } from 'react';
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
import { useCustomerStore } from '../../stores/customerStore.js';
import { useInventoryStore } from '../../stores/inventoryStore.js';
import { INDIAN_STATES, DEFAULT_INDIAN_STATE } from '@repo/shared-types';

interface CreateQuoteViewProps {
  onBack: () => void;
}

export const CreateQuoteView: React.FC<CreateQuoteViewProps> = ({ onBack }) => {
  const { createQuote, quotes, invoices } = useBillingStore();
  const { customers, addCustomer } = useCustomerStore();
  const { items: inventoryProducts } = useInventoryStore();

  // Deduplicate and extract all customers who have actual history with this store
  const customersWithHistory = useMemo(() => {
    const map = new Map<string, {
      key: string;
      name: string;
      phone: string;
      email: string;
      address: string;
      state: string;
      gstin: string;
      orderCount: number;
    }>();

    // From invoices
    invoices.forEach((inv) => {
      const name = inv.customerName?.trim();
      if (!name) return;
      const key = (inv.customerPhone?.trim() || name).toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.orderCount += 1;
      } else {
        map.set(key, {
          key,
          name: inv.customerName,
          phone: inv.customerPhone || '',
          email: '',
          address: inv.customerAddress || '',
          state: inv.state || DEFAULT_INDIAN_STATE,
          gstin: inv.customerGstin || '',
          orderCount: 1,
        });
      }
    });

    // From registered customers
    customers.forEach((c) => {
      const name = c.name?.trim();
      if (!name) return;
      const key = (c.phone?.trim() || name).toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.orderCount = Math.max(existing.orderCount, c.totalOrders || 1);
        if (!existing.address && c.billingAddress?.addressLine1) {
          existing.address = `${c.billingAddress.addressLine1}, ${c.billingAddress.city}`;
        }
        if (!existing.email && c.email) existing.email = c.email;
        if (!existing.gstin && c.gstin) existing.gstin = c.gstin;
      } else if (c.totalOrders > 0 || (c.recentOrders && c.recentOrders.length > 0)) {
        map.set(key, {
          key,
          name: c.name,
          phone: c.phone || '',
          email: c.email || '',
          address: c.billingAddress ? `${c.billingAddress.addressLine1}, ${c.billingAddress.city}` : '',
          state: c.billingAddress?.state || DEFAULT_INDIAN_STATE,
          gstin: c.gstin || '',
          orderCount: c.totalOrders || 1,
        });
      }
    });

    return Array.from(map.values());
  }, [invoices, customers]);

  // Header & Customer State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerGstin, setCustomerGstin] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [placeOfSupply, setPlaceOfSupply] = useState(DEFAULT_INDIAN_STATE);

  const [isNewCustomerMode, setIsNewCustomerMode] = useState(() => customersWithHistory.length === 0);
  const [selectedHistoryKey, setSelectedHistoryKey] = useState('');

  // Quote Metadata
  const [quoteNo, setQuoteNo] = useState(() => 'Q-' + (1001 + (quotes?.length || 0)));
  const [quoteDate, setQuoteDate] = useState(() => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
  const [validUntil, setValidUntil] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 14); return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); });
  const [referenceNo, setReferenceNo] = useState('');
  const [currency, setCurrency] = useState('INR - Indian Rupee (₹)');
  const [paymentTerms, setPaymentTerms] = useState('30 Days');
  const [salesPerson, setSalesPerson] = useState('Store Staff');
  const [notes, setNotes] = useState('');

  // Barcode scanner modal simulation
  const [isBarcodeScanning, setIsBarcodeScanning] = useState(false);

  // Line items matching mockup 5.5.png
  const [items, setItems] = useState<IInvoiceItem[]>([
    {
      id: 'qi-1',
      productId: '',
      name: '',
      hsnSac: '',
      description: '',
      quantity: 1,
      unit: 'Pcs',
      rate: 0,
      discountPercent: 0,
      taxPercent: 18,
      amount: 0,
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
    const newItem: IInvoiceItem = {
      id: 'qi-' + Date.now(),
      productId: '',
      name: '',
      hsnSac: '',
      description: '',
      quantity: 1,
      unit: 'Pcs',
      rate: 0,
      discountPercent: 0,
      taxPercent: 18,
      amount: 0,
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

    if (customerName.trim()) {
      const exists = customers.some(
        (c) =>
          c.name.trim().toLowerCase() === customerName.trim().toLowerCase() ||
          (customerPhone && c.phone && c.phone.replace(/\D/g, '') === customerPhone.replace(/\D/g, ''))
      );
      if (!exists) {
        addCustomer({
          name: customerName,
          customerType: 'Retailer',
          status: 'active',
          phone: customerPhone || '',
          email: customerEmail || '',
          gstin: customerGstin || undefined,
          billingAddress: {
            addressLine1: customerAddress || 'In-store retail',
            city: 'Local',
            state: placeOfSupply,
            pincode: '',
            country: 'India',
            sameAsShipping: true,
          },
          paymentTerms,
          creditPeriodDays: 30,
        });
      }
    }

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
          <div className="flex items-center justify-between">
            <span className="block text-[11px] font-bold text-slate-700">Customer Details</span>
            {customersWithHistory.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (isNewCustomerMode) {
                    setIsNewCustomerMode(false);
                  } else {
                    setIsNewCustomerMode(true);
                    setCustomerName('');
                    setCustomerPhone('');
                    setCustomerEmail('');
                    setCustomerGstin('');
                    setCustomerAddress('');
                    setSelectedHistoryKey('');
                  }
                }}
                className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                {isNewCustomerMode
                  ? `← History (${customersWithHistory.length})`
                  : '+ Add New'}
              </button>
            )}
          </div>

          {!isNewCustomerMode && customersWithHistory.length > 0 ? (
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Customer <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-1.5">
                <select
                  value={selectedHistoryKey}
                  onChange={(e) => {
                    const val = e.target.value;
                    const found = customersWithHistory.find((c) => c.key === val);
                    if (found) {
                      setSelectedHistoryKey(val);
                      setCustomerName(found.name);
                      setCustomerPhone(found.phone);
                      setCustomerEmail(found.email);
                      setCustomerGstin(found.gstin);
                      setCustomerAddress(found.address);
                      setPlaceOfSupply(found.state || DEFAULT_INDIAN_STATE);
                    } else {
                      setSelectedHistoryKey('');
                      setCustomerName('');
                      setCustomerPhone('');
                    }
                  }}
                  className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select past customer...</option>
                  {customersWithHistory.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.name} {c.phone ? `(${c.phone})` : ''} • {c.orderCount} past bills
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    setIsNewCustomerMode(true);
                    setCustomerName('');
                    setCustomerPhone('');
                    setCustomerEmail('');
                    setCustomerGstin('');
                    setCustomerAddress('');
                    setSelectedHistoryKey('');
                  }}
                  className="p-1.5 border border-slate-300 rounded-xl text-blue-600 hover:bg-slate-50 transition-colors"
                  title="Add new customer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {customerName ? (
                <div className="p-2.5 bg-slate-50/70 border border-slate-200/70 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{customerName}</span>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Verified History
                    </span>
                  </div>
                  {customerGstin && (
                    <div className="text-slate-500 font-mono text-[11px]">GSTIN: {customerGstin}</div>
                  )}
                  <div className="text-slate-500 text-[11px]">
                    Phone: {customerPhone || 'N/A'} {customerEmail ? `• Email: ${customerEmail}` : ''}
                  </div>
                </div>
              ) : (
                <p className="text-[10px] text-slate-400">
                  Select a past customer or click + to enter a new name.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Customer Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter new customer name *"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Mobile number"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                    GSTIN
                  </label>
                  <input
                    type="text"
                    value={customerGstin}
                    onChange={(e) => setCustomerGstin(e.target.value)}
                    placeholder="GSTIN (optional)"
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <p className="text-[10px] text-slate-400">
                {customersWithHistory.length === 0
                  ? 'No prior customer history found. Enter new customer details.'
                  : 'Customer has no prior history. Enter new customer details.'}
              </p>
            </div>
          )}
        </div>

        {/* Card 2: Billing Address */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
          <span className="block text-[11px] font-bold text-slate-700">Billing Address</span>
          <div className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-2.5 rounded-xl border border-slate-200/60">
            <div className="font-semibold text-slate-800">{customerName}</div>
            <div>{customerAddress}</div>
            <div className="mt-1 font-medium text-slate-700">State: {placeOfSupply || DEFAULT_INDIAN_STATE}</div>
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
              {INDIAN_STATES.map((st) => (
                <option key={st.code} value={st.label}>
                  {st.label}
                </option>
              ))}
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
              <option value="Store Staff (Lead)">Store Staff (Lead)</option>
              <option value="Store Associate">Store Associate</option>
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

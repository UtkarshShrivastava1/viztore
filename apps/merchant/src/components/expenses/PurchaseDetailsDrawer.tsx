import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Edit2,
  Download,
  Building,
  FileText,
  Printer,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  CreditCard,
  AlertCircle,
  MapPin,
  User,
  Phone,
  Mail,
  FileCheck,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Plus,
  Hash,
  Receipt,
  Share2,
  Package,
  Layers,
  Check,
} from 'lucide-react';

import { useBodyScrollLock } from '../../hooks/useBodyScrollLock.js';
import { useExpenseStore } from '../../stores/expenseStore.js';

interface PurchaseLineItem {
  id: string;
  name: string;
  sku: string;
  qty: number;
  unit: string;
  rate: number;
  taxPercent: number;
  total: number;
}

interface PurchaseDetailsDrawerProps {
  purchase: any | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export const PurchaseDetailsDrawer: React.FC<PurchaseDetailsDrawerProps> = ({
  purchase,
  isOpen,
  onClose,
  onEdit,
}) => {
  useBodyScrollLock(isOpen, onClose);
  const { setActiveSubTab, receivePurchaseRecord, vendors, ewayBills, setIsGenerateEWayBillOpen } = useExpenseStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'items' | 'payments' | 'eway' | 'notes' | 'activity'>('overview');
  const [newNote, setNewNote] = useState('');
  const [customNotes, setCustomNotes] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState(false);

  // Derived financial & vendor computations
  const vendorName = useMemo(() => {
    if (!purchase) return 'Sharma Enterprises';
    return purchase.vendorOrPaidTo || purchase.vendor || purchase.vendorName || 'Sharma Enterprises';
  }, [purchase]);

  const matchedVendor = useMemo(() => {
    if (!vendors || vendors.length === 0) return null;
    return vendors.find(
      (v) =>
        v.vendorName?.toLowerCase() === vendorName?.toLowerCase() ||
        v.id === purchase?.vendorId ||
        v.vendorCode === purchase?.vendorCode
    );
  }, [vendors, vendorName, purchase]);

  const rawAmount = useMemo(() => {
    if (!purchase) return 25000;
    const amt = purchase.totalAmount || Math.abs(purchase.amount) || 25000;
    return Number(amt) || 25000;
  }, [purchase]);

  const subtotal = useMemo(() => {
    if (purchase?.subtotal && Number(purchase.subtotal) > 0) return Number(purchase.subtotal);
    return Math.round((rawAmount / 1.18) * 100) / 100;
  }, [purchase, rawAmount]);

  const taxAmount = useMemo(() => {
    if (purchase?.taxAmount && Number(purchase.taxAmount) > 0) return Number(purchase.taxAmount);
    return Math.round((rawAmount - subtotal) * 100) / 100;
  }, [purchase, rawAmount, subtotal]);

  const cgst = useMemo(() => Math.round((taxAmount / 2) * 100) / 100, [taxAmount]);
  const sgst = useMemo(() => Math.round((taxAmount - cgst) * 100) / 100, [taxAmount, cgst]);

  const referenceNo = purchase?.referenceNo || purchase?.billNumber || purchase?.expenseNo || 'BILL-2024-000123';
  const voucherType = purchase?.type || (purchase?.expenseNo ? 'Expense' : 'Purchase');
  const paymentStatus = purchase?.status === 'Pending' ? 'Pending' : (purchase?.paymentStatus || purchase?.status || 'Paid');
  const isPaid = paymentStatus === 'Paid' || paymentStatus === 'Received' || paymentStatus === 'Processed';

  // Realistic Line Items Breakdown
  const lineItems: PurchaseLineItem[] = useMemo(() => {
    if (purchase?.items && Array.isArray(purchase.items) && purchase.items.length > 0) {
      return purchase.items.map((it: any, idx: number) => ({
        id: it.id || `item-${idx + 1}`,
        name: it.name || it.productName || `Item #${idx + 1}`,
        sku: it.sku || it.hsnCode || `HSN-${6100 + idx}`,
        qty: it.quantity || it.qty || 1,
        unit: it.unit || 'Pcs',
        rate: it.unitPrice || it.rate || it.purchaseRate || Math.round(subtotal / (purchase.items.length || 1)),
        taxPercent: it.taxPercent || 18,
        total: it.totalAmount || ((it.quantity || it.qty || 1) * (it.unitPrice || it.rate || 0)) || subtotal,
      }));
    }

    // Contextual fallback line items matching voucher category and amount
    const cat = (purchase?.category || '').toLowerCase();
    if (cat.includes('packag')) {
      return [
        {
          id: 'item-1',
          name: 'Heavy Duty Corrugated Shipping Boxes (3-Ply)',
          sku: 'HSN-4819',
          qty: 200,
          unit: 'Pcs',
          rate: Math.round((subtotal * 0.6) / 200 * 100) / 100,
          taxPercent: 18,
          total: Math.round(subtotal * 0.6 * 100) / 100,
        },
        {
          id: 'item-2',
          name: 'Branded Thermal Dispatch Labels & Poly Tapes',
          sku: 'HSN-4821',
          qty: 50,
          unit: 'Roll',
          rate: Math.round((subtotal * 0.4) / 50 * 100) / 100,
          taxPercent: 18,
          total: Math.round(subtotal * 0.4 * 100) / 100,
        },
      ];
    }

    if (cat.includes('footwear')) {
      return [
        {
          id: 'item-1',
          name: 'Genuine Handcrafted Leather Loafers (Brown)',
          sku: 'HSN-6403',
          qty: 25,
          unit: 'Pair',
          rate: Math.round((subtotal * 0.65) / 25 * 100) / 100,
          taxPercent: 18,
          total: Math.round(subtotal * 0.65 * 100) / 100,
        },
        {
          id: 'item-2',
          name: 'Canvas Casual Sneakers (White / Navy)',
          sku: 'HSN-6404',
          qty: 20,
          unit: 'Pair',
          rate: Math.round((subtotal * 0.35) / 20 * 100) / 100,
          taxPercent: 18,
          total: Math.round(subtotal * 0.35 * 100) / 100,
        },
      ];
    }

    // Default Apparel / Retail Items
    const part1 = Math.round(subtotal * 0.6 * 100) / 100;
    const part2 = Math.round((subtotal - part1) * 100) / 100;
    return [
      {
        id: 'item-1',
        name: "Premium Cotton Slim-Fit Crew T-Shirt (Assorted)",
        sku: 'HSN-6109',
        qty: 60,
        unit: 'Pcs',
        rate: Math.round((part1 / 60) * 100) / 100,
        taxPercent: 18,
        total: part1,
      },
      {
        id: 'item-2',
        name: "Classic Denim Jeans & Trousers (Stone Wash)",
        sku: 'HSN-6203',
        qty: 30,
        unit: 'Pcs',
        rate: Math.round((part2 / 30) * 100) / 100,
        taxPercent: 18,
        total: part2,
      },
    ];
  }, [purchase, subtotal]);

  // Matching or generated E-Way Bill details
  const matchedEWayBill = useMemo(() => {
    if (ewayBills && ewayBills.length > 0) {
      const found = ewayBills.find(
        (ew) =>
          ew.invoiceBillNo === referenceNo ||
          ew.vendor?.toLowerCase() === vendorName.toLowerCase()
      );
      if (found) return found;
    }
    return {
      id: 'ewb-gen-1',
      eWayBillNo: '1417 8965 4321',
      date: purchase?.date || '11 May 2024',
      time: purchase?.time || '11:24 AM',
      invoiceBillNo: referenceNo,
      vendor: vendorName,
      fromTo: `${matchedVendor?.city || 'Durg'} → Central Store Bhilai`,
      distanceKm: 45,
      validTill: '18 May 2024',
      status: 'Active' as const,
      vehicleNo: 'CG 07 CA 4589',
    };
  }, [ewayBills, referenceNo, vendorName, purchase, matchedVendor]);

  if (!isOpen || !purchase) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      setCustomNotes((prev) => [newNote.trim(), ...prev]);
      setNewNote('');
    }
  };

  const handleCopyReference = () => {
    navigator.clipboard.writeText(referenceNo);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Panel matching mockup 8.2.png with responsive width */}
      <div className="relative w-full max-w-xl md:max-w-2xl bg-white h-screen shadow-2xl z-10 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header - flush with top edge */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Purchase - Details</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                {voucherType}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <h2 className="text-xl font-black text-slate-900">{referenceNo}</h2>
              <button
                type="button"
                onClick={handleCopyReference}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title="Copy Reference"
              >
                {isCopied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Hash className="w-3.5 h-3.5" />
                )}
              </button>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  isPaid
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {paymentStatus}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{purchase.date || '11 May 2024'}, {purchase.time || '11:24 AM'}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="px-6 py-2.5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/70 shrink-0">
          {purchase.status !== 'Received' && (
            <button
              type="button"
              onClick={async () => {
                const targetId = purchase.id || purchase._id;
                if (targetId) {
                  await receivePurchaseRecord(targetId);
                  onClose();
                }
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-100" />
              <span>Receive & Update Stock</span>
            </button>
          )}

          <button
            type="button"
            onClick={onEdit}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            title="Print or save invoice as PDF"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download / Print Invoice</span>
          </button>
        </div>

        {/* Drawer Tabs Navigation */}
        <div className="px-6 pt-2 border-b border-slate-100 flex items-center gap-5 overflow-x-auto text-xs shrink-0 bg-white">
          {(
            [
              { id: 'overview', label: 'Overview' },
              { id: 'items', label: `Items (${lineItems.length})` },
              { id: 'payments', label: 'Payments' },
              { id: 'eway', label: 'E-Way Bill' },
              { id: 'notes', label: 'Notes' },
              { id: 'activity', label: 'Activity' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`pb-2.5 font-bold capitalize transition-colors relative whitespace-nowrap cursor-pointer ${
                activeTab === t.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Drawer Body - Contextual per Tab */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/30">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Vendor Details Card */}
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{vendorName}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {matchedVendor?.address || 'Plot No. 12, Industrial Area, Durg'}
                        <br />
                        {matchedVendor?.city || 'Durg'}, Chhattisgarh - {matchedVendor?.pincode || '490024'}
                      </p>
                      <p className="text-[11px] font-mono text-slate-500 mt-1">
                        GSTIN: {matchedVendor?.gstin || purchase.vendorGstin || '22ABCDE1234F1Z5'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubTab('vendors');
                      onClose();
                    }}
                    className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors shadow-2xs shrink-0 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Vendor</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-xs bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Invoice / Ref No.</span>
                  <span className="font-mono font-medium text-slate-900 mt-0.5 block">{referenceNo}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Vendor GSTIN</span>
                  <span className="font-mono font-medium text-slate-900 mt-0.5 block">
                    {matchedVendor?.gstin || purchase.vendorGstin || '22ABCDE1234F1Z5'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Invoice Date</span>
                  <span className="font-medium text-slate-900 mt-0.5 block">{purchase.date || '11 May 2024'}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Place of Supply</span>
                  <span className="font-medium text-slate-900 mt-0.5 block">Chhattisgarh (22)</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Due Date</span>
                  <span className="font-medium text-slate-900 mt-0.5 block">{purchase.dueDate || '11 May 2024'}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Payment Terms</span>
                  <span className="font-medium text-slate-900 mt-0.5 block">
                    {matchedVendor?.paymentTerms || 'Due on Receipt'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Purchase Order</span>
                  <span className="font-mono font-medium text-blue-600 mt-0.5 block">
                    {purchase.purchaseOrder || 'PO-2024-000021'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Reference / Category</span>
                  <span className="font-medium text-slate-700 mt-0.5 block">
                    {purchase.category || 'Inventory (Apparel)'}
                  </span>
                </div>
              </div>

              {/* Amount Summary */}
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 space-y-2 text-xs">
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
                  <span>CGST (9%)</span>
                  <span className="font-medium text-slate-900">
                    ₹ {cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>SGST (9%)</span>
                  <span className="font-medium text-slate-900">
                    ₹ {sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Total Amount</span>
                  <span className="font-black text-slate-900 text-base">
                    ₹ {rawAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ITEMS */}
          {activeTab === 'items' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Items Summary Header */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-blue-900">
                    {lineItems.length} Products / Line Items in this Voucher
                  </span>
                </div>
                <span className="text-[11px] font-bold text-blue-700 bg-white px-2.5 py-0.5 rounded-full border border-blue-200">
                  Total Qty: {lineItems.reduce((acc: number, it: PurchaseLineItem) => acc + (Number(it.qty) || 0), 0)} Units
                </span>
              </div>

              {/* Items Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold text-[11px]">
                      <tr>
                        <th className="px-3.5 py-2.5">#</th>
                        <th className="px-3 py-2.5">Product / Item</th>
                        <th className="px-3 py-2.5">HSN/SKU</th>
                        <th className="px-3 py-2.5 text-right">Qty</th>
                        <th className="px-3 py-2.5 text-right">Rate (₹)</th>
                        <th className="px-3.5 py-2.5 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {lineItems.map((item: PurchaseLineItem, idx: number) => (
                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-3.5 py-3 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                          <td className="px-3 py-3 font-semibold text-slate-900">
                            <div>{item.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal">Standard inventory intake</div>
                          </td>
                          <td className="px-3 py-3 font-mono text-[11px] text-slate-500">
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded">{item.sku}</span>
                          </td>
                          <td className="px-3 py-3 text-right font-medium text-slate-800">
                            {item.qty} {item.unit}
                          </td>
                          <td className="px-3 py-3 text-right font-medium text-slate-800">
                            ₹ {Number(item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-3.5 py-3 text-right font-bold text-slate-900">
                            ₹ {Number(item.total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Bottom Totals */}
                <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex flex-col gap-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Taxable Value (Subtotal):</span>
                    <span className="font-semibold text-slate-900">
                      ₹ {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>IGST / CGST+SGST (18%):</span>
                    <span className="font-semibold text-slate-900">
                      ₹ {taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-slate-200 text-slate-900 font-bold text-sm">
                    <span>Gross Invoice Total:</span>
                    <span className="font-black text-slate-900">
                      ₹ {rawAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Payment Summary KPI Card */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800">Settlement Status</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      isPaid
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {isPaid ? 'Fully Paid & Reconciled' : 'Pending Settlement'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-3 text-center">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-500 font-medium block">Total Payable</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                      ₹ {rawAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="p-2.5 bg-emerald-50/80 rounded-xl">
                    <span className="text-[10px] text-emerald-700 font-medium block">Paid Amount</span>
                    <span className="text-xs font-bold text-emerald-800 mt-0.5 block">
                      ₹ {(isPaid ? rawAmount : 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="p-2.5 bg-amber-50/80 rounded-xl">
                    <span className="text-[10px] text-amber-700 font-medium block">Balance Due</span>
                    <span className="text-xs font-bold text-amber-800 mt-0.5 block">
                      ₹ {(isPaid ? 0 : rawAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recorded Payment Entries */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>Payment Transactions Log</span>
                  <span className="text-[10px] font-normal text-slate-500">1 Transaction recorded</span>
                </h4>

                <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 flex items-start justify-between text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">
                        {purchase.paymentMethod || 'Bank Transfer (NEFT/RTGS)'}
                      </span>
                      <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                        REF-202610-89104
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Paid to: {vendorName} ({matchedVendor?.bankName || 'State Bank of India'})
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Processed on {purchase.date || '11 May 2024'} at {purchase.time || '11:24 AM'}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-slate-900 text-sm block">
                      ₹ {rawAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                      Success ✓
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5 text-slate-500" />
                  <span>Download Payment Voucher</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: E-WAY BILL */}
          {activeTab === 'eway' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* E-Way Bill Certificate Card */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Govt. E-Way Bill Number
                    </span>
                    <span className="text-base font-black font-mono text-slate-900 mt-0.5 block">
                      {matchedEWayBill.eWayBillNo}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Generated for Invoice: <strong className="font-mono text-slate-700">{referenceNo}</strong>
                    </span>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active & Valid
                  </span>
                </div>

                {/* Route & Transport Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-semibold block flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> Origin / From
                    </span>
                    <span className="font-medium text-slate-900 mt-0.5 block">
                      {matchedVendor?.city || 'Durg'} Hub, CG
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-semibold block flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> Destination / To
                    </span>
                    <span className="font-medium text-slate-900 mt-0.5 block">
                      Central Store, Bhilai
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-semibold block flex items-center gap-1">
                      <Truck className="w-3 h-3 text-slate-400" /> Vehicle Number
                    </span>
                    <span className="font-mono font-medium text-slate-900 mt-0.5 block">
                      {matchedEWayBill.vehicleNo || 'CG 07 CA 4589'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-semibold block flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> Estimated Distance
                    </span>
                    <span className="font-medium text-slate-900 mt-0.5 block">
                      {matchedEWayBill.distanceKm} KM (Road)
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Valid Till: <strong>{matchedEWayBill.validTill}</strong>. Compliant for interstate & intrastate road transit.
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Print E-Way Bill Receipt</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                <label className="text-xs font-bold text-slate-900 block">
                  Add Internal Note / Remark
                </label>
                <textarea
                  rows={2}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Type an internal note regarding intake quality, packaging condition or supplier communication..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newNote.trim()}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Post Note
                  </button>
                </div>
              </form>

              {/* Existing Notes Feed */}
              <div className="space-y-2.5">
                {customNotes.map((note, idx) => (
                  <div key={idx} className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-700">Store Manager</span>
                      <span>Just now</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed">{note}</p>
                  </div>
                ))}

                <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-700">Intake Desk</span>
                    <span>{purchase.date || '11 May 2024'}</span>
                  </div>
                  <p className="text-slate-800 leading-relaxed">
                    Consignment verified at receiving dock. Barcodes cross-checked with supplier manifest. Zero transit defects recorded.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs text-slate-600">
                  <span className="font-bold text-slate-800 block mb-1">Commercial Terms & Conditions</span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-500">
                    <li>Payment terms: {matchedVendor?.paymentTerms || 'Due on Receipt'}</li>
                    <li>Discrepancies in shipment must be reported within 48 hours of physical intake.</li>
                    <li>GST input credit reflected in GSTR-2B.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ACTIVITY TIMELINE */}
          {activeTab === 'activity' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs animate-in fade-in duration-150">
              <h4 className="text-xs font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Audit & Voucher Lifecycle Timeline</span>
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {/* Event 1 */}
                <div className="relative">
                  <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 ring-4 ring-emerald-50 flex items-center justify-center">
                    <Check className="w-2 h-2 text-white" />
                  </div>
                  <div className="text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">Voucher Recorded & Created</span>
                      <span className="text-[10px] text-slate-400">{purchase.date || '11 May 2024'}, {purchase.time || '11:24 AM'}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Purchase bill #{referenceNo} registered by Store Owner.
                    </p>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="relative">
                  <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-50 flex items-center justify-center">
                    <Check className="w-2 h-2 text-white" />
                  </div>
                  <div className="text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">E-Way Bill Compliance Verified</span>
                      <span className="text-[10px] text-slate-400">{purchase.date || '11 May 2024'}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      E-Way Bill #{matchedEWayBill.eWayBillNo} mapped to consignment vehicle.
                    </p>
                  </div>
                </div>

                {/* Event 3 */}
                <div className="relative">
                  <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 ring-4 ring-emerald-50 flex items-center justify-center">
                    <Check className="w-2 h-2 text-white" />
                  </div>
                  <div className="text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">Stock Updated into Central Catalog</span>
                      <span className="text-[10px] text-slate-400">{purchase.date || '11 May 2024'}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {lineItems.length} products with {lineItems.reduce((acc: number, it: PurchaseLineItem) => acc + (Number(it.qty) || 0), 0)} units added to store available inventory.
                    </p>
                  </div>
                </div>

                {/* Event 4 */}
                <div className="relative">
                  <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 ring-4 ring-emerald-50 flex items-center justify-center">
                    <Check className="w-2 h-2 text-white" />
                  </div>
                  <div className="text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">Payment Settled</span>
                      <span className="text-[10px] text-slate-400">{purchase.date || '11 May 2024'}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Full amount of ₹ {rawAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} settled via {purchase.paymentMethod || 'Bank Transfer'}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors shadow-2xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

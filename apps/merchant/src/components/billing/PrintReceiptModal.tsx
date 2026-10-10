import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  FileText,
  Receipt,
  Download,
  Share2,
  Check,
  Building2,
  Phone,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import { IInvoice } from '../../stores/billingStore.js';
import { branding } from '@repo/shared-types';
import { useAuthStore } from '../../stores/authStore.js';
import { numberToIndianWords } from '../../lib/numberToWords.js';

interface PrintReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: IInvoice | null;
  defaultMode?: 'thermal-80mm' | 'thermal-58mm' | 'a4-tax-invoice';
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({
  isOpen,
  onClose,
  invoice,
  defaultMode = 'thermal-80mm',
}) => {
  const [printFormat, setPrintFormat] = useState<'thermal-80mm' | 'thermal-58mm' | 'a4-tax-invoice'>(defaultMode);
  const [isCopied, setIsCopied] = useState(false);
  const { currentStore, user } = useAuthStore();

  useEffect(() => {
    if (defaultMode) setPrintFormat(defaultMode);
  }, [defaultMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen || !invoice) return null;

  const storeName = currentStore?.name || (user as any)?.storeName || `${branding.appName} Retail Store`;
  const storePhone = user?.phone || '+91 98765 43210';
  const storeGstin = '22AAAAA0000A1Z5'; // Standard GST format
  const storeAddress = 'Civic Centre Market, Bhilai, Chhattisgarh 490006';

  const handlePrint = () => {
    // Inject page size dynamically before print
    const styleId = 'dynamic-print-paper-size';
    let styleTag = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    if (printFormat === 'thermal-80mm') {
      styleTag.innerHTML = `
        @media print {
          @page { size: 80mm auto; margin: 3mm 2mm; }
          body * { visibility: hidden !important; }
          #printable-thermal-slip, #printable-thermal-slip * { visibility: visible !important; }
          #printable-thermal-slip {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 76mm !important;
            margin: 0 auto !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
          }
        }
      `;
    } else if (printFormat === 'thermal-58mm') {
      styleTag.innerHTML = `
        @media print {
          @page { size: 58mm auto; margin: 2mm 1mm; }
          body * { visibility: hidden !important; }
          #printable-thermal-slip, #printable-thermal-slip * { visibility: visible !important; }
          #printable-thermal-slip {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 54mm !important;
            margin: 0 auto !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
          }
        }
      `;
    } else {
      styleTag.innerHTML = `
        @media print {
          @page { size: A4 portrait; margin: 10mm; }
          body * { visibility: hidden !important; }
          #printable-a4-invoice, #printable-a4-invoice * { visibility: visible !important; }
          #printable-a4-invoice {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
          }
        }
      `;
    }

    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const grandTotal = invoice.totalAmount || 0;
  const taxableAmount = Math.max(0, (invoice.subTotal || 0) - (invoice.discountTotal || 0));
  const cgst = Math.round((taxableAmount * 0.09) * 100) / 100;
  const sgst = Math.round((taxableAmount * 0.09) * 100) / 100;
  const amountInWords = numberToIndianWords(grandTotal);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header Toolbar */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Print Invoice: <span className="font-mono text-blue-600">{invoice.invoiceNo}</span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Choose format below. Formats are calibrated for physical thermal roll printers and A4 laser printers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Format Toggle Pill */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setPrintFormat('thermal-80mm')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  printFormat === 'thermal-80mm'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                80mm Thermal
              </button>
              <button
                type="button"
                onClick={() => setPrintFormat('thermal-58mm')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  printFormat === 'thermal-58mm'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                58mm Mini
              </button>
              <button
                type="button"
                onClick={() => setPrintFormat('a4-tax-invoice')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  printFormat === 'a4-tax-invoice'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                A4 Tax Invoice
              </button>
            </div>

            {/* Print CTA */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print (Ctrl+P)</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
              title="Copy receipt link"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Receipt Preview Stage */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/70 flex justify-center">
          {/* ────────────────────────────────────────────────────────── */}
          {/* FORMAT 1: THERMAL RECEIPT SLIP (80mm & 58mm)               */}
          {/* ────────────────────────────────────────────────────────── */}
          {printFormat.startsWith('thermal') && (
            <div
              id="printable-thermal-slip"
              className={`bg-white text-slate-900 shadow-xl border border-slate-300 rounded-sm font-mono text-[11px] leading-tight select-none p-4 ${
                printFormat === 'thermal-80mm' ? 'w-[320px] max-w-[320px]' : 'w-[250px] max-w-[250px] text-[10px]'
              }`}
            >
              {/* Receipt Header */}
              <div className="text-center pb-2 border-b border-dashed border-slate-400 space-y-1">
                <h3 className="font-bold text-sm tracking-wide uppercase">{storeName}</h3>
                <p className="text-[10px] text-slate-600">{storeAddress}</p>
                <div className="flex justify-center gap-2 text-[9px] text-slate-600 font-semibold">
                  <span>Ph: {storePhone}</span>
                  <span>|</span>
                  <span>GSTIN: {storeGstin}</span>
                </div>
              </div>

              {/* Bill Meta */}
              <div className="py-2 border-b border-dashed border-slate-400 space-y-0.5 text-[10px]">
                <div className="flex justify-between">
                  <span className="font-bold">INVOICE: {invoice.invoiceNo}</span>
                  <span>{invoice.date}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Customer: {invoice.customerName || 'Walk-in Retail'}</span>
                  <span>{invoice.customerPhone ? `+91 ${invoice.customerPhone.slice(-10)}` : ''}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Type: Retail Cash Memo</span>
                  <span>POS Counter</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="py-2 border-b border-dashed border-slate-400">
                <div className="flex justify-between font-bold border-b border-slate-300 pb-1 text-[10px] uppercase">
                  <span className="flex-1">Item</span>
                  <span className="w-8 text-center">Qty</span>
                  <span className="w-12 text-right">Rate</span>
                  <span className="w-14 text-right">Amt</span>
                </div>
                <div className="divide-y divide-slate-100 py-1">
                  {invoice.items.map((it, idx) => (
                    <div key={it.id || idx} className="py-1 flex justify-between items-start">
                      <div className="flex-1 pr-1 truncate">
                        <div className="font-semibold">{it.name}</div>
                        {it.hsnSac && <span className="text-[9px] text-slate-500">HSN: {it.hsnSac}</span>}
                      </div>
                      <span className="w-8 text-center">{it.quantity}</span>
                      <span className="w-12 text-right">₹{it.rate.toFixed(2)}</span>
                      <span className="w-14 text-right font-semibold">₹{(it.quantity * it.rate).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals & Tax Calculation */}
              <div className="py-2 border-b border-dashed border-slate-400 space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span>Sub Total:</span>
                  <span>₹{invoice.subTotal.toFixed(2)}</span>
                </div>
                {invoice.discountTotal > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span>-₹{invoice.discountTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Taxable Value:</span>
                  <span>₹{taxableAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>CGST @ 9%:</span>
                  <span>₹{cgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>SGST @ 9%:</span>
                  <span>₹{sgst.toFixed(2)}</span>
                </div>

                <div className="flex justify-between font-bold text-xs pt-1 border-t border-slate-300">
                  <span className="uppercase">Net Payable:</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Settlement Mode & Balance */}
              <div className="py-2 border-b border-dashed border-slate-400 space-y-0.5 text-[10px]">
                <div className="flex justify-between">
                  <span className="font-semibold">Payment Mode:</span>
                  <span className="uppercase font-bold text-blue-700">{invoice.settlementMode || 'CASH'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span>₹{(invoice.paidAmount || grandTotal).toFixed(2)}</span>
                </div>
                {invoice.dueAmount > 0 && (
                  <div className="flex justify-between text-red-600 font-bold">
                    <span>Balance Due:</span>
                    <span>₹{invoice.dueAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Barcode Mockup & Footer */}
              <div className="pt-3 text-center space-y-1">
                <div className="flex justify-center items-center py-1">
                  {/* CSS Barcode lines simulation */}
                  <div className="flex gap-[2px] h-8 items-center bg-white px-2">
                    {[3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 6].map((w, i) => (
                      <div
                        key={i}
                        className={`bg-slate-900 h-full ${
                          w % 2 === 0 ? 'w-[2px]' : 'w-[1px]'
                        } ${i % 3 === 0 ? 'h-7' : 'h-8'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[9px] font-mono tracking-widest text-slate-600">*{invoice.invoiceNo}*</p>
                <p className="text-[9px] font-bold text-slate-800 uppercase pt-1">
                  Thank you for shopping local!
                </p>
                <p className="text-[8px] text-slate-500">
                  Goods once sold can be exchanged within 7 days with this bill.
                </p>
              </div>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────── */}
          {/* FORMAT 2: FULL A4 GST TAX INVOICE                          */}
          {/* ────────────────────────────────────────────────────────── */}
          {printFormat === 'a4-tax-invoice' && (
            <div
              id="printable-a4-invoice"
              className="bg-white text-slate-900 shadow-xl border border-slate-300 rounded-sm w-[760px] max-w-[760px] p-8 text-xs font-sans select-none"
            >
              {/* A4 Tax Invoice Header */}
              <div className="flex justify-between items-start pb-4 border-b-2 border-slate-900">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                      {storeName}
                    </h2>
                  </div>
                  <p className="text-slate-600">{storeAddress}</p>
                  <p className="text-slate-600 font-medium">
                    Phone: {storePhone} | GSTIN: <span className="font-mono font-bold text-slate-900">{storeGstin}</span>
                  </p>
                  <p className="text-slate-600">State: Chhattisgarh (Code: 22)</p>
                </div>

                <div className="text-right space-y-1">
                  <span className="inline-block px-3 py-1 bg-slate-900 text-white font-black text-sm tracking-wider uppercase rounded-sm">
                    {invoice.type === 'Tax Invoice' ? 'TAX INVOICE' : 'BILL OF SUPPLY'}
                  </span>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">
                    (Original for Recipient)
                  </p>
                  <div className="pt-2">
                    <p className="font-bold text-slate-900">
                      Invoice No: <span className="font-mono text-blue-700">{invoice.invoiceNo}</span>
                    </p>
                    <p className="text-slate-600">Invoice Date: {invoice.date}</p>
                    <p className="text-slate-600">Due Date: {invoice.dueDate || invoice.date}</p>
                    <p className="text-slate-600">Place of Supply: {invoice.placeOfSupply || 'Chhattisgarh (22)'}</p>
                  </div>
                </div>
              </div>

              {/* 2-Column Billed To Section */}
              <div className="grid grid-cols-2 gap-4 py-3 border-b border-slate-300 bg-slate-50/50 px-2 rounded-sm my-3">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                    Details of Receiver / Billed To:
                  </h4>
                  <p className="font-bold text-slate-900 text-sm">{invoice.customerName || 'Walk-in Retail Customer'}</p>
                  {invoice.customerAddress && <p className="text-slate-600">{invoice.customerAddress}</p>}
                  <p className="text-slate-600">
                    Phone: <span className="font-mono">{invoice.customerPhone || 'N/A'}</span>
                  </p>
                  <p className="text-slate-600">
                    GSTIN: <span className="font-mono font-bold">{invoice.customerGstin || 'Unregistered Consumer'}</span>
                  </p>
                  <p className="text-slate-600">State: {invoice.state || 'Chhattisgarh'}</p>
                </div>

                <div className="space-y-0.5 text-right">
                  <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                    Transportation & Terms:
                  </h4>
                  <p className="text-slate-600">Reverse Charge: <span className="font-bold">No</span></p>
                  <p className="text-slate-600">Mode of Supply: <span className="font-bold">Direct Over-The-Counter</span></p>
                  <p className="text-slate-600">Payment Terms: <span className="font-bold">{invoice.paymentTerms || 'Due on Receipt'}</span></p>
                  <p className="text-slate-600">Settlement Mode: <span className="font-bold uppercase text-blue-700">{invoice.settlementMode || 'CASH'}</span></p>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="py-2">
                <table className="w-full text-left border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 text-[10px] uppercase font-bold">
                      <th className="border border-slate-300 p-1.5 w-8 text-center">#</th>
                      <th className="border border-slate-300 p-1.5">Item Description</th>
                      <th className="border border-slate-300 p-1.5 w-16 text-center">HSN/SAC</th>
                      <th className="border border-slate-300 p-1.5 w-12 text-center">Qty</th>
                      <th className="border border-slate-300 p-1.5 w-16 text-right">Rate (₹)</th>
                      <th className="border border-slate-300 p-1.5 w-16 text-right">Taxable (₹)</th>
                      <th className="border border-slate-300 p-1.5 w-14 text-right">CGST</th>
                      <th className="border border-slate-300 p-1.5 w-14 text-right">SGST</th>
                      <th className="border border-slate-300 p-1.5 w-20 text-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((it, idx) => {
                      const itemTaxable = it.quantity * it.rate;
                      const itemCgst = Math.round(itemTaxable * 0.09 * 100) / 100;
                      const itemSgst = Math.round(itemTaxable * 0.09 * 100) / 100;
                      const itemTotal = itemTaxable + itemCgst + itemSgst;
                      return (
                        <tr key={it.id || idx} className="hover:bg-slate-50">
                          <td className="border border-slate-300 p-1.5 text-center text-slate-500">{idx + 1}</td>
                          <td className="border border-slate-300 p-1.5 font-semibold text-slate-900">{it.name}</td>
                          <td className="border border-slate-300 p-1.5 text-center font-mono text-[10px]">{it.hsnSac || '9983'}</td>
                          <td className="border border-slate-300 p-1.5 text-center">{it.quantity}</td>
                          <td className="border border-slate-300 p-1.5 text-right font-mono">{it.rate.toFixed(2)}</td>
                          <td className="border border-slate-300 p-1.5 text-right font-mono">{itemTaxable.toFixed(2)}</td>
                          <td className="border border-slate-300 p-1.5 text-right font-mono text-[10px]">{itemCgst.toFixed(2)}</td>
                          <td className="border border-slate-300 p-1.5 text-right font-mono text-[10px]">{itemSgst.toFixed(2)}</td>
                          <td className="border border-slate-300 p-1.5 text-right font-mono font-bold text-slate-900">{itemTotal.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 font-bold">
                      <td colSpan={5} className="border border-slate-300 p-2 text-right uppercase">
                        Total Taxable & Taxes:
                      </td>
                      <td className="border border-slate-300 p-2 text-right font-mono">₹{taxableAmount.toFixed(2)}</td>
                      <td className="border border-slate-300 p-2 text-right font-mono text-[10px]">₹{cgst.toFixed(2)}</td>
                      <td className="border border-slate-300 p-2 text-right font-mono text-[10px]">₹{sgst.toFixed(2)}</td>
                      <td className="border border-slate-300 p-2 text-right font-mono text-sm text-blue-700">₹{grandTotal.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Total in words & Bank Details */}
              <div className="grid grid-cols-2 gap-4 py-3 border-t border-slate-300 mt-2">
                <div className="space-y-2">
                  <div>
                    <h5 className="font-bold text-[10px] uppercase text-slate-500">Invoice Amount In Words:</h5>
                    <p className="font-bold text-slate-800 italic">{amountInWords}</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[10px] space-y-0.5">
                    <p className="font-bold text-slate-700">Bank Details for Direct Settlement (NEFT / RTGS):</p>
                    <p>Account Name: {storeName}</p>
                    <p>Bank: State Bank of India | Account No: 39820019284</p>
                    <p>IFSC: SBIN0004523 | UPI VPA: merchant@upi</p>
                  </div>
                </div>

                <div className="space-y-1 text-right">
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-600">Sub Total:</span>
                    <span className="font-mono">₹{invoice.subTotal.toFixed(2)}</span>
                  </div>
                  {invoice.discountTotal > 0 && (
                    <div className="flex justify-between py-0.5 text-emerald-700">
                      <span>Total Discount:</span>
                      <span className="font-mono">-₹{invoice.discountTotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-600">Total Tax (CGST 9% + SGST 9%):</span>
                    <span className="font-mono">₹{(cgst + sgst).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-t-2 border-slate-900 font-black text-sm text-slate-900">
                    <span>Grand Total:</span>
                    <span className="font-mono text-blue-700">₹{grandTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-0.5 text-slate-600">
                    <span>Amount Paid:</span>
                    <span className="font-mono">₹{(invoice.paidAmount || grandTotal).toFixed(2)}</span>
                  </div>
                  {invoice.dueAmount > 0 && (
                    <div className="flex justify-between py-0.5 text-red-600 font-bold">
                      <span>Amount Due:</span>
                      <span className="font-mono">₹{invoice.dueAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Signatory & Declaration */}
              <div className="pt-6 mt-4 border-t border-slate-200 flex justify-between items-end">
                <div className="max-w-[360px] text-[9px] text-slate-500 space-y-1">
                  <p className="font-bold text-slate-700">Declaration & Terms:</p>
                  <p>
                    We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
                  </p>
                  <p>Subject to Bhilai jurisdiction only.</p>
                </div>

                <div className="text-right space-y-8">
                  <p className="font-bold text-slate-800 text-[10px]">For {storeName}:</p>
                  <div className="border-t border-slate-400 pt-1 text-[10px] text-slate-600 font-medium">
                    Authorized Signatory
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

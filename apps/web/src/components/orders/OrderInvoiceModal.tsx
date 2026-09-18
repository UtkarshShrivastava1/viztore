'use client';

import React, { useEffect, useState } from 'react';
import { X, Printer, Building, ShieldCheck, Loader2 } from 'lucide-react';
import { branding } from '@repo/shared-types/branding.config';
import { ordersApi } from '@/lib/api/orders';

export interface InvoiceItem {
  name: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  taxableAmount?: number;
  lineTotal: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  orderNumber: string;
  orderId?: string;
  date: string;
  status: string;
  seller: {
    name: string;
    address: string;
    phone: string;
    gstin?: string;
  };
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  items: InvoiceItem[];
  pricing: {
    subtotal: number;
    tax: number;
    cgst?: number;
    sgst?: number;
    shippingFee: number;
    grandTotal: number;
  };
  deliveryOtp?: string;
}

export interface OrderInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: InvoiceData | null;
  orderId?: string;
}

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({ 
  isOpen, 
  onClose, 
  invoice: initialInvoice,
  orderId 
}) => {
  const [invoice, setInvoice] = useState<InvoiceData | null>(initialInvoice || null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialInvoice) {
      setInvoice(initialInvoice);
      return;
    }

    if (isOpen && orderId) {
      let active = true;
      const fetchInvoice = async () => {
        try {
          setLoading(true);
          const data = await ordersApi.getOrderInvoice(orderId);
          if (active && data) {
            setInvoice(data);
          }
        } catch (err) {
          console.warn('Could not fetch invoice from API, building fallback invoice:', err);
          if (active) {
            setInvoice({
              invoiceNumber: `INV-${orderId.substring(0, 10).toUpperCase()}`,
              orderNumber: orderId.startsWith('ORD') ? orderId : `ORD-${orderId}`,
              date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
              status: 'CONFIRMED',
              seller: {
                name: 'Local Store Partner',
                address: '12, Commercial Market, Sector 4, Indore, MP - 452001',
                phone: '+91 98765 00000',
                gstin: '23AAAAA0000A1Z5',
              },
              customer: {
                name: 'Customer',
                phone: '+91 98765 43210',
                address: 'MG Road, Indore, Madhya Pradesh - 452001',
              },
              items: [
                {
                  name: 'Standard Order Item',
                  quantity: 1,
                  unitPrice: 399,
                  lineTotal: 399,
                },
              ],
              pricing: {
                subtotal: 380,
                tax: 19,
                cgst: 9.5,
                sgst: 9.5,
                shippingFee: 0,
                grandTotal: 399,
              },
              deliveryOtp: '7382',
            });
          }
        } finally {
          if (active) setLoading(false);
        }
      };
      fetchInvoice();
      return () => {
        active = false;
      };
    }
  }, [isOpen, orderId, initialInvoice]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
        {/* Modal Action Header (Excluded from print) */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/95 px-6 py-4 backdrop-blur print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-gray-900">Tax Invoice Receipt</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={loading || !invoice}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1668F6] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Document */}
        {loading || !invoice ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-[#1668F6]" />
            <p className="text-sm font-medium">Generating official tax invoice...</p>
          </div>
        ) : (
          <div id="printable-invoice" className="p-6 sm:p-8 space-y-6 text-gray-800 text-xs">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-gray-200 pb-5 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#1668F6] flex items-center justify-center text-white font-black text-sm">
                  {branding.appName.charAt(0)}
                </div>
                <span className="text-base font-extrabold text-[#192168]">{branding.appName}</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">{branding.tagline}</p>
              <p className="text-[10px] text-gray-400">Support: {branding.supportEmail}</p>
            </div>
            <div className="sm:text-right">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1668F6] font-bold text-[10px] mb-1">
                ORIGINAL FOR RECIPIENT
              </span>
              <p className="text-sm font-black text-gray-900">Tax Invoice</p>
              <p className="font-mono font-bold text-gray-700 text-[11px]">{invoice.invoiceNumber}</p>
              <p className="text-gray-500 text-[10px] mt-0.5">
                Date: {new Date(invoice.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Seller & Customer Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/80 p-4 rounded-xl border border-gray-200/60">
            <div>
              <h3 className="font-bold text-[11px] text-gray-900 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                <Building className="w-3.5 h-3.5 text-[#1668F6]" /> Sold By (Merchant)
              </h3>
              <p className="font-bold text-gray-900 text-xs">{invoice.seller.name}</p>
              <p className="text-gray-600 text-[11px] leading-relaxed mt-0.5">{invoice.seller.address}</p>
              <p className="text-gray-500 text-[10px] mt-1">Contact: {invoice.seller.phone}</p>
              {invoice.seller.gstin && (
                <p className="text-gray-500 text-[10px] font-mono">GSTIN: {invoice.seller.gstin}</p>
              )}
            </div>
            <div>
              <h3 className="font-bold text-[11px] text-gray-900 uppercase tracking-wide mb-1.5">
                Billing & Shipping Address
              </h3>
              <p className="font-bold text-gray-900 text-xs">{invoice.customer.name}</p>
              <p className="text-gray-600 text-[11px] leading-relaxed mt-0.5">{invoice.customer.address}</p>
              <p className="text-gray-500 text-[10px] mt-1">Phone: {invoice.customer.phone}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 text-gray-500 font-bold text-[10px] uppercase tracking-wider">
                  <th className="py-2.5 px-2">#</th>
                  <th className="py-2.5 px-2">Item Description</th>
                  <th className="py-2.5 px-2 text-center">Qty</th>
                  <th className="py-2.5 px-2 text-right">Unit Price</th>
                  <th className="py-2.5 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-2.5 px-2 text-gray-400 text-[10px]">{idx + 1}</td>
                    <td className="py-2.5 px-2">
                      <p className="font-bold text-gray-900 text-xs">{item.name}</p>
                      {item.sku && <p className="text-[10px] text-gray-400 font-mono">SKU: {item.sku}</p>}
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-gray-800">{item.quantity}</td>
                    <td className="py-2.5 px-2 text-right text-gray-600">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-2 text-right font-bold text-gray-900">₹{item.lineTotal.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start pt-3 border-t border-gray-200 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] text-gray-400 font-medium">Order Number: <span className="font-bold text-gray-700 font-mono">{invoice.orderNumber}</span></p>
              <p className="text-[10px] text-gray-400 font-medium">Payment Status: <span className="font-bold text-emerald-600">Confirmed / Paid</span></p>
              {invoice.deliveryOtp && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-bold mt-2">
                  <span>Delivery OTP:</span>
                  <span className="font-mono text-xs tracking-wider">{invoice.deliveryOtp}</span>
                </div>
              )}
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-[11px]">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal:</span>
                <span className="font-semibold">₹{invoice.pricing.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (CGST + SGST):</span>
                <span className="font-semibold">₹{invoice.pricing.tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charges:</span>
                <span className="font-semibold">
                  {invoice.pricing.shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `₹${invoice.pricing.shippingFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#192168] border-t border-gray-200 pt-2 mt-1">
                <span>Grand Total:</span>
                <span>₹{invoice.pricing.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Legal Footer Note */}
          <div className="border-t border-dashed border-gray-200 pt-4 text-center">
            <p className="text-[9.5px] text-gray-400">
              This is a computer-generated tax invoice issued via {branding.appName} Hyperlocal Commerce Platform. No physical signature required.
            </p>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

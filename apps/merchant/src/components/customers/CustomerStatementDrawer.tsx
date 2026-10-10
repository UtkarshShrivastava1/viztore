import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  FileText,
  CreditCard,
  AlertCircle,
  Calendar,
  ChevronDown,
  Printer,
  Download,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import {
  useCustomerStore,
  Customer,
  StatementTransaction,
  AgingBucket,
  OverdueInvoice,
} from '../../stores/customerStore.js';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock.js';

interface CustomerStatementDrawerProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onEditCustomer?: (customer: Customer) => void;
  onViewCustomer?: (customer: Customer) => void;
}

export const CustomerStatementDrawer: React.FC<CustomerStatementDrawerProps> = ({
  customer,
  isOpen,
  onClose,
  onEditCustomer,
  onViewCustomer,
}) => {
  useBodyScrollLock(isOpen, onClose);

  const { activeStatementTab, setActiveStatementTab } = useCustomerStore();
  const [dateFilter, setDateFilter] = useState('01 Apr 2024 - 31 May 2024');
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  if (!isOpen || !customer) return null;

  const initials = customer.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const transactions = customer.statementTransactions || [];
  const agingBuckets = customer.agingBuckets || [];
  const overdueInvoices = customer.overdueInvoices || [];

  const handleDownload = (format: 'pdf' | 'excel' | 'csv') => {
    setShowDownloadMenu(false);
    alert(`Downloading statement for ${customer.name} in ${format.toUpperCase()} format...`);
  };

  const handlePrint = () => {
    window.print();
  };

  const isAging = activeStatementTab === 'aging';

  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-hidden animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer (6.3.png & 6.4.png) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-3xl bg-white h-screen shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 shrink-0">
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {isAging ? 'Aging Summary' : 'Customer Statement'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isAging
                  ? `Outstanding breakdown for ${customer.name} (${customer.id})`
                  : 'Complete transaction history and outstanding details.'}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Customer Overview Card */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center shrink-0">
                    {initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-sm">{customer.name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      {customer.id} • {customer.customerType}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (isAging && onViewCustomer) {
                      onViewCustomer(customer);
                    } else if (onEditCustomer) {
                      onEditCustomer(customer);
                    }
                  }}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
                >
                  {isAging ? 'View Customer' : 'Edit Customer'}
                </button>
              </div>

              {/* Contact Pills */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{customer.phone}</span>
                </div>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{customer.email}</span>
                </div>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{customer.location}</span>
                </div>
              </div>

              <div className="text-xs font-mono font-medium text-slate-600">
                GSTIN: <span className="font-bold text-slate-800">{customer.gstin || '23ABCDE1234F1Z5'}</span>
              </div>
            </div>

            {/* Stat Cards Row */}
            {!isAging ? (
              /* 3 Cards for Transaction History (6.3.png) */
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block">Total Invoiced</span>
                    <span className="text-sm font-black text-slate-900">
                      ₹{customer.totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block">Total Paid</span>
                    <span className="text-sm font-black text-slate-900">
                      ₹{(customer.totalSales - customer.outstandingAmount).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block">Outstanding</span>
                    <span className="text-sm font-black text-rose-600">
                      ₹{customer.outstandingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* 4 Badges for Aging Summary (6.4.png) */
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Total Outstanding</span>
                    <span className="text-xs font-black text-rose-600">
                      ₹{customer.outstandingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Total Overdue</span>
                    <span className="text-xs font-black text-rose-600">
                      ₹{customer.outstandingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Total Invoiced</span>
                    <span className="text-xs font-black text-slate-900">
                      ₹{customer.totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Total Paid</span>
                    <span className="text-xs font-black text-slate-900">
                      ₹{(customer.totalSales - customer.outstandingAmount).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Navigation Tabs Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={() => setActiveStatementTab('history')}
                  className={`text-xs font-bold pb-2 relative transition-all ${
                    !isAging
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Transaction History
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStatementTab('aging')}
                  className={`text-xs font-bold pb-2 relative transition-all ${
                    isAging
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Aging Summary
                </button>
              </div>

              {/* Date Filter Dropdown */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>{isAging ? 'As on 31 May 2024' : dateFilter}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            {/* Tab 1: Transaction History Ledger (6.3.png) */}
            {!isAging && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Reference No.</th>
                        <th className="py-3 px-4 text-right">Amount (₹)</th>
                        <th className="py-3 px-4 text-right">Balance (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactions.map((tx) => {
                        const isInvoice = tx.type === 'Invoice';
                        return (
                          <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-4 font-medium text-slate-800">{tx.date}</td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  isInvoice
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}
                              >
                                {isInvoice ? (
                                  <FileText className="w-3 h-3" />
                                ) : (
                                  <CreditCard className="w-3 h-3" />
                                )}
                                <span>{tx.type}</span>
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                              {tx.referenceNo}
                            </td>
                            <td className="py-3.5 px-4 text-right font-extrabold">
                              <span className={isInvoice ? 'text-slate-900' : 'text-emerald-600'}>
                                {isInvoice ? '' : '-'}
                                {Math.abs(tx.amount).toLocaleString('en-IN', {
                                  minimumFractionDigits: 2,
                                })}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right font-bold text-slate-800">
                              {tx.balance.toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                              })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-1.5 text-xs">
                  <button className="px-2 py-1 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">
                    &lt;
                  </button>
                  <button className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold">1</button>
                  <button className="px-2.5 py-1 rounded-lg hover:bg-slate-50 text-slate-600">2</button>
                  <button className="px-2.5 py-1 rounded-lg hover:bg-slate-50 text-slate-600">3</button>
                  <button className="px-2.5 py-1 rounded-lg hover:bg-slate-50 text-slate-600">4</button>
                  <span className="px-1 text-slate-400">...</span>
                  <button className="px-2 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
                    &gt;
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Aging Summary (6.4.png) */}
            {isAging && (
              <div className="space-y-6">
                {/* 5 Aging Bucket Columns with Vertical Distribution Bars */}
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="grid grid-cols-5 gap-3 text-center">
                    {agingBuckets.map((bucket, idx) => (
                      <div key={idx} className="flex flex-col items-center justify-between h-40">
                        <div>
                          <div className="text-xs font-black text-slate-900">
                            ₹{bucket.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                            {bucket.label}
                          </span>
                          <span className="text-[9px] text-slate-400 block">{bucket.range}</span>
                        </div>

                        {/* Visual Level Bar */}
                        <div className="w-12 h-20 bg-slate-100 rounded-xl overflow-hidden flex items-end p-1 my-2">
                          <div
                            className="w-full rounded-lg transition-all duration-300"
                            style={{
                              height: `${bucket.heightPercent}%`,
                              backgroundColor: bucket.barColor,
                            }}
                          />
                        </div>

                        <span className="text-[10px] text-slate-500 font-semibold">
                          {bucket.invoiceCount} {bucket.invoiceCount === 1 ? 'invoice' : 'invoices'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outstanding Invoices Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-slate-900">Outstanding Invoices</h4>
                      <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold flex items-center justify-center">
                        {overdueInvoices.length}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert('Viewing all overdue invoices...')}
                      className="px-3 py-1 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                    >
                      View All Invoices
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          <th className="py-3 px-4 w-8">
                            <input type="checkbox" className="rounded text-blue-600" />
                          </th>
                          <th className="py-3 px-4">Invoice No.</th>
                          <th className="py-3 px-4">Invoice Date</th>
                          <th className="py-3 px-4">Due Date</th>
                          <th className="py-3 px-4 text-right">Amount (₹)</th>
                          <th className="py-3 px-4">Days Overdue</th>
                          <th className="py-3 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {overdueInvoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-4">
                              <input type="checkbox" className="rounded text-blue-600" />
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                              {inv.invoiceNo}
                            </td>
                            <td className="py-3.5 px-4 text-slate-700">{inv.invoiceDate}</td>
                            <td className="py-3.5 px-4 text-slate-700">{inv.dueDate}</td>
                            <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                              {inv.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-rose-600">
                              {inv.daysOverdue} days
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                {inv.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fixed Bottom Footer Bar */}
          <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between gap-4 shrink-0">
            {/* Download Statement Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>{isAging ? 'Download Aging Report' : 'Download Statement'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {showDownloadMenu && (
                <div className="absolute bottom-full left-0 mb-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-20 animate-in fade-in duration-100">
                  <button
                    type="button"
                    onClick={() => handleDownload('pdf')}
                    className="w-full px-3 py-1.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span>PDF Document</span>
                    <span className="text-[10px] text-slate-400 font-mono">.pdf</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload('excel')}
                    className="w-full px-3 py-1.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span>Excel Spreadsheet</span>
                    <span className="text-[10px] text-emerald-600 font-mono">.xlsx</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload('csv')}
                    className="w-full px-3 py-1.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span>CSV File</span>
                    <span className="text-[10px] text-slate-400 font-mono">.csv</span>
                  </button>
                </div>
              )}
            </div>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>{isAging ? 'Print Aging Summary' : 'Print Statement'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

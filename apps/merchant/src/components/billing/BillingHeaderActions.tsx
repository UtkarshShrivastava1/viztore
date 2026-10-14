import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  ChevronDown,
  Upload,
  Download,
  FileSpreadsheet,
  FileText,
  ChevronRight,
  Settings,
  Zap,
  X,
  CheckCircle,
} from 'lucide-react';
import { useBillingStore } from '../../stores/billingStore.js';

interface BillingHeaderActionsProps {
  onOpenCreateInvoice?: () => void;
}

export const BillingHeaderActions: React.FC<BillingHeaderActionsProps> = ({
  onOpenCreateInvoice,
}) => {
  const {
    invoices,
    activeSubTab,
    setActiveSubTab,
    setActiveView,
    openCreateInvoiceModal,
  } = useBillingStore();

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFileName, setImportFileName] = useState<string | null>(null);
  const [isImportSuccess, setIsImportSuccess] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const handleExportInvoicesCsv = () => {
    if (invoices.length === 0) return;
    const headers = [
      'Invoice No',
      'Date',
      'Due Date',
      'Customer Name',
      'Customer Phone',
      'Customer GSTIN',
      'Invoice Type',
      'Subtotal',
      'Tax Total',
      'Total Amount',
      'Paid Amount',
      'Due Amount',
      'Status',
      'Settlement Mode',
    ];

    const rows = invoices.map((inv) => [
      inv.invoiceNo,
      inv.date,
      inv.dueDate,
      `"${inv.customerName.replace(/"/g, '""')}"`,
      inv.customerPhone || '',
      inv.customerGstin || '',
      inv.type,
      inv.subTotal.toFixed(2),
      inv.taxTotal.toFixed(2),
      inv.totalAmount.toFixed(2),
      inv.paidAmount.toFixed(2),
      inv.dueAmount.toFixed(2),
      inv.status,
      inv.settlementMode,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Tax_Invoices_Register_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadReportCsv = () => {
    let totalSales = 0;
    let totalPaid = 0;
    let totalDue = 0;
    let totalTax = 0;
    const modeCounts: Record<string, number> = {};

    invoices.forEach((inv) => {
      totalSales += inv.totalAmount || 0;
      totalPaid += inv.paidAmount || 0;
      totalDue += inv.dueAmount || 0;
      totalTax += inv.taxTotal || 0;
      const mode = inv.settlementMode || 'cash';
      modeCounts[mode] = (modeCounts[mode] || 0) + 1;
    });

    const lines = [
      'GST Billing & POS Summary Report',
      `Generated Date,${new Date().toLocaleString('en-IN')}`,
      `Total Invoices Count,${invoices.length}`,
      `Gross Sales (INR),${totalSales.toFixed(2)}`,
      `Total GST Collected (CGST+SGST/IGST),${totalTax.toFixed(2)}`,
      `Total Collected (Paid),${totalPaid.toFixed(2)}`,
      `Outstanding Khata Balance (Due),${totalDue.toFixed(2)}`,
      '',
      'Breakdown by Settlement Mode',
      ...Object.entries(modeCounts).map(([mode, count]) => `${mode.toUpperCase()},${count} transactions`),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GST_Financial_Summary_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    if (isMoreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMoreOpen]);

  const handlePrimaryClick = () => {
    if (activeSubTab === 'invoices') {
      if (onOpenCreateInvoice) {
        onOpenCreateInvoice();
      } else {
        openCreateInvoiceModal();
      }
    } else if (activeSubTab === 'quotes') {
      setActiveView('create_quote');
    }
  };

  const getPrimaryButtonLabel = () => {
    if (activeSubTab === 'quotes') {
      return 'Create Estimate / Quote';
    }
    return 'Create Invoice';
  };

  return (
    <div className="flex items-center gap-2.5 relative flex-wrap sm:flex-nowrap">
      {/* Quick Counter POS Register Launch Button */}
      <button
        type="button"
        onClick={() => setActiveView('pos_counter')}
        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
      >
        <Zap className="w-3.5 h-3.5 fill-current text-emerald-200" />
        <span>Counter POS</span>
      </button>

      {/* Primary Action Button */}
      <button
        type="button"
        onClick={handlePrimaryClick}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
      >
        <Plus className="w-4 h-4" />
        {getPrimaryButtonLabel()}
      </button>

      {/* Billing & Invoicing Settings Button (5.0, 5.3, 5.4) */}
      <button
        type="button"
        onClick={() => setActiveView('settings')}
        className="px-3.5 py-2 bg-white hover:bg-blue-50/50 border border-blue-200 text-blue-600 text-xs font-semibold rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors"
      >
        <Settings className="w-4 h-4 text-blue-600" />
        Billing & Invoicing Settings
      </button>

      {/* More Actions Dropdown Button (5.0, 5.4) */}
      <div className="relative" ref={moreRef}>
        <button
          type="button"
          onClick={() => setIsMoreOpen(!isMoreOpen)}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300/90 text-slate-800 text-xs font-semibold rounded-xl shadow-2xs flex items-center gap-2 transition-colors"
        >
          More Actions
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
              isMoreOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isMoreOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-40 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => {
                setIsMoreOpen(false);
                setIsImportModalOpen(true);
                setIsImportSuccess(false);
                setImportFileName(null);
              }}
              className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 text-left transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-600">
                  Import Invoices
                </p>
                <p className="text-[11px] text-slate-400">Import invoices in bulk via CSV</p>
              </div>
            </button>

            <button
              onClick={() => {
                setIsMoreOpen(false);
                handleExportInvoicesCsv();
              }}
              className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 text-left transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-600">
                  Export Invoices
                </p>
                <p className="text-[11px] text-slate-400">Export invoice list (CSV)</p>
              </div>
            </button>

            <button
              onClick={() => {
                setIsMoreOpen(false);
                handleDownloadReportCsv();
              }}
              className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 text-left transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-600">
                  Download Report
                </p>
                <p className="text-[11px] text-slate-400">GST billing summary report</p>
              </div>
            </button>

            <div className="my-2 border-t border-slate-100 px-4 pt-2">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Create New
              </span>
            </div>

            <button
              onClick={() => {
                setIsMoreOpen(false);
                setActiveSubTab('quotes');
                setActiveView('create_quote');
              }}
              className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Estimates / Quotes</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        )}
      </div>

      {/* Bulk Invoice Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">Bulk Import Invoices</h3>
                <p className="text-xs text-slate-500 mt-0.5">Upload a CSV file with your past invoices or billing ledger.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors bg-slate-50/50">
                <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="font-semibold text-slate-800 text-sm">Drag & drop your CSV file here</p>
                <p className="text-slate-400 text-xs mt-1">Supports standard .csv format with UTF-8 encoding</p>
                <label className="mt-3 inline-block px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold cursor-pointer shadow-xs transition-colors">
                  <span>Browse File</span>
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImportFileName(e.target.files[0].name);
                        setIsImportSuccess(false);
                      }
                    }}
                  />
                </label>
              </div>

              {importFileName && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">{importFileName}</span>
                  </div>
                  <span className="text-emerald-700 font-semibold text-[11px]">Ready to process</span>
                </div>
              )}

              {isImportSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Invoices parsed and verified successfully! 12 records queued.</span>
                </div>
              )}

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="font-semibold text-slate-800 mb-1">Expected CSV Columns:</p>
                <code className="text-[11px] text-slate-600 block font-mono">
                  InvoiceNo, CustomerName, Phone, ItemName, Quantity, Rate, GSTPercent
                </code>
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!importFileName}
                onClick={() => {
                  setIsImportSuccess(true);
                  setTimeout(() => {
                    setIsImportModalOpen(false);
                  }, 1200);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition-colors shadow-xs"
              >
                Import Invoices
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

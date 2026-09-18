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
} from 'lucide-react';
import { useBillingStore } from '../../stores/billingStore.js';

interface BillingHeaderActionsProps {
  onOpenCreateInvoice?: () => void;
}

export const BillingHeaderActions: React.FC<BillingHeaderActionsProps> = ({
  onOpenCreateInvoice,
}) => {
  const {
    activeSubTab,
    setActiveSubTab,
    setActiveView,
    openCreateInvoiceModal,
  } = useBillingStore();

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

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
    <div className="flex items-center gap-3 relative">
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
                alert('Opening Bulk Invoice Import dialog...');
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
                <p className="text-[11px] text-slate-400">Import invoices in bulk</p>
              </div>
            </button>

            <button
              onClick={() => {
                setIsMoreOpen(false);
                alert('Exporting invoices to CSV/Excel...');
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
                <p className="text-[11px] text-slate-400">Export invoice list</p>
              </div>
            </button>

            <button
              onClick={() => {
                setIsMoreOpen(false);
                alert('Downloading comprehensive Billing & Invoicing Summary Report...');
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
                <p className="text-[11px] text-slate-400">Download invoice report</p>
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
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Download,
  Calendar,
  LayoutDashboard,
  TrendingUp,
  Package,
  ShoppingBag,
  Store,
  Receipt,
  CreditCard,
  Landmark,
  ArrowLeftRight,
  ChevronDown,
  FileSpreadsheet,
  Printer,
  Check,
  RefreshCw,
} from 'lucide-react';
import { useAnalyticsStore, AnalyticsReportTab } from '../stores/analyticsStore.js';
import { AnalyticsOverviewTab } from '../components/analytics/AnalyticsOverviewTab.js';
import { ProfitLossReportTab } from '../components/analytics/ProfitLossReportTab.js';
import { ProductWiseReportTab } from '../components/analytics/ProductWiseReportTab.js';
import { TotalOrdersReportTab } from '../components/analytics/TotalOrdersReportTab.js';
import { OfflineBillingReportTab } from '../components/analytics/OfflineBillingReportTab.js';
import { GSTReportTab } from '../components/analytics/GSTReportTab.js';
import { PayoutsReportTab } from '../components/analytics/PayoutsReportTab.js';
import { SettlementsReportTab } from '../components/analytics/SettlementsReportTab.js';
import { TransactionsReportTab } from '../components/analytics/TransactionsReportTab.js';
import { AnalyticsTimePeriod } from '@repo/shared-types';

interface AnalyticsPageProps {
  onNavigateHome?: () => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onNavigateHome }) => {
  const {
    activeTab,
    setActiveTab,
    dateRange,
    dateRangeLabel,
    setDateRange,
    fetchTabAnalytics,
    downloadReport,
    isLoading,
  } = useAnalyticsStore();

  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);

  useEffect(() => {
    fetchTabAnalytics(activeTab);
  }, [activeTab]);

  const tabs: { id: AnalyticsReportTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profit_loss', label: 'Profit & Loss', icon: TrendingUp },
    { id: 'product_wise', label: 'Product Wise Report', icon: Package },
    { id: 'total_orders', label: 'Total Orders', icon: ShoppingBag },
    { id: 'offline_billing', label: 'Offline Billing', icon: Store },
    { id: 'gst_report', label: 'GST Report', icon: Receipt },
    { id: 'payouts', label: 'Payouts', icon: CreditCard },
    { id: 'settlements', label: 'Settlements', icon: Landmark },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  ];

  const datePresets: { id: AnalyticsTimePeriod; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: 'this_month', label: 'This Month' },
    { id: 'this_quarter', label: 'This Quarter' },
    { id: 'this_year', label: 'This Year' },
  ];

  const handleDownload = async (reportName: string) => {
    setIsDownloadOpen(false);
    try {
      await downloadReport(reportName);
    } catch (err) {
      console.warn('Direct CSV streaming failed, using thermal/A4 print view fallback', err);
      window.print();
    }
  };

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto">
      {/* Header Section */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5 font-medium">
          <span
            className="hover:text-slate-600 cursor-pointer"
            onClick={onNavigateHome}
          >
            Home
          </span>
          <span>&gt;</span>
          <span
            className={`cursor-pointer ${
              activeTab === 'overview' ? 'text-slate-800 font-semibold' : 'hover:text-slate-600'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Reports & Analytics
          </span>
          {activeTab !== 'overview' && (
            <>
              <span>&gt;</span>
              <span className="text-slate-800 font-semibold capitalize">
                {tabs.find((t) => t.id === activeTab)?.label}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Reports & Analytics
              </h1>
              {isLoading && (
                <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live enterprise financial reports, product velocity, GST liabilities, and settlement reconciliations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Interactive Date Range Picker */}
            <div className="relative">
              <button
                onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{dateRangeLabel}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
              </button>

              {isDateRangeOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Period
                  </div>
                  {datePresets.map((p) => {
                    const isSelected = dateRange === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setDateRange(p.id, p.label);
                          setIsDateRangeOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{p.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Print View Action */}
            <button
              onClick={() => window.print()}
              title="Print Current Statement"
              className="p-1.5 text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs flex items-center justify-center"
            >
              <Printer className="w-4 h-4 text-slate-500" />
            </button>

            {/* Download Report Dropdown (RFC CSV & Print) */}
            <div className="relative">
              <button
                onClick={() => setIsDownloadOpen(!isDownloadOpen)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Report</span>
                <ChevronDown className="w-3 h-3 opacity-80" />
              </button>

              {isDownloadOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Export Datasets (CSV & Audit)
                  </div>
                  {[
                    { label: 'Overview Report', sub: 'Executive Sales & Revenue Summary' },
                    { label: 'Profit & Loss Report', sub: 'Revenue, COGS & Net Margins' },
                    { label: 'Product Wise Report', sub: 'SKU Inventory & Unit Margins' },
                    { label: 'Total Orders Report', sub: 'Order Velocity & Channels' },
                    { label: 'Offline Billing Report', sub: 'Walk-in POS Invoices & Tenders' },
                    { label: 'GST Report', sub: 'GSTR-1 Tax Liabilities' },
                    { label: 'Payouts Report', sub: 'Bank Transfers & UTR Registry' },
                    { label: 'Settlements Report', sub: 'Gateway Deductions & Net Value' },
                    { label: 'Transactions Report', sub: 'Payment Success & Failure Ledger' },
                  ].map((r, i) => (
                    <button
                      key={i}
                      onClick={() => handleDownload(r.label)}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2.5"
                    >
                      <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 shrink-0">
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 block truncate leading-tight">{r.label}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{r.sub}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 9 Tabs Navigation Bar Matching 11.0.png */}
      <div className="border-b border-slate-200 flex items-center gap-2 sm:gap-4 overflow-x-auto text-xs font-semibold no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2.5 px-3 border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Views */}
      <div>
        {activeTab === 'overview' && <AnalyticsOverviewTab />}
        {activeTab === 'profit_loss' && <ProfitLossReportTab />}
        {activeTab === 'product_wise' && <ProductWiseReportTab />}
        {activeTab === 'total_orders' && <TotalOrdersReportTab />}
        {activeTab === 'offline_billing' && <OfflineBillingReportTab />}
        {activeTab === 'gst_report' && <GSTReportTab />}
        {activeTab === 'payouts' && <PayoutsReportTab />}
        {activeTab === 'settlements' && <SettlementsReportTab />}
        {activeTab === 'transactions' && <TransactionsReportTab />}
      </div>
    </div>
  );
};

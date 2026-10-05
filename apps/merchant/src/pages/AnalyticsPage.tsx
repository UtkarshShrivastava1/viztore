import React, { useState } from 'react';
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

interface AnalyticsPageProps {
  onNavigateHome?: () => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onNavigateHome }) => {
  const { activeTab, setActiveTab, dateRange } = useAnalyticsStore();
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

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

  const handleDownload = (reportName: string) => {
    setIsDownloadOpen(false);
    alert(`Downloading ${reportName} (PDF/Excel)...`);
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
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Reports & Analytics
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Track and analyze your business performance with detailed reports and insights.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Date Range Picker */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{dateRange}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </div>

            {/* Download Report Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDownloadOpen(!isDownloadOpen)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Download Report</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isDownloadOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                  {[
                    { label: 'Profit & Loss Report', sub: 'Download (PDF, Excel)' },
                    { label: 'Product Wise Report', sub: 'Download (PDF, Excel)' },
                    { label: 'Total Orders Report', sub: 'Download (PDF, Excel)' },
                    { label: 'Offline Billing Report', sub: 'Download (PDF, Excel)' },
                    { label: 'GST Report', sub: 'Download (PDF, Excel)' },
                  ].map((r, i) => (
                    <button
                      key={i}
                      onClick={() => handleDownload(r.label)}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2.5"
                    >
                      <div className="p-1.5 rounded-md bg-blue-50 text-blue-600">
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block leading-tight">{r.label}</span>
                        <span className="text-[10px] text-slate-400">{r.sub}</span>
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

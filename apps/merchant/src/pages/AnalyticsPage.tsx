import React from 'react';
import {
  Download,
  Calendar,
  LayoutDashboard,
  TrendingUp,
  Package,
  ShoppingBag,
  Store,
  Receipt,
  Flame,
  CreditCard,
  Boxes,
  ArrowLeftRight,
  SendHorizontal,
} from 'lucide-react';
import { useAnalyticsStore, AnalyticsReportTab } from '../stores/analyticsStore.js';
import { AnalyticsOverviewTab } from '../components/analytics/AnalyticsOverviewTab.js';
import { ProfitLossReportTab } from '../components/analytics/ProfitLossReportTab.js';
import { ProductWiseReportTab } from '../components/analytics/ProductWiseReportTab.js';
import { TotalOrdersReportTab } from '../components/analytics/TotalOrdersReportTab.js';
import { OfflineBillingReportTab } from '../components/analytics/OfflineBillingReportTab.js';
import { GSTReportTab } from '../components/analytics/GSTReportTab.js';
import { HighSellingReportTab } from '../components/analytics/HighSellingReportTab.js';
import { PayoutOverviewTab } from '../components/payouts/PayoutOverviewTab.js';
import { SettlementsTab } from '../components/payouts/SettlementsTab.js';
import { TransactionsTab } from '../components/payouts/TransactionsTab.js';
import { PayoutRequestsTab } from '../components/payouts/PayoutRequestsTab.js';

interface AnalyticsPageProps {
  onNavigateHome?: () => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onNavigateHome }) => {
  const { activeTab, setActiveTab, dateRange } = useAnalyticsStore();

  const handleDownloadReport = () => {
    alert(`Downloading ${activeTab.replace(/_/g, ' ')} report PDF...`);
  };

  const tabs: { id: AnalyticsReportTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profit_loss', label: 'Profit & Loss', icon: TrendingUp },
    { id: 'product_wise', label: 'Product Wise Report', icon: Package },
    { id: 'total_orders', label: 'Total Orders', icon: ShoppingBag },
    { id: 'offline_billing', label: 'Offline Billing', icon: Store },
    { id: 'gst_report', label: 'GST Report', icon: Receipt },
    { id: 'high_selling', label: 'High Selling Products', icon: Flame },
    { id: 'payouts', label: 'Payouts', icon: CreditCard },
    { id: 'settlements', label: 'Settlements', icon: Boxes },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'payout_requests', label: 'Payout Requests', icon: SendHorizontal },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-medium">
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
                {activeTab.replace(/_/g, ' ')}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {activeTab === 'profit_loss'
                ? 'Profit & Loss'
                : activeTab === 'product_wise'
                ? 'Product Wise Report'
                : activeTab === 'total_orders'
                ? 'Total Orders Report'
                : activeTab === 'offline_billing'
                ? 'Offline Billing Report'
                : activeTab === 'gst_report'
                ? 'GST Report'
                : activeTab === 'high_selling'
                ? 'High Selling Products'
                : activeTab === 'payouts'
                ? 'Payouts'
                : activeTab === 'settlements'
                ? 'Settlements'
                : activeTab === 'transactions'
                ? 'Transactions'
                : activeTab === 'payout_requests'
                ? 'Payout Requests'
                : 'Reports & Analytics'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {activeTab === 'profit_loss'
                ? "View your store's financial performance summary."
                : activeTab === 'product_wise'
                ? 'Detailed performance of each product sold in your store.'
                : activeTab === 'total_orders'
                ? 'Detailed analysis of all orders received in your store.'
                : activeTab === 'offline_billing'
                ? 'Detailed analysis of all offline (walk-in) billings in your store.'
                : activeTab === 'gst_report'
                ? 'Detailed GST summary of all sales, tax collected, and returns.'
                : activeTab === 'high_selling'
                ? 'View products with the highest sales in the selected period.'
                : 'Track and analyze your business performance with detailed reports and insights.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Date Range Picker */}
            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{dateRange}</span>
            </div>

            {/* Download Report */}
            <button
              onClick={handleDownloadReport}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Download Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Matching Mockup 12.0.png */}
      <div className="border-b border-slate-200 flex items-center gap-4 sm:gap-6 overflow-x-auto text-xs font-semibold">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Report Content */}
      {activeTab === 'overview' && <AnalyticsOverviewTab />}
      {activeTab === 'profit_loss' && <ProfitLossReportTab />}
      {activeTab === 'product_wise' && <ProductWiseReportTab />}
      {activeTab === 'total_orders' && <TotalOrdersReportTab />}
      {activeTab === 'offline_billing' && <OfflineBillingReportTab />}
      {activeTab === 'gst_report' && <GSTReportTab />}
      {activeTab === 'high_selling' && <HighSellingReportTab />}
      {activeTab === 'payouts' && <PayoutOverviewTab />}
      {activeTab === 'settlements' && <SettlementsTab />}
      {activeTab === 'transactions' && <TransactionsTab />}
      {activeTab === 'payout_requests' && <PayoutRequestsTab />}
    </div>
  );
};

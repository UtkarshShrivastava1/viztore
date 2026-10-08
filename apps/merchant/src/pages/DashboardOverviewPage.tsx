import React from 'react';
import { GreetingHeader, KpiCards } from '../components/dashboard/SalesOverview.js';
import { LiveOrderAlerts } from '../components/dashboard/LiveOrderAlerts.js';
import { RevenueChart } from '../components/dashboard/RevenueChart.js';
import { CreateNewBillCard } from '../components/dashboard/CreateNewBillCard.js';
import { OrderSummaryCard } from '../components/dashboard/OrderSummaryCard.js';
import { TopProducts } from '../components/dashboard/TopProducts.js';
import { LowStockWarnings } from '../components/dashboard/LowStockWarnings.js';
import { QuickAccessPanel } from '../components/dashboard/QuickAccessPanel.js';
import { AnnouncementsBar } from '../components/dashboard/AnnouncementsBar.js';
import { DashboardTab } from '../components/dashboard/Sidebar.js';
import { useAuthStore } from '../stores/authStore.js';
import { AlertTriangle } from 'lucide-react';

interface DashboardOverviewPageProps {
  onNavigate: (tab: DashboardTab) => void;
  onOpenAddProduct: () => void;
  onOpenBulkUpload: () => void;
}

export const DashboardOverviewPage: React.FC<DashboardOverviewPageProps> = ({
  onNavigate,
  onOpenAddProduct,
  onOpenBulkUpload,
}) => {
  const { isStoreActive, setStoreActive } = useAuthStore();

  return (
    <div className="space-y-3.5 max-w-[1600px] mx-auto">
      {/* Inactive Dashboard Alert Banner (1.0b(V1).png) */}
      {!isStoreActive && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-rose-900">
                Your Store is Currently Inactive
              </h4>
              <p className="text-[11px] sm:text-xs text-rose-700 mt-0.5 leading-snug">
                Customer orders are paused and your store is hidden from the customer app. Activate your store to start receiving orders again.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStoreActive(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs whitespace-nowrap transition-colors"
          >
            Activate Store Now
          </button>
        </div>
      )}

      {/* 1. Greeting & Date Filter */}
      <GreetingHeader />

      {/* 2. Top Level: Left 9 cols (KPIs + New Orders + Sales Overview) | Right 3 cols (Create New Bill + Order Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Left Section (approx 75% width) */}
        <div className="lg:col-span-9 space-y-3.5 flex flex-col justify-between">
          {/* Top 3 KPI Cards */}
          <KpiCards />

          {/* New Orders & Sales Overview Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 items-stretch">
            <div className="lg:col-span-6 flex flex-col">
              <LiveOrderAlerts onNavigateOrders={() => onNavigate('orders')} />
            </div>
            <div className="lg:col-span-6 flex flex-col">
              <RevenueChart />
            </div>
          </div>
        </div>

        {/* Right Section (approx 25% width) */}
        <div className="lg:col-span-3 space-y-3.5 flex flex-col justify-between">
          <CreateNewBillCard onOpenCreateInvoice={() => onNavigate('billing')} />
          <OrderSummaryCard onNavigateStatus={() => onNavigate('orders')} />
        </div>
      </div>

      {/* 3. Middle 3-Column Grid: Top Selling Products | Low Stock Alert | Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 items-stretch">
        <div className="flex flex-col">
          <TopProducts />
        </div>
        <div className="flex flex-col">
          <LowStockWarnings onAddStock={onOpenAddProduct} />
        </div>
        <div className="flex flex-col">
          <QuickAccessPanel
            onNavigate={onNavigate}
            onOpenAddProduct={onOpenAddProduct}
            onOpenBulkUpload={onOpenBulkUpload}
          />
        </div>
      </div>

      {/* 4. Footer Announcements Row */}
      <AnnouncementsBar />
    </div>
  );
};

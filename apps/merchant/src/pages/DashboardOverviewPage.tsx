import React, { useEffect, useCallback } from 'react';
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
import { useOrderStore } from '../stores/orderStore.js';
import { useCatalogStore } from '../stores/catalogStore.js';
import { useBillingStore } from '../stores/billingStore.js';
import { useCustomerStore } from '../stores/customerStore.js';
import { AlertTriangle } from 'lucide-react';

interface DashboardOverviewPageProps {
  onNavigate: (tab: DashboardTab) => void;
  onOpenAddProduct: () => void;
  onOpenBulkUpload: () => void;
  onOpenCreateOrder?: () => void;
}

export const DashboardOverviewPage: React.FC<DashboardOverviewPageProps> = ({
  onNavigate,
  onOpenAddProduct,
  onOpenBulkUpload,
  onOpenCreateOrder,
}) => {
  const { currentStore, isStoreActive, setStoreActive, isAuthenticated } = useAuthStore();
  const { fetchOrders } = useOrderStore();
  const { fetchProducts } = useCatalogStore();

  const syncDashboardData = useCallback(() => {
    const storeId = currentStore?._id || currentStore?.id;
    fetchOrders(storeId).catch(() => {});
    fetchProducts(storeId).catch(() => {});
  }, [currentStore, fetchOrders, fetchProducts]);

  // 1. Initial live hydration on mount or when currentStore / auth changes
  useEffect(() => {
    syncDashboardData();
  }, [syncDashboardData]);

  // 2. Continuous Live Sync on window focus, tab visibility & 20s heartbeat
  useEffect(() => {
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        syncDashboardData();
      }
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        syncDashboardData();
      }
    }, 20000);

    return () => {
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      clearInterval(intervalId);
    };
  }, [syncDashboardData]);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Offline / Suspended Store Banner */}
      {isAuthenticated && currentStore && !isStoreActive && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between text-amber-500 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Your store is currently <strong>Offline</strong>. Customers cannot place live orders on the storefront.
            </span>
          </div>
          <button
            onClick={() => setStoreActive(true)}
            className="px-3 py-1 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600 transition-colors shadow-2xs"
          >
            Go Online
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
              <RevenueChart onNavigateOrders={() => onNavigate('orders')} />
            </div>
          </div>
        </div>

        {/* Right Section (approx 25% width) */}
        <div className="lg:col-span-3 space-y-3.5 flex flex-col justify-between">
          <CreateNewBillCard 
            onOpenCreateInvoice={() => {
              useBillingStore.getState().setActiveSubTab('invoices');
              useBillingStore.getState().openCreateInvoiceModal();
              onNavigate('billing');
            }}
            onOpenEstimate={() => {
              useBillingStore.getState().setActiveSubTab('quotes');
              useBillingStore.getState().openCreateInvoiceModal();
              onNavigate('billing');
            }}
            onOpenCreditNote={() => {
              useBillingStore.getState().setActiveSubTab('credit_notes');
              onNavigate('billing');
            }}
            onViewAllInvoices={() => {
              useBillingStore.getState().setActiveSubTab('invoices');
              onNavigate('billing');
            }}
          />
          <OrderSummaryCard
            onNavigateStatus={(_statusTab) => {
              onNavigate('orders');
            }}
          />
        </div>
      </div>

      {/* 3. Middle 3-Column Grid: Top Selling Products | Low Stock Alert | Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 items-stretch">
        <div className="flex flex-col">
          <TopProducts onViewAll={() => onNavigate('catalog')} />
        </div>
        <div className="flex flex-col">
          <LowStockWarnings
            onAddStock={() => onNavigate('inventory')}
            onViewAll={() => onNavigate('inventory')}
          />
        </div>
        <div className="flex flex-col">
          <QuickAccessPanel
            onNavigate={onNavigate}
            onOpenAddProduct={onOpenAddProduct}
            onOpenBulkUpload={onOpenBulkUpload}
            onOpenCreateOrder={onOpenCreateOrder || (() => onNavigate('orders'))}
            onOpenAddCustomer={() => {
              useCustomerStore.getState().setViewMode('add');
              onNavigate('customers');
            }}
            onOpenCreateInvoice={() => {
              useBillingStore.getState().setActiveSubTab('invoices');
              useBillingStore.getState().openCreateInvoiceModal();
              onNavigate('billing');
            }}
            onOpenRefundOrder={() => {
              onNavigate('returns');
            }}
          />
        </div>
      </div>

      {/* 4. Footer Announcements Row */}
      <AnnouncementsBar />
    </div>
  );
};

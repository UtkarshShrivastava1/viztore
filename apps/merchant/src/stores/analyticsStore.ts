import { create } from 'zustand';
import {
  AnalyticsReportTab,
  AnalyticsTimePeriod,
  IAnalyticsOverviewResponse,
  IProfitLossResponse,
  IProductWiseResponse,
  ITotalOrdersResponse,
  IOfflineBillingResponse,
  IGSTReportResponse,
  IPayoutsReportResponse,
  ISettlementsReportResponse,
  ITransactionsReportResponse,
  IProductPerformanceItem,
  IOrderReportItem,
  IOfflineBillRecord,
  IGSTInvoiceRecord,
  IPayoutReportRecord,
  ISettlementReportRecord,
  ITransactionReportRecord,
} from '@repo/shared-types';
import { analyticsApi } from '../lib/api.js';

export {
  type AnalyticsReportTab,
  type IProductPerformanceItem as ProductPerformanceItem,
  type IOrderReportItem as OrderReportItem,
  type IOfflineBillRecord as OfflineBillRecord,
  type IGSTInvoiceRecord as GSTInvoiceRecord,
  type IPayoutReportRecord as PayoutReportRecord,
  type ISettlementReportRecord as SettlementReportRecord,
  type ITransactionReportRecord as TransactionReportRecord,
};

interface AnalyticsState {
  activeTab: AnalyticsReportTab;
  dateRange: AnalyticsTimePeriod;
  dateRangeLabel: string;
  categoryFilter: string;
  brandFilter: string;
  searchQuery: string;

  // Cached datasets
  overviewData: IAnalyticsOverviewResponse | null;
  profitLossData: IProfitLossResponse | null;
  productWiseData: IProductWiseResponse | null;
  totalOrdersData: ITotalOrdersResponse | null;
  offlineBillingData: IOfflineBillingResponse | null;
  gstReportData: IGSTReportResponse | null;
  payoutsData: IPayoutsReportResponse | null;
  settlementsData: ISettlementsReportResponse | null;
  transactionsData: ITransactionsReportResponse | null;

  isLoading: boolean;
  error: string | null;

  // Actions
  setActiveTab: (tab: AnalyticsReportTab) => void;
  setDateRange: (range: AnalyticsTimePeriod, label?: string) => void;
  setCategoryFilter: (cat: string) => void;
  setBrandFilter: (brand: string) => void;
  setSearchQuery: (q: string) => void;
  fetchTabAnalytics: (tab?: AnalyticsReportTab) => Promise<void>;
  downloadReport: (reportName: string) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  activeTab: 'overview',
  dateRange: '7d',
  dateRangeLabel: 'Last 7 Days',
  categoryFilter: 'All Categories',
  brandFilter: 'All Brands',
  searchQuery: '',

  overviewData: null,
  profitLossData: null,
  productWiseData: null,
  totalOrdersData: null,
  offlineBillingData: null,
  gstReportData: null,
  payoutsData: null,
  settlementsData: null,
  transactionsData: null,

  isLoading: false,
  error: null,

  setActiveTab: (tab) => {
    set({ activeTab: tab });
    get().fetchTabAnalytics(tab);
  },

  setDateRange: (range, label) => {
    const labels: Record<AnalyticsTimePeriod, string> = {
      today: 'Today',
      yesterday: 'Yesterday',
      '7d': 'Last 7 Days',
      '30d': 'Last 30 Days',
      this_month: 'This Month',
      this_quarter: 'This Quarter',
      this_year: 'This Year',
    };
    set({ dateRange: range, dateRangeLabel: label || labels[range] || range });
    get().fetchTabAnalytics();
  },

  setCategoryFilter: (cat) => {
    set({ categoryFilter: cat });
    if (get().activeTab === 'product_wise') {
      get().fetchTabAnalytics('product_wise');
    }
  },

  setBrandFilter: (brand) => set({ brandFilter: brand }),
  setSearchQuery: (q) => set({ searchQuery: q }),

  fetchTabAnalytics: async (targetTab) => {
    const tab = targetTab || get().activeTab;
    const period = get().dateRange;

    set({ isLoading: true, error: null });

    try {
      switch (tab) {
        case 'overview': {
          const res = await analyticsApi.getOverview(period);
          if (res?.data) set({ overviewData: res.data });
          break;
        }
        case 'profit_loss': {
          const res = await analyticsApi.getProfitLoss(period);
          if (res?.data) set({ profitLossData: res.data });
          break;
        }
        case 'product_wise': {
          const res = await analyticsApi.getProductWise(period, get().categoryFilter);
          if (res?.data) set({ productWiseData: res.data });
          break;
        }
        case 'total_orders': {
          const res = await analyticsApi.getTotalOrders(period);
          if (res?.data) set({ totalOrdersData: res.data });
          break;
        }
        case 'offline_billing': {
          const res = await analyticsApi.getOfflineBilling(period);
          if (res?.data) set({ offlineBillingData: res.data });
          break;
        }
        case 'gst_report': {
          const res = await analyticsApi.getGSTReport(period);
          if (res?.data) set({ gstReportData: res.data });
          break;
        }
        case 'payouts': {
          const res = await analyticsApi.getPayouts(period);
          if (res?.data) set({ payoutsData: res.data });
          break;
        }
        case 'settlements': {
          const res = await analyticsApi.getSettlements(period);
          if (res?.data) set({ settlementsData: res.data });
          break;
        }
        case 'transactions': {
          const res = await analyticsApi.getTransactions(period);
          if (res?.data) set({ transactionsData: res.data });
          break;
        }
      }
    } catch (err: any) {
      console.warn(`[analyticsStore] Failed to fetch analytics for ${tab}:`, err?.message || err);
      // Retain graceful local baseline if network fails
      set({ error: err?.message || 'Failed to load live analytics' });
    } finally {
      set({ isLoading: false });
    }
  },

  downloadReport: async (reportName) => {
    const reportKeyMap: Record<string, string> = {
      'Overview Report': 'overview',
      'Profit & Loss Report': 'profit_loss',
      'Product Wise Report': 'product_wise',
      'Total Orders Report': 'total_orders',
      'Offline Billing Report': 'offline_billing',
      'GST Report': 'gst_report',
      'Payouts Report': 'payouts',
      'Settlements Report': 'settlements',
      'Transactions Report': 'transactions',
    };
    const key = reportKeyMap[reportName] || 'overview';
    await analyticsApi.downloadReportCsv(key, get().dateRange);
  },
}));

import { create } from 'zustand';

export type AnalyticsReportTab =
  | 'overview'
  | 'profit_loss'
  | 'product_wise'
  | 'total_orders'
  | 'offline_billing'
  | 'gst_report'
  | 'payouts'
  | 'settlements'
  | 'transactions';

export interface ProductPerformanceItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  sales: number;
  quantitySold: number;
  cogs: number;
  profit: number;
  profitMargin: number;
  imageUrl?: string;
}

export interface OrderReportItem {
  id: string;
  orderId: string;
  dateTime: string;
  customerName: string;
  amount: number;
  paymentMethod: 'UPI' | 'Card' | 'COD' | 'Net Banking';
  status: 'Delivered' | 'Pending' | 'Cancelled' | 'Returned';
}

export interface OfflineBillRecord {
  id: string;
  billNo: string;
  dateTime: string;
  customerName: string;
  items: number;
  amount: number;
  paymentMethod: 'Cash' | 'UPI' | 'Card';
  createdBy: string;
}

export interface GSTInvoiceRecord {
  id: string;
  invoiceNo: string;
  dateTime: string;
  customerName: string;
  invoiceType: string;
  taxableValue: number;
  gstRate: string;
  gstAmount: number;
  totalAmount: number;
}

export interface PayoutReportRecord {
  id: string;
  payoutId: string;
  dateTime: string;
  reference: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed';
  paymentMethod: 'Bank Transfer' | 'UPI' | 'Card' | 'Cash';
}

export interface SettlementReportRecord {
  id: string;
  settlementId: string;
  dateTime: string;
  settlementPeriod: string;
  orders: number;
  amount: number;
  status: 'Processed' | 'Pending' | 'Failed';
  paymentMethod: 'Bank Transfer' | 'UPI' | 'Card' | 'Cash';
}

export interface TransactionReportRecord {
  id: string;
  transactionId: string;
  dateTime: string;
  type: string;
  orderId: string;
  customer: string;
  paymentMethod: 'UPI' | 'Card' | 'Cash' | 'Net Banking';
  amount: number;
  status: 'Success' | 'Failed';
}

interface AnalyticsState {
  activeTab: AnalyticsReportTab;
  dateRange: string;
  categoryFilter: string;
  brandFilter: string;

  // Actions
  setActiveTab: (tab: AnalyticsReportTab) => void;
  setDateRange: (range: string) => void;
  setCategoryFilter: (cat: string) => void;
  setBrandFilter: (brand: string) => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  activeTab: 'overview',
  dateRange: '10 May 2024 - 16 May 2024',
  categoryFilter: 'All Categories',
  brandFilter: 'All Brands',

  setActiveTab: (tab) => set({ activeTab: tab }),
  setDateRange: (range) => set({ dateRange: range }),
  setCategoryFilter: (cat) => set({ categoryFilter: cat }),
  setBrandFilter: (brand) => set({ brandFilter: brand }),
}));

import { z } from 'zod';

export type AnalyticsTimePeriod =
  | 'today'
  | 'yesterday'
  | '7d'
  | '30d'
  | 'this_month'
  | 'this_quarter'
  | 'this_year';

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

// Overview
export interface IAnalyticsOverviewKPIs {
  totalRevenue: number;
  revenueChangePercent: number;
  totalProfit: number;
  profitChangePercent: number;
  totalOrders: number;
  ordersChangePercent: number;
  avgOrderValue: number;
  aovChangePercent: number;
  offlineBillingSales: number;
  gstCollected: number;
}

export interface IAnalyticsChartPoint {
  label: string;
  revenue: number;
  orders: number;
  profit: number;
}

export interface IAnalyticsTopProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitsSold: number;
  revenue: number;
  profit: number;
  imageUrl?: string;
}

export interface IAnalyticsCategoryDistribution {
  category: string;
  revenue: number;
  percentage: number;
}

export interface IAnalyticsPaymentBreakdown {
  method: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface IAnalyticsOverviewResponse {
  kpis: IAnalyticsOverviewKPIs;
  trends: IAnalyticsChartPoint[];
  channelBreakdown: {
    onlineRevenue: number;
    onlineOrders: number;
    posRevenue: number;
    posOrders: number;
  };
  topProducts: IAnalyticsTopProduct[];
  categoryDistribution: IAnalyticsCategoryDistribution[];
  paymentBreakdown: IAnalyticsPaymentBreakdown[];
}

// Profit & Loss
export interface IProfitLossResponse {
  kpis: {
    totalRevenue: number;
    revenueChange: number;
    totalExpenses: number;
    expenseChange: number;
    grossProfit: number;
    netProfit: number;
    profitMargin: number;
    cogs: number;
  };
  revenueStreams: {
    onlineSales: number;
    posCounterSales: number;
    deliveryCharges: number;
    otherIncome: number;
  };
  operatingExpenses: {
    rent: number;
    salaries: number;
    electricity: number;
    packaging: number;
    logistics: number;
    maintenance: number;
    other: number;
  };
  monthlyTrends: Array<{
    month: string;
    revenue: number;
    cogs: number;
    operatingExpenses: number;
    netProfit: number;
    marginPercent: number;
  }>;
}

// Product Wise
export interface IProductPerformanceItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  sales: number;
  quantitySold: number;
  cogs: number;
  profit: number;
  profitMargin: number;
  stockRemaining: number;
  imageUrl?: string;
}

export interface IProductWiseResponse {
  kpis: {
    totalProductsListed: number;
    totalUnitsSold: number;
    topCategory: string;
    avgMarginPercent: number;
  };
  products: IProductPerformanceItem[];
}

// Orders Report
export interface IOrderReportItem {
  id: string;
  orderId: string;
  dateTime: string;
  customerName: string;
  amount: number;
  paymentMethod: 'UPI' | 'Card' | 'COD' | 'Net Banking' | 'Cash';
  status: 'Delivered' | 'Pending' | 'Cancelled' | 'Returned' | 'Confirmed' | 'Packed' | 'Shipped';
  channel: 'Online' | 'POS Counter';
}

export interface ITotalOrdersResponse {
  kpis: {
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    returnedOrders: number;
    completionRate: number;
    avgOrderValue: number;
  };
  statusDistribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  channelComparison: {
    online: { orders: number; amount: number };
    pos: { orders: number; amount: number };
  };
  orders: IOrderReportItem[];
}

// Offline Billing
export interface IOfflineBillRecord {
  id: string;
  billNo: string;
  dateTime: string;
  customerName: string;
  items: number;
  amount: number;
  tax: number;
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Khata';
  createdBy: string;
}

export interface IOfflineBillingResponse {
  kpis: {
    totalSales: number;
    totalBills: number;
    cashSharePercent: number;
    upiSharePercent: number;
    avgTicketSize: number;
  };
  tenderBreakdown: {
    cash: number;
    upi: number;
    card: number;
    khata: number;
  };
  bills: IOfflineBillRecord[];
}

// GST Report
export interface IGSTInvoiceRecord {
  id: string;
  invoiceNo: string;
  dateTime: string;
  customerName: string;
  customerGstin?: string;
  invoiceType: 'Tax Invoice' | 'Bill of Supply';
  taxableValue: number;
  gstRate: string;
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
  totalAmount: number;
}

export interface IGSTReportResponse {
  kpis: {
    totalTaxableValue: number;
    totalCgst: number;
    totalSgst: number;
    totalIgst: number;
    totalGstLiability: number;
    totalInvoices: number;
  };
  slabSummary: Array<{
    rate: string;
    taxableValue: number;
    cgst: number;
    sgst: number;
    igst: number;
    totalTax: number;
  }>;
  invoices: IGSTInvoiceRecord[];
}

// Payouts Report
export interface IPayoutReportRecord {
  id: string;
  payoutId: string;
  dateTime: string;
  reference: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed';
  paymentMethod: 'Bank Transfer' | 'UPI' | 'Card' | 'Cash';
  bankName?: string;
  utrNumber?: string;
}

export interface IPayoutsReportResponse {
  kpis: {
    totalPayouts: number;
    processedAmount: number;
    pendingAmount: number;
    failedAmount: number;
  };
  payouts: IPayoutReportRecord[];
}

// Settlements Report
export interface ISettlementReportRecord {
  id: string;
  settlementId: string;
  dateTime: string;
  settlementPeriod: string;
  orders: number;
  amount: number;
  deductions: number;
  netAmount: number;
  status: 'Processed' | 'Pending' | 'Failed';
  method: 'Bank Transfer' | 'UPI' | 'Card' | 'Cash';
}

export interface ISettlementsReportResponse {
  kpis: {
    totalSettlements: number;
    grossVolume: number;
    platformCommission: number;
    gatewayFees: number;
    netSettled: number;
  };
  settlements: ISettlementReportRecord[];
}

// Transactions Report
export interface ITransactionReportRecord {
  id: string;
  transactionId: string;
  dateTime: string;
  type: 'Order Payment' | 'POS Counter' | 'Refund' | 'Payout';
  orderId: string;
  customer: string;
  paymentMethod: 'UPI' | 'Card' | 'Cash' | 'Net Banking';
  amount: number;
  status: 'Success' | 'Failed' | 'Refunded';
  failureReason?: string;
}

export interface ITransactionsReportResponse {
  kpis: {
    totalTransactions: number;
    successCount: number;
    failedCount: number;
    refundCount: number;
    successRatePercent: number;
    totalVolume: number;
  };
  transactions: ITransactionReportRecord[];
}

// Query validator
export const analyticsQuerySchema = z.object({
  period: z.enum(['today', 'yesterday', '7d', '30d', 'this_month', 'this_quarter', 'this_year']).optional().default('7d'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  category: z.string().optional(),
  storeId: z.string().optional(),
});

export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>;

// Aliases without I prefix
export type ProductPerformanceItem = IProductPerformanceItem;
export type OrderReportItem = IOrderReportItem;
export type OfflineBillRecord = IOfflineBillRecord;
export type GSTInvoiceRecord = IGSTInvoiceRecord;
export type PayoutReportRecord = IPayoutReportRecord;
export type SettlementReportRecord = ISettlementReportRecord;
export type TransactionReportRecord = ITransactionReportRecord;

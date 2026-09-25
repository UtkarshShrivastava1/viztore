import { create } from 'zustand';

export type AnalyticsReportTab =
  | 'overview'
  | 'profit_loss'
  | 'product_wise'
  | 'total_orders'
  | 'offline_billing'
  | 'gst_report'
  | 'high_selling'
  | 'payouts'
  | 'settlements'
  | 'transactions'
  | 'payout_requests';

export interface ProductPerformanceItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantitySold: number;
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  profitMargin: number;
  imageUrl?: string;
  totalOrders?: number;
  avgSellingPrice?: number;
  percentageOfTotalSales?: number;
}

export interface OfflineBillRecord {
  billNo: string;
  dateTime: string;
  customer: string;
  items: number;
  billAmount: number;
  discount: number;
  tax: number;
  netAmount: number;
  paymentMethod: 'Cash' | 'UPI' | 'Card';
  cashier: string;
}

export interface GSTRateRow {
  rate: string;
  taxableSales: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
}

export interface GSTInvoiceRow {
  invoiceType: string;
  totalInvoices: number;
  taxableSales: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
}

interface AnalyticsState {
  activeTab: AnalyticsReportTab;
  dateRange: string;
  compareRange: string;
  categoryFilter: string;
  brandFilter: string;

  // Datasets
  productsPerformance: ProductPerformanceItem[];
  offlineBills: OfflineBillRecord[];
  gstRatesSummary: GSTRateRow[];
  gstInvoicesSummary: GSTInvoiceRow[];

  // Actions
  setActiveTab: (tab: AnalyticsReportTab) => void;
  setDateRange: (range: string) => void;
  setCompareRange: (range: string) => void;
  setCategoryFilter: (cat: string) => void;
  setBrandFilter: (brand: string) => void;
}

export const initialProductPerformance: ProductPerformanceItem[] = [
  {
    id: 'prd-1',
    name: "Men's Cotton Shirt",
    sku: 'MSH-001',
    category: "Men's Wear",
    quantitySold: 320,
    totalRevenue: 25450.0,
    totalCost: 16780.0,
    grossProfit: 8670.0,
    profitMargin: 34.06,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=120&auto=format&fit=crop&q=80',
    totalOrders: 298,
    avgSellingPrice: 392.03,
    percentageOfTotalSales: 10.08,
  },
  {
    id: 'prd-2',
    name: "Women's Kurti",
    sku: 'WKU-002',
    category: "Women's Wear",
    quantitySold: 280,
    totalRevenue: 18750.0,
    totalCost: 11620.0,
    grossProfit: 7130.0,
    profitMargin: 38.0,
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=120&auto=format&fit=crop&q=80',
    totalOrders: 256,
    avgSellingPrice: 364.29,
    percentageOfTotalSales: 8.21,
  },
  {
    id: 'prd-3',
    name: 'T-Shirt (Pack of 2)',
    sku: 'TSH-003',
    category: "Men's Wear",
    quantitySold: 240,
    totalRevenue: 15200.0,
    totalCost: 9240.0,
    grossProfit: 5960.0,
    profitMargin: 39.21,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120&auto=format&fit=crop&q=80',
    totalOrders: 210,
    avgSellingPrice: 340.0,
    percentageOfTotalSales: 6.54,
  },
  {
    id: 'prd-4',
    name: 'Denim Jeans',
    sku: 'DJN-004',
    category: "Men's Wear",
    quantitySold: 210,
    totalRevenue: 12980.0,
    totalCost: 8450.0,
    grossProfit: 4530.0,
    profitMargin: 34.87,
    imageUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=120&auto=format&fit=crop&q=80',
    totalOrders: 190,
    avgSellingPrice: 375.0,
    percentageOfTotalSales: 6.33,
  },
  {
    id: 'prd-5',
    name: 'Casual Shoes',
    sku: 'CSH-005',
    category: 'Footwear',
    quantitySold: 180,
    totalRevenue: 10450.0,
    totalCost: 6720.0,
    grossProfit: 3730.0,
    profitMargin: 35.7,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=120&auto=format&fit=crop&q=80',
    totalOrders: 165,
    avgSellingPrice: 402.0,
    percentageOfTotalSales: 5.81,
  },
  {
    id: 'prd-6',
    name: 'Formal Shirt',
    sku: 'FSH-006',
    category: "Men's Wear",
    quantitySold: 150,
    totalRevenue: 9850.0,
    totalCost: 6150.0,
    grossProfit: 3700.0,
    profitMargin: 37.56,
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=120&auto=format&fit=crop&q=80',
    totalOrders: 138,
    avgSellingPrice: 399.0,
    percentageOfTotalSales: 4.81,
  },
  {
    id: 'prd-7',
    name: 'Saree',
    sku: 'SAR-007',
    category: "Women's Wear",
    quantitySold: 120,
    totalRevenue: 8750.0,
    totalCost: 5420.0,
    grossProfit: 3330.0,
    profitMargin: 38.06,
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=120&auto=format&fit=crop&q=80',
    totalOrders: 112,
    avgSellingPrice: 470.0,
    percentageOfTotalSales: 4.53,
  },
  {
    id: 'prd-8',
    name: 'Wrist Watch',
    sku: 'WAT-008',
    category: 'Accessories',
    quantitySold: 95,
    totalRevenue: 8250.0,
    totalCost: 4760.0,
    grossProfit: 3490.0,
    profitMargin: 42.3,
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=120&auto=format&fit=crop&q=80',
    totalOrders: 92,
    avgSellingPrice: 440.0,
    percentageOfTotalSales: 3.36,
  },
  {
    id: 'prd-9',
    name: 'Belt',
    sku: 'BLT-009',
    category: 'Accessories',
    quantitySold: 90,
    totalRevenue: 4050.0,
    totalCost: 2160.0,
    grossProfit: 1890.0,
    profitMargin: 46.67,
    imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=120&auto=format&fit=crop&q=80',
    totalOrders: 85,
    avgSellingPrice: 310.0,
    percentageOfTotalSales: 2.24,
  },
  {
    id: 'prd-10',
    name: 'Cap',
    sku: 'CAP-010',
    category: 'Accessories',
    quantitySold: 80,
    totalRevenue: 3500.0,
    totalCost: 1820.0,
    grossProfit: 1680.0,
    profitMargin: 48.0,
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=120&auto=format&fit=crop&q=80',
    totalOrders: 75,
    avgSellingPrice: 275.63,
    percentageOfTotalSales: 1.77,
  },
];

const mockOfflineBills: OfflineBillRecord[] = [
  {
    billNo: 'OFF0001032',
    dateTime: '16 May 2024, 08:45 PM',
    customer: 'Walk-in Customer',
    items: 5,
    billAmount: 1250.0,
    discount: 50.0,
    tax: 112.5,
    netAmount: 1312.5,
    paymentMethod: 'Cash',
    cashier: 'Ravi Kumar',
  },
  {
    billNo: 'OFF0001031',
    dateTime: '16 May 2024, 07:15 PM',
    customer: 'Walk-in Customer',
    items: 3,
    billAmount: 850.0,
    discount: 30.0,
    tax: 76.5,
    netAmount: 896.5,
    paymentMethod: 'UPI',
    cashier: 'Sneha Patel',
  },
  {
    billNo: 'OFF0001030',
    dateTime: '16 May 2024, 06:05 PM',
    customer: 'Walk-in Customer',
    items: 7,
    billAmount: 2450.0,
    discount: 100.0,
    tax: 220.5,
    netAmount: 2570.5,
    paymentMethod: 'Card',
    cashier: 'Amit Verma',
  },
  {
    billNo: 'OFF0001029',
    dateTime: '16 May 2024, 05:20 PM',
    customer: 'Walk-in Customer',
    items: 2,
    billAmount: 450.0,
    discount: 0.0,
    tax: 40.5,
    netAmount: 490.5,
    paymentMethod: 'Cash',
    cashier: 'Neha Singh',
  },
  {
    billNo: 'OFF0001028',
    dateTime: '16 May 2024, 04:10 PM',
    customer: 'Walk-in Customer',
    items: 4,
    billAmount: 1150.0,
    discount: 50.0,
    tax: 103.5,
    netAmount: 1203.5,
    paymentMethod: 'UPI',
    cashier: 'Suresh Yadav',
  },
  {
    billNo: 'OFF0001027',
    dateTime: '16 May 2024, 03:25 PM',
    customer: 'Walk-in Customer',
    items: 6,
    billAmount: 1950.0,
    discount: 80.0,
    tax: 175.5,
    netAmount: 2045.5,
    paymentMethod: 'Cash',
    cashier: 'Pooja Sharma',
  },
  {
    billNo: 'OFF0001026',
    dateTime: '16 May 2024, 02:45 PM',
    customer: 'Walk-in Customer',
    items: 3,
    billAmount: 750.0,
    discount: 20.0,
    tax: 67.5,
    netAmount: 797.5,
    paymentMethod: 'UPI',
    cashier: 'Vikram Joshi',
  },
  {
    billNo: 'OFF0001025',
    dateTime: '16 May 2024, 01:30 PM',
    customer: 'Walk-in Customer',
    items: 2,
    billAmount: 350.0,
    discount: 0.0,
    tax: 31.5,
    netAmount: 381.5,
    paymentMethod: 'Cash',
    cashier: 'Kavita Mehta',
  },
];

const mockGSTRatesSummary: GSTRateRow[] = [
  { rate: '0%', taxableSales: 125300.0, cgst: 0.0, sgst: 0.0, igst: 0.0, totalTax: 0.0 },
  { rate: '5%', taxableSales: 245600.0, cgst: 6140.0, sgst: 6140.0, igst: 0.0, totalTax: 12280.0 },
  { rate: '12%', taxableSales: 315250.0, cgst: 18915.0, sgst: 18915.0, igst: 0.0, totalTax: 37830.0 },
  { rate: '18%', taxableSales: 485600.0, cgst: 43704.0, sgst: 43704.0, igst: 0.0, totalTax: 87408.0 },
  { rate: '28%', taxableSales: 60320.0, cgst: 8444.0, sgst: 8444.0, igst: 0.0, totalTax: 16888.0 },
  { rate: 'IGST', taxableSales: 113250.0, cgst: 0.0, sgst: 0.0, igst: 224900.0, totalTax: 224900.0 },
];

const mockGSTInvoicesSummary: GSTInvoiceRow[] = [
  { invoiceType: 'B2B Invoices', totalInvoices: 245, taxableSales: 845320.0, cgst: 84532.0, sgst: 84532.0, igst: 202876.0, totalTax: 371940.0 },
  { invoiceType: 'B2C (Large) Invoices', totalInvoices: 68, taxableSales: 215600.0, cgst: 21560.0, sgst: 21560.0, igst: 0.0, totalTax: 43120.0 },
  { invoiceType: 'B2C (Small) Invoices', totalInvoices: 312, taxableSales: 125300.0, cgst: 6265.0, sgst: 6265.0, igst: 0.0, totalTax: 12530.0 },
  { invoiceType: 'Credit Notes', totalInvoices: 12, taxableSales: -40900.0, cgst: -4090.0, sgst: -4090.0, igst: 0.0, totalTax: -8180.0 },
  { invoiceType: 'Debit Notes', totalInvoices: 5, taxableSales: -0.0, cgst: -0.0, sgst: -0.0, igst: 0.0, totalTax: -0.0 },
];

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  activeTab: 'overview',
  dateRange: '10 May 2024 - 16 May 2024',
  compareRange: '03 May 2024 - 09 May 2024',
  categoryFilter: 'All Categories',
  brandFilter: 'All Brands',

  productsPerformance: initialProductPerformance,
  offlineBills: mockOfflineBills,
  gstRatesSummary: mockGSTRatesSummary,
  gstInvoicesSummary: mockGSTInvoicesSummary,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setDateRange: (range) => set({ dateRange: range }),
  setCompareRange: (range) => set({ compareRange: range }),
  setCategoryFilter: (cat) => set({ categoryFilter: cat }),
  setBrandFilter: (brand) => set({ brandFilter: brand }),
}));

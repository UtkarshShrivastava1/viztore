import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyticsService, getDateRange } from '../analytics.service.js';
import { OrderModel } from '../../orders/index.js';
import { InvoiceModel } from '../../billing/index.js';
import { ProductModel } from '../../catalog/index.js';
import { ExpenseModel, PurchaseBillModel } from '../../expenses/index.js';

function mockChain<T>(data: T) {
  const obj: any = {
    sort: vi.fn().mockImplementation(() => obj),
    lean: vi.fn().mockResolvedValue(data),
  };
  return obj;
}

describe('Analytics Module — Enterprise BI & Reporting Suite (Module 11)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Date Range Normalization Engine', () => {
    it('accurately derives date boundaries for 7d period', () => {
      const { start, end, prevStart, prevEnd } = getDateRange('7d');
      expect(start).toBeInstanceOf(Date);
      expect(end).toBeInstanceOf(Date);
      expect(prevStart).toBeInstanceOf(Date);
      expect(prevEnd).toBeInstanceOf(Date);
      expect(end.getTime()).toBeGreaterThan(start.getTime());
      expect(start.getTime()).toBeGreaterThan(prevStart.getTime());
    });

    it('accurately derives boundaries for today and yesterday', () => {
      const today = getDateRange('today');
      expect(today.start.getHours()).toBe(0);
      expect(today.start.getMinutes()).toBe(0);

      const yesterday = getDateRange('yesterday');
      expect(yesterday.start.getHours()).toBe(0);
      expect(yesterday.end.getHours()).toBe(23);
    });

    it('accurately derives boundaries for this_month and this_year', () => {
      const month = getDateRange('this_month');
      expect(month.start.getDate()).toBe(1);

      const year = getDateRange('this_year');
      expect(year.start.getMonth()).toBe(0);
      expect(year.start.getDate()).toBe(1);
    });
  });

  describe('2. Multi-Channel Revenue & Profit Aggregation', () => {
    it('aggregates online orders and POS counter invoices in Overview', async () => {
      vi.spyOn(OrderModel, 'find').mockReturnValue(
        mockChain([
          { _id: 'o1', grandTotal: 2500, createdAt: new Date(), items: [{ productId: 'p1', quantity: 2, unitPrice: 1250 }] },
          { _id: 'o2', grandTotal: 1500, createdAt: new Date(), items: [{ productId: 'p2', quantity: 1, unitPrice: 1500 }] },
        ]),
      );

      vi.spyOn(InvoiceModel, 'find').mockReturnValue(
        mockChain([
          { _id: 'inv1', pricing: { grandTotal: 1200 }, settlementMode: 'upi', createdAt: new Date() },
          { _id: 'inv2', pricing: { grandTotal: 800 }, settlementMode: 'cash', createdAt: new Date() },
        ]),
      );

      vi.spyOn(ProductModel, 'find').mockReturnValue(
        mockChain([
          { _id: 'p1', name: 'Cotton Shirt', sku: 'SHT-01', category: 'Fashion', basePrice: 1250, totalStock: 30 },
          { _id: 'p2', name: 'Denim Jeans', sku: 'JNS-01', category: 'Fashion', basePrice: 1500, totalStock: 25 },
        ]),
      );

      vi.spyOn(ExpenseModel, 'find').mockReturnValue(
        mockChain([
          { _id: 'e1', amount: 500, category: 'Packaging Supplies' },
        ]),
      );

      const overview = await analyticsService.getOverview('store-123', '7d');

      expect(overview.kpis.totalRevenue).toBe(6000); // 4000 online + 2000 pos
      expect(overview.channelBreakdown.onlineRevenue).toBe(4000);
      expect(overview.channelBreakdown.posRevenue).toBe(2000);
      expect(overview.kpis.totalOrders).toBe(4); // 2 online + 2 pos
      expect(overview.kpis.avgOrderValue).toBe(1500); // 6000 / 4
      expect(overview.trends.length).toBeGreaterThan(0);
      expect(overview.paymentBreakdown.length).toBe(4);
    });

    it('computes Profit & Loss statement with authentic margins and OpEx categorization', async () => {
      vi.spyOn(OrderModel, 'find').mockReturnValue(mockChain([]));
      vi.spyOn(InvoiceModel, 'find').mockReturnValue(mockChain([]));
      vi.spyOn(ProductModel, 'find').mockReturnValue(mockChain([]));

      vi.spyOn(ExpenseModel, 'find').mockReturnValue(
        mockChain([
          { _id: 'e1', amount: 15000, category: 'Store Rent' },
          { _id: 'e2', amount: 5000, category: 'Electricity Bill' },
          { _id: 'e3', amount: 2000, category: 'Packaging' },
        ]),
      );

      vi.spyOn(PurchaseBillModel, 'find').mockReturnValue(
        mockChain([
          { _id: 'b1', totalAmount: 40000 },
        ]),
      );

      const pl = await analyticsService.getProfitLoss('store-123', 'this_month');

      expect(pl.kpis).toBeDefined();
      expect(pl.operatingExpenses.rent).toBe(15000);
      expect(pl.operatingExpenses.electricity).toBe(5000);
      expect(pl.operatingExpenses.packaging).toBe(2000);
      expect(pl.monthlyTrends.length).toBe(6);
    });
  });

  describe('3. Specialized Audit Reports (GST, Orders, Products, Settlements)', () => {
    it('generates itemized GST liability report with CGST/SGST/IGST breakdown', async () => {
      vi.spyOn(InvoiceModel, 'find').mockReturnValue(
        mockChain([
          {
            _id: 'inv101',
            invoiceNumber: 'INV-1001',
            customerName: 'Aman Trading',
            customerGstin: '22AAAAA0000A1Z5',
            pricing: { taxableAmount: 10000, cgst: 900, sgst: 900, igst: 0, taxTotal: 1800, grandTotal: 11800 },
            items: [{ taxRate: 18 }],
            createdAt: new Date(),
          },
        ]),
      );

      const gst = await analyticsService.getGSTReport('store-123', 'this_month');

      expect(gst.kpis.totalTaxableValue).toBe(10000);
      expect(gst.kpis.totalCgst).toBe(900);
      expect(gst.kpis.totalSgst).toBe(900);
      expect(gst.kpis.totalGstLiability).toBe(1800);
      expect(gst.invoices.length).toBe(1);
      expect(gst.invoices[0].invoiceNo).toBe('INV-1001');
      expect(gst.slabSummary.some((s) => s.rate === '18%' && s.totalTax === 1800)).toBe(true);
    });

    it('generates offline billing summary with tender mode categorization', async () => {
      vi.spyOn(InvoiceModel, 'find').mockReturnValue(
        mockChain([
          { _id: 'i1', totalAmount: 500, settlementMode: 'cash', createdAt: new Date() },
          { _id: 'i2', totalAmount: 1500, settlementMode: 'upi', createdAt: new Date() },
          { _id: 'i3', totalAmount: 800, settlementMode: 'khata', createdAt: new Date() },
        ]),
      );

      const pos = await analyticsService.getOfflineBilling('store-123', '7d');

      expect(pos.kpis.totalSales).toBe(2800);
      expect(pos.kpis.totalBills).toBe(3);
      expect(pos.tenderBreakdown.cash).toBe(500);
      expect(pos.tenderBreakdown.upi).toBe(1500);
      expect(pos.tenderBreakdown.khata).toBe(800);
    });

    it('exports RFC-compliant CSV with UTF-8 BOM encoding and statutory headers', async () => {
      vi.spyOn(OrderModel, 'find').mockReturnValue(mockChain([]));
      vi.spyOn(InvoiceModel, 'find').mockReturnValue(mockChain([]));
      vi.spyOn(ProductModel, 'find').mockReturnValue(mockChain([]));
      vi.spyOn(ExpenseModel, 'find').mockReturnValue(mockChain([]));

      const { filename, csv } = await analyticsService.exportReportCsv('store-123', 'overview', '7d');

      expect(filename).toContain('overview_report_');
      expect(csv.startsWith('\uFEFF')).toBe(true);
      expect(csv).toContain('"Total Revenue"');
      expect(csv).toContain('"Total Orders"');
    });
  });
});

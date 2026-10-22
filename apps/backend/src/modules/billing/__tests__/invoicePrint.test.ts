import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import {
  amountInWords,
  escapeHtml,
  formatCurrency,
  renderThermalReceiptHtml,
  renderA4InvoiceHtml,
  renderPrintableInvoiceHtml,
  normalizeOrderInvoiceToPrintable,
  PrintableInvoiceData,
} from '../invoicePrint.template.js';
import { BillingService } from '../billing.service.js';
import { InvoiceModel, BillingSettingsModel } from '../billing.model.js';
import { storeModule } from '../../stores/index.js';
import { branding } from '@repo/shared-types';

describe('Invoice & Receipt Print Engine — Unit Tests (Task B-06)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPrintableData: PrintableInvoiceData = {
    invoiceNumber: 'INV-2026-1001',
    referenceNumber: 'ORD-2026-9999',
    date: '2026-10-21T10:00:00.000Z',
    status: 'PAID',
    type: 'TAX INVOICE',
    seller: {
      name: 'Radhe Krishna Supermarket',
      address: 'Shop 12, Malviya Nagar, Durg, CG - 491001',
      phone: '+91 98271 23456',
      gstin: '22AAAAA0000A1Z5',
      state: 'Chhattisgarh',
    },
    customer: {
      name: 'Rohan Sharma',
      phone: '+91 98765 43210',
      address: 'Sector 5, Bhilai, CG - 490006',
      state: 'Chhattisgarh',
      gstin: '22BBBBB1111B1Z2',
    },
    items: [
      {
        name: 'Basmati Rice 5kg',
        sku: 'RICE-5KG',
        hsnCode: '1006',
        quantity: 2,
        unit: 'Bag',
        unitPrice: 450,
        discountAmount: 0,
        taxableAmount: 857.14,
        taxRate: 5,
        cgst: 21.43,
        sgst: 21.43,
        lineTotal: 900,
      },
      {
        name: 'Cold Pressed Mustard Oil 1L',
        sku: 'OIL-1L',
        hsnCode: '1514',
        quantity: 1,
        unit: 'Bottle',
        unitPrice: 180,
        discountAmount: 10,
        taxableAmount: 161.9,
        taxRate: 5,
        cgst: 4.05,
        sgst: 4.05,
        lineTotal: 170,
      },
    ],
    pricing: {
      subtotal: 1070,
      discount: 10,
      taxableAmount: 1019.04,
      tax: 50.96,
      cgst: 25.48,
      sgst: 25.48,
      shippingFee: 40,
      grandTotal: 1110,
    },
    payment: {
      settlementMode: 'CASH',
      status: 'PAID',
      paidAmount: 1110,
      dueAmount: 0,
      tenderedCashAmount: 1200,
      changeReturnAmount: 90,
    },
    deliveryOtp: '7482',
    notes: 'Please ring the bell twice.',
  };

  describe('1. Amount in Words Conversion (Indian Currency System)', () => {
    it('converts single digits and zero properly', () => {
      expect(amountInWords(0)).toBe('Rupees Zero Only');
      expect(amountInWords(5)).toBe('Rupees Five Only');
      expect(amountInWords(15)).toBe('Rupees Fifteen Only');
    });

    it('converts hundreds and thousands', () => {
      expect(amountInWords(100)).toBe('Rupees One Hundred Only');
      expect(amountInWords(1250)).toBe('Rupees One Thousand Two Hundred Fifty Only');
      expect(amountInWords(10500)).toBe('Rupees Ten Thousand Five Hundred Only');
    });

    it('converts lakhs and crores in Indian numbering format', () => {
      expect(amountInWords(100000)).toBe('Rupees One Lakh Only');
      expect(amountInWords(2500000)).toBe('Rupees Twenty Five Lakh Only');
      expect(amountInWords(10000000)).toBe('Rupees One Crore Only');
    });

    it('handles paise fractions accurately', () => {
      expect(amountInWords(1110.5)).toBe('Rupees One Thousand One Hundred Ten and Fifty Paise Only');
      expect(amountInWords(45.25)).toBe('Rupees Forty Five and Twenty Five Paise Only');
    });
  });

  describe('2. Thermal 80mm ESC/POS Markup Rendering', () => {
    it('renders valid 80mm monospace receipt with store header and items', () => {
      const html = renderThermalReceiptHtml(mockPrintableData);

      expect(html).toContain('size: 80mm auto');
      expect(html).toContain('Radhe Krishna Supermarket');
      expect(html).toContain('22AAAAA0000A1Z5');
      expect(html).toContain('INV-2026-1001');
      expect(html).toContain('ORD-2026-9999');
      expect(html).toContain('Basmati Rice 5kg');
      expect(html).toContain('Cold Pressed Mustard Oil 1L');
      expect(html).toContain('GRAND TOTAL:');
      expect(html).toContain('₹1,110.00');
      expect(html).toContain('DELIVERY OTP:');
      expect(html).toContain('7482');
      expect(html).toContain('Cash Tendered:');
      expect(html).toContain('₹1,200.00');
      expect(html).toContain('Change Returned:');
      expect(html).toContain('₹90.00');
      expect(html).toContain('- - - - - - [ TEAR HERE ] - - - - - -');
      expect(html).toContain(`Powered by ${escapeHtml(branding.appName)}`);
    });

    it('injects window.print script only when autoPrint is enabled', () => {
      const withPrint = renderThermalReceiptHtml(mockPrintableData, { autoPrint: true });
      expect(withPrint).toContain("<script>window.addEventListener('load'");

      const withoutPrint = renderThermalReceiptHtml(mockPrintableData, { autoPrint: false });
      expect(withoutPrint).not.toContain("<script>window.addEventListener('load'");
    });

    it('escapes potential XSS inputs in customer and store metadata', () => {
      const maliciousData: PrintableInvoiceData = {
        ...mockPrintableData,
        customer: {
          name: '<script>alert("hack")</script>',
          phone: '9999999999',
        },
      };

      const html = renderThermalReceiptHtml(maliciousData);
      expect(html).not.toContain('<script>alert("hack")</script>');
      expect(html).toContain('&lt;script&gt;alert(&quot;hack&quot;)&lt;/script&gt;');
    });
  });

  describe('3. Standard A4 GST Tax Invoice Rendering', () => {
    it('renders professional A4 portrait layout with HSN, Tax tables, and Signatory', () => {
      const html = renderA4InvoiceHtml(mockPrintableData);

      expect(html).toContain('size: A4 portrait');
      expect(html).toContain('Radhe Krishna Supermarket');
      expect(html).toContain('TAX INVOICE');
      expect(html).toContain('INV-2026-1001');
      expect(html).toContain('ORD-2026-9999');
      expect(html).toContain('Billed To (Customer Details)');
      expect(html).toContain('Rohan Sharma');
      expect(html).toContain('22BBBBB1111B1Z2');
      expect(html).toContain('1006'); // HSN Code
      expect(html).toContain('1514'); // HSN Code
      expect(html).toContain('Tax Summary');
      expect(html).toContain('Total Amount (in words)');
      expect(html).toContain('Rupees One Thousand One Hundred Ten Only');
      expect(html).toContain('Grand Total:');
      expect(html).toContain('₹1,110.00');
      expect(html).toContain('Authorized Signatory');
      expect(html).toContain('Switch to 80mm Thermal');
      expect(html).toContain(branding.appName);
    });

    it('injects auto-print script when autoPrint: true', () => {
      const html = renderA4InvoiceHtml(mockPrintableData, { autoPrint: true });
      expect(html).toContain("<script>window.addEventListener('load'");

      const withoutPrint = renderA4InvoiceHtml(mockPrintableData, { autoPrint: false });
      expect(withoutPrint).not.toContain("<script>window.addEventListener('load'");
    });

  });

  describe('4. Universal Print Dispatcher & Order Normalizer', () => {
    it('dispatches to thermal receipt when format is thermal or 80mm', () => {
      const thermalHtml = renderPrintableInvoiceHtml(mockPrintableData, { format: 'thermal' });
      expect(thermalHtml).toContain('size: 80mm auto');

      const mm80Html = renderPrintableInvoiceHtml(mockPrintableData, { format: '80mm' });
      expect(mm80Html).toContain('size: 80mm auto');
    });

    it('dispatches to A4 invoice by default or when format is a4', () => {
      const defaultHtml = renderPrintableInvoiceHtml(mockPrintableData);
      expect(defaultHtml).toContain('size: A4 portrait');

      const a4Html = renderPrintableInvoiceHtml(mockPrintableData, { format: 'a4' });
      expect(a4Html).toContain('size: A4 portrait');
    });

    it('normalizes OrderInvoiceData into PrintableInvoiceData seamlessly', () => {
      const orderInvoice = {
        invoiceNumber: 'INV-ORD-5544',
        orderNumber: 'ORD-5544',
        orderId: 'order-123',
        date: '2026-10-21T11:00:00.000Z',
        status: 'delivered',
        seller: {
          name: 'City Fresh Mart',
          address: 'Station Road, Durg',
          phone: '+91 91111 22222',
          gstin: '22CCCCC3333C1Z8',
        },
        customer: {
          name: 'Priya Verma',
          phone: '+91 98888 77777',
          address: 'Nehru Nagar, Bhilai',
        },
        items: [
          {
            name: 'Organic Wheat Flour 10kg',
            sku: 'FLOUR-10KG',
            quantity: 1,
            unitPrice: 420,
            taxableAmount: 400,
            lineTotal: 420,
          },
        ],
        pricing: {
          subtotal: 420,
          tax: 20,
          cgst: 10,
          sgst: 10,
          shippingFee: 30,
          grandTotal: 450,
        },
        deliveryOtp: '9182',
      };

      const normalized = normalizeOrderInvoiceToPrintable(orderInvoice);
      expect(normalized.invoiceNumber).toBe('INV-ORD-5544');
      expect(normalized.referenceNumber).toBe('ORD-5544');
      expect(normalized.seller.name).toBe('City Fresh Mart');
      expect(normalized.customer.name).toBe('Priya Verma');
      expect(normalized.pricing.grandTotal).toBe(450);
      expect(normalized.items[0].name).toBe('Organic Wheat Flour 10kg');
      expect(normalized.deliveryOtp).toBe('9182');
    });
  });

  describe('5. BillingService.getPrintableInvoice Data Fetching & Normalization', () => {
    it('retrieves invoice document, store profile, and settings to build printable invoice', async () => {
      const storeId = new mongoose.Types.ObjectId().toString();
      const invoiceId = new mongoose.Types.ObjectId().toString();

      const mockInvoiceDoc = {
        _id: invoiceId,
        storeId: new mongoose.Types.ObjectId(storeId),
        invoiceNumber: 'INV-2026-0088',
        type: 'tax_invoice',
        dates: {
          invoiceDate: new Date('2026-10-21T09:00:00.000Z'),
        },
        customer: {
          name: 'Ankit Tiwari',
          phone: '9826012345',
          email: 'ankit@example.com',
          billingAddress: 'Civic Center, Bhilai',
          state: 'Chhattisgarh',
          gstin: '22DDDDD4444D1Z9',
        },
        items: [
          {
            title: 'Wireless Keyboard',
            variantId: 'KB-WL-01',
            hsnCode: '8471',
            quantity: 1,
            unit: 'Pcs',
            unitPrice: 1200,
            discountAmount: 100,
            taxableAmount: 932.2,
            taxRate: 18,
            cgst: 83.9,
            sgst: 83.9,
            igst: 0,
            totalAmount: 1100,
          },
        ],
        pricing: {
          subTotal: 1200,
          totalDiscount: 100,
          taxableAmount: 932.2,
          cgstTotal: 83.9,
          sgstTotal: 83.9,
          igstTotal: 0,
          roundOff: 0,
          grandTotal: 1100,
        },

        payment: {
          status: 'paid',
          settlementMode: 'UPI',
          paidAmount: 1100,
          dueAmount: 0,
        },
        notes: 'Counter POS sale',
      };

      vi.spyOn(InvoiceModel, 'findOne').mockResolvedValue(mockInvoiceDoc as any);
      vi.spyOn(BillingSettingsModel, 'findOne').mockResolvedValue({
        storeId: new mongoose.Types.ObjectId(storeId),
        gstin: '22AAAAA0000A1Z5',
        state: 'Chhattisgarh',
        termsAndConditions: ['Thank you for your business!'],
        version: 1,
      } as any);

      vi.spyOn(storeModule, 'getStoreProfile').mockResolvedValue({
        id: storeId,
        name: 'Apex Electronics',
        phone: '+91 771 4001234',
        address: 'G.E. Road, Raipur, CG',
        gstin: '22AAAAA0000A1Z5',
      } as any);

      const service = new BillingService();
      const printable = await service.getPrintableInvoice(storeId, invoiceId);

      expect(printable.invoiceNumber).toBe('INV-2026-0088');
      expect(printable.seller.name).toBe('Apex Electronics');
      expect(printable.customer.name).toBe('Ankit Tiwari');
      expect(printable.items[0].name).toBe('Wireless Keyboard');
      expect(printable.pricing.grandTotal).toBe(1100);
      expect(printable.payment?.settlementMode).toBe('UPI');
    });

    it('throws 404 AppError when invoice document does not exist', async () => {
      const storeId = new mongoose.Types.ObjectId().toString();
      vi.spyOn(InvoiceModel, 'findOne').mockResolvedValue(null);

      const service = new BillingService();
      await expect(service.getPrintableInvoice(storeId, 'non-existent-id')).rejects.toThrow(
        'Invoice not found',
      );
    });
  });
});

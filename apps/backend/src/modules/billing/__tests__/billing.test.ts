import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import {
  computeItemTaxesAndPricing,
  BillingService,
} from '../billing.service.js';
import {
  InvoiceStatus,
  InvoiceType,
  SettlementMode,
  QuoteStatus,
  TaxCalculationType,
  POSPrintPaperSize,
  generateEscposReceiptBuffer,
} from '@repo/shared-types';
import {
  InvoiceModel,
  QuoteModel,
  BillingSettingsModel,
} from '../billing.model.js';
import { catalogModule } from '../../catalog/index.js';
import { storeModule } from '../../stores/index.js';
import * as transactionModule from '../../../shared/database/transaction.js';
import * as outboxModule from '../../../shared/database/outbox.service.js';
import * as cacheModule from '../../../shared/redis/cache.js';
import { eventBus } from '../../../shared/events/eventBus.js';

describe('Billing Module — Unit Tests (Enterprise In-House Billing & OCC Engine)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Indian GST Computation Engine (Intra vs Inter-State & Inclusive)', () => {
    it('computes 50/50 CGST and SGST for Intra-State supply (Delhi to Delhi)', () => {
      const items = [
        {
          productId: 'prod-1',
          title: 'Cotton Shirt',
          quantity: 2,
          unitPrice: 500, // Gross 1000
          discountAmount: 0,
          taxRate: 18,
        },
      ];

      const { computedItems, pricing } = computeItemTaxesAndPricing(
        items,
        'Delhi',
        'Delhi',
        TaxCalculationType.EXCLUSIVE,
      );

      expect(computedItems[0].taxableAmount).toBe(1000);
      expect(computedItems[0].cgst).toBe(90); // 9%
      expect(computedItems[0].sgst).toBe(90); // 9%
      expect(computedItems[0].igst).toBe(0);
      expect(computedItems[0].totalAmount).toBe(1180);

      expect(pricing.subTotal).toBe(1000);
      expect(pricing.cgstTotal).toBe(90);
      expect(pricing.sgstTotal).toBe(90);
      expect(pricing.igstTotal).toBe(0);
      expect(pricing.grandTotal).toBe(1180);
    });

    it('computes full IGST for Inter-State supply (Delhi to Maharashtra)', () => {
      const items = [
        {
          productId: 'prod-2',
          title: 'Leather Wallet',
          quantity: 1,
          unitPrice: 1000,
          discountAmount: 100, // Net 900
          taxRate: 18,
        },
      ];

      const { computedItems, pricing } = computeItemTaxesAndPricing(
        items,
        'Delhi',
        'Maharashtra',
        TaxCalculationType.EXCLUSIVE,
      );

      expect(computedItems[0].taxableAmount).toBe(900);
      expect(computedItems[0].cgst).toBe(0);
      expect(computedItems[0].sgst).toBe(0);
      expect(computedItems[0].igst).toBe(162); // 18% on 900
      expect(computedItems[0].totalAmount).toBe(1062);

      expect(pricing.totalDiscount).toBe(100);
      expect(pricing.igstTotal).toBe(162);
      expect(pricing.grandTotal).toBe(1062);
    });

    it('accurately backs out taxable base when taxCalculationType is INCLUSIVE', () => {
      const items = [
        {
          productId: 'prod-3',
          title: 'Packaged Food',
          quantity: 1,
          unitPrice: 1180, // Inclusive of 18% GST -> Base should be 1000
          taxRate: 18,
        },
      ];

      const { computedItems, pricing } = computeItemTaxesAndPricing(
        items,
        'Delhi',
        'Delhi',
        TaxCalculationType.INCLUSIVE,
      );

      expect(computedItems[0].taxableAmount).toBe(1000);
      expect(computedItems[0].cgst).toBe(90);
      expect(computedItems[0].sgst).toBe(90);
      expect(computedItems[0].totalAmount).toBe(1180);
      expect(pricing.grandTotal).toBe(1180);
    });
  });

  describe('2. In-House Billing Service Lifecycle & Real-Time Inventory Sync', () => {
    const fakeStoreId = new mongoose.Types.ObjectId().toString();

    it('creates an issued invoice, deducts catalog stock atomically, writes outbox, and invalidates cache', async () => {
      const service = new BillingService();

      // Mock dependencies
      vi.spyOn(service, 'getOrCreateSettings').mockResolvedValue({
        state: 'Delhi',
        invoicePrefix: 'INV-',
        nextInvoiceNumber: 1001,
        taxCalculationType: TaxCalculationType.EXCLUSIVE,
      } as any);

      vi.spyOn(transactionModule, 'withTransaction').mockImplementation(async (work) => {
        return work({} as any);
      });

      const deductStockSpy = vi.spyOn(catalogModule, 'deductStock').mockResolvedValue(undefined);
      const appendOutboxSpy = vi.spyOn(outboxModule, 'appendOutboxEvent').mockResolvedValue(undefined);
      const invalidateCacheSpy = vi.spyOn(cacheModule, 'invalidateCache').mockResolvedValue(undefined);
      const eventBusEmitSpy = vi.spyOn(eventBus, 'emit').mockReturnValue(true);

      const fakeInvoiceDoc = {
        id: 'inv-123',
        _id: new mongoose.Types.ObjectId(),
        invoiceNumber: 'INV-1001',
        payment: { status: InvoiceStatus.PAID },
        pricing: { grandTotal: 1180 },
        isInventoryDeducted: true,
        version: 1,
      };

      vi.spyOn(InvoiceModel, 'create').mockResolvedValue([fakeInvoiceDoc] as any);
      vi.spyOn(BillingSettingsModel, 'findOneAndUpdate').mockResolvedValue({
        invoicePrefix: 'INV-',
        nextInvoiceNumber: 1001,
      } as any);

      const result = await service.createInvoice(fakeStoreId, {
        type: InvoiceType.TAX_INVOICE,
        customer: { name: 'Arun Kumar', phone: '9876543210', state: 'Delhi' },
        items: [
          {
            productId: 'prod-sku-1',
            variantId: 'SKU-RED',
            title: 'Formal Shirt',
            quantity: 3,
            unitPrice: 500,
            taxRate: 18,
          },
        ],
        payment: {
          status: InvoiceStatus.PAID,
          settlementMode: SettlementMode.UPI,
        },
      });

      // Assertions
      expect(result.invoiceNumber).toBe('INV-1001');
      expect(deductStockSpy).toHaveBeenCalledTimes(1);
      expect(deductStockSpy).toHaveBeenCalledWith(
        [{ productId: 'prod-sku-1', sku: 'SKU-RED', quantity: 3 }],
        expect.anything(),
      );
      expect(appendOutboxSpy).toHaveBeenCalledTimes(1);
      expect(invalidateCacheSpy).toHaveBeenCalledWith(`catalog:store:${fakeStoreId}*`);
      expect(eventBusEmitSpy).toHaveBeenCalled();
    });

    it('cancels an invoice, restores catalog stock, and increments OCC version', async () => {
      const service = new BillingService();

      vi.spyOn(transactionModule, 'withTransaction').mockImplementation(async (work) => {
        return work({} as any);
      });

      const restoreStockSpy = vi.spyOn(catalogModule, 'restoreStock').mockResolvedValue(undefined);
      const appendOutboxSpy = vi.spyOn(outboxModule, 'appendOutboxEvent').mockResolvedValue(undefined);
      const invalidateCacheSpy = vi.spyOn(cacheModule, 'invalidateCache').mockResolvedValue(undefined);

      const existingInvoice = {
        _id: 'inv-123',
        storeId: new mongoose.Types.ObjectId(fakeStoreId),
        invoiceNumber: 'INV-1001',
        payment: { status: InvoiceStatus.PAID },
        items: [{ productId: 'prod-sku-1', variantId: 'SKU-RED', quantity: 3 }],
        isInventoryDeducted: true,
        version: 1,
      };

      vi.spyOn(InvoiceModel, 'findOne').mockResolvedValue(existingInvoice as any);
      vi.spyOn(InvoiceModel, 'findOneAndUpdate').mockResolvedValue({
        ...existingInvoice,
        payment: { status: InvoiceStatus.CANCELLED },
        isInventoryDeducted: false,
        version: 2, // Incremented
      } as any);

      const result = await service.cancelInvoice(fakeStoreId, 'inv-123', 1);

      expect(restoreStockSpy).toHaveBeenCalledWith(
        [{ productId: 'prod-sku-1', sku: 'SKU-RED', quantity: 3 }],
        expect.anything(),
      );
      expect(result.payment.status).toBe(InvoiceStatus.CANCELLED);
      expect(result.version).toBe(2);
      expect(appendOutboxSpy).toHaveBeenCalledTimes(1);
      expect(invalidateCacheSpy).toHaveBeenCalledWith(`catalog:store:${fakeStoreId}*`);
    });

    it('enforces OCC conflict detection on recordPayment when expectedVersion mismatches', async () => {
      const service = new BillingService();

      const existingInvoice = {
        _id: 'inv-123',
        storeId: new mongoose.Types.ObjectId(fakeStoreId),
        payment: { status: InvoiceStatus.ISSUED, paidAmount: 0 },
        pricing: { grandTotal: 1000 },
        version: 2, // Current version is 2
      };

      vi.spyOn(InvoiceModel, 'findOne').mockResolvedValue(existingInvoice as any);
      // Simulate another concurrent write beat this request -> findOneAndUpdate returns null
      vi.spyOn(InvoiceModel, 'findOneAndUpdate').mockResolvedValue(null);

      await expect(
        service.recordPayment(fakeStoreId, 'inv-123', {
          amount: 500,
          mode: SettlementMode.CASH,
        }, 1), // passing stale version 1
      ).rejects.toThrowError(/modified concurrently/i);
    });

    it('converts a quote into an active invoice with atomic stock deduction (1-click conversion)', async () => {
      const service = new BillingService();

      const fakeQuote = {
        _id: 'quote-456',
        quoteNumber: 'Q-1001',
        customer: { name: 'Pooja Verma', phone: '9876543210', state: 'Delhi' },
        status: QuoteStatus.DRAFT,
        items: [
          {
            productId: 'prod-9',
            variantId: 'SKU-XL',
            title: 'Silk Scarf',
            quantity: 2,
            unit: 'Pcs',
            unitPrice: 600,
            discountAmount: 0,
            taxRate: 18,
          },
        ],
      };

      vi.spyOn(QuoteModel, 'findOne').mockResolvedValue(fakeQuote as any);
      vi.spyOn(QuoteModel, 'updateOne').mockResolvedValue({ modifiedCount: 1 } as any);

      const fakeInvoice = {
        id: 'inv-999',
        _id: new mongoose.Types.ObjectId(),
        invoiceNumber: 'INV-1005',
        payment: { status: InvoiceStatus.ISSUED },
      };

      const createInvoiceSpy = vi
        .spyOn(service, 'createInvoice')
        .mockResolvedValue(fakeInvoice as any);

      const converted = await service.convertQuoteToInvoice(fakeStoreId, 'quote-456');

      expect(converted.invoiceNumber).toBe('INV-1005');
      expect(createInvoiceSpy).toHaveBeenCalledTimes(1);
      expect(QuoteModel.updateOne).toHaveBeenCalledWith(
        { _id: 'quote-456' },
        expect.objectContaining({
          $set: { status: QuoteStatus.CONVERTED, convertedInvoiceId: fakeInvoice._id },
        }),
      );
    });
  });

  describe('3. Fast Counter POS Sale & Thermal Printing Engine', () => {
    const fakeStoreId = new mongoose.Types.ObjectId().toString();

    it('creates a rapid POS sale with cash settlement, change return, and immediate ESC/POS receipt', async () => {
      const service = new BillingService();

      vi.spyOn(service, 'getOrCreateSettings').mockResolvedValue({
        state: 'Delhi',
        invoicePrefix: 'POS-',
        nextInvoiceNumber: 2001,
        taxCalculationType: TaxCalculationType.EXCLUSIVE,
        gstin: '07AAAAA0000A1Z5',
      } as any);

      vi.spyOn(storeModule, 'getStoreProfile').mockResolvedValue({
        id: fakeStoreId,
        name: 'Metro Daily Mart',
        phone: '9876543210',
        address: 'Connaught Place, New Delhi',
        gstin: '07AAAAA0000A1Z5',
      } as any);

      vi.spyOn(transactionModule, 'withTransaction').mockImplementation(async (work) => {
        return work({} as any);
      });

      const deductStockSpy = vi.spyOn(catalogModule, 'deductStock').mockResolvedValue(undefined);
      vi.spyOn(outboxModule, 'appendOutboxEvent').mockResolvedValue(undefined);
      vi.spyOn(cacheModule, 'invalidateCache').mockResolvedValue(undefined);
      const eventBusEmitSpy = vi.spyOn(eventBus, 'emit').mockReturnValue(true);

      const fakePosInvoiceDoc = {
        id: 'pos-inv-101',
        _id: new mongoose.Types.ObjectId(),
        storeId: new mongoose.Types.ObjectId(fakeStoreId),
        invoiceNumber: 'POS-2001',
        dates: { invoiceDate: new Date() },
        customer: { name: 'Walk-in Customer', phone: '9999999999' },
        items: [
          {
            productId: 'prod-biscuits',
            title: 'Digestive Biscuits 200g',
            quantity: 2,
            unit: 'Pcs',
            unitPrice: 50,
            discountAmount: 0,
            taxRate: 18,
            taxableAmount: 100,
            cgst: 9,
            sgst: 9,
            igst: 0,
            totalAmount: 118,
          },
        ],
        pricing: {
          subTotal: 100,
          totalDiscount: 0,
          taxableAmount: 100,
          cgstTotal: 9,
          sgstTotal: 9,
          igstTotal: 0,
          grandTotal: 118,
        },
        payment: {
          status: InvoiceStatus.PAID,
          settlementMode: SettlementMode.CASH,
          paidAmount: 118,
          dueAmount: 0,
        },
        get: vi.fn().mockReturnValue(new Date()),
        toObject: () => ({
          invoiceNumber: 'POS-2001',
          pricing: { grandTotal: 118 },
        }),
      };

      vi.spyOn(InvoiceModel, 'create').mockResolvedValue([fakePosInvoiceDoc] as any);

      const posResponse = await service.createPOSSale(fakeStoreId, {
        items: [
          {
            productId: 'prod-biscuits',
            title: 'Digestive Biscuits 200g',
            quantity: 2,
            unitPrice: 50,
            taxRate: 18,
          },
        ],
        settlementMode: SettlementMode.CASH,
        tenderedCashAmount: 200,
        paperSize: POSPrintPaperSize.THERMAL_80MM,
        kickCashDrawer: true,
      });

      expect(posResponse.invoiceNumber).toBe('POS-2001');
      expect(posResponse.receiptData.storeName).toBe('Metro Daily Mart');
      expect(posResponse.receiptData.grandTotal).toBe(118);
      expect(posResponse.receiptData.tenderedCashAmount).toBe(200);
      expect(posResponse.receiptData.changeReturnAmount).toBe(82);
      expect(posResponse.escposBufferBase64).toBeDefined();
      expect(typeof posResponse.escposBufferBase64).toBe('string');
      expect(posResponse.escposBufferBase64.length).toBeGreaterThan(10);
      expect(deductStockSpy).toHaveBeenCalledTimes(1);
      expect(eventBusEmitSpy).toHaveBeenCalledWith(
        'invoice.issued',
        expect.objectContaining({
          invoiceNumber: 'POS-2001',
          amount: 118,
        }),
      );
    });

    it('fetches last receipt and formats thermal print binary payload', async () => {
      const service = new BillingService();

      vi.spyOn(service, 'getOrCreateSettings').mockResolvedValue({
        state: 'Delhi',
        invoicePrefix: 'POS-',
      } as any);

      vi.spyOn(storeModule, 'getStoreProfile').mockResolvedValue({
        id: fakeStoreId,
        name: 'Metro Daily Mart',
      } as any);

      const mockQuery = {
        sort: vi.fn().mockResolvedValue({
          id: 'pos-inv-last',
          storeId: new mongoose.Types.ObjectId(fakeStoreId),
          invoiceNumber: 'POS-2000',
          dates: { invoiceDate: new Date() },
          customer: { name: 'Rahul Sharma', phone: '9811112222' },
          items: [
            {
              title: 'Mineral Water 1L',
              quantity: 1,
              unit: 'Bottle',
              unitPrice: 20,
              discountAmount: 0,
              taxableAmount: 20,
              taxRate: 0,
              totalAmount: 20,
            },
          ],
          pricing: {
            subTotal: 20,
            totalDiscount: 0,
            taxableAmount: 20,
            cgstTotal: 0,
            sgstTotal: 0,
            igstTotal: 0,
            grandTotal: 20,
          },
          payment: {
            status: InvoiceStatus.PAID,
            settlementMode: SettlementMode.UPI,
            paidAmount: 20,
            dueAmount: 0,
          },
          get: vi.fn().mockReturnValue(new Date()),
          toObject: () => ({ invoiceNumber: 'POS-2000' }),
        }),
      };

      vi.spyOn(InvoiceModel, 'findOne').mockReturnValue(mockQuery as any);

      const lastReceipt = await service.getLastReceipt(fakeStoreId, POSPrintPaperSize.THERMAL_58MM);

      expect(lastReceipt.invoiceNumber).toBe('POS-2000');
      expect(lastReceipt.paperSize).toBe(POSPrintPaperSize.THERMAL_58MM);
      expect(lastReceipt.receiptData.grandTotal).toBe(20);
      expect(lastReceipt.escposBufferBase64).toBeDefined();
    });

    it('generates raw ESC/POS binary buffers with standard hardware printer control codes', () => {
      const sampleReceiptData = {
        invoiceId: 'inv-test',
        invoiceNumber: 'POS-8888',
        storeName: 'Kirana Express',
        storePhone: '9899001122',
        storeAddress: 'Main Market, Karol Bagh',
        date: '10 Oct 2026',
        time: '02:30 PM',
        customerName: 'Walk-in Customer',
        customerPhone: '9999999999',
        items: [
          {
            title: 'Basmati Rice 5kg',
            quantity: 1,
            unit: 'Bag',
            unitPrice: 450,
            discountAmount: 0,
            taxableAmount: 450,
            taxRate: 0,
            totalAmount: 450,
          },
        ],
        subTotal: 450,
        totalDiscount: 0,
        cgstTotal: 0,
        sgstTotal: 0,
        igstTotal: 0,
        grandTotal: 450,
        settlementMode: SettlementMode.CASH,
        tenderedCashAmount: 500,
        changeReturnAmount: 50,
        upiPayload: 'upi://pay?pa=kirana@upi',
      };

      const buffer80 = Buffer.from(
        generateEscposReceiptBuffer(
          { ...sampleReceiptData, paperSize: POSPrintPaperSize.THERMAL_80MM },
          true,
        ),
      );

      // Validate ESC/POS command sequences
      expect(Buffer.isBuffer(buffer80)).toBe(true);
      expect(buffer80.length).toBeGreaterThan(50);

      // Printer Initialize ESC @ (0x1B, 0x40)
      expect(buffer80[0]).toBe(0x1b);
      expect(buffer80[1]).toBe(0x40);

      // Paper Cut GS V \x00 (0x1D, 0x56, 0x00) should be included near the end
      const bufferStr = buffer80.toString('latin1');
      expect(bufferStr.includes('KIRANA EXPRESS')).toBe(true);
      expect(bufferStr.includes('POS-8888')).toBe(true);
      expect(bufferStr.includes('Basmati Rice 5kg')).toBe(true);

      // Verify 58mm narrow layout generation
      const buffer58 = Buffer.from(
        generateEscposReceiptBuffer(
          { ...sampleReceiptData, paperSize: POSPrintPaperSize.THERMAL_58MM },
          false,
        ),
      );
      expect(Buffer.isBuffer(buffer58)).toBe(true);
      expect(buffer58.length).toBeGreaterThan(30);
    });
  });
});

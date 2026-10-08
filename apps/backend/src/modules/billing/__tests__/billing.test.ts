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
} from '@repo/shared-types';
import {
  InvoiceModel,
  QuoteModel,
  BillingSettingsModel,
} from '../billing.model.js';
import { catalogModule } from '../../catalog/index.js';
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
});

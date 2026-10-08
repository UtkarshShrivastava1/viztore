import mongoose, { ClientSession } from 'mongoose';
import {
  InvoiceStatus,
  InvoiceType,
  SettlementMode,
  QuoteStatus,
  TaxCalculationType,
  CreateInvoiceDto,
  RecordPaymentDto,
  CreateQuoteDto,
  UpdateBillingSettingsDto,
  IInvoiceListResponse,
  IQuoteListResponse,
  IInvoiceItemComputed,
  IInvoicePricing,
  DEFAULT_INDIAN_STATE,
} from '@repo/shared-types';
import {
  InvoiceModel,
  QuoteModel,
  BillingSettingsModel,
  IInvoiceDocument,
  IQuoteDocument,
  IBillingSettingsDocument,
} from './billing.model.js';
import { catalogModule } from '../catalog/index.js';
import { withTransaction } from '../../shared/database/transaction.js';
import { appendOutboxEvent, processPendingOutboxEvents } from '../../shared/database/outbox.service.js';
import { eventBus } from '../../shared/events/eventBus.js';
import { EVENTS } from '../../shared/events/eventTypes.js';
import { invalidateCache } from '../../shared/redis/cache.js';
import { AppError } from '../../shared/utils/AppError.js';
import { logger } from '../../shared/utils/logger.js';

// ── Tax Math & Pricing Helpers ──────────────────────────────────────────

export function normalizeStateIdentifier(stateStr: string): string {
  if (!stateStr) return '';
  const trimmed = stateStr.trim().toLowerCase();
  const codeMatch = trimmed.match(/\((\d{2})\)/);
  if (codeMatch) return codeMatch[1];
  if (/^\d{2}$/.test(trimmed)) return trimmed;
  return trimmed.replace(/\(\d{2}\)/g, '').trim();
}

export function computeItemTaxesAndPricing(
  rawItems: CreateInvoiceDto['items'],
  storeState = DEFAULT_INDIAN_STATE,
  placeOfSupply = DEFAULT_INDIAN_STATE,
  taxCalcType = TaxCalculationType.EXCLUSIVE,
): { computedItems: IInvoiceItemComputed[]; pricing: IInvoicePricing } {
  const isIntraState =
    normalizeStateIdentifier(storeState) === normalizeStateIdentifier(placeOfSupply);

  let subTotal = 0;
  let totalDiscount = 0;
  let taxableAmountTotal = 0;
  let cgstTotal = 0;
  let sgstTotal = 0;
  let igstTotal = 0;

  const computedItems: IInvoiceItemComputed[] = rawItems.map((item) => {
    const gross = item.unitPrice * item.quantity;
    const discount = Math.min(item.discountAmount ?? 0, gross);
    const net = gross - discount;

    let itemTaxable = 0;
    let itemTax = 0;

    if (taxCalcType === TaxCalculationType.INCLUSIVE) {
      itemTaxable = item.taxRate > 0 ? net / (1 + item.taxRate / 100) : net;
      itemTax = net - itemTaxable;
    } else {
      itemTaxable = net;
      itemTax = (itemTaxable * (item.taxRate ?? 0)) / 100;
    }

    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (isIntraState) {
      cgst = Number((itemTax / 2).toFixed(2));
      sgst = Number((itemTax / 2).toFixed(2));
      igst = 0;
    } else {
      cgst = 0;
      sgst = 0;
      igst = Number(itemTax.toFixed(2));
    }

    const itemTotal = Number((itemTaxable + cgst + sgst + igst).toFixed(2));

    subTotal += gross;
    totalDiscount += discount;
    taxableAmountTotal += itemTaxable;
    cgstTotal += cgst;
    sgstTotal += sgst;
    igstTotal += igst;

    return {
      productId: item.productId,
      variantId: item.variantId,
      title: item.title,
      hsnCode: item.hsnCode ?? '0000',
      quantity: item.quantity,
      unit: item.unit ?? 'Pcs',
      unitPrice: item.unitPrice,
      discountAmount: discount,
      taxableAmount: Number(itemTaxable.toFixed(2)),
      taxRate: item.taxRate,
      cgst,
      sgst,
      igst,
      totalAmount: itemTotal,
    };
  });

  const exactGrandTotal = taxableAmountTotal + cgstTotal + sgstTotal + igstTotal;
  const roundedGrandTotal = Math.round(exactGrandTotal);
  const roundOff = Number((roundedGrandTotal - exactGrandTotal).toFixed(2));

  const pricing: IInvoicePricing = {
    subTotal: Number(subTotal.toFixed(2)),
    totalDiscount: Number(totalDiscount.toFixed(2)),
    taxableAmount: Number(taxableAmountTotal.toFixed(2)),
    cgstTotal: Number(cgstTotal.toFixed(2)),
    sgstTotal: Number(sgstTotal.toFixed(2)),
    igstTotal: Number(igstTotal.toFixed(2)),
    roundOff,
    grandTotal: roundedGrandTotal,
  };

  return { computedItems, pricing };
}

// ── Billing Service Class ───────────────────────────────────────────────

export class BillingService {
  /**
   * Retrieves or creates default billing settings for a given store.
   */
  async getOrCreateSettings(
    storeId: string,
    session?: ClientSession,
  ): Promise<IBillingSettingsDocument> {
    let settings: IBillingSettingsDocument | null = await BillingSettingsModel.findOne(
      { storeId },
      null,
      { session },
    );

    if (!settings) {
      const created = await BillingSettingsModel.create(
        [
          {
            storeId: new mongoose.Types.ObjectId(storeId),
            invoicePrefix: 'INV-',
            nextInvoiceNumber: 1001,
            quotePrefix: 'Q-',
            nextQuoteNumber: 1001,
            defaultCurrency: 'INR',
            gstEnabled: true,
            state: 'Delhi',
            taxCalculationType: TaxCalculationType.EXCLUSIVE,
            allowDiscounts: true,
            maxDiscountPercent: 20,
            version: 1,
          },
        ],
        { session },
      );
      settings = created[0] ?? null;
    }

    if (!settings) {
      throw AppError.internal('Failed to initialize billing settings');
    }

    return settings;
  }

  /**
   * Atomically generates sequential invoice number (e.g. "INV-1001").
   */
  private async getNextInvoiceNumber(
    storeId: string,
    session?: ClientSession,
  ): Promise<string> {
    const settings = await BillingSettingsModel.findOneAndUpdate(
      { storeId: new mongoose.Types.ObjectId(storeId) },
      { $inc: { nextInvoiceNumber: 1 } },
      { new: false, upsert: true, session },
    );

    const prefix = settings?.invoicePrefix ?? 'INV-';
    const seq = settings?.nextInvoiceNumber ?? 1001;
    return `${prefix}${String(seq).padStart(4, '0')}`;
  }

  /**
   * Atomically generates sequential quote number (e.g. "Q-1001").
   */
  private async getNextQuoteNumber(
    storeId: string,
    session?: ClientSession,
  ): Promise<string> {
    const settings = await BillingSettingsModel.findOneAndUpdate(
      { storeId: new mongoose.Types.ObjectId(storeId) },
      { $inc: { nextQuoteNumber: 1 } },
      { new: false, upsert: true, session },
    );

    const prefix = settings?.quotePrefix ?? 'Q-';
    const seq = settings?.nextQuoteNumber ?? 1001;
    return `${prefix}${String(seq).padStart(4, '0')}`;
  }

  /**
   * Create Invoice with Atomic Inventory Deduction and Transactional Outbox (Rajesh Pillars 1, 4, 7)
   */
  async createInvoice(
    storeId: string,
    dto: CreateInvoiceDto,
    correlationId?: string,
  ): Promise<IInvoiceDocument> {
    const startTime = Date.now();
    logger.info(`[Billing] Creating invoice for store: ${storeId}`, { correlationId });

    // 1. Fetch store settings for state & tax calculations
    const settings = await this.getOrCreateSettings(storeId);
    const placeOfSupply = dto.placeOfSupply || dto.customer.state || settings.state || DEFAULT_INDIAN_STATE;

    // 2. Compute GST math & grand totals
    const { computedItems, pricing } = computeItemTaxesAndPricing(
      dto.items,
      settings.state,
      placeOfSupply,
      settings.taxCalculationType,
    );

    // 3. Prepare payment details
    const status = dto.payment?.status ?? InvoiceStatus.PAID;
    const paidAmount =
      status === InvoiceStatus.PAID
        ? pricing.grandTotal
        : (dto.payment?.paidAmount ?? 0);
    const dueAmount = Math.max(0, pricing.grandTotal - paidAmount);
    const settlementMode = dto.payment?.settlementMode ?? SettlementMode.CASH;

    const paymentHistory =
      paidAmount > 0
        ? [
            {
              amount: paidAmount,
              mode: settlementMode,
              date: new Date(),
              reference: 'POS Counter Sale',
            },
          ]
        : [];

    const shouldDeductInventory =
      status === InvoiceStatus.ISSUED || status === InvoiceStatus.PAID;

    // 4. Extract catalog stock items to deduct
    const stockItems = computedItems
      .filter((i) => i.productId)
      .map((i) => ({
        productId: i.productId!.toString(),
        sku: i.variantId,
        quantity: i.quantity,
      }));

    // Deterministic sorting to prevent deadlocks (Pillar 7)
    stockItems.sort((a, b) =>
      (a.sku ?? a.productId).localeCompare(b.sku ?? b.productId),
    );

    // 5. Execute within ACID MongoDB Transaction
    const invoice = await withTransaction(async (session) => {
      // Deduct catalog stock atomically if issued/paid
      if (shouldDeductInventory && stockItems.length > 0) {
        await catalogModule.deductStock(stockItems, session);
      }

      const invoiceNumber = await this.getNextInvoiceNumber(storeId, session);

      const createdList = await InvoiceModel.create(
        [
          {
            storeId: new mongoose.Types.ObjectId(storeId),
            invoiceNumber,
            type: dto.type ?? InvoiceType.TAX_INVOICE,
            idempotencyKey: dto.idempotencyKey,
            customer: dto.customer,
            items: computedItems,
            pricing,
            payment: {
              status,
              paidAmount,
              dueAmount,
              settlementMode,
              paymentDate: new Date(),
              paymentHistory,
            },
            dates: {
              invoiceDate: dto.dates?.invoiceDate ? new Date(dto.dates.invoiceDate) : new Date(),
              dueDate: dto.dates?.dueDate ? new Date(dto.dates.dueDate) : new Date(),
            },
            placeOfSupply,
            paymentTerms: dto.paymentTerms,
            notes: dto.notes,
            isInventoryDeducted: shouldDeductInventory,
            version: 1, // OCC Version (Pillar 1)
          },
        ],
        { session },
      );

      const created = createdList[0];
      if (!created) {
        throw AppError.internal('Failed to persist invoice document');
      }

      // Append Outbox Event within transaction (Pillar 7)
      await appendOutboxEvent(
        {
          eventType: EVENTS.INVOICE_ISSUED,
          schemaVersion: 1,
          aggregateType: 'Invoice',
          aggregateId: created.id,
          correlationId,
          payload: {
            invoiceId: created.id,
            invoiceNumber: created.invoiceNumber,
            storeId,
            grandTotal: pricing.grandTotal,
            status,
            itemsCount: computedItems.length,
          },
        },
        session,
      );

      return created;
    });

    // 6. Post-transaction operations: cache invalidation & async dispatch
    if (shouldDeductInventory && stockItems.length > 0) {
      await invalidateCache(`catalog:store:${storeId}*`);
      for (const item of stockItems) {
        await invalidateCache(`catalog:product:${item.productId}`);
      }
    }

    void processPendingOutboxEvents().catch((err) => {
      logger.warn(`Outbox dispatch failed for invoice ${invoice.id}:`, err);
    });

    eventBus.emit(EVENTS.INVOICE_ISSUED, {
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      correlationId,
    });

    logger.info(
      `[Billing] Invoice ${invoice.invoiceNumber} created successfully in ${Date.now() - startTime}ms`,
      { storeId, invoiceId: invoice.id },
    );

    return invoice;
  }

  /**
   * Record payment on an existing invoice with OCC Version Protection (Pillars 1 & 5)
   */
  async recordPayment(
    storeId: string,
    invoiceId: string,
    dto: RecordPaymentDto,
    expectedVersion?: number,
    correlationId?: string,
  ): Promise<IInvoiceDocument> {
    const invoice = await InvoiceModel.findOne({
      _id: invoiceId,
      storeId: new mongoose.Types.ObjectId(storeId),
    });

    if (!invoice) {
      throw AppError.notFound('Invoice not found', 'INVOICE_NOT_FOUND');
    }

    if (invoice.payment.status === InvoiceStatus.PAID) {
      throw AppError.badRequest('Invoice is already fully paid', 'INVOICE_ALREADY_PAID');
    }

    if (invoice.payment.status === InvoiceStatus.CANCELLED) {
      throw AppError.badRequest('Cannot record payment on a cancelled invoice', 'INVOICE_CANCELLED');
    }

    const currentVersion = expectedVersion ?? invoice.version;
    const newPaidAmount = Number((invoice.payment.paidAmount + dto.amount).toFixed(2));
    const newDueAmount = Math.max(0, Number((invoice.pricing.grandTotal - newPaidAmount).toFixed(2)));
    const newStatus =
      newDueAmount === 0 ? InvoiceStatus.PAID : InvoiceStatus.PARTIALLY_PAID;

    const newPaymentRecord = {
      amount: dto.amount,
      mode: dto.mode,
      date: new Date(),
      reference: dto.reference,
      recordedBy: dto.recordedBy,
    };

    // Atomic conditional update with version increment (OCC & ABA resolution)
    const updated = await InvoiceModel.findOneAndUpdate(
      {
        _id: invoiceId,
        storeId: new mongoose.Types.ObjectId(storeId),
        version: currentVersion,
      },
      {
        $set: {
          'payment.paidAmount': newPaidAmount,
          'payment.dueAmount': newDueAmount,
          'payment.status': newStatus,
          'payment.paymentDate': new Date(),
        },
        $push: { 'payment.paymentHistory': newPaymentRecord },
        $inc: { version: 1 },
      },
      { new: true },
    );

    if (!updated) {
      throw AppError.conflict(
        'Invoice was modified concurrently by another transaction. Please reload.',
        'CONCURRENT_MODIFICATION_ERROR',
      );
    }

    eventBus.emit(EVENTS.INVOICE_PAID, {
      invoiceId: updated.id,
      invoiceNumber: updated.invoiceNumber,
      amount: dto.amount,
      correlationId,
    });

    return updated;
  }

  /**
   * Cancel Invoice with Stock Restoration and OCC (Pillars 1, 4, 7)
   */
  async cancelInvoice(
    storeId: string,
    invoiceId: string,
    expectedVersion?: number,
    correlationId?: string,
  ): Promise<IInvoiceDocument> {
    const current = await InvoiceModel.findOne({
      _id: invoiceId,
      storeId: new mongoose.Types.ObjectId(storeId),
    });

    if (!current) {
      throw AppError.notFound('Invoice not found', 'INVOICE_NOT_FOUND');
    }

    if (current.payment.status === InvoiceStatus.CANCELLED) {
      return current; // Idempotent no-op
    }

    const versionToMatch = expectedVersion ?? current.version;

    const stockItems = current.items
      .filter((i) => i.productId)
      .map((i) => ({
        productId: i.productId!.toString(),
        sku: i.variantId,
        quantity: i.quantity,
      }));

    stockItems.sort((a, b) =>
      (a.sku ?? a.productId).localeCompare(b.sku ?? b.productId),
    );

    const cancelled = await withTransaction(async (session) => {
      // Restore inventory if it was previously deducted
      if (current.isInventoryDeducted && stockItems.length > 0) {
        await catalogModule.restoreStock(stockItems, session);
      }

      const updated = await InvoiceModel.findOneAndUpdate(
        {
          _id: invoiceId,
          storeId: new mongoose.Types.ObjectId(storeId),
          version: versionToMatch,
        },
        {
          $set: {
            'payment.status': InvoiceStatus.CANCELLED,
            isInventoryDeducted: false,
          },
          $inc: { version: 1 },
        },
        { new: true, session },
      );

      if (!updated) {
        throw AppError.conflict(
          'Invoice was modified concurrently. Please reload before cancelling.',
          'CONCURRENT_MODIFICATION_ERROR',
        );
      }

      await appendOutboxEvent(
        {
          eventType: EVENTS.INVOICE_CANCELLED,
          schemaVersion: 1,
          aggregateType: 'Invoice',
          aggregateId: updated.id,
          correlationId,
          payload: {
            invoiceId: updated.id,
            invoiceNumber: updated.invoiceNumber,
            storeId,
          },
        },
        session,
      );

      return updated;
    });

    // Invalidate Redis catalog cache
    if (stockItems.length > 0) {
      await invalidateCache(`catalog:store:${storeId}*`);
      for (const item of stockItems) {
        await invalidateCache(`catalog:product:${item.productId}`);
      }
    }

    void processPendingOutboxEvents().catch((err) => {
      logger.warn(`Outbox dispatch failed for invoice cancel ${cancelled.id}:`, err);
    });

    return cancelled;
  }

  /**
   * Get paginated invoices with single round-trip KPI aggregations (5.0.png)
   */
  async getInvoicesWithKPIs(
    storeId: string,
    query: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      settlementMode?: string;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<IInvoiceListResponse> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.max(1, Math.min(100, query.limit ?? 20));
    const skip = (page - 1) * limit;

    const matchConditions: Record<string, unknown> = {
      storeId: new mongoose.Types.ObjectId(storeId),
    };

    if (query.status && query.status !== 'all') {
      matchConditions['payment.status'] = query.status;
    }

    if (query.settlementMode) {
      matchConditions['payment.settlementMode'] = query.settlementMode;
    }

    if (query.startDate || query.endDate) {
      matchConditions['dates.invoiceDate'] = {};
      if (query.startDate) {
        (matchConditions['dates.invoiceDate'] as Record<string, unknown>)[
          '$gte'
        ] = new Date(query.startDate);
      }
      if (query.endDate) {
        (matchConditions['dates.invoiceDate'] as Record<string, unknown>)[
          '$lte'
        ] = new Date(query.endDate);
      }
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      matchConditions['$or'] = [
        { invoiceNumber: searchRegex },
        { 'customer.name': searchRegex },
        { 'customer.phone': searchRegex },
      ];
    }

    const now = new Date();

    const [result] = await InvoiceModel.aggregate([
      {
        $facet: {
          invoices: [
            { $match: matchConditions },
            { $sort: { 'dates.invoiceDate': -1, createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
          totalCount: [{ $match: matchConditions }, { $count: 'count' }],
          kpis: [
            {
              $match: {
                storeId: new mongoose.Types.ObjectId(storeId),
              },
            },
            {
              $group: {
                _id: null,
                totalInvoices: { $sum: 1 },
                totalSales: {
                  $sum: {
                    $cond: [
                      { $ne: ['$payment.status', InvoiceStatus.CANCELLED] },
                      '$pricing.grandTotal',
                      0,
                    ],
                  },
                },
                paidAmount: {
                  $sum: {
                    $cond: [
                      { $ne: ['$payment.status', InvoiceStatus.CANCELLED] },
                      '$payment.paidAmount',
                      0,
                    ],
                  },
                },
                outstandingAmount: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $ne: ['$payment.status', InvoiceStatus.CANCELLED] },
                          { $ne: ['$payment.status', InvoiceStatus.PAID] },
                        ],
                      },
                      '$payment.dueAmount',
                      0,
                    ],
                  },
                },
                overdueAmount: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $lt: ['$dates.dueDate', now] },
                          { $ne: ['$payment.status', InvoiceStatus.PAID] },
                          { $ne: ['$payment.status', InvoiceStatus.CANCELLED] },
                        ],
                      },
                      '$payment.dueAmount',
                      0,
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    ]);

    const invoices = (result?.invoices ?? []).map((doc: any) => ({
      ...doc,
      id: doc._id.toString(),
      storeId: doc.storeId.toString(),
    }));

    const total = result?.totalCount?.[0]?.count ?? 0;
    const kpiRaw = result?.kpis?.[0];

    const kpis = {
      totalInvoices: kpiRaw?.totalInvoices ?? 0,
      totalSales: Math.round(kpiRaw?.totalSales ?? 0),
      paidAmount: Math.round(kpiRaw?.paidAmount ?? 0),
      outstandingAmount: Math.round(kpiRaw?.outstandingAmount ?? 0),
      overdueAmount: Math.round(kpiRaw?.overdueAmount ?? 0),
    };

    return {
      invoices,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      kpis,
    };
  }

  /**
   * Create Quote / Estimate (5.6.png)
   */
  async createQuote(
    storeId: string,
    dto: CreateQuoteDto,
  ): Promise<IQuoteDocument> {
    const settings = await this.getOrCreateSettings(storeId);
    const placeOfSupply = dto.customer.state || settings.state || DEFAULT_INDIAN_STATE;

    const { computedItems, pricing } = computeItemTaxesAndPricing(
      dto.items,
      settings.state,
      placeOfSupply,
      settings.taxCalculationType,
    );

    const validUntil = dto.validUntil
      ? new Date(dto.validUntil)
      : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days default

    const quote = await withTransaction(async (session) => {
      const quoteNumber = await this.getNextQuoteNumber(storeId, session);

      const createdList = await QuoteModel.create(
        [
          {
            storeId: new mongoose.Types.ObjectId(storeId),
            quoteNumber,
            customer: dto.customer,
            items: computedItems,
            pricing,
            status: QuoteStatus.DRAFT,
            validUntil,
            referenceNumber: dto.referenceNumber,
            salesPerson: dto.salesPerson,
            termsAndConditions: dto.termsAndConditions ?? settings.termsAndConditions,
            notes: dto.notes,
            version: 1,
          },
        ],
        { session },
      );

      const created = createdList[0];
      if (!created) {
        throw AppError.internal('Failed to persist quote document');
      }

      return created;
    });

    return quote;
  }

  /**
   * Convert Quote to Live Invoice with 1-click & atomic stock deduction (5.5.png)
   */
  async convertQuoteToInvoice(
    storeId: string,
    quoteId: string,
    correlationId?: string,
  ): Promise<IInvoiceDocument> {
    const quote = await QuoteModel.findOne({
      _id: quoteId,
      storeId: new mongoose.Types.ObjectId(storeId),
    });

    if (!quote) {
      throw AppError.notFound('Quote not found', 'QUOTE_NOT_FOUND');
    }

    if (quote.status === QuoteStatus.CONVERTED) {
      throw AppError.badRequest('Quote is already converted to an invoice', 'QUOTE_ALREADY_CONVERTED');
    }

    // Prepare create invoice payload from quote
    const invoiceDto: CreateInvoiceDto = {
      type: InvoiceType.TAX_INVOICE,
      customer: quote.customer,
      items: quote.items.map((i) => ({
        productId: i.productId?.toString(),
        variantId: i.variantId,
        title: i.title,
        hsnCode: i.hsnCode,
        quantity: i.quantity,
        unit: i.unit as any,
        unitPrice: i.unitPrice,
        discountAmount: i.discountAmount,
        taxRate: i.taxRate,
      })),
      placeOfSupply: quote.customer.state,
      notes: `Converted from Estimate / Quote #${quote.quoteNumber}`,
      payment: {
        status: InvoiceStatus.ISSUED,
        settlementMode: SettlementMode.CASH,
        paidAmount: 0,
      },
    };

    const invoice = await this.createInvoice(storeId, invoiceDto, correlationId);

    // Update quote status
    await QuoteModel.updateOne(
      { _id: quoteId },
      {
        $set: {
          status: QuoteStatus.CONVERTED,
          convertedInvoiceId: invoice._id,
        },
        $inc: { version: 1 },
      },
    );

    return invoice;
  }

  /**
   * Get paginated quotes with KPI aggregates (5.5.png)
   */
  async getQuotesWithKPIs(
    storeId: string,
    query: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
    },
  ): Promise<IQuoteListResponse> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.max(1, Math.min(100, query.limit ?? 20));
    const skip = (page - 1) * limit;

    const matchConditions: Record<string, unknown> = {
      storeId: new mongoose.Types.ObjectId(storeId),
    };

    if (query.status && query.status !== 'all') {
      matchConditions.status = query.status;
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      matchConditions['$or'] = [
        { quoteNumber: searchRegex },
        { 'customer.name': searchRegex },
        { 'customer.phone': searchRegex },
      ];
    }

    const now = new Date();

    const [result] = await QuoteModel.aggregate([
      {
        $facet: {
          quotes: [
            { $match: matchConditions },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
          totalCount: [{ $match: matchConditions }, { $count: 'count' }],
          kpis: [
            {
              $match: {
                storeId: new mongoose.Types.ObjectId(storeId),
              },
            },
            {
              $group: {
                _id: null,
                totalQuotes: { $sum: 1 },
                totalValue: { $sum: '$pricing.grandTotal' },
                acceptedQuotes: {
                  $sum: { $cond: [{ $eq: ['$status', QuoteStatus.ACCEPTED] }, 1, 0] },
                },
                convertedQuotes: {
                  $sum: { $cond: [{ $eq: ['$status', QuoteStatus.CONVERTED] }, 1, 0] },
                },
                expiredQuotes: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $lt: ['$validUntil', now] },
                          { $ne: ['$status', QuoteStatus.CONVERTED] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    ]);

    const quotes = (result?.quotes ?? []).map((doc: any) => ({
      ...doc,
      id: doc._id.toString(),
      storeId: doc.storeId.toString(),
    }));

    const total = result?.totalCount?.[0]?.count ?? 0;
    const kpiRaw = result?.kpis?.[0];

    const kpis = {
      totalQuotes: kpiRaw?.totalQuotes ?? 0,
      totalValue: Math.round(kpiRaw?.totalValue ?? 0),
      acceptedQuotes: kpiRaw?.acceptedQuotes ?? 0,
      convertedQuotes: kpiRaw?.convertedQuotes ?? 0,
      expiredQuotes: kpiRaw?.expiredQuotes ?? 0,
    };

    return {
      quotes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      kpis,
    };
  }

  /**
   * Update billing configuration (5.3.png)
   */
  async updateSettings(
    storeId: string,
    dto: UpdateBillingSettingsDto,
    expectedVersion?: number,
  ): Promise<IBillingSettingsDocument> {
    const existing = await this.getOrCreateSettings(storeId);
    const versionToMatch = expectedVersion ?? existing.version;

    const updated = await BillingSettingsModel.findOneAndUpdate(
      {
        storeId: new mongoose.Types.ObjectId(storeId),
        version: versionToMatch,
      },
      {
        $set: { ...dto, updatedAt: new Date() },
        $inc: { version: 1 },
      },
      { new: true, runValidators: true },
    );

    if (!updated) {
      throw AppError.conflict(
        'Billing settings were updated concurrently. Please refresh.',
        'CONCURRENT_MODIFICATION_ERROR',
      );
    }

    return updated;
  }
}

export const billingService = new BillingService();

import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../shared/types/authenticated-request.js';
import {
  CreateInvoiceDto,
  RecordPaymentDto,
  CreateQuoteDto,
  UpdateBillingSettingsDto,
  CreatePOSSaleDto,
  POSPrintPaperSize,
} from '@repo/shared-types';
import { billingService } from './billing.service.js';
import { storeModule } from '../stores/index.js';
import { AppError } from '../../shared/utils/AppError.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import { ApiResponse } from '../../shared/utils/ApiResponse.js';
import { renderPrintableInvoiceHtml } from './invoicePrint.template.js';

async function extractStoreId(req: Request): Promise<string> {
  const authReq = req as AuthenticatedRequest;
  let storeId =
    authReq.user?.storeId ||
    req.params.storeId ||
    (req.query.storeId as string) ||
    (req.headers['x-store-id'] as string) ||
    (req.body as any)?.storeId;

  if (!storeId && authReq.user) {
    const userId = (authReq.user as any)._id || authReq.user.id || (authReq.user as any).sub;
    if (userId) {
      const store = await storeModule.getStoreByOwnerId(userId);
      if (store) {
        storeId = store.id;
      }
    }
  }

  if (!storeId) {
    throw AppError.badRequest('Store context is required for billing operations', 'STORE_ID_REQUIRED');
  }

  return storeId;
}

export const billingController = {
  // ── Invoices ──────────────────────────────────────────────────────────

  getInvoices: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const result = await billingService.getInvoicesWithKPIs(storeId, req.query);
    return ApiResponse.success(res, result);
  }),

  createInvoice: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const authReq = req as AuthenticatedRequest;
    const invoice = await billingService.createInvoice(
      storeId,
      req.body as CreateInvoiceDto,
      authReq.correlationId,
    );
    return ApiResponse.created(
      res,
      invoice,
      `Invoice ${invoice.invoiceNumber} created successfully`,
    );
  }),

  getInvoiceById: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const id = req.params.id as string;
    const result = await billingService.getInvoicesWithKPIs(storeId, { search: id });
    const match = result.invoices.find((i) => i.id === id);
    if (!match) {
      throw AppError.notFound('Invoice not found', 'INVOICE_NOT_FOUND');
    }
    return ApiResponse.success(res, match);
  }),

  recordPayment: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const id = req.params.id as string;
    const authReq = req as AuthenticatedRequest;
    const expectedVersion = req.query.expectedVersion
      ? parseInt(req.query.expectedVersion as string, 10)
      : undefined;

    const updated = await billingService.recordPayment(
      storeId,
      id,
      req.body as RecordPaymentDto,
      expectedVersion,
      authReq.correlationId,
    );

    return ApiResponse.success(res, updated, 'Payment recorded successfully');
  }),

  cancelInvoice: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const id = req.params.id as string;
    const authReq = req as AuthenticatedRequest;
    const expectedVersion = req.query.expectedVersion
      ? parseInt(req.query.expectedVersion as string, 10)
      : undefined;

    const cancelled = await billingService.cancelInvoice(
      storeId,
      id,
      expectedVersion,
      authReq.correlationId,
    );

    return ApiResponse.success(
      res,
      cancelled,
      `Invoice ${cancelled.invoiceNumber} cancelled and inventory restored`,
    );
  }),

  // ── Quotes / Estimates ────────────────────────────────────────────────

  getQuotes: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const result = await billingService.getQuotesWithKPIs(storeId, req.query);
    return ApiResponse.success(res, result);
  }),

  createQuote: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const quote = await billingService.createQuote(storeId, req.body as CreateQuoteDto);
    return ApiResponse.created(res, quote, `Quote ${quote.quoteNumber} created successfully`);
  }),

  convertQuoteToInvoice: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const id = req.params.id as string;
    const authReq = req as AuthenticatedRequest;
    const invoice = await billingService.convertQuoteToInvoice(
      storeId,
      id,
      authReq.correlationId,
    );

    return ApiResponse.created(
      res,
      invoice,
      `Quote converted into invoice ${invoice.invoiceNumber}`,
    );
  }),

  // ── Settings ──────────────────────────────────────────────────────────

  getSettings: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const settings = await billingService.getOrCreateSettings(storeId);
    return ApiResponse.success(res, settings);
  }),

  updateSettings: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const expectedVersion = req.query.expectedVersion
      ? parseInt(req.query.expectedVersion as string, 10)
      : undefined;

    const updated = await billingService.updateSettings(
      storeId,
      req.body as UpdateBillingSettingsDto,
      expectedVersion,
    );

    return ApiResponse.success(res, updated, 'Billing settings updated successfully');
  }),

  // ── POS Fast Counter Sale & Thermal Print ──────────────────────────

  createPOSSale: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const authReq = req as AuthenticatedRequest;
    const result = await billingService.createPOSSale(
      storeId,
      req.body as CreatePOSSaleDto,
      authReq.correlationId,
    );
    return ApiResponse.created(
      res,
      result,
      `POS Sale #${result.invoice.invoiceNumber} completed`,
    );
  }),

  getLastReceipt: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const paperSize = (req.query.paperSize as POSPrintPaperSize) || POSPrintPaperSize.THERMAL_80MM;
    const result = await billingService.getLastReceipt(storeId, paperSize);
    return ApiResponse.success(res, result);
  }),

  printInvoice: catchAsync(async (req: Request, res: Response) => {
    const storeId = await extractStoreId(req);
    const id = req.params.id as string;
    const format = (req.query.format as string) === 'thermal' ? 'thermal' : 'a4';
    const autoPrint = req.query.autoPrint === 'true';

    const printableData = await billingService.getPrintableInvoice(storeId, id);
    const html = renderPrintableInvoiceHtml(printableData, { format, autoPrint });

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  }),
};


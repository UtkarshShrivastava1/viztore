import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../shared/types/authenticated-request.js';
import {
  CreateInvoiceDto,
  RecordPaymentDto,
  CreateQuoteDto,
  UpdateBillingSettingsDto,
} from '@repo/shared-types';
import { billingService } from './billing.service.js';
import { AppError } from '../../shared/utils/AppError.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import { ApiResponse } from '../../shared/utils/ApiResponse.js';

function extractStoreId(req: Request): string {
  const authReq = req as AuthenticatedRequest;
  const storeId =
    authReq.user?.storeId ||
    req.params.storeId ||
    (req.query.storeId as string);

  if (!storeId) {
    throw AppError.badRequest('Store context is required for billing operations', 'STORE_ID_REQUIRED');
  }

  return storeId;
}

export const billingController = {
  // ── Invoices ──────────────────────────────────────────────────────────

  getInvoices: catchAsync(async (req: Request, res: Response) => {
    const storeId = extractStoreId(req);
    const result = await billingService.getInvoicesWithKPIs(storeId, req.query);
    return ApiResponse.success(res, result);
  }),

  createInvoice: catchAsync(async (req: Request, res: Response) => {
    const storeId = extractStoreId(req);
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
    const storeId = extractStoreId(req);
    const id = req.params.id as string;
    const result = await billingService.getInvoicesWithKPIs(storeId, { search: id });
    const match = result.invoices.find((i) => i.id === id);
    if (!match) {
      throw AppError.notFound('Invoice not found', 'INVOICE_NOT_FOUND');
    }
    return ApiResponse.success(res, match);
  }),

  recordPayment: catchAsync(async (req: Request, res: Response) => {
    const storeId = extractStoreId(req);
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
    const storeId = extractStoreId(req);
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
    const storeId = extractStoreId(req);
    const result = await billingService.getQuotesWithKPIs(storeId, req.query);
    return ApiResponse.success(res, result);
  }),

  createQuote: catchAsync(async (req: Request, res: Response) => {
    const storeId = extractStoreId(req);
    const quote = await billingService.createQuote(storeId, req.body as CreateQuoteDto);
    return ApiResponse.created(res, quote, `Quote ${quote.quoteNumber} created successfully`);
  }),

  convertQuoteToInvoice: catchAsync(async (req: Request, res: Response) => {
    const storeId = extractStoreId(req);
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
    const storeId = extractStoreId(req);
    const settings = await billingService.getOrCreateSettings(storeId);
    return ApiResponse.success(res, settings);
  }),

  updateSettings: catchAsync(async (req: Request, res: Response) => {
    const storeId = extractStoreId(req);
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
};

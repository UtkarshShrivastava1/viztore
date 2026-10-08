import {
  CreateInvoiceSchema,
  RecordPaymentSchema,
  CreateQuoteSchema,
  UpdateQuoteStatusSchema,
  UpdateBillingSettingsSchema,
} from '@repo/shared-types';
import { validateBody, validateQuery, validateParams } from '../../shared/middlewares/validateRequest.js';
import { z } from 'zod';

export const validateCreateInvoice = validateBody(CreateInvoiceSchema);
export const validateRecordPayment = validateBody(RecordPaymentSchema);
export const validateCreateQuote = validateBody(CreateQuoteSchema);
export const validateUpdateQuoteStatus = validateBody(UpdateQuoteStatusSchema);
export const validateUpdateBillingSettings = validateBody(UpdateBillingSettingsSchema);

export const InvoiceQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 20)),
  search: z.string().optional(),
  status: z.string().optional(),
  settlementMode: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const QuoteQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 20)),
  search: z.string().optional(),
  status: z.string().optional(),
});

export const validateInvoiceQuery = validateQuery(InvoiceQuerySchema);
export const validateQuoteQuery = validateQuery(QuoteQuerySchema);

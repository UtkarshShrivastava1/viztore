/**
 * BILLING MODULE — Public Facade
 * ONLY file external modules and app.ts may import from billing/
 */
export { billingRouter, createBillingRouter } from './billing.routes.js';
export { billingService, BillingService } from './billing.service.js';
export {
  InvoiceModel,
  QuoteModel,
  BillingSettingsModel,
  type IInvoiceDocument,
  type IQuoteDocument,
  type IBillingSettingsDocument,
} from './billing.model.js';
export * from './billing.validation.js';

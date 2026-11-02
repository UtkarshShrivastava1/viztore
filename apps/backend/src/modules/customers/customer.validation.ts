import {
  CreateCustomerSchema,
  UpdateCustomerSchema,
  AdjustCustomerCreditSchema,
  RecordCustomerPaymentSchema,
} from '@repo/shared-types';
import { validateBody, validateQuery } from '../../shared/middlewares/validateRequest.js';
import { z } from 'zod';

export const validateCreateCustomer = validateBody(CreateCustomerSchema);
export const validateUpdateCustomer = validateBody(UpdateCustomerSchema);
export const validateAdjustCredit = validateBody(AdjustCustomerCreditSchema);
export const validateRecordPayment = validateBody(RecordCustomerPaymentSchema);

export const CustomerQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 20)),
  search: z.string().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
});

export const validateCustomerQuery = validateQuery(CustomerQuerySchema);


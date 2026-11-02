import { z } from 'zod';
import { validateBody, validateQuery } from '../../shared/middlewares/validateRequest.js';
import { saveBankAccountSchema, requestPayoutSchema } from '@repo/shared-types';

export const SaveBankAccountSchema = saveBankAccountSchema;
export const RequestPayoutSchema = requestPayoutSchema;

export const QuerySettlementsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const validateSaveBankAccount = validateBody(SaveBankAccountSchema);
export const validateRequestPayout = validateBody(RequestPayoutSchema);
export const validateQuerySettlements = validateQuery(QuerySettlementsSchema);


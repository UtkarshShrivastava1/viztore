import { z } from 'zod';
import { validateBody, validateQuery } from '../../shared/middlewares/validateRequest.js';
import { createReturnInputSchema } from '@repo/shared-types';

export const CreateReturnSchema = createReturnInputSchema;

export const ApproveReturnSchema = z.object({
  pickupDate: z.string().optional(),
  pickupTime: z.string().optional(),
  internalNote: z.string().optional(),
});

export const RejectReturnSchema = z.object({
  reason: z.string().min(2, 'Rejection reason is required'),
});

export const RefundReturnSchema = z.object({
  refundAmount: z.number().positive().optional(),
  refundMethod: z.string().optional(),
  internalNote: z.string().optional(),
});

export const QueryReturnsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const validateCreateReturn = validateBody(CreateReturnSchema);
export const validateApproveReturn = validateBody(ApproveReturnSchema);
export const validateRejectReturn = validateBody(RejectReturnSchema);
export const validateRefundReturn = validateBody(RefundReturnSchema);
export const validateQueryReturns = validateQuery(QueryReturnsSchema);

import type { Request } from 'express';
import type { JwtTokenPayload } from '@repo/shared-types';

export type AuthenticatedRequest<
  TBody = any,
  TParams = any,
  TQuery = any,
> = Request<TParams, any, TBody, TQuery> & {
  user: JwtTokenPayload & { id?: string; storeId?: string };
  correlationId: string;
};

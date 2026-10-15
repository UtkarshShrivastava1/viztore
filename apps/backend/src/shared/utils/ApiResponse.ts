import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiSuccessResponse, ApiErrorResponse } from '@repo/shared-types';

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = StatusCodes.OK,
    meta?: ApiSuccessResponse<T>['meta'],
    facets?: unknown,
  ): Response<ApiSuccessResponse<T>> {
    const payload: ApiSuccessResponse<T> & { facets?: unknown } = {
      success: true,
      data,
      ...(message ? { message } : {}),
      ...(meta ? { meta } : {}),
      ...(facets ? { facets } : {}),
    };
    return res.status(statusCode).json(payload);
  }

  static created<T>(
    res: Response,
    data: T,
    message = 'Resource created successfully',
  ): Response<ApiSuccessResponse<T>> {
    return this.success(res, data, message, StatusCodes.CREATED);
  }

  static noContent(res: Response): Response {
    return res.status(StatusCodes.NO_CONTENT).send();
  }

  static error(
    res: Response,
    statusCode: number,
    code: string,
    message: string,
    details?: unknown,
  ): Response<ApiErrorResponse> {
    const payload: ApiErrorResponse = {
      success: false,
      error: {
        code,
        message,
        ...(details ? { details } : {}),
      },
    };
    return res.status(statusCode).json(payload);
  }
}

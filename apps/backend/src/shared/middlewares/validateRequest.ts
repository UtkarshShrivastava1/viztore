import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodTypeAny, ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

interface RequestValidationSchemas {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

export const validateRequest = (schemas: RequestValidationSchemas): RequestHandler => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        req.query = (await schemas.query.parseAsync(req.query)) as Request['query'];
      }
      if (schemas.params) {
        req.params = (await schemas.params.parseAsync(req.params)) as Request['params'];
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        next(AppError.badRequest('Validation failed', 'VALIDATION_ERROR', formattedErrors));
      } else {
        next(error);
      }
    }
  };
};

export const validateBody = (schema: ZodTypeAny): RequestHandler => validateRequest({ body: schema });
export const validateQuery = (schema: ZodTypeAny): RequestHandler => validateRequest({ query: schema });
export const validateParams = (schema: ZodTypeAny): RequestHandler => validateRequest({ params: schema });


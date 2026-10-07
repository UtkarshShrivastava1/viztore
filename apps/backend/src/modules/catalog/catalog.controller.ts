import { Request, Response, RequestHandler } from 'express';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import { ApiResponse } from '../../shared/utils/ApiResponse.js';
import { AppError } from '../../shared/utils/AppError.js';
import { ProductQueryDto } from '@repo/shared-types';
import type { AuthenticatedRequest } from '../../shared/types/authenticated-request.js';
import * as catalogService from './catalog.service.js';

/**
 * POST /catalog/products — Create a new product (Merchant)
 */
export const createProduct: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user) throw AppError.unauthorized();

  const { storeId } = req.body;
  if (!storeId) throw AppError.badRequest('storeId is required in request body');

  const product = await catalogService.createProduct(storeId, authReq.user.sub, req.body);
  return ApiResponse.created(res, product, 'Product created successfully');
});

/**
 * POST /catalog/products/bulk — Bulk create products (Merchant)
 */
export const bulkCreateProducts: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user) throw AppError.unauthorized();

  const { storeId, products } = req.body;
  if (!storeId) throw AppError.badRequest('storeId is required');
  if (!Array.isArray(products) || products.length === 0) {
    throw AppError.badRequest('products array is required and must not be empty');
  }

  const result = await catalogService.bulkCreateProducts(storeId, authReq.user.sub, products);
  return ApiResponse.success(res, result, `${result.created} products created`);
});

/**
 * PATCH /catalog/products/:id — Update a product (Merchant)
 */
export const updateProduct: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user) throw AppError.unauthorized();
  const { id } = req.params;
  if (!id) throw AppError.badRequest('Product ID is required');

  const expectedVersion = req.body.expectedVersion ? Number(req.body.expectedVersion) : undefined;
  const product = await catalogService.updateProduct(id, authReq.user.sub, req.body, expectedVersion);
  return ApiResponse.success(res, product, 'Product updated successfully');
});

/**
 * DELETE /catalog/products/:id — Soft-delete a product (Merchant)
 */
export const deleteProduct: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user) throw AppError.unauthorized();
  const { id } = req.params;
  if (!id) throw AppError.badRequest('Product ID is required');

  const expectedVersion = req.query.expectedVersion ? Number(req.query.expectedVersion) : undefined;
  await catalogService.deleteProduct(id, authReq.user.sub, expectedVersion);
  return ApiResponse.success(res, null, 'Product deleted successfully');
});

/**
 * GET /catalog/products — Faceted product listing (Public)
 */
export const listProducts: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as unknown as ProductQueryDto;
  const result = await catalogService.listProducts(query);
  return ApiResponse.success(res, result.products, undefined, undefined, result.meta);
});

/**
 * GET /catalog/products/featured — Featured products for home feed (Public)
 */
export const getFeaturedProducts: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 12;
  const products = await catalogService.getFeaturedProducts(limit);
  return ApiResponse.success(res, products);
});

/**
 * GET /catalog/products/:idOrSlug — Single product by ID or slug (Public)
 */
export const getProduct: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const { idOrSlug } = req.params;
  if (!idOrSlug) throw AppError.badRequest('Product ID or slug is required');

  const product = await catalogService.getProductByIdOrSlug(idOrSlug);
  return ApiResponse.success(res, product);
});

/**
 * GET /catalog/stores/:storeId/products — Products for a store's storefront (Public)
 */
export const getStoreProducts: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const { storeId } = req.params;
  if (!storeId) throw AppError.badRequest('Store ID is required');

  const query = req.query as unknown as Partial<ProductQueryDto>;
  const result = await catalogService.getStoreProducts(storeId, query);
  return ApiResponse.success(res, result.products, undefined, undefined, result.meta);
});

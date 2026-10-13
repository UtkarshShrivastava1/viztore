import { Router } from 'express';
import { authGuard } from '../../shared/middlewares/authGuard.js';
import { roleGuard } from '../../shared/middlewares/roleGuard.js';
import { validateRequest } from '../../shared/middlewares/validateRequest.js';
import { idempotencyMiddleware } from '../../shared/middlewares/idempotency.middleware.js';
import { UserRole } from '@repo/shared-types';
import { createProductSchema, updateProductSchema, productQuerySchema } from './catalog.validation.js';
import * as catalogController from './catalog.controller.js';

export const catalogRouter = Router();

// ── Public Routes (No Auth Required) ───────────────────────────────────

// Faceted product listing
catalogRouter.get(
  '/products',
  validateRequest({ query: productQuerySchema }),
  catalogController.listProducts,
);

// Featured products for home feed
catalogRouter.get('/products/featured', catalogController.getFeaturedProducts);

// Single product by ID or slug
catalogRouter.get('/products/:idOrSlug', catalogController.getProduct);

// Store-scoped product listing
catalogRouter.get('/stores/:storeId/products', catalogController.getStoreProducts);

// ── Protected Routes (Merchant Only) ───────────────────────────────────

// Create a product
catalogRouter.post(
  '/products',
  authGuard,
  roleGuard(UserRole.MERCHANT, UserRole.ADMIN),
  idempotencyMiddleware({ ttlSeconds: 300 }),
  validateRequest({ body: createProductSchema }),
  catalogController.createProduct,
);

// Bulk create products
catalogRouter.post(
  '/products/bulk',
  authGuard,
  roleGuard(UserRole.MERCHANT, UserRole.ADMIN),
  idempotencyMiddleware({ ttlSeconds: 300 }),
  catalogController.bulkCreateProducts,
);

// Update a product
catalogRouter.patch(
  '/products/:id',
  authGuard,
  roleGuard(UserRole.MERCHANT, UserRole.ADMIN),
  validateRequest({ body: updateProductSchema }),
  catalogController.updateProduct,
);

// Soft-delete a product
catalogRouter.delete(
  '/products/:id',
  authGuard,
  roleGuard(UserRole.MERCHANT, UserRole.ADMIN),
  catalogController.deleteProduct,
);

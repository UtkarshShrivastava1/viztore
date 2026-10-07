/**
 * CATALOG MODULE — Public Facade
 * ONLY file other modules and app.ts may import from catalog/
 */
import { createCatalogModule } from './catalog.module.js';
import * as catalogService from './catalog.service.js';
import type { ICatalogFacade, CheckStockItem, StockCheckResult } from './catalog.types.js';

const defaultCatalogModule = createCatalogModule();

export const catalogRouter = defaultCatalogModule.router;
export const catalogRepository = defaultCatalogModule.repository;

import type { ClientSession } from 'mongoose';
import { logger } from '../../shared/utils/logger.js';

export const catalogModule: ICatalogFacade = {
  getProductById: async (id: string) => {
    try {
      const product = await catalogService.getProductById(id);
      if (!product) return null;
      return {
        id: (product as any)._id?.toString() || (product as any).id,
        name: product.name,
        price: product.basePrice,
        storeId: (product as any).storeId?.toString(),
        isActive: product.isActive,
        version: (product as any).version,
      };
    } catch (err: any) {
      if (err?.statusCode === 404) return null;
      logger.error('CatalogFacade getProductById failed', { error: err, productId: id });
      throw err;
    }
  },
  checkStock: async (items: CheckStockItem[]): Promise<StockCheckResult> => {
    const unavailable: StockCheckResult['unavailableItems'] = [];
    const productIds = Array.from(new Set(items.map((i) => i.productId)));
    const products = await catalogService.getProductsByIds(productIds);
    const productMap = new Map(products.map((p) => [((p as any)._id?.toString() || (p as any).id || '').toString(), p]));

    for (const item of items) {
      const p = productMap.get(item.productId);
      if (!p || !p.isActive) {
        unavailable.push({
          productId: item.productId,
          requested: item.quantity,
          available: 0,
        });
        continue;
      }

      if (item.sku && p.variants && p.variants.length > 0) {
        const v = p.variants.find((v) => v.sku === item.sku);
        if (!v || (v.stock ?? 0) < item.quantity) {
          unavailable.push({
            productId: item.productId,
            requested: item.quantity,
            available: v?.stock ?? 0,
          });
        }
      } else if ((p.totalStock ?? 0) < item.quantity) {
        unavailable.push({
          productId: item.productId,
          requested: item.quantity,
          available: p.totalStock ?? 0,
        });
      }
    }

    return {
      available: unavailable.length === 0,
      unavailableItems: unavailable.length > 0 ? unavailable : undefined,
    };
  },
  deductStock: async (items: CheckStockItem[], session?: ClientSession): Promise<void> => {
    await catalogService.deductStockAtomic(items, session);
  },
  restoreStock: async (items: CheckStockItem[], session?: ClientSession): Promise<void> => {
    await catalogService.restoreStockAtomic(items, session);
  },
};

export { createCatalogModule, catalogService };
export * from './catalog.types.js';
export * from './catalog.validator.js';
export { ProductModel } from './product.model.js';

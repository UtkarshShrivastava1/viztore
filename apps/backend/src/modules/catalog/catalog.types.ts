import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
  IProduct,
  IProductListResponse,
  IProductFacets,
  ProductSortOption,
  ProductCategory,
} from '@repo/shared-types';
import type { IProductDocument } from './product.model.js';

export { ProductSortOption, ProductCategory };
export type {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
  IProduct,
  IProductListResponse,
  IProductFacets,
  IProductDocument,
};

export interface CheckStockItem {
  productId: string;
  sku?: string;
  quantity: number;
}

export interface StockCheckResult {
  available: boolean;
  unavailableItems?: {
    productId: string;
    requested: number;
    available: number;
  }[];
}

import type { ClientSession } from 'mongoose';

export interface ICatalogRepository {
  create(storeId: string, storeName: string, dto: CreateProductDto & { slug: string }): Promise<IProduct>;
  findById(id: string): Promise<IProduct | null>;
  findBySlug(slug: string): Promise<IProduct | null>;
  list(query: ProductQueryDto): Promise<IProductListResponse>;
  update(id: string, dto: UpdateProductDto, expectedVersion?: number, session?: ClientSession): Promise<IProduct | null>;
  delete(id: string, expectedVersion?: number, session?: ClientSession): Promise<boolean>;
  deductStock?(items: CheckStockItem[], session?: ClientSession): Promise<void>;
  restoreStock?(items: CheckStockItem[], session?: ClientSession): Promise<void>;
}

export interface ICatalogService {
  createProduct(storeId: string, ownerId: string, dto: CreateProductDto): Promise<IProduct>;
  bulkCreateProducts(
    storeId: string,
    ownerId: string,
    items: CreateProductDto[],
  ): Promise<{ created: number; errors: Array<{ index: number; error: string }> }>;
  updateProduct(productId: string, ownerId: string, dto: UpdateProductDto, expectedVersion?: number): Promise<IProduct>;
  deleteProduct(productId: string, ownerId: string, expectedVersion?: number): Promise<void>;
  getProductById(id: string): Promise<IProduct>;
  getProductBySlug(slug: string): Promise<IProduct>;
  getProductByIdOrSlug(idOrSlug: string): Promise<IProduct>;
  listProducts(query: ProductQueryDto): Promise<IProductListResponse>;
}

export interface ICatalogFacade {
  getProductById(id: string): Promise<{
    id: string;
    name: string;
    price: number;
    storeId: string;
    isActive: boolean;
    version?: number;
  } | null>;
  checkStock(items: CheckStockItem[]): Promise<StockCheckResult>;
  deductStock(items: CheckStockItem[], session?: ClientSession): Promise<void>;
  restoreStock(items: CheckStockItem[], session?: ClientSession): Promise<void>;
}

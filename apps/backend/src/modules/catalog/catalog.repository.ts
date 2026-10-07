import type { Model } from 'mongoose';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
  IProduct,
  IProductListResponse,
  ICatalogRepository,
  IProductDocument,
} from './catalog.types.js';
import { listProducts } from './catalog.service.js';

import { cacheAside, invalidateCache } from '../../shared/redis/cache.js';
import type { ClientSession } from 'mongoose';

export function createCatalogRepository(
  productModel: Model<IProductDocument>,
): ICatalogRepository {
  async function create(
    storeId: string,
    storeName: string,
    dto: CreateProductDto & { slug: string },
  ): Promise<IProduct> {
    const product = new productModel({
      ...dto,
      storeId,
      storeName,
      version: 1,
      isActive: true,
    });
    await product.save();
    return (product.toJSON ? product.toJSON() : product) as unknown as IProduct;
  }

  async function findById(id: string): Promise<IProduct | null> {
    return cacheAside(`catalog:product:${id}`, 180, async () => {
      const product = await productModel
        .findOne({ _id: id, isActive: true })
        .read('secondaryPreferred')
        .lean();
      return product as unknown as IProduct;
    });
  }

  async function findBySlug(slug: string): Promise<IProduct | null> {
    return cacheAside(`catalog:slug:${slug}`, 180, async () => {
      const product = await productModel
        .findOne({ slug, isActive: true })
        .read('secondaryPreferred')
        .lean();
      return product as unknown as IProduct;
    });
  }

  async function list(query: ProductQueryDto): Promise<IProductListResponse> {
    return listProducts(query);
  }

  async function update(
    id: string,
    dto: UpdateProductDto,
    expectedVersion?: number,
    session?: ClientSession,
  ): Promise<IProduct | null> {
    const filter: Record<string, unknown> = { _id: id, isActive: true };
    if (typeof expectedVersion === 'number') {
      filter.version = expectedVersion;
    }

    const product = await productModel.findOneAndUpdate(
      filter,
      {
        $set: { ...dto, updatedAt: new Date() },
        $inc: { version: 1 },
      },
      { new: true, runValidators: true, session },
    );

    if (product) {
      await invalidateCache(`catalog:product:${id}`);
      if (product.slug) {
        await invalidateCache(`catalog:slug:${product.slug}`);
      }
    }

    return product ? ((product.toJSON ? product.toJSON() : product) as unknown as IProduct) : null;
  }

  async function deleteProduct(
    id: string,
    expectedVersion?: number,
    session?: ClientSession,
  ): Promise<boolean> {
    const filter: Record<string, unknown> = { _id: id };
    if (typeof expectedVersion === 'number') {
      filter.version = expectedVersion;
    }

    const res = await productModel.findOneAndUpdate(
      filter,
      { $set: { isActive: false }, $inc: { version: 1 } },
      { session },
    );

    if (res) {
      await invalidateCache(`catalog:product:${id}`);
      if (res.slug) {
        await invalidateCache(`catalog:slug:${res.slug}`);
      }
    }

    return !!res;
  }

  return {
    create,
    findById,
    findBySlug,
    list,
    update,
    delete: deleteProduct,
  };
}

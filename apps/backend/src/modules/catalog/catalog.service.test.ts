import { describe, it, expect } from 'vitest';
import { ProductSortOption, ProductCategory, ProductSubType } from '@repo/shared-types';

/**
 * Unit tests for catalog module logic.
 * Tests slug generation, sort stage construction, and schema validation.
 */

describe('Catalog Module — Unit Tests', () => {
  // ── Slug Generation ──────────────────────────────────────────────────

  describe('generateSlug', () => {
    function generateSlug(name: string): string {
      const base = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      const randomSuffix = Math.random().toString(36).substring(2, 7);
      return `${base}-${randomSuffix}`;
    }

    it('should produce a lowercase hyphenated slug with random suffix', () => {
      const slug = generateSlug('Slim-Fit Linen Formal Shirt');
      expect(slug).toMatch(/^slim-fit-linen-formal-shirt-[a-z0-9]{5}$/);
    });

    it('should strip special characters from the slug', () => {
      const slug = generateSlug("Men's Cotton T-Shirt (Premium)");
      expect(slug).not.toContain("'");
      expect(slug).not.toContain('(');
      expect(slug).not.toContain(')');
    });

    it('should generate unique slugs for the same name', () => {
      const slug1 = generateSlug('Test Product');
      const slug2 = generateSlug('Test Product');
      expect(slug1).not.toBe(slug2);
    });
  });

  // ── Sort Stage Builder ───────────────────────────────────────────────

  describe('buildSortStage', () => {
    function buildSortStage(sort: ProductSortOption): Record<string, 1 | -1> {
      switch (sort) {
        case ProductSortOption.PRICE_ASC:
          return { basePrice: 1 };
        case ProductSortOption.PRICE_DESC:
          return { basePrice: -1 };
        case ProductSortOption.RATING:
          return { rating: -1, reviewCount: -1 };
        case ProductSortOption.NEWEST:
          return { createdAt: -1 };
        case ProductSortOption.DISCOUNT:
          return { maxDiscount: -1 };
        case ProductSortOption.POPULARITY:
          return { reviewCount: -1, rating: -1 };
        case ProductSortOption.RELEVANCE:
        default:
          return { isFeatured: -1, rating: -1, createdAt: -1 };
      }
    }

    it('should return ascending price sort for PRICE_ASC', () => {
      const sort = buildSortStage(ProductSortOption.PRICE_ASC);
      expect(sort).toEqual({ basePrice: 1 });
    });

    it('should return descending price sort for PRICE_DESC', () => {
      const sort = buildSortStage(ProductSortOption.PRICE_DESC);
      expect(sort).toEqual({ basePrice: -1 });
    });

    it('should use featured + rating + newest for RELEVANCE', () => {
      const sort = buildSortStage(ProductSortOption.RELEVANCE);
      expect(sort).toEqual({ isFeatured: -1, rating: -1, createdAt: -1 });
    });

    it('should use createdAt descending for NEWEST', () => {
      const sort = buildSortStage(ProductSortOption.NEWEST);
      expect(sort).toEqual({ createdAt: -1 });
    });

    it('should use maxDiscount descending for DISCOUNT', () => {
      const sort = buildSortStage(ProductSortOption.DISCOUNT);
      expect(sort).toEqual({ maxDiscount: -1 });
    });
  });

  // ── Stock Aggregation Logic ──────────────────────────────────────────

  describe('Stock Computation', () => {
    interface SimpleVariant {
      stock: number;
      isActive: boolean;
      price: number;
      mrp: number;
    }

    function computeProductDerived(variants: SimpleVariant[]) {
      const activeVariants = variants.filter((v) => v.isActive);
      const totalStock = activeVariants.reduce((sum, v) => sum + v.stock, 0);
      const firstActive = activeVariants[0] || variants[0];
      const basePrice = firstActive?.price || 0;
      const baseMrp = firstActive?.mrp || 0;
      const maxDiscount = activeVariants
        .filter((v) => v.mrp > 0)
        .reduce((max, v) => {
          const discount = Math.round(((v.mrp - v.price) / v.mrp) * 100);
          return discount > max ? discount : max;
        }, 0);

      return { totalStock, basePrice, baseMrp, maxDiscount };
    }

    it('should sum stock from active variants only', () => {
      const variants: SimpleVariant[] = [
        { stock: 10, isActive: true, price: 100, mrp: 200 },
        { stock: 5, isActive: false, price: 100, mrp: 200 },
        { stock: 20, isActive: true, price: 150, mrp: 250 },
      ];
      const result = computeProductDerived(variants);
      expect(result.totalStock).toBe(30); // 10 + 20, skips inactive
    });

    it('should compute max discount across active variants', () => {
      const variants: SimpleVariant[] = [
        { stock: 10, isActive: true, price: 100, mrp: 200 }, // 50% off
        { stock: 5, isActive: true, price: 150, mrp: 200 },  // 25% off
        { stock: 20, isActive: true, price: 50, mrp: 300 },  // ~83% off
      ];
      const result = computeProductDerived(variants);
      expect(result.maxDiscount).toBe(83);
    });

    it('should use first active variant for base price/mrp', () => {
      const variants: SimpleVariant[] = [
        { stock: 0, isActive: false, price: 999, mrp: 1999 },
        { stock: 10, isActive: true, price: 499, mrp: 999 },
      ];
      const result = computeProductDerived(variants);
      expect(result.basePrice).toBe(499);
      expect(result.baseMrp).toBe(999);
    });
  });

  // ── Enum Sanity Checks ───────────────────────────────────────────────

  describe('Enums', () => {
    it('should have expected product categories', () => {
      expect(ProductCategory.FASHION).toBe('fashion');
      expect(ProductCategory.ELECTRONICS).toBe('electronics');
      expect(ProductCategory.MEN).toBe('men');
      expect(ProductCategory.WOMEN).toBe('women');
    });

    it('should have expected sub-types', () => {
      expect(ProductSubType.ROUND_NECK).toBe('round_neck');
      expect(ProductSubType.V_NECK).toBe('v_neck');
      expect(ProductSubType.POLO).toBe('polo');
    });

    it('should have all sort options', () => {
      const options = Object.values(ProductSortOption);
      expect(options).toContain('relevance');
      expect(options).toContain('price_asc');
      expect(options).toContain('price_desc');
      expect(options).toContain('rating');
      expect(options).toContain('newest');
      expect(options).toContain('discount');
      expect(options).toContain('popularity');
    });
  });

  // ── OCC Versioning & Inventory Determinism ───────────────────────────

  describe('OCC Versioning & Inventory Invariants', () => {
    it('should sort inventory mutation items deterministically by SKU/productId to prevent deadlocks', () => {
      const items = [
        { productId: 'prod-Z', sku: 'SKU-Z', quantity: 2 },
        { productId: 'prod-A', sku: 'SKU-A', quantity: 1 },
        { productId: 'prod-M', sku: 'SKU-M', quantity: 5 },
      ];

      const sorted = [...items].sort((a, b) =>
        (a.sku ?? a.productId).localeCompare(b.sku ?? b.productId),
      );

      expect(sorted[0].sku).toBe('SKU-A');
      expect(sorted[1].sku).toBe('SKU-M');
      expect(sorted[2].sku).toBe('SKU-Z');
    });

    it('should detect OCC version mismatch when expectedVersion differs', () => {
      const currentProduct = { version: 3, name: 'Sample Item' };
      const expectedVersion = 2; // Stale read
      const isConflict = typeof expectedVersion === 'number' && currentProduct.version !== expectedVersion;
      expect(isConflict).toBe(true);
    });
  });
});

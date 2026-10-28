import mongoose from 'mongoose';
import { ITaxonomyNode, IHSNLookupResult, ITaxonomySearchMatch } from '@repo/shared-types';
import { TaxonomyModel } from './taxonomy.model.js';
import { resolveHSNAndGST } from './hsn.service.js';
import staticTaxonomies from './taxonomies.data.json' assert { type: 'json' };

const fallbackTaxonomies: ITaxonomyNode[] = staticTaxonomies as ITaxonomyNode[];

/**
 * Service for querying category hierarchies, dynamic attribute schemas, and HSN codes.
 * Backed by MongoDB `catalog_taxonomies` with instant in-memory fallback.
 */
export class TaxonomyService {
  private isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  /**
   * Get all master categories with summary counts
   */
  async getCategories(): Promise<Array<{ name: string; subcategoryCount: number; productTypeCount: number }>> {
    if (this.isConnected()) {
      try {
        const records = await TaxonomyModel.find({}, 'category subcategory productType').lean().exec();
        if (records && records.length > 0) {
          return this.aggregateCategories(records);
        }
      } catch {
        // Fallback to static bundle
      }
    }
    return this.aggregateCategories(fallbackTaxonomies);
  }

  /**
   * Get all subcategories for a given master category
   */
  async getSubcategories(category: string): Promise<Array<{ name: string; productTypeCount: number }>> {
    const catLower = category.trim().toLowerCase();
    if (this.isConnected()) {
      try {
        const records = await TaxonomyModel.find(
          { category: { $regex: new RegExp(`^${category.trim()}$`, 'i') } },
          'subcategory productType',
        ).lean().exec();

        if (records && records.length > 0) {
          return this.aggregateSubcategories(records);
        }
      } catch {
        // Fallback
      }
    }

    const filtered = fallbackTaxonomies.filter((t) => t.category.toLowerCase() === catLower);
    return this.aggregateSubcategories(filtered);
  }

  /**
   * Get all product types (e.g. Smartphones, T-Shirts) under category + subcategory
   */
  async getProductTypes(category: string, subcategory: string): Promise<string[]> {
    const catLower = category.trim().toLowerCase();
    const subLower = subcategory.trim().toLowerCase();

    if (this.isConnected()) {
      try {
        const records = await TaxonomyModel.find(
          {
            category: { $regex: new RegExp(`^${category.trim()}$`, 'i') },
            subcategory: { $regex: new RegExp(`^${subcategory.trim()}$`, 'i') },
          },
          'productType',
        ).lean().exec();

        if (records && records.length > 0) {
          return Array.from(new Set(records.map((r) => r.productType))).sort();
        }
      } catch {
        // Fallback
      }
    }

    const filtered = fallbackTaxonomies.filter(
      (t) => t.category.toLowerCase() === catLower && t.subcategory.toLowerCase() === subLower,
    );
    return Array.from(new Set(filtered.map((t) => t.productType))).sort();
  }

  /**
   * Retrieve dynamic attribute schema for a specific product type
   */
  async getAttributes(productType: string, category?: string): Promise<ITaxonomyNode | null> {
    const query: Record<string, unknown> = {
      productType: { $regex: new RegExp(`^${productType.trim()}$`, 'i') },
    };
    if (category) {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
    }

    if (this.isConnected()) {
      try {
        const doc = await TaxonomyModel.findOne(query).lean().exec();
        if (doc) {
          return doc as unknown as ITaxonomyNode;
        }
      } catch {
        // Fallback
      }
    }

    const ptLower = productType.trim().toLowerCase();
    const match = fallbackTaxonomies.find(
      (t) =>
        t.productType.toLowerCase() === ptLower &&
        (!category || t.category.toLowerCase() === category.trim().toLowerCase()),
    );

    if (match) {
      const hsn = resolveHSNAndGST(match.category, match.subcategory, match.productType);
      return {
        ...match,
        hsnCode: match.hsnCode || hsn.hsnCode,
        gstRate: match.gstRate ?? hsn.gstRate,
      };
    }

    return null;
  }

  /**
   * Look up statutory HSN code and GST slab
   */
  lookupHSN(category: string, subcategory: string = '', productType: string = ''): IHSNLookupResult {
    return resolveHSNAndGST(category, subcategory, productType);
  }

  /**
   * Fuzzy / search query across all 357 product types for quick-select in wizard
   */
  async searchTaxonomy(term: string, limit = 15): Promise<ITaxonomySearchMatch[]> {
    const q = term.trim().toLowerCase();
    if (!q) return [];

    const matches: ITaxonomySearchMatch[] = [];

    for (const t of fallbackTaxonomies) {
      const pLower = t.productType.toLowerCase();
      const sLower = t.subcategory.toLowerCase();
      const cLower = t.category.toLowerCase();

      if (pLower.includes(q) || sLower.includes(q) || cLower.includes(q)) {
        const hsn = resolveHSNAndGST(t.category, t.subcategory, t.productType);
        matches.push({
          category: t.category,
          subcategory: t.subcategory,
          productType: t.productType,
          attributeCount: t.attributes?.length ?? 0,
          hsnCode: t.hsnCode || hsn.hsnCode,
          gstRate: t.gstRate ?? hsn.gstRate,
        });
        if (matches.length >= limit) break;
      }
    }

    return matches;
  }

  // ── Internal Aggregators ─────────────────────────────────────────────

  private aggregateCategories(
    items: Array<{ category: string; subcategory?: string; productType?: string }>,
  ): Array<{ name: string; subcategoryCount: number; productTypeCount: number }> {
    const map = new Map<string, { subs: Set<string>; prods: Set<string> }>();

    for (const item of items) {
      const cat = item.category;
      if (!cat) continue;
      if (!map.has(cat)) {
        map.set(cat, { subs: new Set(), prods: new Set() });
      }
      const entry = map.get(cat)!;
      if (item.subcategory) entry.subs.add(item.subcategory);
      if (item.productType) entry.prods.add(item.productType);
    }

    return Array.from(map.entries())
      .map(([name, counts]) => ({
        name,
        subcategoryCount: counts.subs.size,
        productTypeCount: counts.prods.size,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private aggregateSubcategories(
    items: Array<{ subcategory?: string; productType?: string }>,
  ): Array<{ name: string; productTypeCount: number }> {
    const map = new Map<string, Set<string>>();

    for (const item of items) {
      const sub = item.subcategory;
      if (!sub) continue;
      if (!map.has(sub)) map.set(sub, new Set());
      if (item.productType) map.get(sub)!.add(item.productType);
    }

    return Array.from(map.entries())
      .map(([name, prods]) => ({
        name,
        productTypeCount: prods.size,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}

export const taxonomyService = new TaxonomyService();

import { describe, it, expect } from 'vitest';
import { taxonomyService } from './taxonomy.service.js';
import { resolveHSNAndGST } from './hsn.service.js';

describe('Master Taxonomy & Dynamic Attribute Engine — Unit Tests', () => {
  describe('Master Taxonomy Categories & Hierarchies', () => {
    it('should return all 17 master verticals with non-zero subcategory counts', async () => {
      const categories = await taxonomyService.getCategories();
      expect(categories.length).toBeGreaterThanOrEqual(17);

      const categoryNames = categories.map((c) => c.name);
      expect(categoryNames).toContain('Electronics');
      expect(categoryNames).toContain("Men's");
      expect(categoryNames).toContain("Women's");
      expect(categoryNames).toContain('Food Essentials');
      expect(categoryNames).toContain('Books');

      const electronics = categories.find((c) => c.name === 'Electronics');
      expect(electronics).toBeDefined();
      expect(electronics!.subcategoryCount).toBeGreaterThan(0);
      expect(electronics!.productTypeCount).toBeGreaterThan(0);
    });

    it('should return subcategories for a given category', async () => {
      const subcategories = await taxonomyService.getSubcategories('Electronics');
      expect(subcategories.length).toBeGreaterThan(0);

      const subNames = subcategories.map((s) => s.name);
      expect(subNames).toContain('Mobiles');
      expect(subNames).toContain('Computer Accessories');
    });

    it('should return product types under category and subcategory', async () => {
      const productTypes = await taxonomyService.getProductTypes('Electronics', 'Mobiles');
      expect(productTypes.length).toBeGreaterThan(0);
      expect(productTypes).toContain('Smartphones');
    });
  });

  describe('Dynamic Schema-Driven Attributes', () => {
    it('should return rich dynamic attributes for Smartphones', async () => {
      const schema = await taxonomyService.getAttributes('Smartphones', 'Electronics');
      expect(schema).toBeDefined();
      expect(schema!.productType).toBe('Smartphones');
      expect(schema!.attributes.length).toBeGreaterThanOrEqual(10);

      const attrNames = schema!.attributes.map((a) => a.name);
      expect(attrNames).toContain('Brand');
      expect(attrNames).toContain('RAM');
      expect(attrNames).toContain('Network Type');

      const ramAttr = schema!.attributes.find((a) => a.name === 'RAM');
      expect(ramAttr).toBeDefined();
      expect(ramAttr!.values).toContain('8 GB');
    });

    it('should return apparel attributes for T-Shirts', async () => {
      const schema = await taxonomyService.getAttributes('T-Shirts', "Men's");
      expect(schema).toBeDefined();
      expect(schema!.attributes.length).toBeGreaterThan(0);

      const attrNames = schema!.attributes.map((a) => a.name);
      expect(attrNames).toContain('Fabric');
      expect(attrNames).toContain('Fit');
    });
  });

  describe('Intelligent Statutory Indian HSN & GST Lookup', () => {
    it('should resolve Smartphones to HSN 8517 and 18% GST', () => {
      const res = resolveHSNAndGST('Electronics', 'Mobiles', 'Smartphones');
      expect(res.hsnCode).toBe('8517');
      expect(res.gstRate).toBe(18);
    });

    it('should resolve Laptops to HSN 8471 and 18% GST', () => {
      const res = resolveHSNAndGST('Electronics', 'Laptops', 'Laptops');
      expect(res.hsnCode).toBe('8471');
      expect(res.gstRate).toBe(18);
    });

    it('should resolve T-Shirts to HSN 6109 and 5% GST', () => {
      const res = resolveHSNAndGST("Men's", 'Top Wear', 'T-Shirts');
      expect(res.hsnCode).toBe('6109');
      expect(res.gstRate).toBe(5);
    });

    it('should resolve Footwear to HSN 6403 and 12% GST', () => {
      const res = resolveHSNAndGST("Men's", 'Footwear', 'Casual Shoes');
      expect(res.hsnCode).toBe('6403');
      expect(res.gstRate).toBe(12);
    });

    it('should resolve Books to HSN 4901 and 0% GST (Exempt)', () => {
      const res = resolveHSNAndGST('Books', 'Literature', 'Fiction Novels');
      expect(res.hsnCode).toBe('4901');
      expect(res.gstRate).toBe(0);
    });

    it('should resolve Medicines to HSN 3004 and 12% GST', () => {
      const res = resolveHSNAndGST('Medical Supplies', 'Medicines', 'Paracetamol Tablets');
      expect(res.hsnCode).toBe('3004');
      expect(res.gstRate).toBe(12);
    });
  });

  describe('Taxonomy Search & Quick Auto-Complete', () => {
    it('should find relevant product types matching a search query', async () => {
      const matches = await taxonomyService.searchTaxonomy('smart');
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.some((m) => m.productType === 'Smartphones')).toBe(true);

      const phone = matches.find((m) => m.productType === 'Smartphones');
      expect(phone!.hsnCode).toBe('8517');
      expect(phone!.gstRate).toBe(18);
    });
  });
});

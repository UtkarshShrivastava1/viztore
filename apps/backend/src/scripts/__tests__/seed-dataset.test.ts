import { describe, it, expect } from 'vitest';
import {
  FASHION_PRODUCTS,
  ELECTRONICS_PRODUCTS,
  GROCERY_ORGANICS_PRODUCTS,
  PHARMACY_WELLNESS_PRODUCTS,
  PROVISIONS_FMCG_PRODUCTS,
  PRODUCE_PRODUCTS,
  PATEL_ELECTRONICS_PRODUCTS,
} from '../seed-dataset.js';
import { SEED_DATA } from '../seed-merchants.js';
import { StoreApprovalStatus } from '@repo/shared-types';

describe('Seed Dataset Quality & POS Barcode Audit (Task D-03)', () => {
  const allProductSuites = [
    ...FASHION_PRODUCTS,
    ...ELECTRONICS_PRODUCTS,
    ...GROCERY_ORGANICS_PRODUCTS,
    ...PHARMACY_WELLNESS_PRODUCTS,
    ...PROVISIONS_FMCG_PRODUCTS,
    ...PRODUCE_PRODUCTS,
    ...PATEL_ELECTRONICS_PRODUCTS,
  ];

  it('contains exactly 68 realistic retail products across all categories', () => {
    expect(allProductSuites.length).toBe(68);
    expect(FASHION_PRODUCTS.length).toBe(12);
    expect(ELECTRONICS_PRODUCTS.length).toBe(12);
    expect(GROCERY_ORGANICS_PRODUCTS.length).toBe(12);
    expect(PHARMACY_WELLNESS_PRODUCTS.length).toBe(12);
    expect(PROVISIONS_FMCG_PRODUCTS.length).toBe(12);
    expect(PRODUCE_PRODUCTS.length).toBe(4);
    expect(PATEL_ELECTRONICS_PRODUCTS.length).toBe(4);
  });

  it('guarantees unique EAN-13 barcodes for all 68 products without collision', () => {
    const barcodes: string[] = [];

    for (const prod of allProductSuites) {
      const barcodeAttr = prod.attributes?.find((a) => a.key === 'Barcode');
      expect(barcodeAttr).toBeDefined();
      expect(barcodeAttr?.value).toMatch(/^890\d{10}$/); // Standard Indian EAN-13 prefix 890
      barcodes.push(barcodeAttr!.value);
    }

    const uniqueSet = new Set(barcodes);
    expect(uniqueSet.size).toBe(allProductSuites.length);
  });

  it('assigns valid Indian GST HSN codes to every product', () => {
    for (const prod of allProductSuites) {
      const hsnAttr = prod.attributes?.find((a) => a.key === 'HSN');
      expect(hsnAttr).toBeDefined();
      expect(hsnAttr?.value).toMatch(/^\d{4,8}$/);
    }
  });

  it('assigns valid statutory GST rates (0%, 5%, 12%, 18%) to every product', () => {
    const validRates = ['0%', '5%', '12%', '18%', '28%'];

    for (const prod of allProductSuites) {
      const gstAttr = prod.attributes?.find((a) => a.key === 'GST_Rate');
      expect(gstAttr).toBeDefined();
      expect(validRates).toContain(gstAttr?.value);
    }
  });

  it('ensures each product has at least one active variant with valid SKU, price, and stock', () => {
    const skus = new Set<string>();

    for (const prod of allProductSuites) {
      expect(prod.variants.length).toBeGreaterThanOrEqual(1);
      for (const variant of prod.variants) {
        expect(variant.sku).toBeDefined();
        expect(variant.sku.length).toBeGreaterThan(3);
        expect(variant.price).toBeGreaterThan(0);
        expect(variant.stock).toBeGreaterThan(0);
        expect(skus.has(variant.sku)).toBe(false); // SKUs should be distinct
        skus.add(variant.sku);
      }
    }
  });

  it('verifies all 7 retail stores are fully defined with geocodes, GSTIN, and approved status', () => {
    expect(SEED_DATA.length).toBe(7);

    for (const entry of SEED_DATA) {
      const store = entry.store;
      expect(store.name).toBeTruthy();
      expect(store.approvalStatus).toBe(StoreApprovalStatus.APPROVED);
      expect(store.isActive).toBe(true);

      // 2dsphere location validation [longitude, latitude]
      expect(store.location.type).toBe('Point');
      expect(store.location.coordinates[0]).toBeGreaterThan(80.0); // Bhilai/Durg longitude
      expect(store.location.coordinates[0]).toBeLessThan(83.0);
      expect(store.location.coordinates[1]).toBeGreaterThan(20.0); // Bhilai/Durg latitude
      expect(store.location.coordinates[1]).toBeLessThan(23.0);

      // Legal & Bank details
      expect(store.legalDetails?.gstin).toMatch(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/);
      expect(store.legalDetails?.pan).toMatch(/^[A-Z]{5}\d{4}[A-Z]{1}$/);
      expect(store.bankDetails?.accountNumber).toBeTruthy();
      expect(store.bankDetails?.ifscCode).toBeTruthy();

      // Operating hours
      expect(store.operatingHours.monday.isOpen).toBe(true);
      expect(store.operatingHours.friday.isOpen).toBe(true);
    }
  });
});

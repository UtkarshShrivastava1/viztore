import { storesApi } from './api.js';
import { useAuthStore } from '../stores/authStore.js';

export interface CustomTaxonomyState {
  categories: string[];
  subCategories: Record<string, string[]>;
  productTypes: Record<string, string[]>;
  brands: string[];
}

const DEFAULT_TAXONOMY: CustomTaxonomyState = {
  categories: [],
  subCategories: {},
  productTypes: {},
  brands: [],
};

function getStorageKey(storeId?: string): string {
  const activeStoreId =
    storeId ||
    useAuthStore.getState().currentStore?._id ||
    useAuthStore.getState().currentStore?.id ||
    'default';
  return `merchant_custom_taxonomy_${activeStoreId}`;
}

/**
 * Retrieve saved custom categories, subcategories, product types, and brands for the active merchant store.
 * Combines localStorage with backend store document metadata if available.
 */
export function getCustomTaxonomy(storeId?: string): CustomTaxonomyState {
  const key = getStorageKey(storeId);
  let localData: CustomTaxonomyState = { ...DEFAULT_TAXONOMY };

  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      localData = {
        categories: Array.isArray(parsed.categories) ? parsed.categories : [],
        subCategories: parsed.subCategories && typeof parsed.subCategories === 'object' ? parsed.subCategories : {},
        productTypes: parsed.productTypes && typeof parsed.productTypes === 'object' ? parsed.productTypes : {},
        brands: Array.isArray(parsed.brands) ? parsed.brands : [],
      };
    }
  } catch (err) {
    console.warn('[TaxonomyStorage] Could not parse local taxonomy cache:', err);
  }

  // Also read from current store document if attached
  const currentStore = useAuthStore.getState().currentStore;
  if (currentStore && currentStore.customTaxonomy) {
    const backendTax = currentStore.customTaxonomy;
    if (Array.isArray(backendTax.categories)) {
      localData.categories = Array.from(new Set([...localData.categories, ...backendTax.categories]));
    }
    if (Array.isArray(backendTax.brands)) {
      localData.brands = Array.from(new Set([...localData.brands, ...backendTax.brands]));
    }
    if (backendTax.subCategories && typeof backendTax.subCategories === 'object') {
      Object.entries(backendTax.subCategories).forEach(([cat, subs]) => {
        if (Array.isArray(subs)) {
          localData.subCategories[cat] = Array.from(
            new Set([...(localData.subCategories[cat] || []), ...(subs as string[])]),
          );
        }
      });
    }
    if (backendTax.productTypes && typeof backendTax.productTypes === 'object') {
      Object.entries(backendTax.productTypes).forEach(([sub, pts]) => {
        if (Array.isArray(pts)) {
          localData.productTypes[sub] = Array.from(
            new Set([...(localData.productTypes[sub] || []), ...(pts as string[])]),
          );
        }
      });
    }
  }

  return localData;
}

/**
 * Persist custom categories and brands to localStorage and sync with store document in backend.
 */
export function saveCustomTaxonomy(
  storeId: string | undefined,
  updates: Partial<CustomTaxonomyState>,
): CustomTaxonomyState {
  const current = getCustomTaxonomy(storeId);
  const key = getStorageKey(storeId);

  const merged: CustomTaxonomyState = {
    categories: Array.from(
      new Set([...current.categories, ...(updates.categories || [])]),
    ).filter(Boolean),
    subCategories: { ...current.subCategories },
    productTypes: { ...current.productTypes },
    brands: Array.from(
      new Set([...current.brands, ...(updates.brands || [])]),
    ).filter(Boolean),
  };

  if (updates.subCategories) {
    Object.entries(updates.subCategories).forEach(([cat, subs]) => {
      merged.subCategories[cat] = Array.from(
        new Set([...(merged.subCategories[cat] || []), ...subs]),
      ).filter(Boolean);
    });
  }

  if (updates.productTypes) {
    Object.entries(updates.productTypes).forEach(([sub, pts]) => {
      merged.productTypes[sub] = Array.from(
        new Set([...(merged.productTypes[sub] || []), ...pts]),
      ).filter(Boolean);
    });
  }

  try {
    localStorage.setItem(key, JSON.stringify(merged));
  } catch (err) {
    console.warn('[TaxonomyStorage] Failed to write taxonomy to localStorage:', err);
  }

  // Update in-memory auth store
  const currentStore = useAuthStore.getState().currentStore;
  if (currentStore) {
    useAuthStore.getState().setCurrentStore({
      ...currentStore,
      customTaxonomy: merged,
    });
  }

  // Background sync to backend store document
  const activeStoreId =
    storeId ||
    currentStore?._id ||
    currentStore?.id;

  if (activeStoreId && /^[0-9a-fA-F]{24}$/.test(activeStoreId)) {
    storesApi
      .updateStoreSettings(activeStoreId, { customTaxonomy: merged })
      .catch((err) => {
        console.warn('[TaxonomyStorage] Background store document sync failed (cached locally):', err?.message || err);
      });
  }

  return merged;
}

/**
 * Helper to record a custom category, subcategory, and product type.
 */
export function recordCustomCategory(
  storeId: string | undefined,
  category: string,
  subCategory?: string,
  productType?: string,
): CustomTaxonomyState {
  const trimmedCat = category?.trim();
  if (!trimmedCat) return getCustomTaxonomy(storeId);

  const updates: Partial<CustomTaxonomyState> = {
    categories: [trimmedCat],
  };

  const trimmedSub = subCategory?.trim();
  if (trimmedSub && trimmedSub !== 'General') {
    updates.subCategories = {
      [trimmedCat]: [trimmedSub],
    };
  }

  const trimmedPt = productType?.trim();
  if (trimmedSub && trimmedPt && trimmedPt !== 'Standard') {
    updates.productTypes = {
      [trimmedSub]: [trimmedPt],
    };
  }

  return saveCustomTaxonomy(storeId, updates);
}

/**
 * Helper to record a custom brand.
 */
export function recordCustomBrand(
  storeId: string | undefined,
  brand: string,
): CustomTaxonomyState {
  const trimmed = brand?.trim();
  if (!trimmed || trimmed === 'Generic / Unbranded') {
    return getCustomTaxonomy(storeId);
  }

  return saveCustomTaxonomy(storeId, {
    brands: [trimmed],
  });
}

/**
 * Mine any existing custom categories and brands from products already present in merchant's catalog.
 */
export function mineTaxonomyFromProducts(
  products: Array<{ category?: string; subCategory?: string; productType?: string; brand?: string }>,
): CustomTaxonomyState {
  const extracted: CustomTaxonomyState = {
    categories: [],
    subCategories: {},
    productTypes: {},
    brands: [],
  };

  products.forEach((p) => {
    if (p.category && p.category.trim()) {
      const cat = p.category.trim();
      extracted.categories.push(cat);
      if (p.subCategory && p.subCategory.trim()) {
        const sub = p.subCategory.trim();
        if (!extracted.subCategories[cat]) extracted.subCategories[cat] = [];
        extracted.subCategories[cat].push(sub);

        if (p.productType && p.productType.trim()) {
          const pt = p.productType.trim();
          if (!extracted.productTypes[sub]) extracted.productTypes[sub] = [];
          extracted.productTypes[sub].push(pt);
        }
      }
    }
    if (p.brand && p.brand.trim() && p.brand !== 'Generic / Unbranded') {
      extracted.brands.push(p.brand.trim());
    }
  });

  extracted.categories = Array.from(new Set(extracted.categories));
  extracted.brands = Array.from(new Set(extracted.brands));
  Object.keys(extracted.subCategories).forEach((k) => {
    extracted.subCategories[k] = Array.from(new Set(extracted.subCategories[k]));
  });
  Object.keys(extracted.productTypes).forEach((k) => {
    extracted.productTypes[k] = Array.from(new Set(extracted.productTypes[k]));
  });

  return extracted;
}

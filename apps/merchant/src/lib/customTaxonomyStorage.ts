import { storesApi } from './api.js';
import { useAuthStore } from '../stores/authStore.js';

export interface CustomSpecDefinition {
  name: string;
  values?: string[];
  isRequired?: boolean;
  isCustomSpec?: boolean;
}

export interface CustomTaxonomyState {
  categories: string[];
  subCategories: Record<string, string[]>;
  productTypes: Record<string, string[]>;
  brands: string[];
  customSpecs?: Record<string, CustomSpecDefinition[]>;
  customAttributeValues?: Record<string, Record<string, string[]>>;
}

export function normalizeCategoryName(raw?: string): string {
  const trimmed = raw?.trim() || '';
  if (!trimmed) return '';
  if (trimmed === 'Men' || trimmed === "Men's") return "Men's Fashion";
  if (trimmed === 'Women' || trimmed === "Women's") return "Women's Fashion";
  return trimmed;
}

export function getProductTypeKey(category?: string, subCategory?: string, productType?: string): string {
  const c = (category || '').trim().toLowerCase();
  const s = (subCategory || '').trim().toLowerCase();
  const p = (productType || '').trim().toLowerCase();
  return `${c}::${s}::${p}`;
}

function getStorageKey(storeId?: string): string {
  const activeStoreId =
    storeId ||
    useAuthStore.getState().currentStore?._id ||
    useAuthStore.getState().currentStore?.id ||
    'default';
  return `merchant_custom_taxonomy_${activeStoreId}`;
}

/**
 * Retrieve saved custom categories, subcategories, product types, brands,
 * custom specifications, and custom attribute dropdown values for the active merchant store.
 * Combines localStorage with backend store document metadata if available.
 */
export function getCustomTaxonomy(storeId?: string): CustomTaxonomyState {
  const key = getStorageKey(storeId);
  const localData: CustomTaxonomyState = {
    categories: [],
    subCategories: {},
    productTypes: {},
    brands: [],
    customSpecs: {},
    customAttributeValues: {},
  };

  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      localData.categories = (Array.isArray(parsed.categories) ? parsed.categories : [])
        .map(normalizeCategoryName)
        .filter(Boolean);
      localData.subCategories = parsed.subCategories && typeof parsed.subCategories === 'object' ? parsed.subCategories : {};
      localData.productTypes = parsed.productTypes && typeof parsed.productTypes === 'object' ? parsed.productTypes : {};
      localData.brands = Array.isArray(parsed.brands) ? parsed.brands : [];
      localData.customSpecs = parsed.customSpecs && typeof parsed.customSpecs === 'object' ? parsed.customSpecs : {};
      localData.customAttributeValues =
        parsed.customAttributeValues && typeof parsed.customAttributeValues === 'object'
          ? parsed.customAttributeValues
          : {};
    }
  } catch (err) {
    console.warn('[TaxonomyStorage] Could not parse local taxonomy cache:', err);
  }

  // Also read from current store document if attached
  const currentStore = useAuthStore.getState().currentStore;
  if (currentStore && currentStore.customTaxonomy) {
    const backendTax = currentStore.customTaxonomy as any;
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
    if (backendTax.customSpecs && typeof backendTax.customSpecs === 'object') {
      const localSpecs = localData.customSpecs || {};
      Object.entries(backendTax.customSpecs).forEach(([ptKey, specs]) => {
        if (Array.isArray(specs)) {
          const existing = localSpecs[ptKey] || [];
          const map = new Map(existing.map((s) => [s.name.toLowerCase().trim(), s]));
          specs.forEach((s: any) => {
            if (s && s.name) map.set(s.name.toLowerCase().trim(), s);
          });
          localSpecs[ptKey] = Array.from(map.values());
        }
      });
      localData.customSpecs = localSpecs;
    }
    if (backendTax.customAttributeValues && typeof backendTax.customAttributeValues === 'object') {
      const localAttrVals = localData.customAttributeValues || {};
      Object.entries(backendTax.customAttributeValues).forEach(([ptKey, attrMap]: [string, any]) => {
        if (attrMap && typeof attrMap === 'object') {
          if (!localAttrVals[ptKey]) localAttrVals[ptKey] = {};
          const currentPtMap = localAttrVals[ptKey];
          Object.entries(attrMap).forEach(([attrName, vals]) => {
            if (Array.isArray(vals)) {
              currentPtMap[attrName] = Array.from(
                new Set([...(currentPtMap[attrName] || []), ...(vals as string[])]),
              );
            }
          });
        }
      });
      localData.customAttributeValues = localAttrVals;
    }
  }

  return localData;
}

/**
 * Persist custom categories, specs, and options to localStorage and sync with store document in backend.
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
    customSpecs: { ...(current.customSpecs || {}) },
    customAttributeValues: { ...(current.customAttributeValues || {}) },
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

  if (updates.customSpecs) {
    const targetSpecs = merged.customSpecs || {};
    Object.entries(updates.customSpecs).forEach(([ptKey, specs]) => {
      const existing = targetSpecs[ptKey] || [];
      const map = new Map(existing.map((s) => [s.name.toLowerCase().trim(), s]));
      specs.forEach((s) => {
        if (s && s.name) map.set(s.name.toLowerCase().trim(), s);
      });
      targetSpecs[ptKey] = Array.from(map.values());
    });
    merged.customSpecs = targetSpecs;
  }

  if (updates.customAttributeValues) {
    const targetAttrVals = merged.customAttributeValues || {};
    Object.entries(updates.customAttributeValues).forEach(([ptKey, attrMap]) => {
      if (!targetAttrVals[ptKey]) targetAttrVals[ptKey] = {};
      const currentPtMap = targetAttrVals[ptKey];
      Object.entries(attrMap).forEach(([attrName, vals]) => {
        currentPtMap[attrName] = Array.from(
          new Set([...(currentPtMap[attrName] || []), ...vals]),
        ).filter(Boolean);
      });
    });
    merged.customAttributeValues = targetAttrVals;
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
  const trimmedCat = normalizeCategoryName(category?.trim());
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
 * Retrieve custom specifications defined for this product type in this merchant's store.
 */
export function getTenantCustomSpecs(
  storeId?: string,
  category?: string,
  subCategory?: string,
  productType?: string,
): CustomSpecDefinition[] {
  const tax = getCustomTaxonomy(storeId);
  const ptKey = getProductTypeKey(category, subCategory, productType);
  return tax.customSpecs?.[ptKey] || [];
}

/**
 * Record a new custom specification definition for a specific product type in this store.
 */
export function recordTenantCustomSpec(
  storeId: string | undefined,
  category: string,
  subCategory: string,
  productType: string,
  spec: CustomSpecDefinition,
): CustomTaxonomyState {
  const trimmedName = spec.name?.trim();
  if (!trimmedName) return getCustomTaxonomy(storeId);

  const ptKey = getProductTypeKey(category, subCategory, productType);
  const currentTax = getCustomTaxonomy(storeId);
  const existingSpecs = currentTax.customSpecs?.[ptKey] || [];

  const updatedSpecs = [
    ...existingSpecs.filter((s) => s.name.toLowerCase().trim() !== trimmedName.toLowerCase()),
    {
      name: trimmedName,
      values: spec.values || [],
      isRequired: Boolean(spec.isRequired),
      isCustomSpec: true,
    },
  ];

  return saveCustomTaxonomy(storeId, {
    customSpecs: {
      [ptKey]: updatedSpecs,
    },
  });
}

/**
 * Remove a custom specification definition for a specific product type in this store.
 */
export function removeTenantCustomSpec(
  storeId: string | undefined,
  category: string,
  subCategory: string,
  productType: string,
  specName: string,
): CustomTaxonomyState {
  const ptKey = getProductTypeKey(category, subCategory, productType);
  const key = getStorageKey(storeId);
  const currentTax = getCustomTaxonomy(storeId);
  const existingSpecs = currentTax.customSpecs?.[ptKey] || [];

  const updatedSpecs = existingSpecs.filter(
    (s) => s.name.toLowerCase().trim() !== specName.toLowerCase().trim(),
  );

  if (!currentTax.customSpecs) currentTax.customSpecs = {};
  currentTax.customSpecs[ptKey] = updatedSpecs;
  try {
    localStorage.setItem(key, JSON.stringify(currentTax));
  } catch (e) {
    console.warn(e);
  }

  // Update backend and auth store
  return saveCustomTaxonomy(storeId, {
    customSpecs: { [ptKey]: updatedSpecs },
  });
}

/**
 * Retrieve custom option values for a specific attribute on a product type in this store.
 */
export function getTenantCustomAttributeValues(
  storeId?: string,
  category?: string,
  subCategory?: string,
  productType?: string,
  attributeName?: string,
): string[] {
  if (!attributeName) return [];
  const tax = getCustomTaxonomy(storeId);
  const ptKey = getProductTypeKey(category, subCategory, productType);
  const attrKey = attributeName.trim().toLowerCase();
  return tax.customAttributeValues?.[ptKey]?.[attrKey] || [];
}

/**
 * Record a custom option value for an attribute dropdown in this store.
 * e.g. for SIM Support on Smart Watches, add 'Dual SIM'.
 */
export function recordTenantCustomAttributeValue(
  storeId: string | undefined,
  category: string,
  subCategory: string,
  productType: string,
  attributeName: string,
  value: string,
): CustomTaxonomyState {
  const trimmedVal = value?.trim();
  const trimmedAttr = attributeName?.trim();
  if (!trimmedVal || !trimmedAttr) return getCustomTaxonomy(storeId);

  const ptKey = getProductTypeKey(category, subCategory, productType);
  const attrKey = trimmedAttr.toLowerCase();
  const currentTax = getCustomTaxonomy(storeId);
  const currentVals = currentTax.customAttributeValues?.[ptKey]?.[attrKey] || [];

  const updatedVals = Array.from(new Set([...currentVals, trimmedVal]));

  return saveCustomTaxonomy(storeId, {
    customAttributeValues: {
      [ptKey]: {
        [attrKey]: updatedVals,
      },
    },
  });
}

/**
 * Remove a custom option value for an attribute dropdown in this store.
 */
export function removeTenantCustomAttributeValue(
  storeId: string | undefined,
  category: string,
  subCategory: string,
  productType: string,
  attributeName: string,
  value: string,
): CustomTaxonomyState {
  const ptKey = getProductTypeKey(category, subCategory, productType);
  const attrKey = attributeName?.trim().toLowerCase();
  const currentTax = getCustomTaxonomy(storeId);
  const currentVals = currentTax.customAttributeValues?.[ptKey]?.[attrKey] || [];

  const updatedVals = currentVals.filter((v) => v.toLowerCase().trim() !== value.toLowerCase().trim());

  return saveCustomTaxonomy(storeId, {
    customAttributeValues: {
      [ptKey]: {
        [attrKey]: updatedVals,
      },
    },
  });
}

/**
 * Mine any existing custom categories and brands from products already present in merchant's catalog.
 */
export function mineTaxonomyFromProducts(
  products: Array<{ category?: string; subCategory?: string; productType?: string; brand?: string; attributes?: any }>,
): CustomTaxonomyState {
  const extracted: CustomTaxonomyState = {
    categories: [],
    subCategories: {},
    productTypes: {},
    brands: [],
    customSpecs: {},
    customAttributeValues: {},
  };

  products.forEach((p) => {
    if (p.category && p.category.trim()) {
      const cat = normalizeCategoryName(p.category.trim());
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

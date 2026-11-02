import masterTaxonomies from '../data/taxonomies.json';
import { ProductItem } from '../stores/catalogStore.js';

export interface TaxonomyAttribute {
  name: string;
  values: string[];
  isMultiSelect: boolean;
  isRequired: boolean;
}

export interface TaxonomyItem {
  category: string;
  subcategory: string;
  productType: string;
  hsnCode?: string;
  gstRate?: number;
  attributes: TaxonomyAttribute[];
}

const typedMasterTaxonomies = masterTaxonomies as unknown as TaxonomyItem[];

/**
 * Normalizes text for case- and punctuation-insensitive matching.
 */
function cleanStr(str?: string): string {
  return (str || '').toLowerCase().replace(/['"’\s\-_/]/g, '');
}

export function isFashionCategory(category?: string, subCategory?: string): boolean {
  const cat = cleanStr(category);
  const sub = cleanStr(subCategory);
  if (isFootwearCategory(category, subCategory)) return false;
  return (
    cat.includes('fashion') ||
    cat.includes('men') ||
    cat.includes('women') ||
    cat.includes('clothing') ||
    cat.includes('apparel') ||
    sub.includes('clothing') ||
    sub.includes('apparel') ||
    sub.includes('shirt') ||
    sub.includes('dress')
  );
}

export function isFootwearCategory(category?: string, subCategory?: string): boolean {
  const cat = cleanStr(category);
  const sub = cleanStr(subCategory);
  return (
    cat.includes('footwear') ||
    cat.includes('shoe') ||
    sub.includes('footwear') ||
    sub.includes('shoe') ||
    sub.includes('sneaker') ||
    sub.includes('sandal')
  );
}

export function isElectronicsCategory(category?: string, subCategory?: string): boolean {
  const cat = cleanStr(category);
  const sub = cleanStr(subCategory);
  return (
    cat.includes('elect') ||
    cat.includes('gadget') ||
    cat.includes('mobile') ||
    sub.includes('mobile') ||
    sub.includes('computer') ||
    sub.includes('audio') ||
    sub.includes('electronic')
  );
}

export function isGroceryCategory(category?: string, subCategory?: string): boolean {
  const cat = cleanStr(category);
  const sub = cleanStr(subCategory);
  return (
    cat.includes('food') ||
    cat.includes('groc') ||
    cat.includes('essential') ||
    sub.includes('food') ||
    sub.includes('groc') ||
    sub.includes('beverage') ||
    sub.includes('snack')
  );
}

/**
 * Find matching taxonomy schema from taxonomies.json.
 */
export function findTaxonomy(
  category?: string,
  subCategory?: string,
  productType?: string,
): TaxonomyItem | undefined {
  const normCat = cleanStr(category);
  const normSub = cleanStr(subCategory);
  const normPt = cleanStr(productType);

  // 1. Exact match on category + subcategory + productType
  if (normPt && normSub && normCat) {
    const match = typedMasterTaxonomies.find((t) => {
      const tCat = cleanStr(t.category);
      const tSub = cleanStr(t.subcategory);
      const tPt = cleanStr(t.productType);
      return (
        (tCat.includes(normCat) || normCat.includes(tCat)) &&
        (tSub.includes(normSub) || normSub.includes(tSub)) &&
        (tPt === normPt || tPt.includes(normPt) || normPt.includes(tPt))
      );
    });
    if (match) return match;
  }

  // 2. Match on subcategory + productType
  if (normPt && normSub) {
    const match = typedMasterTaxonomies.find((t) => {
      const tSub = cleanStr(t.subcategory);
      const tPt = cleanStr(t.productType);
      return (
        (tSub.includes(normSub) || normSub.includes(tSub)) &&
        (tPt === normPt || tPt.includes(normPt) || normPt.includes(tPt))
      );
    });
    if (match) return match;
  }

  // 3. Match on productType alone
  if (normPt) {
    const match = typedMasterTaxonomies.find((t) => {
      const tPt = cleanStr(t.productType);
      return tPt === normPt || tPt.includes(normPt) || normPt.includes(tPt);
    });
    if (match) return match;
  }

  // 4. Fallback to subcategory
  if (normSub) {
    const match = typedMasterTaxonomies.find((t) => {
      const tSub = cleanStr(t.subcategory);
      return tSub === normSub || tSub.includes(normSub) || normSub.includes(tSub);
    });
    if (match) return match;
  }

  // 5. Fallback to category
  if (normCat) {
    const match = typedMasterTaxonomies.find((t) => {
      const tCat = cleanStr(t.category);
      return tCat === normCat || tCat.includes(normCat) || normCat.includes(tCat);
    });
    if (match) return match;
  }

  return undefined;
}

/**
 * Preloads schema attributes based on parent category and product type.
 * Automatically cleans up obsolete fashion attributes when moving to non-fashion categories.
 */
export function getPreloadedAttributes(
  category?: string,
  subCategory?: string,
  productType?: string,
  currentAttributes: Record<string, string> = {},
): Record<string, string> {
  const isFashion = isFashionCategory(category, subCategory);
  const isFootwear = isFootwearCategory(category, subCategory);

  const result: Record<string, string> = {};

  // Preserve internal and generic attributes
  if (currentAttributes.hasVariants) {
    result.hasVariants = currentAttributes.hasVariants;
  }
  if (currentAttributes.shelfLocation) {
    result.shelfLocation = currentAttributes.shelfLocation;
  }

  const tax = findTaxonomy(category, subCategory, productType);

  if (tax && Array.isArray(tax.attributes)) {
    tax.attributes.forEach((attr) => {
      // Find if currentAttributes already has a value for this attribute (case-insensitive)
      const existingKey = Object.keys(currentAttributes).find(
        (k) => cleanStr(k) === cleanStr(attr.name),
      );
      if (existingKey && currentAttributes[existingKey]) {
        result[attr.name] = currentAttributes[existingKey];
      } else {
        // Pre-populate empty string placeholder so field is recognized
        result[attr.name] = '';
      }
    });
  }

  // Preserve color if present and valid
  if (currentAttributes.color && !result.Color && !result.color) {
    result.color = currentAttributes.color;
  }

  // Preserve size only if category is Fashion or Footwear
  if ((isFashion || isFootwear) && currentAttributes.size) {
    result.size = currentAttributes.size;
  }

  // If Fashion, allow fashion-specific keys
  if (isFashion) {
    ['fit', 'sleeve', 'neck', 'fabric'].forEach((k) => {
      if (currentAttributes[k]) {
        result[k] = currentAttributes[k];
      }
    });
  }

  return result;
}

/**
 * Extract 3-6 relevant attribute pairs for Preview & Review cards.
 * Never outputs hardcoded fake fashion attributes!
 */
export function getDisplayAttributes(
  product: Partial<ProductItem>,
): Array<{ label: string; value: string }> {
  const attrs = product.attributes || {};
  const entries: Array<{ label: string; value: string }> = [];

  const ignoredKeys = new Set([
    'hasvariants',
    'shelflocation',
    'price',
    'discount',
    'customerratings',
    'offers',
    'availability',
    'gstinvoiceavailable',
  ]);

  // Check each attribute key
  Object.entries(attrs).forEach(([key, val]) => {
    if (!val || typeof val !== 'string' || !val.trim()) return;
    const cleanKey = cleanStr(key);
    if (ignoredKeys.has(cleanKey)) return;

    // Format human-readable label
    let label = key;
    if (label.length <= 3) {
      label = label.toUpperCase(); // RAM, SIM, HSN
    } else {
      label = label.charAt(0).toUpperCase() + label.slice(1);
    }
    entries.push({ label, value: val.trim() });
  });

  return entries;
}

/**
 * Dynamic summary string for Barcode stickers.
 */
export function getBarcodeStickerSpecs(product: Partial<ProductItem>): {
  subtitle: string;
  brand: string;
} {
  const attrs = product.attributes || {};
  const brand = product.brand || 'Generic';
  const category = product.category || '';
  const subCategory = product.subCategory || '';

  const isElect = isElectronicsCategory(category, subCategory);
  const isGroc = isGroceryCategory(category, subCategory);
  const isFoot = isFootwearCategory(category, subCategory);

  const parts: string[] = [];

  if (isElect) {
    const storage = attrs['Internal Storage'] || attrs.storage || attrs.Storage;
    const ram = attrs.RAM || attrs.ram;
    const color = attrs.Color || attrs.color;
    if (storage) parts.push(storage);
    if (ram) parts.push(`RAM: ${ram}`);
    if (color) parts.push(color);
  } else if (isGroc) {
    const weight = attrs['Net Qty / Weight'] || attrs.weight || product.weight;
    const pack = attrs['Pack Size'] || attrs['Pack of'] || attrs.pack;
    if (weight) parts.push(weight.endsWith('g') || weight.endsWith('kg') ? weight : `${weight}g`);
    if (pack) parts.push(pack);
  } else if (isFoot) {
    const size = attrs.size || attrs.Size;
    const color = attrs.color || attrs.Color;
    if (size) parts.push(`Size: ${size}`);
    if (color) parts.push(`Color: ${color}`);
  } else {
    // Fashion or other
    const size = attrs.size || attrs.Size;
    const color = attrs.color || attrs.Color;
    if (size) parts.push(`Size: ${size}`);
    if (color) parts.push(`Color: ${color}`);
  }

  // Fallback to top 2 display attributes if parts is still empty
  if (parts.length === 0) {
    const display = getDisplayAttributes(product);
    display.slice(0, 2).forEach((d) => parts.push(`${d.label}: ${d.value}`));
  }

  parts.push(brand);

  return {
    subtitle: parts.join(' • '),
    brand,
  };
}


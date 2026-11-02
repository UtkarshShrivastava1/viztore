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
export function cleanStr(str?: string): string {
  return (str || '').toLowerCase().replace(/['"’\s\-_/]/g, '');
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
    sub.includes('sandal') ||
    sub.includes('boot') ||
    sub.includes('loafer') ||
    sub.includes('flipflop')
  );
}

export function isElectronicsCategory(category?: string, subCategory?: string): boolean {
  const cat = cleanStr(category);
  const sub = cleanStr(subCategory);
  return (
    cat.includes('elect') ||
    cat.includes('gadget') ||
    cat.includes('mobile') ||
    cat.includes('phone') ||
    sub.includes('mobile') ||
    sub.includes('phone') ||
    sub.includes('smartphone') ||
    sub.includes('computer') ||
    sub.includes('laptop') ||
    sub.includes('audio') ||
    sub.includes('electronic') ||
    sub.includes('tablet') ||
    sub.includes('television') ||
    sub.includes('camera') ||
    sub.includes('wearable')
  );
}

export function isGroceryCategory(category?: string, subCategory?: string): boolean {
  const cat = cleanStr(category);
  const sub = cleanStr(subCategory);
  return (
    cat.includes('food') ||
    cat.includes('groc') ||
    cat.includes('essential') ||
    cat.includes('beverage') ||
    sub.includes('food') ||
    sub.includes('groc') ||
    sub.includes('essential') ||
    sub.includes('beverage') ||
    sub.includes('snack') ||
    sub.includes('staple') ||
    sub.includes('grain') ||
    sub.includes('dairy') ||
    sub.includes('fruit') ||
    sub.includes('vegetable')
  );
}

export function isFashionCategory(category?: string, subCategory?: string): boolean {
  if (isFootwearCategory(category, subCategory)) return false;
  if (isElectronicsCategory(category, subCategory)) return false;
  if (isGroceryCategory(category, subCategory)) return false;

  const cat = cleanStr(category);
  const sub = cleanStr(subCategory);

  return (
    cat.includes('fashion') ||
    cat.includes('clothing') ||
    cat.includes('apparel') ||
    sub.includes('clothing') ||
    sub.includes('apparel') ||
    sub.includes('shirt') ||
    sub.includes('tshirt') ||
    sub.includes('dress') ||
    sub.includes('jeans') ||
    sub.includes('trouser') ||
    sub.includes('kurta') ||
    sub.includes('jacket') ||
    sub.includes('suit') ||
    sub.includes('blazer') ||
    sub.includes('topwear') ||
    sub.includes('bottomwear') ||
    (cat.includes('men') && !cat.includes('electronics') && (sub.includes('cloth') || sub.includes('shirt') || sub.includes('wear'))) ||
    (cat.includes('women') && !cat.includes('electronics') && (sub.includes('cloth') || sub.includes('dress') || sub.includes('wear') || sub.includes('saree')))
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
 * Completely isolates attributes by domain category so fashion specs never bleed into electronics or groceries.
 */
export function getPreloadedAttributes(
  category?: string,
  subCategory?: string,
  productType?: string,
  currentAttributes: Record<string, string> = {},
): Record<string, string> {
  const isFashion = isFashionCategory(category, subCategory);
  const isFootwear = isFootwearCategory(category, subCategory);
  const isElect = isElectronicsCategory(category, subCategory);
  const isGroc = isGroceryCategory(category, subCategory);

  const result: Record<string, string> = {};

  // Preserve internal metadata keys
  if (currentAttributes.hasVariants) {
    result.hasVariants = currentAttributes.hasVariants;
  }
  if (currentAttributes.totalVariants) {
    result.totalVariants = currentAttributes.totalVariants;
  }
  if (currentAttributes.shelfLocation) {
    result.shelfLocation = currentAttributes.shelfLocation;
  }

  // Attempt taxonomy schema lookup
  const tax = findTaxonomy(category, subCategory, productType);

  if (tax && Array.isArray(tax.attributes) && tax.attributes.length > 0) {
    tax.attributes.forEach((attr) => {
      const existingKey = Object.keys(currentAttributes).find(
        (k) => cleanStr(k) === cleanStr(attr.name),
      );
      if (existingKey && currentAttributes[existingKey]) {
        result[attr.name] = currentAttributes[existingKey];
      } else {
        // Preload empty placeholder for form binding
        result[attr.name] = '';
      }
    });
  }

  // Preserve general color if applicable
  const colorVal = currentAttributes.Color || currentAttributes.color;
  if (colorVal && !result.Color && !result.color) {
    result.color = colorVal;
  }

  // Handle Category-Specific Attributes with Strict Isolation
  if (isFashion) {
    // Fashion Apparel attributes ONLY
    ['fit', 'sleeve', 'neck', 'fabric', 'pattern'].forEach((k) => {
      if (currentAttributes[k]) {
        result[k] = currentAttributes[k];
      }
    });
    if (currentAttributes.size) {
      result.size = currentAttributes.size;
    }
  } else if (isFootwear) {
    // Footwear attributes ONLY
    if (currentAttributes.size) {
      result.size = currentAttributes.size;
    }
    ['upperMaterial', 'soleMaterial', 'closure'].forEach((k) => {
      if (currentAttributes[k]) {
        result[k] = currentAttributes[k];
      }
    });
  } else if (isElect) {
    // Electronics attributes ONLY (never allow fit/fabric/neck/sleeve or clothing sizes!)
    ['RAM', 'Internal Storage', 'Operating System', 'Processor Brand', 'Network Type', 'warranty', 'power'].forEach((k) => {
      if (currentAttributes[k] && !result[k]) {
        result[k] = currentAttributes[k];
      }
    });
  } else if (isGroc) {
    // Grocery attributes ONLY
    ['Net Qty / Weight', 'Pack Size', 'dietary', 'weight', 'shelfLife'].forEach((k) => {
      if (currentAttributes[k] && !result[k]) {
        result[k] = currentAttributes[k];
      }
    });
  }

  return result;
}

/**
 * Extract 3-8 relevant attribute pairs for Preview & Review cards.
 * Filtered strictly by category so obsolete or foreign attributes never display.
 */
export function getDisplayAttributes(
  product: Partial<ProductItem>,
): Array<{ label: string; value: string }> {
  const attrs = product.attributes || {};
  const entries: Array<{ label: string; value: string }> = [];

  const isFashion = isFashionCategory(product.category, product.subCategory);
  const isFoot = isFootwearCategory(product.category, product.subCategory);
  const isElect = isElectronicsCategory(product.category, product.subCategory);
  const isGroc = isGroceryCategory(product.category, product.subCategory);

  const ignoredKeys = new Set([
    'hasvariants',
    'totalvariants',
    'shelflocation',
    'price',
    'discount',
    'customerratings',
    'offers',
    'availability',
    'gstinvoiceavailable',
  ]);

  // Keys strictly forbidden for non-fashion categories
  const fashionOnlyKeys = new Set([
    'fit',
    'sleeve',
    'neck',
    'fabric',
    'collar',
    'cuff',
    'rise',
    'pattern',
  ]);

  Object.entries(attrs).forEach(([key, val]) => {
    if (!val || typeof val !== 'string' || !val.trim()) return;
    const cleanKey = cleanStr(key);
    if (ignoredKeys.has(cleanKey)) return;

    // Filter out fashion attributes if not fashion
    if (!isFashion && fashionOnlyKeys.has(cleanKey)) return;

    // Filter out clothing size if not fashion and not footwear
    if (!isFashion && !isFoot && (cleanKey === 'size' || cleanKey === 'sizeoptions')) return;

    // Filter out electronics-specific keys if not electronics
    if (!isElect && (cleanKey === 'ram' || cleanKey === 'internalstorage' || cleanKey === 'processorseries')) return;

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
 * Categorically isolated so a smartphone never says "Size: M Color: Black Apple".
 */
export function getBarcodeStickerSpecs(product: Partial<ProductItem>): {
  subtitle: string;
  brand: string;
} {
  const attrs = product.attributes || {};
  const brand = product.brand && product.brand !== 'Generic / Unbranded' ? product.brand : '';
  const category = product.category || '';
  const subCategory = product.subCategory || '';

  const isElect = isElectronicsCategory(category, subCategory);
  const isGroc = isGroceryCategory(category, subCategory);
  const isFoot = isFootwearCategory(category, subCategory);
  const isFashion = isFashionCategory(category, subCategory);

  const parts: string[] = [];

  if (isElect) {
    const storage = attrs['Internal Storage'] || attrs.storage || attrs.Storage;
    const ram = attrs.RAM || attrs.ram;
    const color = attrs.Color || attrs.color;
    if (storage) parts.push(storage);
    if (ram) parts.push(`RAM: ${ram}`);
    if (color && !['standard', 'm', 'l', 'xl'].includes(color.toLowerCase())) parts.push(color);
  } else if (isGroc) {
    const weight = attrs['Net Qty / Weight'] || attrs.weight || product.weight;
    const pack = attrs['Pack Size'] || attrs['Pack of'] || attrs.pack;
    if (weight) parts.push(weight.endsWith('g') || weight.endsWith('kg') ? weight : `${weight}g`);
    if (pack) parts.push(pack);
  } else if (isFoot) {
    const size = attrs.size || attrs.Size;
    const color = attrs.color || attrs.Color;
    if (size) parts.push(`Size: ${size.startsWith('UK') ? size : `UK ${size}`}`);
    if (color) parts.push(`Color: ${color}`);
  } else if (isFashion) {
    const size = attrs.size || attrs.Size;
    const color = attrs.color || attrs.Color;
    if (size) parts.push(`Size: ${size}`);
    if (color) parts.push(`Color: ${color}`);
  } else {
    // General items: top 2 non-empty display attributes
    const display = getDisplayAttributes(product);
    display.slice(0, 2).forEach((d) => parts.push(`${d.label}: ${d.value}`));
  }

  if (brand) {
    parts.push(brand);
  }

  return {
    subtitle: parts.length > 0 ? parts.join(' • ') : 'Standard Retail Spec',
    brand: brand || 'Standard',
  };
}

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
 * Returns a high-definition, category-appropriate fallback image URL
 * so that electronics, footwear, groceries, etc. never incorrectly default to apparel images.
 */
export function getCategoryFallbackImage(category?: string, subCategory?: string, name?: string): string {
  const text = `${category || ''} ${subCategory || ''} ${name || ''}`.toLowerCase();

  if (
    isElectronicsCategory(category, subCategory) ||
    text.includes('mobile') ||
    text.includes('phone') ||
    text.includes('samsung') ||
    text.includes('iphone') ||
    text.includes('galaxy') ||
    text.includes('smart') ||
    text.includes('laptop') ||
    text.includes('gadget') ||
    text.includes('camera') ||
    text.includes('audio') ||
    text.includes('headphone')
  ) {
    return 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80';
  }

  if (
    isFootwearCategory(category, subCategory) ||
    text.includes('shoe') ||
    text.includes('sneaker') ||
    text.includes('boot') ||
    text.includes('sandal')
  ) {
    return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80';
  }

  if (
    isGroceryCategory(category, subCategory) ||
    text.includes('groc') ||
    text.includes('food') ||
    text.includes('snack') ||
    text.includes('spice') ||
    text.includes('grain')
  ) {
    return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';
  }

  if (
    text.includes('beauty') ||
    text.includes('cosmetic') ||
    text.includes('skincare') ||
    text.includes('perfume') ||
    text.includes('makeup')
  ) {
    return 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80';
  }

  if (
    text.includes('appliance') ||
    text.includes('kitchen') ||
    text.includes('refrigerator') ||
    text.includes('microwave') ||
    text.includes('mixer')
  ) {
    return 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80';
  }

  // Fashion / Apparel fallback
  return 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';
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

export const STORE_CATEGORY_TAXONOMY_MAP: Record<string, string[]> = {
  electronics: ['Electronics', 'Gaming', 'Auto Accessories'],
  fashion: ["Men's Fashion", "Women's Fashion", 'Baby & Kids'],
  footwear: ["Men's Fashion", "Women's Fashion", 'Sports'],
  jewellery: ["Women's Fashion", "Men's Fashion"],
  home_living: ['Home & Furniture', 'Industrial & Scientific Tools'],
  beauty_care: ["Women's Fashion", 'Health & Nutrition', 'Medical Supplies'],
  grocery_staples: ['Food Essentials', 'Health & Nutrition'],
  sports_fitness: ['Sports', 'Exercise & Fitness'],
  toys_baby: ['Baby & Kids', 'Gaming'],
  books_stationery: ['Books', 'Stationery', 'Music', 'Movies & TV Shows'],
  gifts: ['Books', 'Stationery', 'Home & Furniture', 'Baby & Kids'],
  other: [],
};

export function normalizeStoreCategoryKey(raw?: string): string {
  if (!raw) return '';
  const cleaned = raw.toLowerCase().replace(/['"’\-_]/g, ' ').replace(/\s+/g, ' ').trim();
  if (cleaned.includes('elect')) return 'electronics';
  if (cleaned.includes('footwear') || cleaned.includes('shoe')) return 'footwear';
  if (cleaned.includes('jewel')) return 'jewellery';
  if (cleaned.includes('fashion') || cleaned.includes('cloth') || cleaned.includes('apparel')) return 'fashion';
  if (cleaned.includes('home') || cleaned.includes('furnit')) return 'home_living';
  if (cleaned.includes('beauty') || cleaned.includes('care') || cleaned.includes('cosmetic')) return 'beauty_care';
  if (cleaned.includes('groc') || cleaned.includes('food') || cleaned.includes('staple')) return 'grocery_staples';
  if (cleaned.includes('sport') || cleaned.includes('fitness')) return 'sports_fitness';
  if (cleaned.includes('toy') || cleaned.includes('baby') || cleaned.includes('kid')) return 'toys_baby';
  if (cleaned.includes('book') || cleaned.includes('station')) return 'books_stationery';
  if (cleaned.includes('gift')) return 'gifts';
  return cleaned.replace(/\s+store$/i, '').trim();
}

/**
 * Returns the list of master taxonomy categories allowed for a store based on its
 * onboarded category, businessCategories, and any custom merchant categories.
 */
export function getStoreAllowedCategories(
  storeCategory?: string,
  businessCategories?: string[],
  customCategories?: string[],
): string[] {
  const allowed = new Set<string>();

  const primaryKey = normalizeStoreCategoryKey(storeCategory);
  if (primaryKey && STORE_CATEGORY_TAXONOMY_MAP[primaryKey]) {
    STORE_CATEGORY_TAXONOMY_MAP[primaryKey].forEach((cat) => allowed.add(cat));
  }

  if (Array.isArray(businessCategories)) {
    for (const bCat of businessCategories) {
      const key = normalizeStoreCategoryKey(bCat);
      if (key && STORE_CATEGORY_TAXONOMY_MAP[key]) {
        STORE_CATEGORY_TAXONOMY_MAP[key].forEach((cat) => allowed.add(cat));
      }
    }
  }

  // Any custom categories created by this tenant are always permitted
  if (Array.isArray(customCategories)) {
    for (const c of customCategories) {
      if (c && c.trim()) allowed.add(c.trim());
    }
  }

  return Array.from(allowed);
}

/**
 * Dynamic placeholders based on category, subcategory, and product type.
 */
export function getCategoryPlaceholders(
  category?: string,
  subCategory?: string,
  productType?: string,
): {
  namePlaceholder: string;
  descPlaceholder: string;
  quickSearchPlaceholder: string;
} {
  const isElect = isElectronicsCategory(category, subCategory);
  const isGroc = isGroceryCategory(category, subCategory);
  const isFoot = isFootwearCategory(category, subCategory);

  if (isElect) {
    const pt = (productType || '').toLowerCase();
    let nameEx = 'e.g. Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB Titanium)';
    if (pt.includes('watch')) {
      nameEx = 'e.g. Noise ColorFit Pro 5 Smartwatch with 1.85" AMOLED Display';
    } else if (pt.includes('laptop')) {
      nameEx = 'e.g. Apple MacBook Air M3 (16GB RAM, 512GB SSD, Space Gray)';
    } else if (pt.includes('headphone') || pt.includes('earbud')) {
      nameEx = 'e.g. Sony WH-1000XM5 Wireless Noise Canceling Headphones';
    }
    return {
      namePlaceholder: nameEx,
      descPlaceholder:
        'Enter technical specifications, processor details, display size, camera specs, battery capacity, warranty terms, and box contents...',
      quickSearchPlaceholder: '⚡ Quick Search (e.g. Smartphones, Laptops, Smartwatches, Headphones...)',
    };
  }

  if (isGroc) {
    return {
      namePlaceholder: 'e.g. Fortune Sunlite Refined Sunflower Oil 1L Pouch',
      descPlaceholder:
        'Enter nutritional information, net weight, ingredients, shelf life, storage instructions, and FSSAI license details...',
      quickSearchPlaceholder: '⚡ Quick Search (e.g. Rice, Atta, Cooking Oil, Spices, Pulses...)',
    };
  }

  if (isFoot) {
    return {
      namePlaceholder: 'e.g. Nike Air Max Alpha Men Running Shoes - White/Navy (UK 9)',
      descPlaceholder:
        'Enter sole material, closure type, cushioning technology, ideal usage, care instructions, and comfort features...',
      quickSearchPlaceholder: '⚡ Quick Search (e.g. Running Shoes, Sneakers, Formal Shoes, Sandals...)',
    };
  }

  // Default / Fashion
  return {
    namePlaceholder: 'e.g. Classic Slim Fit Solid Pure Cotton Round Neck T-Shirt',
    descPlaceholder:
      'Enter rich description highlighting fabric composition, fit details, style pairing, occasion wear, and key customer benefits...',
    quickSearchPlaceholder: '⚡ Quick Search (e.g. T-Shirts, Formal Shirts, Denim Jeans, Kurtas...)',
  };
}

/**
 * Dynamic contextual tag suggestions based on category, subcategory, product type, and brand.
 */
export function getContextualTagSuggestions(
  category?: string,
  subCategory?: string,
  productType?: string,
  brand?: string,
): string[] {
  const isElect = isElectronicsCategory(category, subCategory);
  const isGroc = isGroceryCategory(category, subCategory);
  const isFoot = isFootwearCategory(category, subCategory);

  const tags: string[] = [];
  if (brand && brand !== 'Generic / Unbranded') {
    tags.push(brand);
  }

  if (isElect) {
    tags.push('5G', 'AMOLED Display', 'Fast Charging', 'Bluetooth Calling', 'Waterproof IP68', 'Wireless', 'Type-C', '1 Year Warranty');
    return Array.from(new Set(tags));
  }

  if (isGroc) {
    tags.push('100% Organic', 'No Preservatives', 'Fresh Stock', 'FSSAI Certified', 'Rich in Protein', 'Daily Essential', 'Pack of 1', 'Store in Cool Place');
    return Array.from(new Set(tags));
  }

  if (isFoot) {
    tags.push('Cushioned Sole', 'Breathable Mesh', 'Lightweight', 'Running Shoes', 'Anti-Slip', 'Comfort Fit', 'Sports Wear', 'Lace-Up');
    return Array.from(new Set(tags));
  }

  // Fashion / Default
  tags.push('100% Pure Cotton', 'Breathable Fabric', 'Regular Fit', 'Round Neck', 'Casual Wear', 'Machine Wash', 'Trending Style', 'Premium Finish');
  return Array.from(new Set(tags));
}

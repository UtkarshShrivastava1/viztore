import React from 'react';
import {
  Shirt,
  ListFilter,
  LayoutGrid,
  Info,
  ArrowRight,
  Search,
  CheckCircle2,
  Barcode,
  Camera,
  Zap,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Layers,
  X,
  Check,
  ShieldCheck,
  Clock,
  Lock,
  Package,
} from 'lucide-react';
import { useCatalogStore } from '../../../stores/catalogStore.js';
import { WizardHelpSidebar } from './WizardHelpSidebar.js';
import { CreatableCombobox } from '../../ui/CreatableCombobox.js';
import {
  getCustomTaxonomy,
  recordCustomCategory,
  recordCustomBrand,
  mineTaxonomyFromProducts,
  normalizeCategoryName,
} from '../../../lib/customTaxonomyStorage.js';
import { useAuthStore } from '../../../stores/authStore.js';
import {
  lookupMasterProduct,
  searchMasterProducts,
  getPopularMasterProducts,
  MasterCatalogProduct,
} from '../../../lib/masterCatalogService.js';
import { CameraBarcodeScannerModal } from '../CameraBarcodeScannerModal.js';

import masterTaxonomies from '../../../data/taxonomies.json';
import {
  getPreloadedAttributes,
  getStoreAllowedCategories,
  getCategoryPlaceholders,
} from '../../../lib/taxonomyHelper.js';

interface CategoryDefinition {
  subCategories: string[];
  productTypes: Record<string, string[]>;
}

interface TaxonomyItem {
  category: string;
  subcategory: string;
  productType: string;
  hsnCode?: string;
  gstRate?: number;
  attributes: Array<{ name: string; values: string[]; isMultiSelect: boolean; isRequired: boolean }>;
}

const typedMasterTaxonomies = masterTaxonomies as unknown as TaxonomyItem[];

const buildMasterCategoryTree = (): Record<string, CategoryDefinition> => {
  const tree: Record<string, CategoryDefinition> = {};
  for (const item of typedMasterTaxonomies) {
    const rawCat = item.category.trim();
    const cat = normalizeCategoryName(rawCat);
    const sub = item.subcategory.trim();
    const pt = item.productType.trim();
    if (!cat || !sub || !pt) continue;

    if (!tree[cat]) {
      tree[cat] = { subCategories: [], productTypes: {} };
    }
    if (!tree[cat].subCategories.includes(sub)) {
      if (sub === 'Clothing') {
        tree[cat].subCategories.unshift(sub);
      } else {
        tree[cat].subCategories.push(sub);
      }
    }
    if (!tree[cat].productTypes[sub]) {
      tree[cat].productTypes[sub] = [];
    }
    if (!tree[cat].productTypes[sub].includes(pt)) {
      tree[cat].productTypes[sub].push(pt);
    }
  }
  return tree;
};

const getStoreDefaultCategory = (storeCategory?: string): string => {
  if (!storeCategory) return "Men's Fashion";
  const cat = storeCategory.toLowerCase();
  if (cat.includes('elect')) return 'Electronics';
  if (cat.includes('groc') || cat.includes('food')) return 'Food Essentials';
  if (cat.includes('home') || cat.includes('furn')) return 'Home & Furniture';
  if (cat.includes('sport') || cat.includes('fit')) return 'Sports';
  if (cat.includes('book') || cat.includes('station')) return 'Books';
  if (cat.includes('toy') || cat.includes('baby')) return 'Baby & Kids';
  if (cat.includes('beauty')) return "Women's Fashion";
  return "Men's Fashion";
};

const categoryCatalogTree: Record<string, CategoryDefinition> = buildMasterCategoryTree();

function getCategoryFallbackHsn(category?: string, subCategory?: string): string {
  const c = (category || '').toLowerCase();
  const s = (subCategory || '').toLowerCase();
  if (c.includes('elect') || c.includes('mobile') || s.includes('mobile') || s.includes('phone')) return '85171300';
  if (c.includes('foot') || c.includes('shoe') || s.includes('foot') || s.includes('shoe')) return '64039990';
  if (c.includes('food') || c.includes('groc') || s.includes('food') || s.includes('snack')) return '21069099';
  if (c.includes('fashion') || c.includes('cloth') || c.includes('apparel') || s.includes('shirt') || s.includes('dress')) return '61091000';
  return '85171300';
}


const commonBrandOptions = Array.from(
  new Set([
    'Generic / Unbranded',
    'Local Artisan / In-House',
    ...typedMasterTaxonomies
      .flatMap((t) => t.attributes || [])
      .filter((a) => a.name.toLowerCase() === 'brand')
      .flatMap((a) => a.values || []),
    'Nike',
    'Puma',
    'Adidas',
    'Levis',
    'Zara',
    'H&M',
    'Apple',
    'Samsung',
    'Amul',
    'Tata',
    'Britannia',
    'boAt',
  ]),
).filter(Boolean);

export const AddProductStep1: React.FC = () => {
  const { draftProduct, updateDraftProduct, setWizardStep, products } = useCatalogStore();
  const currentStore = useAuthStore((s) => s.currentStore);
  const storeId = currentStore?._id || currentStore?.id;

  // 1. Initial custom taxonomy loaded from store/localStorage + mined from catalog
  const [customTax, setCustomTax] = React.useState(() => getCustomTaxonomy(storeId));

  React.useEffect(() => {
    const loaded = getCustomTaxonomy(storeId);
    const mined = mineTaxonomyFromProducts(products || []);
    const mergedCategories = Array.from(new Set([...loaded.categories, ...mined.categories])).filter(Boolean);
    const mergedBrands = Array.from(new Set([...loaded.brands, ...mined.brands])).filter(Boolean);
    const mergedSubs = { ...loaded.subCategories };
    Object.entries(mined.subCategories).forEach(([cat, subs]) => {
      mergedSubs[cat] = Array.from(new Set([...(mergedSubs[cat] || []), ...subs])).filter(Boolean);
    });
    const mergedPts = { ...loaded.productTypes };
    Object.entries(mined.productTypes).forEach(([sub, pts]) => {
      mergedPts[sub] = Array.from(new Set([...(mergedPts[sub] || []), ...pts])).filter(Boolean);
    });

    setCustomTax({
      categories: mergedCategories,
      subCategories: mergedSubs,
      productTypes: mergedPts,
      brands: mergedBrands,
    });
  }, [storeId, products]);

  const [showAllCategories, setShowAllCategories] = React.useState(false);

  const allowedCategories = React.useMemo(() => {
    return getStoreAllowedCategories(
      currentStore?.category,
      currentStore?.businessCategories,
      customTax.categories,
    );
  }, [currentStore?.category, currentStore?.businessCategories, customTax.categories]);

  // All Category options = built-in keys + saved custom categories, filtered by store business type unless showAllCategories is enabled
  const allCategoryOptions = React.useMemo(() => {
    const all = Array.from(
      new Set([...Object.keys(categoryCatalogTree), ...(customTax.categories || [])]),
    ).filter(Boolean);

    if (allowedCategories.length > 0 && !showAllCategories) {
      const filtered = all.filter((cat) => allowedCategories.includes(cat));
      return filtered.length > 0 ? filtered : all;
    }
    return all;
  }, [customTax.categories, allowedCategories, showAllCategories]);

  const defaultCategory = React.useMemo((): string => {
    if (allCategoryOptions.length > 0 && allCategoryOptions[0]) {
      return allCategoryOptions[0];
    }
    return getStoreDefaultCategory(currentStore?.category);
  }, [allCategoryOptions, currentStore?.category]);

  const rawCat = draftProduct.category;
  const category: string = (rawCat ? normalizeCategoryName(rawCat) : defaultCategory) || getStoreDefaultCategory(currentStore?.category);

  // Current Category definition = built-in tree + custom subCategories and productTypes
  const currentCategoryData = React.useMemo(() => {
    const base = categoryCatalogTree[category] || { subCategories: [], productTypes: {} };
    const savedSubs = customTax.subCategories[category] || [];
    const mergedSubs = Array.from(
      new Set([
        ...base.subCategories,
        ...savedSubs,
        ...(draftProduct.subCategory && draftProduct.subCategory !== 'General' ? [draftProduct.subCategory] : []),
      ]),
    ).filter(Boolean);

    const mergedTypesMap: Record<string, string[]> = { ...base.productTypes };
    Object.entries(customTax.productTypes).forEach(([sub, pts]) => {
      mergedTypesMap[sub] = Array.from(
        new Set([...(mergedTypesMap[sub] || []), ...pts]),
      ).filter(Boolean);
    });

    return {
      subCategories: mergedSubs.length > 0 ? mergedSubs : ['General'],
      productTypes: mergedTypesMap,
    };
  }, [category, customTax, draftProduct.subCategory]);

  const subCategory =
    draftProduct.subCategory && draftProduct.subCategory !== 'General'
      ? draftProduct.subCategory
      : (currentCategoryData.subCategories[0] || 'General');
  const availableProductTypes =
    (subCategory && currentCategoryData.productTypes[subCategory]) ||
    currentCategoryData.productTypes[currentCategoryData.subCategories[0] || ''] ||
    [draftProduct.productType || 'Standard'];
  const productType =
    draftProduct.productType && draftProduct.productType !== 'Standard'
      ? draftProduct.productType
      : (availableProductTypes[0] || 'Standard');
  const productIdentification = draftProduct.productIdentification || 'new';
  // Preload taxonomy attributes on mount or when parent category / product type is set
  React.useEffect(() => {
    const activeCat = category || defaultCategory || 'Electronics';
    const activeSub = subCategory || 'Clothing';
    const activePt = productType || 'Standard';

    if (!draftProduct.category || !draftProduct.productType) {
      const preloaded = getPreloadedAttributes(activeCat, activeSub, activePt, draftProduct.attributes || {});
      updateDraftProduct({
        category: activeCat,
        subCategory: activeSub,
        productType: activePt,
        attributes: preloaded,
      });
    } else {
      const currentAttrs = draftProduct.attributes || {};
      const currentKeys = Object.keys(currentAttrs).filter(
        (k) => k !== 'hasVariants' && k !== 'totalVariants' && k !== 'shelfLocation' && Boolean(currentAttrs[k])
      );
      if (currentKeys.length === 0) {
        const preloaded = getPreloadedAttributes(draftProduct.category, draftProduct.subCategory, draftProduct.productType, currentAttrs);
        updateDraftProduct({ attributes: preloaded });
      }
    }
  }, [category, subCategory, productType]);

  const brand = draftProduct.brand || '';
  const hsnCode = draftProduct.hsnCode || getCategoryFallbackHsn(category, subCategory);

  const matchedHsn = React.useMemo(() => {
    if (!hsnCode || hsnCode.length < 4) return null;
    return typedMasterTaxonomies.find(
      (t) => t.hsnCode === hsnCode || t.hsnCode?.startsWith(hsnCode)
    );
  }, [hsnCode]);

  // All Brand options = common options + saved custom brands
  const allBrandOptions = React.useMemo(() => {
    return Array.from(
      new Set([...commonBrandOptions, ...(customTax.brands || [])]),
    ).filter(Boolean);
  }, [customTax.brands]);

  const handleCategoryChange = (newCat: string) => {
    const normCat = normalizeCategoryName(newCat);
    const nextCatData = categoryCatalogTree[normCat];
    const savedSubs = customTax.subCategories[normCat] || [];
    const nextSub = nextCatData ? (nextCatData.subCategories[0] || 'General') : (savedSubs[0] || 'General');
    const nextTypes =
      (nextCatData && nextCatData.productTypes[nextSub]) ||
      customTax.productTypes[nextSub] ||
      ['Standard'];

    const nextAttributes = getPreloadedAttributes(normCat, nextSub, nextTypes[0] || 'Standard', draftProduct.attributes || {});

    updateDraftProduct({
      category: normCat,
      subCategory: nextSub,
      productType: nextTypes[0] || 'Standard',
      attributes: nextAttributes,
    });

    // Record custom category if not in static tree
    if (!categoryCatalogTree[normCat]) {
      const updated = recordCustomCategory(storeId, normCat, nextSub, nextTypes[0]);
      setCustomTax(updated);
    }
  };

  const handleSubCategoryChange = (newSub: string) => {
    const nextTypes =
      currentCategoryData.productTypes[newSub] ||
      customTax.productTypes[newSub] ||
      ['Standard'];

    const nextAttributes = getPreloadedAttributes(category, newSub, nextTypes[0] || 'Standard', draftProduct.attributes || {});

    updateDraftProduct({
      subCategory: newSub,
      productType: nextTypes[0] || 'Standard',
      attributes: nextAttributes,
    });

    const updated = recordCustomCategory(storeId, category, newSub, nextTypes[0]);
    setCustomTax(updated);
  };

  const handleProductTypeChange = (newPt: string) => {
    const match = typedMasterTaxonomies.find(
      (t) =>
        t.productType.toLowerCase() === newPt.toLowerCase() &&
        (!category || normalizeCategoryName(t.category).toLowerCase() === category.toLowerCase()),
    );

    const nextAttributes = getPreloadedAttributes(category, subCategory, newPt, draftProduct.attributes || {});

    updateDraftProduct({
      productType: newPt,
      hsnCode: match?.hsnCode || draftProduct.hsnCode || getCategoryFallbackHsn(category, subCategory),
      tax: match?.gstRate
        ? {
            category: normalizeCategoryName(match.category),
            rate: match.gstRate,
            inclusive: true,
          }
        : draftProduct.tax,
      attributes: nextAttributes,
    });
    const updated = recordCustomCategory(storeId, category, subCategory, newPt);
    setCustomTax(updated);
  };

  const [quickSearch, setQuickSearch] = React.useState('');
  const quickSearchResults = React.useMemo(() => {
    const q = quickSearch.trim().toLowerCase();
    if (!q || q.length < 2) return [];
    return typedMasterTaxonomies
      .filter((t) => {
        const normCat = normalizeCategoryName(t.category);
        if (allowedCategories.length > 0 && !showAllCategories) {
          if (!allowedCategories.includes(normCat)) {
            return false;
          }
        }
        return (
          t.productType.toLowerCase().includes(q) ||
          t.subcategory.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          normCat.toLowerCase().includes(q)
        );
      })
      .slice(0, 6);
  }, [quickSearch, allowedCategories, showAllCategories]);

  const placeholders = React.useMemo(() => {
    return getCategoryPlaceholders(category, subCategory, draftProduct.productType);
  }, [category, subCategory, draftProduct.productType]);

  const selectHierarchy = (t: TaxonomyItem) => {
    const normCat = normalizeCategoryName(t.category);
    const preloaded = getPreloadedAttributes(normCat, t.subcategory, t.productType, draftProduct.attributes || {});
    updateDraftProduct({
      category: normCat,
      subCategory: t.subcategory,
      productType: t.productType,
      hsnCode: t.hsnCode || getCategoryFallbackHsn(normCat, t.subcategory),
      tax: {
        category: normCat,
        rate: t.gstRate ?? 18,
        inclusive: true,
      },
      attributes: preloaded,
    });
    setQuickSearch('');
  };

  const handleBrandChange = (newBrand: string) => {
    updateDraftProduct({ brand: newBrand });
    if (newBrand && newBrand !== 'Generic / Unbranded') {
      const updated = recordCustomBrand(storeId, newBrand);
      setCustomTax(updated);
    }
  };

  // Barcode Master Catalog Match State
  const [barcodeInput, setBarcodeInput] = React.useState(draftProduct.barcode || '');
  const [matchedMasterProduct, setMatchedMasterProduct] = React.useState<MasterCatalogProduct | null>(null);
  const [isCameraScannerOpen, setIsCameraScannerOpen] = React.useState(false);
  const [lookupFeedback, setLookupFeedback] = React.useState<{ message: string; type: 'success' | 'warning' | 'info' } | null>(null);

  // Card 2 "Add Existing Product" Search State & Info Modal
  const [existingSearchQuery, setExistingSearchQuery] = React.useState(draftProduct.existingSearchTerm || '');
  const [isInfoModalOpen, setIsInfoModalOpen] = React.useState(false);

  const existingSearchResults = React.useMemo(() => {
    if (!existingSearchQuery.trim() || existingSearchQuery.trim().length < 2) return [];
    return searchMasterProducts(existingSearchQuery, 8);
  }, [existingSearchQuery]);

  const popularMasterProducts = React.useMemo(() => {
    return getPopularMasterProducts(allowedCategories, 5);
  }, [allowedCategories]);

  const applyMasterProduct = (prod: MasterCatalogProduct, fastTrack = false) => {
    const preloadedAttrs = getPreloadedAttributes(prod.category, prod.subCategory, prod.productType, draftProduct.attributes || {});
    updateDraftProduct({
      productIdentification: 'existing',
      existingSearchTerm: prod.name,
      name: prod.name,
      brand: prod.brand,
      barcode: prod.barcode,
      category: prod.category,
      subCategory: prod.subCategory,
      productType: prod.productType,
      hsnCode: prod.hsnCode,
      tax: {
        category: prod.category,
        rate: prod.gstRate,
        inclusive: true,
      },
      mrp: prod.mrp,
      price: prod.suggestedPrice,
      costPrice: prod.costPrice,
      images: prod.images,
      description: prod.description,
      tags: [prod.brand, prod.productType, prod.subCategory].filter(Boolean),
      attributes: preloadedAttrs,
    });

    setMatchedMasterProduct(prod);
    setBarcodeInput(prod.barcode);
    setExistingSearchQuery(prod.name);
    setLookupFeedback({
      message: `Matched national master catalog for "${prod.name}"!`,
      type: 'success',
    });

    if (fastTrack) {
      setWizardStep(3);
    }
  };

  const handleSelectExistingProduct = (prod: MasterCatalogProduct) => {
    applyMasterProduct(prod, false);
  };

  const handleSwitchToNewProduct = (fallbackName?: string) => {
    updateDraftProduct({
      productIdentification: 'new',
      existingSearchTerm: '',
      ...(fallbackName ? { name: fallbackName } : {}),
    });
    setMatchedMasterProduct(null);
    setExistingSearchQuery('');
  };

  const handleBarcodeSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const match = lookupMasterProduct(trimmed);
    if (match) {
      applyMasterProduct(match, false);
    } else {
      setMatchedMasterProduct(null);
      setLookupFeedback({
        message: `No master catalog entry for barcode "${trimmed}". You can continue manual entry below.`,
        type: 'warning',
      });
      updateDraftProduct({ barcode: trimmed });
    }
  };

  // USB Barcode Wedge Gun Listener
  React.useEffect(() => {
    let buffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'TEXTAREA') return;

      const currentTime = Date.now();
      const charDiff = currentTime - lastKeyTime;
      lastKeyTime = currentTime;

      if (e.key === 'Enter') {
        if (buffer.length >= 6 && charDiff < 60) {
          e.preventDefault();
          setBarcodeInput(buffer);
          handleBarcodeSearch(buffer);
        }
        buffer = '';
        return;
      }

      if (e.key.length === 1) {
        if (charDiff > 60) {
          buffer = '';
        }
        buffer += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (brand && brand !== draftProduct.brand) {
      updateDraftProduct({ brand });
    }
    setWizardStep(2);
  };

  return (
    <>
      <CameraBarcodeScannerModal
        isOpen={isCameraScannerOpen}
        onClose={() => setIsCameraScannerOpen(false)}
        onDetected={(code) => {
          setBarcodeInput(code);
          handleBarcodeSearch(code);
        }}
      />

      {/* "Why Add Existing Product?" Explainer Modal */}
      {isInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      Cataloging Architecture
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    Why Use &ldquo;Add Existing Product&rdquo;?
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsInfoModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <p className="text-xs text-slate-600 leading-relaxed">
                When cataloging products for your store, you can either create an item from scratch (<strong>Add New Product</strong>) or link to a verified record from the national master catalog (<strong>Add Existing Product</strong>). Here is why using existing products saves time and eliminates errors.
              </p>

              {/* 3 Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/40">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">90% Faster Listing</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-normal">
                    Skips product photography and typing. Pre-fills official model names, descriptions, and high-resolution studio photos.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">100% Tax Compliant</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-normal">
                    Auto-calibrated with verified statutory 8-digit HSN codes and correct GST slabs (5%, 12%, 18%, 28%) to prevent audit penalties.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-purple-100 bg-purple-50/40">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-2">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">100% Tenant-Isolated</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-normal">
                    Master catalog only supplies the metadata template. Your selling prices, discounts, and inventory counts remain private to your shop.
                  </p>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Feature</th>
                      <th className="py-2.5 px-3 text-blue-700 bg-blue-50/50">Add Existing Product</th>
                      <th className="py-2.5 px-3 text-slate-700">Add New Product</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">Product Images</td>
                      <td className="py-2.5 px-3 bg-blue-50/20 text-emerald-700 font-medium">Pre-filled studio photos</td>
                      <td className="py-2.5 px-3">Upload your own photos</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">Specifications</td>
                      <td className="py-2.5 px-3 bg-blue-50/20 text-emerald-700 font-medium">Official brand specs &amp; features</td>
                      <td className="py-2.5 px-3">Manual typing required</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">HSN &amp; GST Rates</td>
                      <td className="py-2.5 px-3 bg-blue-50/20 text-emerald-700 font-medium">Auto-mapped &amp; verified</td>
                      <td className="py-2.5 px-3">Manual lookup required</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">Price &amp; Inventory</td>
                      <td className="py-2.5 px-3 bg-blue-50/20 font-medium text-slate-800">YOU decide selling price &amp; stock</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">YOU decide selling price &amp; stock</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">Best Used For</td>
                      <td className="py-2.5 px-3 bg-blue-50/20 text-blue-800 font-medium">
                        Branded retail goods (Electronics, Packaged Groceries, Branded Apparel)
                      </td>
                      <td className="py-2.5 px-3">
                        Custom manufactured, boutique, tailored, or unbranded local items
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Note */}
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>
                  <strong>Tip:</strong> Even when you link an existing product, you can still customize your selling price, offer promotional discounts, edit the description, or add extra store-specific photos before publishing.
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsInfoModalOpen(false)}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Got It, Continue Cataloging
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleContinue} className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column (8 cols): Main Form Cards */}
          <div className="lg:col-span-8 space-y-4">
            {/* 1-Click Barcode & National Master Catalog Matcher (Amazon/Flipkart Style) */}
            <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-lg border border-blue-800/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

              <div className="relative z-10 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-800/40 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-400/30">
                      <Barcode className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold tracking-tight text-white">
                          1-Click Barcode &amp; Master Catalog Match
                        </h3>
                        <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full font-semibold">
                          Amazon ASIN Style
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Scan EAN-13 barcode or type to auto-fill photos, specifications, HSN &amp; GST in 5 seconds!
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCameraScannerOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all self-start sm:self-auto shrink-0 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Scan with Camera</span>
                  </button>
                </div>

                {/* Search & Barcode Input Bar */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleBarcodeSearch(barcodeInput);
                        }
                      }}
                      placeholder="Scan barcode or enter EAN-13 (e.g. 8901499009845, 8901058852394, 8906145620018)..."
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800/80 hover:bg-slate-800 focus:bg-slate-900 border border-slate-700 focus:border-blue-400 rounded-xl text-white placeholder-slate-400 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 transition-all"
                    />
                    <Barcode className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBarcodeSearch(barcodeInput)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    Match Catalog ⚡
                  </button>
                </div>

                {/* Feedback Banner */}
                {lookupFeedback && (
                  <div
                    className={`p-2.5 rounded-xl text-xs flex items-center justify-between border ${
                      lookupFeedback.type === 'success'
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                        : lookupFeedback.type === 'warning'
                          ? 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                          : 'bg-blue-950/60 border-blue-500/40 text-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {lookupFeedback.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <span>{lookupFeedback.message}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLookupFeedback(null)}
                      className="text-slate-400 hover:text-white text-[11px] ml-2"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Matched Master Product Card */}
                {matchedMasterProduct && (
                  <div className="p-3 bg-slate-800/90 border border-blue-500/40 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={matchedMasterProduct.images[0]}
                        alt={matchedMasterProduct.name}
                        className="w-14 h-14 rounded-lg object-cover bg-white shrink-0 border border-slate-700"
                      />
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-white truncate max-w-[280px] sm:max-w-[400px]">
                            {matchedMasterProduct.name}
                          </span>
                          <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                            {matchedMasterProduct.brand}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-300 flex-wrap">
                          <span>{matchedMasterProduct.category} &gt; {matchedMasterProduct.subCategory} &gt; {matchedMasterProduct.productType}</span>
                          <span>•</span>
                          <span className="font-mono text-emerald-400 font-bold">MRP ₹{matchedMasterProduct.mrp}</span>
                          <span>•</span>
                          <span className="font-mono text-blue-300">HSN: {matchedMasterProduct.hsnCode} (GST {matchedMasterProduct.gstRate}%)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => applyMasterProduct(matchedMasterProduct, true)}
                        className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Fast-Track: Go to Price &amp; Stock</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setMatchedMasterProduct(null)}
                        className="px-2.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          {/* Card 1: Category, Sub-category & Product Type */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Category, Sub-category &amp; Product Type
              </h3>
            </div>
            <p className="text-xs text-slate-500 ml-8 mb-2.5">
              Choose or search across master retail categories and product types.
            </p>

            {/* Business Category Scope Banner */}
            <div className="ml-8 mb-3 flex items-center justify-between flex-wrap gap-2 text-xs bg-slate-50/90 border border-slate-200/80 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Business Type:</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 capitalize">
                  {currentStore?.category ? String(currentStore.category).replace('_', ' ') : 'Store'}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {showAllCategories
                    ? 'Showing all 350+ master retail categories'
                    : `Filtered to ${allowedCategories.length} category scopes & isolated search`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAllCategories((prev) => !prev)}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition-colors"
              >
                {showAllCategories ? '← Restrict to Store Business Scope' : '🌐 Show all retail categories'}
              </button>
            </div>

            {/* Quick Auto-Complete Bar */}
            <div className="ml-8 mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  placeholder={placeholders.quickSearchPlaceholder}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {quickSearchResults.length > 0 && (
                <div className="mt-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-medium text-slate-400 self-center mr-1">Suggestions:</span>
                  {quickSearchResults.map((t, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectHierarchy(t)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 rounded-md transition-colors cursor-pointer shadow-2xs"
                    >
                      <span className="text-slate-400">{t.category} › {t.subcategory} ›</span>
                      <span className="font-semibold">{t.productType}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
              {/* Category */}
              <CreatableCombobox
                label="Category"
                required
                leftIcon={<Shirt className="w-4 h-4 text-slate-400" />}
                value={category}
                options={allCategoryOptions}
                onChange={handleCategoryChange}
                placeholder="Select or type category..."
                itemTypeLabel="Category"
              />

              {/* Sub-category */}
              <CreatableCombobox
                label="Sub-category"
                required
                leftIcon={<ListFilter className="w-4 h-4 text-slate-400" />}
                value={subCategory}
                options={currentCategoryData.subCategories}
                onChange={handleSubCategoryChange}
                placeholder="Select or type sub-category..."
                itemTypeLabel="Sub-category"
              />

              {/* Product Type */}
              <CreatableCombobox
                label="Product Type"
                required
                leftIcon={<LayoutGrid className="w-4 h-4 text-slate-400" />}
                value={productType}
                options={availableProductTypes}
                onChange={handleProductTypeChange}
                placeholder="Select or type product type..."
                itemTypeLabel="Product Type"
              />
            </div>
          </div>

          {/* Card 2: Product Identification */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h3 className="text-sm font-bold text-slate-900">Product Identification</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsInfoModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                title="Learn why using Add Existing Product saves time and avoids mistakes"
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>Why &ldquo;Add Existing Product&rdquo;?</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 ml-8 mb-4">
              Choose between fast-listing a verified product from the master catalog or creating a custom product from scratch.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Radio Group */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Add Product As <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2">
                  <label
                    onClick={() => {
                      updateDraftProduct({ productIdentification: 'new' });
                      if (matchedMasterProduct) {
                        setMatchedMasterProduct(null);
                      }
                    }}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      productIdentification === 'new'
                        ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="productIdentification"
                      checked={productIdentification === 'new'}
                      onChange={() => {
                        updateDraftProduct({ productIdentification: 'new' });
                        if (matchedMasterProduct) {
                          setMatchedMasterProduct(null);
                        }
                      }}
                      className="mt-0.5 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Add New Product</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                        Create a custom or unbranded product from scratch with your own photos and descriptions.
                      </div>
                    </div>
                  </label>

                  <label
                    onClick={() => updateDraftProduct({ productIdentification: 'existing' })}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      productIdentification === 'existing'
                        ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="productIdentification"
                      checked={productIdentification === 'existing'}
                      onChange={() => updateDraftProduct({ productIdentification: 'existing' })}
                      className="mt-0.5 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800">Add Existing Product</span>
                        <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          Recommended
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                        Auto-fill studio photos, specs, HSN &amp; tax from national database. Save 90% time.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Right Column: Search & Linked Product Card */}
              <div>
                {productIdentification === 'new' ? (
                  <div className="h-full flex flex-col justify-between p-3.5 rounded-lg border border-dashed border-slate-200 bg-slate-50/60">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Package className="w-4 h-4 text-slate-500" />
                        <span className="text-xs font-bold text-slate-700">Manual Entry Mode Active</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        You are entering product details manually in Step 1, 2 &amp; 3. If this is a branded item (e.g. Samsung, boAt, Apple, Amul), you can auto-fill verified specs and studio photos instead.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateDraftProduct({ productIdentification: 'existing' })}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 self-start cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                      <span>Switch to &ldquo;Add Existing Product&rdquo; &rarr;</span>
                    </button>
                  </div>
                ) : matchedMasterProduct ? (
                  /* Linked Master Product Card */
                  <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/40">
                    <div className="flex items-start gap-3">
                      <img
                        src={matchedMasterProduct.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                        alt={matchedMasterProduct.name}
                        className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0 bg-white"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <Check className="w-3 h-3 text-emerald-600" /> Master Catalog Linked
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            EAN: {matchedMasterProduct.barcode}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 truncate mt-1">
                          {matchedMasterProduct.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-0.5">
                          <span>{matchedMasterProduct.brand}</span>
                          <span>&bull;</span>
                          <span>MRP: &#8377;{matchedMasterProduct.mrp.toLocaleString('en-IN')}</span>
                          <span>&bull;</span>
                          <span>GST {matchedMasterProduct.gstRate}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-emerald-200/60 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setMatchedMasterProduct(null);
                          setExistingSearchQuery('');
                          updateDraftProduct({ existingSearchTerm: '' });
                        }}
                        className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                      >
                        Search Different Product
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSwitchToNewProduct()}
                        className="text-slate-500 hover:text-slate-700 cursor-pointer"
                      >
                        Switch to Manual
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Live Search & Autocomplete Input */
                  <div className="relative">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Search Existing Product
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by product name, model, brand, barcode..."
                        value={existingSearchQuery}
                        onChange={(e) => {
                          setExistingSearchQuery(e.target.value);
                          updateDraftProduct({ existingSearchTerm: e.target.value });
                        }}
                        className="w-full pl-9 pr-8 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      {existingSearchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setExistingSearchQuery('');
                            updateDraftProduct({ existingSearchTerm: '' });
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Results dropdown when query >= 2 */}
                    {existingSearchQuery.trim().length >= 2 && (
                      <div className="mt-2 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-20">
                        {existingSearchResults.length > 0 ? (
                          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                            {existingSearchResults.map((prod) => (
                              <div
                                key={prod.barcode}
                                className="p-2.5 hover:bg-blue-50/60 transition-colors flex items-center justify-between gap-3"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <img
                                    src={prod.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                                    alt={prod.name}
                                    className="w-10 h-10 rounded-md object-cover border border-slate-200 shrink-0 bg-white"
                                  />
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-800 truncate">
                                      {prod.name}
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                                      <span className="font-semibold text-blue-700 bg-blue-50 px-1 py-0.2 rounded">
                                        {prod.brand}
                                      </span>
                                      <span>Barcode: {prod.barcode}</span>
                                      <span>MRP: &#8377;{prod.mrp.toLocaleString('en-IN')}</span>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleSelectExistingProduct(prod)}
                                  className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
                                >
                                  <Zap className="w-3 h-3" />
                                  <span>Select &amp; Auto-fill</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-center">
                            <p className="text-xs text-slate-600">
                              No master product found matching &ldquo;{existingSearchQuery}&rdquo;.
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                updateDraftProduct({
                                  productIdentification: 'new',
                                  name: existingSearchQuery,
                                });
                                setExistingSearchQuery('');
                              }}
                              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                            >
                              <span>+ Add as New Product with this name</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Popular recommendations when query is empty */}
                    {!existingSearchQuery.trim() && (
                      <div className="mt-2">
                        <p className="text-[11px] font-medium text-slate-500 mb-1.5">
                          Quick-pick from verified store catalog:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {popularMasterProducts.map((p) => (
                            <button
                              key={p.barcode}
                              type="button"
                              onClick={() => handleSelectExistingProduct(p)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                            >
                              <Zap className="w-2.5 h-2.5 text-amber-500" />
                              <span className="truncate max-w-[180px]">{p.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card 3: Basic Product Setup */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900">Basic Product Setup</h3>
            </div>
            <p className="text-xs text-slate-500 ml-8 mb-4">
              Add basic details about your product.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Brand */}
              <div>
                <CreatableCombobox
                  label="Brand / Manufacturer"
                  required
                  value={brand}
                  options={allBrandOptions}
                  onChange={handleBrandChange}
                  placeholder="Select or type brand..."
                  itemTypeLabel="Brand"
                />
                <div className="flex items-center justify-between mt-1.5 text-[11px]">
                  <span className="text-slate-500">For local or unbranded stock:</span>
                  <button
                    type="button"
                    onClick={() => updateDraftProduct({ brand: 'Generic / Unbranded' })}
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline cursor-pointer"
                  >
                    + Set as Unbranded
                  </button>
                </div>
              </div>

              {/* HSN Code */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  HSN Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={hsnCode}
                  onChange={(e) => updateDraftProduct({ hsnCode: e.target.value })}
                  placeholder="e.g. 61091000"
                  className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                  required
                />
                {matchedHsn ? (
                  <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                    <span>Verified HSN {matchedHsn.hsnCode} — Statutory GST {matchedHsn.gstRate ?? 18}% ({matchedHsn.productType})</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-blue-600">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span>Enter the correct HSN code to ensure smooth compliance and tax calculation.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Need Help Guidance */}
        <div className="lg:col-span-4">
          <WizardHelpSidebar step={1} />
        </div>
      </div>

      {/* Sticky Bottom Navigation Footer */}
      <div className="sticky bottom-0 z-20 -mx-4 -mb-4 px-6 py-3.5 bg-white/95 backdrop-blur-sm border-t border-slate-200/80 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Step 1 of 3</span>
          <span className="text-slate-300">|</span>
          <span className="text-xs font-bold text-slate-800">Category &amp; Product Setup</span>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <span>Continue to Step 2</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
    </>
  );
};

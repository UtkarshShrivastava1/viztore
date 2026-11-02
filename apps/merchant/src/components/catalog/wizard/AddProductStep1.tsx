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
import { lookupMasterProduct, MasterCatalogProduct } from '../../../lib/masterCatalogService.js';
import { CameraBarcodeScannerModal } from '../CameraBarcodeScannerModal.js';

import masterTaxonomies from '../../../data/taxonomies.json';
import { getPreloadedAttributes } from '../../../lib/taxonomyHelper.js';

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

  const defaultCategory = React.useMemo(() => {
    return getStoreDefaultCategory(currentStore?.category);
  }, [currentStore?.category]);

  const rawCat = draftProduct.category;
  const category = rawCat ? normalizeCategoryName(rawCat) : defaultCategory;

  // All Category options = built-in keys + saved custom categories
  const allCategoryOptions = React.useMemo(() => {
    return Array.from(
      new Set([...Object.keys(categoryCatalogTree), ...(customTax.categories || [])]),
    ).filter(Boolean);
  }, [customTax.categories]);

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
    const activeCat = category || 'Men\'s Fashion';
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

  const brand = draftProduct.brand || 'Generic / Unbranded';
  const hsnCode = draftProduct.hsnCode || '61091000';

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
      hsnCode: match?.hsnCode || draftProduct.hsnCode || '61091000',
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
      .filter(
        (t) =>
          t.productType.toLowerCase().includes(q) ||
          t.subcategory.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          normalizeCategoryName(t.category).toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [quickSearch]);

  const selectHierarchy = (t: TaxonomyItem) => {
    const normCat = normalizeCategoryName(t.category);
    const preloaded = getPreloadedAttributes(normCat, t.subcategory, t.productType, draftProduct.attributes || {});
    updateDraftProduct({
      category: normCat,
      subCategory: t.subcategory,
      productType: t.productType,
      hsnCode: t.hsnCode || '61091000',
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

  const applyMasterProduct = (prod: MasterCatalogProduct, fastTrack = false) => {
    updateDraftProduct({
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
    });

    setMatchedMasterProduct(prod);
    setLookupFeedback({
      message: `Matched national master catalog for "${prod.name}"!`,
      type: 'success',
    });

    if (fastTrack) {
      setWizardStep(3);
    }
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
            <p className="text-xs text-slate-500 ml-8 mb-3">
              Choose or search across 350+ master retail categories and product types.
            </p>

            {/* Quick Auto-Complete Bar */}
            <div className="ml-8 mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  placeholder="⚡ Quick Search (e.g. Smartphones, T-Shirts, Laptop Bags, Rice, Kurta...)"
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
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900">Product Identification</h3>
            </div>
            <p className="text-xs text-slate-500 ml-8 mb-4">
              Tell us whether you want to add a new product or list an existing product from the
              master catalog.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Radio Group */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Add Product As <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="productIdentification"
                      checked={productIdentification === 'new'}
                      onChange={() => updateDraftProduct({ productIdentification: 'new' })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-semibold text-slate-800">Add New Product</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="productIdentification"
                      checked={productIdentification === 'existing'}
                      onChange={() => updateDraftProduct({ productIdentification: 'existing' })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-semibold text-slate-800">
                      Add Existing Product
                    </span>
                  </label>
                </div>
              </div>

              {/* Search Existing Product */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Search Existing Product
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled={productIdentification === 'new'}
                    placeholder="Search by product name, SKU, barcode..."
                    value={draftProduct.existingSearchTerm || ''}
                    onChange={(e) => updateDraftProduct({ existingSearchTerm: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <div className="mt-1.5 text-[11px] text-slate-500">
                  Can&apos;t find the product?{' '}
                  <button
                    type="button"
                    onClick={() => updateDraftProduct({ productIdentification: 'new' })}
                    className="text-blue-600 font-semibold hover:underline cursor-pointer"
                  >
                    Add as new product
                  </button>
                </div>
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

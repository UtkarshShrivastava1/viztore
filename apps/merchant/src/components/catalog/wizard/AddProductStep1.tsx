import React from 'react';
import { Shirt, ListFilter, LayoutGrid, Info, ArrowRight, Search } from 'lucide-react';
import { useCatalogStore } from '../../../stores/catalogStore.js';
import { WizardHelpSidebar } from './WizardHelpSidebar.js';
import { CreatableCombobox } from '../../ui/CreatableCombobox.js';
import {
  getCustomTaxonomy,
  recordCustomCategory,
  recordCustomBrand,
  mineTaxonomyFromProducts,
} from '../../../lib/customTaxonomyStorage.js';
import { useAuthStore } from '../../../stores/authStore.js';

import masterTaxonomies from '../../../data/taxonomies.json';

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
    const cat = item.category.trim();
    const sub = item.subcategory.trim();
    const pt = item.productType.trim();
    if (!cat || !sub || !pt) continue;

    if (!tree[cat]) {
      tree[cat] = { subCategories: [], productTypes: {} };
    }
    if (!tree[cat].subCategories.includes(sub)) {
      tree[cat].subCategories.push(sub);
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

  const category = draftProduct.category || 'Men';

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
      new Set([...base.subCategories, ...savedSubs, draftProduct.subCategory || 'General']),
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
    draftProduct.subCategory || currentCategoryData.subCategories[0] || 'General';
  const availableProductTypes =
    (subCategory && currentCategoryData.productTypes[subCategory]) ||
    currentCategoryData.productTypes[currentCategoryData.subCategories[0] || ''] ||
    [draftProduct.productType || 'Standard'];
  const productType = draftProduct.productType || availableProductTypes[0] || 'Standard';
  const productIdentification = draftProduct.productIdentification || 'new';
  const brand = draftProduct.brand || 'Generic / Unbranded';
  const hsnCode = draftProduct.hsnCode || '61091000';

  // All Brand options = common options + saved custom brands
  const allBrandOptions = React.useMemo(() => {
    return Array.from(
      new Set([...commonBrandOptions, ...(customTax.brands || [])]),
    ).filter(Boolean);
  }, [customTax.brands]);

  const handleCategoryChange = (newCat: string) => {
    const nextCatData = categoryCatalogTree[newCat];
    const savedSubs = customTax.subCategories[newCat] || [];
    const nextSub = nextCatData ? (nextCatData.subCategories[0] || 'General') : (savedSubs[0] || 'General');
    const nextTypes =
      (nextCatData && nextCatData.productTypes[nextSub]) ||
      customTax.productTypes[nextSub] ||
      ['Standard'];

    updateDraftProduct({
      category: newCat,
      subCategory: nextSub,
      productType: nextTypes[0] || 'Standard',
    });

    // Record custom category if not in static tree
    if (!categoryCatalogTree[newCat]) {
      const updated = recordCustomCategory(storeId, newCat, nextSub, nextTypes[0]);
      setCustomTax(updated);
    }
  };

  const handleSubCategoryChange = (newSub: string) => {
    const nextTypes =
      currentCategoryData.productTypes[newSub] ||
      customTax.productTypes[newSub] ||
      ['Standard'];

    updateDraftProduct({
      subCategory: newSub,
      productType: nextTypes[0] || 'Standard',
    });

    const updated = recordCustomCategory(storeId, category, newSub, nextTypes[0]);
    setCustomTax(updated);
  };

  const handleProductTypeChange = (newPt: string) => {
    const match = typedMasterTaxonomies.find(
      (t) =>
        t.productType.toLowerCase() === newPt.toLowerCase() &&
        (!category || t.category.toLowerCase() === category.toLowerCase()),
    );

    updateDraftProduct({
      productType: newPt,
      hsnCode: match?.hsnCode || draftProduct.hsnCode || '61091000',
      tax: match?.gstRate
        ? {
            category: match.category,
            rate: match.gstRate,
            inclusive: true,
          }
        : draftProduct.tax,
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
          t.category.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [quickSearch]);

  const selectHierarchy = (t: TaxonomyItem) => {
    updateDraftProduct({
      category: t.category,
      subCategory: t.subcategory,
      productType: t.productType,
      hsnCode: t.hsnCode || '61091000',
      tax: {
        category: t.category,
        rate: t.gstRate ?? 18,
        inclusive: true,
      },
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

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setWizardStep(2);
  };

  return (
    <form onSubmit={handleContinue} className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (8 cols): Main Form Cards */}
        <div className="lg:col-span-8 space-y-4">
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
                <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-blue-600">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>Enter the correct HSN code to ensure smooth compliance and tax calculation.</span>
                </div>
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
  );
};

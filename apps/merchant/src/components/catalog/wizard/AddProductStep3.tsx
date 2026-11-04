import React, { useState, useRef } from 'react';
import {
  Tag,
  Copy,
  Check,
  CheckCircle2,
  HelpCircle,
  Plus,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Info,
} from 'lucide-react';
import { useCatalogStore } from '../../../stores/catalogStore.js';
import { useAuthStore } from '../../../stores/authStore.js';
import { VariantMatrixBuilder } from './VariantMatrixBuilder.js';
import { ProductAttributesSection } from './ProductAttributesSection.js';
import {
  findTaxonomy,
  isFashionCategory,
  isFootwearCategory,
  isElectronicsCategory,
  isGroceryCategory,
  getContextualTagSuggestions,
} from '../../../lib/taxonomyHelper.js';

import masterTaxonomies from '../../../data/taxonomies.json';

interface TaxonomyAttribute {
  name: string;
  values: string[];
  isMultiSelect?: boolean;
  isRequired?: boolean;
}


const CATEGORY_HSN_MAP: Record<string, Array<{ code: string; label: string; rate: number }>> = {
  fashion: [
    { code: '61091000', label: '6109 - T-Shirts (Cotton)', rate: 5 },
    { code: '62034200', label: '6203 - Trousers & Jeans', rate: 12 },
    { code: '62044200', label: '6204 - Dresses & Kurtis', rate: 12 },
    { code: '64039990', label: '6403 - Shoes & Footwear', rate: 12 },
  ],
  grocery: [
    { code: '07019000', label: '0701 - Fresh Vegetables', rate: 0 },
    { code: '08109090', label: '0810 - Fresh Fruits', rate: 0 },
    { code: '10063010', label: '1006 - Rice & Grains', rate: 0 },
    { code: '19053100', label: '1905 - Biscuits & Bakery', rate: 18 },
    { code: '21069099', label: '2106 - Packaged Snacks', rate: 12 },
  ],
  electronics: [
    { code: '85171300', label: '8517 - Mobile Phones', rate: 18 },
    { code: '84713010', label: '8471 - Laptops & Tablets', rate: 18 },
    { code: '85287200', label: '8528 - Smart TVs & Monitors', rate: 18 },
    { code: '85044090', label: '8504 - Chargers & Adapters', rate: 18 },
  ],
  general: [
    { code: '48201090', label: '4820 - Books & Stationery', rate: 12 },
    { code: '95030099', label: '9503 - Toys & Games', rate: 12 },
    { code: '33049990', label: '3304 - Beauty & Skincare', rate: 18 },
  ],
};

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const AddProductStep3: React.FC = () => {
  const { draftProduct, updateDraftProduct, setWizardStep, setActiveView } = useCatalogStore();
  const { currentStore } = useAuthStore();
  const activeStoreName = currentStore?.name || 'Main Store';

  const [tagInput, setTagInput] = useState('');
  const [copiedSku, setCopiedSku] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const matchedTaxonomy = React.useMemo(() => {
    return findTaxonomy(draftProduct.category, draftProduct.subCategory, draftProduct.productType);
  }, [draftProduct.category, draftProduct.subCategory, draftProduct.productType]);

  const dynamicTagSuggestions = React.useMemo(() => {
    return getContextualTagSuggestions(
      draftProduct.category,
      draftProduct.subCategory,
      draftProduct.productType,
      draftProduct.brand,
    );
  }, [draftProduct.category, draftProduct.subCategory, draftProduct.productType, draftProduct.brand]);

  const dynamicAttributes: TaxonomyAttribute[] = matchedTaxonomy?.attributes || [];

  const tags = draftProduct.tags || [];
  const attributes = draftProduct.attributes || {};
  const status = draftProduct.status || 'active';
  const storage = draftProduct.storageLocation || {
    warehouse: activeStoreName,
    room: '',
    rack: '',
    shelf: '',
    bin: '',
    description: '',
  };
  const price = draftProduct.price !== undefined && draftProduct.price !== null ? draftProduct.price : '';
  const costPrice = draftProduct.costPrice !== undefined && draftProduct.costPrice !== null ? draftProduct.costPrice : '';
  const mrp = draftProduct.mrp !== undefined && draftProduct.mrp !== null ? draftProduct.mrp : '';
  const tax = draftProduct.tax || {
    category: matchedTaxonomy?.category ? `${matchedTaxonomy.category} (${matchedTaxonomy.gstRate ?? 18}%)` : 'Standard (18%)',
    rate: matchedTaxonomy?.gstRate ?? 18,
    inclusive: true,
    amount: 0,
  };
  const stock = draftProduct.stock !== undefined && draftProduct.stock !== null ? draftProduct.stock : '';
  const lowStockThreshold = draftProduct.lowStockThreshold !== undefined && draftProduct.lowStockThreshold !== null ? draftProduct.lowStockThreshold : '';
  const trackInventory = draftProduct.trackInventory ?? true;
  const hasVariants = attributes.hasVariants === 'true';

  // White-label generic SKU: Ensure PRD- format, never VZT-
  const currentSku =
    draftProduct.sku && !draftProduct.sku.startsWith('VZT-')
      ? draftProduct.sku
      : `PRD-${new Date().toISOString().slice(0, 10)}-000124`;

  const handleAddTag = (newTag: string) => {
    const trimmed = newTag.trim().toLowerCase();
    if (!trimmed || tags.includes(trimmed) || tags.length >= 30) return;
    updateDraftProduct({ tags: [...tags, trimmed] });
    setTagInput('');
  };

  const handleRemoveTag = (index: number) => {
    const next = [...tags];
    next.splice(index, 1);
    updateDraftProduct({ tags: next });
  };

  const handleCopySku = () => {
    navigator.clipboard.writeText(currentSku);
    setCopiedSku(true);
    setTimeout(() => setCopiedSku(false), 2000);
  };

  const handlePriceChange = (valStr: string) => {
    if (valStr === '') {
      updateDraftProduct({
        price: undefined,
        tax: { ...tax, amount: 0 },
      });
      return;
    }
    const parsed = parseFloat(valStr);
    const safeNum = isNaN(parsed) ? undefined : parsed;
    const newRate = tax.rate || 0;
    const taxAmt = safeNum !== undefined ? Number(((safeNum * newRate) / 100).toFixed(2)) : 0;

    // Synchronize price to matrix variants
    const distinctPrices = Array.isArray(draftProduct.variants)
      ? new Set(draftProduct.variants.map((v) => v.price).filter((p) => typeof p === 'number' && p > 0))
      : new Set();
    const hasDistinctVariantPrices = distinctPrices.size > 1;

    const updatedVariants = safeNum !== undefined && Array.isArray(draftProduct.variants)
      ? draftProduct.variants.map((v) => ({
          ...v,
          price: (hasDistinctVariantPrices && v.isCustomPrice && typeof v.price === 'number' && v.price > 0)
            ? v.price
            : safeNum,
          ...(hasDistinctVariantPrices ? {} : { isCustomPrice: false }),
        }))
      : draftProduct.variants;

    updateDraftProduct({
      price: safeNum,
      tax: { ...tax, amount: taxAmt },
      ...(updatedVariants ? { variants: updatedVariants } : {}),
    });
  };

  const handleTaxRateChange = (rateVal: number) => {
    const currentPrice = Number(draftProduct.price || 0);
    const taxAmt = Number(((currentPrice * rateVal) / 100).toFixed(2));
    updateDraftProduct({
      tax: { ...tax, rate: rateVal, amount: taxAmt },
    });
  };

  const handleSubmitToPreview = (e: React.FormEvent) => {
    e.preventDefault();
    const effectivePrice = draftProduct.price !== undefined ? draftProduct.price : 0;
    const effectiveMrp = draftProduct.mrp !== undefined ? draftProduct.mrp : effectivePrice;
    const effectiveCost = draftProduct.costPrice;

    // Check if variants have different individual prices
    const distinctPrices = Array.isArray(draftProduct.variants)
      ? new Set(draftProduct.variants.map((v) => v.price).filter((p) => typeof p === 'number' && p > 0))
      : new Set();
    const hasDistinctVariantPrices = distinctPrices.size > 1;

    // Ensure all existing variants take the authoritative price and MRP from Section 5
    const syncedVariants = Array.isArray(draftProduct.variants)
      ? draftProduct.variants.map((v) => ({
          ...v,
          price: (hasDistinctVariantPrices && v.isCustomPrice && typeof v.price === 'number' && v.price > 0)
            ? v.price
            : (effectivePrice > 0 ? effectivePrice : (typeof v.price === 'number' ? v.price : 0)),
          mrp: (hasDistinctVariantPrices && v.isCustomPrice && typeof v.mrp === 'number' && v.mrp > 0)
            ? v.mrp
            : (effectiveMrp > 0 ? effectiveMrp : (typeof v.mrp === 'number' ? v.mrp : effectivePrice)),
          costPrice: effectiveCost !== undefined ? effectiveCost : v.costPrice,
        }))
      : [];

    updateDraftProduct({
      sku: currentSku,
      status,
      stock: Number(draftProduct.stock || 0),
      price: effectivePrice,
      costPrice: effectiveCost,
      mrp: effectiveMrp,
      storageLocation: storage,
      tax,
      attributes,
      tags,
      variants: syncedVariants,
    });
    setActiveView('preview');
  };

  return (
    <form onSubmit={handleSubmitToPreview} className="space-y-4 pb-12">
      {/* 3-Column Top Grid: Card 1 (Keywords), Card 2 (Attributes), Card 3 (Status) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 1. Search / SEO Keywords (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="text-xs font-bold text-slate-900">Search / SEO Keywords</h3>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Add relevant keywords and tags to make your product easy to search.
            </p>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tags / Search Keywords</span>
                  <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                  {tags.length}/30 tags
                </span>
              </div>

              {/* Explicit Clear Input Field with integrated [ + Add ] button */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        if (tagInput.trim()) {
                          handleAddTag(tagInput.replace(/,/g, ''));
                        }
                      }
                    }}
                    ref={tagInputRef}
                    placeholder="Type keyword & press Enter (e.g. Cotton, Slim Fit)..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0038ed] focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs font-medium"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (tagInput.trim()) {
                      handleAddTag(tagInput.replace(/,/g, ''));
                    }
                  }}
                  disabled={!tagInput.trim() || tags.length >= 30}
                  className="px-3.5 py-2 rounded-xl bg-[#0038ed] hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer disabled:cursor-not-allowed shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Active Tags Showcase Container */}
              <div className="min-h-[52px] p-2.5 bg-slate-50/80 border border-slate-200/90 rounded-xl">
                {tags.length === 0 ? (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 py-1 px-1">
                    <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>No keywords added yet. Type above or click suggestions below.</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg text-xs font-semibold bg-white text-blue-700 border border-blue-200 shadow-2xs group hover:border-blue-400 transition-all"
                      >
                        <span>{t}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(idx)}
                          className="w-4 h-4 rounded-md flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                          title="Remove tag"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => updateDraftProduct({ tags: [] })}
                        className="text-[11px] font-bold text-rose-500 hover:text-rose-700 hover:underline px-2 py-0.5 cursor-pointer ml-auto"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Popular Suggestions with + indicator */}
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-600 mb-1.5 flex items-center justify-between">
                <span>Quick Suggestions:</span>
                <span className="text-[10px] text-slate-400 font-normal">Click to add</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {dynamicTagSuggestions.map((sug) => {
                  const isAdded = tags.includes(sug.toLowerCase());
                  return (
                    <button
                      key={sug}
                      type="button"
                      disabled={isAdded || tags.length >= 30}
                      onClick={() => handleAddTag(sug)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer flex items-center gap-1 ${
                        isAdded
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default opacity-80'
                          : 'bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 border-slate-200 hover:border-blue-300 shadow-2xs active:scale-95'
                      }`}
                    >
                      {isAdded ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Plus className="w-3 h-3 text-slate-400" />
                      )}
                      <span>{sug}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Product Attributes (4 cols) */}
        <ProductAttributesSection
          brand={draftProduct.brand}
          category={draftProduct.category || ''}
          subCategory={draftProduct.subCategory || ''}
          productType={draftProduct.productType || ''}
          attributes={attributes}
          onChangeAttributes={(updated) => updateDraftProduct({ attributes: updated })}
          matchedTaxonomy={matchedTaxonomy}
          shelfLocation={draftProduct.shelfLocation}
          onChangeShelfLocation={(loc) => updateDraftProduct({ shelfLocation: loc })}
          hasVariants={hasVariants}
          onToggleVariants={(checked) =>
            updateDraftProduct({
              attributes: { ...attributes, hasVariants: String(checked) },
            })
          }
        />

        {/* 3. Product Status (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="text-xs font-bold text-slate-900">Product Status</h3>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">Customer visibility</p>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={status === 'active'}
                  onChange={() => updateDraftProduct({ status: 'active' })}
                  className="text-blue-600"
                />
                <span>Active</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={status === 'inactive'}
                  onChange={() => updateDraftProduct({ status: 'inactive' })}
                  className="text-blue-600"
                />
                <span>Inactive</span>
              </label>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-emerald-50/80 border border-emerald-200/60 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="text-[11px] text-emerald-800 font-medium">
              {status === 'active'
                ? 'Active products will be visible in your store.'
                : 'Inactive products are hidden from customers.'}
            </span>
          </div>
        </div>
      </div>

      {/* Row 1.5: Amazon / Flipkart Multi-SKU Variant Matrix Generator (Conditional) */}
      {hasVariants && (
        <div className="bg-white rounded-xl border border-blue-200/90 p-5 shadow-2xs">
          <VariantMatrixBuilder />
        </div>
      )}

      {/* Row 2: Card 4 (Storage Location), Card 5 (Pricing), Card 6 (Tax) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 4. Storage Location (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              4
            </div>
            <h3 className="text-xs font-bold text-slate-900">
              Storage Location <span className="font-normal text-slate-400">(Where stored)</span>
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-slate-600">
                  Warehouse / Store Location <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400">Select or type custom</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  list="warehouse-locations-list"
                  value={storage.warehouse || ''}
                  onChange={(e) =>
                    updateDraftProduct({ storageLocation: { ...storage, warehouse: e.target.value } })
                  }
                  placeholder={`e.g. ${activeStoreName}, Main Godown, Backroom...`}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-medium text-slate-900 placeholder:font-normal placeholder:text-slate-400"
                />
                <datalist id="warehouse-locations-list">
                  <option value={activeStoreName} />
                  <option value={`${activeStoreName} (Store Front / Display)`} />
                  <option value={`${activeStoreName} (Backroom Storage)`} />
                  <option value="Main Warehouse" />
                  <option value="Central Godown" />
                  <option value="Retail Outlet Shelf" />
                </datalist>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-1 mt-1.5">
                {[
                  activeStoreName,
                  `${activeStoreName} Backroom`,
                  'Main Warehouse',
                  'Central Godown',
                ].filter(Boolean).map((locPreset) => (
                  <button
                    key={locPreset}
                    type="button"
                    onClick={() =>
                      updateDraftProduct({
                        storageLocation: { ...storage, warehouse: locPreset },
                      })
                    }
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer border ${
                      storage.warehouse === locPreset
                        ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    + {locPreset}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Room</label>
                <input
                  type="text"
                  value={storage.room || ''}
                  placeholder="e.g. 101"
                  onChange={(e) =>
                    updateDraftProduct({ storageLocation: { ...storage, room: e.target.value } })
                  }
                  className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md placeholder:text-slate-300"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Rack No.</label>
                <input
                  type="text"
                  value={storage.rack || ''}
                  placeholder="e.g. R-05"
                  onChange={(e) =>
                    updateDraftProduct({ storageLocation: { ...storage, rack: e.target.value } })
                  }
                  className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md placeholder:text-slate-300"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Shelf No.</label>
                <input
                  type="text"
                  value={storage.shelf || ''}
                  placeholder="e.g. S-02"
                  onChange={(e) =>
                    updateDraftProduct({ storageLocation: { ...storage, shelf: e.target.value } })
                  }
                  className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md placeholder:text-slate-300"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Bin No.</label>
                <input
                  type="text"
                  value={storage.bin || ''}
                  placeholder="e.g. B-03"
                  onChange={(e) =>
                    updateDraftProduct({ storageLocation: { ...storage, bin: e.target.value } })
                  }
                  className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md placeholder:text-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                value={storage.description || ''}
                onChange={(e) =>
                  updateDraftProduct({
                    storageLocation: { ...storage, description: e.target.value },
                  })
                }
                placeholder="e.g. Near billing counter, second rack"
                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg placeholder:text-slate-300"
              />
            </div>
          </div>
        </div>

        {/* 5. Pricing (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              5
            </div>
            <h3 className="text-xs font-bold text-slate-900">Pricing</h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Selling Price (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={price}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-900 border border-slate-200 rounded-lg placeholder:text-slate-400 placeholder:font-normal focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Cost Price (₹) <span className="text-slate-400">(Optional)</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={costPrice}
                onChange={(e) => {
                  const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
                  updateDraftProduct({ costPrice: isNaN(val as number) ? undefined : val });
                }}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                MRP (₹) <span className="text-slate-400">(Optional)</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={mrp}
                onChange={(e) => {
                  const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
                  const safeVal = isNaN(val as number) ? undefined : val;
                  const updatedVariants = safeVal !== undefined && Array.isArray(draftProduct.variants)
                    ? draftProduct.variants.map((v) => ({
                        ...v,
                        mrp: v.isCustomPrice ? v.mrp : safeVal,
                      }))
                    : draftProduct.variants;
                  updateDraftProduct({
                    mrp: safeVal,
                    ...(updatedVariants ? { variants: updatedVariants } : {}),
                  });
                }}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Currency</label>
              <select className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg cursor-pointer">
                <option>INR (₹)</option>
              </select>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">MRP is inclusive of all taxes.</div>
        </div>

        {/* 6. Tax (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              6
            </div>
            <h3 className="text-xs font-bold text-slate-900">Tax</h3>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                HSN / SAC Code <span className="text-slate-400 font-normal">(Auto-Suggested)</span>
              </label>
              <input
                type="text"
                value={draftProduct.hsnCode ?? (matchedTaxonomy?.hsnCode || ((draftProduct.category || '').toLowerCase().includes('groc') ? '07019000' : (draftProduct.category || '').toLowerCase().includes('elect') ? '85171300' : '61091000'))}
                onChange={(e) => updateDraftProduct({ hsnCode: e.target.value })}
                placeholder="e.g. 8517, 6109"
                className="w-full px-2.5 py-1.5 text-xs font-mono font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              {/* Category-Specific Dynamic HSN Suggestions */}
              <div className="mt-1 flex flex-wrap gap-1">
                {((CATEGORY_HSN_MAP[((draftProduct.category || '').toLowerCase().includes('groc') ? 'grocery' : (draftProduct.category || '').toLowerCase().includes('elect') ? 'electronics' : 'fashion')] || CATEGORY_HSN_MAP.fashion) ?? []).map((sug) => (
                  <button
                    key={sug.code}
                    type="button"
                    onClick={() => updateDraftProduct({
                      hsnCode: sug.code,
                      tax: {
                        category: `Standard (${sug.rate}%)`,
                        rate: sug.rate,
                        inclusive: true,
                        amount: Number(((Number(draftProduct.price || 0) * sug.rate) / 100).toFixed(2))
                      }
                    })}
                    className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 transition-colors"
                    title={sug.label}
                  >
                    {sug.code.slice(0, 4)} ({sug.rate}%)
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Tax Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={tax.category}
                onChange={(e) => {
                  const val = e.target.value;
                  let rate = tax.rate;
                  if (val.includes('0%')) rate = 0;
                  else if (val.includes('5%')) rate = 5;
                  else if (val.includes('12%')) rate = 12;
                  else if (val.includes('18%')) rate = 18;
                  else if (val.includes('28%')) rate = 28;
                  updateDraftProduct({ tax: { ...tax, category: val, rate } });
                }}
                className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg cursor-pointer"
              >
                {matchedTaxonomy?.category && (
                  <option value={`${matchedTaxonomy.category} (${matchedTaxonomy.gstRate ?? 18}%)`}>
                    {matchedTaxonomy.category} ({matchedTaxonomy.gstRate ?? 18}%)
                  </option>
                )}
                <option value="Zero (0%)">Zero GST (0%)</option>
                <option value="Apparel & Essentials (5%)">Apparel &amp; Essentials (5%)</option>
                <option value="Footwear & Healthcare (12%)">Footwear &amp; Healthcare (12%)</option>
                <option value="Standard Electronics & Goods (18%)">Standard Goods (18%)</option>
                <option value="Luxury & Appliances (28%)">Luxury &amp; Appliances (28%)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Tax Rate (%)
              </label>
              <input
                type="number"
                value={tax.rate}
                onChange={(e) => handleTaxRateChange(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Tax Amount (₹)
              </label>
              <input
                type="text"
                readOnly
                value={tax.amount || 28.52}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-600"
              />
            </div>

            <div className="col-span-2 flex items-center justify-between pt-1">
              <label className="text-[11px] font-medium text-slate-600">Price is Inclusive of Tax</label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">{tax.inclusive ? 'Yes' : 'No'}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tax.inclusive}
                    onChange={(e) =>
                      updateDraftProduct({ tax: { ...tax, inclusive: e.target.checked } })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-slate-400">Final selling price includes GST according to Indian Statutory Schedule.</div>
        </div>
      </div>

      {/* Row 3: Card 7 (Inventory), Card 8 (Additional Info), Card 9 (Other Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 7. Inventory (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              7
            </div>
            <h3 className="text-xs font-bold text-slate-900">Inventory</h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Stock Quantity <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 50"
                    value={stock}
                    onChange={(e) => {
                      const val = e.target.value === '' ? undefined : parseInt(e.target.value);
                      updateDraftProduct({ stock: isNaN(val as number) ? undefined : val });
                    }}
                    className="w-full pr-8 pl-2 py-1.5 text-xs font-bold text-slate-900 border border-slate-200 rounded-lg placeholder:text-slate-400 placeholder:font-normal focus:outline-hidden focus:border-blue-500"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                    Pcs
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Low Stock Alert
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 5"
                    value={lowStockThreshold}
                    onChange={(e) => {
                      const val = e.target.value === '' ? undefined : parseInt(e.target.value);
                      updateDraftProduct({ lowStockThreshold: isNaN(val as number) ? undefined : val });
                    }}
                    className="w-full pr-8 pl-2 py-1.5 text-xs border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                    Pcs
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <div>
                <div className="text-xs font-semibold text-slate-800">Track inventory</div>
                <div className="text-[10px] text-slate-400">Turn on for stock levels</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={trackInventory}
                  onChange={(e) => updateDraftProduct({ trackInventory: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>
          </div>
        </div>

        {/* 8. Additional Information (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              8
            </div>
            <h3 className="text-xs font-bold text-slate-900">
              Additional Information <span className="font-normal text-slate-400">(Optional)</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Country of Origin
              </label>
              <select
                value={draftProduct.countryOfOrigin || 'India'}
                onChange={(e) => updateDraftProduct({ countryOfOrigin: e.target.value })}
                className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg cursor-pointer"
              >
                <option value="India">India</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Vietnam">Vietnam</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Warranty</label>
              <select
                value={draftProduct.warranty || 'No Warranty'}
                onChange={(e) => updateDraftProduct({ warranty: e.target.value })}
                className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg cursor-pointer"
              >
                <option value="No Warranty">No Warranty</option>
                <option value="30 Days Replacement">30 Days</option>
                <option value="6 Months">6 Months</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Returnable</label>
              <select
                value={draftProduct.isReturnable ? 'Yes' : 'No'}
                onChange={(e) => updateDraftProduct({ isReturnable: e.target.value === 'Yes' })}
                className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg cursor-pointer"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Weight</label>
              <div className="relative">
                <input
                  type="text"
                  value={draftProduct.weight || '0.250'}
                  onChange={(e) => updateDraftProduct({ weight: e.target.value })}
                  className="w-full pr-7 pl-2 py-1.5 text-xs border border-slate-200 rounded-lg"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                  kg
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Dimensions (L × W × H in cm)
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <input
                type="text"
                placeholder="L: 30"
                value={draftProduct.dimensions?.length || '30'}
                onChange={(e) =>
                  updateDraftProduct({
                    dimensions: {
                      ...(draftProduct.dimensions || { length: '30', width: '20', height: '2' }),
                      length: e.target.value,
                    },
                  })
                }
                className="px-2 py-1 text-xs border border-slate-200 rounded-md text-center"
              />
              <input
                type="text"
                placeholder="W: 20"
                value={draftProduct.dimensions?.width || '20'}
                onChange={(e) =>
                  updateDraftProduct({
                    dimensions: {
                      ...(draftProduct.dimensions || { length: '30', width: '20', height: '2' }),
                      width: e.target.value,
                    },
                  })
                }
                className="px-2 py-1 text-xs border border-slate-200 rounded-md text-center"
              />
              <input
                type="text"
                placeholder="H: 2"
                value={draftProduct.dimensions?.height || '2'}
                onChange={(e) =>
                  updateDraftProduct({
                    dimensions: {
                      ...(draftProduct.dimensions || { length: '30', width: '20', height: '2' }),
                      height: e.target.value,
                    },
                  })
                }
                className="px-2 py-1 text-xs border border-slate-200 rounded-md text-center"
              />
            </div>
          </div>
        </div>

        {/* 9. Other Details (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              9
            </div>
            <h3 className="text-xs font-bold text-slate-900">
              Other Details <span className="font-normal text-slate-400">(Optional)</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                Material
              </label>
              <input
                type="text"
                value={draftProduct.material || ''}
                placeholder="e.g. 100% Cotton, Stainless Steel, Wood, Plastic, Organic..."
                onChange={(e) => updateDraftProduct({ material: e.target.value })}
                className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                Care Instructions
              </label>
              <input
                type="text"
                value={draftProduct.careInstructions || ''}
                placeholder="e.g. Store in a cool dry place, Machine wash cold, Keep away from heat..."
                onChange={(e) => updateDraftProduct({ careInstructions: e.target.value })}
                className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
              Meta Title (SEO)
            </label>
            <input
              type="text"
              value={draftProduct.metaTitle || ''}
              placeholder={
                draftProduct.name
                  ? `${draftProduct.name} - Buy Online at Best Price`
                  : 'e.g. Product Name - Buy Online at Best Price'
              }
              onChange={(e) => updateDraftProduct({ metaTitle: e.target.value })}
              className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
              Meta Description (SEO)
            </label>
            <input
              type="text"
              value={draftProduct.metaDescription || ''}
              placeholder={
                draftProduct.description
                  ? draftProduct.description.slice(0, 140)
                  : 'Enter short product summary for search engines...'
              }
              onChange={(e) => updateDraftProduct({ metaDescription: e.target.value })}
              className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* 10. Auto-generated SKU Banner */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
            10
          </div>
          <span className="text-xs font-bold text-slate-800">Auto-generated SKU</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
            <span className="font-mono text-xs font-bold text-slate-800 tracking-wider">
              {currentSku}
            </span>
            <button
              type="button"
              onClick={handleCopySku}
              className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
              title="Copy SKU"
            >
              {copiedSku ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <span className="text-[11px] text-slate-400">SKU is auto-generated and unique.</span>
        </div>
      </div>

      {/* Sticky Bottom Navigation Footer */}
      <div className="sticky bottom-0 z-20 -mx-4 -mb-4 px-6 py-3.5 bg-white/95 backdrop-blur-sm border-t border-slate-200/80 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Step 3 of 3</span>
          <span className="text-slate-300">|</span>
          <span className="text-xs font-bold text-slate-800">Pricing, Inventory &amp; Compliance</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setWizardStep(2)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <span>Preview &amp; Submit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </form>
  );
};

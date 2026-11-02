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
} from 'lucide-react';
import { useCatalogStore } from '../../../stores/catalogStore.js';
import { VariantMatrixBuilder } from './VariantMatrixBuilder.js';
import { findTaxonomy, isFashionCategory, isFootwearCategory, isElectronicsCategory, isGroceryCategory } from '../../../lib/taxonomyHelper.js';

const popularTagSuggestions = [
  'Cotton',
  'T-Shirt',
  'Round Neck',
  'Men',
  'Black',
  'Casual',
  'Comfort Fit',
  'Summer Wear',
];

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

  const [tagInput, setTagInput] = useState('');
  const [copiedSku, setCopiedSku] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const matchedTaxonomy = React.useMemo(() => {
    return findTaxonomy(draftProduct.category, draftProduct.subCategory, draftProduct.productType);
  }, [draftProduct.category, draftProduct.subCategory, draftProduct.productType]);

  const dynamicAttributes: TaxonomyAttribute[] = matchedTaxonomy?.attributes || [];

  const tags = draftProduct.tags || [];
  const attributes = draftProduct.attributes || {};
  const status = draftProduct.status || 'active';
  const storage = draftProduct.storageLocation || {
    warehouse: 'Main Warehouse',
    room: 'Room 101',
    rack: 'R-05',
    shelf: 'S-02',
    bin: 'B-03',
    description: 'Near window side, second rack',
  };
  const price = draftProduct.price ?? 599;
  const costPrice = draftProduct.costPrice ?? 350;
  const mrp = draftProduct.mrp ?? 699;
  const tax = draftProduct.tax || {
    category: matchedTaxonomy?.category ? `${matchedTaxonomy.category} (${matchedTaxonomy.gstRate ?? 18}%)` : 'Standard (18%)',
    rate: matchedTaxonomy?.gstRate ?? 18,
    inclusive: true,
    amount: 28.52,
  };
  const stock = draftProduct.stock ?? 120;
  const lowStockThreshold = draftProduct.lowStockThreshold ?? 10;
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

  const handlePriceChange = (val: number) => {
    const newRate = tax.rate || 5;
    const taxAmt = Number(((val * newRate) / 100).toFixed(2));
    updateDraftProduct({
      price: val,
      tax: { ...tax, amount: taxAmt },
    });
  };

  const handleTaxRateChange = (rateVal: number) => {
    const taxAmt = Number(((price * rateVal) / 100).toFixed(2));
    updateDraftProduct({
      tax: { ...tax, rate: rateVal, amount: taxAmt },
    });
  };

  const handleSubmitToPreview = (e: React.FormEvent) => {
    e.preventDefault();
    updateDraftProduct({
      sku: currentSku,
      status,
      stock,
      price,
      costPrice,
      mrp,
      storageLocation: storage,
      tax,
      attributes,
      tags,
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Tags / Keywords <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">{tags.length}/30</span>
              </div>

              {/* Tag input and active pills */}
              <div onClick={() => tagInputRef.current?.focus()} className="min-h-[70px] p-2 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap gap-1.5 items-center cursor-text focus-within:bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                {tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(idx)}
                      className="hover:text-blue-900 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(tagInput);
                    }
                  }}
                  ref={tagInputRef}
                  placeholder="+ Add tag (press Enter)"
                  className="text-xs bg-transparent border-none outline-hidden placeholder-slate-400 flex-1 min-w-[120px]"
                />
              </div>
            </div>
          </div>

          {/* Popular Suggestions */}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="text-[11px] font-semibold text-slate-600 mb-1.5">
              Popular Suggestions
            </div>
            <div className="flex flex-wrap gap-1.5">
              {popularTagSuggestions.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => handleAddTag(sug)}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 border border-slate-200/80 transition-colors cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Product Attributes (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="text-xs font-bold text-slate-900">Product Attributes</h3>
            </div>
            {matchedTaxonomy && (
              <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {matchedTaxonomy.productType} ({dynamicAttributes.length} specs)
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mb-2">
            Schema-driven attributes for <span className="font-semibold text-slate-700">{draftProduct.productType || 'Standard'}</span>.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs max-h-[260px] overflow-y-auto pr-1">
            {dynamicAttributes.length > 0 ? (
              dynamicAttributes.map((attr: TaxonomyAttribute, idx: number) => (
                <div key={idx} className={attr.values && attr.values.length > 8 ? 'col-span-2' : ''}>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    {attr.name} {attr.isRequired && <span className="text-rose-500">*</span>}
                  </label>
                  {attr.values && attr.values.length > 0 ? (
                    <select
                      value={attributes[attr.name] || ''}
                      onChange={(e) =>
                        updateDraftProduct({
                          attributes: { ...attributes, [attr.name]: e.target.value },
                        })
                      }
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg cursor-pointer focus:outline-hidden focus:border-blue-500"
                    >
                      <option value="">Select {attr.name}...</option>
                      {attr.values.map((val: string, vIdx: number) => (
                        <option key={vIdx} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={attributes[attr.name] || ''}
                      placeholder={`Enter ${attr.name.toLowerCase()}...`}
                      onChange={(e) =>
                        updateDraftProduct({
                          attributes: { ...attributes, [attr.name]: e.target.value },
                        })
                      }
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  )}
                </div>
              ))
            ) : (
              <>
                {((draftProduct.category || '').toLowerCase().includes('groc') || (draftProduct.category || '').toLowerCase().includes('food')) ? (
                  <>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Net Qty / Weight</label>
                      <select
                        value={attributes.weight || '500g'}
                        onChange={(e) => updateDraftProduct({ attributes: { ...attributes, weight: e.target.value } })}
                        className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg cursor-pointer"
                      >
                        <option value="100g">100g</option>
                        <option value="250g">250g</option>
                        <option value="500g">500g</option>
                        <option value="1kg">1 kg</option>
                        <option value="2kg">2 kg</option>
                        <option value="5kg">5 kg</option>
                        <option value="500ml">500 ml</option>
                        <option value="1L">1 Litre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Dietary Type</label>
                      <select
                        value={attributes.dietary || 'Vegetarian'}
                        onChange={(e) => updateDraftProduct({ attributes: { ...attributes, dietary: e.target.value } })}
                        className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg cursor-pointer"
                      >
                        <option value="Vegetarian">🟢 100% Vegetarian</option>
                        <option value="Non-Vegetarian">🔴 Non-Vegetarian</option>
                        <option value="Vegan">🌱 Vegan</option>
                      </select>
                    </div>
                  </>
                ) : ((draftProduct.category || '').toLowerCase().includes('elect') || (draftProduct.category || '').toLowerCase().includes('gadget') || (draftProduct.category || '').toLowerCase().includes('mobile')) ? (
                  <>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Warranty</label>
                      <select
                        value={attributes.warranty || '1 Year Brand Warranty'}
                        onChange={(e) => updateDraftProduct({ attributes: { ...attributes, warranty: e.target.value } })}
                        className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg cursor-pointer"
                      >
                        <option value="No Warranty">No Warranty</option>
                        <option value="6 Months Brand Warranty">6 Months Brand Warranty</option>
                        <option value="1 Year Brand Warranty">1 Year Comprehensive Warranty</option>
                        <option value="2 Years Brand Warranty">2 Years Brand Warranty</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Power / Specs</label>
                      <input
                        type="text"
                        value={attributes.power || ''}
                        placeholder="e.g. 65W Fast Charge"
                        onChange={(e) => updateDraftProduct({ attributes: { ...attributes, power: e.target.value } })}
                        className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Fit Type</label>
                      <select
                        value={attributes.fit || 'Regular'}
                        onChange={(e) => updateDraftProduct({ attributes: { ...attributes, fit: e.target.value } })}
                        className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg cursor-pointer"
                      >
                        <option value="Regular">Regular</option>
                        <option value="Slim Fit">Slim Fit</option>
                        <option value="Relaxed">Relaxed</option>
                        <option value="Oversized">Oversized</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Fabric</label>
                      <select
                        value={attributes.fabric || 'Cotton'}
                        onChange={(e) => updateDraftProduct({ attributes: { ...attributes, fabric: e.target.value } })}
                        className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg cursor-pointer"
                      >
                        <option value="Cotton">Cotton</option>
                        <option value="Cotton Blend">Cotton Blend</option>
                        <option value="Polyester">Polyester</option>
                        <option value="Linen">Linen</option>
                        <option value="Denim">Denim</option>
                      </select>
                    </div>
                  </>
                )}
                <div className="col-span-2 pt-1 border-t border-slate-100">
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Physical Shelf / Aisle Location <span className="text-slate-400 font-normal">(For Order Pickers)</span>
                  </label>
                  <input
                    type="text"
                    value={draftProduct.shelfLocation || attributes.shelfLocation || ''}
                    placeholder="e.g. Aisle 3 - Rack B or Shelf F-12"
                    onChange={(e) => updateDraftProduct({
                      shelfLocation: e.target.value,
                      attributes: { ...attributes, shelfLocation: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 font-medium"
                  />
                </div>
              </>
            )}
          </div>

          {/* Size Pills (Only shown for fashion / footwear) */}
          {(isFashionCategory(draftProduct.category, draftProduct.subCategory) || isFootwearCategory(draftProduct.category, draftProduct.subCategory)) && (
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-600 mb-1.5">
                {isFootwearCategory(draftProduct.category, draftProduct.subCategory) ? 'Shoe Size (UK)' : 'Size Options'}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(isFootwearCategory(draftProduct.category, draftProduct.subCategory)
                  ? ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']
                  : ['XS', 'S', 'M', 'L', 'XL', '2XL']
                ).map((sz) => {
                  const isSelected = (attributes.size || (isFootwearCategory(draftProduct.category, draftProduct.subCategory) ? 'UK 8' : 'M')) === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() =>
                        updateDraftProduct({ attributes: { ...attributes, size: sz } })
                      }
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Variant Toggle Switch */}
          <div className="pt-2 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-800">
                This product has multiple variants
              </div>
              <div className="text-[10px] text-slate-400">Options like size, color, etc.</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={hasVariants}
                onChange={(e) =>
                  updateDraftProduct({
                    attributes: { ...attributes, hasVariants: String(e.target.checked) },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>
        </div>

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
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Warehouse / Store <span className="text-rose-500">*</span>
              </label>
              <select
                value={storage.warehouse}
                onChange={(e) =>
                  updateDraftProduct({ storageLocation: { ...storage, warehouse: e.target.value } })
                }
                className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg cursor-pointer"
              >
                <option value="Main Warehouse">Main Warehouse</option>
                <option value="North Hub">North Hub</option>
                <option value="Retail Outlet Shelf">Retail Outlet Shelf</option>
              </select>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Room</label>
                <input
                  type="text"
                  value={storage.room || ''}
                  onChange={(e) =>
                    updateDraftProduct({ storageLocation: { ...storage, room: e.target.value } })
                  }
                  className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Rack No.</label>
                <input
                  type="text"
                  value={storage.rack || ''}
                  onChange={(e) =>
                    updateDraftProduct({ storageLocation: { ...storage, rack: e.target.value } })
                  }
                  className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Shelf No.</label>
                <input
                  type="text"
                  value={storage.shelf || ''}
                  onChange={(e) =>
                    updateDraftProduct({ storageLocation: { ...storage, shelf: e.target.value } })
                  }
                  className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Bin No.</label>
                <input
                  type="text"
                  value={storage.bin || ''}
                  onChange={(e) =>
                    updateDraftProduct({ storageLocation: { ...storage, bin: e.target.value } })
                  }
                  className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md"
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
                placeholder="e.g. Near window side, second rack"
                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg"
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
                value={price}
                onChange={(e) => handlePriceChange(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-900 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Cost Price (₹) <span className="text-slate-400">(Optional)</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={costPrice}
                onChange={(e) =>
                  updateDraftProduct({ costPrice: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                MRP (₹) <span className="text-slate-400">(Optional)</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={mrp}
                onChange={(e) => updateDraftProduct({ mrp: parseFloat(e.target.value) || 0 })}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg"
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
                        amount: Number(((Number(draftProduct.price || 599) * sug.rate) / 100).toFixed(2))
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
                    value={stock}
                    onChange={(e) =>
                      updateDraftProduct({ stock: parseInt(e.target.value) || 0 })
                    }
                    className="w-full pr-8 pl-2 py-1.5 text-xs font-bold text-slate-900 border border-slate-200 rounded-lg"
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
                    value={lowStockThreshold}
                    onChange={(e) =>
                      updateDraftProduct({ lowStockThreshold: parseInt(e.target.value) || 0 })
                    }
                    className="w-full pr-8 pl-2 py-1.5 text-xs border border-slate-200 rounded-lg"
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

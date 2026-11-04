import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Sparkles, Check, X, Trash2, Edit3 } from 'lucide-react';
import { TaxonomyItem, TaxonomyAttribute, isElectronicsCategory, isFootwearCategory, isGroceryCategory, isFashionCategory } from '../../../lib/taxonomyHelper.js';
import {
  getTenantCustomSpecs,
  recordTenantCustomSpec,
  removeTenantCustomSpec,
  getTenantCustomAttributeValues,
  recordTenantCustomAttributeValue,
} from '../../../lib/customTaxonomyStorage.js';
import { useAuthStore } from '../../../stores/authStore.js';
import { toast } from '../../../stores/toastStore.js';

interface ProductAttributesSectionProps {
  brand?: string;
  category: string;
  subCategory: string;
  productType: string;
  attributes: Record<string, string>;
  onChangeAttributes: (updated: Record<string, string>) => void;
  matchedTaxonomy?: TaxonomyItem;
  shelfLocation?: string;
  onChangeShelfLocation?: (loc: string) => void;
  hasVariants?: boolean;
  onToggleVariants?: (hasVariants: boolean) => void;
}

// Redundant fields already captured in Step 1 (Basic Setup) or Step 2 (Pricing & Inventory)
// These must never be asked again in the attributes grid to maintain a single source of truth.
const EXCLUDED_PRODUCT_ATTRIBUTES = new Set([
  'brand',
  'brandname',
  'price',
  'mrp',
  'costprice',
  'discount',
  'customerratings',
  'customerreviews',
  'offers',
  'availability',
  'stock',
  'gstinvoiceavailable',
  'hasvariants',
  'totalvariants',
  'shelflocation',
]);

export const ProductAttributesSection: React.FC<ProductAttributesSectionProps> = ({
  brand = '',
  category,
  subCategory,
  productType,
  attributes = {},
  onChangeAttributes,
  matchedTaxonomy,
  shelfLocation = '',
  onChangeShelfLocation,
  hasVariants = false,
  onToggleVariants,
}) => {
  const currentStore = useAuthStore((state) => state.currentStore);
  const storeId = currentStore?._id || currentStore?.id || 'default';

  // Automatically keep attributes.Brand synchronized with the single source of truth from Step 1
  useEffect(() => {
    if (brand && attributes.Brand !== brand) {
      onChangeAttributes({
        ...attributes,
        Brand: brand,
      });
    }
  }, [brand]);

  // Modal / inline creator state for brand-new custom specifications (e.g. 25th spec)
  const [isAddingSpec, setIsAddingSpec] = useState(false);
  const [newSpecName, setNewSpecName] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [saveSpecToStore, setSaveSpecToStore] = useState(true);

  // Active inline manual value entry for existing dropdowns (e.g. SIM Support -> "Dual SIM")
  const [activeCustomAttr, setActiveCustomAttr] = useState<string | null>(null);
  const [customInputValue, setCustomInputValue] = useState('');

  // 1. Fetch store's custom specifications for this specific product type
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const tenantSpecs = useMemo(() => {
    return getTenantCustomSpecs(storeId, category, subCategory, productType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId, category, subCategory, productType, refreshTrigger]);

  // 2. Canonical attributes from taxonomy, strictly excluding duplicate Step 1/2 fields
  const canonicalAttributes = useMemo(() => {
    const raw: TaxonomyAttribute[] = matchedTaxonomy?.attributes || [];
    return raw.filter((attr) => {
      const clean = attr.name.toLowerCase().replace(/['"’\s\-_/]/g, '');
      return !EXCLUDED_PRODUCT_ATTRIBUTES.has(clean);
    });
  }, [matchedTaxonomy]);

  const filteredTenantSpecs = useMemo(() => {
    return tenantSpecs.filter((spec) => {
      const clean = spec.name.toLowerCase().replace(/['"’\s\-_/]/g, '');
      return !EXCLUDED_PRODUCT_ATTRIBUTES.has(clean);
    });
  }, [tenantSpecs]);

  // 3. Merged total specifications
  const totalSpecsCount = canonicalAttributes.length + filteredTenantSpecs.length;

  // Handler: Update a single attribute value
  const handleUpdateAttribute = (key: string, value: string) => {
    onChangeAttributes({
      ...attributes,
      [key]: value,
    });
  };

  // Handler: Open manual entry input for an attribute
  const openCustomInputFor = (attrName: string) => {
    setActiveCustomAttr(attrName);
    setCustomInputValue(attributes[attrName] || '');
  };

  // Handler: Save manual entry for an existing attribute
  const handleSaveCustomValue = (attrName: string) => {
    const trimmed = customInputValue.trim();
    if (!trimmed) {
      setActiveCustomAttr(null);
      return;
    }

    // 1. Update product attribute
    handleUpdateAttribute(attrName, trimmed);

    // 2. Save custom value to store's local schema for this product type
    recordTenantCustomAttributeValue(storeId, category, subCategory, productType, attrName, trimmed);

    setRefreshTrigger((prev) => prev + 1);
    setActiveCustomAttr(null);
    setCustomInputValue('');

    toast.success(`Saved "${trimmed}" as custom option for ${attrName}`);
  };

  // Handler: Cancel manual input
  const handleCancelCustomInput = () => {
    setActiveCustomAttr(null);
    setCustomInputValue('');
  };

  // Handler: Add a brand-new custom specification (e.g., 25th spec)
  const handleAddCustomSpec = () => {
    const trimmedName = newSpecName.trim();
    if (!trimmedName) {
      toast.error('Specification name is required');
      return;
    }

    const cleanName = trimmedName.toLowerCase().replace(/['"’\s\-_/]/g, '');
    if (EXCLUDED_PRODUCT_ATTRIBUTES.has(cleanName)) {
      toast.error(`"${trimmedName}" is already managed in Step 1/2 of product setup.`);
      return;
    }

    // Set value in current draft attributes
    const trimmedVal = newSpecValue.trim();
    if (trimmedVal) {
      handleUpdateAttribute(trimmedName, trimmedVal);
    }

    // Persist specification definition to store's custom schema if checked
    if (saveSpecToStore) {
      recordTenantCustomSpec(storeId, category, subCategory, productType, {
        name: trimmedName,
        values: trimmedVal ? [trimmedVal] : [],
        isCustomSpec: true,
      });
      toast.success(`Added spec "${trimmedName}" to store schema for ${productType || 'Standard'}`);
    } else {
      toast.success(`Added spec "${trimmedName}" to this product`);
    }

    setRefreshTrigger((prev) => prev + 1);
    setNewSpecName('');
    setNewSpecValue('');
    setIsAddingSpec(false);
  };

  // Handler: Delete custom spec from store schema
  const handleDeleteCustomSpec = (specName: string) => {
    removeTenantCustomSpec(storeId, category, subCategory, productType, specName);
    // Remove from active product attributes as well
    const updated = { ...attributes };
    delete updated[specName];
    onChangeAttributes(updated);

    setRefreshTrigger((prev) => prev + 1);
    toast.info(`Removed custom specification "${specName}"`);
  };

  // Helper to render a field (with custom dropdown + inline entry)
  const renderAttributeField = (
    name: string,
    canonicalOptions: string[] = [],
    isRequired: boolean = false,
    isCustomSpec: boolean = false,
  ) => {
    const customTenantOptions = getTenantCustomAttributeValues(
      storeId,
      category,
      subCategory,
      productType,
      name,
    );

    // Combine canonical options + store custom options + current product value
    const mergedOptions = Array.from(new Set([...canonicalOptions, ...customTenantOptions]));
    const currentVal = attributes[name] || '';
    if (currentVal && !mergedOptions.includes(currentVal)) {
      mergedOptions.push(currentVal);
    }

    const isInlineEditing = activeCustomAttr === name;

    return (
      <div key={name} className="relative">
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[11px] font-medium text-slate-700 truncate max-w-[80%]">
            {name} {isRequired && <span className="text-rose-500">*</span>}
            {isCustomSpec && (
              <span className="ml-1 text-[9px] font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.2 rounded-sm border border-purple-200">
                Custom
              </span>
            )}
          </label>
          <div className="flex items-center gap-1">
            {isCustomSpec && (
              <button
                type="button"
                onClick={() => handleDeleteCustomSpec(name)}
                title="Remove specification from store template"
                className="text-slate-400 hover:text-rose-500 p-0.5 rounded transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
            {!isInlineEditing && mergedOptions.length > 0 && (
              <button
                type="button"
                onClick={() => openCustomInputFor(name)}
                title={`Type custom value for ${name}`}
                className="text-[10px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-0.5 px-1 py-0.2 rounded hover:bg-blue-50 transition-colors"
              >
                <Edit3 className="w-2.5 h-2.5" />
                <span>Custom</span>
              </button>
            )}
          </div>
        </div>

        {isInlineEditing ? (
          <div className="flex items-center gap-1">
            <input
              autoFocus
              type="text"
              value={customInputValue}
              placeholder={`Enter custom ${name.toLowerCase()}...`}
              onChange={(e) => setCustomInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSaveCustomValue(name);
                } else if (e.key === 'Escape') {
                  handleCancelCustomInput();
                }
              }}
              className="w-full px-2 py-1.5 text-xs bg-white border border-blue-500 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium"
            />
            <button
              type="button"
              onClick={() => handleSaveCustomValue(name)}
              title="Apply & Save Custom Option"
              className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shrink-0"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleCancelCustomInput}
              title="Cancel"
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : mergedOptions.length > 0 ? (
          <select
            value={currentVal}
            onChange={(e) => {
              if (e.target.value === '__CUSTOM_MANUAL_ENTRY__') {
                openCustomInputFor(name);
              } else {
                handleUpdateAttribute(name, e.target.value);
              }
            }}
            className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg cursor-pointer focus:outline-hidden focus:border-blue-500 text-slate-800"
          >
            <option value="">Select {name}...</option>
            {mergedOptions.map((val) => {
              const isCustom = customTenantOptions.includes(val) || (currentVal === val && !canonicalOptions.includes(val));
              return (
                <option key={val} value={val}>
                  {val} {isCustom ? '(Custom)' : ''}
                </option>
              );
            })}
            <option value="__CUSTOM_MANUAL_ENTRY__" className="text-blue-600 font-semibold bg-blue-50">
              ➕ Enter Custom Value...
            </option>
          </select>
        ) : (
          <input
            type="text"
            value={currentVal}
            placeholder={`Enter ${name.toLowerCase()}...`}
            onChange={(e) => handleUpdateAttribute(name, e.target.value)}
            className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
          />
        )}
      </div>
    );
  };

  return (
    <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
      {/* Header with Title, Badge, and "+ Add Custom Spec" button */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <h3 className="text-xs font-bold text-slate-900">Product Attributes</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            {productType || matchedTaxonomy?.productType || 'Standard'} ({totalSpecsCount} specs)
          </span>
          <button
            type="button"
            onClick={() => setIsAddingSpec((prev) => !prev)}
            className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all"
          >
            <Plus className="w-3 h-3" />
            <span>Add Spec</span>
          </button>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 mb-2 flex items-center justify-between">
        <span>
          Schema-driven attributes for <span className="font-semibold text-slate-700">{productType || 'Standard'}</span>.
        </span>
        <span className="text-[10px] text-slate-400 italic">Predefined + Tenant Addons</span>
      </p>

      {/* Inline Form: Add Brand-New Custom Specification (e.g. 25th Spec) */}
      {isAddingSpec && (
        <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/90 rounded-xl p-3 space-y-2.5 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Add Custom Specification for {productType || 'Product'}
            </span>
            <button
              type="button"
              onClick={() => setIsAddingSpec(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Spec Name *
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Bezel Material, Dial Shape"
                value={newSpecName}
                onChange={(e) => setNewSpecName(e.target.value)}
                className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Value
              </label>
              <input
                type="text"
                placeholder="e.g. Titanium Grade 5"
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-1.5 text-[11px] text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={saveSpecToStore}
                onChange={(e) => setSaveSpecToStore(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
              />
              <span>
                Save to store template for future <strong>{productType || 'products'}</strong>
              </span>
            </label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsAddingSpec(false)}
                className="px-2.5 py-1 text-xs text-slate-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCustomSpec}
                disabled={!newSpecName.trim()}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
              >
                Add Spec
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Canonical Attributes + Tenant Custom Specs */}
      <div className="grid grid-cols-2 gap-2.5 text-xs max-h-[300px] overflow-y-auto pr-1">
        {canonicalAttributes.length > 0 ? (
          <>
            {canonicalAttributes.map((attr, idx) => (
              <div key={idx} className={attr.values && attr.values.length > 10 ? 'col-span-2' : ''}>
                {renderAttributeField(attr.name, attr.values, attr.isRequired, false)}
              </div>
            ))}

            {/* Tenant-added custom specifications */}
            {filteredTenantSpecs.map((spec, sIdx) => (
              <div key={`custom-${sIdx}`} className="col-span-1">
                {renderAttributeField(spec.name, spec.values || [], spec.isRequired, true)}
              </div>
            ))}
          </>
        ) : (
          /* Fallback category schema if canonical taxonomy not matched */
          <>
            {isGroceryCategory(category, subCategory) ? (
              <>
                {renderAttributeField('Net Qty / Weight', ['100g', '250g', '500g', '1kg', '2kg', '5kg', '500ml', '1L'])}
                {renderAttributeField('Dietary Type', ['🟢 100% Vegetarian', '🔴 Non-Vegetarian', '🌱 Vegan'])}
              </>
            ) : isElectronicsCategory(category, subCategory) ? (
              <>
                {renderAttributeField('Warranty', ['No Warranty', '6 Months Brand Warranty', '1 Year Brand Warranty', '2 Years Brand Warranty'])}
                {renderAttributeField('Power / Specs', ['65W Fast Charge', '120W HyperCharge', '30W Dash', '18W Standard'])}
              </>
            ) : isFootwearCategory(category, subCategory) ? (
              <>
                {renderAttributeField('Upper Material', ['Mesh', 'Synthetic Leather', 'Genuine Leather', 'Canvas', 'Suede', 'Knit Fabric'])}
                {renderAttributeField('Sole Material', ['Rubber', 'EVA (Lightweight)', 'Air Cushion', 'TPU', 'Phylon'])}
              </>
            ) : isFashionCategory(category, subCategory) ? (
              <>
                {renderAttributeField('Fit Type', ['Regular', 'Slim Fit', 'Relaxed', 'Oversized'])}
                {renderAttributeField('Fabric', ['Cotton', 'Cotton Blend', 'Polyester', 'Linen', 'Denim'])}
              </>
            ) : (
              <>
                {renderAttributeField('Material / Finish', ['Stainless Steel', 'Plastic', 'Glass', 'Wood', 'Ceramic'])}
                {renderAttributeField('Warranty', ['No Warranty', '6 Months Warranty', '1 Year Warranty'])}
              </>
            )}

            {/* Any tenant custom specs added to this unmapped product type */}
            {filteredTenantSpecs.map((spec, sIdx) => (
              <div key={`custom-fb-${sIdx}`} className="col-span-1">
                {renderAttributeField(spec.name, spec.values || [], spec.isRequired, true)}
              </div>
            ))}
          </>
        )}

        {/* Shelf / Aisle Location */}
        <div className="col-span-2 pt-2 border-t border-slate-100">
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Physical Shelf / Aisle Location <span className="text-slate-400 font-normal">(For Order Pickers)</span>
          </label>
          <input
            type="text"
            value={shelfLocation || attributes.shelfLocation || ''}
            placeholder="e.g. Aisle 3 - Rack B or Shelf F-12"
            onChange={(e) => {
              if (onChangeShelfLocation) onChangeShelfLocation(e.target.value);
              handleUpdateAttribute('shelfLocation', e.target.value);
            }}
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 font-medium"
          />
        </div>
      </div>

      {/* Size Pills (Only shown for fashion / footwear) */}
      {(isFashionCategory(category, subCategory) || isFootwearCategory(category, subCategory)) && (
        <div className="pt-2 border-t border-slate-100">
          <div className="text-[11px] font-semibold text-slate-600 mb-1.5">
            {isFootwearCategory(category, subCategory) ? 'Shoe Size (UK)' : 'Size Options'}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {(isFootwearCategory(category, subCategory)
              ? ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']
              : ['XS', 'S', 'M', 'L', 'XL', '2XL']
            ).map((sz) => {
              const isSelected = attributes.size === sz;
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => handleUpdateAttribute('size', sz)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-2xs font-bold'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
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
      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
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
            onChange={(e) => onToggleVariants && onToggleVariants(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-8 h-4 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600" />
        </label>
      </div>
    </div>
  );
};

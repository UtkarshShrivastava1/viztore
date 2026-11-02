import React, { useState, useEffect } from 'react';
import {
  Layers,
  Sparkles,
  Plus,
  Trash2,
  Check,
  Zap,
  Tag,
  Copy,
  Hash,
  Palette,
  Ruler,
  AlertCircle,
  HardDrive,
  Package,
} from 'lucide-react';
import { useCatalogStore, ProductVariantItem } from '../../../stores/catalogStore.js';
import {
  isElectronicsCategory,
  isFootwearCategory,
  isGroceryCategory,
  isFashionCategory,
} from '../../../lib/taxonomyHelper.js';

interface ColorPreset {
  name: string;
  hex: string;
}

const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const FOOTWEAR_SIZES = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'];
const STORAGE_PRESETS = ['64 GB', '128 GB', '256 GB', '512 GB', '1 TB', '8GB / 128GB', '12GB / 256GB', '16GB / 512GB'];
const GROCERY_PACKS = ['100g', '250g', '500g', '1 kg', '2 kg', '5 kg', '500 ml', '1 L'];

const POPULAR_COLORS: ColorPreset[] = [
  { name: 'Black', hex: '#0f172a' },
  { name: 'White', hex: '#f8fafc' },
  { name: 'Navy Blue', hex: '#1e3a8a' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Crimson Red', hex: '#dc2626' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Olive Green', hex: '#4d7c0f' },
  { name: 'Heather Grey', hex: '#64748b' },
  { name: 'Beige', hex: '#f5f5dc' },
  { name: 'Mustard Yellow', hex: '#d97706' },
];

const ELECTRONICS_COLORS: ColorPreset[] = [
  { name: 'Space Black', hex: '#1c1b1f' },
  { name: 'Natural Titanium', hex: '#8e8a84' },
  { name: 'Silver', hex: '#e2e8f0' },
  { name: 'Midnight', hex: '#191f28' },
  { name: 'Starlight', hex: '#f0ece1' },
  { name: 'Deep Blue', hex: '#1e3a8a' },
  { name: 'Desert Titanium', hex: '#d4bba2' },
];

const GROCERY_VARIANTS: ColorPreset[] = [
  { name: 'Standard Pack', hex: '#3b82f6' },
  { name: 'Family Pack', hex: '#10b981' },
  { name: 'Economy Pack', hex: '#f59e0b' },
  { name: 'Classic Flavour', hex: '#64748b' },
];

export const VariantMatrixBuilder: React.FC = () => {
  const { draftProduct, updateDraftProduct } = useCatalogStore();

  const isElect = isElectronicsCategory(draftProduct.category, draftProduct.subCategory);
  const isFoot = isFootwearCategory(draftProduct.category, draftProduct.subCategory);
  const isGroc = isGroceryCategory(draftProduct.category, draftProduct.subCategory);
  const isFash = isFashionCategory(draftProduct.category, draftProduct.subCategory);

  const baseSku = draftProduct.sku || `SKU-${Date.now().toString().slice(-6)}`;
  const basePrice = draftProduct.price ?? 499;
  const baseMrp = draftProduct.mrp ?? 699;
  const baseCost = draftProduct.costPrice ?? 300;

  // Presets and titles according to category
  const activePrimaryPresets = isElect
    ? STORAGE_PRESETS
    : isFoot
      ? FOOTWEAR_SIZES
      : isGroc
        ? GROCERY_PACKS
        : APPAREL_SIZES;

  const activeSecondaryPresets = isElect
    ? ELECTRONICS_COLORS
    : isGroc
      ? GROCERY_VARIANTS
      : POPULAR_COLORS;

  const dim1Title = isElect
    ? 'Storage / Specs'
    : isFoot
      ? 'Shoe Sizes (UK)'
      : isGroc
        ? 'Pack Size / Weight'
        : 'Apparel Sizes';

  const dim2Title = isElect
    ? 'Color / Finish'
    : isGroc
      ? 'Flavour / Pack Type'
      : 'Colors';

  const initialSizes = isElect
    ? ['128 GB', '256 GB', '512 GB']
    : isFoot
      ? ['UK 7', 'UK 8', 'UK 9']
      : isGroc
        ? ['500g', '1 kg', '2 kg']
        : ['M', 'L', 'XL'];

  const initialColors = isElect
    ? ELECTRONICS_COLORS.slice(0, 2)
    : isGroc
      ? GROCERY_VARIANTS.slice(0, 2)
      : POPULAR_COLORS.slice(0, 2);

  // Selected Dimensions
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialSizes);
  const [selectedColors, setSelectedColors] = useState<ColorPreset[]>(initialColors);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#6366f1');

  
  // Synchronize variant presets whenever the product category or subcategory changes
  useEffect(() => {
    setSelectedSizes(initialSizes);
    setSelectedColors(initialColors);
  }, [draftProduct.category, draftProduct.subCategory]);

  // Bulk control values
  const [bulkPriceInput, setBulkPriceInput] = useState<string>(String(basePrice));
  const [bulkMrpInput, setBulkMrpInput] = useState<string>(String(baseMrp));
  const [bulkStockInput, setBulkStockInput] = useState<string>('15');

  // Matrix Rows
  const [matrixRows, setMatrixRows] = useState<ProductVariantItem[]>(() => {
    return (draftProduct.variants as ProductVariantItem[]) || [];
  });

  const syncWithStore = (rows: ProductVariantItem[]) => {
    const totalStock = rows.reduce((acc, r) => (r.isActive ? acc + (r.stock || 0) : acc), 0);
    updateDraftProduct({
      variants: rows,
      stock: totalStock > 0 ? totalStock : draftProduct.stock,
      attributes: {
        ...(draftProduct.attributes || {}),
        hasVariants: 'true',
        totalVariants: String(rows.length),
      },
    });
  };

  // Generate or regenerate matrix when requested
  const generateMatrix = () => {
    const newRows: ProductVariantItem[] = [];

    const colors = selectedColors.length > 0 ? selectedColors : [{ name: 'Standard', hex: '#64748b' }];
    const sizes = selectedSizes.length > 0 ? selectedSizes : ['Standard'];

    colors.forEach((c) => {
      sizes.forEach((s) => {
        const cleanColor = c.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4);
        const cleanSize = s.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        const sku = `${baseSku}-${cleanColor}-${cleanSize}`;
        const barcode = `890${Math.floor(1000000000 + Math.random() * 9000000000)}`;

        newRows.push({
          id: `VAR-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          sku,
          barcode,
          color: c.name,
          colorHex: c.hex,
          size: s,
          price: Number(bulkPriceInput) || basePrice,
          costPrice: baseCost,
          mrp: Number(bulkMrpInput) || baseMrp,
          stock: Number(bulkStockInput) || 15,
          isActive: true,
        });
      });
    });

    setMatrixRows(newRows);
    syncWithStore(newRows);
  };

  // Bulk Apply Helpers
  const applyPriceToAll = () => {
    const val = Number(bulkPriceInput);
    if (isNaN(val) || val <= 0) return;
    const updated = matrixRows.map((r) => ({ ...r, price: val }));
    setMatrixRows(updated);
    syncWithStore(updated);
  };

  const applyMrpToAll = () => {
    const val = Number(bulkMrpInput);
    if (isNaN(val) || val <= 0) return;
    const updated = matrixRows.map((r) => ({ ...r, mrp: val }));
    setMatrixRows(updated);
    syncWithStore(updated);
  };

  const applyStockToAll = () => {
    const val = Number(bulkStockInput);
    if (isNaN(val) || val < 0) return;
    const updated = matrixRows.map((r) => ({ ...r, stock: val }));
    setMatrixRows(updated);
    syncWithStore(updated);
  };

  const handleRowChange = (index: number, field: keyof ProductVariantItem, value: any) => {
    const updated = [...matrixRows];
    const target = updated[index];
    if (target) {
      updated[index] = { ...target, [field]: value };
      setMatrixRows(updated);
      syncWithStore(updated);
    }
  };

  const handleToggleRow = (index: number) => {
    const updated = [...matrixRows];
    const target = updated[index];
    if (target) {
      updated[index] = { ...target, isActive: !target.isActive };
      setMatrixRows(updated);
      syncWithStore(updated);
    }
  };

  const handleDeleteRow = (index: number) => {
    const updated = matrixRows.filter((_, i) => i !== index);
    setMatrixRows(updated);
    syncWithStore(updated);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const toggleColor = (color: ColorPreset) => {
    setSelectedColors((prev) =>
      prev.some((c) => c.name === color.name)
        ? prev.filter((c) => c.name !== color.name)
        : [...prev, color],
    );
  };

  const addCustomSize = () => {
    const trimmed = customSizeInput.trim();
    if (trimmed && !selectedSizes.includes(trimmed)) {
      setSelectedSizes((prev) => [...prev, trimmed]);
      setCustomSizeInput('');
    }
  };

  const addCustomColor = () => {
    const trimmed = customColorName.trim();
    if (trimmed && !selectedColors.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      setSelectedColors((prev) => [...prev, { name: trimmed, hex: customColorHex }]);
      setCustomColorName('');
    }
  };

  return (
    <div className="space-y-4 pt-3 border-t border-slate-200 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                Multi-Variant Matrix Generator
              </h4>
              <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
                {isElect ? 'Specs / Color' : isGroc ? 'Weight / Pack' : isFoot ? 'Size / Color' : 'Multi-SKU'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Pick {dim1Title.toLowerCase()} and {dim2Title.toLowerCase()} to generate combinations with 1-click bulk price &amp; inventory controls.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={generateMatrix}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all cursor-pointer shrink-0"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>
            Generate Matrix ({selectedSizes.length} × {selectedColors.length} ={' '}
            {selectedSizes.length * selectedColors.length} Variants)
          </span>
        </button>
      </div>

      {/* Dimension Pickers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dimension 1: Sizes / Storage / Pack Size */}
        <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              {isElect ? (
                <HardDrive className="w-3.5 h-3.5 text-blue-600" />
              ) : isGroc ? (
                <Package className="w-3.5 h-3.5 text-blue-600" />
              ) : (
                <Ruler className="w-3.5 h-3.5 text-blue-600" />
              )}
              <span>1. Select {dim1Title} ({selectedSizes.length})</span>
            </label>
            <span className="text-[10px] text-slate-400">Click to toggle</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {activePrimaryPresets.map((sz) => {
              const isSelected = selectedSizes.includes(sz);
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => toggleSize(sz)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>

          {/* Custom Size / Spec Input */}
          <div className="flex items-center gap-1.5 pt-1">
            <input
              type="text"
              value={customSizeInput}
              onChange={(e) => setCustomSizeInput(e.target.value)}
              placeholder={`Add custom ${dim1Title.toLowerCase()}...`}
              className="flex-1 px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={addCustomSize}
              disabled={!customSizeInput.trim()}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Dimension 2: Colors / Finish / Pack Type */}
        <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-blue-600" />
              <span>2. Select {dim2Title} ({selectedColors.length})</span>
            </label>
            <span className="text-[10px] text-slate-400">Click to toggle</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {activeSecondaryPresets.map((col) => {
              const isSelected = selectedColors.some((c) => c.name === col.name);
              return (
                <button
                  key={col.name}
                  type="button"
                  onClick={() => toggleColor(col)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-blue-600 text-blue-900 ring-1 ring-blue-600 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-slate-300 shrink-0"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span>{col.name}</span>
                  {isSelected && <Check className="w-3 h-3 text-blue-600 ml-0.5" />}
                </button>
              );
            })}
          </div>

          {/* Custom Color Input */}
          <div className="flex items-center gap-1.5 pt-1">
            <input
              type="color"
              value={customColorHex}
              onChange={(e) => setCustomColorHex(e.target.value)}
              className="w-7 h-7 rounded border border-slate-200 p-0.5 cursor-pointer bg-white"
              title="Pick Hex Color"
            />
            <input
              type="text"
              value={customColorName}
              onChange={(e) => setCustomColorName(e.target.value)}
              placeholder={`Custom ${dim2Title.toLowerCase()}...`}
              className="flex-1 px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={addCustomColor}
              disabled={!customColorName.trim()}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
            >
              + Add
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Update Controls */}
      {matrixRows.length > 0 && (
        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Bulk Quick-Apply Controls:</span>
            </span>
            <span className="text-[11px] text-slate-400">
              Apply values to all {matrixRows.length} variant rows in 1-click
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Price Bulk */}
            <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
              <span className="text-xs font-semibold text-slate-600 pl-1">Price: ₹</span>
              <input
                type="number"
                value={bulkPriceInput}
                onChange={(e) => setBulkPriceInput(e.target.value)}
                className="w-20 px-2 py-0.5 text-xs bg-white border border-slate-200 rounded font-bold text-slate-800"
              />
              <button
                type="button"
                onClick={applyPriceToAll}
                className="px-2 py-1 text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors cursor-pointer ml-auto"
              >
                Apply All
              </button>
            </div>

            {/* MRP Bulk */}
            <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
              <span className="text-xs font-semibold text-slate-600 pl-1">MRP: ₹</span>
              <input
                type="number"
                value={bulkMrpInput}
                onChange={(e) => setBulkMrpInput(e.target.value)}
                className="w-20 px-2 py-0.5 text-xs bg-white border border-slate-200 rounded font-mono text-slate-800"
              />
              <button
                type="button"
                onClick={applyMrpToAll}
                className="px-2 py-1 text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors cursor-pointer ml-auto"
              >
                Apply All
              </button>
            </div>

            {/* Stock Bulk */}
            <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
              <span className="text-xs font-semibold text-slate-600 pl-1">Stock:</span>
              <input
                type="number"
                value={bulkStockInput}
                onChange={(e) => setBulkStockInput(e.target.value)}
                className="w-20 px-2 py-0.5 text-xs bg-white border border-slate-200 rounded font-bold text-slate-800"
              />
              <button
                type="button"
                onClick={applyStockToAll}
                className="px-2 py-1 text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors cursor-pointer ml-auto"
              >
                Apply All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generated Variant Table */}
      {matrixRows.length > 0 ? (
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 border-b border-slate-200 z-10">
                <tr>
                  <th className="p-2.5 w-10 text-center">Active</th>
                  <th className="p-2.5">Variant Combination</th>
                  <th className="p-2.5">SKU Code</th>
                  <th className="p-2.5">Barcode (Optional)</th>
                  <th className="p-2.5 w-24">MRP (₹)</th>
                  <th className="p-2.5 w-24">Price (₹)</th>
                  <th className="p-2.5 w-20">Stock</th>
                  <th className="p-2.5 w-10 text-center">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white font-medium">
                {matrixRows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={`transition-colors ${
                      row.isActive ? 'hover:bg-slate-50/80' : 'bg-slate-50 opacity-60'
                    }`}
                  >
                    {/* Active Checkbox */}
                    <td className="p-2.5 text-center">
                      <input
                        type="checkbox"
                        checked={row.isActive}
                        onChange={() => handleToggleRow(idx)}
                        className="w-3.5 h-3.5 text-blue-600 rounded cursor-pointer"
                      />
                    </td>

                    {/* Variant Badge */}
                    <td className="p-2.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full border border-slate-300 shrink-0"
                          style={{ backgroundColor: row.colorHex || '#64748b' }}
                        />
                        <span className="font-bold text-slate-800">{row.color}</span>
                        <span className="text-slate-300">/</span>
                        <span className="font-extrabold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">
                          {row.size}
                        </span>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={row.sku}
                        onChange={(e) => handleRowChange(idx, 'sku', e.target.value)}
                        className="w-full px-2 py-1 text-xs font-mono bg-white border border-slate-200 rounded focus:border-blue-500"
                      />
                    </td>

                    {/* Barcode */}
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={row.barcode || ''}
                        onChange={(e) => handleRowChange(idx, 'barcode', e.target.value)}
                        placeholder="Optional"
                        className="w-full px-2 py-1 text-[11px] font-mono bg-white border border-slate-200 rounded focus:border-blue-500 text-slate-600"
                      />
                    </td>

                    {/* MRP */}
                    <td className="p-2.5">
                      <input
                        type="number"
                        value={row.mrp}
                        onChange={(e) => handleRowChange(idx, 'mrp', Number(e.target.value))}
                        className="w-full px-2 py-1 text-xs font-mono bg-white border border-slate-200 rounded focus:border-blue-500 text-slate-500"
                      />
                    </td>

                    {/* Price */}
                    <td className="p-2.5">
                      <input
                        type="number"
                        value={row.price}
                        onChange={(e) => handleRowChange(idx, 'price', Number(e.target.value))}
                        className="w-full px-2 py-1 text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded focus:border-blue-500"
                      />
                    </td>

                    {/* Stock */}
                    <td className="p-2.5">
                      <input
                        type="number"
                        value={row.stock}
                        onChange={(e) => handleRowChange(idx, 'stock', Number(e.target.value))}
                        className="w-full px-2 py-1 text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded focus:border-blue-500"
                      />
                    </td>

                    {/* Delete */}
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(idx)}
                        className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        title="Delete variant row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center space-y-1">
          <p className="text-xs font-semibold text-slate-600">No variants generated yet.</p>
          <p className="text-[11px] text-slate-400">
            Select your {dim1Title.toLowerCase()} and {dim2Title.toLowerCase()} above, then click &ldquo;Generate Matrix&rdquo;.
          </p>
        </div>
      )}
    </div>
  );
};

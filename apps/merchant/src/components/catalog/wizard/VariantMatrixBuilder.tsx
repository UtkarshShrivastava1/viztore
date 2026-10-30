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
} from 'lucide-react';
import { useCatalogStore, ProductVariantItem } from '../../../stores/catalogStore.js';

interface ColorPreset {
  name: string;
  hex: string;
}

const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const FOOTWEAR_SIZES = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];
const WAIST_SIZES = ['28', '30', '32', '34', '36', '38'];
const WEIGHT_SIZES = ['250g', '500g', '1 kg', '2 kg', '5 kg'];

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

export const VariantMatrixBuilder: React.FC = () => {
  const { draftProduct, updateDraftProduct } = useCatalogStore();

  const category = (draftProduct.category || '').toLowerCase();
  const baseSku = draftProduct.sku || `SKU-${Date.now().toString().slice(-6)}`;
  const basePrice = draftProduct.price ?? 499;
  const baseMrp = draftProduct.mrp ?? 699;
  const baseCost = draftProduct.costPrice ?? 300;

  // Selected Dimensions
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['M', 'L', 'XL']);
  const [selectedColors, setSelectedColors] = useState<ColorPreset[]>([
    { name: 'Black', hex: '#0f172a' },
    { name: 'Navy Blue', hex: '#1e3a8a' },
  ]);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#6366f1');

  // Bulk control values
  const [bulkPriceInput, setBulkPriceInput] = useState<string>(String(basePrice));
  const [bulkMrpInput, setBulkMrpInput] = useState<string>(String(baseMrp));
  const [bulkStockInput, setBulkStockInput] = useState<string>('15');

  // Matrix Rows
  const [matrixRows, setMatrixRows] = useState<ProductVariantItem[]>(() => {
    return (draftProduct.variants as ProductVariantItem[]) || [];
  });

  // Decide default size palette based on category
  const activeSizePresets = category.includes('foot')
    ? FOOTWEAR_SIZES
    : category.includes('groc') || category.includes('food')
      ? WEIGHT_SIZES
      : APPAREL_SIZES;

  // Generate or regenerate matrix when requested
  const generateMatrix = () => {
    const newRows: ProductVariantItem[] = [];

    const colors = selectedColors.length > 0 ? selectedColors : [{ name: 'Default', hex: '#64748b' }];
    const sizes = selectedSizes.length > 0 ? selectedSizes : ['Standard'];

    colors.forEach((c) => {
      sizes.forEach((s) => {
        const cleanColor = c.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 3);
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
                Amazon / Flipkart Variant Matrix Generator
              </h4>
              <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
                Multi-SKU
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Pick colors and sizes to generate combinations with 1-click bulk price &amp; inventory controls.
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
            Generate Matrix ({selectedColors.length} × {selectedSizes.length} ={' '}
            {selectedColors.length * selectedSizes.length} Variants)
          </span>
        </button>
      </div>

      {/* Dimension Pickers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Colors Picker */}
        <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-blue-600" />
              <span>1. Select Available Colors ({selectedColors.length})</span>
            </label>
            <span className="text-[10px] text-slate-400">Click to toggle</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {POPULAR_COLORS.map((col) => {
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
              placeholder="Custom color (e.g. Teal Blue)..."
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

        {/* Sizes Picker */}
        <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-blue-600" />
              <span>2. Select Available Sizes ({selectedSizes.length})</span>
            </label>
            <span className="text-[10px] text-slate-400">Click to toggle</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {activeSizePresets.map((size) => {
              const isSelected = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>

          {/* Custom Size Input */}
          <div className="flex items-center gap-1.5 pt-1">
            <input
              type="text"
              value={customSizeInput}
              onChange={(e) => setCustomSizeInput(e.target.value)}
              placeholder="Custom size (e.g. 42, Free Size, 1.5 Litre)..."
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
      </div>

      {/* Bulk Update Controls (Amazon Seller Central Style) */}
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
                        className="w-full px-2 py-1 text-xs font-bold text-emerald-600 bg-white border border-slate-200 rounded focus:border-blue-500 text-right"
                      />
                    </td>

                    {/* Delete Action */}
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(idx)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors cursor-pointer"
                        title="Remove Variant"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>
              Total {matrixRows.filter((r) => r.isActive).length} active variants generated
            </span>
            <span className="font-bold text-slate-800">
              Total Variant Stock:{' '}
              <span className="text-emerald-600">
                {matrixRows.reduce((acc, r) => (r.isActive ? acc + (r.stock || 0) : acc), 0)} units
              </span>
            </span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500 bg-slate-50/50">
          Click <span className="font-bold text-blue-600">"Generate Matrix"</span> above to build your variant combinations table.
        </div>
      )}
    </div>
  );
};


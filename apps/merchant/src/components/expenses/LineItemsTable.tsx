import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Search, Package, Sparkles, Check } from 'lucide-react';
import { useCatalogStore, ProductItem } from '../../stores/catalogStore.js';

export interface LineItem {
  id: string;
  name: string;
  description: string;
  qty: number;
  unit: string;
  rate: number;
  productId?: string;
  sku?: string;
}

interface LineItemsTableProps {
  items: LineItem[];
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, field: keyof LineItem, value: any) => void;
  onClearItems?: () => void;
}

const COMMON_UNITS = [
  'Pcs',
  'Box',
  'Kg',
  'Gm',
  'Ltr',
  'Ml',
  'Mtr',
  'Dozen',
  'Pack',
  'Roll',
  'Set',
  'Pair',
];

export const LineItemsTable: React.FC<LineItemsTableProps> = ({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  onClearItems,
}) => {
  const { products } = useCatalogStore();
  const [activeSearchId, setActiveSearchId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close autocomplete on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveSearchId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProduct = (itemId: string, product: ProductItem) => {
    onUpdateItem(itemId, 'name', product.name);
    onUpdateItem(itemId, 'description', product.category ? `${product.category} • SKU: ${product.sku || 'N/A'}` : product.sku || '');
    onUpdateItem(itemId, 'rate', product.costPrice || product.price || 0);
    onUpdateItem(itemId, 'productId', product.id);
    onUpdateItem(itemId, 'sku', product.sku || '');
    setActiveSearchId(null);
    setSearchTerm('');
  };

  const getFilteredProducts = (query: string) => {
    if (!products || products.length === 0) return [];
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 6);
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      )
      .slice(0, 6);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-800">
            Items & Line Breakdown <span className="text-red-500">*</span>
          </label>
          <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-full">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        {items.length > 1 && onClearItems && (
          <button
            type="button"
            onClick={onClearItems}
            className="text-[11px] text-slate-500 hover:text-red-600 transition-colors"
          >
            Clear all rows
          </button>
        )}
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-3 w-8 text-center">#</th>
                <th className="py-2.5 px-3 min-w-[200px]">Product / Item</th>
                <th className="py-2.5 px-3 min-w-[160px]">Description / SKU</th>
                <th className="py-2.5 px-2 w-20 text-center">Qty</th>
                <th className="py-2.5 px-2 w-24">Unit</th>
                <th className="py-2.5 px-2 w-28 text-right">Rate (₹)</th>
                <th className="py-2.5 px-3 w-32 text-right">Amount (₹)</th>
                <th className="py-2.5 px-2 w-10 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {items.map((item, index) => {
                const lineTotal = (item.qty || 0) * (item.rate || 0);
                const isSearching = activeSearchId === item.id;
                const filteredProducts = isSearching ? getFilteredProducts(searchTerm || item.name) : [];

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 px-3 text-center text-slate-400 font-medium">
                      {index + 1}
                    </td>

                    {/* Product / Item Input with live Autocomplete */}
                    <td className="py-2 px-3 relative">
                      <div className="relative">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            onUpdateItem(item.id, 'name', e.target.value);
                            setSearchTerm(e.target.value);
                            setActiveSearchId(item.id);
                          }}
                          onFocus={() => {
                            setActiveSearchId(item.id);
                            setSearchTerm(item.name || '');
                          }}
                          placeholder="Type or search catalog..."
                          className="w-full pr-7 pl-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 bg-white"
                          required
                        />
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
                      </div>

                      {/* Autocomplete Dropdown */}
                      {isSearching && filteredProducts.length > 0 && (
                        <div
                          ref={dropdownRef}
                          className="absolute z-50 left-3 right-3 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-56 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150"
                        >
                          <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-[10px] font-semibold text-slate-500 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Package className="w-3 h-3 text-blue-500" /> Catalog Matches
                            </span>
                            <span>Click to autofill</span>
                          </div>
                          <div className="divide-y divide-slate-100">
                            {filteredProducts.map((prod) => (
                              <button
                                key={prod.id}
                                type="button"
                                onClick={() => handleSelectProduct(item.id, prod)}
                                className="w-full px-3 py-2 text-left hover:bg-blue-50/70 flex items-center justify-between transition-colors group"
                              >
                                <div>
                                  <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-700">
                                    {prod.name}
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {prod.category} {prod.sku ? `• SKU: ${prod.sku}` : ''}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs font-bold text-slate-700">
                                    ₹ {(prod.costPrice || prod.price || 0).toLocaleString('en-IN', {
                                      minimumFractionDigits: 2,
                                    })}
                                  </div>
                                  <div className="text-[10px] text-slate-400">Stock: {prod.stock ?? 0}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Description */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => onUpdateItem(item.id, 'description', e.target.value)}
                        placeholder="Variant, size, remarks..."
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      />
                    </td>

                    {/* Quantity */}
                    <td className="py-2 px-2 text-center">
                      <input
                        type="number"
                        min="1"
                        value={item.qty || ''}
                        onChange={(e) =>
                          onUpdateItem(item.id, 'qty', Math.max(1, parseInt(e.target.value) || 1))
                        }
                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg text-center font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </td>

                    {/* Unit */}
                    <td className="py-2 px-2">
                      <select
                        value={item.unit}
                        onChange={(e) => onUpdateItem(item.id, 'unit', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 bg-white"
                      >
                        {COMMON_UNITS.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Rate */}
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate || ''}
                        onChange={(e) =>
                          onUpdateItem(item.id, 'rate', Math.max(0, parseFloat(e.target.value) || 0))
                        }
                        placeholder="0.00"
                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg text-right font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </td>

                    {/* Line Amount */}
                    <td className="py-2 px-3 text-right font-semibold text-slate-800">
                      ₹ {lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Delete Action */}
                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        disabled={items.length <= 1}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-25 disabled:pointer-events-none"
                        title={items.length <= 1 ? 'Minimum 1 item required' : 'Delete item'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Type any item or search existing store products to auto-fill rates and SKUs.</span>
          </div>
          <button
            type="button"
            onClick={onAddItem}
            className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>
    </div>
  );
};


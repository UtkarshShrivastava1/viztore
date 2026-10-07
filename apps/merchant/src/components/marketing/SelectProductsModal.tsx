import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, ChevronDown, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useCatalogStore } from '../../stores/catalogStore.js';

interface SelectProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  onApply: (ids: string[]) => void;
}

export const SelectProductsModal: React.FC<SelectProductsModalProps> = ({
  isOpen,
  onClose,
  selectedIds,
  onApply,
}) => {
  const [currentSelected, setCurrentSelected] = useState<string[]>(selectedIds);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStock, setSelectedStock] = useState('All Stock');
  const [selectedPrice, setSelectedPrice] = useState('All Prices');

  const catalogProducts = useCatalogStore((state) => state.products);

  const displayProducts = useMemo(() => {
    return catalogProducts.map((p) => ({
      id: p.id,
      name: p.name,
      subtitle: p.subCategory || (p.attributes ? Object.values(p.attributes).join(' / ') : ''),
      category: p.category || 'General',
      sku: p.sku || 'SKU-N/A',
      price: p.price || 0,
      stock: p.stock || 0,
      image: p.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&auto=format&fit=crop&q=80',
    }));
  }, [catalogProducts]);

  const categories = useMemo(() => {
    const set = new Set(displayProducts.map((p) => p.category).filter(Boolean));
    return ['All Categories', ...Array.from(set)];
  }, [displayProducts]);

  const filtered = useMemo(() => {
    return displayProducts.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;

      if (selectedCategory !== 'All Categories' && p.category !== selectedCategory) {
        return false;
      }

      if (selectedStock === 'In Stock' && p.stock <= 0) return false;
      if (selectedStock === 'Low Stock' && (p.stock > 10 || p.stock <= 0)) return false;

      if (selectedPrice === 'Under ₹1,000' && p.price >= 1000) return false;
      if (selectedPrice === '₹1,000 - ₹2,500' && (p.price < 1000 || p.price > 2500)) return false;
      if (selectedPrice === 'Above ₹2,500' && p.price <= 2500) return false;

      return true;
    });
  }, [displayProducts, searchTerm, selectedCategory, selectedStock, selectedPrice]);

  const toggleSelect = (id: string) => {
    setCurrentSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (currentSelected.length === filtered.length) {
      setCurrentSelected([]);
    } else {
      setCurrentSelected(filtered.map((p) => p.id));
    }
  };

  const handleApply = () => {
    onApply(currentSelected);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Select Products</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose the products you want to apply this coupon on.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by name, SKU, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
            </div>

            {/* Category dropdown */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Stock dropdown */}
            <div className="relative">
              <select
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
                className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
              >
                <option>All Stock</option>
                <option>In Stock</option>
                <option>Low Stock</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Price dropdown */}
            <div className="relative">
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
              >
                <option>All Prices</option>
                <option>Under ₹1,000</option>
                <option>₹1,000 - ₹2,500</option>
                <option>Above ₹2,500</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">
              {currentSelected.length} selected
            </span>
            {currentSelected.length > 0 && (
              <button
                type="button"
                onClick={() => setCurrentSelected([])}
                className="text-rose-600 hover:text-rose-700 font-semibold"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Table content (scrollable) */}
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={currentSelected.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-blue-600"
                  />
                </th>
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3">Price</th>
                <th className="py-2.5 px-3">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No products found in catalog matching filters
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const isChecked = currentSelected.includes(p.id);
                  return (
                    <tr
                      key={p.id}
                      onClick={() => toggleSelect(p.id)}
                      className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                        isChecked ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <td className="py-2 px-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(p.id)}
                          className="rounded border-slate-300 text-blue-600"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{p.name}</span>
                            <span className="text-[10px] text-slate-400">{p.subtitle}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-slate-600">{p.category}</td>
                      <td className="py-2 px-3 font-mono text-[11px] text-slate-600">{p.sku}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">₹ {p.price.toLocaleString()}</td>
                      <td className="py-2 px-3 text-slate-700">{p.stock}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 text-slate-500">
            <span>Showing {filtered.length} products</span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

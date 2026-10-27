import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCatalogStore } from '../../stores/catalogStore.js';

interface SelectProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  onApply: (ids: string[]) => void;
}

// Fallback high-fidelity products matching 12.7b.png
const fallbackMockProducts = [
  {
    id: 'PRD-001',
    name: "Men's Cotton T-Shirt",
    subtitle: 'Black / M',
    category: 'Men Fashion',
    sku: 'TSH001',
    price: 799,
    stock: 120,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'PRD-002',
    name: 'Slim Fit Jeans',
    subtitle: 'Blue / 32',
    category: 'Men Fashion',
    sku: 'JNS002',
    price: 1299,
    stock: 85,
    image: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'PRD-003',
    name: 'Floral Summer Dress',
    subtitle: 'Pink / M',
    category: 'Women Fashion',
    sku: 'DRS003',
    price: 1499,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'PRD-004',
    name: 'Casual Sneakers',
    subtitle: 'White / 42',
    category: 'Footwear',
    sku: 'SNK004',
    price: 2499,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'PRD-005',
    name: 'Stylish Handbag',
    subtitle: 'Black',
    category: 'Women Accessories',
    sku: 'BAG005',
    price: 1199,
    stock: 75,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'PRD-006',
    name: 'Analog Watch',
    subtitle: 'Silver',
    category: 'Men Accessories',
    sku: 'WAT006',
    price: 2999,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'PRD-007',
    name: 'UV Protection Sunglasses',
    subtitle: 'Black',
    category: 'Men Accessories',
    sku: 'SUN007',
    price: 1899,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'PRD-008',
    name: 'Ethnic Kurta',
    subtitle: 'Green / L',
    category: 'Men Fashion',
    sku: 'KUR008',
    price: 1099,
    stock: 90,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&auto=format&fit=crop&q=80',
  },
];

export const SelectProductsModal: React.FC<SelectProductsModalProps> = ({
  isOpen,
  onClose,
  selectedIds = [],
  onApply,
}) => {
  const [currentSelected, setCurrentSelected] = useState<string[]>(Array.isArray(selectedIds) ? selectedIds : []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStock, setSelectedStock] = useState('All Stock');
  const [selectedPrice, setSelectedPrice] = useState('All Prices');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Safely read catalog products from store without triggering backend fetch
  const catalogProducts = useCatalogStore((state) => state.products);

  // Auto-sync selected IDs when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentSelected(Array.isArray(selectedIds) ? selectedIds : []);
      setCurrentPage(1);
    }
  }, [isOpen, selectedIds]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Use real catalog products if available; otherwise use fallback mockup products
  const displayProducts = useMemo(() => {
    if (Array.isArray(catalogProducts) && catalogProducts.length > 0) {
      return catalogProducts.map((p) => ({
        id: String(p?.id || ''),
        name: String(p?.name || 'Unnamed Product'),
        subtitle: p?.subCategory || (p?.attributes && typeof p.attributes === 'object' ? Object.values(p.attributes).join(' / ') : '') || '',
        category: String(p?.category || 'General'),
        sku: String(p?.sku || 'SKU-N/A'),
        price: Number(p?.price || 0),
        stock: Number(p?.stock || 0),
        image:
          (p?.images && p.images[0]) ||
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&auto=format&fit=crop&q=80',
      }));
    }
    return fallbackMockProducts;
  }, [catalogProducts]);

  const categories = useMemo(() => {
    const set = new Set(displayProducts.map((p) => p.category).filter(Boolean));
    return ['All Categories', ...Array.from(set)];
  }, [displayProducts]);

  const filtered = useMemo(() => {
    const q = (searchTerm || '').trim().toLowerCase();
    return displayProducts.filter((p) => {
      const pName = String(p?.name || '').toLowerCase();
      const pSku = String(p?.sku || '').toLowerCase();
      const pCat = String(p?.category || '').toLowerCase();
      const matchSearch = !q || pName.includes(q) || pSku.includes(q) || pCat.includes(q);
      if (!matchSearch) return false;

      if (selectedCategory !== 'All Categories' && p.category !== selectedCategory) {
        return false;
      }

      const pStock = Number(p?.stock || 0);
      if (selectedStock === 'In Stock' && pStock <= 0) return false;
      if (selectedStock === 'Low Stock' && (pStock > 10 || pStock <= 0)) return false;

      const pPrice = Number(p?.price || 0);
      if (selectedPrice === 'Under ₹1,000' && pPrice >= 1000) return false;
      if (selectedPrice === '₹1,000 - ₹2,500' && (pPrice < 1000 || pPrice > 2500)) return false;
      if (selectedPrice === 'Above ₹2,500' && pPrice <= 2500) return false;

      return true;
    });
  }, [displayProducts, searchTerm, selectedCategory, selectedStock, selectedPrice]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedStock, selectedPrice]);

  const toggleSelect = (id: string) => {
    setCurrentSelected((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      return list.includes(id) ? list.filter((i) => i !== id) : [...list, id];
    });
  };

  const toggleSelectAll = () => {
    const filteredIds = filtered.map((p) => p.id);
    const allFilteredSelected = filteredIds.length > 0 && filteredIds.every((id) => currentSelected.includes(id));
    if (allFilteredSelected) {
      setCurrentSelected((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setCurrentSelected((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleApply = () => {
    onApply(currentSelected);
    onClose();
  };

  // If not open or SSR, do not render to document.body (evaluated after all hooks)
  if (!isOpen) return null;
  if (typeof document === 'undefined' || !document.body) return null;

  const isAllFilteredSelected = filtered.length > 0 && filtered.every((p) => currentSelected.includes(p.id));

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header (12.7b.png) */}
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
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar (12.7b.png) */}
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
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Category dropdown */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 focus:outline-none"
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
                className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 focus:outline-none"
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
                className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 focus:outline-none"
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
                className="text-rose-600 hover:text-rose-700 font-semibold transition-colors cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Table content (scrollable) (12.7b.png) */}
        <div className="overflow-y-auto flex-1 min-h-[300px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider z-10">
              <tr>
                <th className="py-2.5 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={isAllFilteredSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
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
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No products found in catalog matching filters
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const isChecked = (currentSelected || []).includes(p.id);
                  return (
                    <tr
                      key={p.id}
                      onClick={(e) => {
                        if ((e.target as HTMLElement).tagName.toLowerCase() === 'input') return;
                        toggleSelect(p.id);
                      }}
                      className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                        isChecked ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(p.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block truncate max-w-[200px]">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-slate-400">{p.subtitle}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-medium">{p.category}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{p.sku}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        ₹ {Number(p.price || 0).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700">{p.stock}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer (12.7b.png) */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 text-slate-500">
            <span>
              {filtered.length === 0
                ? 'Showing 0 to 0 of 0 products'
                : `Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(
                    currentPage * pageSize,
                    filtered.length
                  )} of ${filtered.length} products`}
            </span>
          </div>

          {/* Pagination Controls matching 12.7b.png */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white font-bold'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Next page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
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

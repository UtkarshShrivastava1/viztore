import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, ChevronDown, ChevronLeft, ChevronRight, Check } from 'lucide-react';

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

  if (!isOpen) return null;

  const mockProducts = [
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
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&auto=format&fit=crop&q=80',
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
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100&auto=format&fit=crop&q=80',
    },
  ];

  const filtered = mockProducts.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

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
                <option>All Categories</option>
                <option>Men Fashion</option>
                <option>Women Fashion</option>
                <option>Footwear</option>
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
              {filtered.map((p) => {
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
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 text-slate-500">
            <span>Showing 1 to 8 of 248 products</span>
            <div className="flex items-center gap-1 ml-3">
              <button type="button" disabled className="p-1 rounded border border-slate-200 opacity-40">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="w-5 h-5 flex items-center justify-center bg-blue-600 text-white rounded text-[11px] font-bold">
                1
              </span>
              <span className="w-5 h-5 flex items-center justify-center text-slate-600 text-[11px]">2</span>
              <span className="w-5 h-5 flex items-center justify-center text-slate-600 text-[11px]">3</span>
              <button type="button" className="p-1 rounded border border-slate-200 text-slate-600">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
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

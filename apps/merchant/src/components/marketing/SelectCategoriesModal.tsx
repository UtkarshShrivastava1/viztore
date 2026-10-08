import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Check, FolderTree } from 'lucide-react';

interface SelectCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategories: string[];
  onApply: (categories: string[]) => void;
}

export const SelectCategoriesModal: React.FC<SelectCategoriesModalProps> = ({
  isOpen,
  onClose,
  selectedCategories,
  onApply,
}) => {
  const [currentSelected, setCurrentSelected] = useState<string[]>(selectedCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGroup, setActiveGroup] = useState('All Categories');

  if (!isOpen) return null;

  const categoryGroups = [
    { id: 'all', name: 'All Categories', count: 24 },
    { id: 'men', name: 'Men Fashion', count: 6 },
    { id: 'women', name: 'Women Fashion', count: 8 },
    { id: 'kids', name: 'Kids Fashion', count: 5 },
    { id: 'footwear', name: 'Footwear', count: 4 },
    { id: 'bags', name: 'Bags & Accessories', count: 3 },
    { id: 'watches', name: 'Watches', count: 2 },
    { id: 'beauty', name: 'Beauty & Personal Care', count: 4 },
    { id: 'jewellery', name: 'Jewellery', count: 3 },
    { id: 'sports', name: 'Sports & Fitness', count: 4 },
    { id: 'home', name: 'Home & Living', count: 6 },
    { id: 'electronics', name: 'Electronics', count: 5 },
    { id: 'gifts', name: 'Gifts & Lifestyle', count: 3 },
  ];

  const categoryCards = [
    {
      id: 'cat-1',
      name: 'Men Fashion',
      itemsCount: '1,240 items',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat-2',
      name: 'Women Fashion',
      itemsCount: '2,560 items',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat-3',
      name: 'Kids Fashion',
      itemsCount: '980 items',
      image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat-4',
      name: 'Footwear',
      itemsCount: '860 items',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat-5',
      name: 'Bags & Accessories',
      itemsCount: '640 items',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat-6',
      name: 'Watches',
      itemsCount: '320 items',
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat-7',
      name: 'Beauty & Personal Care',
      itemsCount: '1,120 items',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat-8',
      name: 'Jewellery',
      itemsCount: '480 items',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat-9',
      name: 'Sports & Fitness',
      itemsCount: '730 items',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat-10',
      name: 'Home & Living',
      itemsCount: '1,450 items',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat-11',
      name: 'Electronics',
      itemsCount: '980 items',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat-12',
      name: 'Gifts & Lifestyle',
      itemsCount: '620 items',
      image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=120&auto=format&fit=crop&q=80',
    },
  ];

  const filteredCards = categoryCards.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectCard = (name: string) => {
    setCurrentSelected((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const handleSelectAll = () => {
    if (currentSelected.length === filteredCards.length) {
      setCurrentSelected([]);
    } else {
      setCurrentSelected(filteredCards.map((c) => c.name));
    }
  };

  const handleApply = () => {
    onApply(currentSelected);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header (12.7c.png) */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Select Categories</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose the product categories you want to apply this coupon on.
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

        {/* Search input bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
            />
          </div>
        </div>

        {/* Main Content 2-Column: Left Category List + Right Cards Grid */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Category Sidebar (240px) */}
          <div className="w-56 border-r border-slate-100 overflow-y-auto p-2 bg-slate-50/30 space-y-0.5 hidden sm:block">
            {categoryGroups.map((g) => {
              const isActive = activeGroup === g.name;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setActiveGroup(g.name)}
                  className={`w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{g.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-blue-100 text-blue-700 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {g.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Grid (12 Cards) */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800">
                All Categories ({filteredCards.length})
              </h3>
              <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentSelected.length === filteredCards.length && filteredCards.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-slate-300 text-blue-600"
                />
                <span>Select All</span>
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {filteredCards.map((card) => {
                const isChecked = currentSelected.includes(card.name);
                return (
                  <div
                    key={card.id}
                    onClick={() => toggleSelectCard(card.name)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all relative flex flex-col items-center text-center group ${
                      isChecked
                        ? 'border-blue-600 bg-blue-50/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSelectCard(card.name)}
                      className="absolute top-2.5 right-2.5 rounded border-slate-300 text-blue-600"
                    />
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-14 h-14 rounded-xl object-cover mb-2 border border-slate-200 group-hover:scale-105 transition-transform"
                    />
                    <span className="text-xs font-bold text-slate-900 leading-tight">
                      {card.name}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{card.itemsCount}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">
            {currentSelected.length} categories selected
          </span>

          <div className="flex items-center gap-2">
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

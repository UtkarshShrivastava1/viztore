import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  Filter,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingBag,
  Trash2,
  Heart,
  ShoppingCart,
  Wifi,
  Battery,
  Signal,
  Tag,
  Folder,
  Crown,
  ThumbsUp,
  Package,
  Plus,
  Mic,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useStoreManagementStore, StoreSection } from '../../stores/storeManagementStore.js';
import { useCatalogStore } from '../../stores/catalogStore.js';
import { branding } from '../../lib/branding.js';

interface AddEditSectionViewProps {
  sectionId?: string | null;
  onBack: () => void;
}

interface PresetSectionOption {
  name: string;
  iconType: 'badge' | 'tag' | 'star' | 'sparkles' | 'crown' | 'folder' | 'thumbs-up' | 'package';
  color?: string;
  bgColor?: string;
}

const PRESET_SECTIONS: PresetSectionOption[] = [
  { name: 'New Arrivals', iconType: 'badge', bgColor: 'bg-emerald-500 text-white' },
  { name: "Today's Deal", iconType: 'tag', color: 'text-amber-500' },
  { name: 'Best Sellers', iconType: 'star', color: 'text-rose-500 fill-rose-500' },
  { name: 'Top Picks', iconType: 'sparkles', color: 'text-pink-500 fill-pink-500' },
  { name: 'Featured Brands', iconType: 'crown', color: 'text-amber-500 fill-amber-500' },
  { name: 'Categories', iconType: 'folder', color: 'text-amber-500 fill-amber-500' },
  { name: 'Top Rated', iconType: 'thumbs-up', color: 'text-blue-500 fill-blue-500' },
  { name: 'All Products', iconType: 'package', color: 'text-slate-500' },
];

export const AddEditSectionView: React.FC<AddEditSectionViewProps> = ({
  sectionId,
  onBack,
}) => {
  const {
    sections,
    curatedProducts,
    addSection,
    updateSection,
    persistStoreData,
    isSaving,
  } = useStoreManagementStore();

  const existingSection = sectionId ? sections.find((s) => s.id === sectionId) : null;

  const [sectionName, setSectionName] = useState(existingSection?.name || 'New Arrivals');
  const [displayOrder, setDisplayOrder] = useState(existingSection?.priority || 2);
  const [isActive, setIsActive] = useState(existingSection ? existingSection.isActive : true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState('');
  const [isCustomNameInput, setIsCustomNameInput] = useState(false);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [subCategoryFilter, setSubCategoryFilter] = useState('All Sub Categories');
  const [productTypeFilter, setProductTypeFilter] = useState('All Product Types');
  const [brandFilter, setBrandFilter] = useState('All Brands');
  const [searchQuery, setSearchQuery] = useState('');

  const [isSavingLocal, setIsSavingLocal] = useState(false);

  const catalogProducts = useCatalogStore((state) => state.products);

  // Real store catalog products prioritized with full attribute fidelity
  const products = useMemo(() => {
    // 1. Prefer curatedProducts from storeManagementStore if populated
    if (curatedProducts && curatedProducts.length > 0) {
      return curatedProducts.map((p) => {
        const catStr = p.category || 'General';
        const brandStr = p.brand || 'Store In-House Brand';
        return {
          id: p.id,
          name: p.name,
          details: `Size: ${p.size || 'M'} • Color: ${p.color || 'Standard'}`,
          sku: p.sku,
          category: catStr,
          subCategory: p.subCategory,
          productType: p.productType,
          brand: brandStr,
          stock: p.stock ?? 0,
          price: p.price ?? 0,
          rating: 4.8,
          reviews: 42,
          image: p.image,
        };
      });
    }

    // 2. Or fallback to catalogStore products if already loaded in merchant app
    if (catalogProducts && catalogProducts.length > 0) {
      return catalogProducts.map((p) => {
        const catName = p.category ? String(p.category).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'General';
        const subCat = p.subCategory ? String(p.subCategory).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '';
        const catStr = subCat ? `${catName} > ${subCat}` : catName;

        const primaryImg =
          (Array.isArray(p.images) && p.images[0]) ||
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80';

        const sizeVal = p.attributes?.Size || p.variants?.[0]?.size || 'M';
        const colorVal = p.attributes?.Color || p.variants?.[0]?.color || 'Standard';

        return {
          id: p.id,
          name: p.name,
          details: `Size: ${sizeVal} • Color: ${colorVal}`,
          sku: p.sku,
          category: catStr,
          subCategory: p.subCategory,
          productType: p.productType,
          brand: p.brand || 'Store In-House Brand',
          stock: p.stock ?? 0,
          price: p.price ?? 0,
          rating: 4.8,
          reviews: 42,
          image: primaryImg,
        };
      });
    }

    return [];
  }, [curatedProducts, catalogProducts]);

  // Selected products initialized from existing section or empty
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(() => {
    if (existingSection?.productIds && Array.isArray(existingSection.productIds) && existingSection.productIds.length > 0) {
      return existingSection.productIds;
    }
    return [];
  });

  // Sanitize selectedProductIds to only retain IDs that exist in the loaded store catalog
  useEffect(() => {
    if (products.length > 0 && selectedProductIds.length > 0) {
      const validIds = new Set(products.map((p) => p.id));
      const filtered = selectedProductIds.filter((id) => validIds.has(id));
      if (filtered.length !== selectedProductIds.length) {
        setSelectedProductIds(filtered);
      }
    }
  }, [products, selectedProductIds]);

  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) {
        const primaryCat = (p.category.split('>')[0] || '').trim();
        if (primaryCat) set.add(primaryCat);
      }
    });
    return ['All Categories', ...Array.from(set)];
  }, [products]);

  const availableSubCategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.subCategory) {
        set.add(p.subCategory.trim());
      } else if (p.category && p.category.includes('>')) {
        const sub = (p.category.split('>')[1] || '').trim();
        if (sub) set.add(sub);
      }
    });
    return ['All Sub Categories', ...Array.from(set)];
  }, [products]);

  const availableProductTypes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.productType) set.add(p.productType.trim());
    });
    return ['All Product Types', ...Array.from(set)];
  }, [products]);

  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.brand) set.add(p.brand.trim());
    });
    return ['All Brands', ...Array.from(set)];
  }, [products]);

  const filteredPresets = PRESET_SECTIONS.filter((p) =>
    p.name.toLowerCase().includes(dropdownSearch.toLowerCase())
  );

  const displayedProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (categoryFilter !== 'All Categories') {
        if (!p.category.toLowerCase().includes(categoryFilter.toLowerCase())) {
          return false;
        }
      }
      if (subCategoryFilter !== 'All Sub Categories') {
        const sub = p.subCategory || (p.category.includes('>') ? p.category.split('>')[1] : '');
        if (!sub?.toLowerCase().includes(subCategoryFilter.toLowerCase())) {
          return false;
        }
      }
      if (productTypeFilter !== 'All Product Types') {
        if (p.productType && !p.productType.toLowerCase().includes(productTypeFilter.toLowerCase())) {
          return false;
        }
      }
      if (brandFilter !== 'All Brands') {
        if (p.brand && !p.brand.toLowerCase().includes(brandFilter.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }, [products, searchQuery, categoryFilter, subCategoryFilter, productTypeFilter, brandFilter]);

  const toggleSelect = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setIsSavingLocal(true);
    try {
      if (existingSection) {
        updateSection(existingSection.id, {
          name: sectionName,
          priority: displayOrder,
          isActive,
          productIds: selectedProductIds,
          productCount: selectedProductIds.length,
        });
      } else {
        addSection({
          name: sectionName,
          sectionType: 'product',
          isActive,
          badge: 'New',
          priority: displayOrder,
          productIds: selectedProductIds,
        });
      }
      await persistStoreData();
      onBack();
    } catch (err) {
      console.error('Failed to save section:', err);
    } finally {
      setIsSavingLocal(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Breadcrumb & Header (13.1a.png) */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span className="hover:text-slate-600 cursor-pointer" onClick={onBack}>Home</span>
            <span>&gt;</span>
            <span className="hover:text-slate-600 cursor-pointer" onClick={onBack}>Store Management</span>
            <span>&gt;</span>
            <span className="hover:text-slate-600 cursor-pointer" onClick={onBack}>Manage Sections</span>
            <span>&gt;</span>
            <span className="text-slate-800 font-bold">
              {existingSection ? 'Edit Section' : 'Add New Section'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            {existingSection ? 'Edit Section' : 'Add New Section'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure section details and add products to display in your store on the customer app.
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </div>

      {/* 3-Column Main Layout: Section Details (3 cols) + Add Products (6 cols) + Phone Preview (3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Column 1: Section Details (3 cols) (13.1a.png) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-4">
          <div>
            <h2 className="text-xs font-bold text-slate-900">Section Details</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Enter the basic details for this section.
            </p>
          </div>

          {/* Section Name dropdown (13.1a.png, 13.1b.png) */}
          <div className="relative">
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Section Name <span className="text-rose-500">*</span>
            </label>

            {isCustomNameInput ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={sectionName}
                  onChange={(e) => setSectionName(e.target.value)}
                  placeholder="Enter custom section name"
                  className="flex-1 px-3 py-2 bg-white border border-blue-500 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsCustomNameInput(false)}
                  className="px-2.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors shrink-0"
                >
                  Presets
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 flex items-center justify-between text-left hover:border-blue-500 transition-colors"
              >
                <span>{sectionName}</span>
                {isDropdownOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
            )}

            {isDropdownOpen && !isCustomNameInput && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                {/* Search sections... input (13.1b.png) */}
                <div className="p-2 border-b border-slate-100 bg-slate-50/50">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search sections..."
                      value={dropdownSearch}
                      onChange={(e) => setDropdownSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>

                {/* 8 Presets List with Icons (13.1b.png) */}
                <div className="py-1 max-h-56 overflow-y-auto divide-y divide-slate-50">
                  {filteredPresets.map((preset) => {
                    const isSelected = sectionName === preset.name;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setSectionName(preset.name);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-blue-50/80 text-blue-700'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {preset.iconType === 'badge' && (
                            <span className="w-5 h-5 rounded-full bg-emerald-500 text-[8px] font-black text-white flex items-center justify-center shrink-0">
                              NEW
                            </span>
                          )}
                          {preset.iconType === 'tag' && (
                            <Tag className="w-4 h-4 text-amber-500 shrink-0" />
                          )}
                          {preset.iconType === 'star' && (
                            <Star className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
                          )}
                          {preset.iconType === 'sparkles' && (
                            <Sparkles className="w-4 h-4 text-pink-500 fill-pink-500 shrink-0" />
                          )}
                          {preset.iconType === 'crown' && (
                            <Crown className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                          )}
                          {preset.iconType === 'folder' && (
                            <Folder className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                          )}
                          {preset.iconType === 'thumbs-up' && (
                            <ThumbsUp className="w-4 h-4 text-blue-500 fill-blue-500 shrink-0" />
                          )}
                          {preset.iconType === 'package' && (
                            <Package className="w-4 h-4 text-slate-500 shrink-0" />
                          )}
                          <span>{preset.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      </button>
                    );
                  })}
                  {filteredPresets.length === 0 && (
                    <div className="px-3 py-3 text-center text-xs text-slate-400">
                      No matching presets
                    </div>
                  )}
                </div>

                {/* Create New Section Action (13.1b.png) */}
                <div className="p-2 border-t border-slate-100 bg-slate-50/30">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomNameInput(true);
                      setIsDropdownOpen(false);
                      setSectionName('');
                    }}
                    className="w-full px-2 py-1.5 text-left text-xs font-bold text-blue-600 hover:bg-blue-50/70 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Create New Section</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Display Order Stepper */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Display Order <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Math.max(1, Number(e.target.value)))}
                className="w-20 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
              />
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => setDisplayOrder((v) => v + 1)}
                  className="p-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600"
                >
                  <ChevronUp className="w-2.5 h-2.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayOrder((v) => Math.max(1, v - 1))}
                  className="p-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600"
                >
                  <ChevronDown className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Show this section on store switch */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-800">Show this section on store</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-8 h-4.5 rounded-full transition-colors flex items-center p-0.5 ${
                  isActive ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
              </button>
              <span className={`text-xs font-bold ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Column 2: Add Products (6 cols) (13.1a.png) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-900">Add Products</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Select products to display in this section.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700">
                {selectedProductIds.length} products selected
              </span>
              <button
                type="button"
                onClick={() => setSelectedProductIds([])}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700"
            >
              {availableCategories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={subCategoryFilter}
              onChange={(e) => setSubCategoryFilter(e.target.value)}
              className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700"
            >
              {availableSubCategories.map((sub) => (
                <option key={sub}>{sub}</option>
              ))}
            </select>

            <select
              value={productTypeFilter}
              onChange={(e) => setProductTypeFilter(e.target.value)}
              className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700"
            >
              {availableProductTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>

            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700"
            >
              {availableBrands.map((brand) => (
                <option key={brand}>{brand}</option>
              ))}
            </select>
          </div>

          {/* Search bar + Filters button */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by name, SKU, barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <button
              type="button"
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Filters</span>
            </button>
          </div>

          {/* Products Table (High-Density) */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
                  <th className="py-2 px-2.5 w-7">
                    <input
                      type="checkbox"
                      checked={
                        displayedProducts.length > 0 &&
                        displayedProducts.every((p) => selectedProductIds.includes(p.id))
                      }
                      onChange={() => {
                        const allDisplayedSelected = displayedProducts.every((p) =>
                          selectedProductIds.includes(p.id)
                        );
                        if (allDisplayedSelected) {
                          setSelectedProductIds((prev) =>
                            prev.filter((id) => !displayedProducts.some((p) => p.id === id))
                          );
                        } else {
                          const newIds = displayedProducts.map((p) => p.id);
                          setSelectedProductIds((prev) => Array.from(new Set([...prev, ...newIds])));
                        }
                      }}
                      className="rounded border-slate-300 text-blue-600 cursor-pointer"
                    />
                  </th>
                  <th className="py-2 px-2.5">Product</th>
                  <th className="py-2 px-2">SKU</th>
                  <th className="py-2 px-2">Category</th>
                  <th className="py-2 px-2">Stock</th>
                  <th className="py-2 px-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No products found matching filters
                    </td>
                  </tr>
                ) : (
                  displayedProducts.map((p) => {
                  const isChecked = selectedProductIds.includes(p.id);
                  return (
                    <tr
                      key={p.id}
                      onClick={() => toggleSelect(p.id)}
                      className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                        isChecked ? 'bg-blue-50/20' : ''
                      }`}
                    >
                      <td className="py-2 px-2.5" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(p.id)}
                          className="rounded border-slate-300 text-blue-600 cursor-pointer"
                        />
                      </td>
                      <td className="py-2 px-2.5">
                        <div className="flex items-center gap-2">
                          <img
                            src={p.image}
                            alt={p.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80';
                            }}
                            className="w-7 h-7 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate max-w-[140px]">
                              {p.name}
                            </span>
                            <span className="text-[9px] text-slate-400 block truncate">
                              {p.details}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-2 font-mono text-[10px] text-slate-500">{p.sku}</td>
                      <td className="py-2 px-2 text-[10px] text-slate-600 truncate max-w-[100px]">
                        {p.category}
                      </td>
                      <td className="py-2 px-2 text-[10px] font-semibold text-emerald-600">
                        {p.stock} In Stock
                      </td>
                      <td className="py-2 px-2 text-right font-black text-slate-900">
                        ₹{p.price.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="text-[11px]">Showing {displayedProducts.length === 0 ? 0 : 1} to {displayedProducts.length} of {displayedProducts.length} products</span>
            <div className="flex items-center gap-1">
              <button type="button" disabled className="p-1 rounded border border-slate-200 opacity-40">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="w-5 h-5 flex items-center justify-center bg-blue-600 text-white rounded text-[10px] font-bold">
                1
              </span>
              <span className="w-5 h-5 flex items-center justify-center text-slate-600 text-[10px]">2</span>
              <span className="w-5 h-5 flex items-center justify-center text-slate-600 text-[10px]">3</span>
              <span className="text-slate-400 text-[10px]">...</span>
              <span className="w-5 h-5 flex items-center justify-center text-slate-600 text-[10px]">50</span>
              <button type="button" className="p-1 rounded border border-slate-200 text-slate-600">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Column 3: Live Preview (Customer App) (3 cols) (13.1a.png) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
          <div>
            <h2 className="text-xs font-bold text-slate-900">Live Preview (Customer App)</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              See how this section will appear in your store.
            </p>
          </div>

          {/* Smartphone Frame */}
          <div className="bg-slate-900 rounded-[2rem] p-3 shadow-xl border-2 border-slate-800 mx-auto max-w-[240px]">
            {/* Status bar */}
            <div className="flex items-center justify-between px-2 pt-1 pb-2 text-white text-[10px]">
              <span className="font-bold">9:41</span>
              <div className="flex items-center gap-1.5">
                <Signal className="w-2.5 h-2.5" />
                <Wifi className="w-2.5 h-2.5" />
                <Battery className="w-2.5 h-2.5" />
              </div>
            </div>

            {/* App Screen Canvas */}
            <div className="bg-white rounded-xl overflow-hidden p-2.5 space-y-2">
              {/* Top brand & icons (13.1a.png) */}
              <div className="flex items-center justify-between text-slate-700">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black tracking-tight text-blue-600">
                    {branding.appName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-slate-600" />
                  <div className="relative">
                    <ShoppingCart className="w-3.5 h-3.5 text-slate-600" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 text-white rounded-full text-[7px] flex items-center justify-center font-bold">
                      3
                    </span>
                  </div>
                </div>
              </div>

              {/* In-app Search Bar (13.1a.png) */}
              <div className="relative">
                <Search className="w-2.5 h-2.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                <div className="w-full pl-6 pr-6 py-1 bg-slate-100 rounded-full text-[8px] text-slate-400 truncate">
                  Search in {branding.appName}...
                </div>
                <Mic className="w-2.5 h-2.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2" />
              </div>

              {/* Section Title Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                <h4 className="text-[11px] font-black text-slate-900 truncate max-w-[130px]">
                  {sectionName || 'Section Name'}
                </h4>
                <span className="text-[9px] text-blue-600 font-bold flex items-center shrink-0">
                  <span>View All</span>
                  <ChevronRight className="w-2.5 h-2.5" />
                </span>
              </div>

              {/* 2x2 Product Grid Preview - Real-Time Synchronized with Selected Products! */}
              {selectedProductIds.length === 0 ? (
                <div className="py-8 text-center text-slate-400 space-y-1 border border-dashed border-slate-200 rounded-lg">
                  <Package className="w-5 h-5 mx-auto text-slate-300" />
                  <p className="text-[9px] font-semibold text-slate-600">No products selected</p>
                  <p className="text-[8px] text-slate-400">Select products on the left to see them live</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-1.5">
                  {products
                    .filter((p) => selectedProductIds.includes(p.id))
                    .slice(0, 4)
                    .map((p) => (
                      <div
                        key={p.id}
                        className="border border-slate-200 rounded-lg p-1.5 flex flex-col justify-between space-y-1 bg-white shadow-2xs"
                      >
                        <div className="relative">
                          <img
                            src={p.image}
                            alt={p.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80';
                            }}
                            className="w-full h-16 object-cover rounded-md bg-slate-100"
                          />
                          <div className="w-4 h-4 rounded-full bg-white/90 text-slate-400 flex items-center justify-center absolute top-1 right-1 shadow-2xs">
                            <Heart className="w-2.5 h-2.5" />
                          </div>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-900 block truncate leading-tight">
                            {p.name}
                          </span>
                          <span className="text-[9px] font-black text-slate-900 block mt-0.5">
                            ₹{p.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="w-full py-0.5 rounded border border-blue-600 text-blue-600 text-[8px] font-bold hover:bg-blue-50 transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Cancel and Save */}
      <div className="flex items-center justify-end gap-2.5 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSavingLocal || isSaving}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          {(isSavingLocal || isSaving) && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
          <span>{existingSection ? 'Save Changes' : 'Create Section'}</span>
        </button>
      </div>
    </div>
  );
};

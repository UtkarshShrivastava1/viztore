import React, { useState } from 'react';
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
} from 'lucide-react';
import { useStoreManagementStore, StoreSection } from '../../stores/storeManagementStore.js';

interface AddEditSectionViewProps {
  sectionId?: string | null;
  onBack: () => void;
}

export const AddEditSectionView: React.FC<AddEditSectionViewProps> = ({
  sectionId,
  onBack,
}) => {
  const { sections, addSection, updateSection } = useStoreManagementStore();

  const existingSection = sectionId ? sections.find((s) => s.id === sectionId) : null;

  const [sectionName, setSectionName] = useState(existingSection?.name || 'New Arrivals');
  const [displayOrder, setDisplayOrder] = useState(existingSection?.priority || 2);
  const [isActive, setIsActive] = useState(existingSection ? existingSection.isActive : true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [subCategoryFilter, setSubCategoryFilter] = useState('All Sub Categories');
  const [productTypeFilter, setProductTypeFilter] = useState('All Product Types');
  const [brandFilter, setBrandFilter] = useState('All Brands');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected products
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([
    'p1',
    'p2',
    'p4',
    'p7',
  ]);

  const predefinedNames = [
    "Today's Deal",
    'New Arrivals',
    'Best Sellers',
    'Top Picks',
    'Featured Brands',
    'Categories',
    'Top Rated',
    'All Products',
  ];

  const products = [
    {
      id: 'p1',
      name: 'Men Black Round Neck T-Shirt',
      details: 'Size: M • Color: Black',
      sku: 'VZT-TSHIRT-BLK-M',
      category: "Men's Fashion > T-Shirts",
      stock: 120,
      price: 599,
      rating: 4.5,
      reviews: 320,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'p2',
      name: 'Men White Round Neck T-Shirt',
      details: 'Size: M • Color: White',
      sku: 'VZT-TSHIRT-WHT-M',
      category: "Men's Fashion > T-Shirts",
      stock: 80,
      price: 599,
      rating: 4.5,
      reviews: 280,
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'p3',
      name: 'Men Navy Blue Bound Neck T-Shirt',
      details: 'Size: L • Color: Navy Blue',
      sku: 'VZT-TSHIRT-NVY-L',
      category: "Men's Fashion > T-Shirts",
      stock: 60,
      price: 599,
      rating: 4.3,
      reviews: 110,
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'p4',
      name: 'Men Grey Round Neck T-Shirt',
      details: 'Size: M • Color: Grey',
      sku: 'VZT-TSHIRT-GRY-M',
      category: "Men's Fashion > T-Shirts",
      stock: 45,
      price: 599,
      rating: 4.5,
      reviews: 195,
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'p5',
      name: 'Men Black Polo T-Shirt',
      details: 'Size: M • Color: Black',
      sku: 'VZT-POLO-BLK-M',
      category: "Men's Fashion > Polo T-Shirt",
      stock: 30,
      price: 649,
      rating: 4.6,
      reviews: 180,
      image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'p6',
      name: 'Men Maroon Polo T-Shirt',
      details: 'Size: L • Color: Maroon',
      sku: 'VZT-POLO-MRN-L',
      category: "Men's Fashion > Polo T-Shirt",
      stock: 25,
      price: 649,
      rating: 4.4,
      reviews: 95,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'p7',
      name: 'Men Blue Henley T-Shirt',
      details: 'Size: M • Color: Blue',
      sku: 'VZT-HENLEY-BLU-M',
      category: "Men's Fashion > T-Shirts",
      stock: 20,
      price: 699,
      rating: 4.4,
      reviews: 142,
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'p8',
      name: 'Men Striped Round Neck T-Shirt',
      details: 'Size: M • Color: White/Black',
      sku: 'VZT-TSHIRT-STP-M',
      category: "Men's Fashion > T-Shirts",
      stock: 15,
      price: 599,
      rating: 4.2,
      reviews: 70,
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=100&auto=format&fit=crop&q=80',
    },
  ];

  const toggleSelect = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (existingSection) {
      updateSection(existingSection.id, {
        name: sectionName,
        priority: displayOrder,
        isActive,
        productCount: selectedProductIds.length,
      });
    } else {
      addSection({
        name: sectionName,
        sectionType: 'product',
        isActive,
      });
    }
    onBack();
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

          {/* Section Name dropdown */}
          <div className="relative">
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Section Name <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 flex items-center justify-between text-left hover:border-blue-500"
            >
              <span>{sectionName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1 max-h-56 overflow-y-auto">
                {predefinedNames.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      setSectionName(name);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center justify-between ${
                      sectionName === name ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{name}</span>
                    {sectionName === name && <Check className="w-3 h-3 text-blue-600" />}
                  </button>
                ))}
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
              <option>All Categories</option>
              <option>Men's Fashion</option>
              <option>Women's Fashion</option>
            </select>

            <select
              value={subCategoryFilter}
              onChange={(e) => setSubCategoryFilter(e.target.value)}
              className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700"
            >
              <option>All Sub Categories</option>
              <option>T-Shirts</option>
              <option>Polo T-Shirts</option>
            </select>

            <select
              value={productTypeFilter}
              onChange={(e) => setProductTypeFilter(e.target.value)}
              className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700"
            >
              <option>All Product Types</option>
              <option>Round Neck</option>
              <option>Polo</option>
              <option>Henley</option>
            </select>

            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700"
            >
              <option>All Brands</option>
              <option>Viztore Brand</option>
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
                      checked={selectedProductIds.length === products.length}
                      onChange={() =>
                        setSelectedProductIds(
                          selectedProductIds.length === products.length
                            ? []
                            : products.map((p) => p.id)
                        )
                      }
                      className="rounded border-slate-300 text-blue-600"
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
                {products.map((p) => {
                  const isChecked = selectedProductIds.includes(p.id);
                  return (
                    <tr
                      key={p.id}
                      onClick={() => toggleSelect(p.id)}
                      className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                        isChecked ? 'bg-blue-50/20' : ''
                      }`}
                    >
                      <td className="py-2 px-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(p.id)}
                          className="rounded border-slate-300 text-blue-600"
                        />
                      </td>
                      <td className="py-2 px-2.5">
                        <div className="flex items-center gap-2">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-7 h-7 rounded-lg object-cover border border-slate-200 shrink-0"
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
                      <td className="py-2 px-2 text-right font-black text-slate-900">₹{p.price}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="text-[11px]">Showing 1 to 8 of 248 products</span>
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
              {/* Top search & icons */}
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-[11px] font-black tracking-tight text-blue-600">Store</span>
                <div className="flex items-center gap-2">
                  <Heart className="w-3 h-3 text-slate-500" />
                  <div className="relative">
                    <ShoppingCart className="w-3 h-3 text-slate-500" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 text-white rounded-full text-[7px] flex items-center justify-center font-bold">
                      3
                    </span>
                  </div>
                </div>
              </div>

              {/* Section Title Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                <h4 className="text-[11px] font-black text-slate-900">{sectionName}</h4>
                <span className="text-[9px] text-blue-600 font-bold flex items-center">
                  <span>View All</span>
                  <ChevronRight className="w-2.5 h-2.5" />
                </span>
              </div>

              {/* 2x2 Product Grid Preview */}
              <div className="grid grid-cols-2 gap-1.5">
                {products.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="border border-slate-200 rounded-lg p-1.5 flex flex-col justify-between space-y-1"
                  >
                    <div className="relative">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-16 object-cover rounded-md"
                      />
                      <Heart className="w-2.5 h-2.5 text-slate-400 absolute top-1 right-1" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-900 block truncate">
                        {p.name}
                      </span>
                      <span className="text-[9px] font-black text-slate-900">₹{p.price}</span>
                      <div className="flex items-center gap-0.5 text-[8px] text-amber-500 font-bold">
                        <Star className="w-2 h-2 fill-amber-500" />
                        <span>{p.rating} ({p.reviews})</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="w-full py-0.5 rounded border border-blue-600 text-blue-600 text-[8px] font-bold hover:bg-blue-50"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
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
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          {existingSection ? 'Save Changes' : 'Create Section'}
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  ExternalLink,
  Plus,
  GripVertical,
  Edit2,
  Trash2,
  Search,
  Check,
  Info,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useStoreManagementStore } from '../../stores/storeManagementStore.js';
import { CustomerAppPhonePreview } from './CustomerAppPhonePreview.js';

export const ProductPlacementView: React.FC = () => {
  const {
    sections,
    curatedProducts,
    selectedPlacementSectionId,
    setSelectedPlacementSectionId,
    addProductToSection,
    removeProductFromSection,
    toggleProductStatus,
  } = useStoreManagementStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [selectedToAdd, setSelectedToAdd] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  const defaultSection = sections[0] || {
    id: 'deal-1',
    name: "Today's Deal",
    type: 'deal' as const,
    productCount: 0,
    productIds: [] as string[],
    priority: 1,
    status: 'active' as const,
    schedule: 'Always Visible',
  };
  const currentSection =
    sections.find((s) => s.id === selectedPlacementSectionId) || defaultSection;

  // Curated products that belong to current section
  const sectionProducts = curatedProducts.filter((p) =>
    currentSection.productIds.includes(p.id)
  );

  // Available products to add (not yet in section)
  const availableProducts = curatedProducts.filter(
    (p) => !currentSection.productIds.includes(p.id)
  );

  // Filtered available products
  const filteredAvailable = availableProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      categoryFilter === 'All Categories' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleToggleSelectToAdd = (id: string) => {
    setSelectedToAdd((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddSelected = () => {
    if (selectedToAdd.length === 0) return;
    addProductToSection(currentSection.id, selectedToAdd);
    setSelectedToAdd([]);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Section Selector Bar (14.1.png) */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Product Placement
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Choose which products appear in each section and in what order.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Select Section</span>
            <select
              value={currentSection.id}
              onChange={(e) => setSelectedPlacementSectionId(e.target.value)}
              className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs cursor-pointer"
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.productCount || s.productIds.length} items)
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => alert(`Previewing ${currentSection.name} in Customer App`)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            View in App
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Product placements for '{currentSection.name}' saved successfully!</span>
        </div>
      )}

      {/* Main Grid: Left 2 columns + Right Phone Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Area - 8 cols */}
        <div className="xl:col-span-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Box: Products in This Section (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Products in This Section</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Drag and drop to reorder products. Maximum 20 products allowed.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {sectionProducts.length} / 20 products
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      // Select first available product
                      if (availableProducts.length > 0 && availableProducts[0]) {
                        addProductToSection(currentSection.id, [availableProducts[0].id]);
                      }
                    }}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Add Products
                  </button>
                </div>
              </div>

              {/* Curated Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100 font-semibold text-slate-600 text-[11px]">
                      <th className="py-2.5 px-3 w-10 text-center">#</th>
                      <th className="py-2.5 px-3">Product Details</th>
                      <th className="py-2.5 px-3 text-right">Price</th>
                      <th className="py-2.5 px-3 text-center">Discount</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sectionProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                          No products curated in this section yet. Add from the right picker.
                        </td>
                      </tr>
                    ) : (
                      sectionProducts.map((prod, idx) => (
                        <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1 text-slate-400">
                              <GripVertical className="w-3 h-3 text-slate-300" />
                              <span className="font-mono text-xs">{idx + 1}</span>
                            </div>
                          </td>

                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-9 h-9 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200/60"
                              />
                              <div>
                                <span className="font-bold text-slate-900 block truncate max-w-[140px]">
                                  {prod.name}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  SKU: {prod.sku}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                            ₹{prod.price}
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            {prod.discount ? (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {prod.discount}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[10px]">—</span>
                            )}
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={prod.isActive}
                                onChange={() => toggleProductStatus(prod.id)}
                                className="sr-only peer"
                              />
                              <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                          </td>

                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1 text-slate-400">
                              <button
                                type="button"
                                onClick={() => {
                                  const newPrice = prompt('Edit price for ' + prod.name, String(prod.price));
                                  if (newPrice && !isNaN(Number(newPrice))) {
                                    prod.price = Number(newPrice);
                                    handleSave();
                                  }
                                }}
                                className="p-1 hover:text-blue-600 rounded transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeProductFromSection(currentSection.id, prod.id)}
                                className="p-1 hover:text-rose-600 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Informational Footer Note */}
              <div className="p-3 bg-blue-50/70 border-t border-blue-100 flex items-center gap-2 text-[11px] text-blue-700 font-medium">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Only active products with stock will be shown in the customer app.</span>
              </div>
            </div>

            {/* Right Box: Add Products to This Section (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex flex-col space-y-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Add Products to This Section</h3>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by name or SKU..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-2xs"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Category Filter Dropdown */}
              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-600 shadow-2xs"
                >
                  <option value="All Categories">Filter: All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Wearables">Wearables</option>
                  <option value="Audio">Audio</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Bags">Bags</option>
                  <option value="Fragrance">Fragrance</option>
                </select>
              </div>

              {/* Available Products List */}
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {filteredAvailable.length === 0 ? (
                  <p className="text-center py-8 text-xs text-slate-400">
                    No products matching search or all products already in section.
                  </p>
                ) : (
                  filteredAvailable.map((p) => {
                    const isSelected = selectedToAdd.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleToggleSelectToAdd(p.id)}
                        className={`p-2 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {/* Checkbox */}
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>

                          {/* Thumbnail */}
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-8 h-8 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200/60"
                          />

                          <div>
                            <span className="text-xs font-bold text-slate-800 block truncate max-w-[130px]">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              SKU: {p.sku}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-900 block">
                            ₹{p.price}
                          </span>
                          <span className="text-[10px] text-slate-400">Stock: {p.stock}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Sticky Action Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">
                  {selectedToAdd.length} selected
                </span>
                <button
                  type="button"
                  onClick={handleAddSelected}
                  disabled={selectedToAdd.length === 0}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  Add Selected ({selectedToAdd.length})
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Save Changes Bar */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Right Column - 4 cols (Customer App Phone Preview) */}
        <div className="xl:col-span-4 sticky top-4">
          <CustomerAppPhonePreview mode="customer_home" />
        </div>
      </div>
    </div>
  );
};

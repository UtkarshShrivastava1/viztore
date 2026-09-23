import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  ArrowUpDown,
  Eye,
  ShoppingBag,
  Plus,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Edit2,
  Trash2,
  FolderTree,
  Image as ImageIcon,
  Sparkles,
  Shield,
  Tag,
  Star,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { useStoreManagementStore, StoreSection } from '../../stores/storeManagementStore.js';
import { AddSectionModal } from './AddSectionModal.js';
import { CustomerAppPhonePreview } from './CustomerAppPhonePreview.js';

export const StoreSectionsView: React.FC = () => {
  const {
    sections,
    kpis,
    isAddSectionModalOpen,
    openAddSectionModal,
    closeAddSectionModal,
    toggleSectionStatus,
    moveSectionPriority,
    updateSectionPriority,
    deleteSection,
  } = useStoreManagementStore();

  const [selectedQuickType, setSelectedQuickType] = useState<
    'product' | 'category' | 'banner' | 'brand'
  >('product');

  const [editingSection, setEditingSection] = useState<StoreSection | null>(null);

  const handleOpenQuickType = (type: 'product' | 'category' | 'banner' | 'brand') => {
    setSelectedQuickType(type);
    openAddSectionModal();
  };

  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'Special':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'New':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Popular':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Category':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Brand':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getSectionIcon = (sec: StoreSection) => {
    if (sec.badge === 'Special') {
      return (
        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Tag className="w-4 h-4" />
        </div>
      );
    }
    if (sec.badge === 'New') {
      return (
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
      );
    }
    if (sec.badge === 'Popular') {
      return (
        <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
          <Star className="w-4 h-4" />
        </div>
      );
    }
    if (sec.badge === 'Category') {
      return (
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <FolderTree className="w-4 h-4" />
        </div>
      );
    }
    if (sec.badge === 'Brand') {
      return (
        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <ShoppingBag className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
        <Layers className="w-4 h-4" />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 5 Top KPI Cards (14.0.png) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">Total Sections</span>
            <div className="text-xl font-black text-slate-900 leading-tight">
              {kpis.totalSections}
            </div>
            <span className="text-[10px] text-slate-400">Active</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">Active Sections</span>
            <div className="text-xl font-black text-slate-900 leading-tight">
              {kpis.activeSections}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              {Math.round((kpis.activeSections / Math.max(1, kpis.totalSections)) * 100)}% of total
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <ArrowUpDown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">Total Products</span>
            <div className="text-xl font-black text-slate-900 leading-tight">
              {kpis.totalProducts}
            </div>
            <span className="text-[10px] text-slate-400">Across all sections</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">App Impressions</span>
            <div className="text-xl font-black text-slate-900 leading-tight">
              {kpis.impressions.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              {kpis.impressionsGrowth}
            </span>
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex items-center gap-3.5 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">App Clicks</span>
            <div className="text-xl font-black text-slate-900 leading-tight">
              {kpis.clicks.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              {kpis.clicksGrowth}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Table & Quick Tiles) + Right Column (Phone Preview) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column - 8 cols */}
        <div className="xl:col-span-8 space-y-6">
          {/* Manage Sections Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            {/* Table Header Action Bar */}
            <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Manage Sections</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Create, reorder and manage sections that will appear in your store on the customer app.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedQuickType('product');
                  openAddSectionModal();
                }}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add New Section
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 font-semibold text-slate-600">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">Section Details</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-center">Products</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Priority</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sections.map((sec, idx) => (
                    <tr key={sec.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Priority # with Drag Handle */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-400">
                          <GripVertical className="w-3.5 h-3.5 cursor-grab text-slate-300 hover:text-slate-500" />
                          <span className="font-mono font-bold text-slate-700 text-xs">
                            {idx + 1}
                          </span>
                        </div>
                      </td>

                      {/* Section Details */}
                      <td className="py-3 px-4">
                        <div className="flex items-start gap-3">
                          {getSectionIcon(sec)}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-xs">{sec.name}</span>
                              {sec.badge && (
                                <span
                                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold border ${getBadgeStyle(
                                    sec.badge
                                  )}`}
                                >
                                  {sec.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{sec.description}</p>
                          </div>
                        </div>
                      </td>

                      {/* Section Type */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            sec.type === 'Automatic'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {sec.type}
                        </span>
                      </td>

                      {/* Products Count */}
                      <td className="py-3 px-4 text-center font-bold text-slate-800">
                        {sec.productCount}
                      </td>

                      {/* Active Switch */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={sec.isActive}
                              onChange={() => toggleSectionStatus(sec.id)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                          </label>
                          <span
                            className={`text-xs font-semibold ${
                              sec.isActive ? 'text-emerald-700' : 'text-slate-400'
                            }`}
                          >
                            {sec.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>

                      {/* Priority Steppers */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveSectionPriority(sec.id, 'up')}
                            disabled={sec.priority <= 1}
                            className="w-6 h-6 rounded-md border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <div className="w-7 h-6 rounded-md bg-slate-50 border border-slate-200 font-mono font-bold text-xs flex items-center justify-center text-slate-800">
                            {sec.priority}
                          </div>
                          <button
                            type="button"
                            onClick={() => moveSectionPriority(sec.id, 'down')}
                            disabled={sec.priority >= sections.length}
                            className="w-6 h-6 rounded-md border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const newName = prompt('Update section name:', sec.name);
                              if (newName) {
                                useStoreManagementStore
                                  .getState()
                                  .updateSection(sec.id, { name: newName });
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Edit section"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete '${sec.name}'?`)) {
                                deleteSection(sec.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Delete section"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Cards: Add New Section Quick Tiles + Section Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quick Creation Tiles */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Add New Section</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Choose a section type to add to your store.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenQuickType('product')}
                  className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 text-left transition-all group"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
                    Product Section
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                    Display products in a section
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenQuickType('category')}
                  className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 text-left transition-all group"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <FolderTree className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-600">
                    Category Section
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                    Display categories in a section
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenQuickType('banner')}
                  className="p-3 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/30 text-left transition-all group"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-amber-600">
                    Banner / Image
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                    Promote offers or announcements
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenQuickType('brand')}
                  className="p-3 rounded-xl border border-slate-200 hover:border-rose-500 hover:bg-rose-50/30 text-left transition-all group"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-rose-600">
                    Brand Section
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                    Showcase brands in a section
                  </p>
                </button>
              </div>
            </div>

            {/* Section Tips Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3.5">
              <h4 className="text-xs font-bold text-slate-900">Section Tips</h4>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-md bg-purple-50 text-purple-600 shrink-0 mt-0.5">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] leading-tight">
                    Use high priority for important sections (1 is highest)
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-md bg-amber-50 text-amber-600 shrink-0 mt-0.5">
                    <Tag className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] leading-tight">
                    Keep your best offers in Today's Deal section
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-md bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <Star className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] leading-tight">
                    New Arrivals and Best Sellers increase engagement
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-md bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] leading-tight">
                    You can re-order sections by changing priority
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-md bg-slate-100 text-slate-600 shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] leading-tight">
                    Changes will reflect in the customer app instantly
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - 4 cols (Customer App Preview) */}
        <div className="xl:col-span-4 sticky top-4">
          <CustomerAppPhonePreview mode="customer_home" />
        </div>
      </div>

      {/* Add New Section Modal */}
      <AddSectionModal
        isOpen={isAddSectionModalOpen}
        onClose={closeAddSectionModal}
        defaultType={selectedQuickType}
      />
    </div>
  );
};

import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  Boxes,
  Plus,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Trash2,
  Info,
  Tag,
  Star,
  FolderTree,
  ShoppingBag,
  Sparkles,
  Box,
} from 'lucide-react';
import { useStoreManagementStore, StoreSection } from '../../stores/storeManagementStore.js';
import { AddEditSectionView } from './AddEditSectionView.js';

export const StoreSectionsView: React.FC = () => {
  const {
    sections,
    kpis,
    toggleSectionStatus,
    moveSectionPriority,
    deleteSection,
  } = useStoreManagementStore();

  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  if (isEditingMode) {
    return (
      <AddEditSectionView
        sectionId={editingSectionId}
        onBack={() => {
          setIsEditingMode(false);
          setEditingSectionId(null);
        }}
      />
    );
  }

  const getSectionIcon = (sec: StoreSection) => {
    if (sec.id === 'sec-1') {
      return (
        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Tag className="w-4 h-4" />
        </div>
      );
    }
    if (sec.id === 'sec-2') {
      return (
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-black text-[9px]">
          NEW
        </div>
      );
    }
    if (sec.id === 'sec-3') {
      return (
        <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
          <Star className="w-4 h-4" />
        </div>
      );
    }
    if (sec.id === 'sec-4') {
      return (
        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <FolderTree className="w-4 h-4" />
        </div>
      );
    }
    if (sec.id === 'sec-5') {
      return (
        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
      );
    }
    if (sec.id === 'sec-6') {
      return (
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <ShoppingBag className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
        <Box className="w-4 h-4" />
      </div>
    );
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
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Default':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* 3 Top KPI Cards (13.1.png) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Card 1: Total Sections */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-slate-500 block truncate">Total Sections</span>
            <div className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate">
              {kpis.totalSections}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block truncate">Active</span>
          </div>
        </div>

        {/* Card 2: Active Sections */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-slate-500 block truncate">Active Sections</span>
            <div className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate">
              {kpis.activeSections}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block truncate">83% of total</span>
          </div>
        </div>

        {/* Card 3: Total Products in Sections */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-slate-500 block truncate">
              Total Products in Sections
            </span>
            <div className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate">
              {kpis.totalProducts}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block truncate">Across all sections</span>
          </div>
        </div>
      </div>

      {/* Main Table Card (13.1.png) */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Table Header Action Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Manage Sections</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Create, edit and reorder sections that will appear in your store on the customer app.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingSectionId(null);
              setIsEditingMode(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Section</span>
          </button>
        </div>

        {/* Sections High-Density Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3 w-8">#</th>
                <th className="py-2.5 px-3">Section Details</th>
                <th className="py-2.5 px-3 text-center">Products</th>
                <th className="py-2.5 px-3 text-center">Display Order</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sections.map((sec, idx) => {
                const isLastAlwaysOn = !!sec.isAlwaysOn;

                return (
                  <tr key={sec.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Priority # with Drag Handle */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1 text-slate-400">
                        <GripVertical className="w-3.5 h-3.5" />
                        <span className="font-bold text-slate-700">{idx + 1}</span>
                      </div>
                    </td>

                    {/* Section Details */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        {getSectionIcon(sec)}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">{sec.name}</span>
                            {sec.badge && (
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border ${getBadgeStyle(
                                  sec.badge
                                )}`}
                              >
                                {sec.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate max-w-xs">
                            {sec.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Products Count */}
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                      {sec.productCount}
                    </td>

                    {/* Display Order */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      {isLastAlwaysOn ? (
                        <span className="text-slate-400 font-bold">—</span>
                      ) : (
                        <div className="inline-flex items-center gap-1 border border-slate-200 rounded-lg px-2 py-0.5 bg-slate-50">
                          <button
                            type="button"
                            onClick={() => moveSectionPriority(sec.id, 'up')}
                            disabled={sec.priority <= 1}
                            className="text-slate-500 hover:text-blue-600 disabled:opacity-30"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-slate-800 text-[11px] px-1">
                            {sec.priority}
                          </span>
                          <button
                            type="button"
                            onClick={() => moveSectionPriority(sec.id, 'down')}
                            disabled={sec.priority >= sections.length - 1}
                            className="text-slate-500 hover:text-blue-600 disabled:opacity-30"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Active Switch */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {isLastAlwaysOn ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-7 h-4 rounded-full bg-slate-200 flex items-center p-0.5 opacity-60">
                            <div className="w-3 h-3 rounded-full bg-slate-400" />
                          </div>
                          <span className="text-[10px] font-semibold text-slate-500">Always On</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleSectionStatus(sec.id)}
                          className="flex items-center gap-1.5 group"
                        >
                          <div
                            className={`w-7 h-4 rounded-full transition-colors flex items-center p-0.5 ${
                              sec.isActive ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                            }`}
                          >
                            <div className="w-3 h-3 rounded-full bg-white shadow-xs" />
                          </div>
                          <span
                            className={`text-[10px] font-bold ${
                              sec.isActive ? 'text-emerald-600' : 'text-slate-400'
                            }`}
                          >
                            {sec.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </button>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSectionId(sec.id);
                            setIsEditingMode(true);
                          }}
                          className="px-2.5 py-1 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Edit Section
                        </button>
                        <button
                          type="button"
                          disabled={isLastAlwaysOn}
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete '${sec.name}'?`)) {
                              deleteSection(sec.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 disabled:opacity-30 transition-colors"
                          title="Delete Section"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Banner Notice (13.1.png) */}
        <div className="p-3 bg-blue-50/60 border-t border-slate-100 flex items-center gap-2 text-xs text-blue-800">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            The &apos;All Products&apos; section is enabled by default and shows all products from your store. You can reorder it, but it cannot be deleted.
          </span>
        </div>
      </div>
    </div>
  );
};

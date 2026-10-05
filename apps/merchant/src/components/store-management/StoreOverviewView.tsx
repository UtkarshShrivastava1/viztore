import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  Boxes,
  ArrowUpDown,
  Tag,
  Sparkles,
  Star,
  FolderTree,
  ShoppingBag,
  Box,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Edit2,
  Trash2,
  BookOpen,
  Eye,
  ChevronRight,
  Camera,
} from 'lucide-react';
import { useStoreManagementStore, StoreSection } from '../../stores/storeManagementStore.js';

export const StoreOverviewView: React.FC = () => {
  const {
    sections,
    kpis,
    storeLogo,
    storeBanner,
    storeDescription,
    setStoreLogo,
    setStoreBanner,
    setStoreDescription,
    toggleSectionStatus,
    moveSectionPriority,
    deleteSection,
    setActiveSubTab,
  } = useStoreManagementStore();

  const [descText, setDescText] = useState(storeDescription);
  const [logoPreview, setLogoPreview] = useState(storeLogo);
  const [bannerPreview, setBannerPreview] = useState(storeBanner);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
      setStoreLogo(url);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBannerPreview(url);
      setStoreBanner(url);
    }
  };

  const handleDescBlur = () => {
    setStoreDescription(descText);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

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
      {/* 3 Top KPI Cards (New 13.0.png) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Card 1: Total Sections */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Total Sections</span>
            <div className="text-xl font-black text-slate-900 leading-tight">
              {kpis.totalSections}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Active</span>
          </div>
        </div>

        {/* Card 2: Active Sections */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Active Sections</span>
            <div className="text-xl font-black text-slate-900 leading-tight">
              {kpis.activeSections}
            </div>
            <span className="text-[11px] text-emerald-600 font-bold">83% of total</span>
          </div>
        </div>

        {/* Card 3: Total Products in Sections */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">
              Total Products in Sections
            </span>
            <div className="text-xl font-black text-slate-900 leading-tight">
              {kpis.totalProducts}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Across all sections</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid: Manage Sections (Left 8 cols) + Store Appearance (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Manage Sections Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Manage Sections</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Create, edit and reorder sections that will appear in your store on the customer app.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveSubTab('sections')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-bold transition-colors shrink-0"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Reorder Sections</span>
            </button>
          </div>

          {/* Sections Table (High-Density) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3 w-8">#</th>
                  <th className="py-2.5 px-3">Section Name</th>
                  <th className="py-2.5 px-2.5 text-center">Products</th>
                  <th className="py-2.5 px-2.5">Display On</th>
                  <th className="py-2.5 px-2.5">Status</th>
                  <th className="py-2.5 px-2.5 text-center">Order</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sections.map((sec, idx) => {
                  const isLastAlwaysOn = !!sec.isAlwaysOn;

                  return (
                    <tr key={sec.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1 text-slate-400">
                          <GripVertical className="w-3.5 h-3.5" />
                          <span className="font-bold text-slate-700">{idx + 1}</span>
                        </div>
                      </td>

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
                            <span className="text-[10px] text-slate-400 block truncate max-w-xs">
                              {sec.description}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 px-2.5 text-center font-bold text-slate-800">
                        {sec.productCount}
                      </td>

                      <td className="py-2.5 px-2.5 text-slate-600 font-medium">
                        {sec.displayOn || 'Home'}
                      </td>

                      <td className="py-2.5 px-2.5 whitespace-nowrap">
                        {isLastAlwaysOn ? (
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-3.5 rounded-full bg-slate-200 flex items-center p-0.5 opacity-60">
                              <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
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

                      <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                        {isLastAlwaysOn ? (
                          <span className="text-slate-400 font-bold">—</span>
                        ) : (
                          <div className="inline-flex items-center gap-1 border border-slate-200 rounded-lg px-1.5 py-0.5 bg-slate-50">
                            <button
                              type="button"
                              onClick={() => moveSectionPriority(sec.id, 'up')}
                              disabled={sec.priority <= 1}
                              className="text-slate-500 hover:text-blue-600 disabled:opacity-30"
                            >
                              <ChevronUp className="w-3 h-3" />
                            </button>
                            <span className="font-bold text-slate-800 text-[11px] px-0.5">
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

                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            disabled={isLastAlwaysOn}
                            onClick={() => {
                              setActiveSubTab('sections');
                            }}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-md disabled:opacity-30"
                            title="Edit Section"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={isLastAlwaysOn}
                            onClick={() => deleteSection(sec.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md disabled:opacity-30"
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
        </div>

        {/* Right Column: Store Appearance (4 cols) (New 13.0.png) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Store Appearance</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage how your store looks in the customer app.
            </p>
          </div>

          {/* Store Logo */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800 block">Store Logo</span>
            <div className="flex items-center gap-3.5">
              {/* Logo Preview Square */}
              <div className="relative w-20 h-20 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-center p-2 text-xs border border-slate-800 shadow-sm overflow-hidden group shrink-0">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="uppercase tracking-wider text-[11px]">FASHION HUB</span>
                )}
                <label className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-blue-700 transition-colors">
                  <Camera className="w-2.5 h-2.5" />
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                </label>
              </div>

              {/* Logo Actions */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <label className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer shadow-2xs">
                    Change Logo
                    <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setLogoPreview('');
                      setStoreLogo('');
                    }}
                    className="p-1.5 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Remove logo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 leading-snug">
                  Recommended size: 512 × 512 px PNG, JPG (Max 2 MB)
                </p>
              </div>
            </div>
          </div>

          {/* Store Banner Image */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-800 block">Store Banner Image</span>
            {/* Banner Preview Graphic */}
            <div className="relative h-24 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-950 overflow-hidden border border-slate-800 shadow-sm group">
              <img
                src={bannerPreview}
                alt="Banner"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-950/70 via-transparent to-transparent flex flex-col justify-center px-3.5 text-white">
                <span className="text-xs font-black tracking-wide leading-tight">New Collection</span>
                <span className="text-[9px] text-blue-200">Trendy Styles for Every You</span>
              </div>
              <label className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-blue-700 transition-colors">
                <Camera className="w-3 h-3" />
                <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
              </label>
            </div>

            {/* Banner Actions */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <label className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer shadow-2xs">
                  Change Banner
                  <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setBannerPreview('');
                    setStoreBanner('');
                  }}
                  className="p-1.5 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 transition-colors"
                  title="Remove banner"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[10px] text-slate-400">
                1200 × 400 px
              </span>
            </div>
          </div>

          {/* Store Description */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800">Store Description</span>
              <span className="text-[10px] text-slate-400">{descText.length}/300</span>
            </div>
            <textarea
              rows={3}
              maxLength={300}
              value={descText}
              onChange={(e) => setDescText(e.target.value)}
              onBlur={handleDescBlur}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Trendy fashion for everyday style..."
            />
            {isSavedNotice && (
              <span className="text-[11px] text-emerald-600 font-bold block animate-in fade-in">
                ✓ Description saved!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Section Guidelines (4 cols) & Section Preview Order (8 cols - spacious, long, and clear) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Section Guidelines (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <h4 className="font-bold text-slate-900 text-xs">Section Guidelines</h4>
            </div>
            <p className="text-[11px] text-slate-400">Tips to organize your sections effectively.</p>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span className="text-[11px]">Keep your most important sections at the top (1 is highest).</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span className="text-[11px]">Use clear and short section names.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span className="text-[11px]">Featured sections like Today's Deal and Best Sellers can improve engagement.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span className="text-[11px]">You can show or hide sections anytime. Changes reflect instantly in the customer app.</span>
            </div>
          </div>
        </div>

        {/* Section Preview Order (8 cols - user mandate: "badiya lamba rakh na" - wide, spacious, and prominent) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-4 h-4 text-blue-600" />
              <h4 className="font-bold text-slate-900 text-xs">Section Preview Order</h4>
            </div>
            <p className="text-[11px] text-slate-400">
              This is how your sections will appear on the customer app.
            </p>
          </div>

          {/* Expansive Horizontal Flowing Sequence with generous size and cards */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-2 px-1">
            {sections.map((sec, i) => (
              <React.Fragment key={sec.id}>
                <div className="flex-1 min-w-[90px] max-w-[130px] p-3 bg-white border border-slate-200 rounded-xl shadow-2xs hover:shadow-xs hover:border-blue-300 flex flex-col items-center justify-center text-center transition-all group">
                  <div className="mb-2 transition-transform group-hover:scale-110">
                    {getSectionIcon(sec)}
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 tracking-tight leading-tight line-clamp-1 group-hover:text-blue-600">
                    {sec.name}
                  </span>
                </div>
                {i < sections.length - 1 && (
                  <div className="text-slate-300 font-bold px-0.5 shrink-0 select-none">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

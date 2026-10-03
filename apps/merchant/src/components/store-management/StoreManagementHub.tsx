import React, { useState } from 'react';
import {
  Settings,
  Layers,
  Box,
  Link2,
  ExternalLink,
  Save,
  CheckCircle2,
  LayoutList,
  Sparkles,
} from 'lucide-react';
import {
  useStoreManagementStore,
  StoreManagementSubTab,
} from '../../stores/storeManagementStore.js';
import { StoreOverviewView } from './StoreOverviewView.js';
import { StoreSectionsView } from './StoreSectionsView.js';
import { ManageBannerLogoView } from './ManageBannerLogoView.js';
import { StoreQrLinkView } from './StoreQrLinkView.js';
import { ProductPlacementView } from './ProductPlacementView.js';
import { StoreViewSettingsView } from './StoreViewSettingsView.js';

export const StoreManagementHub: React.FC = () => {
  const { activeSubTab, setActiveSubTab } = useStoreManagementStore();
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleGlobalSave = () => {
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  // When on "My Store QR & Link", render the dedicated full-screen view (mockup 13.3 / media_1791024769882.jpg)
  if (activeSubTab === 'qr_link') {
    return (
      <div className="pb-12">
        <StoreQrLinkView />
      </div>
    );
  }

  // 4 authoritative sub-navigation tabs (mockup 13.0 / media_1791024769913.jpg)
  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Settings },
    { id: 'sections' as const, label: 'Manage Sections', icon: Layers },
    { id: 'banner_logo' as const, label: 'Manage Banner / Logo', icon: Box },
    { id: 'qr_link' as const, label: 'My Store QR & Link', icon: Link2 },
  ];

  const isSectionsGroup =
    activeSubTab === 'sections' ||
    activeSubTab === 'placement' ||
    activeSubTab === 'view_settings';

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Page Header (media_1791024769913.jpg) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Store Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage how your store and products appear in the customer app.
          </p>
        </div>

        {/* Action triggers if editing sections or placement */}
        {isSectionsGroup && (
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => alert('Launching customer app preview in a new window...')}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>Preview in App</span>
            </button>

            <button
              type="button"
              onClick={handleGlobalSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      {isSavedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>All storefront configurations have been updated and synchronized!</span>
        </div>
      )}

      {/* 4 Tabs Navigation Bar (Image 2) */}
      <div className="border-b border-slate-200 flex items-center gap-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive =
            activeSubTab === tab.id ||
            (tab.id === 'sections' &&
              (activeSubTab === 'placement' || activeSubTab === 'view_settings'));

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary pills strip when on sections/placement/view_settings */}
      {isSectionsGroup && (
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setActiveSubTab('sections')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              activeSubTab === 'sections'
                ? 'bg-white text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sections
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('placement')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              activeSubTab === 'placement'
                ? 'bg-white text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Product Placement
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('view_settings')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              activeSubTab === 'view_settings'
                ? 'bg-white text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Store View Settings
          </button>
        </div>
      )}

      {/* Sub-Views Content */}
      <div>
        {activeSubTab === 'overview' && <StoreOverviewView />}
        {activeSubTab === 'sections' && <StoreSectionsView />}
        {activeSubTab === 'banner_logo' && <ManageBannerLogoView />}
        {activeSubTab === 'placement' && <ProductPlacementView />}
        {activeSubTab === 'view_settings' && <StoreViewSettingsView />}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Layers,
  Box,
  Link2,
  ExternalLink,
  CheckCircle2,
  LayoutGrid,
} from 'lucide-react';
import {
  useStoreManagementStore,
  StoreManagementSubTab,
} from '../../stores/storeManagementStore.js';
import { StoreOverviewView } from './StoreOverviewView.js';
import { StoreSectionsView } from './StoreSectionsView.js';
import { ManageBannerLogoView } from './ManageBannerLogoView.js';
import { StoreQrLinkView } from './StoreQrLinkView.js';

export const StoreManagementHub: React.FC = () => {
  const { activeSubTab, setActiveSubTab } = useStoreManagementStore();
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // 4 authoritative sub-navigation tabs matching New 13.0.png and New 13.3.png
  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutGrid },
    { id: 'sections' as const, label: 'Manage Sections', icon: Layers },
    { id: 'banner_logo' as const, label: 'Manage Banner / Logo', icon: Box },
    { id: 'qr_link' as const, label: 'My Store QR & Link', icon: Link2 },
  ];

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-150">
      {/* Page Header (New 13.0.png & New 13.3.png) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Store Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage how your store and products appear in the customer app.
          </p>
        </div>
      </div>

      {isSavedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>All storefront configurations have been updated and synchronized!</span>
        </div>
      )}

      {/* 4 Tabs Navigation Bar (Persistent across all subtabs including QR & Link) */}
      <div className="border-b border-slate-200 bg-white">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar px-1">
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
                className={`py-3 text-xs font-bold transition-all relative flex items-center gap-2 whitespace-nowrap ${
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
      </div>

      {/* Sub-Views Content */}
      <div>
        {activeSubTab === 'overview' && <StoreOverviewView />}
        {(activeSubTab === 'sections' ||
          activeSubTab === 'placement' ||
          activeSubTab === 'view_settings') && <StoreSectionsView />}
        {activeSubTab === 'banner_logo' && <ManageBannerLogoView />}
        {activeSubTab === 'qr_link' && <StoreQrLinkView />}
      </div>
    </div>
  );
};

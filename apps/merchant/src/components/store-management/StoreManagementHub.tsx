import React, { useState } from 'react';
import { ExternalLink, Save, CheckCircle2 } from 'lucide-react';
import { useStoreManagementStore } from '../../stores/storeManagementStore.js';
import { StoreSectionsView } from './StoreSectionsView.js';
import { ProductPlacementView } from './ProductPlacementView.js';
import { StoreViewSettingsView } from './StoreViewSettingsView.js';

export const StoreManagementHub: React.FC = () => {
  const { activeSubTab, setActiveSubTab } = useStoreManagementStore();
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleGlobalSave = () => {
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const tabs = [
    { id: 'sections' as const, label: 'Sections' },
    { id: 'placement' as const, label: 'Product Placement' },
    { id: 'view_settings' as const, label: 'Store View Settings' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Page Header (14.0.png, 14.1.png, 14.2.png) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Store Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage how your store and products appear in the customer app.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => alert('Launching full customer app preview in new browser tab...')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            Preview in App
          </button>

          <button
            type="button"
            onClick={handleGlobalSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      {isSavedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>All store management preferences have been updated and synchronized!</span>
        </div>
      )}

      {/* Sub-Navigation Tabs Strip */}
      <div className="border-b border-slate-200 flex items-center gap-8">
        {tabs.map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`pb-3 text-xs font-bold transition-all relative ${
                isActive
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Sub-Views */}
      <div>
        {activeSubTab === 'sections' && <StoreSectionsView />}
        {activeSubTab === 'placement' && <ProductPlacementView />}
        {activeSubTab === 'view_settings' && <StoreViewSettingsView />}
      </div>
    </div>
  );
};

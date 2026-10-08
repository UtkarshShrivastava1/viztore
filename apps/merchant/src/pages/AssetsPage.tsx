import React, { useState } from 'react';
import { Plus, Upload, ChevronDown, Download, Home, ChevronRight } from 'lucide-react';
import { useAssetStore, Asset } from '../stores/assetStore.js';
import { AssetKPIBar } from '../components/assets/AssetKPIBar.js';
import { AssetTable } from '../components/assets/AssetTable.js';
import { AddAssetView } from '../components/assets/AddAssetView.js';
import { AssetMaintenanceDrawer } from '../components/assets/AssetMaintenanceDrawer.js';

interface AssetsPageProps {
  onNavigateHome?: () => void;
}

export const AssetsPage: React.FC<AssetsPageProps> = ({ onNavigateHome }) => {
  const { viewMode, setViewMode } = useAssetStore();

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);

  const handleOpenMaintenance = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsMaintenanceOpen(true);
  };

  if (viewMode === 'add') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <AddAssetView onBack={() => setViewMode('list')} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb matching mockup 9.0.png */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button
          type="button"
          onClick={onNavigateHome}
          className="hover:text-blue-600 flex items-center gap-1"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800">Asset Management</span>
      </div>

      {/* Header matching mockup 9.0.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Asset Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track and manage all your business assets in one place.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative">
          <button
            type="button"
            onClick={() => setViewMode('add')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Asset</span>
          </button>

          <button
            type="button"
            onClick={() => alert('Import CSV/Excel asset register feature')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import Assets</span>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
              className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors shadow-2xs"
            >
              <span>More Actions</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isMoreActionsOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-30 animate-in fade-in duration-100 text-left">
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreActionsOpen(false);
                    alert('Asset Depreciation Schedule exported (PDF).');
                  }}
                  className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-700 text-xs flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  Depreciation Schedule (PDF)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreActionsOpen(false);
                    alert('Exporting full asset register to CSV...');
                  }}
                  className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-700 text-xs flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  Export All Assets (CSV)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5 KPI Cards matching 9.0.png */}
      <AssetKPIBar />

      {/* Assets Data Table matching 9.0.png */}
      <AssetTable
        onViewAsset={(asset) => handleOpenMaintenance(asset)}
        onOpenMaintenance={handleOpenMaintenance}
      />

      {/* Equipment Maintenance Drawer */}
      <AssetMaintenanceDrawer
        asset={selectedAsset}
        isOpen={isMaintenanceOpen}
        onClose={() => setIsMaintenanceOpen(false)}
      />
    </div>
  );
};

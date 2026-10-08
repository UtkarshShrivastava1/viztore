import React, { useState } from 'react';
import {
  X,
  Wrench,
  Calendar,
  DollarSign,
  User,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { useAssetStore, Asset, MaintenanceRecord, AssetStatus } from '../../stores/assetStore.js';

interface AssetMaintenanceDrawerProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AssetMaintenanceDrawer: React.FC<AssetMaintenanceDrawerProps> = ({
  asset,
  isOpen,
  onClose,
}) => {
  const { addMaintenanceLog, updateAssetStatus } = useAssetStore();

  const [serviceType, setServiceType] = useState('');
  const [cost, setCost] = useState('');
  const [technician, setTechnician] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'Scheduled' | 'Completed'>('Scheduled');
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!isOpen || !asset) return null;

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceType.trim()) return;

    addMaintenanceLog(asset.id, {
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      serviceType,
      cost: parseFloat(cost) || 0,
      technician: technician || 'Internal Maintenance Staff',
      notes,
      status,
    });

    setServiceType('');
    setCost('');
    setTechnician('');
    setNotes('');
    setIsFormOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{asset.name}</h3>
                <span className="text-[11px] font-mono text-slate-400">
                  {asset.code} • {asset.category}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Status & Valuation Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Current Status</span>
                <select
                  value={asset.status}
                  onChange={(e) => updateAssetStatus(asset.id, e.target.value as AssetStatus)}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                >
                  <option value="Active">Active</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Fully Depreciated">Fully Depreciated</option>
                  <option value="Disposed">Disposed</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Purchase Value
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    ₹{asset.purchaseValue.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Current Book Value
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    ₹{asset.currentValue.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 pt-1">
                Location: <strong className="text-slate-800">{asset.location}</strong>
                {asset.warrantyExpiryDate && (
                  <span className="block mt-0.5">
                    Warranty valid until: <strong className="text-slate-800">{asset.warrantyExpiryDate}</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Maintenance History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Maintenance & Service Log
                </h4>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(!isFormOpen)}
                  className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Log Service
                </button>
              </div>

              {/* Add Log Form */}
              {isFormOpen && (
                <form
                  onSubmit={handleAddLog}
                  className="p-4 bg-purple-50/40 rounded-xl border border-purple-200 space-y-3 animate-in fade-in"
                >
                  <h5 className="text-xs font-bold text-purple-900">New Service Record</h5>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Service Type *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Regular servicing, part replacement"
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Cost (₹)
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Technician / Agency
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Voltas Care"
                        value={technician}
                        onChange={(e) => setTechnician(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Status
                    </label>
                    <div className="flex items-center gap-4 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="mStatus"
                          checked={status === 'Scheduled'}
                          onChange={() => setStatus('Scheduled')}
                        />
                        <span>Scheduled</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="mStatus"
                          checked={status === 'Completed'}
                          onChange={() => setStatus('Completed')}
                        />
                        <span>Completed</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Notes
                    </label>
                    <input
                      type="text"
                      placeholder="Service notes or findings"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1 bg-purple-600 text-white rounded-lg text-xs font-bold"
                    >
                      Save Log
                    </button>
                  </div>
                </form>
              )}

              {/* Maintenance list */}
              {asset.maintenanceHistory.length === 0 ? (
                <div className="p-4 text-center bg-slate-50 rounded-xl text-xs text-slate-400">
                  No maintenance records logged for this asset yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {asset.maintenanceHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs text-slate-900">{item.serviceType}</div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>
                          {item.date} • {item.technician}
                        </span>
                        <span className="font-extrabold text-slate-900">
                          ₹{item.cost.toLocaleString('en-IN')}
                        </span>
                      </div>
                      {item.notes && (
                        <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

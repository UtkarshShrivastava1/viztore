import React, { useState } from 'react';
import { X, MapPin, Check } from 'lucide-react';
import { useSettingsStore, DeliverySettings } from '../../stores/settingsStore.js';

interface DeliverySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeliverySettingsModal: React.FC<DeliverySettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { deliverySettings, updateDeliverySettings } = useSettingsStore();
  const [form, setForm] = useState<DeliverySettings>({ ...deliverySettings });

  if (!isOpen) return null;

  const handleSave = () => {
    updateDeliverySettings(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delivery Settings</h3>
              <p className="text-xs text-slate-500">
                Configure delivery times, minimum order value and thresholds.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Min Delivery Time (mins)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={form.estimatedTimeMin}
                onChange={(e) =>
                  setForm({ ...form, estimatedTimeMin: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-500 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Max Delivery Time (mins)
              </label>
              <input
                type="number"
                min="10"
                max="180"
                value={form.estimatedTimeMax}
                onChange={(e) =>
                  setForm({ ...form, estimatedTimeMax: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-500 shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Min Order Value (₹)
              </label>
              <input
                type="number"
                min="0"
                value={form.minOrderValue}
                onChange={(e) =>
                  setForm({ ...form, minOrderValue: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-500 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Free Delivery Above (₹)
              </label>
              <input
                type="number"
                min="0"
                value={form.freeDeliveryThreshold}
                onChange={(e) =>
                  setForm({ ...form, freeDeliveryThreshold: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-500 shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Max Delivery Radius (km)
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={form.maxDeliveryRadiusKm}
              onChange={(e) =>
                setForm({ ...form, maxDeliveryRadiusKm: Number(e.target.value) })
              }
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors shadow-2xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

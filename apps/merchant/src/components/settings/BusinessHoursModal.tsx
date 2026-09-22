import React, { useState } from 'react';
import { X, Clock, Check } from 'lucide-react';
import { useSettingsStore, BusinessHours } from '../../stores/settingsStore.js';

interface BusinessHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BusinessHoursModal: React.FC<BusinessHoursModalProps> = ({ isOpen, onClose }) => {
  const { businessHours, updateBusinessHours } = useSettingsStore();
  const [localHours, setLocalHours] = useState<BusinessHours[]>(businessHours);

  if (!isOpen) return null;

  const handleToggleDay = (day: string) => {
    setLocalHours((prev) =>
      prev.map((h) => (h.day === day ? { ...h, isOpen: !h.isOpen } : h))
    );
  };

  const handleTimeChange = (day: string, field: 'openTime' | 'closeTime', val: string) => {
    setLocalHours((prev) =>
      prev.map((h) => (h.day === day ? { ...h, [field]: val } : h))
    );
  };

  const handleSave = () => {
    updateBusinessHours(localHours);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Business Hours</h3>
              <p className="text-xs text-slate-500">
                Set your store working days and operating hours.
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

        {/* Schedule List */}
        <div className="p-6 space-y-3 max-h-[420px] overflow-y-auto">
          {localHours.map((item) => (
            <div
              key={item.day}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                item.isOpen ? 'bg-white border-slate-200' : 'bg-slate-50/70 border-slate-100 opacity-70'
              }`}
            >
              <div className="flex items-center gap-3 w-36">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.isOpen}
                    onChange={() => handleToggleDay(item.day)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
                <span className={`text-xs font-bold ${item.isOpen ? 'text-slate-900' : 'text-slate-400'}`}>
                  {item.day}
                </span>
              </div>

              {item.isOpen ? (
                <div className="flex items-center gap-2 text-xs">
                  <input
                    type="text"
                    value={item.openTime}
                    onChange={(e) => handleTimeChange(item.day, 'openTime', e.target.value)}
                    className="w-24 px-2 py-1 bg-white border border-slate-300 rounded-lg font-mono text-center text-slate-800 focus:outline-none focus:border-purple-600"
                  />
                  <span className="text-slate-400 font-semibold">to</span>
                  <input
                    type="text"
                    value={item.closeTime}
                    onChange={(e) => handleTimeChange(item.day, 'closeTime', e.target.value)}
                    className="w-24 px-2 py-1 bg-white border border-slate-300 rounded-lg font-mono text-center text-slate-800 focus:outline-none focus:border-purple-600"
                  />
                </div>
              ) : (
                <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-3 py-1 rounded-lg">
                  Closed
                </span>
              )}
            </div>
          ))}
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
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { AlertCircle, CheckCircle2, RotateCcw, Save } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore.js';

interface SettingsStickyFooterProps {
  show?: boolean;
  onSave?: () => void;
  onDiscard?: () => void;
  isSaving?: boolean;
  saveSuccess?: boolean;
  message?: string;
}

export const SettingsStickyFooter: React.FC<SettingsStickyFooterProps> = ({
  show,
  onSave,
  onDiscard,
  isSaving = false,
  saveSuccess = false,
  message = 'You have unsaved changes to your store settings.',
}) => {
  const {
    isDirty,
    saveAllChanges,
    discardAllChanges,
    isSaving: storeSaving,
    saveSuccess: storeSuccess,
    saveError,
  } = useSettingsStore();

  const activeSaving = isSaving || storeSaving;
  const activeSuccess = saveSuccess || storeSuccess;
  const isVisible = show ?? isDirty;

  if (!isVisible && !activeSuccess) {
    return null;
  }

  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      saveAllChanges();
    }
  };

  const handleDiscard = () => {
    if (onDiscard) {
      onDiscard();
    } else {
      discardAllChanges();
    }
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl animate-in slide-in-from-bottom-4 duration-200">
      <div className="bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {activeSuccess ? (
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          ) : saveError ? (
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
          <div>
            <p className="text-xs font-bold text-white">
              {activeSuccess
                ? 'Changes saved and synced to database!'
                : saveError
                ? 'Error saving settings'
                : 'Careful — you have unsaved changes!'}
            </p>
            <p className="text-[11px] text-slate-400">
              {activeSuccess
                ? 'Your store settings and live policies are persisted in MongoDB.'
                : saveError
                ? saveError
                : message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 shrink-0">
          {!activeSuccess && (
            <button
              type="button"
              onClick={handleDiscard}
              disabled={activeSaving}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={activeSaving || activeSuccess}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-75 active:scale-98"
          >
            {activeSaving ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : activeSuccess ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{activeSaving ? 'Saving...' : activeSuccess ? 'Saved' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

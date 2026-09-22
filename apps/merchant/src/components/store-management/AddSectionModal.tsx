import React, { useState } from 'react';
import { X, ShoppingBag, FolderTree, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useStoreManagementStore } from '../../stores/storeManagementStore.js';

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'product' | 'category' | 'banner' | 'brand';
}

export const AddSectionModal: React.FC<AddSectionModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'product',
}) => {
  const { addSection } = useStoreManagementStore();

  const [sectionType, setSectionType] = useState<'product' | 'category' | 'banner' | 'brand'>(defaultType);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addSection({
      name,
      sectionType,
      description,
      isActive,
    });

    setName('');
    setDescription('');
    setIsActive(true);
    onClose();
  };

  const sectionTypeOptions = [
    {
      id: 'product' as const,
      label: 'Product Section',
      desc: 'Display specific products',
      icon: ShoppingBag,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: 'category' as const,
      label: 'Category Section',
      desc: 'Display categories',
      icon: FolderTree,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 'banner' as const,
      label: 'Banner / Image Section',
      desc: 'Promote offers or announcements',
      icon: ImageIcon,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      id: 'brand' as const,
      label: 'Brand Section',
      desc: 'Showcase brands',
      icon: Sparkles,
      color: 'text-rose-600 bg-rose-50',
    },
  ];

  const defaultOption = sectionTypeOptions[0]!;
  const selectedOption = sectionTypeOptions.find((o) => o.id === sectionType) || defaultOption;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Add New Section</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose a section type and configure its details.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Section Type Selector */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Section Type
              </label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 flex items-center justify-between hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-left transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${selectedOption.color}`}>
                    <selectedOption.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block">{selectedOption.label}</span>
                    <span className="text-[10px] text-slate-400">{selectedOption.desc}</span>
                  </div>
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 z-40 animate-in fade-in duration-100">
                  {sectionTypeOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSectionType(opt.id);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-left transition-colors"
                    >
                      <div className={`p-1.5 rounded-lg ${opt.color}`}>
                        <opt.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-800 block">
                          {opt.label}
                        </span>
                        <span className="text-[10px] text-slate-400">{opt.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Section Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Section Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                maxLength={40}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter section name"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-2xs"
              />
              <div className="flex justify-end mt-1">
                <span className="text-[10px] text-slate-400">{name.length}/40</span>
              </div>
            </div>
          </div>

          {/* Description & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Description (Optional)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter short description"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-2xs resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Status
              </label>
              <div className="flex items-center gap-2.5 pt-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
                <span className="text-xs font-semibold text-slate-700">
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors"
            >
              Add Section
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Plus, X } from 'lucide-react';

export interface CreatableComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  leftIcon?: React.ReactNode;
  label?: string;
  required?: boolean;
  itemTypeLabel?: string; // e.g. "Category", "Sub-category", "Product Type", "Brand"
  allowCreate?: boolean;
  className?: string;
  disabled?: boolean;
}

export const CreatableCombobox: React.FC<CreatableComboboxProps> = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select or type...',
  leftIcon,
  label,
  required = false,
  itemTypeLabel = 'item',
  allowCreate = true,
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [customOptions, setCustomOptions] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal query with value when value changes externally
  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        // Reset query back to selected value if user typed but didn't select
        setQuery(value || '');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value]);

  // Combined options: custom options + props options (deduplicated)
  const allOptions = Array.from(new Set([...customOptions, ...options]));

  // Filter options based on query
  const filteredOptions = query.trim()
    ? allOptions.filter((opt) =>
        opt.toLowerCase().includes(query.trim().toLowerCase())
      )
    : allOptions;

  const isExactMatch = allOptions.some(
    (opt) => opt.toLowerCase() === query.trim().toLowerCase()
  );

  const canCreate =
    allowCreate && query.trim().length > 0 && !isExactMatch;

  const handleSelect = (selectedVal: string) => {
    onChange(selectedVal);
    setQuery(selectedVal);
    setIsOpen(false);
  };

  const handleCreate = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    if (!customOptions.includes(trimmed)) {
      setCustomOptions((prev) => [trimmed, ...prev]);
    }
    onChange(trimmed);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions.length > 0 && !canCreate) {
        handleSelect(filteredOptions[0]!);
      } else if (canCreate) {
        handleCreate();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery(value || '');
    }
  };

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {leftIcon}
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          disabled={disabled}
          value={query}
          placeholder={placeholder}
          onFocus={() => {
            if (!disabled) setIsOpen(true);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className={`w-full ${
            leftIcon ? 'pl-9' : 'pl-3'
          } pr-14 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors disabled:bg-slate-50 disabled:text-slate-400`}
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && !disabled && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                setIsOpen((prev) => !prev);
                inputRef.current?.focus();
              }
            }}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-blue-600' : ''
              }`}
            />
          </button>
        </div>

        {/* Dropdown Menu */}
        {isOpen && !disabled && (
          <div className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl py-1 text-xs divide-y divide-slate-100 animate-in fade-in-50 zoom-in-95 duration-100">
            {/* Create Custom Action (if query doesn't match an existing option) */}
            {canCreate && (
              <div className="p-1">
                <button
                  type="button"
                  onClick={handleCreate}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-blue-600 bg-blue-50/70 hover:bg-blue-100/70 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">
                    Create &quot;<strong className="text-blue-700">{query.trim()}</strong>&quot; as custom {itemTypeLabel}
                  </span>
                </button>
              </div>
            )}

            {/* Existing Options List */}
            <div className="py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const isSelected =
                    opt.toLowerCase() === (value || '').toLowerCase();
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelect(opt)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{opt}</span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })
              ) : (
                !canCreate && (
                  <div className="px-3 py-3 text-center text-slate-400">
                    No matching {itemTypeLabel.toLowerCase()}s found.
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatableCombobox;

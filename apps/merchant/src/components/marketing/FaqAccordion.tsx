import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export interface FaqItem {
  id?: string | number;
  question: string;
  answer: string | React.ReactNode;
  category?: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  showNumbers?: boolean;
  defaultOpenIndex?: number;
  allowMultiple?: boolean;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({
  items,
  showNumbers = true,
  defaultOpenIndex,
  allowMultiple = false,
}) => {
  const [openIndices, setOpenIndices] = useState<number[]>(
    defaultOpenIndex !== undefined ? [defaultOpenIndex] : []
  );

  const toggleIndex = (idx: number) => {
    if (allowMultiple) {
      if (openIndices.includes(idx)) {
        setOpenIndices(openIndices.filter((i) => i !== idx));
      } else {
        setOpenIndices([...openIndices, idx]);
      }
    } else {
      if (openIndices.includes(idx)) {
        setOpenIndices([]);
      } else {
        setOpenIndices([idx]);
      }
    }
  };

  return (
    <div className="space-y-3.5 w-full">
      {items.map((item, idx) => {
        const isOpen = openIndices.includes(idx);
        return (
          <div
            key={idx}
            className={`border rounded-2xl transition-all duration-200 overflow-hidden bg-white ${
              isOpen
                ? 'border-[#0038ed]/40 shadow-xs ring-1 ring-[#0038ed]/10'
                : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <button
              type="button"
              onClick={() => toggleIndex(idx)}
              className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer group gap-4"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3.5 sm:gap-4 flex-1">
                {showNumbers && (
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-[13px] shrink-0 transition-colors ${
                      isOpen
                        ? 'bg-[#0038ed] text-white shadow-2xs'
                        : 'bg-blue-50 text-[#0038ed] group-hover:bg-blue-100'
                    }`}
                  >
                    {idx + 1}
                  </div>
                )}
                <span
                  className={`text-sm sm:text-base font-semibold transition-colors ${
                    isOpen ? 'text-[#0038ed]' : 'text-slate-900 group-hover:text-[#0038ed]'
                  }`}
                >
                  {item.question}
                </span>
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  isOpen
                    ? 'bg-blue-50 text-[#0038ed]'
                    : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-[#0038ed]'
                }`}
              >
                {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </div>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

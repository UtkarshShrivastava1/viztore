import React, { useState } from 'react';
import {
  Shirt,
  Footprints,
  Gem,
  Cpu,
  Armchair,
  Sparkles,
  Gift,
  Dumbbell,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import { useOnboardingStore } from '../../stores/onboardingStore.js';
import { StoreCategory } from '@repo/shared-types';

interface Step3BusinessInfoProps {
  onContinue: () => void;
  onBack: () => void;
}

export const Step3BusinessInfo: React.FC<Step3BusinessInfoProps> = ({
  onContinue,
  onBack,
}) => {
  const { draft, updateStep } = useOnboardingStore();

  const categories = [
    { id: 'fashion', label: 'Fashion', icon: Shirt },
    { id: 'footwear', label: 'Footwear', icon: Footprints },
    { id: 'jewellery', label: 'Jewellery', icon: Gem },
    { id: 'electronics', label: 'Electronics', icon: Cpu },
    { id: 'home_living', label: 'Home & Living', icon: Armchair },
    { id: 'beauty', label: 'Beauty & Personal Care', icon: Sparkles },
    { id: 'gifts', label: 'Gifts & Lifestyle', icon: Gift },
    { id: 'sports', label: 'Sports & Fitness', icon: Dumbbell },
  ];

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    draft.step5?.primaryCategory ? [draft.step5.primaryCategory] : ['fashion'],
  );
  const [openTime, setOpenTime] = useState(draft.step5?.operatingHours?.monday?.open || '09:00');
  const [closeTime, setCloseTime] = useState(draft.step5?.operatingHours?.monday?.close || '21:00');
  const [openDays, setOpenDays] = useState<string[]>([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]);
  const [error, setError] = useState<string | null>(null);

  const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((c) => c !== id) : prev) : [...prev, id],
    );
  };

  const toggleDay = (day: string) => {
    setOpenDays((prev) =>
      prev.includes(day) ? (prev.length > 1 ? prev.filter((d) => d !== day) : prev) : [...prev, day],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategories.length === 0) {
      setError('Please select at least one primary category');
      return;
    }

    const daySchedule = (dayName: string) => ({
      open: openTime,
      close: closeTime,
      isOpen: openDays.includes(dayName),
    });

    updateStep(5, {
      primaryCategory: (selectedCategories[0] || StoreCategory.FASHION) as any,
      operatingHours: {
        monday: daySchedule('Monday'),
        tuesday: daySchedule('Tuesday'),
        wednesday: daySchedule('Wednesday'),
        thursday: daySchedule('Thursday'),
        friday: daySchedule('Friday'),
        saturday: daySchedule('Saturday'),
        sunday: daySchedule('Sunday'),
      },
      hasTrialRoom: true,
      hasExchangePolicy: true,
      returnWindowDays: 7,
    });

    onContinue();
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 lg:p-9 shadow-xs">
      {/* Header with Step 3 Badge */}
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-7 h-7 rounded-full bg-[#0038ed] text-white font-bold text-xs flex items-center justify-center shadow-2xs shrink-0">
          3
        </div>
        <h2 className="text-xs sm:text-[13px] font-bold tracking-wider text-[#0038ed] uppercase">
          BUSINESS INFORMATION
        </h2>
      </div>

      <p className="text-xs text-slate-500 mb-5">
        Add your business details to help customers know more about your store.
      </p>

      {error && (
        <div className="mb-5 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Category Cards Grid (Screen 8.png) */}
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-1">
            Add Category *
          </label>
          <span className="text-[11px] text-slate-500 block mb-3">
            Select all categories that best describe your business.
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategories.includes(cat.id);

              return (
                <div
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#0038ed] bg-blue-50/50 ring-1 ring-[#0038ed]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#0038ed] text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      {cat.label}
                    </span>
                  </div>

                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-3.5 h-3.5 rounded text-[#0038ed] focus:ring-[#0038ed] border-slate-300 pointer-events-none ml-1.5"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Timings Section */}
        <div className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-900">
              Delivery Timings
            </label>
            <span className="text-[11px] text-slate-500">
              Set your delivery time slots and open days.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Open Time *
              </label>
              <div className="relative">
                <select
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg px-3.5 py-2.5 bg-white text-slate-900 appearance-none focus:outline-none focus:border-[#0038ed] pr-9 cursor-pointer"
                >
                  {['07:00', '08:00', '09:00', '10:00', '11:00'].map((t) => (
                    <option key={t} value={t}>
                      {t} AM
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Close Time *
              </label>
              <div className="relative">
                <select
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg px-3.5 py-2.5 bg-white text-slate-900 appearance-none focus:outline-none focus:border-[#0038ed] pr-9 cursor-pointer"
                >
                  {['19:00', '20:00', '21:00', '22:00', '23:00'].map((t) => (
                    <option key={t} value={t}>
                      {t === '19:00'
                        ? '07:00 PM'
                        : t === '20:00'
                        ? '08:00 PM'
                        : t === '21:00'
                        ? '09:00 PM'
                        : t === '22:00'
                        ? '10:00 PM'
                        : '11:00 PM'}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Mark Open Days */}
          <div className="pt-1">
            <label className="block text-xs font-bold text-slate-900">
              Mark Open Days *
            </label>
            <span className="text-[11px] text-slate-500 block mb-2">
              Don't forget to uncheck your off-day
            </span>

            <div className="flex flex-wrap gap-2">
              {daysList.map((day) => {
                const isOpen = openDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
                      isOpen
                        ? 'bg-blue-50/70 border-[#0038ed] text-[#0038ed] ring-1 ring-[#0038ed]/20'
                        : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isOpen}
                      onChange={() => {}}
                      className="w-3.5 h-3.5 rounded text-[#0038ed] border-slate-300 pointer-events-none"
                    />
                    <span>{day}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <span className="text-[11px] text-slate-500">
                Have separate day wise timings?{' '}
                <button
                  type="button"
                  onClick={() => alert('Day-wise custom time slots enabled.')}
                  className="text-[#0038ed] font-semibold hover:underline cursor-pointer"
                >
                  Add day wise slots
                </button>
              </span>
            </div>
          </div>
        </div>

        {/* Back and Continue Actions */}
        <div className="flex items-center gap-3 pt-3">
          <button
            type="button"
            onClick={onBack}
            className="w-32 py-3 px-4 rounded-lg border border-[#0038ed] text-[#0038ed] font-semibold text-sm hover:bg-blue-50/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="submit"
            className="flex-1 py-3 px-6 rounded-lg bg-[#0038ed] hover:bg-[#002fcf] text-white font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

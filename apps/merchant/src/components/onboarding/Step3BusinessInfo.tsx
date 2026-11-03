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
  ShoppingBasket,
  Baby,
  BookOpen,
  Check,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Clock,
  Calendar,
  Copy,
  Layers,
} from 'lucide-react';
import { useOnboardingStore } from '../../stores/onboardingStore.js';
import { StoreCategory } from '@repo/shared-types';

interface Step3BusinessInfoProps {
  onContinue: () => void;
  onBack: () => void;
}

type DayName =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

interface DaySchedule {
  isOpen: boolean;
  open: string;
  close: string;
}

const DAYS_LIST: DayName[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const DAY_KEY_MAP: Record<
  DayName,
  'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
> = {
  Monday: 'monday',
  Tuesday: 'tuesday',
  Wednesday: 'wednesday',
  Thursday: 'thursday',
  Friday: 'friday',
  Saturday: 'saturday',
  Sunday: 'sunday',
};

export const Step3BusinessInfo: React.FC<Step3BusinessInfoProps> = ({
  onContinue,
  onBack,
}) => {
  const { draft, updateStep } = useOnboardingStore();

  // Sub-tab Navigation: 'categories' vs 'schedule'
  const [activeSubTab, setActiveSubTab] = useState<'categories' | 'schedule'>('categories');

  const categories = [
    { id: 'fashion', label: 'Fashion', icon: Shirt },
    { id: 'footwear', label: 'Footwear', icon: Footprints },
    { id: 'jewellery', label: 'Jewellery', icon: Gem },
    { id: 'electronics', label: 'Electronics', icon: Cpu },
    { id: 'home_living', label: 'Home & Living', icon: Armchair },
    { id: 'beauty_care', label: 'Beauty & Personal Care', icon: Sparkles },
    { id: 'grocery_staples', label: 'Grocery & Staples', icon: ShoppingBasket },
    { id: 'gifts', label: 'Gifts & Lifestyle', icon: Gift },
    { id: 'sports_fitness', label: 'Sports & Fitness', icon: Dumbbell },
    { id: 'toys_baby', label: 'Toys & Baby Care', icon: Baby },
    { id: 'books_stationery', label: 'Books & Stationery', icon: BookOpen },
  ];

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    draft.step5?.primaryCategory ? [draft.step5.primaryCategory] : ['fashion'],
  );
  const [openTime, setOpenTime] = useState(
    draft.step5?.operatingHours?.monday?.open || '09:00',
  );
  const [closeTime, setCloseTime] = useState(
    draft.step5?.operatingHours?.monday?.close || '21:00',
  );
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

  const toggleCategory = (id: string) => {
    setError(null);
    setSelectedCategories((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((c) => c !== id)
          : prev
        : [...prev, id],
    );
  };

  const [showDayWiseSlots, setShowDayWiseSlots] = useState(false);
  const [daySchedules, setDaySchedules] = useState<Record<DayName, DaySchedule>>(() => {
    const existing = draft.step5?.operatingHours;
    const initialMap: Record<DayName, DaySchedule> = {
      Monday: { isOpen: true, open: openTime, close: closeTime },
      Tuesday: { isOpen: true, open: openTime, close: closeTime },
      Wednesday: { isOpen: true, open: openTime, close: closeTime },
      Thursday: { isOpen: true, open: openTime, close: closeTime },
      Friday: { isOpen: true, open: openTime, close: closeTime },
      Saturday: { isOpen: true, open: openTime, close: closeTime },
      Sunday: { isOpen: true, open: openTime, close: closeTime },
    };

    DAYS_LIST.forEach((day) => {
      const dayKey = DAY_KEY_MAP[day];
      const saved = existing ? existing[dayKey] : null;
      if (saved) {
        initialMap[day] = {
          isOpen: saved.isOpen,
          open: saved.open || openTime,
          close: saved.close || closeTime,
        };
      }
    });
    return initialMap;
  });

  const timeOptionsOpen = [
    '06:00',
    '06:30',
    '07:00',
    '07:30',
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
  ];

  const timeOptionsClose = [
    '16:00',
    '17:00',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
    '22:30',
    '23:00',
    '23:30',
    '00:00',
  ];

  const formatTime12h = (timeStr: string): string => {
    const [hStr, mStr] = timeStr.split(':');
    const h = parseInt(hStr || '0', 10);
    const m = mStr || '00';
    if (h === 0) return `12:${m} AM`;
    if (h < 12) return `${h.toString().padStart(2, '0')}:${m} AM`;
    if (h === 12) return `12:${m} PM`;
    return `${(h - 12).toString().padStart(2, '0')}:${m} PM`;
  };

  const handleDayScheduleChange = (
    day: DayName,
    field: keyof DaySchedule,
    value: boolean | string,
  ) => {
    setDaySchedules((prev) => {
      const current = prev[day] || { isOpen: true, open: openTime, close: closeTime };
      return {
        ...prev,
        [day]: {
          ...current,
          [field]: value,
        },
      };
    });
  };

  const copyMondayToAllActiveDays = () => {
    const mon = daySchedules['Monday'];
    if (!mon) return;
    setDaySchedules((prev) => {
      const next: Record<DayName, DaySchedule> = { ...prev };
      DAYS_LIST.forEach((d) => {
        const item = next[d];
        if (item?.isOpen) {
          next[d] = {
            ...item,
            open: mon.open,
            close: mon.close,
          };
        }
      });
      return next;
    });
  };

  const toggleDay = (day: DayName) => {
    setOpenDays((prev) => {
      const nextDays = prev.includes(day)
        ? prev.length > 1
          ? prev.filter((d) => d !== day)
          : prev
        : [...prev, day];

      // Keep daySchedules in sync
      setDaySchedules((schedPrev) => {
        const current = schedPrev[day] || { isOpen: true, open: openTime, close: closeTime };
        return {
          ...schedPrev,
          [day]: {
            ...current,
            isOpen: nextDays.includes(day),
          },
        };
      });

      return nextDays;
    });
  };

  const validateCategoriesTab = (): boolean => {
    if (selectedCategories.length === 0) {
      setError('Please select at least one retail category for your store.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleProceedToScheduleTab = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (validateCategoriesTab()) {
      setActiveSubTab('schedule');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCategoriesTab()) {
      setActiveSubTab('categories');
      return;
    }

    const daySchedule = (dayName: DayName) => {
      if (showDayWiseSlots) {
        const sched = daySchedules[dayName];
        return {
          open: sched?.open || openTime,
          close: sched?.close || closeTime,
          isOpen: Boolean(sched?.isOpen),
        };
      }
      return {
        open: openTime,
        close: closeTime,
        isOpen: openDays.includes(dayName),
      };
    };

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

  const isCategoryComplete = selectedCategories.length > 0;

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 lg:p-7 shadow-xl shadow-slate-200/40 relative lg:h-full flex flex-col justify-between overflow-hidden">
      {/* Header with Step 3 Badge & Sub-Tab Switcher */}
      <div className="pb-3 mb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0038ed] to-blue-500 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-blue-600/25 shrink-0">
              3
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black tracking-wider text-[#0038ed] uppercase">
                Business Category &amp; Operating Hours
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Catalog taxonomy &amp; retail operating schedule
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200/60 font-medium">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Hyperlocal Availability</span>
          </div>
        </div>

        {/* 2 Clean Sub-Tabs */}
        <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-xl max-w-md">
          <button
            type="button"
            onClick={() => setActiveSubTab('categories')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeSubTab === 'categories'
                ? 'bg-white text-[#0038ed] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                isCategoryComplete
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-blue-100 text-[#0038ed]'
              }`}
            >
              {isCategoryComplete ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '1'}
            </span>
            <span>Business Category</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (validateCategoriesTab()) {
                setActiveSubTab('schedule');
              }
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeSubTab === 'schedule'
                ? 'bg-white text-[#0038ed] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">
              2
            </span>
            <span>Operating Schedule</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200/80 rounded-xl text-rose-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* SUB-TAB 1: BUSINESS CATEGORIES */}
      {activeSubTab === 'categories' && (
        <form
          onSubmit={handleProceedToScheduleTab}
          className="flex-1 flex flex-col justify-between overflow-hidden min-h-0"
        >
          <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 min-h-0 space-y-3.5 scrollbar-thin">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-900">
                  Select Product Categories <span className="text-rose-500">*</span>
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Select all categories that best describe your store inventory.
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-[#0038ed] text-xs font-bold border border-blue-100">
                <Layers className="w-3.5 h-3.5" />
                <span>
                  {selectedCategories.length}{' '}
                  {selectedCategories.length === 1 ? 'Selected' : 'Selected'}
                </span>
              </div>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategories.includes(cat.id);

                return (
                  <div
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        toggleCategory(cat.id);
                      }
                    }}
                    className={`group relative p-2.5 sm:p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all duration-150 min-h-[58px] select-none ${
                      isSelected
                        ? 'border-[#0038ed] bg-blue-50/70 shadow-xs ring-1.5 ring-[#0038ed]'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-1.5 flex-1">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#0038ed] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200/80 group-hover:text-slate-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span
                        className={`text-xs font-bold leading-snug break-words transition-colors ${
                          isSelected ? 'text-[#002bb5]' : 'text-slate-800 group-hover:text-slate-900'
                        }`}
                      >
                        {cat.label}
                      </span>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? 'bg-[#0038ed] text-white shadow-xs'
                          : 'border border-slate-300 bg-white group-hover:border-slate-400'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-2xl flex items-center gap-2.5 text-xs text-slate-600">
              <Layers className="w-4 h-4 text-[#0038ed] shrink-0" />
              <span>
                You can manage specialized subcategories and brand catalog collections in your Merchant Dashboard later.
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="shrink-0 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 bg-white">
            <button
              type="button"
              onClick={onBack}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store Details</span>
            </button>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#0038ed] to-blue-600 hover:from-[#002fcf] hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <span>Next: Operating Schedule</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 2: OPERATING SCHEDULE & TIMINGS */}
      {activeSubTab === 'schedule' && (
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col justify-between overflow-hidden min-h-0"
        >
          <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 min-h-0 space-y-3.5 scrollbar-thin">
            <div>
              <label className="block text-xs font-bold text-slate-900">
                Daily Operating Timings
              </label>
              <span className="text-[11px] text-slate-500">
                Set standard delivery &amp; store opening hours for your customers.
              </span>
            </div>

            {/* Standard Open & Close Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Default Open Time <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                    className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-900 appearance-none focus:outline-none focus:border-[#0038ed] pr-9 cursor-pointer font-medium"
                  >
                    {timeOptionsOpen.map((t) => (
                      <option key={t} value={t}>
                        {formatTime12h(t)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Default Close Time <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                    className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-900 appearance-none focus:outline-none focus:border-[#0038ed] pr-9 cursor-pointer font-medium"
                  >
                    {timeOptionsClose.map((t) => (
                      <option key={t} value={t}>
                        {formatTime12h(t)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Mark Open Days */}
            <div className="pt-1">
              <label className="block text-xs font-bold text-slate-900 mb-0.5">
                Mark Open Days <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500 block mb-2">
                Uncheck any day on which your store remains closed.
              </span>

              <div className="flex flex-wrap gap-2">
                {DAYS_LIST.map((day) => {
                  const isOpen = openDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
                        isOpen
                          ? 'bg-blue-50/70 border-[#0038ed] text-[#0038ed] ring-1 ring-[#0038ed]/20 shadow-2xs'
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
            </div>

            {/* Day Wise Slots Accordion */}
            <div className="pt-1">
              {!showDayWiseSlots ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#0038ed]" />
                    <span className="text-xs text-slate-700">
                      Need custom open/close timings for specific days?
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDayWiseSlots(true)}
                    className="text-xs text-[#0038ed] font-bold hover:underline cursor-pointer px-3 py-1.5 rounded-lg bg-white border border-blue-200 shadow-2xs hover:bg-blue-50 transition-colors"
                  >
                    + Add day wise slots
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-blue-200/90 bg-blue-50/30 p-3.5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-blue-100/80">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#0038ed]" />
                      <span className="text-xs font-bold text-slate-900">
                        Individual Day-wise Timings
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={copyMondayToAllActiveDays}
                        className="text-[11px] font-semibold text-[#0038ed] hover:text-[#002fcf] bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
                        title="Copy Monday's open & close hours to all active open days"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy Monday timings</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDayWiseSlots(false)}
                        className="text-[11px] text-slate-500 hover:text-slate-700 underline cursor-pointer"
                      >
                        Reset to uniform
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {DAYS_LIST.map((day) => {
                      const sched =
                        daySchedules[day] || { isOpen: true, open: openTime, close: closeTime };
                      return (
                        <div
                          key={day}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-xl border transition-all ${
                            sched.isOpen
                              ? 'bg-white border-slate-200 shadow-2xs'
                              : 'bg-slate-50 border-slate-200/60 opacity-70'
                          }`}
                        >
                          <label className="flex items-center gap-2.5 cursor-pointer select-none sm:w-32">
                            <input
                              type="checkbox"
                              checked={sched.isOpen}
                              onChange={(e) =>
                                handleDayScheduleChange(day, 'isOpen', e.target.checked)
                              }
                              className="w-3.5 h-3.5 rounded text-[#0038ed] focus:ring-[#0038ed] border-slate-300 cursor-pointer"
                            />
                            <span
                              className={`text-xs font-semibold ${
                                sched.isOpen ? 'text-slate-800' : 'text-slate-400 line-through'
                              }`}
                            >
                              {day}
                            </span>
                            {!sched.isOpen && (
                              <span className="text-[9px] uppercase font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">
                                Off-day
                              </span>
                            )}
                          </label>

                          {sched.isOpen ? (
                            <div className="flex items-center gap-2 flex-1 sm:justify-end">
                              <div className="relative">
                                <select
                                  value={sched.open}
                                  onChange={(e) =>
                                    handleDayScheduleChange(day, 'open', e.target.value)
                                  }
                                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 pr-7 appearance-none focus:outline-none focus:border-[#0038ed] cursor-pointer"
                                >
                                  {timeOptionsOpen.map((t) => (
                                    <option key={t} value={t}>
                                      {formatTime12h(t)}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
                              </div>

                              <span className="text-xs text-slate-400 font-medium">to</span>

                              <div className="relative">
                                <select
                                  value={sched.close}
                                  onChange={(e) =>
                                    handleDayScheduleChange(day, 'close', e.target.value)
                                  }
                                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 pr-7 appearance-none focus:outline-none focus:border-[#0038ed] cursor-pointer"
                                >
                                  {timeOptionsClose.map((t) => (
                                    <option key={t} value={t}>
                                      {formatTime12h(t)}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic sm:text-right">
                              Store closed on this day
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="shrink-0 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 bg-white">
            <button
              type="button"
              onClick={() => setActiveSubTab('categories')}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Categories</span>
            </button>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#0038ed] to-blue-600 hover:from-[#002fcf] hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <span>Proceed to Bank Account &amp; Payouts</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

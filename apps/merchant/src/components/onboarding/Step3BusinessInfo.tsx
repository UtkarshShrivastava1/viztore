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
  Clock,
  Calendar,
  Copy,
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
    { id: 'beauty_care', label: 'Beauty & Personal Care', icon: Sparkles },
    { id: 'gifts', label: 'Gifts & Lifestyle', icon: Gift },
    { id: 'sports_fitness', label: 'Sports & Fitness', icon: Dumbbell },
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

type DayName = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
interface DaySchedule {
  isOpen: boolean;
  open: string;
  close: string;
}

const DAYS_LIST: DayName[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DAY_KEY_MAP: Record<DayName, 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'> = {
  Monday: 'monday',
  Tuesday: 'tuesday',
  Wednesday: 'wednesday',
  Thursday: 'thursday',
  Friday: 'friday',
  Saturday: 'saturday',
  Sunday: 'sunday',
};

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((c) => c !== id) : prev) : [...prev, id],
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
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00'
  ];

  const timeOptionsClose = [
    '16:00', '17:00', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00'
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
        ? (prev.length > 1 ? prev.filter((d) => d !== day) : prev)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategories.length === 0) {
      setError('Please select at least one primary category');
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
              {DAYS_LIST.map((day) => {
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
              {!showDayWiseSlots ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#0038ed]" />
                    <span className="text-[12px] text-slate-700">
                      Have separate day wise timings?
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDayWiseSlots(true)}
                    className="text-xs text-[#0038ed] font-bold hover:underline cursor-pointer px-2.5 py-1 rounded-md bg-white border border-blue-200 shadow-2xs hover:bg-blue-50 transition-colors"
                  >
                    + Add day wise slots
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border border-blue-200/90 bg-blue-50/30 p-4 space-y-3.5">
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
                        className="text-[11px] font-semibold text-[#0038ed] hover:text-[#002fcf] bg-white px-2.5 py-1 rounded-md border border-blue-200 shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
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
                        Reset to uniform hours
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {DAYS_LIST.map((day) => {
                      const sched = daySchedules[day] || { isOpen: true, open: openTime, close: closeTime };
                      return (
                        <div
                          key={day}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg border transition-all ${
                            sched.isOpen
                              ? 'bg-white border-slate-200 shadow-2xs'
                              : 'bg-slate-50 border-slate-200/60 opacity-70'
                          }`}
                        >
                          <label className="flex items-center gap-2.5 cursor-pointer select-none sm:w-36">
                            <input
                              type="checkbox"
                              checked={sched.isOpen}
                              onChange={(e) => handleDayScheduleChange(day, 'isOpen', e.target.checked)}
                              className="w-4 h-4 rounded text-[#0038ed] focus:ring-[#0038ed] border-slate-300 cursor-pointer"
                            />
                            <span
                              className={`text-xs font-semibold ${
                                sched.isOpen ? 'text-slate-800' : 'text-slate-400 line-through'
                              }`}
                            >
                              {day}
                            </span>
                            {!sched.isOpen && (
                              <span className="text-[10px] uppercase font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">
                                Off-day
                              </span>
                            )}
                          </label>

                          {sched.isOpen ? (
                            <div className="flex items-center gap-2 flex-1 sm:justify-end">
                              <div className="relative">
                                <select
                                  value={sched.open}
                                  onChange={(e) => handleDayScheduleChange(day, 'open', e.target.value)}
                                  className="text-xs border border-slate-200 rounded-md px-2.5 py-1.5 bg-white text-slate-800 pr-7 appearance-none focus:outline-none focus:border-[#0038ed] cursor-pointer"
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
                                  onChange={(e) => handleDayScheduleChange(day, 'close', e.target.value)}
                                  className="text-xs border border-slate-200 rounded-md px-2.5 py-1.5 bg-white text-slate-800 pr-7 appearance-none focus:outline-none focus:border-[#0038ed] cursor-pointer"
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

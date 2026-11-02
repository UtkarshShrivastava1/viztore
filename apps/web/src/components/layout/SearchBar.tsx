import { Search, Mic, Bell, CircleUserRound } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  notificationCount?: number;
}

export default function SearchBar({
  placeholder = "Search for products, stores and more...",
  notificationCount = 1,
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-3.5 px-4 pb-3.5">
      {/* Search Input Pill */}
      <div className="flex flex-1 items-center gap-2.5 rounded-full bg-white px-4 py-2.5 shadow-sm">
        <Search className="h-5 w-5 shrink-0 text-[#1E293B]" strokeWidth={2} />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full truncate bg-transparent text-[13px] text-slate-900 placeholder:text-slate-500/90 font-normal focus:outline-none"
        />
        <button
          type="button"
          aria-label="Voice search"
          className="shrink-0 text-[#1E293B] hover:opacity-80"
        >
          <Mic className="h-5 w-5" strokeWidth={1.8} />
        </button>
      </div>

      {/* Notification Bell */}
      <button
        type="button"
        aria-label="Notifications"
        suppressHydrationWarning
        className="relative text-white hover:opacity-85 transition-opacity shrink-0"
      >
        <Bell className="h-[25px] w-[25px]" strokeWidth={1.75} />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] px-1 items-center justify-center rounded-full bg-[#FF3B30] text-[10px] font-bold text-white shadow-sm">
            {notificationCount}
          </span>
        )}
      </button>

      {/* Profile Icon */}
      <button
        type="button"
        aria-label="User profile"
        className="text-white hover:opacity-85 transition-opacity shrink-0"
      >
        <CircleUserRound className="h-[25px] w-[25px]" strokeWidth={1.6} />
      </button>
    </div>
  );
}

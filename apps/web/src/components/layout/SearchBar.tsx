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
    <div className="px-4 pb-3.5">
      {/* Search Input Pill */}
      <div className="flex w-full items-center gap-2.5 rounded-full bg-white px-4 py-2.5 shadow-sm">
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
    </div>
  );
}

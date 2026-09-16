"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DotGridIcon from "@/components/ui/DotGridIcon";

const TABS = ["ALL", "MEN", "WOMEN", "KIDS"] as const;
type Tab = (typeof TABS)[number];

export default function CategoryTabs() {
  const [active, setActive] = useState<Tab>("ALL");
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-4 pb-2.5 select-none">
      {/* Capsule Container for tabs */}
      <div className="flex items-center gap-1 rounded-2xl bg-[#021d5c]/60 backdrop-blur-md border border-white/10 px-2 py-1 shadow-inner">
        {TABS.map((tab) => {
          const isActive = active === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActive(tab)}
              className={`relative px-4 py-2 text-[12.5px] font-bold tracking-wider transition-all duration-200 ${
                isActive
                  ? "text-white"
                  : "text-white/85 hover:text-white"
              }`}
            >
              <span>{tab}</span>
              {isActive && (
                <span
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-7 h-[3px] rounded-full bg-[#1A68FA] shadow-[0_0_8px_rgba(26,104,250,0.8)]"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 4-Dots Grid Icon at the far right */}
      <button
        type="button"
        onClick={() => router.push('/category')}
        aria-label="All Categories"
        className="text-white hover:opacity-85 transition-opacity p-2 shrink-0 mr-1"
      >
        <DotGridIcon className="h-6 w-6 text-white" />
      </button>
    </div>
  );
}

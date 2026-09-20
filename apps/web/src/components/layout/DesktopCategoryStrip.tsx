"use client";

import { useState, useEffect } from "react";
import {
  Home,
  LayoutGrid,
  Shirt,
  Smartphone,
  Monitor,
  Sparkles,
  Sofa,
  Speaker,
  Baby,
  ShoppingBasket,
  Car,
  Trophy,
  Armchair,
  Book,
  Bike,
} from "lucide-react";
import { useRouter } from "next/navigation";

const DESKTOP_CATEGORIES = [
  { id: "home", label: "Home", icon: Home, color: "#1668F6", activeBg: "#E8F0FE" },
  { id: "all", label: "All Categories", icon: LayoutGrid, color: "#1668F6", activeBg: "#E8F0FE" },
  { id: "fashion", label: "Fashion", icon: Shirt, color: "#2563EB", activeBg: "#E8F0FE" },
  { id: "mobiles", label: "Mobiles", icon: Smartphone, color: "#EA4335", activeBg: "#FCE8E6" },
  { id: "electronics", label: "Electronics", icon: Monitor, color: "#34A853", activeBg: "#E6F4EA" },
  { id: "beauty", label: "Beauty", icon: Sparkles, color: "#E91E63", activeBg: "#FCE4EC" },
  { id: "home_living", label: "Home & Living", icon: Sofa, color: "#FBBC04", activeBg: "#FEF7E0" },
  { id: "appliances", label: "Appliances", icon: Speaker, color: "#673AB7", activeBg: "#EDE7F6" },
  { id: "toys_baby", label: "Toys & Baby", icon: Baby, color: "#E91E63", activeBg: "#FCE4EC" },
  { id: "food_health", label: "Food & Health", icon: ShoppingBasket, color: "#4CAF50", activeBg: "#E8F5E9" },
  { id: "auto", label: "Auto Accessories", icon: Car, color: "#00BCD4", activeBg: "#E0F7FA" },
  { id: "sports", label: "Sports", icon: Trophy, color: "#FF9800", activeBg: "#FFF3E0" },
  { id: "furniture", label: "Furniture", icon: Armchair, color: "#795548", activeBg: "#EFEBE9" },
  { id: "books", label: "Books", icon: Book, color: "#009688", activeBg: "#E0F2F1" },
  { id: "2wheelers", label: "2 Wheelers", icon: Bike, color: "#3F51B5", activeBg: "#E8EAF6" },
];

interface DesktopCategoryStripProps {
  activeId?: string;
  onSelect?: (id: string) => void;
}

export default function DesktopCategoryStrip({ activeId = "home", onSelect }: DesktopCategoryStripProps) {
  const [selected, setSelected] = useState(activeId);
  const router = useRouter();

  useEffect(() => {
    setSelected(activeId);
  }, [activeId]);

  const handleSelect = (id: string) => {
    setSelected(id);
    onSelect?.(id);
    if (id === "home") {
      router.push("/");
    } else if (id === "all") {
      router.push("/category");
    } else {
      router.push(`/category/${id}`);
    }
  };

  return (
    <div className="w-full bg-[#F8F9FA] border-b border-gray-200/90 select-none shadow-[inset_0_-1px_0_rgba(0,0,0,0.02)]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6">
        <nav
          aria-label="Categories"
          className="flex items-center justify-between w-full py-2 gap-1 sm:gap-1.5 md:gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {DESKTOP_CATEGORIES.map(({ id, label, icon: Icon, color, activeBg }) => {
            const isActive = selected === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => handleSelect(id)}
                className={`flex-1 min-w-[62px] sm:min-w-[70px] lg:min-w-0 flex flex-col items-center justify-center gap-1.5 py-1.5 px-1 sm:px-2 rounded-xl transition-all duration-200 group cursor-pointer text-center ${
                  isActive ? "shadow-2xs font-bold" : "hover:bg-slate-200/60 font-medium"
                }`}
                style={{ backgroundColor: isActive ? activeBg : "transparent" }}
              >
                <div
                  className={`flex items-center justify-center transition-transform duration-150 ${
                    isActive ? "scale-110" : "group-hover:scale-110"
                  }`}
                >
                  <Icon
                    className="h-5 w-5 sm:h-5.5 sm:w-5.5 lg:h-6 lg:w-6 shrink-0"
                    style={{ color: color }}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
                <span
                  className={`text-[10px] sm:text-[11px] lg:text-[11.5px] leading-tight tracking-tight whitespace-nowrap transition-colors ${
                    isActive ? "text-[#061842]" : "text-[#475569] group-hover:text-[#061842]"
                  }`}
                  title={label}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { LayoutGrid, Shirt, Smartphone, Monitor, Sparkles, Home, Speaker, Baby, ShoppingBasket, Car, Trophy, Armchair, Book, Bike } from "lucide-react";
import { useRouter } from "next/navigation";

const DESKTOP_CATEGORIES = [
  { id: "all", label: "All Categories", icon: LayoutGrid, color: "#1668F6", activeBg: "#E8F0FE" },
  { id: "fashion", label: "Fashion", icon: Shirt, color: "#2563EB", activeBg: "#E8F0FE" },
  { id: "mobiles", label: "Mobiles", icon: Smartphone, color: "#EA4335", activeBg: "#FCE8E6" },
  { id: "electronics", label: "Electronics", icon: Monitor, color: "#34A853", activeBg: "#E6F4EA" },
  { id: "beauty", label: "Beauty", icon: Sparkles, color: "#E91E63", activeBg: "#FCE4EC" },
  { id: "home_living", label: "Home & Living", icon: Home, color: "#FBBC04", activeBg: "#FEF7E0" },
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

export default function DesktopCategoryStrip({ activeId = "all", onSelect }: DesktopCategoryStripProps) {
  const [selected, setSelected] = useState(activeId);
  const router = useRouter();

  const handleSelect = (id: string) => {
    setSelected(id);
    onSelect?.(id);
    if (id === 'all') {
      router.push('/category');
    } else {
      router.push(`/category/${id}`);
    }
  };

  return (
    <div className="w-full bg-[#F8F9FA] border-b border-gray-200 select-none">
      <div className="max-w-[1920px] mx-auto px-6 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-6 py-2 min-w-max">
          {DESKTOP_CATEGORIES.map(({ id, label, icon: Icon, color, activeBg }) => {
            const isActive = selected === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => handleSelect(id)}
                className={`flex flex-col items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-200 group cursor-pointer ${isActive ? "" : "hover:bg-gray-100"
                  }`}
                style={{ backgroundColor: isActive ? activeBg : 'transparent' }}
              >
                <div
                  className={`flex items-center justify-center transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                >
                  <Icon
                    className="h-6 w-6"
                    style={{ color: color }}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
                <span
                  className={`text-[11px] font-bold tracking-tight whitespace-nowrap transition-colors ${isActive ? "text-[#061842]" : "text-[#475569] group-hover:text-[#061842]"
                    }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

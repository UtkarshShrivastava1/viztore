"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CategoryItem {
  id: string;
  label: string;
  imageSrc: string;
  imgWidth: number;
  imgHeight: number;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "fashion",
    label: "Fashion",
    imageSrc: "/categories/fashion_couple.png",
    imgWidth: 70,
    imgHeight: 70,
  },
  {
    id: "beauty",
    label: "Beauty",
    imageSrc: "/categories/beauty.png",
    imgWidth: 50,
    imgHeight: 68,
  },
  {
    id: "home_living",
    label: "Home & Living",
    imageSrc: "/categories/home_living.png",
    imgWidth: 64,
    imgHeight: 68,
  },
  {
    id: "footwear",
    label: "Footwear",
    imageSrc: "/categories/footwear.png",
    imgWidth: 70,
    imgHeight: 64,
  },
  {
    id: "electronics",
    label: "Electronics",
    imageSrc: "/categories/electronics.png",
    imgWidth: 50,
    imgHeight: 68,
  },
  {
    id: "accessories",
    label: "Accessories",
    imageSrc: "/categories/accessories.png",
    imgWidth: 50,
    imgHeight: 68,
  },
  {
    id: "value_store",
    label: "Value Store",
    imageSrc: "/categories/value_store.png",
    imgWidth: 66,
    imgHeight: 52,
  },
];

interface CategoryIconsProps {
  activeId?: string;
  onSelect?: (id: string) => void;
}

export default function CategoryIcons({
  activeId = "fashion",
  onSelect,
}: CategoryIconsProps) {
  const [selected, setSelected] = useState(activeId);

  const router = useRouter();

  const handleSelect = (id: string) => {
    setSelected(id);
    onSelect?.(id);
    if (id === 'fashion') {
      router.push('/category/fashion');
    }
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-2 select-none">
      <div className="flex items-start gap-3.5 px-4 min-w-max">
        {CATEGORIES.map(({ id, label, imageSrc, imgWidth, imgHeight }) => {
          const isActive = selected === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => handleSelect(id)}
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* Card / Image Container */}
              <div
                className={`relative flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? "w-[78px] h-[78px] rounded-2xl bg-white shadow-md shadow-blue-950/10 p-1"
                    : "w-[78px] h-[78px] p-1 hover:scale-105 transition-transform"
                }`}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={imageSrc}
                    alt={label}
                    width={imgWidth}
                    height={imgHeight}
                    className="object-contain drop-shadow-sm pointer-events-none"
                    priority
                  />
                </div>
              </div>

              {/* Label */}
              <span
                className={`text-[12px] font-bold tracking-tight text-center mt-1.5 transition-colors whitespace-nowrap ${
                  isActive ? "text-[#1668F6]" : "text-[#061842] group-hover:text-blue-900"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

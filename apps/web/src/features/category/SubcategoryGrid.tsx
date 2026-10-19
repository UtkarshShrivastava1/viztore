import React from 'react';
import Link from 'next/link';

export interface Subcategory {
  id: string;
  name: string;
  imageUrl: string;
  href: string;
}

export interface SubcategorySectionProps {
  title: string;
  subcategories: Subcategory[];
  viewAllHref: string;
}

export function SubcategoryGrid({ title, subcategories, viewAllHref }: SubcategorySectionProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-[15px] font-bold text-[#061842]">{title}</h3>
        <Link
          href={viewAllHref}
          className="text-[12px] font-semibold text-[#1668F6] hover:text-blue-800 transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-y-4 gap-x-2">
        {subcategories.map((sub) => (
          <Link
            key={sub.id}
            href={sub.href}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="relative w-[70px] h-[70px] sm:w-[78px] sm:h-[78px] rounded-full overflow-hidden bg-[#F1F5F9] mb-1.5 border border-slate-100 shadow-2xs group-hover:scale-105 transition-transform duration-200">
              <img
                src={sub.imageUrl}
                alt={sub.name}
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
            </div>
            <span className="text-[11px] sm:text-xs text-center font-medium text-slate-800 leading-tight line-clamp-1 group-hover:text-[#1668F6] transition-colors">
              {sub.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SubcategoryGrid;

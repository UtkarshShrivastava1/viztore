import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Subcategory {
  id: string;
  name: string;
  imageUrl: string;
  href: string;
}

interface SubcategorySectionProps {
  title: string;
  subcategories: Subcategory[];
  viewAllHref: string;
}

export function SubcategoryGrid({ title, subcategories, viewAllHref }: SubcategorySectionProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 px-4">
        <h3 className="text-sm md:text-base font-bold text-gray-900">{title}</h3>
        <Link href={viewAllHref} className="text-xs md:text-sm font-semibold text-blue-600 hover:text-blue-800">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-y-6 gap-x-2 px-4">
        {subcategories.map((sub) => (
          <Link key={sub.id} href={sub.href} className="flex flex-col items-center group">
            <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-100 mb-2 border border-gray-100 group-hover:border-blue-200 transition-colors">
              <Image 
                src={sub.imageUrl} 
                alt={sub.name} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-[10px] md:text-xs text-center font-medium text-gray-700 leading-tight">
              {sub.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

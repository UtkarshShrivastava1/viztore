import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const ALL_CATEGORIES = [
  { id: 'fashion', label: 'Fashion', imageSrc: '/categories/fashion_couple.png' },
  { id: 'mobiles', label: 'Mobiles', imageSrc: '/categories/electronics.png' }, // placeholder
  { id: 'electronics', label: 'Electronics', imageSrc: '/categories/electronics.png' },
  { id: 'beauty', label: 'Beauty', imageSrc: '/categories/beauty.png' },
  { id: 'home_living', label: 'Home & Living', imageSrc: '/categories/home_living.png' },
  { id: 'appliances', label: 'Appliances', imageSrc: '/categories/home_living.png' }, // placeholder
  { id: 'toys_baby', label: 'Toys & Baby', imageSrc: '/categories/value_store.png' }, // placeholder
  { id: 'food_health', label: 'Food & Health', imageSrc: '/categories/beauty.png' }, // placeholder
  { id: 'auto_accessories', label: 'Auto Accessories', imageSrc: '/categories/footwear.png' }, // placeholder
  { id: 'sports', label: 'Sports', imageSrc: '/categories/footwear.png' }, // placeholder
  { id: 'furniture', label: 'Furniture', imageSrc: '/categories/home_living.png' }, // placeholder
  { id: 'books', label: 'Books', imageSrc: '/categories/accessories.png' }, // placeholder
  { id: 'two_wheelers', label: '2 Wheelers', imageSrc: '/categories/value_store.png' }, // placeholder
];

export function AllCategoriesGrid() {
  return (
    <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12 xl:-mx-24 xl:px-24">
      {ALL_CATEGORIES.map((cat) => (
        <Link 
          key={cat.id} 
          href={`/category/${cat.id}`}
          className="flex flex-col items-center group cursor-pointer shrink-0 snap-start w-[80px] md:w-[96px]"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-[#F5F8FF] to-[#E8F0FE] flex items-center justify-center p-2 mb-3 shadow-sm border border-blue-50 transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
            <div className="relative w-full h-full flex items-center justify-center">
              <Image 
                src={cat.imageSrc} 
                alt={cat.label} 
                width={80} 
                height={80} 
                className="object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110" 
              />
            </div>
          </div>
          <span className="text-[12px] md:text-sm font-bold text-[#061842] text-center leading-tight group-hover:text-[#1668F6] transition-colors">
            {cat.label}
          </span>
        </Link>
      ))}
    </div>
  );
}

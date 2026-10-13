import React from 'react';
import Link from 'next/link';

const ALL_CATEGORIES = [
  { 
    id: 'fashion', 
    label: 'Fashion', 
    imageSrc: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=240&q=80&fm=png&bg=transparent',
    fallbackLocal: '/categories/fashion.png'
  },
  { 
    id: 'mobiles', 
    label: 'Mobiles', 
    imageSrc: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=240&q=80&fm=png&bg=transparent',
    fallbackLocal: '/categories/electronics.png'
  },
  { 
    id: 'electronics', 
    label: 'Electronics', 
    imageSrc: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=240&q=80&fm=png&bg=transparent',
    fallbackLocal: '/categories/electronics.png'
  },
  { 
    id: 'beauty', 
    label: 'Beauty', 
    imageSrc: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=240&q=80&fm=png&bg=transparent',
    fallbackLocal: '/categories/beauty.png'
  },
  { 
    id: 'home_living', 
    label: 'Home & Living', 
    imageSrc: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=240&q=80&fm=png&bg=transparent',
    fallbackLocal: '/categories/home_living.png'
  },
  { 
    id: 'appliances', 
    label: 'Appliances', 
    imageSrc: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=240&q=80&fm=png&bg=transparent',
    fallbackLocal: '/categories/home_living.png'
  },
  { 
    id: 'toys_baby', 
    label: 'Toys & Baby', 
    imageSrc: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=240&q=80&fm=png&bg=transparent',
    fallbackLocal: '/categories/value_store.png'
  },
  { 
    id: 'food_health', 
    label: 'Food & Health', 
    imageSrc: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=240&q=80&fm=png&bg=transparent',
    fallbackLocal: '/categories/beauty.png'
  },
  { 
    id: 'auto_accessories', 
    label: 'Auto Accessories', 
    imageSrc: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=240&q=80&fm=png&bg=transparent',
    fallbackLocal: '/categories/footwear.png'
  },
  { 
    id: 'sports', 
    label: 'Sports', 
    imageSrc: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=240&q=80&fm=png&bg=transparent',
    fallbackLocal: '/categories/footwear.png'
  },
  { 
    id: 'furniture', 
    label: 'Furniture', 
    imageSrc: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=240&q=80&fm=png&bg=transparent',
    fallbackLocal: '/categories/home_living.png'
  },
  { 
    id: 'books', 
    label: 'Books', 
    imageSrc: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=240&q=80&fm=png&bg=transparent',
    fallbackLocal: '/categories/accessories.png'
  },
  { 
    id: 'two_wheelers', 
    label: '2 Wheelers', 
    imageSrc: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=240&q=80&fm=png&bg=transparent',
    fallbackLocal: '/categories/value_store.png'
  },
];

export function AllCategoriesGrid() {
  return (
    <div className="w-full ">
      <div className="flex  items-center justify-between gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-3 pt-1 snap-x select-none">
        {ALL_CATEGORIES.map((cat) => (
          <Link 
            key={cat.id} 
            href={`/category/${cat.id}`}
            className="flex flex-col items-center group cursor-pointer shrink-0 snap-start w-[82px] sm:w-[88px] lg:w-[94px] xl:w-[98px]"
          >
            {/* Card shape */}
            <div className="w-full aspect-square rounded-[22px] bg-gradient-to-b from-[#F2F6FE] to-[#E9F1FE] flex items-center justify-center p-2.5 shadow-2xs border border-blue-100/60 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-md group-hover:border-blue-200">
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <img 
                  src={cat.imageSrc} 
                  alt={cat.label} 
                  className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-110" 
                  loading="lazy"
                />
              </div>
            </div>
            
            {/* Label below card */}
            <span className="text-[11.5px] sm:text-[12px] font-bold text-[#061842] text-center mt-2 group-hover:text-[#1668F6] transition-colors leading-tight line-clamp-1">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}


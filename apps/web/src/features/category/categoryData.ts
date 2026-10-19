export interface SubcategoryItem {
  id: string;
  name: string;
  imageUrl: string;
  href: string;
}

export interface SubcategorySection {
  title: string;
  viewAllHref: string;
  subcategories: SubcategoryItem[];
}

export interface CategoryData {
  id: string;
  label: string;
  banner: {
    title: string;
    storeName: string;
    imageUrl: string;
    href: string;
    bgColor?: string;
  };
  sections: SubcategorySection[];
}

export const CATEGORY_DATA_MAP: Record<string, CategoryData> = {
  'mens-fashion': {
    id: 'mens-fashion',
    label: "Men's Fashion",
    banner: {
      title: "Men's",
      storeName: 'Fashion Store',
      imageUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&q=80&auto=format&fit=crop',
      href: '/products?category=mens-fashion',
      bgColor: 'bg-gradient-to-r from-[#EBF2FE] via-[#E2EDFC] to-[#D5E6FB]',
    },
    sections: [
      {
        title: 'Casual Wear',
        viewAllHref: '/products?category=mens-fashion&type=casual',
        subcategories: [
          {
            id: 'shirts',
            name: 'Shirts',
            imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=mens-fashion&sub=shirts',
          },
          {
            id: 't-shirts',
            name: 'T-Shirts',
            imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=mens-fashion&sub=t-shirts',
          },
          {
            id: 'jeans',
            name: 'Jeans',
            imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=mens-fashion&sub=jeans',
          },
          {
            id: 'trousers',
            name: 'Trousers',
            imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=mens-fashion&sub=trousers',
          },
          {
            id: 'shorts',
            name: 'Shorts',
            imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=mens-fashion&sub=shorts',
          },
          {
            id: 'track-pants',
            name: 'Track Pants',
            imageUrl: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=mens-fashion&sub=track-pants',
          },
          {
            id: 'jackets',
            name: 'Jackets',
            imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=mens-fashion&sub=jackets',
          },
          {
            id: 'sweatshirts',
            name: 'Sweatshirts',
            imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=mens-fashion&sub=sweatshirts',
          },
          {
            id: 'sweaters',
            name: 'Sweaters',
            imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=mens-fashion&sub=sweaters',
          },
        ],
      },
      {
        title: 'Work Wear',
        viewAllHref: '/products?category=mens-fashion&type=work',
        subcategories: [
          {
            id: 'formal-shirts',
            name: 'Formal Shirts',
            imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=mens-fashion&sub=formal-shirts',
          },
          {
            id: 'blazers',
            name: 'Blazers',
            imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=mens-fashion&sub=blazers',
          },
          {
            id: 'formal-trousers',
            name: 'Formal Trousers',
            imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=mens-fashion&sub=formal-trousers',
          },
          {
            id: 'coats',
            name: 'Coats',
            imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=mens-fashion&sub=coats',
          },
          {
            id: 'ties',
            name: 'Ties',
            imageUrl: 'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=mens-fashion&sub=ties',
          },
          {
            id: 'formal-shoes',
            name: 'Formal Shoes',
            imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=mens-fashion&sub=formal-shoes',
          },
        ],
      },
      {
        title: 'Occasion Wear',
        viewAllHref: '/products?category=mens-fashion&type=occasion',
        subcategories: [
          {
            id: 'kurta-sets',
            name: 'Kurta Sets',
            imageUrl: 'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=mens-fashion&sub=kurta-sets',
          },
          {
            id: 'sherwanis',
            name: 'Sherwanis',
            imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=mens-fashion&sub=sherwanis',
          },
          {
            id: 'nehru-jackets',
            name: 'Nehru Jackets',
            imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=mens-fashion&sub=nehru-jackets',
          },
          {
            id: 'dhotis',
            name: 'Dhotis',
            imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=mens-fashion&sub=dhotis',
          },
          {
            id: 'tuxedos',
            name: 'Tuxedos',
            imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=mens-fashion&sub=tuxedos',
          },
          {
            id: 'ethnic-footwear',
            name: 'Ethnic Shoes',
            imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=mens-fashion&sub=ethnic-shoes',
          },
        ],
      },
    ],
  },
  'trending': {
    id: 'trending',
    label: 'Trending Now',
    banner: {
      title: 'Top',
      storeName: 'Trending Deals',
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80&auto=format&fit=crop',
      href: '/products?filter=trending',
      bgColor: 'bg-gradient-to-r from-[#FFF4ED] via-[#FFE8D9] to-[#FFDEC8]',
    },
    sections: [
      {
        title: 'Hot This Week',
        viewAllHref: '/products?filter=trending',
        subcategories: [
          {
            id: 'graphic-tees',
            name: 'Graphic Tees',
            imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=mens-fashion&sub=t-shirts',
          },
          {
            id: 'sneakers',
            name: 'Chunky Kicks',
            imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=footwear',
          },
          {
            id: 'cargo-pants',
            name: 'Cargos',
            imageUrl: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=mens-fashion&sub=trousers',
          },
          {
            id: 'hoodies',
            name: 'Oversized Fits',
            imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=mens-fashion&sub=sweatshirts',
          },
          {
            id: 'smartwatches',
            name: 'Smartwatches',
            imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=electronics',
          },
          {
            id: 'sunglasses',
            name: 'Retro Shades',
            imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=accessories',
          },
        ],
      },
    ],
  },
  'womens-fashion': {
    id: 'womens-fashion',
    label: "Women's Fashion",
    banner: {
      title: "Women's",
      storeName: 'Fashion Store',
      imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c400a86?w=500&q=80&auto=format&fit=crop',
      href: '/products?category=womens-fashion',
      bgColor: 'bg-gradient-to-r from-[#FDF2F8] via-[#FCE7F3] to-[#FBCFE8]',
    },
    sections: [
      {
        title: 'Ethnic Wear',
        viewAllHref: '/products?category=womens-fashion&type=ethnic',
        subcategories: [
          {
            id: 'kurtis',
            name: 'Kurtis & Sets',
            imageUrl: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=womens-fashion&sub=kurtis',
          },
          {
            id: 'sarees',
            name: 'Sarees',
            imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=womens-fashion&sub=sarees',
          },
          {
            id: 'lehengas',
            name: 'Lehengas',
            imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=womens-fashion&sub=lehengas',
          },
        ],
      },
      {
        title: 'Western Wear',
        viewAllHref: '/products?category=womens-fashion&type=western',
        subcategories: [
          {
            id: 'dresses',
            name: 'Dresses',
            imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=womens-fashion&sub=dresses',
          },
          {
            id: 'tops',
            name: 'Tops & Tees',
            imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=womens-fashion&sub=tops',
          },
          {
            id: 'jeans-women',
            name: 'Jeans & Pants',
            imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=womens-fashion&sub=jeans',
          },
        ],
      },
    ],
  },
  'kids': {
    id: 'kids',
    label: 'Kids Fashion',
    banner: {
      title: 'Kids',
      storeName: 'Fashion & Fun',
      imageUrl: 'https://images.unsplash.com/photo-1519238263530-99abad67b299?w=500&q=80&auto=format&fit=crop',
      href: '/products?category=kids',
      bgColor: 'bg-gradient-to-r from-[#FEFCE8] via-[#FEF9C3] to-[#FEF08A]',
    },
    sections: [
      {
        title: 'Boys Clothing',
        viewAllHref: '/products?category=kids&type=boys',
        subcategories: [
          {
            id: 'boys-tees',
            name: 'T-Shirts & Polos',
            imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=kids&sub=t-shirts',
          },
          {
            id: 'boys-jeans',
            name: 'Jeans & Shorts',
            imageUrl: 'https://images.unsplash.com/photo-1519238263530-99abad67b299?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=kids&sub=jeans',
          },
          {
            id: 'boys-ethnic',
            name: 'Ethnic Wear',
            imageUrl: 'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=kids&sub=ethnic',
          },
        ],
      },
      {
        title: 'Girls Clothing',
        viewAllHref: '/products?category=kids&type=girls',
        subcategories: [
          {
            id: 'girls-frocks',
            name: 'Frocks & Dresses',
            imageUrl: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=kids&sub=dresses',
          },
          {
            id: 'girls-tops',
            name: 'Tops & Leggings',
            imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=kids&sub=tops',
          },
          {
            id: 'baby-wear',
            name: 'Baby Rompers',
            imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=kids&sub=baby',
          },
        ],
      },
    ],
  },
  'footwear': {
    id: 'footwear',
    label: 'Footwear',
    banner: {
      title: 'Footwear',
      storeName: 'Trending Kicks',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80&auto=format&fit=crop',
      href: '/products?category=footwear',
      bgColor: 'bg-gradient-to-r from-[#ECFDF5] via-[#D1FAE5] to-[#A7F3D0]',
    },
    sections: [
      {
        title: "Men's Footwear",
        viewAllHref: '/products?category=footwear&gender=men',
        subcategories: [
          {
            id: 'running-shoes',
            name: 'Sports Shoes',
            imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=footwear&sub=sports',
          },
          {
            id: 'casual-sneakers',
            name: 'Casual Sneakers',
            imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=footwear&sub=sneakers',
          },
          {
            id: 'formal-shoes-m',
            name: 'Formal Shoes',
            imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=footwear&sub=formal',
          },
        ],
      },
    ],
  },
  'beauty': {
    id: 'beauty',
    label: 'Beauty & Grooming',
    banner: {
      title: 'Beauty &',
      storeName: 'Personal Care',
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80&auto=format&fit=crop',
      href: '/products?category=beauty',
      bgColor: 'bg-gradient-to-r from-[#FAF5FF] via-[#F3E8FF] to-[#E9D5FF]',
    },
    sections: [
      {
        title: 'Skincare & Haircare',
        viewAllHref: '/products?category=beauty',
        subcategories: [
          {
            id: 'face-wash',
            name: 'Face Washes',
            imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=beauty&sub=skincare',
          },
          {
            id: 'serums',
            name: 'Glow Serums',
            imageUrl: 'https://images.unsplash.com/photo-1608248597359-2e06180ec623?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=beauty&sub=serums',
          },
          {
            id: 'perfumes',
            name: 'Fragrances',
            imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=beauty&sub=fragrances',
          },
        ],
      },
    ],
  },
  'home': {
    id: 'home',
    label: 'Home & Living',
    banner: {
      title: 'Home &',
      storeName: 'Living Spaces',
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80&auto=format&fit=crop',
      href: '/products?category=home_living',
      bgColor: 'bg-gradient-to-r from-[#F0FDFA] via-[#CCFBF1] to-[#99F6E4]',
    },
    sections: [
      {
        title: 'Furnishing & Decor',
        viewAllHref: '/products?category=home_living',
        subcategories: [
          {
            id: 'bedsheets',
            name: 'Bedsheets',
            imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=home_living&sub=bedding',
          },
          {
            id: 'cushions',
            name: 'Cushions & Throws',
            imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=home_living&sub=cushions',
          },
          {
            id: 'kitchen-decor',
            name: 'Kitchenware',
            imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=home_living&sub=kitchen',
          },
        ],
      },
    ],
  },
  'electronics': {
    id: 'electronics',
    label: 'Electronics',
    banner: {
      title: 'Smart',
      storeName: 'Electronics Hub',
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80&auto=format&fit=crop',
      href: '/products?category=electronics',
      bgColor: 'bg-gradient-to-r from-[#EEF2FF] via-[#E0E7FF] to-[#C7D2FE]',
    },
    sections: [
      {
        title: 'Audio & Gadgets',
        viewAllHref: '/products?category=electronics',
        subcategories: [
          {
            id: 'headphones',
            name: 'Headphones',
            imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=electronics&sub=audio',
          },
          {
            id: 'smartphones',
            name: 'Smartphones',
            imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=electronics&sub=mobiles',
          },
          {
            id: 'wearables',
            name: 'Smartwatches',
            imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=electronics&sub=wearables',
          },
        ],
      },
    ],
  },
  'grocery': {
    id: 'grocery',
    label: 'Grocery & Staples',
    banner: {
      title: 'Fresh',
      storeName: 'Daily Essentials',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80&auto=format&fit=crop',
      href: '/products?category=grocery_staples',
      bgColor: 'bg-gradient-to-r from-[#F0FDF4] via-[#DCFCE7] to-[#BBF7D0]',
    },
    sections: [
      {
        title: 'Pantry Staples',
        viewAllHref: '/products?category=grocery_staples',
        subcategories: [
          {
            id: 'flour-grains',
            name: 'Atta & Rice',
            imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=grocery_staples&sub=grains',
          },
          {
            id: 'oils-ghee',
            name: 'Oils & Ghee',
            imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=grocery_staples&sub=oils',
          },
          {
            id: 'spices',
            name: 'Masalas & Spices',
            imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=grocery_staples&sub=spices',
          },
        ],
      },
    ],
  },
  'automotive': {
    id: 'automotive',
    label: 'Automotive',
    banner: {
      title: 'Auto',
      storeName: 'Gear & Parts',
      imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&q=80&auto=format&fit=crop',
      href: '/products?category=automotive',
      bgColor: 'bg-gradient-to-r from-[#FEF2F2] via-[#FEE2E2] to-[#FECACA]',
    },
    sections: [
      {
        title: 'Accessories & Spares',
        viewAllHref: '/products?category=automotive',
        subcategories: [
          {
            id: 'helmets',
            name: 'Helmets & Gear',
            imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=automotive&sub=helmets',
          },
          {
            id: 'car-perfume',
            name: 'Air Fresheners',
            imageUrl: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=automotive&sub=perfume',
          },
          {
            id: 'car-holders',
            name: 'Mobile Mounts',
            imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=automotive&sub=mounts',
          },
        ],
      },
    ],
  },
  'sports': {
    id: 'sports',
    label: 'Sports & Fitness',
    banner: {
      title: 'Sports &',
      storeName: 'Active Lifestyle',
      imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&q=80&auto=format&fit=crop',
      href: '/products?category=sports_fitness',
      bgColor: 'bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]',
    },
    sections: [
      {
        title: 'Workout & Fitness',
        viewAllHref: '/products?category=sports_fitness',
        subcategories: [
          {
            id: 'gym-bands',
            name: 'Fitness Bands',
            imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=sports_fitness&sub=bands',
          },
          {
            id: 'shakers',
            name: 'Gym Bottles',
            imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=sports_fitness&sub=shakers',
          },
          {
            id: 'yoga-mats',
            name: 'Yoga Mats',
            imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=sports_fitness&sub=mats',
          },
        ],
      },
    ],
  },
  'toys': {
    id: 'toys',
    label: 'Toys, Kids & Baby',
    banner: {
      title: 'Toys &',
      storeName: 'Fun Games',
      imageUrl: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=500&q=80&auto=format&fit=crop',
      href: '/products?category=toys_baby',
      bgColor: 'bg-gradient-to-r from-[#F5F3FF] via-[#EDE9FE] to-[#DDD6FE]',
    },
    sections: [
      {
        title: 'Top Toy Categories',
        viewAllHref: '/products?category=toys_baby',
        subcategories: [
          {
            id: 'building-blocks',
            name: 'Building Blocks',
            imageUrl: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=toys_baby&sub=blocks',
          },
          {
            id: 'plush-toys',
            name: 'Teddy & Plush',
            imageUrl: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=toys_baby&sub=plush',
          },
          {
            id: 'board-games',
            name: 'Board Games',
            imageUrl: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=toys_baby&sub=boardgames',
          },
        ],
      },
    ],
  },
  'books': {
    id: 'books',
    label: 'Books & Stationery',
    banner: {
      title: 'Books &',
      storeName: 'Reading Corner',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80&auto=format&fit=crop',
      href: '/products?category=books_stationery',
      bgColor: 'bg-gradient-to-r from-[#EFF6FF] via-[#DBEAFE] to-[#BFDBFE]',
    },
    sections: [
      {
        title: 'Reading & Writing',
        viewAllHref: '/products?category=books_stationery',
        subcategories: [
          {
            id: 'bestsellers',
            name: 'Best Sellers',
            imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=books_stationery&sub=bestsellers',
          },
          {
            id: 'notebooks',
            name: 'Journals & Pens',
            imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=books_stationery&sub=notebooks',
          },
          {
            id: 'art-supplies',
            name: 'Art Supplies',
            imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=books_stationery&sub=art',
          },
        ],
      },
    ],
  },
  'more': {
    id: 'more',
    label: 'More Categories',
    banner: {
      title: 'Explore',
      storeName: 'All Categories',
      imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&q=80&auto=format&fit=crop',
      href: '/category',
      bgColor: 'bg-gradient-to-r from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]',
    },
    sections: [
      {
        title: 'Other Departments',
        viewAllHref: '/category',
        subcategories: [
          {
            id: 'gifts-crafts',
            name: 'Gifts & Crafts',
            imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=gifts',
          },
          {
            id: 'pet-supplies',
            name: 'Pet Care',
            imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=pets',
          },
          {
            id: 'appliances',
            name: 'Home Appliances',
            imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=240&q=80&auto=format&fit=crop',
            href: '/products?category=appliances',
          },
        ],
      },
    ],
  },
};

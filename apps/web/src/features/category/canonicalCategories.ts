import { StoreCategory } from '@repo/shared-types';

export interface CanonicalSubcategory {
  name: string;
  productTypes: string[];
  imageUrl: string;
}

export interface CanonicalCategory {
  id: string;
  canonicalName: string;
  label: string;
  shortLabel: string;
  tagline: string;
  iconName: string;
  color: string;
  activeBg: string;
  gradient: string;
  heroImage: string;
  storeCategory?: StoreCategory;
  subcategories: CanonicalSubcategory[];
  aliases: string[];
}

export const CANONICAL_CATEGORIES: CanonicalCategory[] = [
  {
    id: 'electronics',
    canonicalName: 'Electronics',
    label: 'Electronics',
    shortLabel: 'Electronics',
    tagline: '5G Smartphones, Laptops, Audio, Smartwatches & Computing Gear',
    iconName: 'Smartphone',
    color: '#1668F6',
    activeBg: '#EBF2FE',
    gradient: 'from-blue-900/95 via-indigo-900/90 to-slate-900/95',
    heroImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&q=80',
    storeCategory: StoreCategory.ELECTRONICS,
    aliases: ['mobiles', 'phones', 'laptops', 'gadgets', 'appliances', 'consumer-electronics'],
    subcategories: [
      {
        name: 'Mobiles',
        productTypes: ['Smartphones', 'Feature Phones'],
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80',
      },
      {
        name: 'Mobile Accessories',
        productTypes: ['Mobile Cases', 'Headphones & Headsets', 'Power Banks', 'Screenguards'],
        imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&q=80',
      },
      {
        name: 'Smart Wearable Tech',
        productTypes: ['Smart Watches', 'Smart Glasses (VR)', 'Smart Bands'],
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80',
      },
      {
        name: 'Laptops',
        productTypes: ['Gaming Laptops', 'Thin & Light Laptops', 'Business Laptops'],
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=80',
      },
      {
        name: 'Desktop PCs',
        productTypes: ['All In One PCs', 'Mini PCs', 'Tower PCs'],
        imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=300&q=80',
      },
      {
        name: 'Gaming & Accessories',
        productTypes: ['Gaming Consoles', 'Gaming Controllers', 'Gaming Keyboards', 'Gaming Mice'],
        imageUrl: 'https://images.unsplash.com/photo-1612287232252-9596af42d9f3?w=300&q=80',
      },
      {
        name: 'Computer Peripherals',
        productTypes: ['Printers & Ink Cartridges', 'Monitors', 'Projectors'],
        imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&q=80',
      },
      {
        name: 'Tablets',
        productTypes: ['Apple iPads', 'Android Tablets', 'Graphics Tablets'],
        imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&q=80',
      },
      {
        name: 'Televisions',
        productTypes: ['Smart TVs', 'OLED TVs', '4K Ultra HD'],
        imageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=300&q=80',
      },
      {
        name: 'Speakers',
        productTypes: ['Home Audio Speakers', 'Home Theatres', 'Bluetooth Speakers', 'Soundbars'],
        imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&q=80',
      },
      {
        name: 'Camera',
        productTypes: ['DSLR & Mirrorless', 'Compact Cameras', 'Sports & Action Cameras'],
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80',
      },
    ],
  },
  {
    id: 'mens',
    canonicalName: "Men's",
    label: "Men's Fashion",
    shortLabel: "Men's",
    tagline: 'Shirts, Casual T-Shirts, Formal Suits, Shoes, Watches & Grooming',
    iconName: 'Shirt',
    color: '#2563EB',
    activeBg: '#EFF6FF',
    gradient: 'from-slate-900/95 via-blue-950/90 to-slate-900/95',
    heroImage: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1200&q=80',
    storeCategory: StoreCategory.FASHION,
    aliases: ['mens-fashion', 'men', 'mens-wear', 'fashion-men', 'fashion'],
    subcategories: [
      {
        name: 'Clothing',
        productTypes: ['T-Shirts', 'Formal Shirts', 'Casual Shirts', 'Jeans', 'Trousers', 'Suits & Blazers'],
        imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=300&q=80',
      },
      {
        name: 'Footwear',
        productTypes: ['Sports Shoes', 'Casual Shoes', 'Formal Shoes', 'Sandals & Floaters'],
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80',
      },
      {
        name: 'Watches',
        productTypes: ['Analog Watches', 'Chronograph Watches', 'Smart Watches'],
        imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300&q=80',
      },
      {
        name: "Men's Grooming",
        productTypes: ['Deodorants', 'Perfumes', 'Beard Care & Grooming', 'Shaving Kits'],
        imageUrl: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=300&q=80',
      },
      {
        name: 'Accessories',
        productTypes: ['Backpacks', 'Wallets', 'Belts', 'Sunglasses', 'Ties & Cufflinks'],
        imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&q=80',
      },
      {
        name: 'Personal Care Appliances',
        productTypes: ['Trimmers', 'Shavers', 'Grooming Kits'],
        imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&q=80',
      },
    ],
  },
  {
    id: 'womens',
    canonicalName: "Women's",
    label: "Women's Fashion",
    shortLabel: "Women's",
    tagline: 'Ethnic Sarees, Kurtas, Western Dresses, Footwear, Jewellery & Beauty',
    iconName: 'Sparkles',
    color: '#DB2777',
    activeBg: '#FDF2F8',
    gradient: 'from-pink-950/95 via-rose-900/90 to-slate-900/95',
    heroImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80',
    storeCategory: StoreCategory.FASHION,
    aliases: ['womens-fashion', 'women', 'womens-wear', 'fashion-women', 'beauty'],
    subcategories: [
      {
        name: 'Ethnic Wear',
        productTypes: ['Sarees', 'Kurtas & Kurtis', 'Dress Material', 'Lehenga Cholis'],
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&q=80',
      },
      {
        name: 'Western & Maternity Wear',
        productTypes: ['Topwear', 'Dresses', 'Jeans', 'Tops & Shirts', 'Jumpsuits'],
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80',
      },
      {
        name: 'Footwear',
        productTypes: ['Flats', 'Heels', 'Sandals', 'Casual Shoes', 'Wedges'],
        imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&q=80',
      },
      {
        name: 'Beauty & Grooming',
        productTypes: ['Make Up', 'Skin Care', 'Hair Care', 'Fragrances'],
        imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&q=80',
      },
      {
        name: 'Jewellery',
        productTypes: ['Artificial Jewellery', 'Silver Jewellery', 'Earrings', 'Necklaces'],
        imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&q=80',
      },
      {
        name: 'Accessories',
        productTypes: ['Handbags', 'Shoulder Bags', 'Totes', 'Sunglasses'],
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&q=80',
      },
    ],
  },
  {
    id: 'baby-kids',
    canonicalName: 'Baby & Kids',
    label: 'Baby & Kids',
    shortLabel: 'Kids & Baby',
    tagline: "Kids' Clothing, Diapers, Educational Toys, Baby Care & School Supplies",
    iconName: 'Baby',
    color: '#EA580C',
    activeBg: '#FFF7ED',
    gradient: 'from-amber-950/95 via-orange-900/90 to-slate-900/95',
    heroImage: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200&q=80',
    storeCategory: StoreCategory.TOYS_BABY,
    aliases: ['kids', 'toys_baby', 'baby', 'toys', 'kids-fashion'],
    subcategories: [
      {
        name: 'Toys',
        productTypes: ['Remote Control Toys', 'Educational Toys', 'Soft Toys', 'Board Games', 'Puzzles'],
        imageUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300&q=80',
      },
      {
        name: 'Boys\' Clothing',
        productTypes: ['T-Shirts', 'Ethnic Wear', 'Shorts', 'Shirts', 'Jeans'],
        imageUrl: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=300&q=80',
      },
      {
        name: 'Girls\' Clothing',
        productTypes: ['Dresses & Skirts', 'Ethnic Wear', 'T-shirts & Tops', 'Frocks'],
        imageUrl: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=300&q=80',
      },
      {
        name: 'Baby Care',
        productTypes: ['Diapers', 'Wipes', 'Baby Skin Care', 'Feeding Bottles'],
        imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=300&q=80',
      },
      {
        name: 'School Supplies',
        productTypes: ['School Bags', 'School Combo Sets', 'Lunch Box', 'Water Bottles'],
        imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=300&q=80',
      },
      {
        name: 'Kids\' Footwear',
        productTypes: ['Boys\' Footwear', 'Girls\' Footwear', 'Sandals', 'Sport Shoes'],
        imageUrl: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=300&q=80',
      },
    ],
  },
  {
    id: 'home-furniture',
    canonicalName: 'Home & Furniture',
    label: 'Home & Furniture',
    shortLabel: 'Home Living',
    tagline: 'Cookware, Bedding, Wall Art, Living Room Sofas & Smart Home Utilities',
    iconName: 'Sofa',
    color: '#0D9488',
    activeBg: '#F0FDFA',
    gradient: 'from-teal-950/95 via-emerald-950/90 to-slate-900/95',
    heroImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80',
    storeCategory: StoreCategory.HOME_LIVING,
    aliases: ['home', 'furniture', 'home_living', 'home-living', 'kitchen', 'home-decor'],
    subcategories: [
      {
        name: 'Kitchen, Cookware & Serveware',
        productTypes: ['Pans', 'Tawas', 'Pressure Cookers', 'Kitchen tools', 'Gas Stoves'],
        imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=300&q=80',
      },
      {
        name: 'Furnishing',
        productTypes: ['Bedsheets', 'Curtains', 'Cushions & Pillows', 'Blankets', 'Carpets & Rugs'],
        imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&q=80',
      },
      {
        name: 'Living Room Furniture',
        productTypes: ['Sofa', 'Sofa Beds', 'TV Units', 'Coffee Tables', 'Recliners'],
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80',
      },
      {
        name: 'Home Decor',
        productTypes: ['Paintings', 'Clocks', 'Wall Shelves', 'Vases', 'Photo Frames'],
        imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300&q=80',
      },
      {
        name: 'Home Lighting',
        productTypes: ['Bulbs', 'Wall Lamp', 'Table Lamp', 'Ceiling Lights', 'Decorative Lights'],
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&q=80',
      },
      {
        name: 'Office & Study Furniture',
        productTypes: ['Study Tables', 'Office Chairs', 'Bookshelves'],
        imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=300&q=80',
      },
    ],
  },
  {
    id: 'food-essentials',
    canonicalName: 'Food Essentials',
    label: 'Food Essentials',
    shortLabel: 'Food Essentials',
    tagline: 'Dry Fruits, Premium Tea, Coffee, Chocolates, Snacks & Daily Staples',
    iconName: 'ShoppingBasket',
    color: '#16A34A',
    activeBg: '#F0FDF4',
    gradient: 'from-emerald-950/95 via-green-900/90 to-slate-900/95',
    heroImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80',
    storeCategory: StoreCategory.GROCERY_STAPLES,
    aliases: ['grocery', 'food_health', 'food', 'staples', 'food-grocery'],
    subcategories: [
      {
        name: 'Nuts & Dry Fruits',
        productTypes: ['Almonds', 'Cashews', 'Walnuts', 'Raisins', 'Pistachios'],
        imageUrl: 'https://images.unsplash.com/photo-1508061252224-43775270e0a4?w=300&q=80',
      },
      {
        name: 'Tea, Coffee and Beverages',
        productTypes: ['Green Tea', 'Instant Coffee', 'Filter Coffee', 'Fruit Juices'],
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&q=80',
      },
      {
        name: 'Chocolates & Sweets',
        productTypes: ['Dark Chocolate', 'Milk Chocolate', 'Gift Boxes', 'Local Sweets'],
        imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=300&q=80',
      },
      {
        name: 'Snacks Corner',
        productTypes: ['Namkeen', 'Chips & Wafers', 'Cookies & Biscuits', 'Popcorn'],
        imageUrl: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=300&q=80',
      },
      {
        name: 'Gifting Combos',
        productTypes: ['Festival Hampers', 'Corporate Gifting', 'Dry Fruit Boxes'],
        imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300&q=80',
      },
    ],
  },
  {
    id: 'sports',
    canonicalName: 'Sports',
    label: 'Sports',
    shortLabel: 'Sports',
    tagline: 'Cricket Bats, Footballs, Badminton Rackets, Cycling Gear & Outdoor Equipment',
    iconName: 'Trophy',
    color: '#D97706',
    activeBg: '#FFFBEB',
    gradient: 'from-amber-950/95 via-yellow-900/90 to-slate-900/95',
    heroImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&q=80',
    storeCategory: StoreCategory.SPORTS_FITNESS,
    aliases: ['outdoor-sports', 'games'],
    subcategories: [
      {
        name: 'Cricket',
        productTypes: ['Cricket Bats', 'Leather Balls', 'Batting Gloves', 'Kits'],
        imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=300&q=80',
      },
      {
        name: 'Badminton',
        productTypes: ['Badminton Rackets', 'Feather Shuttles', 'Grips', 'Kit Bags'],
        imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=300&q=80',
      },
      {
        name: 'Cycling',
        productTypes: ['Geared Bicycles', 'Cycle Helmets', 'Cycle Lights & Locks'],
        imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300&q=80',
      },
      {
        name: 'Football',
        productTypes: ['Footballs', 'Goal Gloves', 'Shin Guards', 'Studs'],
        imageUrl: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=300&q=80',
      },
      {
        name: 'Skating',
        productTypes: ['Roller Skates', 'Inline Skates', 'Skateboards', 'Protective Pads'],
        imageUrl: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=300&q=80',
      },
    ],
  },
  {
    id: 'exercise-fitness',
    canonicalName: 'Exercise & Fitness',
    label: 'Exercise & Fitness',
    shortLabel: 'Fitness',
    tagline: 'Home Gyms, Dumbbells, Treadmills, Yoga Mats, Bands & Support Gear',
    iconName: 'Dumbbell',
    color: '#0284C7',
    activeBg: '#F0F9FF',
    gradient: 'from-sky-950/95 via-blue-900/90 to-slate-900/95',
    heroImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&q=80',
    storeCategory: StoreCategory.SPORTS_FITNESS,
    aliases: ['fitness', 'gym', 'workout', 'yoga'],
    subcategories: [
      {
        name: 'Cardio Equipment',
        productTypes: ['Treadmills', 'Exercise Bikes', 'Ellipticals', 'Rowing Machines'],
        imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=300&q=80',
      },
      {
        name: 'Dumbbells & Weights',
        productTypes: ['Rubber Dumbbells', 'Kettlebells', 'Barbell Plates'],
        imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=300&q=80',
      },
      {
        name: 'Yoga & Pilates',
        productTypes: ['Yoga Mats', 'Yoga Blocks', 'Foam Rollers'],
        imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=300&q=80',
      },
      {
        name: 'Home Gyms & Benches',
        productTypes: ['Adjustable Benches', 'Pull Up Bars', 'Resistance Bands'],
        imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=300&q=80',
      },
      {
        name: 'Support & Braces',
        productTypes: ['Knee Support', 'Wrist Wraps', 'Gym Belts', 'Ankle Braces'],
        imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&q=80',
      },
    ],
  },
  {
    id: 'health-nutrition',
    canonicalName: 'Health & Nutrition',
    label: 'Health & Nutrition',
    shortLabel: 'Health & Nutri',
    tagline: 'Whey Protein, Multivitamins, Ayurvedic Tonics, Health Drinks & Daily Boosters',
    iconName: 'HeartPulse',
    color: '#059669',
    activeBg: '#ECFDF5',
    gradient: 'from-emerald-950/95 via-teal-900/90 to-slate-900/95',
    heroImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&q=80',
    storeCategory: StoreCategory.OTHER,
    aliases: ['health', 'nutrition', 'supplements', 'wellness'],
    subcategories: [
      {
        name: 'Protein Supplements',
        productTypes: ['Whey Protein', 'Plant Protein', 'Mass Gainers', 'BCAA'],
        imageUrl: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=300&q=80',
      },
      {
        name: 'Vitamin Supplements',
        productTypes: ['Multivitamins', 'Vitamin C & D', 'Omega 3 Fish Oil', 'Biotin'],
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=80',
      },
      {
        name: 'Ayurvedic Supplements',
        productTypes: ['Ashwagandha', 'Chyawanprash', 'Shilajit', 'Herbal Juices'],
        imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&q=80',
      },
      {
        name: 'Health Drinks',
        productTypes: ['Kids Health Mix', 'Electrolytes', 'Herbal Teas'],
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&q=80',
      },
    ],
  },
  {
    id: 'books',
    canonicalName: 'Books',
    label: 'Books',
    shortLabel: 'Books',
    tagline: 'Entrance Exam Guides, Fiction Bestsellers, Academics & Children Literature',
    iconName: 'Book',
    color: '#4F46E5',
    activeBg: '#EEF2FF',
    gradient: 'from-indigo-950/95 via-violet-900/90 to-slate-900/95',
    heroImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=80',
    storeCategory: StoreCategory.BOOKS_STATIONERY,
    aliases: ['novels', 'academics', 'reading'],
    subcategories: [
      {
        name: 'Entrance Exams',
        productTypes: ['UPSC', 'JEE & NEET', 'Banking & SSC', 'GATE Preparation'],
        imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&q=80',
      },
      {
        name: 'Literature & Fiction',
        productTypes: ['Bestsellers', 'Thrillers & Mysteries', 'Romance', 'Historical'],
        imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=80',
      },
      {
        name: 'Academics',
        productTypes: ['NCERT Books', 'College Reference', 'Engineering & Medical'],
        imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&q=80',
      },
      {
        name: 'Non Fiction',
        productTypes: ['Self-Help & Motivation', 'Business & Investing', 'Biographies'],
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80',
      },
      {
        name: 'Young Readers',
        productTypes: ['Picture Books', 'Comics & Manga', 'Fairy Tales'],
        imageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&q=80',
      },
    ],
  },
  {
    id: 'stationery',
    canonicalName: 'Stationery',
    label: 'Stationery',
    shortLabel: 'Stationery',
    tagline: 'Fountain Pens, Premium Diaries, Desk Organizers, Art Supplies & Calculators',
    iconName: 'PenTool',
    color: '#7C3AED',
    activeBg: '#F5F3FF',
    gradient: 'from-purple-950/95 via-violet-900/90 to-slate-900/95',
    heroImage: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=1200&q=80',
    storeCategory: StoreCategory.BOOKS_STATIONERY,
    aliases: ['office-supplies', 'art-supplies'],
    subcategories: [
      {
        name: 'Pens & Writing',
        productTypes: ['Ball Pens', 'Gel Pens', 'Fountain Pens', 'Highlighters'],
        imageUrl: 'https://images.unsplash.com/photo-1585336261026-77577582c5b3?w=300&q=80',
      },
      {
        name: 'Diaries & Notebooks',
        productTypes: ['Spiral Notebooks', 'Executive Planners', 'Bullet Journals'],
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80',
      },
      {
        name: 'Desk Organizers',
        productTypes: ['Pen Stands', 'Document Trays', 'Desk Mats'],
        imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=300&q=80',
      },
      {
        name: 'Calculators & Math',
        productTypes: ['Scientific Calculators', 'Geometry Sets', 'Basic Calculators'],
        imageUrl: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=300&q=80',
      },
    ],
  },
  {
    id: 'auto-accessories',
    canonicalName: 'Auto Accessories',
    label: 'Auto Accessories',
    shortLabel: 'Auto Acc.',
    tagline: 'ISI Helmets, Car Audio, Mobile Mounts, Vehicle Polish & Engine Lubricants',
    iconName: 'Car',
    color: '#0891B2',
    activeBg: '#ECFEFF',
    gradient: 'from-cyan-950/95 via-sky-900/90 to-slate-900/95',
    heroImage: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=1200&q=80',
    storeCategory: StoreCategory.OTHER,
    aliases: ['auto', 'car', 'bike', 'automotive', '2wheelers', 'two_wheelers'],
    subcategories: [
      {
        name: 'Helmets & Riding Gears',
        productTypes: ['Full Face Helmets', 'Riding Gloves', 'Biker Jackets'],
        imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=300&q=80',
      },
      {
        name: 'Car Audio/Video',
        productTypes: ['Touchscreen Infotainment', 'Car Speakers', 'Dash Cams'],
        imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&q=80',
      },
      {
        name: 'Car Mobile Accessories',
        productTypes: ['Wireless Car Chargers', 'Magnetic Dashboard Mounts'],
        imageUrl: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=300&q=80',
      },
      {
        name: 'Car & Bike Care',
        productTypes: ['Ceramic Polish', 'Microfiber Cloths', 'Pressure Washers'],
        imageUrl: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=300&q=80',
      },
      {
        name: 'Vehicle Lubricants',
        productTypes: ['Engine Oils', 'Chain Lubes', 'Coolants'],
        imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=300&q=80',
      },
    ],
  },
  {
    id: 'industrial-tools',
    canonicalName: 'Industrial & Scientific Tools',
    label: 'Industrial & Scientific Tools',
    shortLabel: 'Tools & Lab',
    tagline: 'Digital Multimeters, Thermal Scanners, Protective Helmets & Precision Tools',
    iconName: 'Wrench',
    color: '#64748B',
    activeBg: '#F8FAFC',
    gradient: 'from-slate-950/95 via-gray-900/90 to-slate-900/95',
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
    storeCategory: StoreCategory.OTHER,
    aliases: ['industrial', 'tools', 'scientific', 'hardware'],
    subcategories: [
      {
        name: 'Industrial Measurement Devices',
        productTypes: ['Digital Multimeters', 'Laser Distance Meters', 'Vernier Calipers'],
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&q=80',
      },
      {
        name: 'Safety Products',
        productTypes: ['Industrial Helmets', 'Safety Shoes', 'High-Visibility Vests'],
        imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=300&q=80',
      },
      {
        name: 'Packaging & Shipping Products',
        productTypes: ['Bubble Wraps', 'Shipping Boxes', 'Packing Tapes'],
        imageUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300&q=80',
      },
      {
        name: 'Lab & Scientific Products',
        productTypes: ['Microscopes', 'Precision Balances', 'Lab Glassware'],
        imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=300&q=80',
      },
    ],
  },
  {
    id: 'medical-supplies',
    canonicalName: 'Medical Supplies',
    label: 'Medical Supplies',
    shortLabel: 'Medical',
    tagline: 'BP Monitors, Digital Thermometers, First Aid Kits & Medical Support',
    iconName: 'Stethoscope',
    color: '#E11D48',
    activeBg: '#FFF1F2',
    gradient: 'from-rose-950/95 via-red-900/90 to-slate-900/95',
    heroImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&q=80',
    storeCategory: StoreCategory.OTHER,
    aliases: ['medical', 'pharmacy', 'first-aid', 'health-devices'],
    subcategories: [
      {
        name: 'Diagnostic Monitors',
        productTypes: ['BP Monitors', 'Pulse Oximeters', 'Digital Thermometers'],
        imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=300&q=80',
      },
      {
        name: 'First Aid & Emergency',
        productTypes: ['First Aid Kits', 'Bandages & Antiseptics', 'Hot Water Bags'],
        imageUrl: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=300&q=80',
      },
      {
        name: 'Pregnancy & Wellness',
        productTypes: ['Pregnancy Test Kits', 'Fertility Monitors'],
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=80',
      },
    ],
  },
  {
    id: 'music',
    canonicalName: 'Music',
    label: 'Music',
    shortLabel: 'Music',
    tagline: 'Acoustic Guitars, Digital Keyboards, Microphones & Audio Gear',
    iconName: 'Music',
    color: '#8B5CF6',
    activeBg: '#F5F3FF',
    gradient: 'from-purple-950/95 via-indigo-900/90 to-slate-900/95',
    heroImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80',
    storeCategory: StoreCategory.OTHER,
    aliases: ['instruments', 'audio-gear'],
    subcategories: [
      {
        name: 'Musical Instruments',
        productTypes: ['Acoustic Guitars', 'Electric Guitars', 'Keyboards', 'Drums & Percussion'],
        imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80',
      },
      {
        name: 'Audio Production',
        productTypes: ['Studio Microphones', 'Audio Interfaces', 'Studio Monitors'],
        imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&q=80',
      },
    ],
  },
  {
    id: 'movies-tv',
    canonicalName: 'Movies & TV Shows',
    label: 'Movies & TV Shows',
    shortLabel: 'Movies & TV',
    tagline: 'Original Collector Discs, Merchandise, Posters & Home Entertainment',
    iconName: 'Film',
    color: '#C026D3',
    activeBg: '#FDF4FF',
    gradient: 'from-fuchsia-950/95 via-purple-900/90 to-slate-900/95',
    heroImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80',
    storeCategory: StoreCategory.OTHER,
    aliases: ['movies', 'tv-shows', 'entertainment', 'cinema'],
    subcategories: [
      {
        name: 'Entertainment Media',
        productTypes: ['Movies & TV Shows', 'Collector Editions', 'Movie Posters & Merch'],
        imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&q=80',
      },
    ],
  },
  {
    id: 'gaming',
    canonicalName: 'Gaming',
    label: 'Gaming',
    shortLabel: 'Gaming',
    tagline: 'PlayStation, Xbox, Gaming Consoles, PC Titles & Virtual Reality',
    iconName: 'Gamepad2',
    color: '#4338CA',
    activeBg: '#EEF2FF',
    gradient: 'from-indigo-950/95 via-blue-900/90 to-slate-900/95',
    heroImage: 'https://images.unsplash.com/photo-1612287232252-9596af42d9f3?w=1200&q=80',
    storeCategory: StoreCategory.ELECTRONICS,
    aliases: ['games', 'video-games', 'playstation', 'xbox'],
    subcategories: [
      {
        name: 'Gaming Consoles',
        productTypes: ['PS5', 'Xbox Series X', 'Nintendo Switch', 'Handheld Consoles'],
        imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=300&q=80',
      },
      {
        name: 'Gaming Accessories',
        productTypes: ['Wireless Controllers', 'VR Headsets', 'Gaming Headsets', 'Charging Docks'],
        imageUrl: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=300&q=80',
      },
      {
        name: 'Video Game Titles',
        productTypes: ['PS4/PS5 Games', 'Xbox Games', 'PC Games'],
        imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&q=80',
      },
    ],
  },
];

// Visible on the horizontal strip (top 9 primary categories)
export const STRIP_VISIBLE_CATEGORIES = CANONICAL_CATEGORIES.slice(0, 9);

// Remaining categories placed in the "More ▾" dropdown
export const STRIP_OVERFLOW_CATEGORIES = CANONICAL_CATEGORIES.slice(9);

export function getCanonicalCategoryBySlug(slug: string): CanonicalCategory | undefined {
  if (!slug) return undefined;
  const clean = slug.toLowerCase().trim();

  // 1. Direct ID match
  const direct = CANONICAL_CATEGORIES.find((c) => c.id.toLowerCase() === clean);
  if (direct) return direct;

  // 2. Canonical name match (e.g. "Electronics", "Baby & Kids", "Men's")
  const nameMatch = CANONICAL_CATEGORIES.find(
    (c) =>
      c.canonicalName.toLowerCase() === clean ||
      c.canonicalName.toLowerCase().replace(/[^a-z0-9]/g, '') === clean.replace(/[^a-z0-9]/g, '')
  );
  if (nameMatch) return nameMatch;

  // 3. Alias match
  const aliasMatch = CANONICAL_CATEGORIES.find((c) =>
    c.aliases.some((a) => a.toLowerCase() === clean || a.replace(/[^a-z0-9]/g, '') === clean.replace(/[^a-z0-9]/g, ''))
  );
  if (aliasMatch) return aliasMatch;

  return undefined;
}


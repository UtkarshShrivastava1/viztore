'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { fetchStoreBySlug } from '@/lib/api/stores';
import { useStoreProducts } from '@/hooks/useStoreProducts';
import { StoreHeroCard } from '@/features/stores/StoreHeroCard';
import {
  Store,
  Search,
  ChevronRight,
  X,
  SlidersHorizontal,
  Mic,
  ChevronDown,
} from 'lucide-react';
import { StoreCategory, StoreApprovalStatus, type IStore, type IProduct } from '@repo/shared-types';

interface StoreStorefrontClientProps {
  slug: string;
}

// Curated mock products matching Mob 3.1 and Web 3.1 mockups
const MOCK_STOREFRONT_PRODUCTS: IProduct[] = [
  {
    _id: 'prd-graphic-tee',
    name: 'Men Graphic Print T-shirt',
    slug: 'men-graphic-print-t-shirt',
    storeId: 'str-fashion-hub',
    storeName: 'Fashion Hub',
    category: StoreCategory.FASHION,
    brand: 'Puma',
    basePrice: 399,
    baseMrp: 599,
    maxDiscount: 33,
    isActive: true,
    variants: [
      {
        sku: 'TEE-GRN-01',
        title: 'Olive Green / M',
        price: 399,
        mrp: 599,
        stock: 50,
        images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600'],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as IProduct,
  {
    _id: 'prd-striped-tee',
    name: 'Men Striped Round Neck T-shirt',
    slug: 'men-striped-round-neck-t-shirt',
    storeId: 'str-fashion-hub',
    storeName: 'Fashion Hub',
    category: StoreCategory.FASHION,
    brand: 'Nike',
    basePrice: 449,
    baseMrp: 699,
    maxDiscount: 36,
    isActive: true,
    variants: [
      {
        sku: 'TEE-STP-02',
        title: 'Striped White / L',
        price: 449,
        mrp: 699,
        stock: 40,
        images: ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=600'],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as IProduct,
  {
    _id: 'prd-casual-shirt',
    name: 'Men Casual Shirt',
    slug: 'men-casual-shirt',
    storeId: 'str-fashion-hub',
    storeName: 'Fashion Hub',
    category: StoreCategory.FASHION,
    brand: 'Puma',
    basePrice: 599,
    baseMrp: 799,
    maxDiscount: 25,
    isActive: true,
    variants: [
      {
        sku: 'SHRT-BLU-03',
        title: 'Sky Blue / M',
        price: 599,
        mrp: 799,
        stock: 35,
        images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600'],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as IProduct,
  {
    _id: 'prd-men-hoodie',
    name: 'Men Hoodie',
    slug: 'men-hoodie',
    storeId: 'str-fashion-hub',
    storeName: 'Fashion Hub',
    category: StoreCategory.FASHION,
    brand: 'Adidas',
    basePrice: 899,
    baseMrp: 1299,
    maxDiscount: 31,
    isActive: true,
    variants: [
      {
        sku: 'HOD-OLV-04',
        title: 'Olive Green / L',
        price: 899,
        mrp: 1299,
        stock: 25,
        images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=600'],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as IProduct,
  {
    _id: 'prd-polo-tee',
    name: 'Men Polo T-shirt',
    slug: 'men-polo-t-shirt',
    storeId: 'str-fashion-hub',
    storeName: 'Fashion Hub',
    category: StoreCategory.FASHION,
    brand: 'Puma',
    basePrice: 349,
    baseMrp: 499,
    maxDiscount: 30,
    isActive: true,
    variants: [
      {
        sku: 'POLO-NVY-05',
        title: 'Navy Blue / M',
        price: 349,
        mrp: 499,
        stock: 60,
        images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=600'],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as IProduct,
  {
    _id: 'prd-white-sneakers',
    name: 'Casual White Sneakers',
    slug: 'casual-white-sneakers',
    storeId: 'str-fashion-hub',
    storeName: 'Fashion Hub',
    category: StoreCategory.FOOTWEAR,
    brand: 'Nike',
    basePrice: 1299,
    baseMrp: 1999,
    maxDiscount: 35,
    isActive: true,
    variants: [
      {
        sku: 'SNK-WHT-06',
        title: 'White / 9 UK',
        price: 1299,
        mrp: 1999,
        stock: 20,
        images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600'],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as IProduct,
  {
    _id: 'prd-smart-watch',
    name: 'Smart Fitness Watch',
    slug: 'smart-fitness-watch',
    storeId: 'str-fashion-hub',
    storeName: 'Fashion Hub',
    category: StoreCategory.ELECTRONICS,
    brand: 'Adidas',
    basePrice: 1799,
    baseMrp: 2999,
    maxDiscount: 40,
    isActive: true,
    variants: [
      {
        sku: 'WTC-BLK-07',
        title: 'Midnight Black',
        price: 1799,
        mrp: 2999,
        stock: 15,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600'],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as IProduct,
  {
    _id: 'prd-men-backpack',
    name: 'Men Backpack',
    slug: 'men-backpack',
    storeId: 'str-fashion-hub',
    storeName: 'Fashion Hub',
    category: StoreCategory.FASHION,
    brand: 'Nike',
    basePrice: 1199,
    baseMrp: 1799,
    maxDiscount: 33,
    isActive: true,
    variants: [
      {
        sku: 'BCK-BLK-08',
        title: 'Matte Black 30L',
        price: 1199,
        mrp: 1799,
        stock: 30,
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600'],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as IProduct,
];

// Fallback store metadata generator if API returns empty/error
function getFallbackStore(slug: string): IStore {
  const formattedTitle = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    _id: `str-${slug}`,
    ownerId: 'owner-default',
    name: formattedTitle || 'Fashion Hub',
    slug,
    category: StoreCategory.FASHION,
    description: 'Trendsetting fashion for every you. Explore a wide range of clothing, accessories, footwear and more.',
    bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200',
    logoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=200',
    rating: 4.5,
    reviewCount: 1200,
    isActive: true,
    approvalStatus: StoreApprovalStatus.APPROVED,
    distanceKm: 0.2,
    deliveryRadiusKm: 4,
    address: {
      street: 'Boring Road',
      city: 'Patna',
      state: 'Bihar',
      pincode: '800001',
    },
    location: { type: 'Point', coordinates: [85.1234, 25.6123] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as IStore;
}

export function StoreStorefrontClient({ slug }: StoreStorefrontClientProps) {
  const [activeTab, setActiveTab] = useState('All Products');
  const [inStoreSearch, setInStoreSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [brandSearch, setBrandSearch] = useState('');
  const [priceLimit, setPriceLimit] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [showMobileFilterModal, setShowMobileFilterModal] = useState(false);

  // Fetch store by slug
  const { data: serverStore, isLoading: storeLoading } = useQuery({
    queryKey: ['store', slug],
    queryFn: () => fetchStoreBySlug(slug),
    enabled: !!slug,
  });

  const store = serverStore || getFallbackStore(slug);

  // Fetch store products
  const { data: productsData, isLoading: _productsLoading } = useStoreProducts(
    store?._id || '',
    { limit: 50 },
  );

  const rawProducts = useMemo(() => {
    if (productsData?.products && productsData.products.length > 0) {
      return productsData.products;
    }
    return MOCK_STOREFRONT_PRODUCTS;
  }, [productsData]);

  // Dynamic category facets
  const categoryFacets = useMemo(() => {
    const defaultFacets = [
      { name: "Men's Fashion", count: 120 },
      { name: "Women's Fashion", count: 95 },
      { name: "Kids Wear", count: 35 },
      { name: "Footwear", count: 28 },
      { name: "Bags & Backpacks", count: 22 },
      { name: "Accessories", count: 40 },
      { name: "Sports Wear", count: 18 },
      { name: "Ethnic Wear", count: 26 },
      { name: "Winter Wear", count: 15 },
    ];

    if (!productsData?.facets?.categories || productsData.facets.categories.length === 0) {
      return defaultFacets;
    }

    const map = new Map<string, number>();
    productsData.facets.categories.forEach((cat) => {
      if (cat.value) {
        const formatted = String(cat.value).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        map.set(formatted, (map.get(formatted) || 0) + cat.count);
      }
    });

    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [productsData]);

  // Dynamic brand facets
  const brandFacets = useMemo(() => {
    const defaultBrands = [
      { name: 'Puma', count: 24 },
      { name: 'Nike', count: 18 },
      { name: 'Adidas', count: 21 },
    ];

    if (!productsData?.facets?.brands || productsData.facets.brands.length === 0) {
      return defaultBrands;
    }

    return productsData.facets.brands.map((b) => ({
      name: b.value,
      count: b.count,
    }));
  }, [productsData]);

  // Price range bounds
  const { minPrice, maxPrice } = useMemo(() => {
    return { minPrice: 0, maxPrice: 5000 };
  }, []);

  const currentPriceLimit = priceLimit ?? maxPrice;

  // Filtered & sorted product list
  const filteredProducts = useMemo(() => {
    let result = [...rawProducts];

    // 1. In-store scoped search
    if (inStoreSearch.trim()) {
      const q = inStoreSearch.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.category && String(p.category).toLowerCase().includes(q))
      );
    }

    // 2. Category selection
    if (selectedCategory) {
      result = result.filter((p) => {
        const cat = String(p.category || '').toLowerCase();
        return cat.includes(selectedCategory.toLowerCase()) || selectedCategory.toLowerCase().includes(cat);
      });
    }

    // 3. Brands selection
    if (selectedBrands.length > 0) {
      result = result.filter((p) => p.brand && selectedBrands.includes(p.brand.trim()));
    }

    // 4. Price limit
    if (priceLimit !== null) {
      result = result.filter((p) => (p.basePrice || 0) <= priceLimit);
    }

    // 5. Active Tab or Sort
    if (activeTab === 'New Arrivals') {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else if (activeTab === 'Best Deals') {
      result.sort((a, b) => (b.maxDiscount || 0) - (a.maxDiscount || 0));
    } else if (activeTab === 'Top Picks') {
      result.sort((a, b) => (b.basePrice || 0) - (a.basePrice || 0));
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.basePrice - a.basePrice);
    }

    return result;
  }, [rawProducts, inStoreSearch, selectedCategory, selectedBrands, priceLimit, activeTab, sortBy]);

  // Internal shelf subsets
  const newArrivals = useMemo(() => {
    return rawProducts.slice(0, 4);
  }, [rawProducts]);

  const bestDeals = useMemo(() => {
    return rawProducts.slice(4, 8).length > 0 ? rawProducts.slice(4, 8) : rawProducts.slice(0, 4);
  }, [rawProducts]);

  const topPicks = useMemo(() => {
    return [rawProducts[3], rawProducts[7] || rawProducts[0]].filter(Boolean);
  }, [rawProducts]);

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedBrands([]);
    setPriceLimit(null);
    setBrandSearch('');
    setInStoreSearch('');
  };

  const activeFilterCount =
    (selectedCategory ? 1 : 0) + selectedBrands.length + (priceLimit !== null ? 1 : 0) + (inStoreSearch ? 1 : 0);

  if (storeLoading) {
    return (
      <div className="min-h-screen bg-transparent pt-8">
        <main className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-6 space-y-6">
          <div className="h-64 rounded-3xl bg-surface-100 animate-pulse" />
          <div className="flex gap-6">
            <div className="hidden lg:block w-[260px] h-[500px] rounded-2xl bg-surface-100 animate-pulse" />
            <div className="flex-1">
              <ProductGridSkeleton count={8} />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-3 pb-20 lg:pb-12">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">

        {/* -------------------------------------------------------------
            MOBILE SECTION (Mob 3.1: Dedicated Storefront)
            ------------------------------------------------------------- */}
        <div className="block lg:hidden space-y-4">
          {/* In-Store Scoped Search Bar (Mob 3.1) */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              value={inStoreSearch}
              onChange={(e) => setInStoreSearch(e.target.value)}
              placeholder={`Search for products in ${store.name}...`}
              className="w-full h-11 pl-10 pr-10 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-[13px] font-medium text-[#061842] dark:text-white placeholder:text-surface-400 focus:outline-none focus:border-[#1668F6] shadow-2xs"
            />
            <button
              type="button"
              aria-label="Voice search"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-[#1668F6]"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          {/* Store Hero Showcase Card (Mob 3.1) */}
          <StoreHeroCard store={store} />

          {/* Section Header with Filter and Sort */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <h2 className="text-[17px] font-extrabold text-[#061842] dark:text-white leading-tight">
                All Products
              </h2>
              <span className="text-xs text-surface-500 font-medium">
                {filteredProducts.length} Items
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowMobileFilterModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-surface-200 bg-white text-xs font-bold text-[#061842] shadow-2xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filter</span>
              </button>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'popular' | 'price-asc' | 'price-desc')}
                  aria-label="Sort products"
                  className="h-8 px-2.5 pr-6 rounded-xl border border-surface-200 bg-white text-xs font-bold text-[#061842] appearance-none cursor-pointer shadow-2xs focus:outline-none"
                >
                  <option value="popular">Popular</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <ChevronDown className="w-3 h-3 text-surface-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Shelves View (If no active search or filter) */}
          {!inStoreSearch && !selectedCategory && selectedBrands.length === 0 ? (
            <div className="space-y-6 pt-1">
              {/* Shelf 1: New Arrival */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-extrabold text-[#061842] dark:text-white">
                    New Arrival
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('New Arrivals')}
                    className="text-xs font-bold text-[#1668F6] flex items-center gap-0.5 hover:underline"
                  >
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {newArrivals.slice(0, 2).map((product) => (
                    <ProductCard key={product._id} product={product} badge="NEW" />
                  ))}
                </div>
              </section>

              {/* Shelf 2: Best Deals */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-extrabold text-[#061842] dark:text-white">
                    Best Deals
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('Best Deals')}
                    className="text-xs font-bold text-[#1668F6] flex items-center gap-0.5 hover:underline"
                  >
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {bestDeals.slice(0, 2).map((product) => (
                    <ProductCard key={product._id} product={product} badge="DISCOUNT" />
                  ))}
                </div>
              </section>

              {/* Shelf 3: Top Picks For You */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-extrabold text-[#061842] dark:text-white">
                    Top Picks For You
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('Top Picks')}
                    className="text-xs font-bold text-[#1668F6] flex items-center gap-0.5 hover:underline"
                  >
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {topPicks.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </section>
            </div>
          ) : (
            /* Filtered 2-Column Grid */
            <div className="grid grid-cols-2 gap-3 pt-2">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* -------------------------------------------------------------
            DESKTOP SECTION (Web 3.1: Dedicated Storefront Hub)
            ------------------------------------------------------------- */}
        <div className="hidden lg:block space-y-4">
          {/* Breadcrumbs (Web 3.1) */}
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-surface-500 mb-2">
            <Link href="/" className="hover:text-[#1668F6] transition-colors">Home</Link>
            <span className="text-surface-300">›</span>
            <Link href="/stores" className="hover:text-[#1668F6] transition-colors">Stores Near You</Link>
            <span className="text-surface-300">›</span>
            <span className="text-[#061842] font-bold">{store.name}</span>
          </div>

          {/* Desktop Store Hero Banner (Web 3.1) */}
          <StoreHeroCard store={store} />

          {/* Split 2-Column Storefront Layout (Web 3.1) */}
          <div className="flex items-start gap-8 pt-2">
            {/* Left Filter Sidebar (260px) */}
            <aside className="w-[260px] shrink-0 sticky top-24 space-y-6">
              {/* Shop by Category */}
              <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-extrabold text-[#061842] dark:text-white text-[15px]">
                    Shop by Category
                  </h4>
                  {selectedCategory && (
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(null)}
                      className="text-xs font-bold text-[#1668F6] hover:underline"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="space-y-1 max-h-[340px] overflow-y-auto pr-1">
                  {categoryFacets.map((cat, i) => {
                    const isSelected = selectedCategory?.toLowerCase() === cat.name.toLowerCase();
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedCategory(isSelected ? null : cat.name)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                          isSelected
                            ? 'bg-blue-50 text-[#1668F6] font-extrabold'
                            : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 font-medium'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-surface-400 font-normal">({cat.count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filter: Price Range & Brand */}
              <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-5 shadow-2xs space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-[#061842] dark:text-white text-[15px]">
                    Filter
                  </h4>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="text-xs font-bold text-[#1668F6] hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Price Range Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <span className="font-bold text-[#061842] dark:text-white">Price Range</span>
                    <span className="font-bold text-[#1668F6]">₹0 - ₹{currentPriceLimit.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={currentPriceLimit}
                    onChange={(e) => setPriceLimit(Number(e.target.value))}
                    className="w-full accent-[#1668F6] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-surface-400 mt-1">
                    <span>₹0</span>
                    <span>₹5,000</span>
                  </div>
                </div>

                {/* Brand Search & Checkboxes */}
                <div>
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <span className="font-bold text-[#061842] dark:text-white">Brand</span>
                  </div>

                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-400" />
                    <input
                      type="text"
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      placeholder="Search brands..."
                      className="w-full h-8 pl-8 pr-3 rounded-lg border border-surface-200 text-xs text-[#061842] focus:outline-none focus:border-[#1668F6]"
                    />
                  </div>

                  <div className="space-y-2">
                    {brandFacets
                      .filter((b) => b.name.toLowerCase().includes(brandSearch.toLowerCase().trim()))
                      .map((b) => {
                        const checked = selectedBrands.includes(b.name);
                        return (
                          <label
                            key={b.name}
                            className="flex items-center justify-between text-xs cursor-pointer hover:text-[#1668F6]"
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => {
                                  if (checked) {
                                    setSelectedBrands(selectedBrands.filter((br) => br !== b.name));
                                  } else {
                                    setSelectedBrands([...selectedBrands, b.name]);
                                  }
                                }}
                                className="w-4 h-4 rounded border-surface-300 text-[#1668F6] focus:ring-[#1668F6]"
                              />
                              <span className={checked ? 'font-bold text-[#1668F6]' : 'text-surface-700 font-medium'}>
                                {b.name}
                              </span>
                            </div>
                            <span className="text-surface-400">({b.count})</span>
                          </label>
                        );
                      })}
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Content Area (Web 3.1) */}
            <div className="flex-1 min-w-0 space-y-6">
              {/* In-Store Search & Category Tabs Toolbar (Web 3.1) */}
              <div className="flex items-center justify-between border-b border-surface-200 pb-3 gap-4">
                {/* Sub-Navigation Tabs */}
                <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
                  {['All Products', 'New Arrivals', 'Best Deals', 'Top Picks'].map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`text-sm font-extrabold pb-2 border-b-2 transition-all whitespace-nowrap ${
                          isActive
                            ? 'border-[#1668F6] text-[#1668F6]'
                            : 'border-transparent text-surface-500 hover:text-[#061842]'
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>

                {/* Right: In-Store Search + Sort Dropdown */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="relative w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-400" />
                    <input
                      type="text"
                      value={inStoreSearch}
                      onChange={(e) => setInStoreSearch(e.target.value)}
                      placeholder="Search store..."
                      className="w-full h-8 pl-8 pr-3 rounded-lg border border-surface-200 text-xs focus:outline-none focus:border-[#1668F6]"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'popular' | 'price-asc' | 'price-desc')}
                      aria-label="Sort by"
                      className="h-8 px-3 pr-7 rounded-lg border border-surface-200 bg-white text-xs font-bold text-[#061842] appearance-none cursor-pointer focus:outline-none"
                    >
                      <option value="popular">Sort by: Popular</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-surface-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Active Filter Chips */}
              {activeFilterCount > 0 && (
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-bold text-surface-400">Active Filters:</span>
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-[#1668F6] font-semibold border border-blue-200">
                      Category: {selectedCategory}
                      <button type="button" onClick={() => setSelectedCategory(null)}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {selectedBrands.map((b) => (
                    <span key={b} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-[#1668F6] font-semibold border border-blue-200">
                      Brand: {b}
                      <button type="button" onClick={() => setSelectedBrands(selectedBrands.filter((br) => br !== b))}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                  {priceLimit !== null && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-[#1668F6] font-semibold border border-blue-200">
                      ≤ ₹{priceLimit.toLocaleString('en-IN')}
                      <button type="button" onClick={() => setPriceLimit(null)}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {inStoreSearch && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-[#1668F6] font-semibold border border-blue-200">
                      Search: &quot;{inStoreSearch}&quot;
                      <button type="button" onClick={() => setInStoreSearch('')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  <button type="button" onClick={clearAllFilters} className="text-[#1668F6] font-bold hover:underline ml-1">
                    Clear all
                  </button>
                </div>
              )}

              {/* Product Shelves (Web 3.1) */}
              {!inStoreSearch && !selectedCategory && selectedBrands.length === 0 && activeTab === 'All Products' ? (
                <div className="space-y-10">
                  {/* Shelf 1: New Arrivals (4-column grid with Add to Cart) */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-extrabold text-[#061842] dark:text-white">
                        New Arrivals
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('New Arrivals')}
                        className="text-xs font-bold text-[#1668F6] flex items-center gap-1 hover:underline"
                      >
                        View All <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      {newArrivals.map((product) => (
                        <ProductCard
                          key={product._id}
                          product={product}
                          badge="NEW"
                          showFullAddToCart={true}
                        />
                      ))}
                    </div>
                  </section>

                  {/* Shelf 2: Best Deals (4-column grid with Add to Cart) */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-extrabold text-[#061842] dark:text-white">
                        Best Deals
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('Best Deals')}
                        className="text-xs font-bold text-[#1668F6] flex items-center gap-1 hover:underline"
                      >
                        View All <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      {bestDeals.map((product) => (
                        <ProductCard
                          key={product._id}
                          product={product}
                          badge="DISCOUNT"
                          showFullAddToCart={true}
                        />
                      ))}
                    </div>
                  </section>
                </div>
              ) : (
                /* Filtered 4-Column Grid */
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-extrabold text-[#061842] dark:text-white">
                      {activeTab} ({filteredProducts.length})
                    </h3>
                  </div>
                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-4 gap-4">
                      {filteredProducts.map((product) => (
                        <ProductCard
                          key={product._id}
                          product={product}
                          showFullAddToCart={true}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="py-16 text-center bg-white border border-surface-200 rounded-2xl shadow-2xs">
                      <Store className="w-12 h-12 text-surface-400 mx-auto mb-3" />
                      <p className="text-[#061842] font-extrabold text-base">No products match your filters</p>
                      <button
                        type="button"
                        onClick={clearAllFilters}
                        className="mt-3 px-4 py-2 rounded-xl bg-blue-50 text-[#1668F6] text-xs font-bold hover:bg-blue-100"
                      >
                        Reset filters
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filter Modal (Bottom Sheet / Drawer) */}
      {showMobileFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex flex-col justify-end lg:hidden">
          <div className="bg-white dark:bg-surface-900 rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto space-y-5 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between border-b border-surface-100 pb-3">
              <h3 className="font-extrabold text-base text-[#061842] dark:text-white">Filters</h3>
              <button
                type="button"
                onClick={() => setShowMobileFilterModal(false)}
                className="p-1 rounded-full hover:bg-surface-100"
              >
                <X className="w-5 h-5 text-surface-500" />
              </button>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-bold text-xs text-[#061842] mb-2">Category</h4>
              <div className="flex flex-wrap gap-2">
                {categoryFacets.map((cat) => {
                  const isSel = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setSelectedCategory(isSel ? null : cat.name)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                        isSel
                          ? 'bg-[#1668F6] text-white border-[#1668F6]'
                          : 'bg-white text-surface-700 border-surface-200'
                      }`}
                    >
                      {cat.name} ({cat.count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Price</span>
                <span className="text-[#1668F6]">Up to ₹{currentPriceLimit.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={currentPriceLimit}
                onChange={(e) => setPriceLimit(Number(e.target.value))}
                className="w-full accent-[#1668F6]"
              />
            </div>

            {/* Brands */}
            <div>
              <h4 className="font-bold text-xs text-[#061842] mb-2">Brands</h4>
              <div className="flex flex-wrap gap-2">
                {brandFacets.map((b) => {
                  const isSel = selectedBrands.includes(b.name);
                  return (
                    <button
                      key={b.name}
                      type="button"
                      onClick={() => {
                        if (isSel) {
                          setSelectedBrands(selectedBrands.filter((br) => br !== b.name));
                        } else {
                          setSelectedBrands([...selectedBrands, b.name]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                        isSel
                          ? 'bg-[#1668F6] text-white border-[#1668F6]'
                          : 'bg-white text-surface-700 border-surface-200'
                      }`}
                    >
                      {b.name} ({b.count})
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex-1 py-2.5 rounded-xl border border-surface-200 text-xs font-bold text-surface-600 hover:bg-surface-50"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setShowMobileFilterModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#1668F6] text-white text-xs font-bold hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

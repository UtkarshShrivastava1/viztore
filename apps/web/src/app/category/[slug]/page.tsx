import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbJsonLd } from '@/components/seo';
import {
  ShieldCheck,
  RotateCcw,
  Award,
  ChevronRight,
  ArrowRight,
  Store as StoreIcon,
  ShoppingBag,
  Sparkles,
  MapPin,
  Clock,
  Star,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { branding } from '@repo/shared-types';

// Curated Fashion components for fashion vertical
import { CategoryHeroBanner } from '@/features/catalog/CategoryHeroBanner';
import { ShopByCategoryGrid } from '@/features/catalog/ShopByCategoryGrid';
import { ShopForLovedOnes } from '@/features/catalog/ShopForLovedOnes';
import { FashionStores } from '@/features/catalog/FashionStores';

interface SubcategoryDef {
  id: string;
  name: string;
  imageUrl: string;
  itemCount?: string;
}

interface CategoryVerticalConfig {
  title: string;
  tagline: string;
  heroImage: string;
  heroBgGradient: string;
  subcategories: SubcategoryDef[];
  popularStores: Array<{
    name: string;
    slug: string;
    locality: string;
    distance: string;
    eta: string;
    rating: string;
    badge: string;
    imageUrl: string;
  }>;
}

const CATEGORY_PROFILES: Record<string, CategoryVerticalConfig> = {
  mobiles: {
    title: 'Mobiles & Tablets',
    tagline: 'Latest 5G Smartphones, Tablets, Smartwatches & Gear',
    heroImage: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80',
    heroBgGradient: 'from-blue-900/90 via-indigo-900/80 to-slate-900/90',
    subcategories: [
      { id: 'smartphones', name: 'Smartphones', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80', itemCount: '140+ Models' },
      { id: 'feature-phones', name: 'Feature Phones', imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=300&q=80', itemCount: '45+ Models' },
      { id: 'tablets', name: 'Tablets & iPads', imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&q=80', itemCount: '30+ Models' },
      { id: 'smartwatches', name: 'Smart Watches', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80', itemCount: '80+ Models' },
      { id: 'earphones', name: 'TWS & Earphones', imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&q=80', itemCount: '110+ Models' },
      { id: 'cases-covers', name: 'Cases & Covers', imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300&q=80', itemCount: '250+ Designs' },
      { id: 'chargers', name: 'Fast Chargers & Cables', imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&q=80', itemCount: '65+ Items' },
      { id: 'power-banks', name: 'Power Banks', imageUrl: 'https://images.unsplash.com/photo-1609592807664-4bfca531db52?w=300&q=80', itemCount: '40+ Items' },
    ],
    popularStores: [
      { name: 'City Mobile Hub', slug: 'city-mobile-hub', locality: 'Civic Centre, Bhilai', distance: '1.2 km', eta: '20-30 min', rating: '4.8', badge: 'Authorized Reseller', imageUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300&q=80' },
      { name: 'Sahu Electronics & Mobiles', slug: 'sahu-electronics', locality: 'Sector 6, Bhilai', distance: '1.8 km', eta: '25-35 min', rating: '4.7', badge: 'Top Rated', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80' },
    ],
  },
  electronics: {
    title: 'Consumer Electronics',
    tagline: 'Laptops, Monitors, Audio, Gaming & Smart Computing',
    heroImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
    heroBgGradient: 'from-emerald-900/90 via-teal-900/80 to-slate-900/90',
    subcategories: [
      { id: 'laptops', name: 'Laptops & MacBooks', imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=80', itemCount: '95+ Models' },
      { id: 'monitors', name: 'LED Monitors', imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&q=80', itemCount: '40+ Models' },
      { id: 'headphones', name: 'Gaming Headphones', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80', itemCount: '70+ Models' },
      { id: 'bluetooth-speakers', name: 'Bluetooth Speakers', imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&q=80', itemCount: '55+ Models' },
      { id: 'gaming-accessories', name: 'Keyboards & Mice', imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=80', itemCount: '120+ Items' },
      { id: 'storage', name: 'Pen Drives & SSDs', imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300&q=80', itemCount: '60+ Items' },
      { id: 'smart-home', name: 'Smart Security & Alexa', imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=300&q=80', itemCount: '35+ Items' },
      { id: 'printers', name: 'Printers & Inks', imageUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=300&q=80', itemCount: '25+ Items' },
    ],
    popularStores: [
      { name: 'Apex Digital Systems', slug: 'apex-digital', locality: 'Nehru Nagar, Bhilai', distance: '2.1 km', eta: '30-45 min', rating: '4.9', badge: 'Certified Dealer', imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=80' },
      { name: 'National Computer Care', slug: 'national-computer-care', locality: 'Power House, Bhilai', distance: '2.8 km', eta: '35-50 min', rating: '4.6', badge: 'Best Prices', imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&q=80' },
    ],
  },
  beauty: {
    title: 'Beauty & Personal Care',
    tagline: 'Skincare, Haircare, Cosmetics, Grooming & Fragrances',
    heroImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    heroBgGradient: 'from-pink-900/90 via-rose-900/80 to-slate-900/90',
    subcategories: [
      { id: 'skincare', name: 'Skincare & Serums', imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80', itemCount: '210+ Items' },
      { id: 'haircare', name: 'Hair Care & Oils', imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&q=80', itemCount: '180+ Items' },
      { id: 'makeup', name: 'Face & Eye Makeup', imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&q=80', itemCount: '320+ Items' },
      { id: 'fragrances', name: 'Perfumes & Deos', imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=300&q=80', itemCount: '90+ Scents' },
      { id: 'mens-grooming', name: "Men's Shaving & Beard", imageUrl: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=300&q=80', itemCount: '85+ Items' },
      { id: 'bath-body', name: 'Bath, Body & Soaps', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=80', itemCount: '140+ Items' },
    ],
    popularStores: [
      { name: 'Glamour Cosmetics', slug: 'glamour-cosmetics', locality: 'Civic Centre, Bhilai', distance: '1.4 km', eta: '15-25 min', rating: '4.8', badge: '100% Genuine', imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&q=80' },
      { name: 'Wellness & Herbal Store', slug: 'wellness-herbal', locality: 'Sector 4, Bhilai', distance: '2.0 km', eta: '20-30 min', rating: '4.7', badge: 'Organic Certified', imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80' },
    ],
  },
  home_living: {
    title: 'Home & Living',
    tagline: 'Modern Decor, Kitchenware, Bedding & Storage',
    heroImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    heroBgGradient: 'from-amber-900/90 via-orange-900/80 to-slate-900/90',
    subcategories: [
      { id: 'cookware', name: 'Cookware & Pots', imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=300&q=80', itemCount: '150+ Items' },
      { id: 'bedding', name: 'Bedsheets & Blankets', imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&q=80', itemCount: '120+ Items' },
      { id: 'home-decor', name: 'Wall Art & Clocks', imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300&q=80', itemCount: '190+ Items' },
      { id: 'storage', name: 'Storage Bins & Racks', imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=300&q=80', itemCount: '80+ Items' },
      { id: 'curtains', name: 'Curtains & Drapes', imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&q=80', itemCount: '70+ Styles' },
      { id: 'dining', name: 'Dinnerware & Mugs', imageUrl: 'https://images.unsplash.com/photo-1614735241165-6756e1df61ab?w=300&q=80', itemCount: '110+ Items' },
    ],
    popularStores: [
      { name: 'Royal Home Essentials', slug: 'royal-home-essentials', locality: 'Supela Market, Bhilai', distance: '1.9 km', eta: '25-35 min', rating: '4.7', badge: 'Handcrafted', imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80' },
    ],
  },
  grocery: {
    title: 'Daily Grocery & Staples',
    tagline: 'Farm-Fresh Produce, Atta, Dals, Spices & Household Essentials',
    heroImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
    heroBgGradient: 'from-green-900/90 via-emerald-900/80 to-slate-900/90',
    subcategories: [
      { id: 'atta-rice', name: 'Atta, Rice & Grains', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80', itemCount: '60+ Options' },
      { id: 'dals-pulses', name: 'Dals & Pulses', imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80', itemCount: '45+ Varieties' },
      { id: 'edible-oils', name: 'Oils & Ghee', imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&q=80', itemCount: '40+ Brands' },
      { id: 'spices', name: 'Spices & Masalas', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&q=80', itemCount: '80+ Spices' },
      { id: 'dairy', name: 'Milk, Curd & Paneer', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80', itemCount: 'Fresh Daily' },
      { id: 'snacks', name: 'Snacks & Namkeen', imageUrl: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=300&q=80', itemCount: '120+ Items' },
    ],
    popularStores: [
      { name: 'Kisan Super Bazar', slug: 'kisan-super-bazar', locality: 'Sector 7, Bhilai', distance: '0.8 km', eta: '10-20 min', rating: '4.9', badge: 'Hyperlocal Express', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&q=80' },
    ],
  },
};

// Aliases for related slugs
CATEGORY_PROFILES['home'] = CATEGORY_PROFILES['home_living'];
CATEGORY_PROFILES['food_health'] = CATEGORY_PROFILES['grocery'];
CATEGORY_PROFILES['appliances'] = CATEGORY_PROFILES['electronics'];
CATEGORY_PROFILES['auto'] = {
  title: 'Auto Accessories & Gear',
  tagline: 'Helmets, Car Polish, Spares, Chargers & Riding Gear',
  heroImage: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=800&q=80',
  heroBgGradient: 'from-cyan-900/90 via-sky-900/80 to-slate-900/90',
  subcategories: [
    { id: 'helmets', name: 'Helmets & Visors', imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=300&q=80', itemCount: '50+ Models' },
    { id: 'car-cleaning', name: 'Car Wash & Wax', imageUrl: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=300&q=80', itemCount: '40+ Items' },
    { id: 'mobile-holders', name: 'Phone Mounts & Chargers', imageUrl: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=300&q=80', itemCount: '35+ Items' },
    { id: 'riding-jackets', name: 'Riding Gloves & Jackets', imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=300&q=80', itemCount: '30+ Styles' },
  ],
  popularStores: [
    { name: 'Speed Auto Spares', slug: 'speed-auto-spares', locality: 'Power House, Bhilai', distance: '2.4 km', eta: '30-40 min', rating: '4.6', badge: 'Genuine Spares', imageUrl: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=300&q=80' },
  ],
};
CATEGORY_PROFILES['sports'] = {
  title: 'Sports & Active Fitness',
  tagline: 'Gym Equipment, Yoga Mats, Cricket, Badminton & Sportswear',
  heroImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
  heroBgGradient: 'from-orange-900/90 via-amber-900/80 to-slate-900/90',
  subcategories: [
    { id: 'cricket', name: 'Cricket Bats & Gear', imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=300&q=80', itemCount: '70+ Items' },
    { id: 'badminton', name: 'Badminton Rackets & Shuttles', imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=300&q=80', itemCount: '45+ Items' },
    { id: 'gym', name: 'Dumbbells & Resistance Bands', imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=300&q=80', itemCount: '90+ Gear' },
    { id: 'yoga', name: 'Yoga Mats & Blocks', imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=300&q=80', itemCount: '30+ Styles' },
  ],
  popularStores: [
    { name: 'Champion Sports Hub', slug: 'champion-sports', locality: 'Sector 6, Bhilai', distance: '1.5 km', eta: '20-30 min', rating: '4.8', badge: 'Authentic Gear', imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=300&q=80' },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const rawSlug = (params?.slug || '').toLowerCase();
  const profile = CATEGORY_PROFILES[rawSlug];
  const title = profile?.title || rawSlug.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const tagline = profile?.tagline || `Discover verified local stores and products in ${title} on ${branding.appName}.`;

  return {
    title: `${title} — Shop Online from Local Stores | ${branding.appName}`,
    description: tagline,
    alternates: {
      canonical: `/category/${rawSlug}`,
    },
    openGraph: {
      title: `${title} | ${branding.appName}`,
      description: tagline,
      url: `/category/${rawSlug}`,
      ...(profile?.heroImage ? { images: [{ url: profile.heroImage, alt: title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${branding.appName}`,
      description: tagline,
    },
  };
}

export default function CategoryDynamicPage({
  params,
}: {
  params: { slug: string };
}) {
  const rawSlug = (params?.slug || '').toLowerCase();

  // If user requests fashion, render the specialized Fashion landing components
  if (rawSlug === 'fashion') {
    return (
      <div className="min-h-screen bg-transparent pb-16 lg:pb-0">
        <BreadcrumbJsonLd
          items={[
            { name: 'Home', item: '/' },
            { name: 'Categories', item: '/category' },
            { name: 'Fashion', item: '/category/fashion' },
          ]}
        />
        <main className="max-w-[1920px] mx-auto lg:px-6 lg:py-4">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Fashion' }]} />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-[#061842] mb-1">Fashion</h1>
              <p className="text-[14px] font-bold text-[#061842]">Style for Every You</p>
              <p className="text-[13px] font-medium text-gray-500">
                Trendy styles, top brands and great deals – only on {branding.appName}
              </p>
            </div>

            <div className="hidden lg:flex gap-4 mt-4 lg:mt-0">
              <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-[#1668F6]" strokeWidth={1.5} />
                <div className="flex flex-col">
                  <span className="text-[11px] font-extrabold text-[#061842] leading-tight">100% Authentic</span>
                  <span className="text-[11px] font-medium text-gray-500 leading-tight">Products</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm">
                <RotateCcw className="w-6 h-6 text-[#1668F6]" strokeWidth={1.5} />
                <div className="flex flex-col">
                  <span className="text-[11px] font-extrabold text-[#061842] leading-tight">Easy Returns</span>
                  <span className="text-[11px] font-medium text-gray-500 leading-tight">7 Days</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm">
                <Award className="w-6 h-6 text-[#1668F6]" strokeWidth={1.5} />
                <div className="flex flex-col">
                  <span className="text-[11px] font-extrabold text-[#061842] leading-tight">Top Brands</span>
                  <span className="text-[11px] font-medium text-gray-500 leading-tight">Great Prices</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm mb-6">
            <CategoryHeroBanner />
            <ShopByCategoryGrid />
            <ShopForLovedOnes />
            <FashionStores />
          </div>
        </main>
      </div>
    );
  }

  // Resolve dynamic category configuration
  const config =
    CATEGORY_PROFILES[rawSlug] || {
      title: rawSlug.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      tagline: `Discover verified local stores, authentic products and rapid delivery on ${branding.appName}`,
      heroImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
      heroBgGradient: 'from-slate-900/90 via-slate-800/80 to-slate-900/90',
      subcategories: [
        { id: 'top-picks', name: 'Top Trending Picks', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80', itemCount: '100+ Items' },
        { id: 'popular', name: 'Popular Near You', imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&q=80', itemCount: '50+ Items' },
        { id: 'new-arrivals', name: 'New Arrivals', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80', itemCount: '80+ Items' },
        { id: 'deals', name: 'Super Saver Deals', imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&q=80', itemCount: '40% Off' },
      ],
      popularStores: [
        { name: `${rawSlug.replace(/[-_]/g, ' ')} Central Store`, slug: `store-${rawSlug}`, locality: 'Sector 6, Bhilai', distance: '1.5 km', eta: '20-30 min', rating: '4.8', badge: 'Verified Local Partner', imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&q=80' },
      ],
    };

  return (
    <div className="min-h-screen bg-transparent pb-16 lg:pb-0">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Categories', item: '/category' },
          { name: config.title, item: `/category/${rawSlug}` },
        ]}
      />
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Categories', href: '/category' },
            { label: config.title },
          ]}
        />

        {/* Dynamic Category Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                Category Hub
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Fast Delivery in Bhilai
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#061842] tracking-tight">
              {config.title}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1 max-w-2xl">
              {config.tagline}
            </p>
          </div>

          {/* Trust Badges */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <div className="text-[11px] leading-tight">
                <div className="font-extrabold text-slate-900">100% Genuine</div>
                <div className="text-slate-400 font-medium">Verified Local Shops</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
              <RotateCcw className="w-5 h-5 text-blue-600" />
              <div className="text-[11px] leading-tight">
                <div className="font-extrabold text-slate-900">Easy Returns</div>
                <div className="text-slate-400 font-medium">Hassle-Free Policy</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Hero Banner Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900 text-white min-h-[220px] sm:min-h-[280px] flex items-center">
          <img
            src={config.heroImage}
            alt={config.title}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-overlay"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${config.heroBgGradient} opacity-95`} />

          <div className="relative z-10 p-6 sm:p-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Exclusive Hyperlocal Deals
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Best of {config.title} Near You
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 font-medium line-clamp-2">
              Order directly from trusted local retailers with doorstep delivery in 30-45 minutes.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href={`/products?category=${encodeURIComponent(rawSlug)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 text-xs sm:text-sm font-extrabold hover:bg-slate-100 transition-colors shadow-sm"
              >
                <ShoppingBag className="w-4 h-4 text-blue-600" />
                Explore All Products
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>
              <Link
                href={`/stores?category=${encodeURIComponent(rawSlug)}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-semibold border border-white/25 transition-colors"
              >
                <StoreIcon className="w-4 h-4" />
                Find Nearby Stores
              </Link>
            </div>
          </div>
        </div>

        {/* Subcategories Grid */}
        <section className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#061842]">
                Shop by Subcategory
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Browse popular departments in {config.title}
              </p>
            </div>
            <Link
              href={`/products?category=${encodeURIComponent(rawSlug)}`}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
            >
              View all <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
            {config.subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/products?category=${encodeURIComponent(rawSlug)}&sub=${encodeURIComponent(sub.id)}`}
                className="group relative bg-slate-50 hover:bg-blue-50/50 rounded-2xl p-3 sm:p-4 border border-slate-200/70 hover:border-blue-300 transition-all duration-200 flex flex-col items-center text-center hover:shadow-xs"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white p-1 border border-slate-200/60 mb-2.5 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <img
                    src={sub.imageUrl}
                    alt={sub.name}
                    className="w-full h-full object-cover rounded-lg"
                    loading="lazy"
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {sub.name}
                </span>
                {sub.itemCount && (
                  <span className="text-[11px] font-medium text-slate-400 mt-0.5">
                    {sub.itemCount}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Local Stores in this Vertical */}
        {config.popularStores && config.popularStores.length > 0 && (
          <section className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#061842]">
                  Top Rated {config.title} Stores
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Verified hyperlocal retailers ready to dispatch
                </p>
              </div>
              <Link
                href={`/stores?category=${encodeURIComponent(rawSlug)}`}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
              >
                See all stores <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {config.popularStores.map((store) => (
                <Link
                  key={store.slug}
                  href={`/stores/${store.slug}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:bg-blue-50/20 transition-all duration-200 shadow-2xs hover:shadow-xs"
                >
                  <img
                    src={store.imageUrl}
                    alt={store.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {store.badge}
                      </span>
                      <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {store.rating}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {store.name}
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400" /> {store.locality} ({store.distance})
                      </span>
                      <span className="flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3 text-slate-400" /> {store.eta}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

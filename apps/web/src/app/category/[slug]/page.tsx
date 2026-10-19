import React from 'react';
import type { Metadata } from 'next';
import { ShieldCheck, RotateCcw, Award } from 'lucide-react';
import { CategoryHeroBanner } from '@/features/catalog/CategoryHeroBanner';
import { ShopByCategoryGrid } from '@/features/catalog/ShopByCategoryGrid';
import { ShopForLovedOnes } from '@/features/catalog/ShopForLovedOnes';
import { FashionStores } from '@/features/catalog/FashionStores';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Footer } from '@/components/layout/Footer';
import { branding } from '@repo/shared-types';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

const CATEGORY_META: Record<string, { title: string; subtitle: string; description: string }> = {
  fashion: {
    title: 'Fashion',
    subtitle: 'Style for Every You',
    description: `Trendy styles, top brands and great deals – only on ${branding.appName}`,
  },
  mobiles: {
    title: 'Mobiles',
    subtitle: 'Latest Smartphones & Gadgets',
    description: `Flagship smartphones, smart wearables and phone accessories near you – only on ${branding.appName}`,
  },
  electronics: {
    title: 'Electronics',
    subtitle: 'Smart Tech for Everyday Living',
    description: `Audio, computing, displays and home entertainment from top local retailers – only on ${branding.appName}`,
  },
  beauty: {
    title: 'Beauty',
    subtitle: 'Glow with Confidence',
    description: `Skincare, cosmetics, perfumes and personal wellness products – only on ${branding.appName}`,
  },
  home_living: {
    title: 'Home & Living',
    subtitle: 'Make Your Space Truly Yours',
    description: `Decor, furnishings, kitchenware and home essentials – only on ${branding.appName}`,
  },
  appliances: {
    title: 'Appliances',
    subtitle: 'Upgrade Your Home Today',
    description: `Refrigerators, washing machines, microwaves and ACs with fast local delivery – only on ${branding.appName}`,
  },
  toys_baby: {
    title: 'Toys & Baby',
    subtitle: 'Fun, Care & Safety for Little Ones',
    description: `Safe toys, baby essentials, strollers and learning kits – only on ${branding.appName}`,
  },
  food_health: {
    title: 'Food & Health',
    subtitle: 'Fresh, Nutritious & Delicious',
    description: `Organic staples, supplements, gourmet snacks and healthcare – only on ${branding.appName}`,
  },
  auto: {
    title: 'Auto Accessories',
    subtitle: 'Gear Up Your Ride',
    description: `Car care, bike accessories, helmets and riding gear – only on ${branding.appName}`,
  },
  auto_accessories: {
    title: 'Auto Accessories',
    subtitle: 'Gear Up Your Ride',
    description: `Car care, bike accessories, helmets and riding gear – only on ${branding.appName}`,
  },
  sports: {
    title: 'Sports',
    subtitle: 'Play Hard, Stay Fit',
    description: `Fitness equipment, athletic wear, outdoor gear and games – only on ${branding.appName}`,
  },
  furniture: {
    title: 'Furniture',
    subtitle: 'Comfort Meets Modern Design',
    description: `Sofas, beds, ergonomic desks and dining sets from verified local carpenters – only on ${branding.appName}`,
  },
  books: {
    title: 'Books',
    subtitle: 'Read, Learn & Create',
    description: `Bestsellers, textbooks, stationery and art supplies – only on ${branding.appName}`,
  },
  '2wheelers': {
    title: '2 Wheelers',
    subtitle: 'Ride with Freedom',
    description: `Bicycles, electric two-wheelers, parts and protective accessories – only on ${branding.appName}`,
  },
  two_wheelers: {
    title: '2 Wheelers',
    subtitle: 'Ride with Freedom',
    description: `Bicycles, electric two-wheelers, parts and protective accessories – only on ${branding.appName}`,
  },
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const slug = params.slug?.toLowerCase() || 'fashion';
  const meta = CATEGORY_META[slug] || {
    title: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/_/g, ' '),
    subtitle: 'Shop Local',
    description: `Discover top products and stores in ${slug} on ${branding.appName}`,
  };

  return {
    title: `${meta.title} — ${meta.subtitle}`,
    description: meta.description,
  };
}

export default function CategoryLandingPage({ params }: CategoryPageProps) {
  const rawSlug = params.slug?.toLowerCase() || 'fashion';
  const meta = CATEGORY_META[rawSlug] || {
    title: rawSlug.charAt(0).toUpperCase() + rawSlug.slice(1).replace(/_/g, ' '),
    subtitle: 'Explore Top Products & Stores',
    description: `Discover verified stores and local deals in ${rawSlug} – only on ${branding.appName}`,
  };

  return (
    <div className="min-h-screen bg-transparent pb-16 lg:pb-0">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">

        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'Home', href: '/' }, 
            { label: 'Categories', href: '/category' },
            { label: meta.title }
          ]} 
        />

        {/* Title and Top Badges Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-[#061842] mb-1">{meta.title}</h1>
            <p className="text-[14px] font-bold text-[#061842]">{meta.subtitle}</p>
            <p className="text-[13px] font-medium text-gray-500">
              {meta.description}
            </p>
          </div>

          <div className="hidden lg:flex gap-4 mt-4 lg:mt-0">
            {/* 100% Authentic */}
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-[#1668F6]" strokeWidth={1.5} />
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-[#061842] leading-tight">100% Authentic</span>
                <span className="text-[11px] font-medium text-gray-500 leading-tight">Products</span>
              </div>
            </div>

            {/* Easy Returns */}
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm">
              <RotateCcw className="w-6 h-6 text-[#1668F6]" strokeWidth={1.5} />
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-[#061842] leading-tight">Easy Returns</span>
                <span className="text-[11px] font-medium text-gray-500 leading-tight">7 Days</span>
              </div>
            </div>

            {/* Top Brands */}
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

      <Footer />
    </div>
  );
}

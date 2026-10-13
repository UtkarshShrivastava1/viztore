'use client';

import React, { useState } from 'react';
import { Heart, Star, Store, ShoppingCart, Zap, Check } from 'lucide-react';
import { useFeaturedProducts } from '@/hooks/useFeaturedProducts';
import { useCartStore } from '@/stores/cart.store';

interface MockDeal {
  id: string;
  name: string;
  price: number;
  mrp: number;
  discount: string;
  rating: number;
  reviews: string;
  storeName: string;
  image: string;
}

const MOCK_DEALS: MockDeal[] = [
  {
    id: 'deal-1',
    name: 'Men Solid Cotton Shirt',
    price: 899,
    mrp: 999,
    discount: '10% OFF',
    rating: 4.3,
    reviews: '2.1K',
    storeName: 'Fashion Hub',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&q=80&fm=png&bg=transparent',
  },
  {
    id: 'deal-2',
    name: 'boAt Airdopes 141 TWS Earbuds',
    price: 999,
    mrp: 1499,
    discount: '25% OFF',
    rating: 4.4,
    reviews: '3.2K',
    storeName: 'Sharma Electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&q=80&fm=png&bg=transparent',
  },
  {
    id: 'deal-3',
    name: 'Mamaearth Vitamin C Face Wash (100ml)',
    price: 339,
    mrp: 399,
    discount: '15% OFF',
    rating: 4.5,
    reviews: '3.2K',
    storeName: 'Beauty Corner',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80&fm=png&bg=transparent',
  },
  {
    id: 'deal-4',
    name: 'Prestige Non-stick Cookware Set',
    price: 1999,
    mrp: 2499,
    discount: '20% OFF',
    rating: 4.3,
    reviews: '900',
    storeName: 'Home Needs',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=300&q=80&fm=png&bg=transparent',
  },
  {
    id: 'deal-5',
    name: 'Nike Revolution 7 Running Shoes',
    price: 2799,
    mrp: 3999,
    discount: '30% OFF',
    rating: 4.6,
    reviews: '1.8K',
    storeName: 'Fashion Hub',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80&fm=png&bg=transparent',
  },
  {
    id: 'deal-6',
    name: 'Skybags Pixel 32L Laptop Backpack',
    price: 1699,
    mrp: 1999,
    discount: '15% OFF',
    rating: 4.4,
    reviews: '2.5K',
    storeName: 'Gadget Store',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80&fm=png&bg=transparent',
  },
  {
    id: 'deal-7',
    name: 'Philips LED Table Lamp',
    price: 799,
    mrp: 999,
    discount: '20% OFF',
    rating: 4.5,
    reviews: '1.1K',
    storeName: 'Home Needs',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&q=80&fm=png&bg=transparent',
  },
  {
    id: 'deal-8',
    name: 'Havells Prolife 4L Air Fryer',
    price: 3999,
    mrp: 4499,
    discount: '10% OFF',
    rating: 4.3,
    reviews: '1.4K',
    storeName: 'Sharma Electronics',
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=300&q=80&fm=png&bg=transparent',
  },
];

export function TrendingDeals() {
  const { data: featuredProducts } = useFeaturedProducts(8);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [wishlistedIds, setWishlistedIds] = useState<Record<string, boolean>>({});

  const handleAddToCart = (e: React.MouseEvent, deal: MockDeal) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: deal.id,
      sku: `${deal.id}-sku`,
      name: deal.name,
      imageUrl: deal.image,
      unitPrice: deal.price,
      storeId: 'store-deals',
      storeName: deal.storeName,
    }, 1);

    setAddedIds((prev) => ({ ...prev, [deal.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [deal.id]: false }));
    }, 1500);
    openCart();
  };

  const toggleWishlist = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Build items based on live or fallback mockup data
  const dealsToRender: MockDeal[] = (featuredProducts && featuredProducts.length >= 8)
    ? featuredProducts.slice(0, 8).map((p, idx) => ({
        id: p._id,
        name: p.name,
        price: p.basePrice,
        mrp: p.baseMrp > p.basePrice ? p.baseMrp : Math.round(p.basePrice * 1.25),
        discount: p.baseMrp > p.basePrice
          ? `${Math.round(((p.baseMrp - p.basePrice) / p.baseMrp) * 100)}% OFF`
          : MOCK_DEALS[idx]?.discount || '20% OFF',
        rating: p.rating || 4.4,
        reviews: `${(Math.random() * 2 + 1).toFixed(1)}K`,
        storeName: p.storeName || MOCK_DEALS[idx]?.storeName || 'Official Store',
        image: p.variants?.[0]?.images?.[0] || MOCK_DEALS[idx]?.image || '',
      }))
    : MOCK_DEALS;

  return (
    <section className="space-y-4 py-4 select-none">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl md:text-2xl font-black text-[#061842]">Trending Deals</h2>
        <div className="flex items-center gap-1 text-rose-500 font-extrabold text-sm md:text-base">
          <Zap className="w-4 h-4 fill-current text-rose-500" />
          <span>Limited Time Offers</span>
        </div>
      </div>

      {/* 4-column x 2-row grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5">
        {dealsToRender.map((deal) => {
          const isAdded = !!addedIds[deal.id];
          const isWishlisted = !!wishlistedIds[deal.id];

          return (
            <div
              key={deal.id}
              className="group bg-white rounded-2xl border border-gray-100/90 hover:border-blue-200/80 p-3 md:p-3.5 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Area + Badges */}
              <div className="relative aspect-square w-full rounded-xl bg-gray-50/70 p-2 flex items-center justify-center overflow-hidden mb-2.5">
                {/* Discount Badge */}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#FF3B30] text-white text-[10px] md:text-[11px] font-black shadow-2xs">
                  {deal.discount}
                </span>

                {/* Wishlist Heart */}
                <button
                  type="button"
                  onClick={(e) => toggleWishlist(e, deal.id)}
                  aria-label="Save to Wishlist"
                  className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/90 text-[#1668F6] transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${isWishlisted ? 'fill-[#1668F6] text-[#1668F6]' : 'text-[#1668F6]'}`}
                  />
                </button>

                <img
                  src={deal.image}
                  alt={deal.name}
                  className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Title */}
              <h3 className="text-[13px] md:text-[14px] font-bold text-[#061842] line-clamp-1 group-hover:text-[#1668F6] transition-colors leading-snug mb-1">
                {deal.name}
              </h3>

              {/* Price Row */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base md:text-lg font-black text-[#061842]">
                  ₹{deal.price.toLocaleString('en-IN')}
                </span>
                {deal.mrp > deal.price && (
                  <span className="text-xs md:text-[13px] text-gray-400 line-through font-medium">
                    ₹{deal.mrp.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {/* Rating Row */}
              <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-2.5">
                <div className="flex items-center gap-0.5 font-bold text-gray-900">
                  <span>{deal.rating}</span>
                  <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                </div>
                <span className="text-gray-400 font-medium">({deal.reviews})</span>
              </div>

              {/* Footer Row: Store & Cart Button */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-50 mt-auto">
                <div className="flex items-center gap-1 text-[11px] md:text-xs text-gray-500 font-medium truncate max-w-[120px]">
                  <Store className="w-3.5 h-3.5 text-[#1668F6] shrink-0" />
                  <span className="truncate">{deal.storeName}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleAddToCart(e, deal)}
                  aria-label="Add to cart"
                  className={`p-2 rounded-xl border transition-all active:scale-95 flex items-center justify-center cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'border-blue-200 text-[#1668F6] hover:bg-blue-50 hover:border-blue-300'
                  }`}
                >
                  {isAdded ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <ShoppingCart className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}


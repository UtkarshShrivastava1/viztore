'use client';

import React, { useState } from 'react';
import { Heart, Store, Zap, Check, Plus, Minus } from 'lucide-react';
import { useFeaturedProducts } from '@/hooks/useFeaturedProducts';
import { useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/stores/cart.store';

interface ProductDealItem {
  id: string;
  name: string;
  price: number;
  mrp: number;
  discount: string;
  rating: number;
  reviews: string;
  storeName: string;
  storeId?: string;
  image: string;
}

export function TrendingDeals() {
  const { data: featuredProducts } = useFeaturedProducts(8);
  const { data: allProductsResponse } = useProducts({ limit: 12 });
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [wishlistedIds, setWishlistedIds] = useState<Record<string, boolean>>({});

  const handleAddToCart = (e: React.MouseEvent, deal: ProductDealItem) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: deal.id,
      sku: `${deal.id}-sku`,
      name: deal.name,
      imageUrl: deal.image,
      unitPrice: deal.price,
      storeId: deal.storeId || '6acf505183256911d14c43cc',
      storeName: deal.storeName,
    }, 1);

    setAddedIds((prev) => ({ ...prev, [deal.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [deal.id]: false }));
    }, 1500);
  };

  const handleIncrement = (e: React.MouseEvent, dealId: string, currentQty: number) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(dealId, currentQty + 1);
  };

  const handleDecrement = (e: React.MouseEvent, dealId: string, currentQty: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentQty <= 1) {
      removeItem(dealId);
    } else {
      updateQuantity(dealId, currentQty - 1);
    }
  };

  const toggleWishlist = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Build items exclusively from live database products
  const liveFeatured = featuredProducts && featuredProducts.length > 0 ? featuredProducts : [];
  const liveAll = allProductsResponse?.products && allProductsResponse.products.length > 0 ? allProductsResponse.products : [];
  const mergedProducts = [...liveFeatured];
  for (const prod of liveAll) {
    if (mergedProducts.length >= 8) break;
    if (!mergedProducts.some((p) => p._id === prod._id)) {
      mergedProducts.push(prod);
    }
  }

  const dealsToRender: ProductDealItem[] = mergedProducts.slice(0, 8).map((p) => {
    const rawStoreId = p.storeId;
    const storeId = typeof rawStoreId === 'object' && rawStoreId !== null
      ? (rawStoreId as { _id?: string })._id || String(rawStoreId)
      : String(rawStoreId || '6acf505183256911d14c43cc');
    return {
      id: p._id,
      name: p.name,
      price: p.basePrice,
      mrp: p.baseMrp > p.basePrice ? p.baseMrp : Math.round(p.basePrice * 1.25),
      discount: p.baseMrp > p.basePrice
        ? `${Math.round(((p.baseMrp - p.basePrice) / p.baseMrp) * 100)}% OFF`
        : '20% OFF',
      rating: p.rating || 4.5,
      reviews: `${(Math.random() * 2 + 1).toFixed(1)}K`,
      storeName: p.storeName || 'National Retail Store',
      storeId,
      image: p.variants?.[0]?.images?.[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&q=80&fm=png&bg=transparent',
    };
  });

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
          const cartItem = items.find((item) => item.productId === deal.id);
          const quantity = cartItem?.quantity || 0;

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

              {/* Footer Row: Store & Cart Stepper Button */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-50 mt-auto">
                <div className="flex items-center gap-1 text-[11px] md:text-xs text-gray-500 font-medium truncate max-w-[100px] sm:max-w-[120px]">
                  <Store className="w-3.5 h-3.5 text-[#1668F6] shrink-0" />
                  <span className="truncate">{deal.storeName}</span>
                </div>

                {quantity > 0 ? (
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="flex items-center bg-[#1668F6] text-white rounded-xl px-1 py-0.5 shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={(e) => handleDecrement(e, deal.id, quantity)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-white/20 active:bg-white/30 rounded transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                    <span className="w-6 text-center text-xs font-black tracking-tight select-none">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleIncrement(e, deal.id, quantity)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-white/20 active:bg-white/30 rounded transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(e, deal)}
                    aria-label="Add to cart"
                    className={`px-3 py-1.5 rounded-xl border font-bold text-xs transition-all active:scale-95 flex items-center gap-1 cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'border-blue-200 text-[#1668F6] hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}


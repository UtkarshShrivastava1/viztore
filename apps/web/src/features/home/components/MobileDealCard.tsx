'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import type { IProduct } from '@repo/shared-types';
import { useCartStore } from '@/stores/cart.store';
import { useWishlistFlyoutStore } from '@/stores/wishlistFlyoutStore';

interface MobileDealCardProps {
  product: IProduct;
  index?: number;
}

const fallbackDealImages = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400', // Running Shoes
  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=400', // Earbuds
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400', // Skincare
  'https://images.unsplash.com/photo-1584990347449-3974d6c7e2b1?auto=format&fit=crop&q=80&w=400', // Cookware
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400', // Men Shirt
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400', // Backpack
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=400', // Table Lamp
  'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&q=80&w=400', // Air Fryer
];

export function MobileDealCard({ product, index = 0 }: MobileDealCardProps) {
  const { addItem, openCart } = useCartStore();
  const [isAdded, setIsAdded] = React.useState(false);

  const isWishlisted = useWishlistFlyoutStore((state) =>
    state.items.some((i) => i.id === product._id || i.productId === product._id)
  );
  const toggleWishlistStore = useWishlistFlyoutStore((state) => state.toggleItem);

  const discount = product.baseMrp > product.basePrice
    ? Math.round(((product.baseMrp - product.basePrice) / product.baseMrp) * 100)
    : (index % 4 === 0 ? 20 : index % 4 === 1 ? 25 : index % 4 === 2 ? 20 : 25);

  const productImage =
    product.images?.[0] ||
    product.variants?.[0]?.images?.[0] ||
    (product.variants?.[0] as any)?.image ||
    fallbackDealImages[index % fallbackDealImages.length];

  // Deterministic rating calculation
  const charCodeSum = (product._id || product.name || 'M')
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rating = product.rating ? Number(product.rating).toFixed(1) : (4.2 + (charCodeSum % 7) / 10).toFixed(1);

  const rawStoreId = product.storeId;
  const storeId = typeof rawStoreId === 'object' && rawStoreId !== null
    ? (rawStoreId as { _id?: string })._id || String(rawStoreId)
    : String(rawStoreId || 'store-main');
  const storeName = product.storeName || (typeof rawStoreId === 'object' && (rawStoreId as { name?: string })?.name) || 'Official Store';

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlistStore({
      id: product._id,
      productId: product._id,
      title: product.name,
      storeId,
      storeName,
      price: product.basePrice,
      originalPrice: product.baseMrp,
      imageUrl: productImage,
      slug: product.slug,
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const success = addItem({
      productId: product._id,
      name: product.name,
      unitPrice: product.basePrice,
      imageUrl: productImage,
      storeId,
      storeName,
    });

    if (success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
      openCart();
    }
  };

  return (
    <Link
      href={`/products/${product.slug || product._id}`}
      className="w-[160px] sm:w-[175px] shrink-0 snap-start bg-white rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md transition-all p-2.5 flex flex-col justify-between group relative"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full bg-[#F8FAFC] rounded-xl flex items-center justify-center p-2 mb-2 overflow-hidden border border-gray-50">
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackDealImages[index % fallbackDealImages.length];
          }}
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-[#1668F6] text-white text-[9px] font-extrabold uppercase shadow-2xs leading-none">
            {discount}% OFF
          </span>
        )}

        {/* Wishlist Heart */}
        <button
          type="button"
          onClick={toggleWishlist}
          className="absolute top-1.5 right-1.5 p-1 rounded-full text-rose-500 hover:bg-rose-50 transition-colors z-10"
          aria-label={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 flex-1 justify-between">
        <div>
          <h3 className="text-xs font-bold text-[#0B1538] line-clamp-1 group-hover:text-[#1668F6] transition-colors leading-tight">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[10px] font-bold text-gray-700 flex items-center gap-0.5">
              {rating} <Star className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500" />
            </span>
            <span className="text-[10px] text-gray-400 truncate">• {storeName}</span>
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-50">
          <div className="flex flex-col leading-none">
            <span className="text-sm font-extrabold text-[#0B1538]">
              ₹{product.basePrice.toLocaleString('en-IN')}
            </span>
            {product.baseMrp > product.basePrice && (
              <span className="text-[10px] text-gray-400 line-through mt-0.5">
                ₹{product.baseMrp.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`p-1.5 rounded-lg transition-colors ${
              isAdded ? 'bg-emerald-600 text-white' : 'bg-blue-50 text-[#1668F6] hover:bg-[#1668F6] hover:text-white'
            }`}
            title="Add to cart"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Link>
  );
}

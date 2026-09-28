'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Trash2,
  Store,
  MapPin,
  Ticket,
  MessageSquare,
  HeadphonesIcon,
  Shield,
  FileText,
  LogOut,
  User,
  Bell,
  ShoppingBasket,
  ShoppingBag,
  Calendar,
  ChevronDown,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { branding } from '@repo/shared-types';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import { AccountSidebar } from '@/components/account/AccountSidebar';

export function WishlistClient() {
  const router = useRouter();
  const { user, isAuthenticated, openAuthModal } = useAuthStore();
  const { addItem: addToCart } = useCartStore();
  
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formData = {
    fullName: user?.fullName || 'Guest User',
    mobileNumber: user?.phone ? `+91 ${user.phone}` : '+91 91234 56789',
    email: user?.email || 'harishkumar@gmail.com',
  };

  useEffect(() => {
    let isMounted = true;
    const fetchWishlist = async () => {
      try {
        setIsLoading(true);
        // Using mock data to perfectly match the requested design screenshot
        const mockProducts = [
          {
            id: '1', name: 'Men White Sneakers', storeName: 'Fashion Hub',
            price: 1299, inStock: true, attributes: ['Size: 9'],
            image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=300&h=300'
          },
          {
            id: '2', name: 'boAt Wave Sigma 3 Smartwatch', storeName: 'Fashion Hub',
            price: 1799, inStock: true, attributes: ['Color: Black'],
            image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=300&h=300'
          },
          {
            id: '3', name: 'Men Casual Shirt', storeName: 'Fashion Hub',
            price: 699, inStock: true, attributes: ['Size: L', 'Color: Navy Blue'],
            image: 'https://images.unsplash.com/photo-1596755094514-f87e32f6b717?auto=format&fit=crop&q=80&w=300&h=300'
          },
          {
            id: '4', name: 'Laptop Backpack', storeName: 'Fashion Hub',
            price: 899, inStock: true, attributes: ['Color: Black'],
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=300&h=300'
          },
          {
            id: '5', name: 'pTron Bassbuds Vista', storeName: 'Fashion Hub',
            price: 1099, inStock: true, attributes: ['Color: Mint Green'],
            image: 'https://images.unsplash.com/photo-1606220588913-b3eea8951182?auto=format&fit=crop&q=80&w=300&h=300'
          },
          {
            id: '6', name: 'Wild Stone Blue Eau De Parfum', storeName: 'Fashion Hub',
            price: 499, inStock: true, attributes: ['Size: 100 ml'],
            image: 'https://images.unsplash.com/photo-1523293115678-d2900f57657d?auto=format&fit=crop&q=80&w=300&h=300'
          }
        ];
        
        if (isMounted) {
          setWishlistItems(mockProducts);
        }
      } catch (error) {
        console.error('Error fetching wishlist', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchWishlist();
    return () => { isMounted = false; };
  }, []);

  const handleRemove = (id: string) => {
    setWishlistItems(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24 font-sans">
      <main className="max-w-[1680px] mx-auto px-2 lg:px-8 pt-4 pb-6 relative z-10 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* ================= DESKTOP LEFT SIDEBAR ================= */}
        <AccountSidebar />

        {/* ================= RIGHT MAIN CONTENT ================= */}
        <div className="flex-1 w-full flex flex-col min-h-screen bg-transparent lg:bg-white lg:rounded-xl lg:shadow-sm lg:border lg:border-surface-200/60 lg:p-6">
          
          {/* Header */}
          <div className="px-2 lg:px-0 w-full flex items-start gap-3 pt-2 pb-1">
            <button onClick={() => router.back()} className="shrink-0 lg:hidden mt-0.5">
              <ArrowLeft className="w-6 h-6 text-[#192168]" />
            </button>
            <div>
              <h1 className="text-[22px] lg:text-[28px] font-bold text-[#192168] leading-tight">My Wishlist</h1>
              <p className="text-[13px] font-medium text-[#192168] mt-1">Items you love, saved for later.</p>
            </div>
          </div>

          {/* Items Count Header */}
          <div className="flex items-center gap-2 mb-3 px-2 lg:px-0 mt-3 lg:mt-6">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span className="text-[12px] lg:text-[14px] font-bold text-[#192168]">{wishlistItems.length} Items</span>
          </div>

          {/* Items Grid */}
          <div className="flex-1 mt-1 px-1 lg:px-0">
            {isLoading ? (
              <div className="py-20 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#1668F6]" />
              </div>
            ) : wishlistItems.length === 0 ? (
              <div className="py-16 text-center">
                <h3 className="text-base font-bold text-slate-800">Your wishlist is empty</h3>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
                {wishlistItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-[14px] border border-surface-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow relative"
                  >
                    
                    {/* Top Image Area */}
                    <div className="h-[140px] lg:h-[180px] w-full relative bg-[#F5F5F5] flex items-center justify-center p-4">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="max-w-full max-h-full object-contain mix-blend-multiply drop-shadow-sm"
                      />
                      
                      {/* Heart Icon */}
                      <button 
                        onClick={() => handleRemove(item.id)}
                        className="absolute top-2 right-2 p-1.5 z-10 bg-transparent hover:scale-110 transition-transform"
                      >
                        <Heart className="w-4 h-4 fill-red-600 text-red-600" />
                      </button>
                    </div>

                    {/* Content Section */}
                    <div className="p-3 lg:p-4 flex-1 flex flex-col bg-white">
                      
                      {/* Title & Store */}
                      <div className="mb-2.5">
                        <h4 className="text-[13px] lg:text-[15px] font-extrabold text-[#192168] line-clamp-2 leading-tight">
                          {item.name}
                        </h4>
                        <p className="text-[11px] lg:text-[13px] font-medium text-[#1668F6] mt-1">{item.storeName}</p>
                      </div>

                      {/* Selectors */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.attributes.map((attr: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-surface-200 bg-white">
                            <span className="text-[10px] font-medium text-[#192168]">{attr}</span>
                            <ChevronDown className="w-3 h-3 text-[#192168]" />
                          </div>
                        ))}
                      </div>

                      <div className="mt-auto">
                        {/* Price & Stock */}
                        <div className="mb-3">
                          <p className="text-[16px] lg:text-[18px] font-extrabold text-[#192168]">
                            ₹{item.price.toLocaleString('en-IN')}
                          </p>
                          <p className="text-[11px] font-bold text-[#16A34A] mt-0.5">
                            {item.inStock ? 'In Stock' : 'Out of Stock'}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleRemove(item.id)}
                            className="w-10 h-10 lg:w-11 lg:h-11 shrink-0 rounded-lg border border-red-500 flex items-center justify-center hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 lg:w-5 lg:h-5 text-red-500" />
                          </button>
                          
                          <button 
                            onClick={() => {
                              addToCart({
                                productId: item.id,
                                name: item.name,
                                unitPrice: item.price || 0,
                                storeId: 'mock-store-id',
                                storeName: item.storeName,
                                imageUrl: item.image,
                              });
                            }}
                            className="flex-1 rounded-lg bg-[#0F53FB] text-white text-[12px] lg:text-[13px] font-bold hover:bg-blue-700 transition-colors"
                          >
                            Move to Cart
                          </button>
                        </div>
                      </div>
                      
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}


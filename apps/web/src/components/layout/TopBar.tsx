"use client";

import { Heart, ShoppingCart, User } from "lucide-react";
import Logo from '@/components/layout/Logo';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';

interface TopBarProps {
  wishlistCount?: number;
  cartCount?: number;
}

export default function TopBar({ wishlistCount = 0, cartCount = 0 }: TopBarProps) {
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuthStore();

  const handleUserClick = () => {
    if (isAuthenticated) {
      router.push('/account');
    } else {
      openAuthModal('login');
    }
  };

  return (
    <div className="flex items-center justify-between px-4 pt-1 pb-3">
      <Logo />

      <div className="flex items-center gap-4">
        {/* User / Auth */}
        <button
          type="button"
          aria-label="User Account"
          className="relative text-white hover:opacity-85 transition-opacity"
          onClick={handleUserClick}
        >
          <User className="h-[23px] w-[23px]" strokeWidth={1.75} />
        </button>

        {/* Wishlist */}
        <button
          type="button"
          aria-label="Wishlist"
          className="relative text-white hover:opacity-85 transition-opacity"
          onClick={() => router.push('/account/wishlist')}
        >
          <Heart className="h-[23px] w-[23px]" strokeWidth={1.75} />
          {wishlistCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {wishlistCount}
            </span>
          )}
        </button>

        {/* Cart */}
        <button
          type="button"
          aria-label="Cart"
          className="relative text-white hover:opacity-85 transition-opacity"
          onClick={() => router.push('/cart')}
        >
          <ShoppingCart className="h-[23px] w-[23px]" strokeWidth={1.75} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 flex h-[18px] min-w-[18px] px-1 items-center justify-center rounded-full bg-[#1668F6] text-[10px] font-bold text-white shadow-sm border border-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

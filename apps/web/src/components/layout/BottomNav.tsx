'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Store, LayoutGrid, User, ShoppingCart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/stores/cart.store';

export function BottomNav() {
  const pathname = usePathname();
  if (pathname?.startsWith('/rider')) return null;
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Categories', href: '/category', icon: LayoutGrid },
    { label: 'Stores Near Me', href: '/stores', icon: Store },
    { label: 'Account', href: '/account', icon: User },
    { label: 'Cart', href: '/cart', icon: ShoppingCart, badge: itemCount },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-surface-100 pb-safe md:hidden">
      <div className="flex items-center justify-between h-[68px] px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(`${item.href}/`));
          const isCategories = item.label === 'Categories';
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full space-y-1.5 ${
                isActive ? 'text-[#1668F6]' : 'text-[#192168]'
              }`}
            >
              <div className="relative">
                <item.icon 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`w-[22px] h-[22px] ${
                    isActive && isCategories ? 'fill-[#1668F6] text-[#1668F6]' : 
                    isActive ? 'text-[#1668F6]' : 'text-[#192168]'
                  }`} 
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-extrabold text-white bg-[#1668F6] border-2 border-white rounded-full leading-none">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-semibold'} whitespace-nowrap tracking-tight`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { usePathname } from 'next/navigation';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { DesktopHeader } from '@/components/layout/DesktopHeader';

export interface HeaderProps {
  userName?: string;
  address?: string;
  wishlistCount?: number;
  cartCount?: number;
  notificationCount?: number;
  searchPlaceholder?: string;
  className?: string;
  pageTitle?: string;
}

export function Header(props: HeaderProps) {
  const { className = "", pageTitle, ...restProps } = props;
  const pathname = usePathname();
  const isSimpleHeader = pathname?.startsWith('/checkout') || pathname === '/account/orders' || pathname === '/account/wishlist' || pathname === '/account/addresses' || pathname === '/account/edit-profile' || pathname === '/account/coupons' || pathname === '/account/support' || pathname === '/account/sell' || pathname === '/account/privacy' || pathname === '/account/feedback' || pathname === '/account/terms' || pathname === '/account/logout' || pathname === '/account/logged-out' || pathname?.startsWith('/account/orders/');
  const isAccountPage = pathname?.startsWith('/account') && !isSimpleHeader;

  let displayTitle = pageTitle;
  if (!displayTitle && isSimpleHeader) {
    if (pathname === '/account/edit-profile') displayTitle = 'Edit Profile';
    else if (pathname === '/account/addresses') displayTitle = 'My Addresses';
    else if (pathname === '/account/wishlist') displayTitle = 'Wishlist';
    else if (pathname === '/account/orders') displayTitle = 'My Orders';
    else if (pathname === '/account/coupons') displayTitle = 'My Coupons';
    else if (pathname === '/account/support') displayTitle = 'Help & Support';
    else if (pathname === '/checkout') displayTitle = 'Checkout';
  }

  return (
    <header className={`w-full select-none ${className}`}>
      <MobileHeader 
        {...restProps}
        displayTitle={displayTitle}
        isSimpleHeader={isSimpleHeader}
        isAccountPage={isAccountPage}
      />
      <DesktopHeader
        {...restProps}
        isSimpleHeader={isSimpleHeader}
        isAccountPage={isAccountPage}
      />
    </header>
  );
}

export default Header;

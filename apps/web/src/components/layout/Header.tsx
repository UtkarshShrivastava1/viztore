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

const KNOWN_CATEGORY_SLUGS: Record<string, string> = {
  fashion: 'fashion',
  mobiles: 'mobiles',
  electronics: 'electronics',
  beauty: 'beauty',
  home_living: 'home_living',
  appliances: 'appliances',
  toys_baby: 'toys_baby',
  food_health: 'food_health',
  auto: 'auto',
  auto_accessories: 'auto',
  sports: 'sports',
  furniture: 'furniture',
  books: 'books',
  '2wheelers': '2wheelers',
  two_wheelers: '2wheelers',
};

/**
 * Determines whether the secondary CategoryStrip should be rendered.
 * 
 * PLACEMENT RULES (E-Commerce UX Standards):
 * ✅ SHOW on:
 * - Home page ('/')
 * - All Categories directory ('/category')
 * - Specific Category department landing ('/category/[slug]', e.g. '/category/fashion')
 * - Product Search & Catalog ('/products')
 * - Product Details ('/products/[slug]')
 * - Deals & Offers ('/deals')
 * - Stores Directory ('/stores')
 * - Category Stores Listing ('/stores/fashion')
 * 
 * ❌ OMIT on:
 * - Cart ('/cart', '/cart/[storeId]') — Keep cart funnel clean and focused
 * - Checkout ('/checkout', '/checkout/*') — Distraction-free conversion funnel
 * - Account ('/account', '/account/*') — Account & user profile navigation
 * - Merchant Storefront ('/stores/[slug]') — Keep individual merchant store clean and focused
 */
export function shouldShowCategoryStrip(pathname: string | null): boolean {
  if (!pathname) return false;

  // 1. Exclude checkout flow
  if (pathname.startsWith('/checkout')) return false;

  // 2. Exclude shopping cart
  if (pathname.startsWith('/cart')) return false;

  // 3. Exclude individual merchant storefronts (/stores/[slug] where slug is NOT a known category)
  if (pathname.startsWith('/stores/')) {
    const slug = pathname.replace('/stores/', '').split('/')[0]?.toLowerCase();
    if (slug && !KNOWN_CATEGORY_SLUGS[slug]) {
      return false; // It's an individual merchant store like /stores/style-hub
    }
  }

  // 4. Allowed on account pages (/account, /account/*), home, category pages, products, deals, and stores directory
  return true;
}

/**
 * Derives the active category ID for the CategoryStrip based on current route.
 */
export function getActiveCategoryId(pathname: string | null): string {
  if (!pathname) return '';
  if (pathname === '/') return 'home';
  if (pathname === '/category') return 'all';

  if (pathname.startsWith('/category/')) {
    const raw = pathname.replace('/category/', '').split('/')[0]?.toLowerCase() || '';
    return KNOWN_CATEGORY_SLUGS[raw] || raw;
  }

  if (pathname.startsWith('/stores/')) {
    const raw = pathname.replace('/stores/', '').split('/')[0]?.toLowerCase() || '';
    if (KNOWN_CATEGORY_SLUGS[raw]) {
      return KNOWN_CATEGORY_SLUGS[raw];
    }
  }

  return '';
}

export function Header(props: HeaderProps) {
  const { className = "", pageTitle, ...restProps } = props;
  const pathname = usePathname();
  const isSimpleHeader = pathname?.startsWith('/checkout') || pathname === '/account/orders' || pathname === '/account/wishlist' || pathname === '/account/addresses' || pathname === '/account/edit-profile' || pathname === '/account/coupons' || pathname === '/account/support' || pathname === '/account/sell' || pathname === '/account/privacy' || pathname === '/account/feedback' || pathname === '/account/terms' || pathname === '/account/logout' || pathname === '/account/logged-out' || pathname?.startsWith('/account/orders/');
  const isAccountPage = pathname?.startsWith('/account') && !isSimpleHeader;
  const isHomePage = pathname === '/';
  const showCategoryStrip = shouldShowCategoryStrip(pathname);
  const activeCategoryId = getActiveCategoryId(pathname);

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
        isHomePage={isHomePage}
        showCategoryStrip={showCategoryStrip}
        activeCategoryId={activeCategoryId}
      />
      <DesktopHeader
        {...restProps}
        isSimpleHeader={isSimpleHeader}
        isAccountPage={isAccountPage}
        showCategoryStrip={showCategoryStrip}
        activeCategoryId={activeCategoryId}
      />
    </header>
  );
}

export default Header;

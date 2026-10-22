# 📋 Intern Task Brief: Universal Category Strip & Footer Integration (`TASK-VIN-13`)

**Assignee:** Vinay Kumar ([`@VVinaykumar003`](https://github.com/VVinaykumar003))  
**Target Workspace:** `apps/web/` (Next.js 14+ Customer Web Storefront)  
**Feature Branch:** `feature/vinay-universal-category-strip-footer`  
**Assigned Date:** October 19, 2026  
**Target Delivery Window:** 48 Hours  
**Evaluation Standard:** **9.8+ / 10** (Structural Consistency & Architectural Cleanliness)

---

## 🎯 Task Objective & Context

In the latest design & UX review with Harish and Utkarsh, two key navigational inconsistencies were identified across the customer web storefront (`apps/web/`):

1. **Category Strip Missing on Account & Subpages**:
   - On the Desktop Home page (`Web 1.0.png`), a prominent horizontal **Category Strip** sits right below the header ("Home", "All Categories", "Fashion", "Mobiles", "Electronics", "Beauty", "Home & Living", etc.).
   - However, on the **My Account** pages (`/account/*`), Cart, and other subpages, the Category Strip is conditionally suppressed (`!isSimpleHeader && !isAccountPage`), creating an inconsistent, stripped-down header experience.
   - **Requirement**: The Category Strip must be universally present below the header across **all pages** of the customer web storefront, providing persistent departmental discovery everywhere.

2. **Footer Missing on Account, Cart & Related Pages**:
   - The primary multi-column gradient `Footer` component is currently imported only on select pages (`page.tsx`, `products/page.tsx`, `stores/page.tsx`, `deals/page.tsx`), but is completely missing from:
     - `/account` and all nested account routes (`/account/orders`, `/account/addresses`, `/account/wishlist`, `/account/coupons`, `/account/edit-profile`, `/account/support`, `/account/terms`, `/account/privacy`, etc.).
     - `/cart` and `/cart/[storeId]`.
     - `/category` and other sub-routes.
   - **Requirement**: Ensure the `Footer` is universally present across **all pages** (with appropriate bottom padding on mobile so it does not collide with the sticky `BottomNav`).

---

## 🖼️ Design Reference Mapping

| # | Reference Screen | Current State | Required Target State |
|:---:|---|---|---|
| **1** | **Desktop Home (`Web 1.0.png`)** | **Canonical Model**: Shows full header + horizontal white Category Strip with icons & labels below header + multi-column gradient footer at page bottom. | Maintain this exact visual standard as the benchmark. |
| **2** | **Desktop Account Hub (`Web 4.0.png`)** | Header renders without Category Strip; page bottom has no Footer. | Render `DesktopCategoryStrip` directly below the desktop header, and render `Footer` at the bottom of the account layout. |
| **3** | **Cart & Checkout Pages (`/cart`, `/checkout`)** | Missing Category Strip and Footer. | Ensure Category Strip is present below header, and Footer is rendered at the base of the page. |

---

## 🔍 Detailed Component & Architecture Requirements

### 1. Unsuppress `DesktopCategoryStrip` in `DesktopHeader.tsx`
Inspect [`apps/web/src/components/layout/DesktopHeader.tsx`](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/platform-root-vz/apps/web/src/components/layout/DesktopHeader.tsx):
- Currently lines 247–250 conditionally hide the category strip:
  ```tsx
  {/* ❌ OLD: Hidden on account and simple header pages */}
  {!isSimpleHeader && !isAccountPage && (
    <DesktopCategoryStrip activeId={activeCategoryId} />
  )}
  ```
- **Update To**:
  ```tsx
  {/* ✅ REQUIRED: Universal Category Strip across all desktop pages */}
  <DesktopCategoryStrip activeId={activeCategoryId} />
  ```
- **Route Active State Resolution**:
  - In `DesktopHeader.tsx`, ensure `activeCategoryId` handles routes gracefully:
    - On `/`: `'home'`
    - On `/category`: `'all-categories'`
    - On `/products?category=fashion` or `/category/fashion`: `'fashion'`
    - On `/account/*` or `/cart`: default to neutral / none active without throwing errors.

### 2. Universal Footer Integration
Inspect [`apps/web/src/components/layout/Footer.tsx`](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/platform-root-vz/apps/web/src/components/layout/Footer.tsx) and [`apps/web/src/app/layout.tsx`](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/platform-root-vz/apps/web/src/app/layout.tsx):
- **Architectural Approach**:
  - Move `<Footer />` into the central layout structure (e.g. in `RootLayout` or a universal layout shell), OR ensure every page in `apps/web/src/app/` mounts `<Footer />`.
  - If placing in `RootLayout`, remove manual redundant `<Footer />` calls in individual page files (`page.tsx`, `products/page.tsx`, etc.) to prevent duplicate footers.
- **Mobile Viewport Clearance**:
  - The mobile view has a fixed sticky `<BottomNav />` (`h-16`).
  - Ensure the footer container has bottom padding on mobile (`pb-20 md:pb-0` or `pb-24`) so copyright and footer links are fully accessible and not covered by `BottomNav`.

### 3. Route Verification Matrix
Verify that both `DesktopCategoryStrip` (desktop view $\ge 768px$) and `Footer` (all viewports) render seamlessly on:
- [ ] `/` (Home)
- [ ] `/category` (Categories Hub)
- [ ] `/products` and `/products/[slug]` (PLP & PDP)
- [ ] `/stores` and `/stores/[slug]` (Stores Directory & Storefront)
- [ ] `/deals` (Deals Hub)
- [ ] `/cart` (Cart Page)
- [ ] `/account` (Account Overview)
- [ ] `/account/orders` and `/account/orders/[id]` (Orders History & Tracking)
- [ ] `/account/addresses` and `/account/addresses/add` (Saved Addresses)
- [ ] `/account/wishlist` (Wishlist)
- [ ] `/account/coupons` (Coupons & Offers)
- [ ] `/account/edit-profile` (Edit Profile)
- [ ] `/account/support` (Help & Support)
- [ ] `/account/terms` and `/account/privacy` (Legal Pages)

---

## 🛡️ Mandatory White-Label Rules

> [!CAUTION]
> **STRICT WHITE-LABEL MANDATE**
> - **Zero Brand Names in Code**: Never hardcode client brands ("Viztore" / "Zager" / "VZT").
> - Always import `{branding.appName}`, `{branding.supportEmail}`, etc. from `@repo/shared-types`.
> - Generic identifier prefixes only (`#ORD-...`, `PRD-...`, `STR-...`).

---

## 🛠️ Step-by-Step Git Workflow

```bash
# 1. Ensure main is up-to-date
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/vinay-universal-category-strip-footer

# 3. Work strictly inside apps/web/
# Update apps/web/src/components/layout/DesktopHeader.tsx, apps/web/src/app/layout.tsx, and related pages.

# 4. Verify monorepo build and test suite
pnpm --filter @repo/web build
pnpm build
pnpm test

# 5. Commit with conventional impersonal message
git add apps/web/
git commit -m "feat(web): enable universal desktop category strip and footer across all storefront routes"
git push origin feature/vinay-universal-category-strip-footer
```

---

## 📊 Evaluation Rubric (Target: 9.8 / 10)

1. **Navigational Consistency (30%)**: Category strip and footer appear reliably on 100% of storefront routes.
2. **Layout & Responsive Cleanliness (25%)**: No duplicate footers, no mobile `BottomNav` overlap (`pb-20`).
3. **White-Label Compliance (20%)**: 0 brand leaks.
4. **Build Integrity & Type Safety (15%)**: Zero Next.js / TypeScript build errors across all 32 routes.
5. **Git Discipline (10%)**: Clean branch, strictly confined to `apps/web/`.

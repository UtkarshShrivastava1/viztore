# 📋 Intern Task Brief: Product Listing (PLP) & Details (PDP) Alignment (`TASK-VIN-14`)

**Assignee:** Vinay Kumar ([`@VVinaykumar003`](https://github.com/VVinaykumar003))  
**Target Workspace:** `apps/web/` (Next.js 14+ Customer Web Storefront)  
**Feature Branch:** `feature/vinay-catalog-pdp-alignment`  
**Target Delivery Window:** 3 Working Days  
**Evaluation Standard:** **10.0 / 10** (Pixel-Level Visual Fidelity Audit, Faceted Exploration, Dual-Viewport Carousels & Specifications)

---

## 🎯 Executive Mission & Objective

In Task 11, the mobile split category hub was established. In **Task 14**, the engineer will achieve 100% pixel-perfect visual alignment for the core customer shopping experience across both Mobile and Desktop viewports:

1. **Faceted Product Listing Page (PLP)**:
   - **Mobile (< 768px)**: 2-column mobile cards with quick steppers, distance pill, discount badges, subcategory bubble rail, and sticky filter & sort toolbar (`Mob 2.1`).
   - **Desktop (≥ 1024px)**: 4-column product grid with 260px faceted filter sidebar, active filter chips row with 1-click "Clear All", search-within-filter, breadcrumbs, and sorting dropdown (`Web 2.1`, `Web 2.1a`).

2. **Comprehensive Product Details Page (PDP)**:
   - **Mobile (< 768px)**: Dual-viewport product showcase (`Mob 2.2`, `Mob 2.3`) featuring 8-dot swipeable image carousel, floating back/wishlist/share pills, seller trust pill, variant matrix (size pills with diagonal slash for out-of-stock items, active ring color swatches), sticky bottom purchase bar, expandable specifications accordion, live pincode delivery checker, 7-day return policy card, star distribution rating bars, and similar items rail.
   - **Desktop (≥ 1024px)**: Dual-column product showcase (`Web 2.2`, `Web 2.3`, `Web 2.3a`) featuring sticky vertical thumbnail strip on the left + large zoomable hero photo, dual CTAs, store rating pill, promotional voucher card (`WELCOME50`, `FLAT100` with 1-click copy), 2-column key-value specification matrix, hyperlocal delivery pincode validator card, 4 trust badges, and comprehensive verified customer review showcase with rating breakdown and helpful upvote buttons.

---

## 🖼️ Mockup Reference Mapping Table (8 Screens)

| Mockup | Viewport | Target Route / Scope | Primary Visual & Functional Deliverable |
|:---:|:---:|:---:|:---|
| **Mob 2.1.png** | Mobile (< 768px) | `/category/[slug]`, `/products` | Subcategory circular bubble rail (`w-14 h-14 rounded-full` with active blue ring `ring-2 ring-[#1668F6]`), sticky filter toolbar (Filters ▾ slide-over sheet, Sort By ▾, Fast Delivery ⚡, Ratings 4★+), 2-col product cards with distance pill (`⚡ 15 mins • 1.2 km`), discount badges, 2-line title clamp, strikethrough MRP, and instant Add + stepper (`- 1 +`). |
| **Mob 2.2.png** | Mobile (< 768px) | `/products/[slug]` (Upper Viewport) | 8-dot swipeable image carousel (active dot expanded pill `w-5 bg-[#1668F6]`), floating back, wishlist, and share pills, seller trust pill (`Sold by [Store Name]` with green verified badge and `4.7 ★`), variant matrix (size pills with diagonal slash for out-of-stock items, color swatches with active rings), sticky bottom purchase bar with price summary + dual CTAs (Add to Cart + Buy Now). |
| **Mob 2.3.png** | Mobile (< 768px) | `/products/[slug]` (Lower Viewport) | Expandable product specifications accordion, live pincode delivery checker (6-digit Indian PIN regex `/^[1-9][0-9]{5}$/` with live feedback `⚡ Delivery by Tomorrow, 2:00 PM • FREE Delivery`), 7-day return policy card, star distribution rating bars, similar items rail. |
| **Web 2.1.png** | Desktop (≥ 1024px) | `/products`, `/category/[slug]` | 4-column product grid in 1440px container, left faceted sidebar (categories, price slider, discount %, brands, rating), breadcrumb trail, top sorting dropdown, hover lift cards, secondary image swap on hover, size pill previews, instant cart quick-add. |
| **Web 2.1a.png** | Desktop (≥ 1024px) | `SidebarFilter.tsx` | Desktop active filter chips row with 1-click "Clear All", multi-select tag badges, search-within-filter inputs, instant result count recalculation. |
| **Web 2.2.png** | Desktop (≥ 1024px) | `/products/[slug]` (Upper Viewport) | 2-column layout: Sticky vertical thumbnail strip on the left + large zoomable primary showcase photo with dual CTAs directly underneath, store rating pill, promotional voucher card (`WELCOME50`, `FLAT100` with 1-click copy). |
| **Web 2.3.png** | Desktop (≥ 1024px) | `ProductSpecs.tsx` | 2-column key-value specification matrix (Material, Fit, Sleeve, Wash Care), delivery pincode validation card with estimated date, 4 trust badges (Genuine, Returns, Delivery, Payment). |
| **Web 2.3a.png** | Desktop (≥ 1024px) | `ProductReviews.tsx` | Overall score summary card with 5-star distribution progress bars, review search, verified customer review cards with helpful thumbs-up upvote trigger and verified badges. |

---

## 🔍 Granular Dual-Viewport Technical Specifications

### 1. MOB 2.1 — Mobile Faceted PLP (`/category/[slug]`, `/products`)
- **Subcategory Rail**: Horizontal scrollable rail of circular subcategory icons (`w-14 h-14 rounded-full`) with active blue ring (`ring-2 ring-[#1668F6]`).
- **Sticky Filter Toolbar**: Top-fixed chip bar with:
  - `Filters ▾` (opens bottom slide-over sheet)
  - `Sort By ▾`
  - `Fast Delivery ⚡`
  - `Ratings 4★+`
- **2-Col Product Cards**:
  - 1:1 square photo
  - Floating wishlist heart
  - Store distance pill: `⚡ 15 mins • 1.2 km`
  - 2-line title clamp
  - Strikethrough MRP + green discount badge
  - Instant Add + stepper (transforms into `- 1 +` quantity stepper upon adding to cart).

### 2. MOB 2.2 — Mobile PDP Upper Showcase (`/products/[slug]`)
- **8-Dot Carousel**: Full-width swipeable image viewport with 8 pagination dots (active dot expanded pill `w-5 bg-[#1668F6]`).
- **Floating Controls**: Back arrow, wishlist heart, and share pills with glassmorphism backdrop.
- **Seller Trust Pill**: `Sold by [Store Name]` with green verified badge and rating pill (`4.7 ★`).
- **Variant Matrix**: Size pills (`S`, `M`, `L`, `XL`) with diagonal slash for out-of-stock items, color swatches with active rings (`ring-2 ring-offset-2 ring-[#1668F6]`).
- **Sticky Bottom Bar**: Price summary (Price + strikethrough MRP + discount %) + dual CTAs (`Add to Cart` + `Buy Now`).

### 3. MOB 2.3 — Mobile PDP Lower Viewport (`/products/[slug]`)
- **Expandable Specifications**: Accordion for Material, Fit, Neck, Sleeve, Wash Care, Country of Origin, Generic ID (`PRD-10245`).
- **Hyperlocal Pincode Checker**: 6-digit Indian PIN input (`/^[1-9][0-9]{5}$/`) with live delivery estimation and green courier van badge.
- **7-Day Return Policy Card**: Clear visual policy badge.
- **Star Distribution Rating Bars**: 5★ to 1★ breakdown.
- **Similar Items Rail**: Horizontal carousel with 2-col product cards.

### 4. WEB 2.1 / WEB 2.1a — Desktop 4-Col PLP (`/products`, `/category/[slug]`)
- **Left Faceted Sidebar (`SidebarFilter.tsx`)**: 260px sticky sidebar with accordion filters:
  - Categories with counts and "+ Show More"
  - Brand search input (`Search within brands...`) & multi-select checkboxes
  - Price dual-slider / range inputs
  - Discount % chips (10%+, 20%+, 30%+, 50%+)
  - Customer Ratings (4★+, 3★+)
- **Active Filter Chips**: Removable tags with 1-click "Clear All" and dynamic count updates.
- **4-Column Grid**: Standard 1440px container with breadcrumbs, sorting dropdown, hover lift cards, secondary image swap on hover, size pill previews, and instant cart quick-add.

### 5. WEB 2.2 / 2.3 / 2.3a — Desktop PDP Showcase & Specifications (`/products/[slug]`)
- **Sticky Gallery Column**: Vertical thumbnail strip on the left (w-16 / 72px) + large zoomable primary showcase photo with dual CTAs directly underneath.
- **Promotional Card (`ProductCoupons.tsx`)**: Coupon cards with 1-click copy (`WELCOME50`, `FLAT100`).
- **Key Specs Table (`ProductSpecs.tsx`)**: 2-column key-value attribute grid (Material, Fit, Sleeve, Wash Care, Pattern, Country of Origin, Style Code `PRD-10245`).
- **Trust Badges**: 4 badges (100% Genuine, 7-Day Returns, Free Delivery, Secure Payment).
- **Customer Reviews (`ProductReviews.tsx`)**: Overall score summary card with 5-star distribution progress bars, review search, buyer photo carousel, verified badges, and helpful thumbs-up upvote triggers.

---

## ⚡ Hyperlocal Pincode Checker Specification

Both Mobile and Desktop PDPs require a dedicated delivery estimation component:
- **Input**: Accepts 6-digit Indian PIN codes.
- **Validation**: Validates via regex `/^[1-9][0-9]{5}$/`.
- **Live Feedback**: `⚡ Delivery by Tomorrow, 2:00 PM • FREE Delivery` with green courier van badge (`Truck` icon in emerald).

---

## 🗄️ Zustand State Contract (`pdp.store.ts`)

```ts
export interface PdpState {
  selectedSize: string | null;
  selectedColor: string | null;
  activeImageIndex: number;
  deliveryPincode: string;
  isPincodeValid: boolean;
  deliveryEstimate: string | null;
  upvotedReviews: Record<string, boolean>;
  setSelectedSize: (size: string | null) => void;
  setSelectedColor: (color: string | null) => void;
  setActiveImageIndex: (index: number) => void;
  setDeliveryPincode: (pincode: string) => void;
  validatePincode: (pincode: string) => boolean;
  toggleReviewUpvote: (reviewId: string) => void;
  resetPdpState: () => void;
}
```

---

## 📁 Target Component Architecture & File Layout

```text
apps/web/src/
├── app/
│   ├── category/[slug]/
│   │   ├── page.tsx                  # Faceted PLP route
│   │   └── CategoryPlpClient.tsx     # Dynamic Category Faceted PLP Client
│   ├── products/
│   │   ├── page.tsx                  # Faceted PLP route matching desktop 4-col & mobile 2-col
│   │   └── [slug]/
│   │       ├── page.tsx              # PDP route
│   │       └── ProductDetailClient.tsx # PDP Dual-Viewport Client
├── features/
│   ├── catalog/
│   │   ├── SidebarFilter.tsx         # Desktop Faceted Sidebar & Active Chips
│   │   ├── FilterSortBar.tsx         # Mobile Filter Toolbar & Bottom Sheet
│   │   └── SubcategoryBubbleFilter.tsx # Circular Subcategory Rail
│   ├── products/
│   │   └── components/
│   │       └── ProductCard.tsx       # 2-col mobile with stepper, desktop hover & size preview
│   └── pdp/
│       ├── PincodeChecker.tsx        # Hyperlocal 6-digit PIN validator & estimation
│       ├── ProductSpecs.tsx          # 2-column key-value matrix & 4 trust badges
│       ├── ProductReviews.tsx        # Overall score summary, 5-star bars, review cards & upvotes
│       ├── ProductCoupons.tsx        # Promotional coupon cards with 1-click copy
│       ├── ProductImageCarousel.tsx  # 8-dot mobile swipeable + desktop sticky vertical thumbnail
│       ├── StickyBottomBar.tsx       # Mobile sticky bottom purchase bar with price summary
│       └── SizeSelector.tsx          # Size pills with diagonal slash for out-of-stock
└── stores/
    └── pdp.store.ts                  # Zustand state store for PDP
```

---

## 🛡️ Mandatory White-Label Rules

> [!CAUTION]
> **STRICT WHITE-LABEL MANDATE**
> - **Zero Brand Names in Code**: Never hardcode client brands ("Viztore" / "Zager" / "VZT").
> - Always import `{branding.appName}`, `{branding.supportEmail}`, etc. from `@repo/shared-types`.
> - Generic identifier prefixes exclusively (`#ORD-...`, `PRD-10245`, `STR-401`).

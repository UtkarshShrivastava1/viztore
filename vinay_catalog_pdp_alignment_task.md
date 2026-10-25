# 🛍️ TASK BRIEF: Customer Web Product Listing (PLP) & Product Details (PDP) Deep Visual Alignment

**Task ID:** `TASK-VIN-14`  
**Assignee:** Vinay Kumar ([`@VVinaykumar003`](https://github.com/VVinaykumar003))  
**Target Workspace:** `apps/web/` (Next.js 14+ App Router + Tailwind CSS + Zustand)  
**Target Feature Branch:** `feature/vinay-catalog-pdp-alignment`  
**Assigned Date:** October 25, 2026  
**Target Delivery Window:** 3 Days  
**Lead Architect:** Utkarsh Shrivastava / Senior Co-Pilot Agent  
**Design Reference Root:** `mockups/User_Front/2.) Categories/` (**8 Mockup Screens**)

---

## 1. Executive Summary & Objective

In **Task 11**, Vinay delivered the mobile split category hub (`Mob 2.0.png`, `MobileCategoryExplorer`). In this deliverable (**Task 14**), Vinay will achieve **100% pixel-perfect visual alignment** for the core customer shopping experience across both Mobile and Desktop viewports:

1. **Faceted Product Listing Page (PLP)**: Mobile 2-column cards with quick quantity steppers (`Mob 2.1.png`) and Desktop 4-column grid with faceted filter sidebar and active chip pills (`Web 2.1.png`, `Web 2.1a.png`).
2. **Comprehensive Product Details Page (PDP)**: Dual-viewport product showcases (`Mob 2.2`, `Mob 2.3`, `Web 2.2`, `Web 2.3`, `Web 2.3a`) featuring multi-image galleries, variant swatches, sticky bottom purchasing actions, key specification matrices, delivery pincode checking, and verified customer review cards.

> [!IMPORTANT]
> **Zero Guesswork Rule:** Every screen has a paired Mobile and Desktop mockup in `mockups/User_Front/2.) Categories/`. You must cross-reference both viewports simultaneously.

---

## 2. Mockup Reference Mapping Table

| # | Mockup Filename | Viewport | Target Route / Component | Primary Visual & Functional Scope |
|:---:|---|:---:|---|---|
| **1** | `Mob 2.1.png` | **Mobile** (`< 768px`) | `app/category/[slug]/page.tsx`<br>`app/products/page.tsx` | **Mobile Faceted PLP**: Circular subcategory bubble filter rail, sticky filter & sort chip bar (`Filter ▾`, `Sort By ▾`, `Express Delivery`), 2-column compact product card grid with store distance pill (`⚡ 15 mins • 1.2 km`), discount badges, and instant `Add +` stepper. |
| **2** | `Mob 2.2.png` | **Mobile** (`< 768px`) | `app/products/[slug]/page.tsx` *(Upper)* | **Mobile PDP Upper Half**: 8-dot swipeable image carousel, floating wishlist & share pills, breadcrumbs, pricing with strikethrough and green discount pill (`-50%`), size selector pills with out-of-stock indicators, color swatch picker, and persistent sticky bottom bar (`Add to Cart` + `Buy Now`). |
| **3** | `Mob 2.3.png` | **Mobile** (`< 768px`) | `app/products/[slug]/page.tsx` *(Lower)* | **Mobile PDP Lower Half**: Product specifications expandable accordion, delivery pincode lookup (`Check delivery date`), 7-day return policy trust card, customer ratings overview (`4.3 ★` badge with star distribution bars), and "Similar Products" horizontal cross-sell rail. |
| **4** | `Web 2.1.png` | **Desktop** (`≥ 1024px`) | `app/products/page.tsx`<br>`app/category/[slug]/page.tsx` | **Desktop Full-Scale PLP**: 4-column product grid, left faceted sidebar (categories, price slider, discount, brands, rating), breadcrumb trail, and top sorting dropdown (`Relevance`, `Price: Low to High`, `Rating`). |
| **5** | `Web 2.1a.png` | **Desktop** (`≥ 1024px`) | `features/catalog/SidebarFilter.tsx` | **Desktop Active Filter States & Flyouts**: Active filter chips row with 1-click "Clear All", multi-select tag badges, search-within-filter inputs, and instant count updates. |
| **6** | `Web 2.2.png` | **Desktop** (`≥ 1024px`) | `app/products/[slug]/page.tsx` *(Upper)* | **Desktop PDP Upper Section**: 2-column layout: Left sticky multi-image gallery (large hero photo + vertical thumbnail strip with blue active ring), Right product title, store name with rating pill, instant voucher card (`Use code WELCOME50 for ₹50 off`), size selector, color swatches, quantity stepper, and dual CTAs (`Add to Cart` + `Buy Now`). |
| **7** | `Web 2.3.png` | **Desktop** (`≥ 1024px`) | `features/pdp/ProductSpecs.tsx` | **Desktop PDP Key Specifications & Delivery**: 2-column key-value specification matrix, delivery pincode validation card with estimated delivery date, and 4-point trust badges (Genuine, 7-Day Returns, Free Delivery, Secure Payment). |
| **8** | `Web 2.3a.png` | **Desktop** (`≥ 1024px`) | `features/pdp/ProductReviews.tsx` | **Desktop Customer Reviews & Ratings**: Overall score summary card with 5-star distribution progress bars, review search, and verified customer review cards with user avatar, verified purchase pill, review photos, and helpful count thumbs-up button. |

---

## 3. Screen-by-Screen Detailed Technical Specifications

### 📱 1. Mobile Faceted PLP (`Mob 2.1.png`)
- **Route:** `apps/web/src/app/category/[slug]/page.tsx` & `apps/web/src/app/products/page.tsx`
- **Subcategory Bubble Filter Bar**: Horizontal scrollable rail of circular subcategory icons (`w-14 h-14 rounded-full border border-slate-200 bg-white p-2`) with active blue ring (`ring-2 ring-[#1668F6]`).
- **Sticky Filter & Sort Chips**:
  - Horizontal chip toolbar (`sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-100 py-2 px-3 flex gap-2 overflow-x-auto`):
    - `Filters ▾` (opens bottom slide-over filter sheet).
    - `Sort By ▾` (opens bottom sort options sheet: Relevance, Price Low-High, Price High-Low, Newest).
    - `Fast Delivery ⚡` (toggle chip).
    - `Ratings 4★+` (toggle chip).
- **Product Card Grid**:
  - 2-column mobile grid (`grid-cols-2 gap-2.5 p-3`).
  - Product thumbnail with 1:1 aspect ratio (`aspect-square object-cover rounded-xl`).
  - Floating top-right wishlist heart (`Heart` icon with white circular backdrop).
  - Hyperlocal store tag: `⚡ 15 mins • 1.2 km` with blue bolt icon.
  - Title (truncated 2 lines `line-clamp-2 text-xs font-medium text-slate-800`).
  - Pricing: Bold current price `₹499`, strikethrough original `₹999`, green discount pill `50% OFF`.
  - Quick `Add +` button with instant quantity stepper (`− 1 +`) on active cart state.

---

### 📱 2. Mobile PDP Upper Section (`Mob 2.2.png`)
- **Route:** `apps/web/src/app/products/[slug]/page.tsx`
- **Swipeable Image Carousel**:
  - Full-width swipeable image viewport (`aspect-square bg-slate-50 relative`).
  - 8 pagination dots (`flex justify-center gap-1.5 py-2.5` with active dot `w-5 bg-[#1668F6] rounded-full` and inactive dots `w-1.5 h-1.5 bg-slate-300 rounded-full`).
  - Floating circular buttons: Back chevron top-left, Wishlist heart top-right, Share trigger top-right (`p-2 rounded-full bg-white/90 shadow-sm backdrop-blur-sm`).
- **Product Info Card**:
  - Brand pill (`text-[11px] font-semibold tracking-wider text-slate-500 uppercase`).
  - Product title (`text-lg font-bold text-slate-900 leading-snug`).
  - Seller link: Sold by `Store Name` with green verified badge and rating pill (`4.7 ★`).
  - Pricing Block: `₹499` in large bold navy (`text-2xl font-black text-[#011A5D]`), strikethrough `₹999`, and green badge `SAVE ₹500 (50% OFF)`.
- **Variant Selectors**:
  - Size pills: `S`, `M`, `L`, `XL`, `XXL` with active selection ring and diagonal slash for out-of-stock variants.
  - Color swatches: Circular color dots with active border checkmark.
- **Sticky Bottom Action Bar**:
  - Fixed mobile bottom bar (`fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 px-4 py-3 flex items-center justify-between gap-3 shadow-lg`):
    - Left price summary: `₹499` + `View Bill Details ▾`.
    - Right dual CTA buttons:
      - `Add to Cart` (`flex-1 border-2 border-[#1668F6] text-[#1668F6] font-bold py-2.5 rounded-xl`).
      - `Buy Now` (`flex-1 bg-[#1668F6] hover:bg-[#1255c8] text-white font-bold py-2.5 rounded-xl shadow-md`).

---

### 📱 3. Mobile PDP Lower Section (`Mob 2.3.png`)
- **Key Specifications Accordion**:
  - Clean collapsible disclosure sections (`border-b border-slate-100 py-3.5`):
    - Product Details (Material, Fit, Pattern, Neck Type, Sleeve Length).
    - Fabric & Care Instructions.
    - Seller & Manufacturer Details.
- **Delivery & Pincode Checker**:
  - Input box with `Check` button (`border border-slate-200 rounded-xl px-3 py-2 flex items-center`).
  - Live result feedback: `Delivery by Tomorrow, 2:00 PM` with green van icon and `FREE Delivery`.
- **Customer Ratings & Reviews Summary**:
  - Overall rating card: Large `4.3` in green badge, `1,248 ratings and 186 reviews`.
  - 5-row star distribution bar (5★, 4★, 3★, 2★, 1★) with proportional green/slate fill bars.
- **Cross-Sell Rail**:
  - Horizontal snap-scroll rail: "Customers Also Viewed" and "Similar Products From This Store" with compact cards.

---

### 💻 4. Desktop Full-Scale Faceted PLP (`Web 2.1.png`, `Web 2.1a.png`)
- **Route:** `apps/web/src/app/products/page.tsx` & `apps/web/src/app/category/[slug]/page.tsx`
- **Layout:** Standard 1440px container (`max-w-7xl mx-auto px-4 py-6 flex gap-6`):
  - **Left Filter Sidebar (`w-64 shrink-0`)**:
    - Accordion filter sections: Categories, Price Range (dual slider + min/max inputs), Discount (% Off chips), Brand checkboxes with search box, Customer Rating (4★+, 3★+).
    - Clear All link at top.
  - **Right Product Grid (`flex-1`)**:
    - Top Toolbar: Breadcrumb path (`Home > Categories > Men's Fashion > T-Shirts`), Results count (`Showing 148 results`), Active Filter Pills row (`Under ₹1000 ✕`, `Cotton ✕`, `Fast Delivery ✕`), and Sort By dropdown (`Relevance`, `Price: Low to High`, `Price: High to Low`, `Newest Arrivals`).
    - 4-column responsive grid (`grid-cols-4 gap-4`).
    - Desktop product card with hover lift effect, secondary image preview on hover, store badge with distance pill, size tags, and "Add to Cart" button.

---

### 💻 5. Desktop PDP Showcase & Key Specs (`Web 2.2.png`, `Web 2.3.png`, `Web 2.3a.png`)
- **Route:** `apps/web/src/app/products/[slug]/page.tsx`
- **Dual-Column Layout (`grid grid-cols-12 gap-8 max-w-7xl mx-auto px-4 py-8`)**:
  - **Left Gallery Column (`col-span-6 sticky top-24 self-start`)**:
    - Vertical thumbnail strip on the left (4–5 thumbnails with blue active indicator ring) + Large zoomable primary photo showcase (`aspect-[4/5] rounded-2xl border border-slate-100 object-cover shadow-sm`).
    - Dual CTA button row below gallery:
      - `Add to Cart` (`h-12 bg-white border-2 border-[#1668F6] text-[#1668F6] font-bold rounded-xl flex items-center justify-center gap-2`).
      - `Buy Now ⚡` (`h-12 bg-[#1668F6] hover:bg-[#1255c8] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md`).
  - **Right Details Column (`col-span-6 space-y-6`)**:
    - Brand title, product name, verified seller card with distance (`⚡ Delivering from Fashion Hub, 1.4 km away`).
    - Pricing block with GST inclusive note.
    - Interactive Promotional Card: `Available Offers` with copyable coupon pills (`WELCOME50`, `FLAT100`).
    - Size selector with live "Size Guide" modal link.
    - Delivery Pincode checker card with live ETA indicator.
    - Key specifications 2-column table (`Web 2.3.png`).
    - 4 Trust Pillars: Genuine Quality, 7-Day Free Returns, Free Delivery, Safe Payments.
    - Customer Ratings & Reviews Section (`Web 2.3a.png`): Star breakdown chart, photo reviews carousel, and verified buyer review cards with "Helpful" vote counters.

---

## 4. Component Architecture & Target File Tree

Vinay should organize all new and enhanced components under `apps/web/src/`:

```text
apps/web/src/
├── app/
│   ├── category/
│   │   ├── [slug]/
│   │   │   ├── page.tsx                     # Faceted PLP route
│   │   │   └── CategoryPlpClient.tsx        # Client orchestrator for Category PLP
│   │   └── page.tsx                         # Existing MobileCategoryExplorer + Desktop Category Hub
│   └── products/
│       ├── [slug]/
│       │   ├── page.tsx                     # Dynamic PDP route
│       │   └── ProductDetailClient.tsx      # Comprehensive PDP Client Orchestrator
│       └── page.tsx                         # Universal Catalog Search & All Products PLP
├── features/
│   ├── catalog/
│   │   ├── CategoryBubbleFilter.tsx         # [NEW] Mobile horizontal circular subcategory bubble rail
│   │   ├── PlpFilterToolbar.tsx             # [NEW] Dual-viewport sorting & chip toolbar
│   │   ├── SidebarFilter.tsx                # Desktop expandable filter accordions
│   │   └── ActiveFilterChips.tsx            # [NEW] Removable active filter tags with Clear All
│   └── pdp/
│       ├── DesktopImageGallery.tsx          # [NEW] Desktop thumbnail rail + zoom showcase
│       ├── MobileProductCarousel.tsx        # [NEW] Mobile 8-dot swipeable image carousel
│       ├── VariantSelector.tsx              # [NEW] Size pills + color swatch matrix
│       ├── ProductSpecsMatrix.tsx           # [NEW] 2-column key specifications grid
│       ├── DeliveryPincodeChecker.tsx       # [NEW] Live delivery ETA lookup with green van icon
│       ├── ProductReviewsSection.tsx        # [NEW] Star rating breakdown + buyer review cards
│       ├── StickyBottomPurchaseBar.tsx      # Mobile sticky footer bar (Add to Cart + Buy Now)
│       └── CrossSellCarousel.tsx            # "Similar Products" recommendation rail
└── stores/
    ├── catalog.store.ts                     # Catalog filter & search state slice
    └── pdp.store.ts                         # [NEW] PDP active variant, gallery index & review filter state
```

---

## 5. Zustand Store Shape (`pdp.store.ts`)

```typescript
// apps/web/src/stores/pdp.store.ts
import { create } from 'zustand';

export interface PdpState {
  selectedSize: string | null;
  selectedColor: string | null;
  activeImageIndex: number;
  deliveryPincode: string;
  isPincodeVerified: boolean;
  estimatedDeliveryDate: string | null;
  isSizeGuideOpen: boolean;
  
  // Actions
  setSelectedSize: (size: string) => void;
  setSelectedColor: (color: string) => void;
  setActiveImageIndex: (index: number) => void;
  setDeliveryPincode: (pincode: string) => void;
  checkPincodeDelivery: (pincode: string) => void;
  setSizeGuideOpen: (open: boolean) => void;
  resetPdpState: () => void;
}
```

---

## 6. MANDATORY White-Label Guardrails

> [!CAUTION]
> **Strict White-Label Compliance Invariant:**
> 1. **Zero Client Brand Leakage:** The client brand name (`Viztore`, `VZT`, or `Zager`) must **NEVER** appear in any source file, template, alt text, or mock data.
> 2. **Always Reference Branding Config:**
>    ```tsx
>    // ✅ CORRECT
>    import { branding } from '@repo/shared-types/branding.config';
>    <title>{product.name} — {branding.appName}</title>
>    
>    // ❌ FORBIDDEN
>    <title>Buy on Viztore</title>
>    ```
> 3. **Generic Identifier Prefixes:**
>    - Products / SKUs: `PRD-10245`, `PRD-COTTON-01` (never `VZT-PRD...`)
>    - Orders: `#ORD-2026-001`
>    - Stores: `STR-401`

---

## 7. Step-by-Step Git Workflow & Verification Commands

Vinay must follow this exact branch and build protocol:

```bash
# 1. Ensure local main is completely up to date
git checkout main
git pull origin main

# 2. Create the assigned feature branch
git checkout -b feature/vinay-catalog-pdp-alignment

# 3. Implement components and test Next.js App Router locally
pnpm --filter @repo/web dev

# 4. Verify TypeScript compilation and production build (0 errors required)
pnpm --filter @repo/web build

# 5. Run automated monorepo tests
pnpm test

# 6. Commit with an impersonal conventional commit message
git add .
git commit -m "feat(web): align plp and pdp with user front design specifications"

# 7. Push branch and open Pull Request for review
git push origin feature/vinay-catalog-pdp-alignment
```

---

## 8. Definition of Done (Acceptance Criteria)

- [ ] All 8 mockups (`Mob 2.1`–`2.3` and `Web 2.1`–`2.3a`) visually matched with pixel-level precision.
- [ ] Responsive dual-viewport coherence: Clean mobile layout on `< 768px`, rich multi-column layouts on `≥ 1024px`.
- [ ] Interactive variant selection (size, color, quantity) connected to global cart store.
- [ ] Live pincode delivery estimation with valid Indian PIN code regex validation (6 digits).
- [ ] 100% White-Label compliance — zero instances of client brand names.
- [ ] Clean production build: `pnpm --filter @repo/web build` passes with 0 errors across all 32 static routes.
- [ ] All 182/182 automated monorepo tests passing without regressions.

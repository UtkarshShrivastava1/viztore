# 🏪 TASK BRIEF: Hyperlocal Stores Directory & Dedicated Storefront Alignment

**Task ID:** `TASK-VIN-15`  
**Assignee:** Vinay Kumar ([`@VVinaykumar003`](https://github.com/VVinaykumar003))  
**Target Workspace:** `apps/web/` (Next.js 14+ App Router + Tailwind CSS + Zustand)  
**Target Feature Branch:** `feature/vinay-stores-directory-storefront`  
**Assigned Date:** October 25, 2026 (Queued in Advance)  
**Target Delivery Window:** 2 Days  
**Lead Architect:** Utkarsh Shrivastava / Senior Co-Pilot Agent  
**Design Reference Root:** `mockups/User_Front/3.) Stores near me/` (**4 Mockup Screens**)

---

## 1. Executive Summary & Objective

In **Task 15**, Vinay will achieve **100% pixel-perfect visual alignment** for the **Hyperlocal Store Discovery and Dedicated Store Storefront** ecosystem across both Mobile and Desktop viewports:

1. **Hyperlocal "Stores Near Me" Directory (`Mob 3.0.png`, `Web 1.4.png`)**:
   - Location-aware store directory listing nearby verified shops within the 3–4 km delivery radius.
   - Filter chips (All, Fashion, Electronics, Grocery, Pharmacy, Daily Essentials), delivery radius slider, and store cards showing live distance, delivery ETA, operational status (`OPEN NOW ●`), rating score, and top product mini-carousels.
2. **Dedicated Store Storefront Hub (`Mob 3.1.png`, `Web 3.1.png`)**:
   - Immersive retailer storefront (`/stores/[slug]`) with branded 16:9 banner cover, floating store identity pill, verified seller badge, store address, and contact links.
   - Scoped in-store search ("Search in this store..."), internal shelf tabs (`All Items`, `New Arrivals`, `Best Deals`), and 4-column desktop / 2-column mobile product cards enforcing single-store cart clarity.

---

## 2. Mockup Reference Mapping Table

| # | Mockup Filename | Viewport | Target Route / Component | Primary Visual & Functional Scope |
|:---:|---|:---:|---|---|
| **1** | `Mob 3.0.png` | **Mobile** (`< 768px`) | `app/stores/page.tsx`<br>`app/stores/fashion/page.tsx` | **Mobile Stores Near You Directory**: Location bar with distance radius chips (`Within 2 km`, `Within 4 km`), horizontal category filter pills, store cards with delivery badges (`⚡ 15 mins • 0.8 km`), rating pills, top 3 product thumbnails, and "Visit Store →" action button. |
| **2** | `Mob 3.1.png` | **Mobile** (`< 768px`) | `app/stores/[slug]/page.tsx` | **Mobile Dedicated Storefront**: Full-width store cover banner, store avatar logo with verified badge, distance & timing chips, in-store search bar, promotional discount voucher card (`Use code STORE10`), internal category tabs, and 2-column product shelves. |
| **3** | `Web 1.4.png` | **Desktop** (`≥ 1024px`) | `app/stores/page.tsx`<br>`app/stores/fashion/page.tsx` | **Desktop Stores Near Me Directory**: Left filter sidebar (distance radius slider, category checkboxes, rating filter `4★+`, "Open Now" toggle), breadcrumb trail, and 3-column store cards with 16:9 banner preview, verified badge, rating, delivery ETA, and "Explore Store" button. |
| **4** | `Web 3.1.png` | **Desktop** (`≥ 1024px`) | `app/stores/[slug]/page.tsx` | **Desktop Dedicated Storefront Hub**: Wide 1920×400 store cover banner, floating store card (name, verified badge, store address, phone, timings `9 AM - 10 PM`, rating badge `4.8 ★`), scoped in-store search, sticky sub-navigation tabs (`All Products`, `New Arrivals`, `Discounts`, `About Store`), and 4-column product grid. |

---

## 3. Screen-by-Screen Detailed Technical Specifications

### 📱 1. Mobile Stores Near You Directory (`Mob 3.0.png`)
- **Route:** `apps/web/src/app/stores/page.tsx` & `apps/web/src/app/stores/fashion/page.tsx`
- **Location Context Header**:
  - Location pill: `Delivering to Nehru Nagar, Bhilai ▾` with blue map pin icon.
  - Subtitle: `Showing 14 stores within 3.5 km delivery radius`.
- **Category Filter Chips**:
  - Horizontal scrollable pill row (`flex gap-2 overflow-x-auto py-2.5 px-3`):
    - `All Stores` (active: `bg-[#011A5D] text-white`).
    - `Fashion & Apparel` (inactive: `bg-slate-100 text-slate-700`).
    - `Electronics`
    - `Grocery & Staples`
    - `Pharmacy & Wellness`
- **Mobile Store Card**:
  - Rounded card (`rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm space-y-3`):
    - Top Row: Circular store avatar (`w-12 h-12 rounded-xl border border-slate-100 object-cover`), store name, verified blue badge, category text, and green operational status dot (`● OPEN NOW`).
    - Badges Row: Distance badge (`0.8 km • 15 mins`), star rating (`4.8 ★ (320)`), free delivery pill (`FREE Delivery on ₹199+`).
    - Bottom Mini-Product Showcase: 3 small square product thumbnails (`w-16 h-16 rounded-lg object-cover bg-slate-50 border border-slate-100`) showing top in-stock products with small price tags.
    - Full-width CTA button: `Visit Store →` (`w-full py-2 bg-slate-50 hover:bg-slate-100 text-[#1668F6] font-semibold text-xs rounded-xl flex items-center justify-center gap-1 border border-slate-200`).

---

### 📱 2. Mobile Dedicated Store Storefront (`Mob 3.1.png`)
- **Route:** `apps/web/src/app/stores/[slug]/page.tsx`
- **Store Hero Showcase**:
  - Top 16:9 cover image with soft overlay gradient.
  - Floating store identity card: Circular store logo with verified checkmark, store title, category tags (`Men's & Women's Fashion`), and distance pill (`⚡ 1.2 km away • Delivers in 20 mins`).
- **In-Store Scoped Search Bar**:
  - Sticky search bar (`sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-100 py-2 px-3`):
    - Input: `Search products in Fashion Hub...` with magnifying glass.
- **Store Promotional Card**:
  - Voucher pill: `Use coupon STORE10 to get 10% off on orders above ₹499` with 1-click copy trigger.
- **Internal Category Tabs**:
  - Horizontal tab rail (`flex gap-2 overflow-x-auto py-2 px-3 border-b border-slate-100`):
    - `All Products`, `New Arrivals 🔥`, `T-Shirts`, `Jeans`, `Footwear`.
- **Product Shelves Grid**:
  - 2-column product grid with store badge, pricing, and instant `Add +` stepper.

---

### 💻 3. Desktop Stores Near Me Directory (`Web 1.4.png`)
- **Route:** `apps/web/src/app/stores/page.tsx`
- **Layout:** Standard 1440px container (`max-w-7xl mx-auto px-4 py-8 flex gap-8`):
  - **Left Filter Sidebar (`w-72 shrink-0 space-y-6`)**:
    - Distance Slider: Interactive slider (`1 km` to `5 km`, default `4 km`).
    - Category Checkboxes: Multi-select checkboxes with counts (`Fashion (8)`, `Electronics (4)`, `Grocery (12)`).
    - Status Filter: `Open Now Only` toggle switch.
    - Rating Filter: Radio buttons (`4.5★ and above`, `4.0★ and above`, `All`).
  - **Right Store Grid (`flex-1`)**:
    - Header Toolbar: Title `Hyperlocal Stores Near You`, location pill, and sort dropdown (`Nearest First`, `Highest Rated`, `Fastest Delivery`).
    - 3-column store card grid (`grid-cols-3 gap-6`):
      - 16:9 wide cover photo with store status tag (`Open Now ●` in green or `Opens at 10 AM` in amber).
      - Circular store logo overlapping cover photo with verified checkmark badge.
      - Store name, primary category, distance tag (`0.8 km`), rating badge (`4.8 ★`).
      - Featured product pills row.
      - Solid CTA: `Explore Store →` (`h-10 bg-[#1668F6] hover:bg-[#1255c8] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-sm`).

---

### 💻 4. Desktop Dedicated Store Storefront Hub (`Web 3.1.png`)
- **Route:** `apps/web/src/app/stores/[slug]/page.tsx`
- **Wide Store Cover Banner**:
  - Hero banner (`w-full h-80 rounded-3xl overflow-hidden relative shadow-md`):
    - High-resolution store interior / brand cover photo.
    - Bottom gradient fade for text legibility.
- **Floating Store Profile Matrix**:
  - Card overlapping bottom of cover photo (`max-w-6xl mx-auto -mt-16 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-100 p-6 shadow-xl flex items-center justify-between`):
    - Left: Store logo avatar (`w-24 h-24 rounded-2xl border-4 border-white shadow-md object-cover`), store name, verified retailer badge, address (`Shop #12, Commercial Complex, Nehru Nagar West, Bhilai`), and phone/support link.
    - Right Stats Matrix: Rating pill (`4.8 ★ (428 reviews)`), delivery ETA (`⚡ 15–20 Mins`), operating hours (`9:00 AM – 10:00 PM`), and min order (`Min. Order ₹99`).
- **In-Store Navigation & Search Toolbar**:
  - Scoped search input with filter dropdown.
  - Sticky category tabs (`All Items`, `New Arrivals`, `Best Deals`, `About Store & Policies`).
- **4-Column Product Shelf Grid**:
  - Curated in-store product grid (`grid-cols-4 gap-6`).
  - Single-store cart guarantee: Clear badge showing items added will be fulfilled together by this store.

---

## 4. Component Architecture & Target File Tree

Vinay should organize components under `apps/web/src/features/stores/`:

```text
apps/web/src/
├── app/
│   └── stores/
│       ├── page.tsx                     # Hyperlocal Stores Directory (All & Near Me)
│       ├── fashion/
│       │   └── page.tsx                 # Category-scoped Stores Directory
│       └── [slug]/
│           ├── page.tsx                 # Dedicated Store Page Route
│           └── StoreStorefrontClient.tsx# Dedicated Storefront Client Orchestrator
├── features/
│   └── stores/
│       ├── StoreDirectoryCard.tsx       # Desktop 3-column store card
│       ├── MobileStoreCard.tsx          # [NEW] Mobile compact store card with top 3 thumbnails
│       ├── StoresFilterSidebar.tsx      # [NEW] Desktop radius slider, category & rating filters
│       ├── MobileStoreFilterChips.tsx   # [NEW] Mobile horizontal category & radius chips
│       ├── StoreHeroBanner.tsx          # Dual-viewport 16:9 store cover photo with overlay
│       ├── StoreProfileCard.tsx         # Floating verified store identity and rating card
│       ├── InStoreSearchBar.tsx         # [NEW] Scoped in-store search with coupon banner
│       └── StoreShelfSection.tsx        # In-store categorized product shelf grid
└── stores/
    └── store.store.ts                   # Zustand slice for store directory filters & search
```

---

## 5. MANDATORY White-Label Guardrails

> [!CAUTION]
> **Strict White-Label Compliance Invariant:**
> 1. **Zero Client Brand Leakage:** The client brand name (`Viztore`, `VZT`, or `Zager`) must **NEVER** appear in any source file, template, alt text, or mock data.
> 2. **Always Reference Branding Config:**
>    ```tsx
>    // ✅ CORRECT
>    import { branding } from '@repo/shared-types/branding.config';
>    <title>{store.name} — Shop Local on {branding.appName}</title>
>    
>    // ❌ FORBIDDEN
>    <title>{store.name} on Viztore</title>
>    ```
> 3. **Generic Identifier Prefixes:**
>    - Stores: `STR-101`, `STR-401` (never `VZT-STR...`)
>    - Products / SKUs: `PRD-10245`
>    - Orders: `#ORD-2026-001`

---

## 6. Step-by-Step Git Workflow & Verification Commands

Vinay must follow this exact branch and build protocol:

```bash
# 1. Ensure local main is completely up to date
git checkout main
git pull origin main

# 2. Create the assigned feature branch
git checkout -b feature/vinay-stores-directory-storefront

# 3. Implement components and test Next.js App Router locally
pnpm --filter @repo/web dev

# 4. Verify TypeScript compilation and production build (0 errors required)
pnpm --filter @repo/web build

# 5. Run automated monorepo tests
pnpm test

# 6. Commit with an impersonal conventional commit message
git add .
git commit -m "feat(web): align stores directory and dedicated storefront with design specifications"

# 7. Push branch and open Pull Request for review
git push origin feature/vinay-stores-directory-storefront
```

---

## 7. Definition of Done (Acceptance Criteria)

- [ ] All 4 mockups (`Mob 3.0`, `Mob 3.1`, `Web 1.4`, `Web 3.1`) visually matched with pixel-level precision.
- [ ] Responsive dual-viewport coherence: Clean mobile layout on `< 768px`, rich multi-column layouts on `≥ 1024px`.
- [ ] Working distance radius slider and category filter chips updating store results in real-time.
- [ ] Scoped in-store search filtering products specifically within the active store.
- [ ] 100% White-Label compliance — zero instances of client brand names.
- [ ] Clean production build: `pnpm --filter @repo/web build` passes with 0 errors across all 32 static routes.
- [ ] All 182/182 automated monorepo tests passing without regressions.

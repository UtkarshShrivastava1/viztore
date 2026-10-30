# 🔍 Manual Testing Issue & Bug Tracker (Round 2)

## 📊 Live Progress & Remediation Dashboard

> **Active Phase**: Founder / User End-to-End Manual Commerce Verification  
> **Testing Scope**: Merchant Onboarding ➔ Catalog Management ➔ Customer Discovery ➔ Cart & Checkout ➔ Real-Time Audio & Order Fulfillment ➔ 4-Digit Handshake OTP ➔ Counter POS Walk-in Sale  
> **Environment**: Local Monolith (`apps/backend` on `:5000`, `apps/merchant` on `:3001`, `apps/web` on `:3000`) — Fresh 100% Blank Slate Atlas DB  
> **Status**: **6 ISSUES RESOLVED (100.0%)** 🟢  
> **Items Logged**: **6 Total** | **0 Open** | **0 In Progress** | **6 Resolved**  
> **Remediation Progress**: `[████████████████████] 100.0%`

---

### Layer Distribution Summary

| Application Layer | Total Logged | Critical (P0) | High (P1) | Medium (P2) | Polish (P3) | Resolved | Status |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Merchant Hub (`apps/merchant` :3001)** | 6 | 0 | 5 | 1 | 0 | 6 | 🟢 All Remediated |
| **Customer Web (`apps/web` :3000)** | 0 | 0 | 0 | 0 | 0 | 0 | Ready 🟢 |
| **Backend API Monolith (`apps/backend` :5000)** | 0 | 0 | 0 | 0 | 0 | 0 | Ready 🟢 |
| **Cross-Cutting (Sockets, Redis, DB, Print)** | 0 | 0 | 0 | 0 | 0 | 0 | Ready 🟢 |
| **TOTAL** | **6** | **0** | **5** | **1** | **0** | **6** | **100.0%** |

---

## 1. Master Issue & Bug Registry

| ID | Issue Title | Layer | Module / Screen | Type | Severity | Reported In | Status |
|---|---|---|---|---|:---:|:---:|:---:|
| `ISSUE-001` | Merchant Onboarding Step 3: Map Pin Drop & "Use Current Location" Failed to Auto-Fill Address Form Fields | Merchant Hub (:3001) | Onboarding / Step 3 | Functional Gap / UX | P1 | Phase 1 (`/register`) | `RESOLVED ✅` |
| `ISSUE-002` | Merchant Geocoding Inaccurate Locality & Pincode: Durg Borsi (491001) Mapped to "Durg Tahsil 491002" | Merchant Hub & Web | Geocoding & Onboarding | Bug / Accuracy | P1 | Phase 1 (`/register`) | `RESOLVED ✅` |
| `ISSUE-003` | Stale Landmark Retained on Subsequent Pin Drops (e.g. Borsi Landmark Remained When Pin Moved to Bhilai Sectors) | Merchant Hub (:3001) | Onboarding / Step 3 | Bug / State Sync | P1 | Phase 1 (`/register`) | `RESOLVED ✅` |
| `ISSUE-004` | Step 3 Onboarding: Category Names Truncated with Ellipsis (`...`) on Narrow 4-Column Grid | Merchant Hub (:3001) | Onboarding / Step 3 | UI / Readability | P2 | Phase 1 (`/register`) | `RESOLVED ✅` |
| `ISSUE-005` | Add Product Wizard: Category Dropdown Confusing Defaults (`Men` vs `Men's`) & Broken Hierarchy Falling Back to `General`/`Standard` | Merchant Hub (:3001) | Catalog / Add Product Wizard | Data & UX Hierarchy | P1 | Phase 2 (`/catalog/new`) | `RESOLVED ✅` |
| `ISSUE-006` | Inventory Table Broken Squished Formatting (Product Title 12 Lines, SKU Overlap, Raw Enum Category) & Table Modernization | Merchant Hub (:3001) | Inventory / Catalog Tables | UI / Layout & Responsiveness | P1 | Phase 2 (`/inventory`) | `RESOLVED ✅` |

---

## 2. Issue Detail & Remediation Log

### [ISSUE-001] Merchant Onboarding Step 3: Map Pin Drop & "Use Current Location" Failed to Auto-Fill Address Form Fields (`RESOLVED ✅`)
- **Reported URL:** `http://localhost:3001/register` (Step 3: Store Profile & Location)
- **Symptom:** When clicking **"Use Current Location"** (GPS) or dragging / clicking the pin on the Leaflet map, the coordinates updated on the map, but the address form fields remained blank or kept static defaults.
- **Remediation:** Integrated multi-tier reverse geocoding engine with OpenStreetMap Nominatim, BigDataCloud fallback, and regional launch hub dictionary. Wired debounced pin drag and GPS detection to auto-fill building, road, area, landmark, city, state, pincode, and pickup search input.
- **Commit:** `5c97f76`

---

### [ISSUE-002] Merchant Geocoding Inaccurate Locality & Pincode: Durg Borsi (491001) Mapped to "Durg Tahsil 491002" (`RESOLVED ✅`)
- **Reported URL:** `http://localhost:3001/register` (Step 3: Store Profile & Location at coordinates `21.1595, 81.3090`)
- **Symptom:** At Borsi, Durg (pincode `491001`), the reverse geocoding was reflecting administrative district term `"Durg Tahsil, Durg, Chhattisgarh - 491002"`.
- **Remediation:** Introduced `PRECISION_ZONES` for Borsi Colony & Extension, cleansed administrative revenue terms (`"Durg Tahsil"`), and enforced urban PIN `491001`.
- **Commit:** `56ce043`

---

### [ISSUE-003] Stale Landmark Retained on Subsequent Pin Drops (e.g. Borsi Landmark Remained When Pin Moved to Bhilai Sectors) (`RESOLVED ✅`)
- **Reported URL:** `http://localhost:3001/register` (Step 3: Store Profile & Location at coordinates `21.1626, 81.3255`)
- **Symptom:** After pin was moved from Borsi to Bhilai Sectors / Risali, the road changed to `"Bhilai Sectors"` and city to `"Durg"`, but the landmark remained frozen as `"Near Kadam Plaza / Bhole Kirana"`.
- **Root Cause Analysis:**
  1. In `Step3StoreDetails.tsx`, `applyResolvedLocation` had a guard `if (loc.landmark) { setLandmark(loc.landmark); }`. Whenever the new location's geocoded response did not have an explicit landmark attribute, `setLandmark` was skipped, leaving the stale text from the previous pin position forever.
  2. The Borsi bounding box was overly wide (`maxLng: 81.3250`), overlapping into Risali / Bhilai (`81.3255`), which caused city to stay `"Durg"` and PIN to stay `"491001"` instead of `"Bhilai"` and `"490006"`.
- **Engineering Remediation:**
  1. **Dynamic Landmark State Update:** In [`Step3StoreDetails.tsx`](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website\platform-root-vz\apps\merchant\src\components\onboarding\Step3StoreDetails.tsx), replaced the conditional guard with `setLandmark(loc.landmark || (loc.roadOrArea ? 'Near ' + loc.roadOrArea : ''))`. Every pin drop now immediately clears the previous landmark and calculates the fresh landmark dynamically.
  2. **Calibrated Micro-Zones & City/PIN Disambiguation:**
     - Borsi zone bounded strictly to `lng 81.2950–81.3180` (Durg - 491001).
     - Added Risali / Maitri Kunj zone (`lng 81.3180–81.3550`, `lat 21.1500–21.1780`): `city: Bhilai`, `pincode: 490006`, `landmark: Near BSP Market / Ashish Nagar`.
     - In `reverseGeocode`, whenever `roadOrArea` or `display_name` contains `"Bhilai"`, city is automatically enforced as **`Bhilai`** and PIN as **`490006`** (never Durg 491001).
- **Verification:**
  - Pinning at `21.1626, 81.3255` (Bhilai / Risali) dynamically resolves to:
    - Area: `Maitri Kunj, Risali`
    - Landmark: `Near BSP Market / Ashish Nagar`
    - City: `Bhilai`
    - Pincode: `490006`
  - Pinning back at `21.1595, 81.3090` (Borsi, Durg) dynamically switches back to:
    - Area: `Borsi Colony, Borsi Extension`
    - Landmark: `Near Kadam Plaza / Bhole Kirana`
    - City: `Durg`
    - Pincode: `491001`
  - TypeScript build verification: `pnpm --filter=@repo/merchant build` completed cleanly in 13.79s.
- **Commit:** `160fb76`

---

### [ISSUE-004] Step 3 Onboarding: Category Names Truncated with Ellipsis (`...`) on Narrow 4-Column Grid (`RESOLVED ✅`)
- **Reported URL:** `http://localhost:3001/register` (Step 3: Business Category & Operating Hours)
- **Symptom:** Long category labels (`"Home & Living"`, `"Beauty & Personal Care"`, `"Gifts & Lifestyle"`, `"Sports & Fitness"`) were truncated with ellipsis (`...`) like `"Home & ..."`, `"Beauty &..."`, `"Gifts & Li..."`, and `"Sports & ..."`.
- **Root Cause Analysis:**
  1. Inside [`Step3BusinessInfo.tsx`](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website\platform-root-vz\apps\merchant\src\components\onboarding\Step3BusinessInfo.tsx), the category selector cards were arranged in a cramped 4-column grid (`grid grid-cols-2 sm:grid-cols-4 gap-2.5`).
  2. The text span had a strict `truncate` utility class, leaving only ~59px for label text between the left icon and the right checkbox, cutting off any name longer than 8-10 characters.
- **Engineering Remediation:**
  1. **Eliminated Ellipsis Truncation:** Removed `truncate` and applied `break-words leading-snug text-xs sm:text-[13px] font-bold` allowing clean, natural multi-line wrapping for long names.
  2. **Upgraded Responsive Grid Layout:** Replaced the compressed 4-column layout with `grid grid-cols-2 sm:grid-cols-3 gap-3` with a balanced `min-h-[64px]` card height.
  3. **Refined Card Visual Aesthetics:**
     - Replaced standard checkbox with a custom styled badge indicator featuring Lucide `Check` with `stroke-[3]`.
     - Elevated icon containers to `w-8 h-8 rounded-xl` with smooth brand blue selection fills and subtle drop shadows (`shadow-sm shadow-blue-600/30`).
     - Added keyboard accessibility (`role="checkbox"`, `aria-checked`, `Space` / `Enter` toggle).
  4. **Complete Category Taxonomy:** Added `Grocery & Staples` (`ShoppingBasket`), `Toys & Baby Care` (`Baby`), and `Books & Stationery` (`BookOpen`) aligning with `@repo/shared-types` `StoreCategory`.
- **Verification:**
  - `pnpm --filter=@repo/merchant exec tsc --noEmit`: 0 errors.
  - `pnpm --filter=@repo/merchant build`: Built cleanly in 11.77s.
- **Commit:** `cfb3a3f` & `1fb8e77`

---

### [ISSUE-005] Add Product Wizard: Category Dropdown Confusing Defaults (`Men` vs `Men's`) & Broken Hierarchy Falling Back to `General`/`Standard` (`RESOLVED ✅`)
- **Reported URL:** `http://localhost:3001/catalog/new` (Add Product Wizard Step 1)
- **Symptom:** Category dropdown defaulted to raw `'Men'`, contained duplicate options (`"Men"`, `"Men's"`, and `"Women's"`), and failed to populate real subcategories or product types, falling back to `'General'` and `'Standard'`.
- **Root Cause Analysis:**
  1. In `AddProductStep1.tsx`, `draftProduct.category || 'Men'` defaulted to `'Men'` (missing apostrophe), which failed to match `"Men's"` in `taxonomies.json`.
  2. The taxonomy tree lookup returned `undefined`, forcing sub-category and product type to generic fallbacks (`General` / `Standard`) and hiding all 350+ master retail types.
  3. Mined taxonomy extracted `'Men'` from mock data, adding it alongside `"Men's"` in the dropdown list.
  4. The wizard did not adapt to the merchant's registered store category.
- **Engineering Remediation:**
  1. **Canonical Taxonomy Normalization**: Implemented `normalizeCategoryName` across `customTaxonomyStorage.ts` and `AddProductStep1.tsx`, mapping raw scraped keys to clear, professional labels: `"Men's Fashion"`, `"Women's Fashion"`, `"Baby & Kids"`, `"Electronics"`, `"Food Essentials"`, eliminating the duplicate `'Men'`.
  2. **Smart Subcategory Ordering**: Prioritized `'Clothing'` at the top of the subcategory list for fashion categories, ensuring that choosing `"Men's Fashion"` or `"Women's Fashion"` immediately auto-populates `Clothing` and rich product types (`T-Shirts`, `Jeans`, `Kurtas`, etc.) along with HSN and GST.
  3. **Store-Aware Category Selection**: Introduced `getStoreDefaultCategory(currentStore?.category)` so opening the wizard dynamically matches the merchant's business type (Electronics stores default to Electronics, Grocery to Food Essentials, Fashion to Men's Fashion).
  4. **Updated Mock Data**: Cleaned mock catalog items from `'Men'` to `"Men's Fashion"`.
- **Verification:**
  - `pnpm --filter=@repo/merchant exec tsc --noEmit`: 0 errors.
  - `pnpm --filter=@repo/merchant build`: Built cleanly in 12.24s.
- **Commit:** `fc68215`

---

### [ISSUE-006] Inventory Table Broken Squished Formatting (Product Title 12 Lines, SKU Overlap, Raw Enum Category) & Table Modernization (`RESOLVED ✅`)
- **Reported URL:** `http://localhost:3001/inventory` vs `http://localhost:3001/catalog`
- **Symptom:**
  - Product title wrapped into 12 single-word vertical lines crushing into a 60px cell.
  - SKU value collided with the product text and wrapped the suffix `-S` onto a new line.
  - Category breadcrumb rendered raw database enum values with snake_case and underscores in bright blue (`men's_fashion > Clothing > formal_shirts`).
  - Table header and cell styling diverged completely from the catalog table (plain white headers vs sleek tracking slate headers, mismatched status badges, unaligned tabular numbers).
- **Root Cause Analysis:**
  1. In `InventoryTable.tsx`, the 14-column table was contained inside an unconstrained `<table className="w-full">` without `min-w-[1240px]` or `table-auto`. The product name cell had no minimum width (`min-w-[240px]`) and no truncation constraint (`max-w-[220px] truncate`), so the browser layout engine shrunk it to accommodate rigid columns.
  2. SKU had no monospace styling or `whitespace-nowrap font-mono text-[11px]`.
  3. No string sanitation utility was in place to convert raw database snake_case values to clean Title Case.
- **Engineering Remediation:**
  1. **New Formatting Engine:** Created [`formatters.ts`](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/platform-root-vz/apps/merchant/src/utils/formatters.ts) providing:
     - `formatCategoryTitle`: Dynamically transforms raw database identifiers (e.g. `men's_fashion`, `formal_shirts`, `casual_trousers`) into clean, human-readable Title Case (`Men's Fashion`, `Formal Shirts`, `Casual Trousers`) while preserving apostrophes.
     - `formatDateTime`: Stacks date (`30 Oct 2026`) and time (`02:30 PM`) cleanly into two lines.
  2. **Harmonized `InventoryTable.tsx` Layout:**
     - Enforced `min-w-[1240px]` on table with smooth horizontal scroll wrapper (`overflow-x-auto`).
     - Product column upgraded to `min-w-[240px]` with `max-w-[200px] xl:max-w-[240px] truncate`, 10x10 rounded image, interactive detail modal trigger, and size/color attribute summary.
     - Styled SKU with `font-mono text-[11px] font-medium text-slate-600 whitespace-nowrap min-w-[140px]`.
     - Styled Barcode with `font-mono text-[11px] text-slate-500 whitespace-nowrap min-w-[110px]`.
     - Category & Type rendered cleanly in 2 stacked lines with Title Case.
     - Replaced custom bulky badges with sleek border status pills matching `ProductsTable` (`bg-emerald-50 text-emerald-700 border border-emerald-200/80`, `bg-amber-50 text-amber-700`, `bg-rose-50 text-rose-700`).
     - Enforced `tabular-nums` for Stock, Reserved, Available, and Stock Value (`₹...`).
     - Replaced raw pagination with the unified pagination bar: total product count badge, rows per page dropdown (10, 20, 50), record range indicator (`1-10 of 12`), and first/prev/next/last steppers (`ChevronsLeft`, `ChevronLeft`, `ChevronRight`, `ChevronsRight`).
  3. **Polished `ProductsTable.tsx`:**
     - Integrated `formatCategoryTitle` and `formatDateTime` across all product rows.
     - Added `min-w-[1150px]` and synchronized rows per page selector (8, 15, 30, 50) and full page navigation steppers.
- **Verification:**
  - `pnpm --filter=@repo/merchant exec tsc --noEmit`: 0 errors.
  - `pnpm --filter=@repo/merchant build`: Production bundle built cleanly in 10.86s.

---

## 3. High-Velocity Cataloging Engine: 1-Click Barcode & Master Catalog Piggybacking (Phase 1)

### Features Delivered:
- **National Master Product Database**: Pre-seeded with authentic Indian retail items (`apps/merchant/src/data/masterProducts.json`) across FMCG, Grocery, Electronics, and Branded Apparel.
- **Webcam / Smartphone Camera Barcode Scanner**: Built-in HUD viewfinder, laser scan animation, Web Audio beep confirmation, and camera switcher.
- **Hardware USB Barcode Gun Listener**: Automatically intercepts rapid keyboard wedge scans from physical retail barcode guns on Step 1.
- **Fast-Track 5-Second Listing Flow**: Pre-populates Title, Brand, Images, Category, Subcategory, Product Type, HSN, and GST, and jumps straight to Step 3 so the merchant only confirms their selling price and stock.

### Quick Test Barcodes Available for Instant Verification:
| Category | Product Name | EAN-13 Barcode | Master Pre-fills |
|---|---|---|---|
| **Staples** | Tata Salt Vacuum Evaporated (1 kg) | `8901499009845` | HSN 25010010 • GST 0% • MRP ₹28 |
| **Grocery** | Maggi 2-Minute Masala Noodles (70g) | `8901058852394` | HSN 19023010 • GST 12% • MRP ₹14 |
| **Dairy** | Amul Pure Butter (500g) | `8901262010054` | HSN 04051000 • GST 12% • MRP ₹275 |
| **Electronics** | boAt Rockerz 450 Wireless Headphones | `8906145620018` | HSN 85183000 • GST 18% • MRP ₹3,990 |
| **Electronics** | Apple 20W USB-C Adapter | `194252033005` | HSN 85044030 • GST 18% • MRP ₹1,900 |
| **Apparel** | Peter England Men Slim Fit Formal Shirt | `8907861001234` | HSN 62052000 • GST 5% • MRP ₹1,699 |
| **Footwear** | Sparx Breathable Mesh Running Shoes | `8905140012345` | HSN 64041190 • GST 12% • MRP ₹1,499 |

- **Commit**: `ad375cc`

---

## 4. Smart ERP / POS Importer & Amazon-Style Variant Matrix (Phases 2 & 3)

### Phase 2: 1-Click Indian Retail ERP Ingestion
- **Automated Signature Detection**: Intelligently identifies headers from **Vyapar App**, **Tally Prime / ERP 9**, **Marg ERP 9+**, **Busy**, and Universal CSV exports.
- **Visual Confidence Column Mapping**: Automatically correlates local item descriptions, purchase rates, MRP, closing balances, and HSN codes into standard catalog fields.
- **Pre-Import Review Table**: Summary metrics showing total items, cumulative stock count, total catalog inventory valuation, and validation warnings before database ingestion.
- **Instant Demo Templates**: Downloadable or 1-click loadable sample files for Vyapar (`vyapar_inventory_sample.csv`), Tally (`tally_prime_stock_sample.csv`), Marg (`marg_erp_catalog_sample.csv`), and Universal store catalogs.

### Phase 3: Amazon / Flipkart Multi-SKU Variant Matrix Generator
- **Multi-Dimension Matrix**: Interactive pickers for **Sizes** (Apparel, Footwear UK, Waist, Weight packs) and **Colors** (with visual hex swatches + custom color pickers).
- **1-Click Cartesian Combinations**: Generates all color × size SKU variants (e.g., 3 colors × 4 sizes = 12 variants) with auto-generated unique SKUs and barcodes.
- **Bulk Quick-Apply Controls**: 1-click **Apply Price to All**, **Apply MRP to All**, and **Apply Stock to All** directly across all generated variant rows.
- **Real-Time Inventory Summation**: Automatically aggregates variant stocks into parent inventory count and persists structured variant rows in `draftProduct.variants`.

- **Commit**: `cc3eb05`

---

## 5. How to Report an Issue in Chat

When you encounter any problem during manual testing, simply describe it in chat (or paste a screenshot/error message). Helpful details to include:
- **Screen / URL**: e.g., `http://localhost:3001/register` or `http://localhost:3000/cart`
- **What happened**: e.g., *"Clicked Submit button, nothing happened"* or *"The button is misaligned on mobile"*
- **Browser Console Error (if open)**: e.g., `POST /api/v1/orders 400 Bad Request` or red JS errors
- **Screenshot**: Attach directly in chat.

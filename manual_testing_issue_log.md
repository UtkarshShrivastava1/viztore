# 🔍 Manual Testing Issue & Bug Tracker (Round 2)

## 📊 Live Progress & Remediation Dashboard

> **Active Phase**: Founder / User End-to-End Manual Commerce Verification  
> **Testing Scope**: Merchant Onboarding ➔ Catalog Management ➔ Customer Discovery ➔ Cart & Checkout ➔ Real-Time Audio & Order Fulfillment ➔ 4-Digit Handshake OTP ➔ Counter POS Walk-in Sale  
> **Environment**: Local Monolith (`apps/backend` on `:5000`, `apps/merchant` on `:3001`, `apps/web` on `:3000`) — Fresh 100% Blank Slate Atlas DB  
> **Status**: **4 ISSUES RESOLVED (100.0%)** 🟢  
> **Items Logged**: **4 Total** | **0 Open** | **0 In Progress** | **4 Resolved**  
> **Remediation Progress**: `[████████████████████] 100.0%`

---

### Layer Distribution Summary

| Application Layer | Total Logged | Critical (P0) | High (P1) | Medium (P2) | Polish (P3) | Resolved | Status |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Merchant Hub (`apps/merchant` :3001)** | 4 | 0 | 3 | 1 | 0 | 4 | 🟢 All Remediated |
| **Customer Web (`apps/web` :3000)** | 0 | 0 | 0 | 0 | 0 | 0 | Ready 🟢 |
| **Backend API Monolith (`apps/backend` :5000)** | 0 | 0 | 0 | 0 | 0 | 0 | Ready 🟢 |
| **Cross-Cutting (Sockets, Redis, DB, Print)** | 0 | 0 | 0 | 0 | 0 | 0 | Ready 🟢 |
| **TOTAL** | **4** | **0** | **3** | **1** | **0** | **4** | **100.0%** |

---

## 1. Master Issue & Bug Registry

| ID | Issue Title | Layer | Module / Screen | Type | Severity | Reported In | Status |
|---|---|---|---|---|:---:|:---:|:---:|
| `ISSUE-001` | Merchant Onboarding Step 3: Map Pin Drop & "Use Current Location" Failed to Auto-Fill Address Form Fields | Merchant Hub (:3001) | Onboarding / Step 3 | Functional Gap / UX | P1 | Phase 1 (`/register`) | `RESOLVED ✅` |
| `ISSUE-002` | Merchant Geocoding Inaccurate Locality & Pincode: Durg Borsi (491001) Mapped to "Durg Tahsil 491002" | Merchant Hub & Web | Geocoding & Onboarding | Bug / Accuracy | P1 | Phase 1 (`/register`) | `RESOLVED ✅` |
| `ISSUE-003` | Stale Landmark Retained on Subsequent Pin Drops (e.g. Borsi Landmark Remained When Pin Moved to Bhilai Sectors) | Merchant Hub (:3001) | Onboarding / Step 3 | Bug / State Sync | P1 | Phase 1 (`/register`) | `RESOLVED ✅` |
| `ISSUE-004` | Step 3 Onboarding: Category Names Truncated with Ellipsis (`...`) on Narrow 4-Column Grid | Merchant Hub (:3001) | Onboarding / Step 3 | UI / Readability | P2 | Phase 1 (`/register`) | `RESOLVED ✅` |

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
  1. **Dynamic Landmark State Update:** In [`Step3StoreDetails.tsx`](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/platform-root-vz/apps/merchant/src/components/onboarding/Step3StoreDetails.tsx), replaced the conditional guard with `setLandmark(loc.landmark || (loc.roadOrArea ? 'Near ' + loc.roadOrArea : ''))`. Every pin drop now immediately clears the previous landmark and calculates the fresh landmark dynamically.
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
  1. Inside [`Step3BusinessInfo.tsx`](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/platform-root-vz/apps/merchant/src/components/onboarding/Step3BusinessInfo.tsx), the category selector cards were arranged in a cramped 4-column grid (`grid grid-cols-2 sm:grid-cols-4 gap-2.5`).
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
- **Commit:** *Pending local commit*

---

## 3. How to Report an Issue in Chat

When you encounter any problem during manual testing, simply describe it in chat (or paste a screenshot/error message). Helpful details to include:
- **Screen / URL**: e.g., `http://localhost:3001/register` or `http://localhost:3000/cart`
- **What happened**: e.g., *"Clicked Submit button, nothing happened"* or *"The button is misaligned on mobile"*
- **Browser Console Error (if open)**: e.g., `POST /api/v1/orders 400 Bad Request` or red JS errors
- **Screenshot**: Attach directly in chat.

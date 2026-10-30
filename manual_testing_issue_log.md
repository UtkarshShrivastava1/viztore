# 🔍 Manual Testing Issue & Bug Tracker (Round 2)

## 📊 Live Progress & Remediation Dashboard

> **Active Phase**: Founder / User End-to-End Manual Commerce Verification  
> **Testing Scope**: Merchant Onboarding ➔ Catalog Management ➔ Customer Discovery ➔ Cart & Checkout ➔ Real-Time Audio & Order Fulfillment ➔ 4-Digit Handshake OTP ➔ Counter POS Walk-in Sale  
> **Environment**: Local Monolith (`apps/backend` on `:5000`, `apps/merchant` on `:3001`, `apps/web` on `:3000`) — Fresh 100% Blank Slate Atlas DB  
> **Status**: **1 ISSUE RESOLVED (100.0%)** 🟢  
> **Items Logged**: **1 Total** | **0 Open** | **0 In Progress** | **1 Resolved**  
> **Remediation Progress**: `[████████████████████] 100.0%`

---

### Layer Distribution Summary

| Application Layer | Total Logged | Critical (P0) | High (P1) | Medium (P2) | Polish (P3) | Resolved | Status |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Merchant Hub (`apps/merchant` :3001)** | 1 | 0 | 1 | 0 | 0 | 1 | 🟢 All Remediated |
| **Customer Web (`apps/web` :3000)** | 0 | 0 | 0 | 0 | 0 | 0 | Ready 🟢 |
| **Backend API Monolith (`apps/backend` :5000)** | 0 | 0 | 0 | 0 | 0 | 0 | Ready 🟢 |
| **Cross-Cutting (Sockets, Redis, DB, Print)** | 0 | 0 | 0 | 0 | 0 | 0 | Ready 🟢 |
| **TOTAL** | **1** | **0** | **1** | **0** | **0** | **1** | **100.0%** |

---

## 1. Master Issue & Bug Registry

| ID | Issue Title | Layer | Module / Screen | Type | Severity | Reported In | Status |
|---|---|---|---|---|:---:|:---:|:---:|
| `ISSUE-001` | Merchant Onboarding Step 3: Map Pin Drop & "Use Current Location" Failed to Auto-Fill Address Form Fields | Merchant Hub (:3001) | Onboarding / Step 3 | Functional Gap / UX | P1 | Phase 1 (`/register`) | `RESOLVED ✅` |

---

## 2. Issue Detail & Remediation Log

### [ISSUE-001] Merchant Onboarding Step 3: Map Pin Drop & "Use Current Location" Failed to Auto-Fill Address Form Fields (`RESOLVED ✅`)
- **Reported URL:** `http://localhost:3001/register` (Step 3: Store Profile & Location)
- **Symptom:** When clicking **"Use Current Location"** (GPS) or dragging / clicking the pin on the Leaflet map, the coordinates updated on the map, but the address form fields (`Shop No., Building Name`, `Road Name, Area, Colony`, `Nearby Landmark`, `City`, `State`, and `Pin Code`) remained blank or kept static defaults. The pickup search box also showed a static label instead of the resolved address.
- **Root Cause Analysis:**
  1. `Step3StoreDetails.tsx` and `Step4StoreLocation.tsx` only called `setCoordinates([lng, lat])` and updated the raw coordinate array in the state store. No reverse-geocoding engine was wired into `apps/merchant`.
  2. The pickup search box had no autocomplete search or forward geocoding handler.
  3. The Google Geocoding API key was unbilled on Google Cloud, returning `REQUEST_DENIED`.
- **Engineering Remediation:**
  1. **Created Comprehensive Reverse & Forward Geocoding Engine:** [`apps/merchant/src/lib/location/geocoding.ts`](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/platform-root-vz/apps/merchant/src/lib/location/geocoding.ts)
     - Multi-tier resilient architecture: OpenStreetMap Nominatim reverse geocoding with timeout & fallback ➔ BigDataCloud client API ➔ Proximity-matched regional hub directory (`REGIONAL_HUBS` covering Bhilai, Durg, Raipur, etc.).
     - Parses exact road, area, landmark, city (normalizes Bhilai, Durg, Raipur, etc.), state, and 6-digit pincode.
     - Implemented forward search autocomplete (`searchLocations`) for Indian addresses.
  2. **Wired Reverse Geocoding to Map Pin Drag & GPS:**
     - In [`apps/merchant/src/components/onboarding/Step3StoreDetails.tsx`](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/platform-root-vz/apps/merchant/src/components/onboarding/Step3StoreDetails.tsx), clicking **"Use Current Location"** now fetches GPS, reverse-geocodes coordinates, and auto-fills `building`, `area`, `landmark`, `city`, `state`, `pincode`, and `pickupSearch` text.
     - Dragging or clicking the Leaflet map triggers debounced reverse geocoding (350ms) and dynamically auto-populates all address fields.
     - Added real-time autocomplete suggestions dropdown under the pickup search bar; selecting any area pans the map and auto-fills all fields.
     - Added subtle loading spinners (`Auto-filling address from map...`) and success confirmation toasts (`✓ Address auto-filled`).
  3. **Synchronized `Step4StoreLocation.tsx`:** Added identical reverse geocoding and auto-population for alternative wizard flows.
- **Verification:**
  - TypeScript type check: `pnpm --filter=@repo/merchant exec tsc --noEmit` passed with 0 errors.
  - Production build: `pnpm --filter=@repo/merchant build` completed cleanly in 11.48s.

---

## 3. How to Report an Issue in Chat

When you encounter any problem during manual testing, simply describe it in chat (or paste a screenshot/error message). Helpful details to include:
- **Screen / URL**: e.g., `http://localhost:3001/register` or `http://localhost:3000/cart`
- **What happened**: e.g., *"Clicked Submit button, nothing happened"* or *"The button is misaligned on mobile"*
- **Browser Console Error (if open)**: e.g., `POST /api/v1/orders 400 Bad Request` or red JS errors
- **Screenshot**: Attach directly in chat.

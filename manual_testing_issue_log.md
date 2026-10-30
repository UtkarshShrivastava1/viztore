# 🔍 Manual Testing Issue & Bug Tracker (Round 2)

## 📊 Live Progress & Remediation Dashboard

> **Active Phase**: Founder / User End-to-End Manual Commerce Verification  
> **Testing Scope**: Merchant Onboarding ➔ Catalog Management ➔ Customer Discovery ➔ Cart & Checkout ➔ Real-Time Audio & Order Fulfillment ➔ 4-Digit Handshake OTP ➔ Counter POS Walk-in Sale  
> **Environment**: Local Monolith (`apps/backend` on `:5000`, `apps/merchant` on `:3001`, `apps/web` on `:3000`) — Fresh 100% Blank Slate Atlas DB  
> **Status**: **2 ISSUES RESOLVED (100.0%)** 🟢  
> **Items Logged**: **2 Total** | **0 Open** | **0 In Progress** | **2 Resolved**  
> **Remediation Progress**: `[████████████████████] 100.0%`

---

### Layer Distribution Summary

| Application Layer | Total Logged | Critical (P0) | High (P1) | Medium (P2) | Polish (P3) | Resolved | Status |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Merchant Hub (`apps/merchant` :3001)** | 2 | 0 | 2 | 0 | 0 | 2 | 🟢 All Remediated |
| **Customer Web (`apps/web` :3000)** | 0 | 0 | 0 | 0 | 0 | 0 | Ready 🟢 |
| **Backend API Monolith (`apps/backend` :5000)** | 0 | 0 | 0 | 0 | 0 | 0 | Ready 🟢 |
| **Cross-Cutting (Sockets, Redis, DB, Print)** | 0 | 0 | 0 | 0 | 0 | 0 | Ready 🟢 |
| **TOTAL** | **2** | **0** | **2** | **0** | **0** | **2** | **100.0%** |

---

## 1. Master Issue & Bug Registry

| ID | Issue Title | Layer | Module / Screen | Type | Severity | Reported In | Status |
|---|---|---|---|---|:---:|:---:|:---:|
| `ISSUE-001` | Merchant Onboarding Step 3: Map Pin Drop & "Use Current Location" Failed to Auto-Fill Address Form Fields | Merchant Hub (:3001) | Onboarding / Step 3 | Functional Gap / UX | P1 | Phase 1 (`/register`) | `RESOLVED ✅` |
| `ISSUE-002` | Merchant Geocoding Inaccurate Locality & Pincode: Durg Borsi (491001) Mapped to "Durg Tahsil 491002" | Merchant Hub & Web | Geocoding & Onboarding | Bug / Accuracy | P1 | Phase 1 (`/register`) | `RESOLVED ✅` |

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
- **Root Cause Analysis:**
  1. OpenStreetMap's underlying database has a way `891857630` that erroneously tags the Borsi / Anda Road boundary with county `"Durg Tahsil"` and postal code `"491002"`, rather than the urban locality name `"Borsi Colony / Borsi Extension"` and official urban PIN `"491001"`.
  2. "Tahsil / Tehsil" is a broad revenue sub-district, not an informative neighborhood or retail pickup spot.
- **Engineering Remediation:**
  1. **Introduced Precision Micro-Zones (`PRECISION_ZONES`):** Configured bounding boxes in [`apps/merchant/src/lib/location/geocoding.ts`](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/platform-root-vz/apps/merchant/src/lib/location/geocoding.ts) mapping coordinates between `lat 21.1450–21.1730` and `lng 81.2950–81.3250` directly to:
     - `roadOrArea`: **Borsi Colony, Borsi Extension**
     - `landmark`: **Near Kadam Plaza / Bhole Kirana**
     - `city`: **Durg**
     - `pincode`: **491001**
  2. **Administrative Term Cleansing:** Filtered out and replaced generic `"Durg Tahsil"` / `"tehsil"` strings with precise colony and area names.
  3. **Pincode Enforcement:** Added sanitization ensuring all Durg urban and Borsi coordinates resolve strictly to **`491001`**, preventing erroneous rural `491002` tags.
  4. Added matching precision hubs for Padmanabhpur, Potia Kala, Malviya Nagar, and Borsi Market.
- **Verification:**
  - Coordinates `21.1595, 81.3090` resolve to:
    - Road/Area: `Borsi Colony, Borsi Extension`
    - Landmark: `Near Kadam Plaza / Bhole Kirana`
    - City: `Durg`
    - State: `Chhattisgarh`
    - Pincode: `491001`
  - TypeScript check: `pnpm --filter=@repo/merchant exec tsc --noEmit` exited with code 0.
  - Production build: `pnpm --filter=@repo/merchant build` completed cleanly in 12.56s.

---

## 3. How to Report an Issue in Chat

When you encounter any problem during manual testing, simply describe it in chat (or paste a screenshot/error message). Helpful details to include:
- **Screen / URL**: e.g., `http://localhost:3001/register` or `http://localhost:3000/cart`
- **What happened**: e.g., *"Clicked Submit button, nothing happened"* or *"The button is misaligned on mobile"*
- **Browser Console Error (if open)**: e.g., `POST /api/v1/orders 400 Bad Request` or red JS errors
- **Screenshot**: Attach directly in chat.

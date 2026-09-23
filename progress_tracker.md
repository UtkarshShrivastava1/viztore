# Viztore Platform — Progress Tracker & Roadmap

## 1. Project Overview

**Viztore** is a **hyperlocal multi-vendor e-commerce platform** (3–4 km radius) designed to help **Indian local retailers** digitize their brick-and-mortar shops and make their products discoverable online.

> *"Built for Local Businesses. Made for India."*

---

## 2. Global Project Completion Status

### 🚀 Production Launch Scope (Phases 1–6: Backend + Merchant + Web + Ops)
`[████████████████████████████████████████] 100% Complete`

| Scope Dimension | Weight | Progress Bar | % Complete | Status | Target Milestone |
|---|:---:|---|:---:|:---:|---|
| **Overall Production Launch** (Phases 1–6) | **100%** | `[████████████████████]` | **100%** | 🟢 Cloud Staging Ready | Deployment Frozen for Handover |
| ↳ **Backend Architecture & APIs** | 30% | `[████████████████████]` | **100%** | 🟢 Live on Render | `https://viztore.onrender.com` Healthy |
| ↳ **Merchant & Admin Panel** | 25% | `[████████████████████]` | **100%** | 🟢 Complete Suite | All 7/7 Modules & Settings Merged (`b92a159`) |
| ↳ **Customer Web Storefront** | 25% | `[████████████████████]` | **100%** | 🟢 Storefront & Cart Engine | All 4/4 Modular Suites Merged (`e942cc9`) |
| ↳ **Production Readiness & DevOps** | 20% | `[████████████████████]` | **100%** | 🟢 Staging Live | 67/67 Tests Green, Monorepo Clean Build |
| **Total Full-Platform Scope** (Phases 1–7) | — | `[█████████████████░░░]` | **88%** | ⚪ Roadmap Reserved | Customer Mobile App (Phase 7 / Tier 3) |

> **Auto-Update Invariant**: This progress bar is recalculated and updated dynamically on every task assignment, milestone delivery, and PR merge per `.agents/rules/progress-tracking.md`.

---

## 3. Precision Layering: Tier 1 (Sept 22) vs. Tier 2 (October) vs. Tier 3 (November)

To maintain absolute clarity and prevent scope creep, engineering deliverables are structured across three distinct horizons:

```mermaid
timeline
    title Three-Horizon Platform Evolution
    section Tier 1: Sept 22 Deployment
        Customer Web ➔ Backend ➔ Merchant Core Triangle
        WhatsApp Delivery Partner Dispatch Engine
        Online Purchase Billing & Invoicing (INV-ORD-xxxxx)
        Cloud Staging Deployment (Railway/Render + Vercel)
    section Transition & Alignment
        Milestone Review & Deployment Freeze
    section Tier 2: Mid-Late Oct Soft Launch
        Basic In-House Retail Billing (Folder 5: 7 screens)
        Socket.io Real-Time Audio & Push Order Alerts
        Onboard 5-10 Pilot Retailers (Free Beta Testing)
        Real On-Ground Live Hyperlocal Operations
    section Tier 3: November Enterprise
        Enterprise Accounting (Zoho Books / Tally Clone)
        Credit & Debit Notes, GSTR-1 & GSTR-3B Tax Ledgers
        Merchant Automated Wallet Bank Settlements
        Customer Native Mobile App (React Native / Expo)
```

---

### 🌟 Tier 1 — Core Working Production Flow (Release Gate: September 22, 2026)
> **Mandate:** An end-to-end working system deployed to cloud staging for the initial release milestone. Covers customer discovery, single-store purchase, merchant order processing, WhatsApp delivery coordination, and full online purchase invoicing.

#### 1. The Core Triangle Purchase & Fulfillment Engine
1. **Customer Web Storefront (`apps/web`)**:
   - Hyperlocal 3–4km store discovery (`/stores`, `/stores/[slug]`).
   - Catalog browsing, faceted search, and Product Detail Pages (`/products/[slug]`).
   - Strict single-store cart rule enforcement (`/cart`).
   - Multi-address selector and order checkout (`/checkout`).
   - Order submission via `POST /api/v1/orders`.
2. **Merchant Management Panel (`apps/merchant`)**:
   - Real-time orders pipeline (`OrdersPage.tsx`): All, Pending, Confirmed, Preparing, Ready, Out for Delivery, Delivered, Cancelled.
   - Order status progression: "Accept Order" (`CONFIRMED`) ➔ "Pack & Ready" (`PACKED`).
   - Slide-out order details drawer with customer delivery address, contact info, and line items.
3. **WhatsApp Delivery Partner Coordination**:
   - Merchant clicks **"Dispatch Delivery Rider"** in order details drawer.
   - Automated WhatsApp dispatch message generated via `https://wa.me/<rider_phone>?text=...`:
     - Store pickup address, contact name, and Google Maps pin.
     - Customer delivery destination address and phone number.
     - Order summary: Item list, quantities, and bill total.
     - Payment status: Pre-paid via UPI or Cash on Delivery (COD) collection amount.
     - 4-digit Delivery Handshake OTP notice.
   - Delivery partner confirms pickup (`OUT_FOR_DELIVERY`) and verifies customer OTP upon delivery (`DELIVERED`).

#### 2. Online Purchase Billing & Invoicing (Tier 1 Mandatory Scope)
Every online order placed through `apps/web` generates an authoritative, compliant **Order Tax Invoice**:
- **Customer Web Receipt**: On `/account/orders/[id]`, the **"Download Bill"** button opens a clean, print-ready, professional **Order Tax Invoice** (`INV-ORD-xxxxx`):
  - Invoice number, order reference, and timestamp.
  - Seller / Store details (Store name, pickup address, phone).
  - Customer shipping address and phone number.
  - Itemized table: Description, SKU, Quantity, Unit Price, Taxable Amount, GST breakdown, Line Total.
  - Delivery fee, discounts, grand total, and payment method (UPI / COD).
- **Merchant Physical Packing Slip**: In the Merchant Panel order details drawer, a **"Print Invoice / Bill"** button enables the merchant to print a receipt to tape onto the customer's package before rider pickup.
- **Rider Bill Summary**: WhatsApp dispatch text embeds the exact invoice bill total so the rider knows the financial collection responsibility.

#### 3. Cloud Staging Deployment
- **Backend (`apps/backend`)**: Deployed to Railway / Render with MongoDB Atlas & Redis Cloud instances.
- **Frontends (`apps/web` & `apps/merchant`)**: Deployed to Vercel with production environment variables (`NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_API_URL`).
- **Data Seeding**: Staging dataset seeded with 4 local stores, 60+ products, and active merchant/customer credentials.

---

### 🏬 Tier 2 — Basic In-House Retail Billing & Pilot Operations (Mid-to-Late October 2026)
> **Mandate:** In the subsequent operational runway, implement working basic in-house counter billing and onboard pilot merchant clients for real-world on-ground operations.

1. **Basic In-House Retail Billing (`apps/merchant` - Folder 5 Revised Scope)**:
   - **Manual Counter Sale Mode (`5.1`, `5.2`)**: Merchant creates counter bills for walk-in retail shoppers.
   - **Tax Invoices (`5.0`)**: In-house invoice management table with status filtering, date range, and customer search.
   - **Estimates / Quotations (`5.5`, `5.6`)**: Quick quote creation with validity timer and 1-click **Convert to Invoice** (`+ Convert`).
   - **Billing Settings & Print Preferences (`5.3`)**: Configure invoice prefixes, terms & conditions, store bank account QR code, and thermal vs. A4 layout.
2. **Real-Time Sound & Push Order Alerts**:
   - Connect `@socket.io/redis-adapter` to trigger an instant Zomato/Swiggy-style audio chime on the merchant's screen when an order arrives.
3. **Pilot Merchant Onboarding (Soft Launch)**:
   - Target 5–10 physical brick-and-mortar shops within a compact 3–4km delivery cluster.
   - Free onboarding for beta testing.
   - Live on-ground execution with local delivery partners to stress-test real inventory synchronization and delivery SLAs.

---

### 💼 Tier 3 — Full Enterprise Accounting & Mobile App (November 2026)
> **Mandate:** Expand in-house billing into an enterprise Zoho Books / Tally-grade accounting suite and release the native mobile app.

1. **Enterprise Accounting Suite**:
   - Credit & Debit Notes (`CN-`, `DN-`) against product returns, damaged goods, or vendor price revisions (Mockups `5.6`–`5.9`).
   - GSTR-1, GSTR-3B compliant monthly tax export ledgers (B2B, B2C, HSN/SAC summary).
   - Multi-series sequential numbering and custom fiscal year series.
   - Vendor expense tracking, purchase orders, and ledger reconciliation.
2. **Merchant Wallet & Automated Bank Settlements**:
   - Automated T+1 / T+2 merchant bank account payouts.
   - Platform commission deduction ledger, TDS 194-O reporting, and dispute reserves.
3. **Customer Native Mobile App (`apps/mobile`)**:
   - React Native + Expo managed workflow for iOS and Android.
   - Background GPS tracking, device push notifications, and biometric authentication.

---

## 4. 4-Day Release Schedule to September 22 Deployment

| Date | Focus Area | Deliverables & Exit Criteria | Status |
|---|---|---|:---:|
| **Sept 18–19** | **API Contract & Invoicing Lockdown** | • Customer cart & checkout connects to `POST /api/v1/orders`<br/>• Merchant Orders table pulls live orders and triggers status transitions<br/>• Structured tax invoice (`/invoice`) and WhatsApp rider dispatch manifest | ✅ Completed |
| **Sept 20–21** | **Cloud Staging Deployment** | • Deploy `apps/backend` to Railway / Render with MongoDB Atlas & Redis<br/>• Deploy `apps/web` and `apps/merchant` to Vercel<br/>• Verify CORS whitelist, HTTPS, and environment variables | ✅ Completed |
| **Sept 22–23** | **End-to-End Handover Audit & Wiring** | • Full-scope audit of UI-to-API hooks across Web and Merchant Panel<br/>• Replaced mock checkout timeout with real order API dispatch<br/>• Dynamic address selection, dynamic confirmation, and merchant OTP verification<br/>• 67/67 tests green, monorepo clean build, ready for client handover | ✅ Completed |

---

## 5. Current Monorepo Status

| Layer | Technology | Status | Details |
|---|---|---|---|
| **Backend API** | Node.js v20+, Express, Mongoose, TypeScript | **Live & In Sync** ✅ | Auth, Stores, Onboarding, Catalog, Orders, Delivery, Notifications, Ratings, Addresses modules; /healthz & /readyz probes active; /invoice endpoint live |
| **Merchant Panel** | React 18, Vite, Tailwind CSS, Zustand | **Refined & Onboarding Merged** ✅ | Pixel-perfect Dashboard, 4 side drawers, 8-Tab Orders Pipeline, Product Cataloging, Seller Onboarding Wizard, & WhatsApp Delivery Dispatch |
| **Customer Storefront** | Next.js 14 App Router, Tailwind, TanStack Query | **Live** ✅ | Home feed, Stores directory, PLP, PDP, Category browse, Account hub, Orders & Addresses, Printable Tax Invoice Modal |
| **Shared Types** | TypeScript, Zod | **100% In Sync** ✅ | All contracts, validation schemas, DTOs, branding config |
| **Real-Time & Events** | Socket.io + Redis Adapter + TypedEventBus | **Wired** ✅ | In-process domain events forwarded to Socket.io rooms with Redis distributed scaling |
| **Agent Workflows** | Custom Skills & Rules | **Active** ✅ | Fullstack Feature Workflow, UI Matching, Intern Delegation, /create-task |
| **Test Suite** | Vitest | **67/67 Passing** ✅ | 13 test suites (AppError, Auth/Addresses, Stores/Ratings, Onboarding, Catalog, Orders, Delivery, Notifications, WorkerPool, Cache-Aside, CORS Validation) |
| **Build Status** | Turborepo | **Clean** ✅ | Full monorepo builds with zero errors across all packages |
| **Engineering Standards** | 8/8 Pillars (`structure.md`) | **100% Implemented** ✅ | Facades, Composition roots, 3-tier testing, EventBus, WorkerPool, Cache-Aside + Replica split, ESR indexing, Decoupled repos |

---

## 6. Phase-by-Phase Execution Progress

### 🔵 Phase 1 — Foundation & Core Backend (COMPLETED ✅)
- [x] Monorepo scaffolding with pnpm workspaces and Turborepo
- [x] `shared/` infrastructure (MongoDB connection, JWT, error handling, Zod validation middleware)
- [x] `auth/` module (Customer, Merchant & Admin registration, login, JWT access/refresh token pair, role guards)
- [x] `stores/` module (Store schema with MongoDB 2dsphere indexing, proximity scanning, store CRUD)
- [x] API versioning under `/api/v1`
- [x] White-label branding architecture via `branding.config.ts`

### 🟢 Phase 2 — Merchant Onboarding & Dashboard (COMPLETED & UI MATCHED ✅)
- [x] 6-Step Merchant Onboarding API (Account, GSTIN/PAN verification, E-signature, Store setup, Business ops, Banking)
- [x] Super Admin store approval/rejection queue API
- [x] Merchant Panel frontend (React 18 + Vite SPA)
- [x] 6-Step interactive onboarding wizard UI with canvas signature and document uploads
- [x] Merchant Operational Dashboard pixel-matched to mockups with 4 interactive slide-out drawers

### 🟡 Phase 3 — Catalog & Customer Discovery (COMPLETED ✅)
- [x] `catalog/` backend module with polymorphic product schema, variants, and dynamic attributes
- [x] High-performance MongoDB aggregation faceted search engine
- [x] Product CRUD with merchant store ownership checks
- [x] Customer Web Storefront (`apps/web`) built on Next.js 14 App Router
- [x] Full customer browsing: CategoryHub, Stores Near Me, Storefront, PLP, and PDP

### 🟠 Phase 4 — Cart, Checkout & Orders (HARDENED & WIRED 🟢)
- [x] Orders, Checkout & Delivery backend modules (100% complete)
- [x] Customer Cart & Checkout UI (`apps/web`) — Merged via PR #4
- [x] Abhay Task 1 (Dashboard + 4 Drawers) — Merged
- [x] Abhay Task 2 (8-Tab Orders Pipeline & Manual Create Order) — Merged
- [x] Abhay Task 3 (Product Catalog & Add Product Wizard) — Merged
- [x] Abhay Task 4 (Seller Registration & Onboarding Pipeline) — Merged
- [x] Abhay Task 5 (Inventory Management Suite) — Merged
- [x] Abhay Task 6 (Commercial Billing & Invoicing Suite - 7 Screens) — Merged via PR #8
- [x] Abhay Task 7 (Store Management & Operations Settings Suite - 5 Screens) — Merged via commit `b92a159`
- [x] Vinay Task 1 (Responsive Storefront & Account Hub) — Merged via PR #4
- [x] Vinay Task 2 (Discovery, Catalog PLP, Product PDP & Storefronts) — Merged via PR #6
- [x] Vinay Task 3 (Home Discovery, Notifications Dropdown, Wishlist Flyout & Deals Ecosystem) — Merged via PR #9
- [x] Vinay Task 4 (Cart & 4-Step Checkout Experience - 10 Screens) — Merged via commit `e942cc9`
- [x] Tier 1 Online Purchase Invoice Endpoint & Printable Bill (`apps/web` + `apps/merchant`)
- [x] WhatsApp Delivery Partner Dispatch Engine & Link Generator
- [x] Backend Dockerization & Production Containerization (Root & Backend Dockerfile, .dockerignore, .npmrc, 67/67 tests passing)
- [x] Staging Blueprints & Cloud Configs (Railway.json, Render.yaml, apps/merchant/vercel.json SPA rewrites, CORS *.vercel.app matching)
- [x] Staging Cloud Deployment Active & Live on Render (`https://viztore.onrender.com`, MongoDB connected, `/healthz` & `/readyz` 200 OK)
- [x] E2E Browser Audit & Defect Remediation (Scratchboard audit, dynamic cart badge sync, hardcoded name/location purge, dynamic PDP brand/categories, merchant auth route guard)
- [x] Customer Web Checkout SSR Hydration & Real Auth Token Enforcement (Resolved React errors #425, #418, #423 via client-mounted skeleton, dynamic cart derivation, LocationModal integration, removed mock token injection in AuthModal, 1-click test credentials autofill)
- [x] Database Purge, Production Dataset Re-seed & Zero Static Mock Architecture (Complete purge and re-seed of MongoDB Atlas with 1 Super Admin, 2 Customers, 5 Indian Stores across Mumbai/BLR/Delhi, 24 polymorphic products with barcodes & variants, 5 active lifecycle orders; purged >1,800 lines of hardcoded mock data across merchant orderStore, catalogStore, inventoryStore, and customer web OrdersClient, WishlistClient, FashionStores, and AccountClient; full live API wiring with graceful empty states; all monorepo packages building cleanly, 67/67 unit tests passing)
- [x] End-to-End Residual Static Fallback Elimination (Purged all residual hardcoded dummy arrays and automatic injectors: customer NotificationsDropdown, WishlistFlyout, ExploreStoresGrid fallbackStores, addresses defaultFallbackAddresses, OrderDetailsClient mock product/address; merchant LiveOrderAlerts, TopProducts, LowStockWarnings, OrderSummaryCard, SalesOverview, RevenueChart, and billingStore; verified live database connectivity and genuine empty states across empty and seeded collections)
- [x] Merchant Operations & Orders Pipeline Defect Remediation (Fixed merchant logout transition preventing stale Fashion Hub dashboard views; removed static fallback tab counters `|| 18`, `|| 12`, etc., wiring pure dynamic order counts; unified `OrderStatus` casing to uppercase and persisted active tab state across page reloads; verified dynamic store profile hydration from `/stores/mine`)


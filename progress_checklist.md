# Viztore Platform — Implementation Checklist

> **Overall Status:** Phase 1, Phase 2 (UI Refined), Phase 3, Phase 4/5/6 Backend Complete | 62/62 Unit & Integration Tests Passing | Full Monorepo Clean Build

---

## 🎯 Tier 1 vs. Tier 2 Delivery Precision Matrix

| Functional Flow | Tier 1 (Core Launch — Target: Sept 22) | Tier 2 (Enterprise Ops — Post-Vacation / Sept 23+) |
|---|---|---|
| **Merchant Registration** | `[x]` Dedicated `register.<domain>` subdomain & 6-step flow | `[ ]` Multi-outlet franchise registration |
| **Merchant Store Setup** | `[x]` Basic store details, map pin, hours, categories | `[ ]` Multiple staff RBAC roles & shift scheduling |
| **Product Cataloging** | `[x]` 3-step creation wizard, CSV upload, barcodes | `[ ]` AI automated catalog scrapers & sync |
| **Inventory Management** | `[x]` Real-time stock counts, adjust drawers, bulk batch | `[ ]` Warehouse multi-bin inventory & supplier POs |
| **Order Management** | `[x]` 8-tab pipeline, invoice print, manual order, OTP handoff | `[ ]` Offline POS billing terminal & barcode scanner |
| **Financial Ledger** | `[x]` Basic order bill breakdown & delivery fee split | `[ ]` Automated wallet payout cycles & commission ledger |
| **Customer Auth & Profile**| `[x]` Modal signup/login, Google OAuth, address book | `[ ]` Customer in-app wallet & loyalty cashbacks |
| **Customer Discovery** | `[x]` Hyperlocal stores near me, faceted PLP, rich PDP | `[ ]` Native React Native / Expo Mobile App (iOS/Android) |
| **Checkout & Delivery** | `[x]` Single-store cart rule, checkout, WhatsApp dispatch | `[ ]` Automated returns & RMA credit note settlements |

---

## 🟢 Phase 1: Foundation & Core Backend (DONE)

- [x] **Monorepo & Tooling Setup**
  - [x] pnpm workspace (`apps/backend`, `apps/web`, `apps/merchant`, `packages/shared-types`)
  - [x] Turborepo build pipeline configuration (`turbo.json`)
  - [x] Strict TypeScript configs & shared ESLint/Prettier rules
- [x] **Infrastructure & Shared Utilities**
  - [x] MongoDB Atlas connection lifecycle with Mongoose
  - [x] Centralized `AppError` operational error handler & async wrapper
  - [x] Generic Zod validation middleware for body/query/params
  - [x] White-label `branding.config.ts` system with `NEXT_PUBLIC_*` fallback
- [x] **Authentication Module (`apps/backend/src/modules/auth`)**
  - [x] User model with roles: `customer`, `merchant`, `admin`
  - [x] Password hashing with bcrypt (salt rounds = 12)
  - [x] JWT Access (15m) + Refresh (7d) token lifecycle
  - [x] Authentication & Role-based Access Control middleware
  - [x] Unit tests for auth service (3/3 passing)
- [x] **Stores Module (`apps/backend/src/modules/stores`)**
  - [x] GeoJSON `Point` schema with MongoDB `2dsphere` spatial indexing
  - [x] Hyperlocal proximity queries (`$near` within 3–4 km delivery radius)
  - [x] Store CRUD endpoints & unit tests (3/3 passing)

---

## 🟢 Phase 2: Merchant Onboarding & Dashboard (DONE & UI MATCHED)

- [x] **Merchant Onboarding Backend**
  - [x] 6-Step onboarding state machine (Account, Tax, E-Sign, Store, Business Ops, Banking)
  - [x] Super Admin approval/rejection queue API
  - [x] Onboarding unit tests (4/4 passing)
- [x] **Merchant Panel Application (`apps/merchant`)**
  - [x] React 18 + Vite SPA setup with Tailwind CSS and Zustand state management
  - [x] 6-step interactive onboarding wizard with HTML5 canvas e-signature
  - [x] **Pixel-Matched Management Dashboard**:
    - [x] Deep Navy sidebar (`#081028`) with live notification counters (`Orders 25`, `Billing New`, `Wallet ₹32,450`, `Returns 7`) & "Grow your business" promo banner
    - [x] Top header with `Ctrl + K` search shortcut, Wallet button (`₹32,450`), Notifications count badge (`8`), Help `?` button, and Seller Profile pill (`Fashion Hub`, `FH`)
    - [x] Top Greeting & Date Filter (`Last 7 Days 📅`)
    - [x] 3 Top KPI Cards: Total Sales (`₹48,750`), Orders (`128`), Visitors (`2,354`) with positive trend indicators
    - [x] Middle Row Grid:
      - [x] `🔥 New Orders` card with 5 order rows, time badges, and solid orange `View All Orders →` button
      - [x] `Sales Overview` dual-curve line chart (Recharts) with `This Week` & `Last Week` comparison and stat pills
      - [x] `Create New Bill` dark navy card with Tax Invoice, Quote, Credit Note shortcuts & `Order Summary` status list
    - [x] Bottom Row Grid:
      - [x] `Top Selling Products` with thumbnails, variant details, order counts, and sales
      - [x] `Low Stock Alert` with stock counts and `Restock` action buttons
      - [x] `Quick Actions` 8-tile action matrix
    - [x] Footer `Announcements` with 3 horizontal update cards
  - [x] **4 Interactive Slide-Out Side Drawers**:
    - [x] 🔔 `NotificationsDrawer` with category filter tabs (`All 8`, `Orders 5`, `Inventory 2`, `System 1`), unread dots, "Mark all as read"
    - [x] ❓ `HelpSupportDrawer` with search input, 9 expandable accordion FAQ items, and contact support card
    - [x] 👤 `SellerProfileDrawer` with verified badge, seller ID, GSTIN, store performance analytics (`4.7 ★`, `98%`, `1,245 orders`, `₹3.2L+`), and logout button
    - [x] 📝 `ProfileInformationDrawer` with basic info, bank details, store description, category tags, and store logo editor
  - [x] **9-Screen Seller Registration & Onboarding Pipeline (PR #5 Merged ✅)**:
    - [x] Public Seller Landing Page (`SellerLandingPage.tsx`) with 3D artwork hero, value pillars, and trust cards
    - [x] Floating Seller Login Modal (`SellerLoginPage.tsx`) with OTP tab switcher
    - [x] Interactive Leaflet Map Pin-drop (`MapPicker.tsx`) for pickup address coordinates
    - [x] Dual-mode E-Signature component (`Step2Signature.tsx`) with HTML5 Canvas drawing & cursive font generator
    - [x] 4-Step Registration Wizard (`Step1MobileEmail.tsx`, `Step2IdVerification.tsx`, `Step3StoreDetails.tsx`, `Step4BankAccount.tsx`)
    - [x] Seller Review & Verification Waiting Room (`ReviewWaitingRoom.tsx`)
    - [x] Dynamic brand-agnostic configuration (`branding.ts`)
  - [x] **Hyperlocal Retail Inventory Management Suite (TASK-ABH-05 Completed ✅)**:
    - [x] Screen 4.0: Main inventory overview table, 5 KPI summary cards, filter toolbar, reserved stock info popover
    - [x] Screen 4.1: Adjust stock slide-out drawer with quantity stepper (`− 50 +`), reason dropdown, dynamic alert
    - [x] Screen 4.2: 7-action row floating dropdown menu
    - [x] Screen 4.3: Clean inventory table base layout & column alignment
    - [x] Screen 4.4: Stock history single-product audit trail drawer with transaction filters and timeline cards
    - [x] Screen 4.5: Bulk adjust stock full-page batch grid with inline steppers, live recomputed new stock, and sticky footer
    - [x] Screen 4.6: Dedicated stock history ledger with 5 summary cards, date range picker, and transaction ledger

---

## 🟢 Phase 3: Catalog Engine & Customer Web Storefront (DONE)

- [x] **Catalog Backend Module (`apps/backend/src/modules/catalog`)**
  - [x] Product schema with polymorphic attributes, SKU variants, and image gallery
  - [x] Pre-save derived metric computation (`basePrice`, `totalStock`, `maxDiscount`)
  - [x] Compound MongoDB indexes (`storeId + status + category`, text index on title/desc/brand)
  - [x] High-performance dynamic faceted aggregation search pipeline (size, color, brand, price range)
  - [x] Catalog unit tests (14/14 passing)
- [x] **Customer Web Storefront (`apps/web` Next.js 14+)**
  - [x] Next.js 14 App Router architecture with Tailwind CSS & TanStack Query
  - [x] White-label branding integration via `branding.config.ts`
  - [x] Core layout components: `Header` (with location pin modal), `Footer`, `CategoryStrip`, `PromoCarousel`, `TrustBar`
  - [x] Reusable card components: `ProductCard`, `StoreCard`, `ProductCardSkeleton`, `StoreCardSkeleton`
  - [x] Home Page (`/`): "Stores Near You" horizontal rail, "Best Deals For You" product grid
  - [x] Explore Stores directory (`/stores`): category filtering, open/closed badges, delivery distance
  - [x] Product Listing Page (`/products`, `/category/[slug]`, `/category/fashion`): faceted sidebar filter, circular bubble filters, sort dropdown, active filter chips, `<Suspense>` boundary
  - [x] Product Detail Page (`/products/[slug]`): image thumbnail gallery, variant selector, quantity stepper, stock validator, specifications table, delivery countdown ETA, and verified reviews
  - [x] Category landing pages (`/category`, `/category/[slug]`) with 14-category vertical split rail and subcategory grid
  - [x] Explore Stores directory (`/stores`, `/stores/fashion`) & dedicated store storefronts (`/stores/[slug]`) with hero cards and curated shelves

---

## 🟡 Phase 4: Cart, Checkout & Orders (BACKEND COMPLETED, UI IN PROGRESS)

- [x] **Enterprise Modular Monolith & Clean Architecture Foundation**:
  - [x] Module Public Facades (`index.ts`) for `auth`, `stores`, `catalog`, and `orders`
  - [x] Strongly-typed in-memory `eventBus` (`shared/events/eventBus.ts` + `eventTypes.ts`) for asynchronous domain events
  - [x] `orders/` composition root (`order.module.ts`) wiring repository, service, controller, and router
  - [x] Abstract Repository layer (`order.repository.ts` implementing `IOrderRepository`)
  - [x] Order state machine with physical 4-digit Delivery OTP handshake (`order.service.ts`)
  - [x] Single-store cart invariant enforcement at service layer
  - [x] ESR compound indexing (`{ storeId: 1, status: 1, createdAt: -1 }`, `{ userId: 1, createdAt: -1 }`)
  - [x] 3-tier testing pyramid: Service unit tests, Supertest route integration tests, Repository unit tests (13 tests, 39 total tests passing)
- [x] **Customer Storefront Cart & Checkout UI (`apps/web`)**
  - [x] Cart page with single-store check & item quantity steppers (`/cart`)
  - [x] Checkout page with address, fulfillment mode, and payment summary (`/checkout`)
- [ ] **Merchant Panel Live Orders Pipeline (`apps/merchant`)**
  - [ ] Kanban Pipeline Board (New, Preparing, Ready, Out for Delivery, Completed)
  - [ ] Delivery OTP modal verification for merchant/rider handoff
  - [ ] Secure 4-digit Delivery OTP generation & verification
  - [ ] Real-time merchant & customer socket events

---

## 🟢 Phase 5: Hyperlocal Delivery & Real-Time Sync (BACKEND COMPLETE ✅, UI PENDING INTERN MERGE)

- [x] Hyperlocal `delivery/` modular backend architecture (`delivery.module.ts`, `delivery.service.ts`, `delivery.repository.ts`, `delivery.controller.ts`)
- [x] Delivery partner assignment, vehicle type tracking & dispatch state machine
- [x] Haversine distance matrix computation & dynamic delivery ETA generator
- [x] WhatsApp notification link constructor & Google Maps turn-by-turn routing URL generator
- [x] Physical 4-digit Delivery OTP handshake & handoff verification
- [x] Centralized `notifications/` modular backend architecture (`notification.module.ts`, `notification.service.ts`, `notification.repository.ts`, `notification.controller.ts`)
- [x] Multi-recipient routing (`merchant`, `customer`, `admin`) and category segregation (`order`, `inventory`, `system`, `promo`)
- [x] Real-time Socket.io push broadcasts (`NOTIFICATION_CREATED`) & Redis adapter integration
- [ ] Merchant audio chime alerts for incoming orders (Frontend UI)
- [ ] Live customer order tracking map with driver ETA (Frontend UI)


---

## 🟣 Phase 6: Customer Account, Store Ratings & Polish
- [x] Customer account frontend UI screens (Profile hub, Orders list & detail, Wishlist, Addresses, Coupons, Feedback, Sell CTA) — Merged via PR #4
- [x] Customer registration & login pipeline in storefront (`apps/web`): Zustand auth store, API client, floating modal with Email/Password & Google OAuth, layout mounting, dynamic session management
- [x] Subdomain-based registration routing (`register.<domain>` & `/register`) in Merchant Panel (`apps/merchant`)
- [x] Customer account backend APIs: saved addresses CRUD (`/api/v1/users/addresses`), order history query alias (`/api/v1/orders/my-orders`), profile update (`/api/v1/users/me`)
- [x] Simple Store/Merchant rating system (1–5 stars per delivered order, aggregated store rating score/count, duplicate order rating prevention: `/api/v1/stores/:id/rating`)
- [ ] Customer platform NPS & experience feedback submission
- [ ] Merchant marketing suite: discount voucher & banner campaign manager (standard non-AI)
- [ ] Merchant revenue analytics & sales reports
- [x] Lean Architecture Mandate: Zero paid AI APIs (pure MongoDB text search, no visual/voice AI)

---

## ⚫ Phase 7: Tier 2 Enterprise Retail Operations & Mobile App (POST-VACATION / ROADMAP RESERVED)

- [ ] Merchant Point-of-Sale (POS) counter billing terminal mode & barcode scanner integration
- [ ] Merchant wallet financial ledger, payout triggers & automated bank settlements
- [ ] Automated returns, exchange, RMA reverse logistics & refund credit note settlement
- [ ] Merchant staff management & role-based access control (Manager, Cashier, Inventory Clerk)
- [ ] Merchant marketing suite: promotional store banner manager & coupon builder
- [ ] Customer Mobile App with React Native & Expo (iOS + Android)
- [ ] Background GPS geolocation & mobile push notifications
- [ ] Customer in-app returns/exchange request hub & digital wallet loyalty balance

# 📋 TASK BRIEF: Marketing Campaign Engine, Ad Wizard & Interactive Voucher Suite (`TASK-ABH-15`)

**Assignee:** Abhay ([`@Abhay0410`](https://github.com/Abhay0410))  
**Workspace:** `apps/merchant/` (React 18 + Vite SPA + Tailwind CSS + Zustand)  
**Target Branch:** `feature/abhay-marketing-campaigns-suite`  
**Base Branch:** `main` (branch from latest `main` once `TASK-ABH-14` is completed)  
**Design Reference Directory:** `mockups/Merchant_Front/12.) Marketing/` (Screens `12.0.png` through `12.7d.png` — **22 Total Screens**)  
**Estimated Time:** 3–4 Days  
**Priority:** High (Direct Merchant Promotion & Customer Acquisition Engine)

---

## 1. Executive Summary & Objective

In `TASK-ABH-08` and `TASK-ABH-10`, initial baseline stubs were introduced for marketing navigation. With Harish's complete re-organization of `Folder 12`, **22 high-fidelity mockups** now fully specify the marketing lifecycle.

Your objective in `TASK-ABH-15` is to deliver the complete **Marketing & Ad Campaign Engine**:
1. **Marketing Hub & Overview (`12.0.png`, `12.1.png`)**: High-level KPI summary cards (`Total Ad Spend`, `Total Revenue Generated`, `ROAS`, `Active Campaigns`), dynamic campaign status filters (`All`, `Active`, `Scheduled`, `Paused`, `Completed`), and high-density campaigns table with live budget meters and quick toggles.
2. **4-Step Create Ad Campaign Wizard (`12.2.png`–`12.4b.png`)**:
   - **Step 1: Campaign Type Selection (`12.2`)**: 4 distinct ad types with badges and benefit breakdowns — *Sponsored Product*, *Store Spotlight*, *Category Spotlight*, and *Banner Ad*.
   - **Step 2: Target Entity Selector (`12.3`, `12.3a`, `12.3b`)**: Product picker table with search/filters, category hierarchy tree, or custom banner upload.
   - **Step 3: Budget, Bidding & Duration (`12.4`, `12.4a`)**: Automatic vs. Manual CPC bidding, daily budget cap slider/stepper, date range picker, and wallet balance check.
   - **Step 4: Live Ad Card Preview & Review (`12.4b`)**: Interactive preview of the exact sponsored product card or banner as seen by customers on the storefront.
3. **Ad Performance Analytics Deep-Dive (`12.5.png`–`12.6a.png`)**:
   - Recharts dual curve tracking impressions vs. clicks over time.
   - ROAS calculation gauge, CTR stats, conversion count, and product-by-product breakdown.
   - Campaign editing modal and budget top-up actions.
4. **2-Step Create Coupon Wizard (`12.7a.png`–`12.7d.png`)**:
   - **Step 1: Coupon Parameters (`12.7a`)**: Code generator, discount type cards (*Percentage*, *Fixed Amount*, *Free Shipping*), max discount caps, min order value, usage limits, and validity dates.
   - **Live Perforated Voucher Ticket Preview (`12.7a`)**: Real-time rendering of a dashed perforated ticket showing the active code, discount badge (e.g. `20% OFF`), and rules updating on every keystroke.
   - **Step 2: Review & Confirmation (`12.7b`)**: Summary verification before activation.
5. **Coupons Management Table (`12.7.png`)**: Table with active status toggles, usage progress bars (`234 / 1000 used`), expiry countdowns, and quick share/copy code triggers.

---

## 2. Mockup Reference Mapping

| Mockup Screen | Module / View Title | Key Visual & Interactive Specifications |
|---|---|---|
| `12.0.png` | **Marketing Hub Overview** | 4 KPI Cards (Ad Spend, Revenue, ROAS, Active Ads), quick create action cards (Run Ad, Create Coupon), active campaign cards. |
| `12.1.png` | **Campaigns List Table** | Status tabs (All, Active, Paused, Scheduled, Ended), budget spent progress bars, CTR & ROAS columns, row action menu. |
| `12.2.png` | **Ad Wizard: Step 1 (Ad Type)** | 4 selectable cards with icons: Sponsored Product, Store Spotlight, Category Spotlight, Banner Ad. |
| `12.3.png`–`12.3b.png` | **Ad Wizard: Step 2 (Entity Selection)** | High-density product picker modal with search, category filters, and selection pills. |
| `12.4.png`–`12.4a.png` | **Ad Wizard: Step 3 (Bidding & Budget)** | Daily budget input, duration picker, estimated reach calculation meter, wallet balance deduction indicator. |
| `12.4b.png` | **Ad Wizard: Step 4 (Preview & Launch)** | Sticky customer phone frame showing live sponsored badge on product card, launch button. |
| `12.5.png`–`12.6a.png` | **Ad Analytics & Performance** | Metric cards (Impressions, Clicks, CTR, Spend, Revenue, ROAS), performance curve chart, product-wise breakdown. |
| `12.7.png` | **Discounts & Coupons Table** | Coupon code pills with copy action, discount type badges, validity range, usage limit progress bar, status toggle. |
| `12.7a.png` | **Coupon Wizard: Step 1 (Details)** | Form with live perforated voucher preview card on the right rail, discount mode cards (Percentage, Fixed, Free Shipping). |
| `12.7b.png`–`12.7d.png` | **Coupon Wizard: Step 2 & Success** | Review summary card, confirmation modal, celebration screen with copy code & share to WhatsApp actions. |

---

## 3. Component Architecture & Hierarchy

```text
apps/merchant/src/
├── components/
│   └── marketing/
│       ├── MarketingSubNav.tsx             # Sub-tab switcher: Overview, Advertisements, Coupons
│       ├── MarketingOverviewTab.tsx        # 12.0: Hub overview with quick campaign cards & KPI rail
│       ├── AdvertisementsTab.tsx           # 12.1: Campaigns list table with status filters
│       ├── CreateAdvertisementWizard.tsx   # 12.2-12.4b: 4-step ad wizard with live customer card preview
│       │   ├── Step1AdTypeSelect.tsx
│       │   ├── Step2TargetEntity.tsx
│       │   ├── Step3BudgetBidding.tsx
│       │   └── Step4AdPreviewReview.tsx
│       ├── AdAnalyticsDrawer.tsx           # 12.5-12.6a: Performance deep-dive drawer with Recharts
│       ├── DiscountsCouponsTab.tsx          # 12.7: Coupons table with usage progress & quick copy
│       ├── CreateCouponWizard.tsx          # 12.7a-12.7d: 2-step coupon wizard
│       │   ├── LiveVoucherTicketPreview.tsx # Perforated interactive ticket preview component
│       │   └── CouponSuccessModal.tsx
│       ├── SelectProductsModal.tsx         # Multi-select product picker for campaigns
│       └── SelectCategoriesModal.tsx       # Multi-select category tree picker
└── stores/
    └── marketingStore.ts                   # Comprehensive state for campaigns, coupons, and wizards
```

---

## 4. State Management Specifications (`marketingStore.ts`)

```typescript
export interface Advertisement {
  id: string;
  name: string;
  type: 'Sponsored Product' | 'Store Spotlight' | 'Category Spotlight' | 'Banner Ad';
  status: 'Active' | 'Paused' | 'Scheduled' | 'Ended';
  budgetDaily: number;
  totalSpend: number;
  revenueGenerated: number;
  impressions: number;
  clicks: number;
  ctr: number;
  roas: number;
  startDate: string;
  endDate: string;
  targetId: string; // Product SKU or Category ID
  targetName: string;
}

export interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  maxDiscount?: number;
  minOrderValue?: number;
  usageLimit: number;
  usageCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableOn: 'all' | 'products' | 'categories';
  applicableIds?: string[];
}
```

---

## 5. Mandatory White-Label & Compliance Guardrails

> [!CAUTION]
> **ZERO CLIENT BRAND STRINGS PERMITTED IN SOURCE CODE**
> - The client brand name (`Viztore`) and acronym (`VZT`) must **NEVER** appear in any TSX markup, comments, mock datasets, or placeholders.
> - **Brand Interpolation:** Always import `branding` from `@repo/shared-types/branding.config` and use `{branding.appName}`.
> - **Identifiers:** Use generic identifier prefixes:
>   - Ad Campaigns: `CMP-2024-001`, `CMP-2024-002` (never `VZT-CMP-...`)
>   - Coupons: `WELCOME50`, `SUMMER20`, `FREESHIP`
>   - Products / SKUs: `PRD-10245`

---

## 6. Acceptance Criteria & Definition of Done

- [ ] **4-Step Ad Builder:** All 4 steps transition seamlessly with complete form validation, wallet balance check, and live product preview card.
- [ ] **Live Voucher Ticket Preview:** As the user types coupon code, discount percentage, and min order, the ticket preview updates instantaneously with dashed cut lines.
- [ ] **Ad Performance Drawer:** Recharts impressions vs. clicks curve renders cleanly with tooltips, CTR calculation, and ROAS metrics.
- [ ] **Table Actions:** Toggling pause/resume directly updates campaign status badge and stores state reactively.
- [ ] **Clean Production Build:** `pnpm build` succeeds with zero TypeScript errors or bundle warnings.

---

## 7. Git & Development Workflow

```bash
# 1. Checkout feature branch from main
git checkout main
git pull origin main
git checkout -b feature/abhay-marketing-campaigns-suite

# 2. Develop and test in merchant app
cd apps/merchant
pnpm dev

# 3. Verify clean production build
pnpm build

# 4. Commit locally with impersonal, conventional commit messages
git add .
git commit -m "feat(merchant): implement marketing campaign engine, ad builder wizard and interactive coupon suite"
```

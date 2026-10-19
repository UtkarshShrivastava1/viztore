# 📋 Task Brief: 9-Tab Store Settings & Operational Policies Hub

**Task ID:** `TASK-ABH-13`  
**Assignee:** Abhay ([`@Abhay0410`](https://github.com/Abhay0410))  
**Target Workspace:** `apps/merchant/` (React 18 + Vite SPA)  
**Feature Branch:** `feature/abhay-store-settings-hub`  
**Base Branch:** `main`  
**Delivery Window:** 3 Working Days (72 Hours)  
**Design Reference Directory:** `mockups/Merchant_Front/14.) Settings/` (**9 Mockup Screens**)  

---

## 1. Context & Objective

As part of the Tier 2 platform hardening and pilot retailer launch in Bhilai/Durg, merchants need a centralized, production-grade **Store Settings & Operational Policies Hub**. While a basic settings stub currently exists in `StoreSettingsPage.tsx`, Harish has provided a dedicated **9-screen specification** covering the complete retailer configuration lifecycle.

**Your Objective:**  
Construct the complete **9-tab Store Settings Hub** matching Harish's mockups (`14.0.png` through `14.8.png`) with pixel-level fidelity, responsive desktop/tablet layouts, smooth tab transitions, instant unsaved changes tracking, and reactive Zustand state persistence.

---

## 2. Mockup Reference & Image Mapping

All 9 mockup screenshots are located in your local repository under `mockups/Merchant_Front/14.) Settings/`:

| # | Mockup File | Screen Title & Tab Scope | Key UI Elements & Interactive Components |
|:---:|---|---|---|
| 1 | `14.0.png` | **Store Profile** | Profile completeness indicator (e.g. `80% Complete`), Store Display Name, Logo (512×512) uploader, Web/Mobile banner uploader, Short bio/description, Category vertical picker, Operational status pill (`● Store Active`). |
| 2 | `14.1.png` | **Business & Tax Information** | Legal Entity Name, PAN Number (10-char regex), GSTIN (15-char regex with verified green badge), FSSAI license number (14 digits) for food retailers, Registered Business Address with pin-code lookup. |
| 3 | `14.2.png` | **Store Timings & Delivery Radius** | 7-day operating hours matrix (Monday–Sunday toggles, opening/closing time pickers, "Open on Holidays" toggle), Hyperlocal delivery radius slider/stepper (`3–4 km`), Minimum order value, Delivery fee threshold (`Free delivery above ₹499`). |
| 4 | `14.3.png` | **Billing & Invoicing Preferences** | Sequential invoice numbering format (`INV-` prefix, starting number `1001`), Estimate/Quote sequence (`Q-`), Thermal receipt format selector (`80mm Roll`, `58mm Roll`, `A4 Standard`), Custom footer receipt note, Terms & Conditions text area. |
| 5 | `14.4.png` | **Tax Rates & GST Slabs** | Tax inclusion mode toggle (*Tax Inclusive vs. Tax Exclusive*), Default store HSN/SAC code, Custom GST slabs selector (0%, 5%, 12%, 18%, 28%), Tax breakdown on printed receipt toggle. |
| 6 | `14.5.png` | **Payment & Wallet Sweeps** | Daily automated bank settlement sweep toggle, Bank account verification card (Masked A/C number, IFSC, Bank name), Settlement schedule selector (T+1 vs. T+2), Store dynamic UPI QR code generator with download/print. |
| 7 | `14.6.png` | **Shipping & Returns Policy** | Customer return acceptance toggle, Return window duration pills (`24 Hours`, `48 Hours`, `7 Days`), Return conditions checklist (Tags intact, unwashed, original packaging), Customer return delivery fee policy. |
| 8 | `14.7.png` | **Notifications & Alerts** | WhatsApp customer notification dispatches toggle, Merchant SMS order alerts, In-app audible order chime volume slider & test button, Low-stock email threshold notification, Daily sales summary email. |
| 9 | `14.8.png` | **Security & Staff Management** | Change account password form (current, new, confirm with strength meter), Active login sessions table (Device, IP address, Location, Last active, Revoke button), Staff roles summary card (Owner, Manager, Cashier). |

---

## 3. Architecture & Component Blueprint

Organize your components cleanly under [`apps/merchant/src/components/settings/`](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/platform-root-vz/apps/merchant/src/components/settings/):

```text
apps/merchant/src/
├── components/settings/
│   ├── SettingsTabsNav.tsx            # Horizontal sticky tab bar with icons & completion badges
│   ├── StoreProfileTab.tsx            # Screen 14.0: Completeness bar, logos, banners, store bio
│   ├── BusinessTaxTab.tsx             # Screen 14.1: PAN, GSTIN, FSSAI verification
│   ├── TimingsDeliveryTab.tsx         # Screen 14.2: 7-day schedule, delivery radius slider
│   ├── BillingPreferencesTab.tsx      # Screen 14.3: Prefix formats, 80mm/A4 thermal settings
│   ├── TaxGstSlabsTab.tsx             # Screen 14.4: Inclusive/exclusive tax, GST rate pills
│   ├── PaymentWalletTab.tsx           # Screen 14.5: Auto-sweep, linked bank, UPI QR standee
│   ├── ShippingReturnsTab.tsx         # Screen 14.6: Return window, policies checklist
│   ├── NotificationsTab.tsx           # Screen 14.7: WhatsApp, SMS, Web Audio chime toggles
│   ├── SecurityStaffTab.tsx           # Screen 14.8: Password change, sessions table, RBAC
│   └── SettingsStickyFooter.tsx       # "Save Changes" floating bar with "Discard" & save status
├── pages/
│   └── SettingsPage.tsx               # Orchestrator page mounting SettingsTabsNav & active tab view
└── stores/
    └── settingsStore.ts               # Reactive Zustand store holding all 9 configuration slices
```

---

## 4. Zustand Store Specification (`settingsStore.ts`)

Create or extend `apps/merchant/src/stores/settingsStore.ts` with strict TypeScript typing:

```typescript
export interface StoreProfileSettings {
  storeDisplayName: string;
  primaryCategory: string;
  storeBio: string;
  logoUrl?: string;
  webBannerUrl?: string;
  mobileBannerUrl?: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export interface BusinessTaxSettings {
  legalEntityName: string;
  panNumber: string;
  gstin: string;
  isGstinVerified: boolean;
  fssaiNumber?: string;
}

export interface DaySchedule {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface TimingsDeliverySettings {
  schedule: DaySchedule[];
  deliveryRadiusKm: number; // 3-4 km default
  minimumOrderValue: number;
  deliveryFee: number;
  freeDeliveryAbove?: number;
}

export interface BillingPreferencesSettings {
  invoicePrefix: string; // e.g. "INV-"
  nextInvoiceNumber: number;
  quotePrefix: string;   // e.g. "Q-"
  thermalFormat: '80mm' | '58mm' | 'a4';
  receiptFooterNote: string;
  termsAndConditions: string;
}

export interface TaxGstSettings {
  isTaxInclusive: boolean;
  defaultHsnCode: string;
  applicableGstSlabs: number[]; // [0, 5, 12, 18, 28]
  showTaxBreakdownOnBill: boolean;
}

export interface PaymentWalletSettings {
  autoSweepDaily: boolean;
  settlementAccount: {
    bankName: string;
    accountNumberMasked: string;
    ifscCode: string;
    isVerified: boolean;
  };
  settlementCycle: 'T+1' | 'T+2';
  upiId: string;
}

export interface ShippingReturnsSettings {
  acceptReturns: boolean;
  returnWindowHours: number; // 24, 48, 168
  conditions: string[];
}

export interface NotificationSettings {
  whatsappCustomerUpdates: boolean;
  merchantSmsAlerts: boolean;
  audioChimeEnabled: boolean;
  lowStockEmailThreshold: number;
  dailySalesEmail: boolean;
}
```

---

## 5. Mandatory White-Label & Technical Guardrails

> [!CAUTION]
> **STRICT WHITE-LABEL MANDATE — ZERO BRAND HARDCODING:**
> - The client brand name ("Viztore") and agency name ("Zager") must **NEVER** appear hardcoded in any JSX template, comment, placeholder, or default data string.
> - ✅ **CORRECT:** Always import `{ branding } from '@repo/shared-types'` or use `{branding.appName}`.
> - ✅ **CORRECT:** Format all mock identifiers with generic prefixes: `#ORD-1001`, `SLR-10245`, `STR-8921`.
> - ❌ **FORBIDDEN:** Never write `<title>Viztore Settings</title>` or `"vzt-support@..."`.

> [!IMPORTANT]
> **WORKSPACE ISOLATION:**
> - Confine **all code modifications strictly to [`apps/merchant/`](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/platform-root-vz/apps/merchant/)**.
> - Do not modify `apps/backend/`, `apps/web/`, `apps/company/`, or root configuration files.
> - Preserve all existing thermal printing utilities (`@media print` in `index.css`) and `TableActionPopover` integrations.

---

## 6. Git Submission Workflow

```bash
# 1. Update your local main branch
git checkout main
git pull origin main

# 2. Cut your feature branch
git checkout -b feature/abhay-store-settings-hub

# 3. Start local development server (Port 3001)
pnpm dev:merchant

# 4. Verify clean compilation before submitting
pnpm --filter=@repo/merchant build

# 5. Commit with an impersonal, technical message (NO PERSONAL NAMES in commit)
git add apps/merchant/
git commit -m "feat(merchant): implement 9-tab store settings and operational policies hub"

# 6. Push to remote
git push origin feature/abhay-store-settings-hub
```
Open your Pull Request targeting `main`.

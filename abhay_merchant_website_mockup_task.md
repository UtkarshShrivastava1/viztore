# 📋 TASK-ABH-12: Merchant Public Marketing & Informational Website

**Assigned Contributor:** Abhay ([`@Abhay0410`](https://github.com/Abhay0410))  
**Target Workspace:** `apps/merchant/` (React 18 + Vite SPA + Tailwind CSS + Lucide Icons)  
**Feature Branch:** `feature/abhay-merchant-marketing-website`  
**Design Reference Root:** `mockups/Merchant_Registration/Merchant Website/` (23 Mockup Screens)  
**Task Priority:** High (Public Conversion & Informational Surface)  
**Task Complexity:** Moderate (Purely informational & static presentation pages with interactive dropdowns, accordions, and tabs — zero complex backend APIs)  
**Status:** `IN PROGRESS 🟡`  
**Assigned Date:** October 15, 2026  

---

## 🧭 1. Executive Brief & Scope Overview

Harish has organized a brand-new **Merchant Website** design suite inside `mockups/Merchant_Registration/Merchant Website/` containing **23 high-fidelity screens**. 

This suite represents the **public-facing merchant acquisition and information portal** for local retailers. It educates shopkeepers on how the platform works, presents transparent annual pricing plans (₹12,000 Standard vs. ₹16,000 Premium), guides them on catalog listing and local discovery, and provides self-serve Help Centre articles, FAQs, video guides, seller blogs, and legal policies.

### Core Objectives
1. **Responsive Public Layout:** Create `MerchantPublicLayout.tsx` with a shared sticky `MerchantNavbar.tsx` (including interactive mega-menu dropdowns for **"Sell Online ▾"** and **"Learn ▾"**) and universal 4-column `MerchantFooter.tsx` (matching `Footer.png`).
2. **23 Mockup Screen Implementation:** Build modular, cleanly structured presentation pages mapped directly to Harish's mockups.
3. **Interactive Micro-Interactions:** Implement tab switchers, FAQ accordions, video guide cards with modal previews, and breadcrumbs.
4. **Strict White-Label Compliance:** Zero occurrences of `"Viztore"` or `"VZT"` in code or copy — all branding dynamically resolves to `branding.appName` and `branding.supportEmail`.

---

## 🗺️ 2. Direct Mockup-to-Route Mapping Table (23 Screens)

| # | Mockup File | Screen Title & Category | Recommended Route in `apps/merchant` | Key Visual Elements & Content |
|:---:|---|---|---|---|
| **1** | `1.0.png` | **Merchant Landing Homepage** | `/` or `/marketing` | Hero with 3D devices, 4 value pills, "Why Sell" grid, 6-feature "Everything You Need" grid, 5-step numbered horizontal workflow, discoverability map card, category badges, growth tools grid, blue pre-footer CTA banner. |
| **2** | `1.0a.png` | **"Sell Online ▾" Mega-Menu** | Global Dropdown Component | 2-column floating dropdown: Start Selling, List Products, Manage Your Store, Orders & Delivery, Seller Tools + bottom blue "New to platform?" CTA card. |
| **3** | `1.1.png` | **List Products Informational Page** | `/sell-online/list-products` | Breadcrumb, hero preview of catalog UI, 6 features grid, 6-step listing workflow (`01 Add Product` ➔ `06 Publish`), product creation mockup showcase, discovery preview card. |
| **4** | `1.2.png` | **Manage Your Store Page** | `/sell-online/manage-store` | 8-feature operational tool grid (Product, Inventory, Billing, Orders, Customers, Reports, Promotions, Store Settings), 5-step onboarding workflow, local customer reach banner. |
| **5** | `1.3.png` | **Orders & Delivery Page** | `/sell-online/orders-delivery` | Orders management dashboard preview, 4 delivery benefit cards, 5-step fulfillment timeline (`01 Receive Orders` ➔ `05 Order Completed`), courier delivery boy visual, additional benefits tiles. |
| **6** | `1.4.png` | **Seller Tools Page** | `/sell-online/seller-tools` | 11-tool exploration grid with arrow indicators, featured tool deep-dive (**Store QR Code Generator** with download & print standee preview), 4-step setup sequence. |
| **7** | `2.0.png` | **How It Works (5-Step Overview)** | `/how-it-works` | 5-step sequence cards (`01 Create Account` ➔ `05 Fulfil & Grow`), unified platform tools grid, customer discoverability section with mobile mockup. |
| **8** | `2.1.png` | **Local Discovery Deep-Dive** | `/how-it-works/local-discovery` | Map pin radius illustration (2 km), 5-step discovery pipeline (`01 List Products` ➔ `05 Get More Orders`), search result card previews, merchant business benefits. |
| **9** | `3.0.png` | **Pricing & Plans Page** | `/pricing` | Standard Plan (₹12,000/yr) vs. Premium Plan (₹16,000/yr - Recommended), full feature comparison checklist table, 6 collapsible pricing FAQs. |
| **10** | `4.0.png` | **Grow Business Overview** | `/grow-business` | Analytics curve hero, 4 growth pillar cards (Local Discovery, Promotions, Delivery Orders, Stronger Brand), 4 tool previews (Listings, Profile, Offers, Analytics). |
| **11** | `4.1.png` | **Local Discovery Growth** | `/grow-business/local-discovery` | 4-step search discovery workflow, store appearance placements (Search results, Category pages, Nearby stores, Offers & Promotions), business benefits. |
| **12** | `5.0.png` | **Learn Hub & Dropdown** | `/learn` & Global Dropdown | Mega-menu dropdown for "Learn ▾" (How It Works, Local Discovery, Business Guides, Video Tutorials, Help Centre, FAQs, Blog, Support) + 5-step store setup cards. |
| **13** | `5.0a.png` | **Learn Dropdown Variant** | Global Dropdown Component | Focused sub-menu dropdown overlay. |
| **14** | `5.1.png` | **Local Discovery Guide** | `/learn/local-discovery` | Discovery workflow with retailer testimonial quote cards (Priya Sharma, Rahul Verma, Neha Jain) and star ratings. |
| **15** | `5.2.png` | **Business Guides Page** | `/learn/guides` | Category tab filter (Getting Started, Products, Orders, Setup, Marketing, Billing), 4 featured articles with read times, video guides row, downloadable resources. |
| **16** | `5.2a.png` | **Guide Article Detail View** | `/learn/guides/:slug` | In-depth reader layout with markdown typography, sticky table of contents, and related guide recommendations. |
| **17** | `5.3.png` | **Video Tutorials Page** | `/learn/tutorials` | Video gallery with duration pills (3:24, 4:12, 3:50), category tabs, popular playlists, latest tutorials, and troubleshooting help links. |
| **18** | `5.4.png` | **Help Centre Hub** | `/help` | Search bar, 8 help topic tiles (Getting Started, Products, Orders, Inventory, Billing, Marketing, Settings, Account), popular articles, quick FAQs, contact banner. |
| **19** | `5.5.png` | **Frequently Asked Questions (FAQs)**| `/faqs` | Category sidebar filter (Getting Started, Products, Orders, Inventory, Billing, Settings, Account), numbered accordion items with smooth expand/collapse. |
| **20** | `5.6.png` | **Seller Blog** | `/blog` | Featured blog posts grid with category badges and read times, popular posts sidebar list, article search bar. |
| **21** | `5.6a.png` | **Blog Article Post View** | `/blog/:slug` | Full-width article layout with author pill, publication date, social share triggers, formatted body content, and next article footer. |
| **22** | `5.7.png` | **Contact Support Page** | `/help/contact` or `/contact` | Call Support card (`+91 91091 07251`), Email card (`support@...`), Common Support Questions accordion, right-hand Quick Links rail. |
| **23** | `Footer.png` | **Global Marketing Footer** | `MerchantFooter.tsx` | 4-column link tree (Sell Online, Grow Business, Learn, Company), Google Play & App Store badges, Durg/Bhilai HQ address pin, Indian flag badge. |

---

## 🏗️ 3. Recommended Component Architecture

Organize the new pages and components inside `apps/merchant/src/` under dedicated marketing folders:

```text
apps/merchant/src/
├── components/
│   └── marketing/
│       ├── MerchantPublicLayout.tsx      # Wraps all public marketing pages with Navbar + Footer
│       ├── MerchantNavbar.tsx            # Sticky header with logo, nav links, and mega-menus
│       ├── MerchantFooter.tsx            # 4-column footer matching Footer.png
│       ├── SellOnlineDropdown.tsx        # Mega-menu dropdown for 1.0a.png
│       ├── LearnDropdown.tsx             # Mega-menu dropdown for 5.0.png / 5.0a.png
│       ├── PricingCard.tsx               # Standard vs Premium plan pricing card
│       ├── FeatureComparisonTable.tsx    # Checklist comparison table for plans
│       ├── FaqAccordion.tsx              # Reusable expandable accordion with +/- icons
│       ├── StepWorkflow.tsx              # Numbered horizontal sequence (01 to 05)
│       ├── VideoCard.tsx                 # Video thumbnail with play button and duration pill
│       └── TestimonialCard.tsx           # Retailer quote with 5-star rating and avatar
│
└── pages/
    └── marketing/
        ├── MerchantHomePage.tsx          # 1.0.png
        ├── SellOnlinePage.tsx            # 1.1 - 1.4 sub-tabs or pages
        ├── HowItWorksPage.tsx            # 2.0.png
        ├── LocalDiscoveryPage.tsx        # 2.1.png & 4.1.png
        ├── PricingPage.tsx               # 3.0.png
        ├── GrowBusinessPage.tsx          # 4.0.png
        ├── BusinessGuidesPage.tsx        # 5.2.png
        ├── VideoTutorialsPage.tsx        # 5.3.png
        ├── HelpCentrePage.tsx            # 5.4.png
        ├── FaqPage.tsx                   # 5.5.png
        ├── SellerBlogPage.tsx            # 5.6.png
        ├── ContactSupportPage.tsx        # 5.7.png
        └── legal/
            ├── TermsPage.tsx             # Terms of Use
            ├── PrivacyPage.tsx           # Privacy Policy
            └── RefundPolicyPage.tsx      # Refund and Cancellation Policy
```

---

## 🎨 4. Design System Tokens & Aesthetics

* **Primary Blue:** `#0038ed` (Buttons, active tabs, icon highlights, badges)
* **Dark Navy Surface:** `#081028` / `#0f172a` (Headings, primary typography, dark accents)
* **Soft Backgrounds:** `#f8fafc` / `#f0f7ff` / `#edf4ff` (Hero backdrops, card surfaces)
* **Card Borders:** `border border-slate-200/80 rounded-2xl shadow-xs`
* **Icons:** Standard `lucide-react` icons exclusively (`Store`, `ShoppingBag`, `TrendingUp`, `Compass`, `ShieldCheck`, `HelpCircle`, `CheckCircle2`, `ArrowRight`, `Play`, `Phone`, `Mail`).
* **Typography:** Clean sans-serif hierarchy matching our existing Tailwind configuration.

---

## 🛡️ 5. MANDATORY White-Label Guardrails

> [!CRITICAL]
> **Zero Brand Name Leakage**: Harish's mockups contain the client brand name (`Viztore`) across headings, banners, and URLs. You must **NEVER** write `"Viztore"` or `"VZT"` in any component, template, or comment.

### Translation Rules:
1. **Brand Name:** Replace all `"Viztore"` occurrences with `{branding.appName}` imported from `apps/merchant/src/lib/branding.ts` (e.g., `Take Your Local Store Online with {branding.appName}`).
2. **Support Email:** Replace `support@viztore.com` with `{branding.supportEmail}`.
3. **App Tagline:** Replace `"Making Local Stores Visible"` with `{branding.tagline}`.
4. **Order / SKU Prefix:** In sample product illustrations, use `#ORD-xxxxx` and `PRD-xxxxx` (never `#VZ...` or `VZT...`).

---

## 🚀 6. Git Workflow & Acceptance Checklist

### Setup Feature Branch:
```bash
git checkout main
git pull origin main
git checkout -b feature/abhay-merchant-marketing-website
```

### Verification & Testing:
```bash
# Ensure strict type-checking and clean production build
pnpm --filter merchant build
```

### Acceptance Checklist:
- [ ] `MerchantPublicLayout.tsx` cleanly renders `MerchantNavbar` and `MerchantFooter` on all public marketing routes.
- [ ] Mega-menu dropdowns for **"Sell Online ▾"** and **"Learn ▾"** open smoothly on hover or click and close on outside click.
- [ ] Pricing page correctly displays both **Standard (₹12,000/yr)** and **Premium (₹16,000/yr)** plans with the feature comparison table.
- [ ] FAQ page supports expandable accordions with smooth open/close transitions.
- [ ] All "Start Selling →" buttons route seamlessly to `/register` (or trigger the onboarding pipeline).
- [ ] All "Login" buttons route to `/login`.
- [ ] Zero occurrences of `"Viztore"` or proprietary brand strings in code or copy.
- [ ] `pnpm --filter merchant build` passes with **0 errors**.

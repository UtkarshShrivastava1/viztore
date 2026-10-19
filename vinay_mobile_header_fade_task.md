# 📋 Intern Task Brief: Unified Mobile Header Gradient Fade Effect (`TASK-VIN-12`)

**Assignee:** Vinay Kumar ([`@VVinaykumar003`](https://github.com/VVinaykumar003))  
**Target Workspace:** `apps/web/` (Next.js 14+ Customer Web Storefront)  
**Feature Branch:** `feature/vinay-mobile-header-fade`  
**Assigned Date:** October 19, 2026  
**Target Delivery Window:** 48 Hours  
**Evaluation Standard:** **9.8+ / 10** (Pixel-Level Fidelity & Visual Fluidity)

---

## 🎯 Task Objective & Context

In the founder & designer's latest review of the customer mobile viewport, Harish highlighted the **signature blue-to-white gradient fade effect** present in the **My Account** mobile screen (`Mob 4.0.png`). 

Currently, on the **My Account** page, the deep navy header background (`#011A5D`) smoothly and organically fades downward through royal blue into soft sky mist (`#D4E3FA` / `#EEF4FE`) and seamlessly dissolves into the clean white page background behind the floating search bar. However, across other mobile pages (Home, Categories, and simple-header subpages like `/account/orders`, `/account/addresses`, `/checkout`), the header either cuts off abruptly with sharp background contrasts or displays a plain flat white box (`bg-white`).

**Your Goal:** Standardize and unify this **signature blue-to-white vertical gradient fade effect** across **ALL mobile viewpages** in `apps/web/`, giving the entire customer mobile experience a cohesive, high-end, premium aesthetic.

---

## 🖼️ Design Reference Mapping

| # | Reference Screen | Current State | Required Target State |
|:---:|---|---|---|
| **1** | **My Account (`Mob 4.0.png`)** | **Canonical Reference Model** | Deep navy top bar (`#011A5D`) with location pill, flowing into a vertical gradient fade (`#1A49A2` ➔ `#6894D8` ➔ `#D4E3FA` ➔ `#FFFFFF`) behind the search bar. This is the **gold standard** to emulate across all pages. |
| **2** | **Home (`Mob 1.0.png`)** | Header ends abruptly below category tabs; harsh color boundary against white content cards. | Extend and harmonize the gradient fade so the lower portion of the header dissolves smoothly into the white content background (`#FFFFFF`) with soft misty fog behind category icons. |
| **3** | **Categories (`Mob 2.0.png`)** | Mobile category explorer has a flat or sharp header boundary before the split navigation rail. | Unify the top header with the blue-to-white fade so the sticky category rail and banner cleanly blend with the header gradient. |
| **4** | **Sub-Pages (`/account/*`, `/checkout`)** | Currently uses `isSimpleHeader` with flat, unbranded `bg-white` box, breaking visual continuity. | Transform the simple header to feature a subtle, compact version of the blue-to-white gradient fade with white back arrow, brand logo, and cart/wishlist icons. |

---

## 🔍 Detailed Component & Architecture Requirements

### 1. Unified Gradient Utility & Design Token
Inspect [`apps/web/src/components/layout/MobileHeader.tsx`](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/platform-root-vz/apps/web/src/components/layout/MobileHeader.tsx):
- Refine the multi-stop linear gradient token:
  ```css
  background: linear-gradient(
    180deg,
    #011A5D 0%,
    #011B62 25%,
    #002070 45%,
    #01267F 55%,
    #04318C 62%,
    #1A49A2 68%,
    #3A6AC0 73%,
    #6894D8 78%,
    #9EBEEC 84%,
    #D4E3FA 91%,
    #EEF4FE 96%,
    #FFFFFF 100%
  );
  ```
- Retain the soft radial mist / diffused glow overlay:
  ```css
  background: radial-gradient(
    ellipse 95% 75% at 50% 90%,
    rgba(255, 255, 255, 0.45) 0%,
    rgba(255, 255, 255, 0) 80%
  );
  ```
- Ensure the bottom edge of `MobileHeader` has **zero border or sharp shadow** that would disrupt the seamless transition into page content.

### 2. Standardizing Simple Sub-Page Headers (`isSimpleHeader`)
In [`apps/web/src/components/layout/MobileHeader.tsx`](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/platform-root-vz/apps/web/src/components/layout/MobileHeader.tsx), `isSimpleHeader` currently forces:
```tsx
{/* ❌ OLD: Flat stark white box */}
{isSimpleHeader && (
  <div className="absolute inset-0 z-0 bg-white" />
)}
```
**Change to:**
- When `isSimpleHeader` is active, apply an elegant, compact gradient fade variant that starts with deep navy blue at the status/top bar and smoothly fades out to white at the bottom edge.
- Update back-arrow button, header title, and action icons so they have crisp contrast:
  - If placed in the upper deep-navy zone: crisp white text (`text-white`) and white chevron.
  - If placed in the lower faded transition zone: deep navy text (`text-[#0B2562]`).

### 3. Page-by-Page Visual Audit Checklist (Mobile Viewport `< 768px`)
Verify that every mobile route has seamless gradient transition:
- [ ] **Home Page (`/`)**: TopBar ➔ LocationBar ➔ SearchBar ➔ CategoryTabs ➔ Soft fade into Hero Carousel & Deals.
- [ ] **Categories Page (`/category`)**: Smooth gradient behind header leading into the split `CategorySidebarRail` and `SubcategoryGrid`.
- [ ] **Account Hub (`/account`)**: Canonical reference screen — verify zero regressions on profile card and orders summary.
- [ ] **Sub-Account Pages (`/account/orders`, `/account/addresses`, `/account/wishlist`, `/account/coupons`, `/account/support`)**: Verify new branded fade header with back button.
- [ ] **Cart & Checkout (`/cart`, `/checkout`)**: Clean header fade transition into cart item cards and address selectors.

---

## 🛡️ Mandatory White-Label Rules

> [!CAUTION]
> **STRICT WHITE-LABEL MANDATE**
> - **Zero Brand Names in Code**: The client brand name ("Viztore" / "Zager" / "VZT") must **NEVER** be hardcoded anywhere in components, styles, or alt tags.
> - Always import and use `{branding.appName}` from `@repo/shared-types`.
> - Generic identifier prefixes only (`#ORD-...`, `PRD-...`, `STR-...`).

---

## 🛠️ Step-by-Step Git Workflow

```bash
# 1. Ensure main is up-to-date
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/vinay-mobile-header-fade

# 3. Work strictly inside apps/web/
# Modify apps/web/src/components/layout/MobileHeader.tsx, Header.tsx, and related layout styles.

# 4. Verify monorepo build and test suite
pnpm --filter @repo/web build
pnpm build
pnpm test

# 5. Commit with conventional impersonal message
git add apps/web/
git commit -m "feat(web): standardize blue-to-white header gradient fade across mobile routes"
git push origin feature/vinay-mobile-header-fade
```

---

## 📊 Evaluation Rubric (Target: 9.8 / 10)

1. **Pixel & Layout Fidelity (25%)**: Smooth, unbanded gradient fade matching `Mob 4.0.png`.
2. **Visual Consistency (25%)**: 100% of mobile pages share the signature atmospheric fade.
3. **White-Label Compliance (20%)**: 0 brand leaks.
4. **Build & Type Safety (15%)**: Zero Next.js / TypeScript build errors.
5. **Git Discipline (15%)**: Clean branch, strictly confined to `apps/web/`.

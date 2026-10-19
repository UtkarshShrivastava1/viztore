# 📋 Task Brief: Corporate Marketing Website Visual QA Audit & Inconsistency Remediation

**Task ID:** `TASK-VIN-10`  
**Assignee:** Vinay Kumar ([`@VVinaykumar003`](https://github.com/VVinaykumar003))  
**Target Workspace:** `apps/company/` (Next.js 15 Corporate Marketing Website, Port `3002`)  
**Feature Branch:** `feature/vinay-company-website-qa`  
**Base Branch:** `main`  
**Delivery Window:** 48 Hours  
**Deliverable Document:** `apps/company/COMPANY_WEB_QA_AUDIT_REPORT.md`  

---

## 1. Context & Overview

You recently developed the corporate SaaS and marketing website for the platform. The Technical Head and Lead Architect have ingested your standalone build directly into the Turborepo monorepo at [`apps/company/`](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/platform-root-vz/apps/company/).

During ingestion and wiring, several monorepo structural enhancements were made:
1. **Monorepo Package Linking**: Registered as `@repo/company`, wired to `@repo/shared-types` via Turborepo.
2. **Dedicated Dev Port**: Configured to run on **`http://localhost:3002`** (`pnpm dev:company`).
3. **React 18 Harmonization**: Aligned React dependencies with the monorepo standard (`react@^18.3.1`, `@types/react@^18.3.18`).
4. **100% White-Label Sanitization**: Replaced all hardcoded client brand occurrences with dynamic properties from `@repo/shared-types` (`branding.appName`, `branding.supportEmail`, `branding.companyAddress`, etc.). The DaisyUI theme was renamed from `viztore` to `company`.
5. **Static Route Pre-rendering**: All 13 static pages pre-render cleanly with 0 type errors.

**Your Mission:**  
You must perform an exhaustive, screen-by-screen visual QA check of the ingested `apps/company/` application running in the monorepo compared against your original standalone build. Ensure all layouts, animations, typography, DaisyUI styling, and responsive viewports match 100% pixel-for-pixel. If any discrepancies or styling breaks exist, fix them cleanly and deliver a comprehensive QA Audit Report.

---

## 2. Step-by-Step Execution Workflow

### Step 1: Branch Setup & Environment Verification
Run the following in your terminal:
```bash
# 1. Fetch latest changes from main
git checkout main
git pull origin main

# 2. Create your dedicated QA feature branch
git checkout -b feature/vinay-company-website-qa

# 3. Start the corporate website development server
pnpm dev:company
```
Open **`http://localhost:3002`** in your browser.

---

### Step 2: 13-Route Visual & Interaction Audit Matrix

Cross-check every route listed below across **Mobile (375px–425px)**, **Tablet (768px–1024px)**, and **Desktop (1280px–1920px)**:

| # | Route | Scope & Key Components to Validate | Target File | Status |
|---|---|---|---|:---:|
| 1 | `/` | Sticky Navbar (logo swap on scroll), Hero section glow, DeliveryScooter, PhoneMockup, ProblemSection, WhyChooseUs, Features, RetailCategories, CTASection | `app/page.tsx`, `components/home/*` | `[ ]` |
| 2 | `/for-retailers` | PageHero, CategoryCard grid, retailer growth metrics, "Why Retailers Choose the Platform", CTASection | `app/for-retailers/PageContent.tsx` | `[ ]` |
| 3 | `/for-customers` | PageHero, Customer features list, Phone mockup integration, CTASection | `app/for-customers/PageContent.tsx` | `[ ]` |
| 4 | `/platform` | PageHero, PlatformEcosystem, PlatformColumns, PlatformHighlights, PlatformSearchFlow, PlatformCategories, PlatformIntegrations | `app/platform/page.tsx`, `components/platform/*` | `[ ]` |
| 5 | `/about-us` | PageHero, Mission & Story, Timeline cards, Values, Team culture | `app/about-us/PageContent.tsx` | `[ ]` |
| 6 | `/careers` | CareersHero, CareersValues, OpenPositions list (mailto links), CareersCTA | `app/careers/CareersPageContent.tsx`, `components/careers/*` | `[ ]` |
| 7 | `/contact` | ContactHero, ContactDirectInfo (support email, phone, address), ContactForm | `app/contact/ContactPageContent.tsx`, `components/contact/*` | `[ ]` |
| 8 | `/terms-and-conditions` | TermsHero, TermsContent with 5 policy tabs (`customer`, `seller`, `privacy`, `refund`, `grievance`), search filter input, sidebar nav | `app/terms-and-conditions/TermsPageContent.tsx`, `components/terms/*` | `[ ]` |
| 9 | `/refund-policy` | Dedicated refund & cancellation policy clauses, layout spacing | `app/refund-policy/page.tsx` | `[ ]` |
| 10 | `/grievance-redressal` | Grievance officer details, escalation matrix, resolution timelines | `app/grievance-redressal/page.tsx` | `[ ]` |
| 11 | Global Navbar | Desktop links, mobile drawer menu, smooth anchor/route navigation, logo visibility on transparent vs white backgrounds | `components/layout/Navbar.tsx` | `[ ]` |
| 12 | Global Footer | Navy footer, multi-column links, legal entity copy, social links, dynamic app name & copyright | `components/layout/Footer.tsx` | `[ ]` |
| 13 | Not Found (`404`) | Custom 404 page layout, "Back to Home" button | `app/_not-found.tsx` | `[ ]` |

---

### Step 3: Critical Boundaries & Architectural Rules

> [!CAUTION]
> **MANDATORY WHITE-LABEL RULE — DO NOT VIOLATE:**  
> The client brand name ("Viztore") and agency name ("Zager") must **NEVER** be hardcoded in any component, template, comment, or asset.
> - ✅ **CORRECT:** `import { branding } from '@repo/shared-types';` ➔ `{branding.appName}`, `{branding.supportEmail}`
> - ❌ **STRICTLY FORBIDDEN:** `<h1>Welcome to Viztore</h1>` or `"info@viztore.com"`

> [!IMPORTANT]
> **WORKSPACE CONFINEMENT:**  
> - Strictly confine all your file edits to [`apps/company/`](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/platform-root-vz/apps/company/).
> - Do **NOT** modify files in `apps/backend/`, `apps/merchant/`, `apps/web/`, or monorepo root configs.
> - Do **NOT** install React 19 packages. Keep `@repo/company` aligned with React 18.

---

### Step 4: Fix Discrepancies & Test Verification
If you discover any visual inconsistency (e.g. missing shadow, broken flex wrap, mismatched font weight, unaligned icon, or broken hover state):
1. Fix the component inside `apps/company/components/` or `apps/company/app/`.
2. Run build verification:
   ```bash
   pnpm --filter=@repo/company build
   ```
   **Acceptance gate:** Next.js static build must generate all 13 routes with **0 errors and 0 warnings**.

---

### Step 5: Deliverable Report

Create the audit report at:  
`apps/company/COMPANY_WEB_QA_AUDIT_REPORT.md`

**Required Structure of the Report:**
1. **Executive Summary**: Pass/Fail verdict, total routes tested (13/13).
2. **Viewport Checklist Table**: Status for Desktop (1440px), Tablet (768px), and Mobile (375px) across all 13 routes.
3. **Inconsistencies Identified & Remediated**: Table of any styling/layout bugs found, affected file, and the exact fix applied.
4. **Animation & Interaction Verification**: Status of scroll reveals, hover lifts, modals, accordions.
5. **Build & White-Label Certification**: Confirmation that `pnpm --filter=@repo/company build` passes and 0 hardcoded brand names exist.

---

### Step 6: Git Submission Commands

```bash
# Check your modified files
git status

# Stage only apps/company changes
git add apps/company/

# Create a clean conventional commit (NO PERSONAL NAMES in commit message)
git commit -m "fix(company): resolve visual inconsistencies and complete 13-route QA audit"

# Push feature branch
git push origin feature/vinay-company-website-qa
```
Then open a Pull Request targeting `main`.

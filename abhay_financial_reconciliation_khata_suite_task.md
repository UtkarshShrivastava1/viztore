# 📋 TASK BRIEF: Advanced Financial Intelligence, Settlements Reconciliation, Customer Khata Aging & Reverse Logistics Suite (`TASK-ABH-16`)

**Assignee:** Abhay ([`@Abhay0410`](https://github.com/Abhay0410))  
**Workspace:** `apps/merchant/` (React 18 + Vite SPA + Tailwind CSS + Zustand)  
**Target Branch:** `feature/abhay-financial-reconciliation-khata`  
**Base Branch:** `main` (branch from latest `main` once `TASK-ABH-15` is completed)  
**Design Reference Directories:**
- `mockups/Merchant_Front/11.) Reports & Analytics/` (`11.7.png`, `11.8.png`, `11.9.png`)
- `mockups/Merchant_Front/6.) Customers/` (`6.2.png`, `6.3.png`, `6.4.png`, `6.6.png`)
- `mockups/Merchant_Front/7.) Wallet/` (`7.1.png`, `7.2.png`, `7.3.png`)
- `mockups/Merchant_Front/9.) Returns & Refunds/` (`9.2.png`, `9.3.png`)
- `mockups/Merchant_Front/10.) Payout & Settlements/` (`10.3.png`)  
**Total Reference Screens:** **13 Screens** across 5 folders  
**Estimated Time:** 3–4 Days  
**Priority:** High (Completes Full Operational & Financial Closure of Merchant Application)

---

## 1. Executive Summary & Objective

In `TASK-ABH-08`, foundational views for Customers, Wallet, Analytics, and Returns were created. While the main grids are functional, Harish's newly organized mockup structure contains **13 critical sub-flows, reconciliation drawers, and risk management tools** that are necessary to achieve 100% production readiness.

Your objective in `TASK-ABH-16` is to deliver the complete **Financial Intelligence & Customer Khata Aging Suite**:
1. **Settlements & Payouts Breakdown Tab (`11.7.png`, `11.8.png`, `10.3.png`)**:
   - Recharts dual curve tracking settlement trend line and volume bars.
   - Settlement status donut chart (*Processed 85.7%*, *Pending 14.3%*, *Failed 0%*).
   - Payment method breakdown table (*Bank Transfer 69.8%*, *UPI 25.2%*, *Card 5.0%*, *Cash 0%*).
   - All Settlements ledger with bank UTR numbers, fee deductions, and 1-click CSV export.
2. **Failed & Reversed Transactions Audit Trail (`11.9.png`)**:
   - Comprehensive error audit table tracking failure reasons (bank timeout, invalid VPA, network drop), automated retry triggers, and reversal status pills.
3. **Customer Khata Aging Summary Breakdown Drawer (`6.4.png`)**:
   - Dedicated slide-over drawer triggered from the customer row showing overdue risk brackets:
     - `0–30 days` (Current)
     - `31–60 days` (Mild overdue)
     - `61–90 days` (Moderate risk)
     - `91–120 days` (High risk)
     - `> 120 days` (Critical risk)
   - Visual bar indicators for invoice counts in each bucket.
   - Outstanding invoice list with red days overdue badges and 1-click WhatsApp payment reminder triggers.
   - Actions to download or print customer statement (`6.3.png`).
4. **Enhanced 5-Tab Customer Details Drawer (`6.2.png`)**:
   - Tabbed customer slide-over (`Overview`, `Orders`, `Invoices`, `Ledger`, `Notes`).
5. **Wallet Top-Up & Timeline Drawers (`7.1.png`–`7.3.png`)**:
   - `7.1`: Transaction timeline drawer with transaction reference, UTR, fee breakdown, and status timeline.
   - `7.2`: Add Money to Wallet drawer with amount chips (₹500, ₹1000, ₹5000), UPI QR preview, and mock payment gateway confirmation.
   - `7.3`: Filtered transaction history drawer.
6. **Reverse Logistics & Return Dispute Drawer (`9.2.png`, `9.3.png`)**:
   - `9.2`: Row action menu (*Accept Return*, *Reject Return*, *Print Return Slip*).
   - `9.3`: `+ Raise Return Request` modal with customer order search, return reason taxonomy, photographic damage proof dropzone, and refund mode selection (Wallet / Original source).

---

## 2. Mockup Reference Mapping

| Mockup Screen | Module / View Title | Key Visual & Interactive Specifications |
|---|---|---|
| `11.7.png` & `11.8.png` | **Settlements Report Tab** | Dual-axis settlement trend curve, settlement status donut chart, payment method breakdown rail, recent settlements rail, full settlements data table with UTR numbers. |
| `11.9.png` | **Failed & Reversed Transactions** | Audit trail table for failed payments with error codes, failure reason badges, retry counter, customer details, and resolution action menu. |
| `10.3.png` | **All Transactions Settlement Ledger** | Complete financial ledger with gross amount, platform commissions, GST on fees, net payout, and UTR tracking. |
| `6.2.png` | **Customer Details 5-Tab Drawer** | Tabbed drawer: `Overview`, `Orders`, `Invoices`, `Ledger`, `Notes` with customer contact pills and lifetime value stats. |
| `6.3.png` | **Customer Statement Drawer** | Date range filter, transaction history list with running balance, PDF download & print buttons. |
| `6.4.png` | **Customer Khata Aging Drawer** | Outstanding & overdue KPI chips, 5 aging bucket bars (`0-30`, `31-60`, `61-90`, `91-120`, `>120`), overdue invoices table with red delay pills, "Print Aging Summary". |
| `7.1.png` | **Transaction Details Drawer** | Slide-over with step timeline, UTR, gateway charge breakdown, and customer order link. |
| `7.2.png` | **Add Money to Wallet Drawer** | Fast amount chips, UPI QR code preview, payment method selector, and secure transaction badge. |
| `7.3.png` | **Transaction History Drawer** | Filtered statement of all credits and debits with export CSV. |
| `9.2.png` | **Returns Row Actions Menu** | Dropdown with Accept, Reject (with reason dialog), and Print Return Slip triggers. |
| `9.3.png` | **Raise Return Request Modal** | Modal with order ID lookup, return item checkbox list, photographic evidence file dropzone, and refund routing. |

---

## 3. Component Hierarchy to Create / Refactor

```text
apps/merchant/src/
├── components/
│   ├── analytics/
│   │   ├── SettlementsReportTab.tsx        # 11.7, 11.8: Dual curve, donut chart, payment methods
│   │   └── FailedTransactionsReportTab.tsx # 11.9: Transaction failures & reversals audit table
│   ├── customers/
│   │   ├── CustomerAgingDrawer.tsx         # 6.4: 5 aging buckets, overdue badges, print summary
│   │   ├── CustomerDetailsDrawer.tsx       # 6.2: Enhanced 5-tab drawer (Overview, Orders, Ledger, etc.)
│   │   └── CustomerStatementDrawer.tsx     # 6.3: Running balance statement with date filter
│   ├── wallet/
│   │   ├── TransactionDetailDrawer.tsx     # 7.1: Timeline, UTR, fee breakdown
│   │   ├── AddMoneyDrawer.tsx              # 7.2: Amount chips, UPI QR, payment gateway
│   │   └── TransactionHistoryDrawer.tsx    # 7.3: Filtered ledger
│   └── returns/
│       ├── RaiseRequestModal.tsx           # 9.3: Order selector, item checklist, photo upload
│       └── ReturnSlipModal.tsx             # 9.2: Printable return dispatch note
└── stores/
    ├── customerStore.ts                    # Customer aging state, outstanding invoices
    ├── walletStore.ts                      # Top-up, transaction timeline
    ├── returnStore.ts                      # Return request creation, inspection
    └── analyticsStore.ts                   # Settlements & failure report filters
```

---

## 4. Mandatory White-Label & Compliance Guardrails

> [!CAUTION]
> **ZERO CLIENT BRAND STRINGS PERMITTED IN SOURCE CODE**
> - The client brand name (`Viztore`) and acronym (`VZT`) must **NEVER** appear in any TSX markup, comments, mock datasets, or placeholders.
> - **Brand Interpolation:** Always import `branding` from `@repo/shared-types/branding.config` and use `{branding.appName}`.
> - **Identifiers:** Use generic identifier prefixes:
>   - Customers: `CUS-1001`, `CUS-1002` (never `VZT-CUS-...`)
>   - Invoices: `INV-1248`, `BILL-2024-0001`
>   - Settlements: `#SET-000342`
>   - Returns: `RET-2024-0089`

---

## 5. Acceptance Criteria & Definition of Done

- [ ] **Settlements Trend & Donut Charts:** Recharts components in `SettlementsReportTab.tsx` match `11.7.png` with tooltips and responsive scaling.
- [ ] **Customer Aging Breakdown:** Opening `CustomerAgingDrawer.tsx` on any customer displays accurate 0–120+ day aging bars, overdue invoice chips, and printable summary.
- [ ] **Wallet Add Money Flow:** `AddMoneyDrawer.tsx` dynamically calculates GST/charges and simulates successful wallet balance increase.
- [ ] **Failed Transactions Audit:** `FailedTransactionsReportTab.tsx` lists transaction failures with error badges and functional retry actions.
- [ ] **Raise Return Modal:** `RaiseRequestModal.tsx` supports multi-item return selection with image upload dropzone.
- [ ] **Clean Production Build:** `pnpm build` passes with zero errors across the entire monorepo.

---

## 6. Git & Development Workflow

```bash
# 1. Checkout feature branch from main
git checkout main
git pull origin main
git checkout -b feature/abhay-financial-reconciliation-khata

# 2. Develop and test in merchant app
cd apps/merchant
pnpm dev

# 3. Verify clean production build
pnpm build

# 4. Commit locally with impersonal, conventional commit messages
git add .
git commit -m "feat(merchant): implement settlements reconciliation, customer aging khata, and return dispute workflows"
```

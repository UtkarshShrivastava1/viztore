# 📋 TASK BRIEF: Enterprise Procurement, Vendors Hub & Advanced Expense Management (`TASK-ABH-14`)

**Assignee:** Abhay ([`@Abhay0410`](https://github.com/Abhay0410))  
**Workspace:** `apps/merchant/` (React 18 + Vite SPA + Tailwind CSS + Zustand)  
**Target Branch:** `feature/abhay-procurement-vendors-hub`  
**Base Branch:** `main` (clean, 127/127 backend tests passing)  
**Design Reference Directory:** `mockups/Merchant_Front/8.) Purchase Expense/` (Screens `8.10`–`8.15`) & `mockups/Merchant_Front/15.) Support/` (Screen `15.1`)  
**Estimated Time:** 2–3 Days  
**Priority:** High (Completes B2B Physical Store Procurement Loop)

---

## 1. Executive Summary & Objective

In `TASK-ABH-08`, an initial functional baseline was established for Expenses and Purchases. With Harish's newly organized mockup suite, `Folder 8` now contains **20 dedicated screens** and `Folder 15` introduces the dedicated **Support Ticket lifecycle**.

Your objective in `TASK-ABH-14` is to deliver the complete **Enterprise Procurement & Vendors Hub**:
1. **Dedicated Vendors Directory Tab (`8.10.png`)**: 4 KPI cards, multi-column search & filter toolbar, and full vendor table with code, contact, GSTIN, purchases, and status.
2. **4-Tab Add/Edit Vendor Drawer (`8.12.png`)**: Tabbed slide-over (`Basic Details`, `Address`, `Contact Persons`, `Other Details`) with GSTIN validation, payment terms, and opening balances.
3. **Generate E-Way Bill Slide-Over Drawer (`8.13.png`)**: Dispatch/delivery locations, vehicle details, distance calculator, and itemized HSN breakdown.
4. **Production Import Modals & Reporting**: Replace placeholder `alert()` popups with real drag-and-drop CSV import dialogs (`Import Purchases`, `Import Expenses`, `Import Vendors`) and dynamic CSV export generation.
5. **Create Support Ticket Form Modal & View (`15.1.png`)**: Dedicated support ticket creator with priority pickers (Low/Medium/High), category taxonomy, character limit counters, and attachment dropzones.

---

## 2. Mockup Reference Mapping

| Mockup File | Screen Title | Key Visual & Interactive Elements |
|---|---|---|
| `8.10.png` | **Vendors Management Tab** | 4 KPI Cards (Total: 28, Active: 24, Inactive: 3, Blocked: 1), search by vendor/code/GSTIN, status filter, city filter, category filter, 9-column data table, pagination. |
| `8.11.png` | **More Actions Dropdown** | Menu items: Add Vendor, Generate E-Way Bill, Import Purchase, Import Expense, Import Vendors, Download Report. |
| `8.12.png` | **Add / Edit Vendor Drawer** | 4 Tabs: `Basic Details` (Business/Individual radio, GSTIN, PAN, Payment terms, credit limits), `Address`, `Contact Persons`, `Other Details` (bank & TDS). |
| `8.13.png` | **Generate E-Way Bill Drawer** | Inward/Outward radio, Source document selector, supplier & recipient details, transport mode, vehicle number, distance calculator, HSN item list. |
| `8.14.png` | **Add Purchase Menu** | Dropdown options: Create Purchase Order, Create Purchase (Bill), Create Purchase Return, Create Direct Purchase. |
| `8.14a.png` | **Create Purchase Order Modal** | Vendor selector with `+ Add New Vendor` shortcut, auto PO number, items line-item table with autocomplete, tax calculations, and notes. |
| `8.15.png` | **Add Expense Modal** | Expense type dropdown, Vendor/Paid To picker, date, reference, notes, amount, tax, payment method, and immediate/credit terms. |
| `15.1.png` | **Create Support Ticket** | Breadcrumbs, ticket subject, category dropdown, 3 priority cards (`Low`, `Medium`, `High`), description textarea with 0/1000 counter, file dropzone, sidebar with direct support hotline. |

---

## 3. Component Hierarchy to Create / Refactor

```text
apps/merchant/src/
├── components/
│   ├── expenses/
│   │   ├── VendorsTab.tsx                  # 8.10: Full Vendors Directory Table & KPI cards
│   │   ├── VendorsKPIBar.tsx               # 8.10: 4 status cards (Total, Active, Inactive, Blocked)
│   │   ├── AddVendorDrawer.tsx             # 8.12: Enhanced 4-tab slide-over form
│   │   ├── GenerateEWayBillDrawer.tsx      # 8.13: E-Way bill generation with transport & HSN items
│   │   ├── ImportProcurementModal.tsx      # Replaces alerts: Handles Purchases, Expenses & Vendors CSV import
│   │   └── ExpensesTable.tsx               # Connects active tab switching (Purchases vs. Vendors)
│   ├── support/
│   │   ├── CreateSupportTicketView.tsx     # 15.1: Full-page view matching 15.1.png
│   │   └── CreateTicketModal.tsx           # Quick modal overlay trigger
│   └── common/
│       └── CsvDropzoneModal.tsx            # Generic drag-and-drop CSV importer with column mapping
└── stores/
    ├── expenseStore.ts                     # Enhanced state for vendors, active tabs, and modals
    └── supportStore.ts                     # State for support tickets, priority, attachments
```

---

## 4. State Management Specifications (`expenseStore.ts`)

Ensure your Zustand store manages:
```typescript
interface Vendor {
  id: string;
  vendorCode: string; // e.g. "VND-001"
  vendorName: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  totalPurchases: number;
  status: 'Active' | 'Inactive' | 'Blocked';
  gstin?: string;
  pan?: string;
  category: string;
  paymentTerms: string;
  creditLimit: number;
  openingBalance: number;
}

interface ExpenseStoreState {
  activeSubTab: 'all' | 'orders' | 'bills' | 'expenses' | 'credit_notes' | 'eway_bills' | 'vendors';
  vendors: Vendor[];
  selectedVendor: Vendor | null;
  isAddVendorOpen: boolean;
  isGenerateEWayBillOpen: boolean;
  isImportModalOpen: boolean;
  importType: 'purchases' | 'expenses' | 'vendors' | null;
  
  // Actions
  setActiveSubTab: (tab: ExpenseStoreState['activeSubTab']) => void;
  openAddVendor: (vendor?: Vendor) => void;
  closeAddVendor: () => void;
  openImportModal: (type: 'purchases' | 'expenses' | 'vendors') => void;
  closeImportModal: () => void;
  saveVendor: (vendor: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
  exportVendorsCsv: () => void;
}
```

---

## 5. Mandatory White-Label & Compliance Guardrails

> [!CAUTION]
> **ZERO CLIENT BRAND STRINGS PERMITTED IN SOURCE CODE**
> - The client brand name (`Viztore`) and acronym (`VZT`) must **NEVER** appear in any TSX markup, comments, mock datasets, or placeholders.
> - **Brand Name Replacement:** Always import `branding` from `@repo/shared-types/branding.config` and use `{branding.appName}`.
> - **Identifiers:** Use generic identifier prefixes:
>   - Vendor codes: `VND-001`, `VND-002` (never `VZT-VND-...`)
>   - PO numbers: `PO-2024-000126` (never `VZT-PO-...`)
>   - Invoices: `BILL-2024-000123`
>   - Support tickets: `TCK-8921`
> - Store name in header: Use generic seller store name like `Fashion Hub` or `{store.name}`.

---

## 6. Acceptance Criteria & Definition of Done

- [ ] **Tab Bar Integration:** Clicking the `Vendors` sub-tab in `ExpensesPage.tsx` cleanly renders `VendorsTab.tsx` with identical styling to `8.10.png`.
- [ ] **Vendor Filter Toolbar:** Search input filters across vendor name, code, phone, and GSTIN; dropdowns filter by status, city, and category; "Clear Filters" restores default state.
- [ ] **Tabbed Add Vendor Drawer:** The 4 tabs (`Basic Details`, `Address`, `Contact Persons`, `Other Details`) switch seamlessly with validated form inputs.
- [ ] **E-Way Bill Generation:** `GenerateEWayBillDrawer.tsx` includes distance calculation, vehicle number formatting, and reactive total calculation.
- [ ] **Zero `alert()` Popups:** All `alert(...)` calls in `ExpensesPage.tsx` replaced with real modal dialogs or toast notifications.
- [ ] **Create Support Ticket:** `15.1.png` is fully functional with reactive priority radio cards, character counter (0/1000), and attachments dropzone.
- [ ] **Clean Production Build:** Running `pnpm build` from the monorepo root succeeds with zero TypeScript errors or broken imports.

---

## 7. Git & Development Workflow

```bash
# 1. Ensure main is up to date
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/abhay-procurement-vendors-hub

# 3. Develop components and verify locally
cd apps/merchant
pnpm dev

# 4. Verify TypeScript and Vite production bundle
pnpm build

# 5. Commit locally with conventional, impersonal messages
git add .
git commit -m "feat(merchant): implement vendors hub, e-way bill drawer, and procurement import modals"
```

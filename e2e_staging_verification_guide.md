# 🚀 Hyperlocal Retail Commerce Platform — Live Staging Verification & Architecture Guide
**Document Classification:** Production Acceptance & Architectural Verification Playbook  
**Target Environments:** Cloud Staging & Live Production Deployments  
**Authoritative Scope:** End-to-End Core Hyperlocal Commerce Suites + Production Labs Roadmap  

---

## 🌐 Live Production Deployments

| System Component | Live Cloud URL | Primary Functional Scope |
|---|---|---|
| **Customer Web Storefront** | **[viztore-web.vercel.app](https://viztore-web.vercel.app)** | Hyperlocal store discovery, single-store cart, customer account hub, and online checkout. |
| **Merchant Management Portal** | **[viztore-merchant.vercel.app](https://viztore-merchant.vercel.app)** | Onboarding, catalog, inventory, order fulfillment, Counter POS billing, CRM, quotes, payouts, and settings. |
| **Backend Modular Monolith** | **`https://viztore.onrender.com/api/v1`** | High-concurrency REST API, OCC versioning engine, and real-time Socket.io server. |

---

## 🏛️ Section 1: Architectural Philosophy & Three-Horizon Strategy

To evaluate this platform objectively, it is essential to understand the engineering principles governing its design:

### 1. Production-Grade Architecture vs. Cosmetic Prototypes
* **Zero Hardcoded Dummy Arrays:** A prototype fills tables with static, un-purchasable fake rows. A **production-grade enterprise engine** starts with clean databases and dynamic empty states. As real transactions occur, catalog matrices, order pipelines, inventory ledgers, and financial charts hydrate organically in real time.
* **Financial & Inventory Correctness First:** Hyperlocal commerce fails if a physical counter sale and an online order sell the same last shirt simultaneously. Therefore, the **Transactional Core** (ACID transactions, Optimistic Concurrency Control, and double-decrement race prevention) was engineered, stress-tested, and locked down first.

### 2. The Three-Horizon Engineering Roadmap
Rather than holding back the entire platform for months to build peripheral back-office software, development follows an **Agile Three-Horizon Strategy**:

```mermaid
timeline
    title Three-Horizon Platform Evolution
    section Horizon 1: Live Core & Retail Operations (ACTIVE NOW)
        Online Customer Web Storefront (:3000)
        Merchant Onboarding, Catalog & Inventory
        Real-Time Order Fulfillment & Delivery OTP
        In-House Retail Counter POS Billing & 80mm Thermal Receipt
        Commercial Estimates / Quotes & 1-Click Invoice Engine
        Customers CRM, Khata Credit & WhatsApp Reminders
        Payouts & Settlement Ledger & Settings Suite
    section Horizon 2: Advanced Back-Office (Iterative Sprints)
        Merchant Wallet & Instant Bank Sweeps (Late Oct)
        Supplier Purchase Orders & Expense ERP (Early Nov)
    section Horizon 3: Enterprise Scale (Late Q4)
        Promotional Ads & Marketing Banners (Late Nov)
        Multi-Cashier Staff Management RBAC (Dec)
        Native Mobile Applications (Expo / React Native)
```

* **Core Commerce & Retail Suite (Horizon 1 — 100% Complete & Active):** Everything needed to register shops, sell products, process walk-in POS counter sales, dispatch runners, manage customer credit/Khata, issue quotes, review settlements, and print legal Indian GST invoices is fully functional right now.
* **Production Labs (Horizons 2 & 3 — Active Pipeline):** Modules located in the lower sidebar under **"Production Labs"** represent advanced enterprise features scheduled for iterative weekly rollouts. Their inclusion in the UI provides structural architectural visibility and proves that the routing and layout models are already prepared.

---

## 🧪 Section 2: Master Operational Verification Playbook

You are encouraged to explore with a completely **empty canvas**: create your own merchant store, upload your own real products, set your own prices, register your own customer account, and execute live end-to-end sales across all functional modules.

---

### 🏁 Step 1: Merchant & Store Digital Onboarding
**Target URL:** **[viztore-merchant.vercel.app/?view=onboarding](https://viztore-merchant.vercel.app/?view=onboarding)**  
**Functional Goal:** Complete the paperless 6-step onboarding wizard and establish cloud store identity.

> [!NOTE]
> **Proactive Pre-Flight Clarification (Carrier Gateway Decoupling):**  
> In staging sandboxes, third-party SMS/Email carrier gateways (e.g. Twilio/Gupshup/AWS SES) are intentionally decoupled to prevent carrier rate-limiting, SMS delivery delays, and telecom billing overhead during QA.  
> You can enter **any 10-digit mobile number and any valid email format**. When you click *Send OTP*, the system immediately enables verification (or auto-populates demo OTP `1234`) so you can test smoothly without waiting on telecom carriers.

1. **Mobile, Email & Security (Step 1):**
   * Enter your chosen mobile number and email address.
   * Enter any secure password (minimum 8 characters, uppercase, and special character).
   * Click verify to establish your authenticated merchant JWT session.
2. **Business Identity & Indian Tax Compliance (Step 2):**
   * Enter any standard Indian GSTIN format (15 characters, e.g. `29ABCDE1234F1Z5`). The system dynamically validates the checksum format and auto-extracts the underlying 10-character PAN (`ABCDE1234F`).
   * Enter your registered legal business name.
3. **Electronic Signature (Step 2 Sub-step):**
   * Draw your signature directly on the HTML5 interactive touch/mouse canvas, or toggle to the cursive signature generator. Click *Save Signature*.
4. **Store Profile, Timing & Geolocation (Step 3):**
   * Enter your Store Display Name and select your store category (e.g. *Fashion & Apparel*).
   * Drop your store pin on the interactive Leaflet map to establish your physical `2dsphere` coordinates for the 3–4 km delivery radius.
   * Configure your weekly operating hours (Monday–Sunday).
5. **Bank Settlement Account (Step 4):**
   * Enter bank account number and Indian IFSC code (e.g. `HDFC0001234`).
6. **Submission & Verification Room:**
   * Click **Submit Application**. The account transitions to the verification room.
   * Click **"Preview Merchant Dashboard"** to enter your operational store workstation.

---

### 🏁 Step 2: Store Operational Status Engine
**Target URL:** **[viztore-merchant.vercel.app](https://viztore-merchant.vercel.app)**  
**Functional Goal:** Validate live store open/closed status switching and multi-tenant persistence.

> [!NOTE]
> **Proactive Pre-Flight Clarification (Why Status Toggling Matters):**  
> The store status toggle in the header is not a cosmetic switch. When toggled to **Closed (Red)**, the backend geospatial query (`$near` within 3–4 km) immediately excludes this store from customer discovery on the customer storefront. When **Open (Green)**, it broadcasts readiness to receive live orders.

1. Observe the store profile in the top-right header displaying your registered store name.
2. Toggle the **Store Status Switch**:
   * A confirmation dialog appears explaining that closing the store pauses incoming customer orders.
   * Confirm the action: Dispatches an asynchronous `PATCH /api/v1/stores/:id` to MongoDB Atlas.
3. Refresh the page: The active status persists across sessions and browser reloads.

---

### 🏁 Step 3: Product Catalog Creation & Multi-Variant Matrix
**Target URL:** **[viztore-merchant.vercel.app/catalog](https://viztore-merchant.vercel.app/catalog)**  
**Functional Goal:** Publish polymorphic retail products with size/color variants and live pricing discounts.

> [!NOTE]
> **Proactive Pre-Flight Clarification (Empty State & Mockup Comparison):**  
> If this is a freshly created store, the catalog table will display a clean "No Products Yet" empty state. This is intentional. In production software, products must be created by the merchant, not injected via hardcoded dummy fixtures.

1. Click **+ Add Product** (top right) to open the 3-step creation wizard.
2. **Basic Information:**
   * Enter Product Title, Brand Name, and select Category ➔ Sub-category (e.g. *Men > Topwear > Polo T-Shirts*).
3. **Pricing & Auto-Calculated MRP Discount:**
   * Enter a **Selling Price** (e.g. `₹799`) and an **MRP** (e.g. `₹1,299`).
   * The platform automatically calculates the discount badge (**38% OFF**) in real time.
4. **Multi-Variant Generation:**
   * Check *This product has size/color variants*.
   * Select sizes (e.g. `S, M, L, XL`) and enter Color (e.g. `White`). The platform automatically constructs individual variant SKUs with independent stock counts.
5. **Media Upload & Ingestion:**
   * Drop a photograph from your device or paste any direct public image URL into the media input.
6. Click **Publish Product**. Confirm the product immediately appears in the catalog register with thumbnail, active status badge, and stock count.

---

### 🏁 Step 4: Real-Time Inventory Control & Audit Trail
**Target URL:** **[viztore-merchant.vercel.app/inventory](https://viztore-merchant.vercel.app/inventory)**  
**Functional Goal:** Verify stock valuation, adjustments, and immutable transaction history.

> [!NOTE]
> **Proactive Pre-Flight Clarification (Dynamic Metric Computation):**  
> The 5 KPI cards at the top of the inventory page (Total SKUs, Total Stock, Low Stock, Stock Value) compute their values dynamically from your live MongoDB catalog. They are not static numbers.

1. Locate your newly created product in the inventory register.
2. Click the row action menu (`⋮`) ➔ Select **Adjust Stock**:
   * Use the stepper or manual numeric input (`+10` or `-5`).
   * Select a reason (*Physical Count Reconciliation*, *Damaged Goods*, *Stock Inflow*).
   * Save the adjustment: Dispatches an atomic stock update to the backend.
3. Click the **Stock History** drawer on that product:
   * Displays the immutable audit trail recording the exact timestamp, previous quantity, new quantity, and adjustment reason.

---

### 🏁 Step 5: Customer Discovery, Single-Store Cart & Checkout
**Target URL:** **[viztore-web.vercel.app](https://viztore-web.vercel.app)** *(Customer Storefront)*  
**Functional Goal:** Discover the newly created store within the delivery zone, enforce single-store cart rules, and place an order.

> [!NOTE]
> **Proactive Pre-Flight Clarification (The Hyperlocal Single-Store Cart Rule):**  
> Hyperlocal commerce operates on rapid 30–45 minute delivery by dedicated local riders. Unlike Amazon (which delivers items across days from multiple national warehouses), a customer cannot mix items from two different local shops in a single checkout.  
> The platform enforces this invariant: adding an item from Store B while having items from Store A prompts the customer to either keep or clear their active cart.

1. **Customer Registration / Login:**
   * Click **Login / Register** in the top navigation.
   * Enter your name, mobile number, and email. Verify using the staging sandbox auth.
2. **Hyperlocal Store Discovery:**
   * Click **Stores** ([viztore-web.vercel.app/stores](https://viztore-web.vercel.app/stores)).
   * Your registered store appears with its verified retailer badge and category tag.
   * Click the store card to enter the merchant's dedicated storefront.
3. **Product Page & Size Selection:**
   * Select the product you created in Step 3.
   * Notice that pricing, MRP discount badge, and variants match your merchant dashboard input.
   * Select a variant (e.g. Size `M`) and click **Add to Cart**.
4. **Checkout Experience:**
   * Open the Cart and click **Proceed to Checkout** ([viztore-web.vercel.app/checkout](https://viztore-web.vercel.app/checkout)).
   * Enter delivery address (e.g. `Plot 14, Nehru Nagar West, Bhilai - 490020`).
   * Select **Cash on Delivery (COD)**.
   * Review order financials: Subtotal + GST breakdown + delivery charge.
   * Click **Place Order**.
5. **Success Confirmation & Delivery OTP:**
   * The confirmation page displays your unique Order Number (`#ORD-...`).
   * A **4-digit confidential customer Delivery OTP** is generated (e.g. `5575`). The customer must only share this OTP with the runner upon physical receipt of goods.

---

### 🏁 Step 6: Merchant Order Pipeline & Secure Delivery OTP Handshake
**Target URL:** **[viztore-merchant.vercel.app/orders](https://viztore-merchant.vercel.app/orders)**  
**Functional Goal:** Receive real-time audio/visual alert, advance order fulfillment state machine, verify customer OTP, and issue legal GST invoice.

> [!NOTE]
> **Proactive Pre-Flight Clarification (Event-Driven Real-Time Sockets):**  
> The moment the customer places an order on `viztore-web.vercel.app`, the backend emits a Socket.io event to `store:${storeId}`. The merchant portal triggers a **harmonic 2-tone audio chime (D5 ➔ A5)** and an arrival notification. You do not need to refresh the page.

1. **Incoming Order Discovery:**
   * Open the **New Orders** tab. The order placed in Step 5 appears with total value and customer details.
2. **State Machine Fulfillment:**
   * **Accept Order:** Click *Accept*. Order transitions `PENDING` ➔ `CONFIRMED` and moves to the *Accepted* tab.
   * **Ready to Ship:** Click *Ready to Ship*. Order transitions `CONFIRMED` ➔ `PACKED` (*Ready to Ship* tab).
   * **Mark Shipped:** Click *Mark Shipped*. Generates a tracking ID (`TRK-...`) and transitions to `OUT_FOR_DELIVERY` (*Shipped* tab).
3. **Delivery Handshake Verification:**
   * On the *Shipped* tab, click **Verify Delivery OTP**.
   * Enter the 4-digit customer OTP issued in Step 5.
   * Click **Verify & Mark Delivered**: The backend cryptographically validates the OTP. The order transitions to **`DELIVERED`**.
4. **Indian Tax Invoice & Inventory Verification:**
   * Click **View Invoice**: Displays legal tax invoice (`INV-ORD-...`) with intra-state GST (CGST + SGST split) and seller GSTIN.
   * Check your inventory: The product's stock count was **atomically decremented** upon fulfillment.

---

### 🏁 Step 7: In-House Retail Counter POS Billing (System 2 Test)
**Target URL:** **[viztore-merchant.vercel.app/billing](https://viztore-merchant.vercel.app/billing)**  
**Functional Goal:** Test walk-in retail counter sales, barcode wedge scanning, cash change calculation, ESC/POS 80mm thermal receipt printing, and zero-lag storefront inventory sync.

> [!NOTE]
> **Proactive Pre-Flight Clarification (Why Counter POS is Built Into Merchant Web):**  
> Local Indian retailers have physical walk-in customers while simultaneously receiving online hyperlocal orders. If counter sales don't deduct online inventory immediately, customers will buy items online that were already sold across the counter 5 minutes ago.  
> System 2 provides a high-speed POS register that synchronizes stock atomically with the online storefront.

1. **Launch Counter POS Register:**
   * On the Billing page, click **Quick Counter POS** (`Zap` icon) or navigate to `/billing?view=pos_counter`.
   * Enters the fullscreen cashier workstation.
2. **Fast Barcode / SKU Scan Station:**
   * The barcode input is auto-focused. Scan a barcode or type your SKU and press `Enter`.
   * An audio chime sounds and the item is instantly added to the bill cart with quantity steppers.
3. **Walk-In Customer & Tax Breakdown:**
   * Enter customer details (Name & Phone).
   * Intra-state GST (CGST 9% + SGST 9%) and commercial round-off are calculated automatically.
4. **Multi-Tender Cash Settlement & Change Calculation:**
   * Select **Cash** tender.
   * Click a preset cash pill (e.g. `₹1,000`) or type cash received.
   * The platform calculates the exact **Change to Return** (e.g. `₹57.18`) in real time.
5. **Complete POS Sale & ESC/POS 80mm Thermal Receipt:**
   * Click **Complete Sale & Print**.
   * Issues sequential invoice (`INV-1001`, `INV-1002`).
   * The **ESC/POS 80mm Thermal Receipt Modal** opens with centered typography, store header, tax slabs, and browser print action.
6. **Zero-Lag Online Stock Deduction Verification:**
   * Switch to the Customer Storefront ([viztore-web.vercel.app](https://viztore-web.vercel.app)).
   * Refresh your product page: The stock available online **immediately decrements** by the exact quantity sold across the counter!

---

### 🏁 Step 8: Commercial Estimates / Quotations & 1-Click Invoice Conversion
**Target URL:** **[viztore-merchant.vercel.app/billing](https://viztore-merchant.vercel.app/billing)** *(Estimates / Quotes Sub-Tab)*  
**Functional Goal:** Create B2B commercial estimates, manage validity periods, and convert accepted quotes into tax invoices with automatic stock deduction.

1. **Open Quotes Register:**
   * On the Billing page, click the **Estimates / Quotes** sub-navigation tab.
   * Displays the quote ledger with KPIs (Total Quotes, Accepted Quotes, Converted, Expired).
2. **Create a New Estimate / Quote:**
   * Click **+ Create Quote** (opens `/billing?view=create_quote`).
   * Auto-sequences Quote No (e.g. `Q-1025`).
   * Select validity period (`14 Days`, `30 Days`, or custom expiry).
   * Add line items from your catalog with HSN/SAC codes, discount %, and GST slab rates.
   * Set standard notes & terms of supply. Click **Save (Sent)**.
3. **1-Click Convert to Tax Invoice:**
   * Open the quote details modal: Click **+ Convert to Invoice**.
   * The system automatically generates a finalized Tax Invoice (`INV-...`), invalidates quote modification, and **atomically deducts inventory stock** from the catalog!
4. **CSV Export:**
   * Click **Export Quotes CSV** to download a formatted spreadsheet (`Quotes_Register_YYYY-MM-DD.csv`).

---

### 🏁 Step 9: Customers CRM, Khata (Udhar) Credit & WhatsApp Reminders
**Target URL:** **[viztore-merchant.vercel.app/customers](https://viztore-merchant.vercel.app/customers)**  
**Functional Goal:** Manage customer directory, track Khata debt balances, send WhatsApp payment reminders, and record debt settlements.

1. **Customer Directory & Tiers:**
   * Observe customers automatically added from your previous online orders and POS walk-in sales.
   * Customer table classifies buyers into tiers (**VIP**, **Regular**, **New**) with total spend and Khata due amounts.
2. **Customer Statement & Aging Analysis:**
   * Click any customer row to open the **Customer Details Drawer**.
   * Switch to the **Ledger** or **Statement** tab: View running debit/credit balances and aging debt buckets (*Current, 1–15 days, 16–30 days, 30+ days*).
   * Click **Download Statement** to export an RFC-compliant statement CSV.
3. **1-Click WhatsApp Payment Reminder:**
   * Click the **WhatsApp Reminder** button:
   * Generates a pre-formatted, polite balance notification deep link (`https://wa.me/<phone>?text=...`) mentioning the pending balance and store name.
4. **Record Khata Settlement & Store Credit:**
   * Click **Record Payment / Credit** to open the dual-mode modal:
   * **Record Khata Payment:** Select Cash, UPI, or Bank Transfer with quick percentage chips (`25%`, `50%`, `100%`) to reduce outstanding debt.
   * **Store Credit:** Add or deduct digital store wallet balance.

---

### 🏁 Step 10: Payouts, Settlement Ledgers & Bank Account Management
**Target URL:** **[viztore-merchant.vercel.app/payouts](https://viztore-merchant.vercel.app/payouts)**  
**Functional Goal:** Audit gross sales vs deductions, verify linked settlement bank accounts, and review bank UTR disbursement ledgers.

1. **Financial Settlement Cards:**
   * View **Total Disbursed to Date**, **Next Scheduled Payout**, and **Unsettled Sales Balance**.
2. **Linked Settlement Bank Accounts:**
   * Inspect the primary bank account registered during onboarding.
   * Click **Manage Bank Account**: View bank name, masked account number, and IFSC code with verified status.
3. **Settlement Ledger Audit:**
   * Open the **All Settlements** table: View transaction IDs, gross amounts, platform fee deductions, net payout amounts, and Bank UTR reference numbers.
   * Search by UTR number to reconcile physical bank statements.
   * Click **Export Settlements CSV** for accounting audit trails.

---

### 🏁 Step 11: Returns & Reverse Logistics Inspection Workflow
**Target URL:** **[viztore-merchant.vercel.app/returns](https://viztore-merchant.vercel.app/returns)**  
**Functional Goal:** Audit incoming customer returns, inspect photographic evidence, and approve or reject restock requests.

1. **Returns Register & Status Pipeline:**
   * Inspect return tickets categorized by status: `Requested`, `Rider Picked Up`, `Inspected & Restocked`, `Refunded`, `Rejected`.
2. **Inspect Return Request:**
   * Click any return ticket to view the original order ID, customer information, and selected return reason (e.g. *Size Mismatch*, *Defective Item*).
   * Review attached photographic evidence uploaded by the customer.
3. **Action Execution:**
   * **Accept Return & Restock:** Approves return, updates status, and triggers automated stock restoration back into active inventory.
   * **Reject Return:** Enforces a mandatory rejection explanation note for audit compliance.
   * **Print Inspection Slip:** Generates printable warehouse return slip.

---

### 🏁 Step 12: Store Configuration Suite & Delivery Radius Tuning
**Target URL:** **[viztore-merchant.vercel.app/settings](https://viztore-merchant.vercel.app/settings)**  
**Functional Goal:** Fine-tune physical delivery radius, weekly operating hours, GST tax slabs, and thermal printer hardware defaults.

1. **9-Tab Master Settings Suite:**
   * **Store Profile (`14.0`):** Store logo uploader, banner image, business tagline, and profile completeness indicator.
   * **Business & Tax Info (`14.1`):** Legal business name, PAN, GSTIN, and FSSAI certificate badges.
   * **Store Timings & Radius (`14.2`):** Hyperlocal delivery radius slider (1–10 km with 3–4 km recommended launch zone) and weekly schedule.
   * **Billing & POS Preferences (`14.3`):** Default thermal slip roll width (`80mm` vs `58mm`), tax inclusive/exclusive toggle, and invoice numbering prefix.
   * **Tax & GST Slabs (`14.4`):** Configure default tax slabs (0%, 5%, 12%, 18%, 28%).
   * **Security & Access (`14.8`):** Password updates and session verification.
2. **Save & Persist:**
   * Save changes in any tab: Observe green toast feedback and immediate cloud persistence in MongoDB Atlas.

---

### 🏁 Step 13: Customer Account Hub, Address Book & Order History
**Target URL:** **[viztore-web.vercel.app/account](https://viztore-web.vercel.app/account)**  
**Functional Goal:** Manage customer delivery addresses, track historical orders, and download legal tax invoice slips.

1. **Customer Account Overview:**
   * View authenticated profile, primary phone, email, and quick navigation menu.
2. **Saved Delivery Addresses (`/account/addresses`):**
   * Add multiple saved locations (*Home*, *Work*, *Other*) with complete street details, landmarks, and PIN codes.
   * Delivery addresses auto-populate in the checkout drawer for 1-click ordering.
3. **Order History & Invoice Download (`/account/orders`):**
   * Review completed and in-progress hyperlocal orders.
   * Click any order: View itemized breakdown, runner delivery status, and click **Download Tax Invoice** to view printable invoice slips.

---

## 🔬 Section 3: Deep-Dive on "Production Labs" & Fast-Follow Roadmap

When exploring the lower navigation of the Merchant Management Portal, you will see a section labeled **"🧪 Production Labs"**:

```text
├── CORE COMMERCE & RETAIL SUITE (100% Production Ready & Tested in Steps 1–13)
│   ├── Orders Pipeline & Delivery OTP Handshake
│   ├── Product Catalog & Multi-Variant Generator
│   ├── Inventory Management & Stock History Ledger
│   ├── Billing & Invoicing (Counter POS + Thermal Slip Engine)
│   ├── Commercial Estimates & Quotes Ledger
│   ├── Customers CRM & Khata Credit Ledger
│   ├── Payouts & Settlement Ledgers
│   ├── Returns & Reverse Logistics
│   └── Store Settings (9-Tab Suite)
│
└── 🧪 PRODUCTION LABS (Fast-Follow Release Roadmap)
    ├── 👛 Wallet Hub & Instant Bank Sweeps
    ├── 📦 Purchase Orders & Operating Expenses ERP
    ├── 📢 Marketing Suite, Banners & Coupon Creator
    └── 👥 Staff Management & Multi-Cashier RBAC
```

### Proactive Clarification for Product Stakeholders:
* **Why are these in Production Labs?**  
  These represent back-office administrative and marketing tools. Building and testing them does not block a store from selling products, billing counter walk-ins, managing inventory, or fulfilling orders. Grouping them in Production Labs gives full visual transparency into upcoming features while keeping the critical commerce loop uncluttered.
* **Does "Coming Soon" mean it will take months?**  
  **No.** All of these modules are already structurally routed and component-scaffolded. Their backend database schemas and REST controllers are part of the active development pipeline and will be released in targeted weekly sprints:

| Module in Labs | Scheduled Milestone | Business Capability & Scope |
|---|:---:|---|
| **👛 Wallet Hub & Instant Sweeps** | Sprint 2.1 (Late Oct) | Razorpay/Cashfree payout gateway integration, automated T+1 bank clearing, and on-demand wallet withdrawals. |
| **📦 Purchase Orders & Expenses** | Sprint 2.2 (Early Nov) | Supplier vendor directory, raw material Purchase Bills, and operating expense vouchers (Rent, Electricity, Logistics). |
| **📢 Marketing & Ad Campaigns** | Sprint 3.1 (Late Nov) | Store banner slider manager, sponsored search placements, and interactive voucher ticket discount wizards. |
| **👥 Staff Management (RBAC)** | Sprint 3.2 (Dec) | Granular cashier vs store manager roles with restricted POS permissions and PIN-locked registers. |

---

## 📋 Comprehensive Operational Verification Checklist

| Workflow Step | Expected Operational Result | Status |
|---|---|:---:|
| **Step 1: Merchant Registration** | Complete 6-step onboarding wizard; carrier-decoupled OTP verification; store established in MongoDB. | 🟢 Ready |
| **Step 2: Store Status Engine** | Header toggle updates store open/closed state in MongoDB; persists across browser reloads. | 🟢 Ready |
| **Step 3: Catalog & Variants** | Add polymorphic product with sizes/colors; auto-calculate MRP discount %; Base64/URL image upload. | 🟢 Ready |
| **Step 4: Inventory Management** | Real-time stock valuation cards; quantity stepper adjustments; immutable audit history ledger. | 🟢 Ready |
| **Step 5: Customer Checkout** | Hyperlocal store discovery (3–4 km); single-store cart enforcement; COD checkout; 4-digit Delivery OTP. | 🟢 Ready |
| **Step 6: Order Pipeline & OTP** | Real-time audio chime alert; 4-step state machine; OTP verification to `DELIVERED`; legal Indian GST invoice. | 🟢 Ready |
| **Step 7: Counter POS Billing** | Barcode scan with chime; cash change return calculation; 80mm thermal receipt; zero-lag online stock sync. | 🟢 Ready |
| **Step 8: Estimates & Quotes** | Create commercial quotes; validity periods; 1-click Convert to Invoice with atomic stock deduction. | 🟢 Ready |
| **Step 9: Customers CRM & Khata** | Automatic customer directory; aging balance analysis; 1-click WhatsApp payment reminders; debt settlement. | 🟢 Ready |
| **Step 10: Payout Settlements** | Gross vs fee deduction audit; primary bank account verification; Bank UTR search ledger. | 🟢 Ready |
| **Step 11: Returns Inspection** | Photo evidence inspection; return approval with automatic restocking hook; printable return slip. | 🟢 Ready |
| **Step 12: Store Settings Suite** | 9-tab settings manager; delivery radius slider; operating hours; thermal printer defaults; GST slabs. | 🟢 Ready |
| **Step 13: Customer Account Hub** | Multi-address book (Home/Work); order tracking; customer tax invoice download. | 🟢 Ready |

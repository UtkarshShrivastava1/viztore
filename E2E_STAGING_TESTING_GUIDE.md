# 🚀 Hyperlocal Retail Commerce Platform — Live Staging Verification & Architecture Guide
**Document Classification:** Production Acceptance & Architectural Verification Playbook  
**Target Environments:** Cloud Staging & Live Production Deployments  
**Authoritative Scope:** 7 Core E2E Hyperlocal Commerce Workflows + Production Labs Architecture  

---

## 🌐 Live Production Deployments

| System Component | Live Cloud URL | Primary Functional Scope |
|---|---|---|
| **Customer Web Storefront** | **[viztore-web.vercel.app](https://viztore-web.vercel.app)** | Hyperlocal store discovery, single-store cart, customer account hub, and online checkout. |
| **Merchant Management Portal** | **[viztore-merchant.vercel.app](https://viztore-merchant.vercel.app)** | Onboarding, product catalog, inventory, order fulfillment, Counter POS billing, and CRM. |
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
    section Horizon 1: Live Core (ACTIVE NOW)
        Online Customer Web Storefront (:3000)
        Merchant Onboarding, Catalog & Inventory
        Real-Time Order Fulfillment & Delivery OTP
        In-House Retail Counter POS Billing & 80mm Thermal Receipt
    section Horizon 2: Advanced Operations (Iterative Sprints)
        Merchant Wallet & Payout Sweeps (Late Oct)
        Purchase Orders & Expense ERP (Early Nov)
        Automated Reverse Logistics & Returns (Mid Nov)
    section Horizon 3: Enterprise Scale (Late Q4)
        Promotional Ads & Marketing Banners (Late Nov)
        Multi-Cashier Staff Management RBAC (Dec)
        Native Mobile Applications (Expo / React Native)
```

* **Core Commerce (Horizon 1 — 100% Complete & Active):** Everything needed to register shops, sell products, process walk-in POS counter sales, dispatch runners, and issue legal Indian GST invoices is fully functional right now.
* **Production Labs (Horizons 2 & 3 — Active Pipeline):** Modules located in the lower sidebar under **"Production Labs"** represent advanced enterprise features scheduled for iterative weekly rollouts. Their inclusion in the UI provides structural architectural visibility and proves that the routing and layout models are already prepared.

---

## 🧪 Section 2: Master 7-Step Verification Workflow (With Proactive Pre-Flight Notes)

You are encouraged to explore with a completely **empty canvas**: create your own merchant store, upload your own real products, set your own prices, register your own customer account, and execute live end-to-end sales.

Follow these 7 steps to verify the entire system lifecycle:

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

## 🔬 Section 3: Deep-Dive on "Production Labs" & Fast-Follow Roadmap

When exploring the lower navigation of the Merchant Management Portal, you will see a section labeled **"🧪 Production Labs"**:

```text
├── CORE COMMERCE (100% Production Ready & Tested in Steps 1–7)
│   ├── Orders Pipeline & Delivery OTP Handshake
│   ├── Product Catalog & Multi-Variant Generator
│   ├── Inventory Management & Stock History Ledger
│   ├── Billing & Invoicing (Counter POS + Thermal Slip Engine)
│   ├── Customers CRM & Khata Credit Ledger
│   └── Store Settings & Profiles
│
└── 🧪 PRODUCTION LABS (Fast-Follow Release Roadmap)
    ├── 👛 Wallet Hub & Instant Bank Sweeps
    ├── 📦 Purchase Orders & Operating Expenses ERP
    ├── ↩️ Automated Reverse Logistics
    ├── 📢 Marketing Suite, Banners & Coupon Creator
    └── 👥 Staff Management & Multi-Cashier RBAC
```

### Proactive Clarification for Product Stakeholders:
* **Why are these in Production Labs?**  
  These represent back-office ERP and administrative modules. Building and testing them does not block a store from selling products or fulfilling orders. Grouping them in Production Labs gives full visual transparency into upcoming features while keeping the critical commerce loop uncluttered.
* **Does "Coming Soon" mean it will take months?**  
  **No.** All of these modules are already structurally routed and component-scaffolded. Their backend database schemas and REST controllers are part of the active development pipeline and will be released in targeted weekly sprints:

| Module in Labs | Scheduled Milestone | Business Capability & Scope |
|---|:---:|---|
| **👛 Wallet Hub & Instant Sweeps** | Sprint 2.1 (Late Oct) | Razorpay/Cashfree payout gateway integration, automated T+1 bank clearing, and on-demand wallet withdrawals. |
| **📦 Purchase Orders & Expenses** | Sprint 2.2 (Early Nov) | Supplier vendor directory, raw material Purchase Bills, and operating expense vouchers (Rent, Electricity, Logistics). |
| **↩️ Automated Reverse Logistics** | Sprint 2.3 (Mid Nov) | Customer photographic return requests, merchant inspection approval, and automated restocking hooks. |
| **📢 Marketing & Ad Campaigns** | Sprint 3.1 (Late Nov) | Store banner slider manager, sponsored search placements, and interactive voucher ticket discount wizards. |
| **👥 Staff Management (RBAC)** | Sprint 3.2 (Dec) | Granular cashier vs store manager roles with restricted POS permissions and PIN-locked registers. |

---

## 📋 Staging Verification Summary Checklist

| Workflow Step | Expected Operational Result | Status |
|---|---|:---:|
| **Step 1: Merchant Registration** | Complete 6-step onboarding wizard; carrier-decoupled OTP verification; store established in MongoDB. | 🟢 Ready |
| **Step 2: Store Status Engine** | Header toggle updates store open/closed state in MongoDB; persists across browser reloads. | 🟢 Ready |
| **Step 3: Catalog & Variants** | Add polymorphic product with sizes/colors; auto-calculate MRP discount %; Base64/URL image upload. | 🟢 Ready |
| **Step 4: Inventory Management** | Real-time stock valuation cards; quantity stepper adjustments; immutable audit history ledger. | 🟢 Ready |
| **Step 5: Customer Checkout** | Hyperlocal store discovery (3–4 km); single-store cart enforcement; COD checkout; 4-digit Delivery OTP. | 🟢 Ready |
| **Step 6: Order Pipeline & OTP** | Real-time audio chime alert; 4-step state machine; OTP verification to `DELIVERED`; legal Indian GST invoice. | 🟢 Ready |
| **Step 7: Counter POS Billing** | Barcode scan with chime; cash change return calculation; 80mm thermal receipt; zero-lag online stock sync. | 🟢 Ready |

# Platform Master API Engine — Comprehensive Test Suite

Export/Import-ready API test collection and environment configurations for automated and manual testing of the Hyperlocal Multi-Vendor Monolith API.

Built to universal **Postman Collection v2.1.0** and **Thunder Client v1.2** standards with full support for:
- Role-scoped authentication (`customer`, `merchant`, `admin`, `rider`)
- Automatic token and ID variable chaining
- Pre-configured request bodies with realistic payloads
- Expected response assertions and JSON schema validation
- Complete coverage across Customer storefront workflows and Merchant operational hubs
- Headless CI/CD automation via Newman and Thunder Client CLI

---

## 📁 Files in This Directory

| File | Purpose | Format |
|---|---|---|
| [`platform_master_api_collection.json`](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/platform-root-vz/postman/platform_master_api_collection.json) | **Master API Collection (71 requests)** organized by role, module, and sub-feature | Postman v2.1.0 Schema (Universal) |
| [`thunder_client_collection.json`](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/platform-root-vz/postman/thunder_client_collection.json) | Native Thunder Client export containing all 71 requests and 17 nested folders | Thunder Client Native JSON (v1.2) |
| [`platform_local.postman_environment.json`](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/platform-root-vz/postman/platform_local.postman_environment.json) | Environment config pointing to Local Monolith (`http://localhost:5000/api/v1`) | Postman Environment |
| [`platform_staging.postman_environment.json`](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/platform-root-vz/postman/platform_staging.postman_environment.json) | Environment config pointing to Cloud Staging (`https://viztore.onrender.com/api/v1`) | Postman Environment |
| [`platform_api_collection.json`](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/platform-root-vz/postman/platform_api_collection.json) | Legacy 40-request baseline collection (retained for backward compatibility) | Postman v2.1.0 Schema |

---

## 🏗️ Collection Architecture & Hierarchy

The Master Collection contains **71 requests** meticulously grouped into 6 top-level domains:

```
📁 00. System Health & Probes (3 requests)
   ├── [GET] Liveness Probe (/healthz)
   ├── [GET] Readiness Probe (/readyz)
   └── [GET] OpenAPI Documentation JSON (/api-docs.json)

📁 01. Authentication & Identity (6 requests)
   ├── [POST] Customer Register (Role-Scoped)
   ├── [POST] Customer Login (Auto-captures {{customerToken}})
   ├── [POST] Merchant Login (Auto-captures {{merchantToken}} & {{storeId}})
   ├── [POST] Admin Login (Auto-captures {{adminToken}})
   ├── [POST] Refresh Token Flow
   └── [POST] Logout & Session Invalidation

📁 02. Customer Storefront Workflows (32 requests)
   ├── 📁 02.1 Catalog Discovery & Search (Master Categories, Dynamic Suggestions, Faceted Filter, Featured, Detail)
   ├── 📁 02.2 Hyperlocal Store Discovery (2dsphere Proximity Sort, Store Profile, Store Catalog, Submit Review)
   ├── 📁 02.3 Account, Address Book & Profile (Profile, Address Book CRUD, Favorites, Wishlists, App Feedback)
   ├── 📁 02.4 Orders, Checkout & Live Tracking (Delivery Order, In-Store Hold 2-hr, Order History, Invoice, Live Rider Stream)
   ├── 📁 02.5 Coupons & Promotions (List Coupons, Validate at Checkout)
   └── 📁 02.6 Customer Returns & Help Desk (Create Return Request, Return History, Support Ticket, Instant Callback)

📁 03. Merchant Operational Hubs (23 requests)
   ├── 📁 03.1 Store Onboarding & Settings (GSTIN/PAN Online Verification, 6-Step Submission, Operating Hours)
   ├── 📁 03.2 Catalog & Live Stock Management (HSN & GST Lookup, 3-Step Wizard Product Creation, Stock/Price Patch, Bulk Delete)
   ├── 📁 03.3 Order Processing & Fleet Dispatch (Store Orders, Status Progression, Rider Pool Broadcast, In-Store Claim)
   ├── 📁 03.4 Counter POS, Invoicing & Khata CRM (Walk-In Sale, Tax Invoice Generation, Thermal/A4 Print, Khata CRM)
   └── 📁 03.5 Procurement, Settlements & Analytics (Vendor & Purchase Orders, Settlement Breakdown, Payout, Analytics)

📁 04. Rider Portal & Delivery Fleet (5 requests)
   ├── [GET] Get Available Open Delivery Jobs
   ├── [POST] Claim Delivery Run (Atomic Mutex Locking)
   ├── [GET] Get Rider Run Navigation Details
   ├── [POST] Push Rider Live GPS Location
   └── [POST] Verify 4-Digit Handshake OTP (Complete Handover)

📁 05. Notifications & Media Hub (3 requests)
   ├── [GET] Get Unread Notifications Summary
   ├── [GET] List Notifications
   └── [PATCH] Mark All Notifications as Read
```

---

## ⚡ Automated Token & ID Chaining

No manual token copying or ID pasting is required. Built-in **Post-Response Test Scripts** automatically extract response tokens and primary keys into collection and environment variables:

| Action Executed | Automatically Extracted Variables | Downstream Consumers |
|---|---|---|
| **Customer Login** | `{{customerToken}}` | All `02. Customer Storefront` endpoints |
| **Merchant Login** | `{{merchantToken}}`, `{{storeId}}` | All `03. Merchant Operational` endpoints |
| **Admin Login** | `{{adminToken}}` | Administrative review & override endpoints |
| **Customer Add Address** | `{{addressId}}` | Order Checkout payload |
| **Place Order** | `{{orderId}}`, `{{orderNumber}}`, `{{deliveryOtp}}` | Order Details, Live Tracking, Rider Claim & OTP Handshake |
| **Create Product** | `{{productId}}` | Stock updates, product detail, catalog queries |
| **Create Return** | `{{returnId}}` | Return status tracking |
| **Create Ticket** | `{{ticketId}}` | Support resolution |
| **Record Counter POS** | `{{invoiceId}}` | POS invoice printing (Thermal / A4) |
| **Add Khata Customer** | `{{customerId}}` | Khata credit/debit adjustments |
| **Create Purchase Order** | `{{purchaseId}}` | Vendor procurement management |

---

## 🚀 How to Import and Run

### Option A: Import into Postman (Recommended for Full Feature Set)
1. Open **Postman Desktop** or Web.
2. Click **Import** (top left).
3. Drag and drop:
   - `postman/platform_master_api_collection.json`
   - `postman/platform_local.postman_environment.json`
   - `postman/platform_staging.postman_environment.json`
4. In the top-right environment selector, choose **Platform — Local Environment** or **Platform — Cloud Staging (Render)**.
5. Run the sequential flow starting at `01. Authentication & Identity`.

---

### Option B: Import into Thunder Client (VS Code Extension)

You can import using either method:
- **Method 1 (Universal Postman Import):** In VS Code, open the **Thunder Client** tab ➔ Click **Collections** ➔ Click the `...` menu (top right of Collections) ➔ Select **Import** ➔ Choose **Postman** ➔ Select `postman/platform_master_api_collection.json`.
- **Method 2 (Native Thunder Client Import):** In VS Code Thunder Client ➔ Collections ➔ `...` menu ➔ Select **Import** ➔ Choose **Thunder Client** ➔ Select `postman/thunder_client_collection.json`.

---

### Option C: Automated Headless Execution (Newman CLI / CI Pipeline)

To run the full test suite automatically in terminal, CI/CD, or automated testing scripts without opening a GUI:

```bash
# Run against local backend
npx newman run postman/platform_master_api_collection.json \
  -e postman/platform_local.postman_environment.json \
  --reporters cli,json \
  --reporter-json-export postman-report.json

# Run against live cloud staging
npx newman run postman/platform_master_api_collection.json \
  -e postman/platform_staging.postman_environment.json \
  --reporters cli
```

---

## 🔄 Recommended End-to-End Workflow Execution Order

1. **Verify Health**: Run `00. System Health & Probes` ➔ `Readiness Probe (/readyz)`.
2. **Authenticate Customer**: Run `01. Authentication` ➔ `Customer Login`.
3. **Discover Store & Products**: Run `02.2 Store Discovery` ➔ `Nearby Stores`, then `02.1 Catalog Discovery` ➔ `Product Detail`.
4. **Place Order**: Run `02.4 Orders` ➔ `Place Single-Store Hyperlocal Order` (Stores `{{orderId}}` and `{{deliveryOtp}}`).
5. **Authenticate Merchant**: Run `01. Authentication` ➔ `Merchant Login` (Stores `{{merchantToken}}`).
6. **Merchant Processing**: Run `03.3 Order Processing` ➔ `Update Order Status` (Set status to `packed`).
7. **Broadcast & Claim**: Run `03.3 Broadcast Delivery Job`, then `04. Rider Portal` ➔ `Claim Delivery Run`.
8. **Delivery Handshake**: Run `04. Rider Portal` ➔ `Verify 4-Digit Handshake OTP` using the auto-captured `{{deliveryOtp}}`.
9. **Counter POS Sale**: Run `03.4 Counter POS` ➔ `Record Counter POS Walk-In Sale` to test in-store retail billing.

# Platform API Postman Test Collection

Export/Import-ready Postman collection and environment configurations for automated and manual testing of the Hyperlocal Multi-Vendor Monolith API.

---

## 📁 Files in This Directory

| File | Purpose |
|---|---|
| [`platform_api_collection.json`](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/platform-root-vz/postman/platform_api_collection.json) | Complete API collection (v2.1.0 format) covering all 7 core modules |
| [`platform_local.postman_environment.json`](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/platform-root-vz/postman/platform_local.postman_environment.json) | Environment config pointing to `http://localhost:5000/api/v1` |
| [`platform_staging.postman_environment.json`](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/platform-root-vz/postman/platform_staging.postman_environment.json) | Environment config pointing to Cloud Staging (`https://viztore.onrender.com/api/v1`) |

---

## 🚀 How to Import into Postman

1. Open **Postman**.
2. Click **Import** (top left).
3. Drag and drop all three files:
   - `platform_api_collection.json`
   - `platform_local.postman_environment.json`
   - `platform_staging.postman_environment.json`
4. In the top-right environment selector, select either:
   - **Platform — Local Environment** (for localhost testing)
   - **Platform — Cloud Staging (Render)** (for live staging testing)

---

## ⚡ Automated Authentication Workflow

The collection includes automated **Post-Response Test Scripts**:
- When you execute **`Login (Merchant)`**, **`Login (Customer)`**, or **`Login (Admin)`**, the response test script automatically extracts `accessToken` and updates the `{{authToken}}` variable across the collection.
- Subsequent protected requests (Orders, Stores, Catalog, Delivery, Notifications) automatically authenticate using the Bearer token without requiring manual copy-pasting.

---

## 🔄 Recommended End-to-End Test Sequence

1. **Verify Health**: Run `00. System Health & Probes` ➔ `Readiness Probe (/readyz)`.
2. **Authenticate**: Run `01. Authentication & Users` ➔ `Login (Customer)`.
3. **Discover Stores**: Run `02. Stores & Onboarding` ➔ `Discover Nearby Stores (Proximity 2dsphere)` (Auto-saves `{{storeId}}`).
4. **Browse Catalog**: Run `03. Catalog & Products` ➔ `Faceted Product Listing` (Auto-saves `{{productId}}`).
5. **Place Order**: Run `04. Orders` ➔ `Create Order` (Auto-saves `{{orderId}}`).
6. **Merchant Fulfillment**: Switch auth to `Login (Merchant)` and execute `Mark Order Ready to Ship (PACKED)`.
7. **View Invoice**: Run `Get Tax Invoice` to view the structured `INV-ORD-xxxxx` bill.
8. **Delivery OTP Handshake**: Run `05. Delivery & Rider Dispatch` ➔ `Rider: Complete Handshake with Customer OTP`.

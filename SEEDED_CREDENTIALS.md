# Platform Seeded Test Credentials

> **Target Environments:**
> - **Cloud Staging Backend:** `https://viztore.onrender.com/api/v1`
> - **Local Backend:** `http://localhost:5000/api/v1`
> - **Customer Web App:** Deployed on Vercel (`apps/web`)
> - **Merchant Panel:** Deployed on Vercel (`apps/merchant`)

---

## 🔑 Universal Password
All pre-seeded test accounts use the same standard password:
```text
Password@123
```

---

## 👤 1. Customer Account (Storefront Shopper)

Used for browsing stores, adding items to cart, placing orders, saving addresses, and viewing order tax invoices.

| Field | Value |
|---|---|
| **Full Name** | Arjun Mehta |
| **Email** | `arjun.customer@example.com` |
| **Phone** | `9876543299` |
| **Password** | `Password@123` |
| **Role** | `customer` |
| **Default Address** | 12-B, Sea Breeze Apts, Bandra West, Mumbai, Maharashtra - 400050 |
| **Portal** | Customer Web Storefront (`/account`, `/cart`, `/checkout`) |

---

## 🏪 2. Merchant Accounts (Store Owners)

Used for logging into the **Merchant Management Panel**, managing product catalogs, processing incoming orders, printing packing slips, and dispatching riders via WhatsApp.

### Store A: Fashion & Apparel (Approved)
*Curated men and women ethnic & contemporary fashion collection.*

| Field | Value |
|---|---|
| **Merchant Name** | RaHul Sharma |
| **Email** | `rahul.merchant@example.com` |
| **Phone** | `9876543210` |
| **Password** | `Password@123` |
| **Store Name** | Urban Vogue Studio |
| **Store Slug** | `urban-vogue-studio` |
| **Category** | `fashion` |
| **City** | Mumbai (Bandra West) |
| **Coordinates** | `[72.8362, 19.0596]` |
| **Approval Status** | `approved` ✅ |
| **Seeded Products** | Linen Shirts, Chanderi Silk Kurtas, Relaxed Fit Chinos |

---

### Store B: Consumer Electronics & Gadgets (Approved)
*Authorized neighborhood consumer electronics, smartphone accessories, and audio gear.*

| Field | Value |
|---|---|
| **Merchant Name** | Priya Patel |
| **Email** | `priya.merchant@example.com` |
| **Phone** | `9876543211` |
| **Password** | `Password@123` |
| **Store Name** | NexGen Gadget Hub |
| **Store Slug** | `nexgen-gadget-hub` |
| **Category** | `electronics` |
| **City** | Bengaluru (Indiranagar) |
| **Coordinates** | `[77.6412, 12.9716]` |
| **Approval Status** | `approved` ✅ |
| **Seeded Products** | Pro ANC Wireless Earbuds, GaN Fast Chargers, Smart Fitness Bands |

---

### Store C: Grocery & Organic Staples (Approved)
*Pure certified organic farm-fresh staples, stone-ground flours, and cold-pressed oils.*

| Field | Value |
|---|---|
| **Merchant Name** | Amit Verma |
| **Email** | `amit.merchant@example.com` |
| **Phone** | `9876543212` |
| **Password** | `Password@123` |
| **Store Name** | GreenValley Organics |
| **Store Slug** | `greenvalley-organics` |
| **Category** | `grocery_staples` |
| **City** | New Delhi (Connaught Place) |
| **Coordinates** | `[77.2167, 28.6315]` |
| **Approval Status** | `approved` ✅ |
| **Seeded Products** | Wild Forest Raw Honey 500g, Cold-Pressed Mustard Oil 1L |

---

### Store D: Home Living & Decor (Pending Review)
*Handcrafted ceramic tableware, terracotta planters, and home decor artifacts.*
*(Use this account to test the **Review Waiting Room** UI or Super Admin approval workflow).*

| Field | Value |
|---|---|
| **Merchant Name** | Sneha Kulkarni |
| **Email** | `sneha.merchant@example.com` |
| **Phone** | `9876543213` |
| **Password** | `Password@123` |
| **Store Name** | Artisan Pottery & Decor |
| **Store Slug** | `artisan-pottery-decor` |
| **Category** | `home_living` |
| **City** | Pune (Koregaon Park) |
| **Coordinates** | `[73.8967, 18.5362]` |
| **Approval Status** | `pending` ⏳ |

---

## ⚡ Quick API Verification (cURL / PowerShell)

### Test Customer Login
```bash
curl -X POST https://viztore.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"arjun.customer@example.com","password":"Password@123"}'
```

### Test Merchant Login
```bash
curl -X POST https://viztore.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rahul.merchant@example.com","password":"Password@123"}'
```

### Response Format
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "fullName": "RaHul Sharma",
      "email": "rahul.merchant@example.com",
      "role": "merchant"
    },
    "tokens": {
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "eyJhbGciOi..."
    }
  }
}
```

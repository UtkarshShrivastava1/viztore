# Platform Seeded Test Credentials

> **Target Environments:**
> - **Cloud Staging Backend:** `https://viztore.onrender.com/api/v1`
> - **Local Backend:** `http://localhost:5000/api/v1`
> - **Customer Web App:** Local: `http://localhost:3000` | Deployed on Vercel (`apps/web`)
> - **Merchant Panel:** Local: `http://localhost:3001` | Deployed on Vercel (`apps/merchant`)
> - **Primary Launch Market:** **Durg & Bhilai, Chhattisgarh (Twin Cities Corridor)**

---

## 🔑 Universal Password
All pre-seeded test accounts use the same standard password:
```text
Password@123
```

---

## 👑 1. Super Administrator Account

Used for approving pending merchant onboarding applications, managing store verification statuses, platform-wide audits, and category governance.

| Field | Value |
|---|---|
| **Full Name** | Super Administrator |
| **Email** | `admin@example.com` |
| **Phone** | `9876500000` |
| **Password** | `Password@123` |
| **Role** | `admin` |
| **Portal** | Merchant & Admin Portal (`http://localhost:3001` / Staging) |

---

## 👤 2. Customer Accounts (Storefront Shoppers)

Used for exploring nearby shops, adding items to single-store cart, placing orders, saving addresses, tracking active delivery status, and viewing tax invoices.

### Customer 1: Arjun Mehta (Bhilai Cluster)
| Field | Value |
|---|---|
| **Full Name** | Arjun Mehta |
| **Email** | `arjun.customer@example.com` |
| **Phone** | `9876543299` |
| **Password** | `Password@123` |
| **Role** | `customer` |
| **Primary Address (Home)** | Plot 14, Nehru Nagar West, Bhilai, Chhattisgarh - 490020 (`[81.3410, 21.2180]`) |
| **Secondary Address (Office)** | Shop 4, Civic Centre Commercial Complex, Sector 6, Bhilai, Chhattisgarh - 490006 (`[81.3780, 21.1960]`) |
| **Portal** | Customer Web Storefront (`http://localhost:3000` / Staging) |

### Customer 2: Sneha Verma (Durg Cluster)
| Field | Value |
|---|---|
| **Full Name** | Sneha Verma |
| **Email** | `sneha.customer@example.com` |
| **Phone** | `9876543288` |
| **Password** | `Password@123` |
| **Role** | `customer` |
| **Primary Address (Home)** | Flat 202, Surya Vihar, Malviya Nagar, Durg, Chhattisgarh - 491001 (`[81.2820, 21.1950]`) |
| **Secondary Address (Office)** | Ganj Para Commercial Belt, Station Road, Durg, Chhattisgarh - 491001 (`[81.2790, 21.1880]`) |
| **Portal** | Customer Web Storefront (`http://localhost:3000` / Staging) |

---

## 🏪 3. Merchant Accounts (Store Owners)

Used for logging into the **Merchant Management Panel**, managing live product catalogs, toggling stock/pricing, processing incoming orders through the lifecycle pipeline, generating thermal packing slips / invoices, and dispatching riders via WhatsApp.

### Store A: Fashion & Apparel (Approved ✅)
*Curated men and women ethnic & contemporary fashion collection.*

| Field | Value |
|---|---|
| **Merchant Name** | Rahul Sharma |
| **Email** | `rahul.merchant@example.com` |
| **Phone** | `9876543210` |
| **Password** | `Password@123` |
| **Store Name** | Urban Vogue Studio |
| **Store Slug** | `urban-vogue-studio` |
| **Category** | `fashion` |
| **Address** | Shop 18, Commercial Complex, Civic Centre, Bhilai, Chhattisgarh - 490006 |
| **Coordinates** | `[81.3780, 21.1960]` (Civic Centre, Bhilai) |
| **Approval Status** | `approved` ✅ |
| **GSTIN** | `22AABCS1429B1ZB` |
| **Seeded Products** | Slim Fit Linen Shirt, Chanderi Silk Kurta Set, Relaxed Fit Chinos, Hand-Block Print Saree, Distressed Denim Jacket, Silk Dupatta |

---

### Store B: Consumer Electronics & Gadgets (Approved ✅)
*Authorized neighborhood consumer electronics, smartphone accessories, and audio gear.*

| Field | Value |
|---|---|
| **Merchant Name** | Vikram Joshi |
| **Email** | `vikram.electronics@example.com` |
| **Phone** | `9876543222` |
| **Password** | `Password@123` |
| **Store Name** | NexGen Gadget Hub |
| **Store Slug** | `nexgen-gadget-hub` |
| **Category** | `electronics` |
| **Address** | Shop 45, G.E. Road, Akash Ganga Market, Supela, Bhilai, Chhattisgarh - 490023 |
| **Coordinates** | `[81.3540, 21.2050]` (Akash Ganga / Supela, Bhilai) |
| **Approval Status** | `approved` ✅ |
| **GSTIN** | `22AAACP9832K1ZR` |
| **Seeded Products** | Pro ANC Wireless Earbuds, 65W GaN Fast Charger, Smart Fitness Band, 10000mAh Magnetic Power Bank, RGB Mechanical Keyboard, Ergonomic Mouse |

---

### Store C: Grocery & Organic Staples (Approved ✅)
*Pure certified organic farm-fresh staples, stone-ground flours, and cold-pressed oils.*

| Field | Value |
|---|---|
| **Merchant Name** | Anita Gupta |
| **Email** | `anita.organics@example.com` |
| **Phone** | `9876543233` |
| **Password** | `Password@123` |
| **Store Name** | GreenValley Organics |
| **Store Slug** | `greenvalley-organics` |
| **Category** | `grocery_staples` |
| **Address** | Plot 12, Commercial Belt, Nehru Nagar East, Bhilai, Chhattisgarh - 490020 |
| **Coordinates** | `[81.3460, 21.2150]` (Nehru Nagar East, Bhilai) |
| **Approval Status** | `approved` ✅ |
| **GSTIN** | `22AAACV4120M1ZQ` |
| **Seeded Products** | Wild Forest Raw Honey 500g, Cold-Pressed Mustard Oil 1L, Organic A2 Desi Cow Ghee 500ml, Farm Whole Wheat Chakki Atta 5kg, Unpolished Organic Toor Dal 1kg, Royal Aged Basmati Rice 5kg |

---

### Store D: Pharmacy & Healthcare Essentials (Approved ✅)
*Over-the-counter wellness essentials, ayurvedic formulations, and hygiene products.*

| Field | Value |
|---|---|
| **Merchant Name** | Dr. Priya Nair |
| **Email** | `priya.pharmacy@example.com` |
| **Phone** | `9876543244` |
| **Password** | `Password@123` |
| **Store Name** | Aura Medico & Wellness |
| **Store Slug** | `aura-medico-and-wellness` |
| **Category** | `beauty_care` |
| **Address** | Shop 6, Station Road, Malviya Nagar, Durg, Chhattisgarh - 491001 |
| **Coordinates** | `[81.2820, 21.1950]` (Station Road / Malviya Nagar, Durg) |
| **Approval Status** | `approved` ✅ |
| **GSTIN** | `22AABCA7712C1ZX` |
| **Seeded Products** | Ayurvedic Cough Relief Syrup 100ml, Daily Complete Multivitamin 60 Tabs, Herbal Anti-Dandruff Shampoo 200ml, 99% Pure Organic Aloe Vera Gel 150g, Certified Organic Green Tea Bags (25 Pack), N95 High Filtration Face Masks (Pack of 5) |

---

### Store E: Retail Fresh Mart (Pending Review ⏳)
*Local neighborhood mini-mart.*
*(Use this account to test the **Review Waiting Room** UI or Super Admin approval flow).*

| Field | Value |
|---|---|
| **Merchant Name** | Karan Malhotra |
| **Email** | `karan.retail@example.com` |
| **Phone** | `9876543255` |
| **Password** | `Password@123` |
| **Store Name** | Karan Fresh Mart |
| **Store Slug** | `karan-fresh-mart` |
| **Category** | `grocery_staples` |
| **Address** | Shop 8, Ganj Para Main Market, Durg, Chhattisgarh - 491001 |
| **Coordinates** | `[81.2790, 21.1880]` (Ganj Para, Durg) |
| **Approval Status** | `pending` ⏳ |
| **GSTIN** | `22AABCK9901M1Z5` |

---

## 📦 4. Seeded Active Orders (Lifecycle Pipeline)

The database includes 5 pre-seeded orders to test every stage of merchant fulfillment and customer tracking:

| Order Number | Status | Store | Customer | Delivery Destination | Grand Total | Delivery OTP |
|---|---|---|---|---|---|:---:|
| `#ORD-10321` | `PENDING` ⏳ | Urban Vogue Studio | Arjun Mehta | Nehru Nagar West, Bhilai (490020) | ₹4,618 | `4821` |
| `#ORD-10322` | `CONFIRMED` 📋 | Urban Vogue Studio | Arjun Mehta | Civic Centre, Bhilai (490006) | ₹4,037 | `7192` |
| `#ORD-10323` | `PACKED` 📦 | Aura Medico & Wellness | Sneha Verma | Malviya Nagar, Durg (491001) | ₹722 | `3904` |
| `#ORD-10324` | `OUT_FOR_DELIVERY` 🛵 | GreenValley Organics | Arjun Mehta | Nehru Nagar West, Bhilai (490020) | ₹1,057 | `8834` |
| `#ORD-10325` | `DELIVERED` ✅ | Urban Vogue Studio | Arjun Mehta | Nehru Nagar West, Bhilai (490020) | ₹1,574 | `5120` |

---

## ⚡ 5. Quick API Verification (cURL / PowerShell)

### Customer Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"arjun.customer@example.com","password":"Password@123"}'
```

### Merchant Login (Urban Vogue Studio - Bhilai)
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rahul.merchant@example.com","password":"Password@123"}'
```

### Merchant Login (Aura Medico - Durg)
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"priya.pharmacy@example.com","password":"Password@123"}'
```

### Super Admin Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Password@123"}'
```

### Discover Stores near Bhilai Center (10km Radius)
```bash
curl -X GET "http://localhost:5000/api/v1/stores?lng=81.3800&lat=21.1938&radius=10000"
```

# Merchant Management Hub (@repo/merchant)

An operational dashboard and POS system for local retailers, built as a high-performance **React 18 SPA with Vite**, Tailwind CSS, and Radix UI.

---

## 🌟 Key Features

- **8-Stage Orders Pipeline**: Real-time management across New Orders, Accepted, Ready to Ship, Shipped, Delivered, All Orders, Cancelled, and Returns.
- **Delivery Handshake OTP Verification**: Enforces physical OTP verification before marking orders delivered.
- **WhatsApp Rider Fleet Dispatch**: 1-click broadcast of order dispatch details to delivery rider WhatsApp groups.
- **In-Store POS & Manual Orders**: Rapid walk-in billing with barcode support, item catalog lookup, and tender selection (UPI, Cash, POS Card, Khata).
- **Customer Khata CRM**: Ledger management for customer store credits, aging balances, and statement downloads.
- **Catalog & Inventory Management**: Master taxonomy catalog creation, variant pricing, barcode SKU management, and shelf/aisle location tagging.
- **KOT & Invoice Printing**: 1-click thermal receipt (80mm) and full A4 GST tax invoice rendering.

---

## 📂 Project Structure

```
src/
├── components/           # UI components categorized by module (orders, catalog, billing, settings)
├── hooks/                # Custom React hooks (auth, orders, socket)
├── lib/                  # Shared utilities (api client, printing, formatting)
├── pages/                # Route view pages (Dashboard, Orders, Catalog, Billing, Customers)
├── stores/               # Zustand application stores (orderStore, catalogStore, authStore)
└── types/                # Merchant-specific interfaces
```

---

## 🛠️ Scripts & Commands

```bash
# Start local development server on port 3001
pnpm dev

# Build production bundle to dist/
pnpm build

# Preview production build locally
pnpm preview
```


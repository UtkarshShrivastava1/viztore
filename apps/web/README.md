# Customer Web Storefront (@repo/web)

A modern, responsive, mobile-first customer storefront built with **Next.js 14+ (App Router)**, Tailwind CSS, Zustand, and TanStack Query.

---

## 🌟 Key Features

- **Hyperlocal Discovery**: Geo-aware store discovery within 3–4 km delivery radius.
- **Single-Store Cart Enforcement**: Enforces a strict one-store-at-a-time cart rule across frontend and backend.
- **Dynamic Catalog & Search**: Faceted filtering by category, price, and attributes with instant search.
- **4-Step Checkout Flow**: Shipping address selector with 10-digit mobile phone limits and Indian PIN code validation.
- **Real-Time Order Tracking**: Order status progression timeline, 4-digit physical handshake OTP display, and 1-click printable GST tax invoices.
- **Dual Viewport Design**: Seamless layout transition between mobile viewport (`< 768px`) and desktop multi-column view (`≥ 1024px`).

---

## 📂 Project Structure

```
src/
├── app/                  # Next.js App Router pages and layouts
│   ├── (auth)/           # Authentication modals and callback routes
│   ├── account/          # Customer account management & order history
│   ├── cart/             # Single-store cart view
│   ├── checkout/         # 4-step purchase checkout flow
│   ├── products/         # Product discovery & PDP (Product Detail Pages)
│   ├── stores/           # Store directory & merchant storefronts
│   └── layout.tsx        # Global layout with branding and navigation
├── components/           # Reusable UI components
├── hooks/                # Custom React hooks (auth, cart, geolocation)
├── lib/api/              # Type-safe API client wrappers
└── stores/               # Zustand global state stores (cartStore, addressStore)
```

---

## 🛠️ Scripts & Commands

```bash
# Start local development server on port 3000
pnpm dev

# Build production bundle
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

# 🚀 Platform Developer & Operator Guide

Welcome to the **Hyperlocal Multi-Vendor E-Commerce Platform** monorepo. This guide provides step-by-step instructions for running, testing, building, and developing all applications and backend modules.

---

## 📑 Table of Contents

1. [Prerequisites & System Requirements](#1-prerequisites--system-requirements)
2. [Quick Start (One-Command Launch)](#2-quick-start-one-command-launch)
3. [Environment Configuration](#3-environment-configuration)
4. [Running Applications & Modules](#4-running-applications--modules)
5. [Running Test Suites](#5-running-test-suites)
6. [Building for Production](#6-building-for-production)
7. [System Topology & Port Mappings](#7-system-topology--port-mappings)
8. [White-Label Branding Configuration](#8-white-label-branding-configuration)
9. [Troubleshooting & Gotchas](#9-troubleshooting--gotchas)

---

## 1. Prerequisites & System Requirements

Ensure you have the following installed on your development machine:

- **Node.js**: `v20.x` or higher (LTS recommended)
- **pnpm**: `v10.x` or `v11.x` (`npm i -g pnpm`)
- **Database (MongoDB)**: Local instance running on port `27017` or MongoDB Atlas URI
- **Cache (Redis)**: Local Redis server running on port `6379` or Upstash/Redis Cloud instance
- **Git**: Latest version

---

## 2. Quick Start (One-Command Launch)

Clone the repository, install dependencies, set up environment variables, and start all services in parallel:

```bash
# 1. Install all workspace dependencies
pnpm install

# 2. Configure environment variables (copy template)
cp .env.example .env

# 3. Launch all applications and backend simultaneously
pnpm dev
```

When started with `pnpm dev`, Turborepo runs all 3 client/server targets concurrently:
- ⚙️ **Backend API**: `http://localhost:5000`
- 🌐 **Customer Web Storefront**: `http://localhost:3000`
- 🏪 **Merchant & Admin Panel**: `http://localhost:3001`

---

## 3. Environment Configuration

The monorepo shares a root `.env` file for platform-wide settings:

```ini
# ==========================================
# SERVER CONFIGURATION
# ==========================================
NODE_ENV=development
PORT=5000
API_VERSION=v1

# ==========================================
# WHITE-LABEL BRANDING
# ==========================================
NEXT_PUBLIC_APP_NAME=LocalStore
NEXT_PUBLIC_APP_TAGLINE=Shop Local. Shop Smart.
NEXT_PUBLIC_APP_DOMAIN=localhost
NEXT_PUBLIC_SUPPORT_EMAIL=support@example.com
NEXT_PUBLIC_LOGO_URL=/logo.svg
NEXT_PUBLIC_THEME_COLOR=#6366f1

# ==========================================
# DATABASES & CACHING
# ==========================================
MONGODB_URI=mongodb://localhost:27017/platform-db
REDIS_URL=redis://127.0.0.1:6379

# ==========================================
# AUTHENTICATION (JWT)
# ==========================================
JWT_ACCESS_SECRET=your_super_secret_jwt_access_key_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key_min_32_chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# ==========================================
# CORS ORIGIN WHITELIST
# ==========================================
CLIENT_WEB_URL=http://localhost:3000
CLIENT_MERCHANT_URL=http://localhost:3001
```

---

## 4. Running Applications & Modules

### 🚀 Run All Applications Concurrently (All-in-One)

To spin up the entire platform stack simultaneously with a single terminal command from the workspace root:

```bash
# Launch Backend (:5000) + Web Storefront (:3000) + Merchant Panel (:3001) concurrently
pnpm dev

# Or using the explicit alias
pnpm dev:all
```

---

### 📦 Running Individual Services Separately

You can also run applications individually using targeted Turborepo workspace filters:

### ⚙️ Backend Modular Monolith (`apps/backend`)

The Node.js + Express API server with MongoDB Mongoose & Redis adapter:

```bash
# From workspace root
pnpm dev:backend

# Or directly from the backend directory
cd apps/backend
pnpm dev
```
- **Port**: `5000`
- **Health Check**: `GET http://localhost:5000/api/v1/health`
- **Active Modules**:
  - `auth`: `/api/v1/auth` (Register, Login, JWT Refresh, Roles)
  - `stores`: `/api/v1/stores` (2dsphere Geo Proximity, Onboarding)
  - `catalog`: `/api/v1/catalog` (Products, Faceted Aggregations, Variants)

---

### 🌐 Customer Web Storefront (`apps/web`)

The Next.js 14 App Router customer discovery and shopping experience:

```bash
# From workspace root
pnpm dev:web

# Or directly from the web directory
cd apps/web
pnpm dev
```
- **Port**: `3000`
- **URL**: `http://localhost:3000`
- **Pages**:
  - Home Discovery Feed (`/`)
  - Nearby Stores Directory (`/stores`)
  - Individual Store Storefront (`/stores/[slug]`)
  - Product Listing Page with Faceted Filtering (`/products`)
  - Product Detail Page with Stock & Variant Swatches (`/products/[slug]`)
  - Category Browse (`/category/[slug]`)

---

### 🏪 Merchant & Admin Panel (`apps/merchant`)

The React 18 + Vite SPA for merchant onboarding, live inventory, and operational dashboard:

```bash
# From workspace root
pnpm dev:merchant

# Or directly from the merchant directory
cd apps/merchant
pnpm dev
```
- **Port**: `3001`
- **URL**: `http://localhost:3001`
- **Features**:
  - 6-Step Merchant Onboarding with HTML5 Signature Canvas
  - Pixel-matched Management Dashboard with Live Order Alerts & Sales Analytics
  - Interactive Drawers: Notifications (🔔), Help & Support (❓), Seller Profile (👤), Profile Details (📝)

---

## 5. Running Test Suites

The backend includes a comprehensive **Vitest** test suite verifying business logic, validation, and domain invariants:

```bash
# Run all unit tests across the entire monorepo
pnpm test

# Run backend tests in watch mode (interactive)
cd apps/backend
pnpm test:watch
```

### 🧪 Current Test Suites (26/26 Passing):
| Test Suite | Module | Coverage Focus |
|---|---|---|
| `AppError.test.ts` | `shared/utils` | Centralized operational error formatting |
| `auth.service.test.ts` | `modules/auth` | Customer/Merchant registration, token verification |
| `store.service.test.ts` | `modules/stores` | 2dsphere proximity scanning, geo-radius checks |
| `onboarding.service.test.ts` | `modules/stores` | 6-step merchant onboarding state machine |
| `catalog.service.test.ts` | `modules/catalog` | Product creation, derived metrics, search aggregation |

---

## 6. Building for Production

To create optimized production builds for deployment (Vercel, Render, Railway, Docker):

```bash
# Build all 5 packages in dependency order via Turborepo
pnpm build

# Build a specific package
pnpm --filter=@repo/backend build
pnpm --filter=@repo/web build
pnpm --filter=@repo/merchant build
pnpm --filter=@repo/shared-types build
```

### Running Production Builds Locally:

```bash
# Run compiled backend server
cd apps/backend && pnpm start

# Run compiled Next.js web application
cd apps/web && pnpm start

# Preview compiled Vite merchant SPA
cd apps/merchant && pnpm preview
```

---

## 7. System Topology & Port Mappings

```
┌─────────────────────────────────────────────────────────────┐
│                    TURBOREPO WORKSPACE                      │
├────────────────────────────────┬────────────────────────────┤
│ Application / Package          │ Port / Path                │
├────────────────────────────────┼────────────────────────────┤
│ Customer Web (@repo/web)       │ http://localhost:3000      │
│ Merchant Panel (@repo/merchant)│ http://localhost:3001      │
│ Backend API (@repo/backend)    │ http://localhost:5000      │
│ MongoDB Atlas / Local          │ mongodb://localhost:27017  │
│ Redis Cache                    │ redis://127.0.0.1:6379     │
│ Shared Types (@repo/shared-types) Internal Type Package     │
│ Config (@repo/config)          │ Shared Tooling Configs     │
└────────────────────────────────┴────────────────────────────┘
```

---

## 8. White-Label Branding Configuration

This platform is architected to be **100% brand-agnostic**. Client-specific brand names or logos must never be hardcoded into components or backend schemas.

To re-brand the platform for any client, adjust environment variables in `.env`:

```ini
NEXT_PUBLIC_APP_NAME="YourStore"
NEXT_PUBLIC_APP_TAGLINE="Fresh Groceries & Apparel in 15 Minutes"
NEXT_PUBLIC_THEME_COLOR="#2563eb"
NEXT_PUBLIC_SUPPORT_EMAIL="care@yourstore.com"
```

All UI components consume branding via `@repo/shared-types/branding.config`:
```tsx
import { branding } from '@repo/shared-types/branding.config';

<h1>Welcome to {branding.appName}</h1>
```

---

## 9. Troubleshooting & Gotchas

### 1. MongoDB `2dsphere` Spatial Index
If nearby store searches return empty or throw index errors:
- Ensure MongoDB is running and `StoreModel.ensureIndexes()` has run.
- Coordinates must be stored in GeoJSON format: `[longitude, latitude]` (longitude first!).

### 2. NodeNext ESM Import Extensions
- The backend and shared packages use `"moduleResolution": "NodeNext"`.
- When adding imports across internal files, include the `.js` extension (e.g. `import { authService } from './auth.service.js'`). Next.js has an `extensionAlias` configured to resolve `.ts` equivalents automatically.

### 3. Redis Connection Warning
- If Redis is not running locally in development, the backend will log a connection attempt. For offline local development, you can start a local container:
  ```bash
  docker run -d -p 6379:6379 redis:alpine
  ```

### 4. Turborepo Cache Clean
If you experience stale build or cache issues:
```bash
pnpm clean
pnpm build
```

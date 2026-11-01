# Hyperlocal Multi-Vendor E-Commerce Platform

A production-grade, brand-agnostic, white-label hyperlocal multi-vendor e-commerce platform designed for local retail digitization. Features sub-4km proximity store discovery, a single-store checkout cart rule, real-time merchant order fulfillment, WhatsApp rider fleet dispatch, and automated tax invoicing.

---

## 🏗️ Architecture & Technology Stack

The platform is structured as an enterprise **Turborepo** monorepo containing modular client applications, a modular monolith backend engine, and shared contract packages.

```
├── apps/
│   ├── backend/         # Node.js 20+ / Express modular monolith REST API & WebSocket server
│   ├── web/             # Customer storefront web application (Next.js 14+ App Router)
│   ├── merchant/        # Merchant management & POS administration panel (React 18 / Vite)
│   ├── company/         # Corporate brand marketing & information website (Next.js 15)
│   └── mobile-customer/ # Cross-platform customer mobile application (React Native / Expo)
├── packages/
│   ├── shared-types/    # Shared TypeScript types, Zod schemas & central branding configuration
│   └── config/          # Centralized Tailwind, TypeScript, and ESLint configurations
└── postman/             # Standard API collection & environment specifications
```

### Core Technologies

| Layer | Framework & Tooling | Key Libraries |
|---|---|---|
| **Monorepo Engine** | Turborepo, pnpm workspaces | Node.js 20+ LTS |
| **Backend REST API** | Express.js, TypeScript (strict mode) | Mongoose, MongoDB Atlas (2dsphere index), Redis (ioredis), Socket.io, Zod, Multer |
| **Customer Web** | Next.js 14+ (App Router, SSR/SSG) | Tailwind CSS, Zustand, TanStack Query, Lucide React, Leaflet Maps |
| **Merchant Panel** | React 18 SPA (Vite) | Tailwind CSS, Radix UI primitives, TanStack Table, Recharts, Zustand |
| **Corporate Site** | Next.js 15 App Router | Framer Motion, Tailwind CSS, Lucide React |
| **Contracts & Types** | TypeScript, Zod | Central `branding.config.ts` |
| **Testing** | Vitest, Supertest, mongodb-memory-server | 256+ automated unit & integration tests |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.x or higher
- **pnpm**: v9.x or higher (`corepack enable && corepack prepare pnpm@latest --activate`)
- **MongoDB**: Local MongoDB instance or MongoDB Atlas connection URI
- **Redis**: Local Redis or cloud Redis (Upstash / Redis Cloud)

### 1. Installation

Clone the repository and install all workspace dependencies:

```bash
git clone <repository-url>
cd platform-root
pnpm install
```

### 2. Environment Configuration

Copy the example environment template in the root directory:

```bash
cp .env.example .env
```

Optionally configure client app environment files:
- `apps/backend/.env` (API server port, MongoDB URI, JWT secrets)
- `apps/web/.env.local` (API URL, NextAuth secrets, Google Maps API key)
- `apps/merchant/.env.local` (Vite API endpoint URL)

### 3. Running Development Servers

Start all applications concurrently via Turborepo:

```bash
# Launch all apps (Backend :5000, Web :3000, Merchant :3001, Company :3002)
pnpm dev

# Or launch specific applications individually:
pnpm --filter=@repo/backend dev    # Backend API (http://localhost:5000)
pnpm --filter=@repo/web dev        # Customer Web (http://localhost:3000)
pnpm --filter=@repo/merchant dev   # Merchant Portal (http://localhost:3001)
pnpm --filter=@repo/company dev    # Corporate Landing (http://localhost:3002)
```

---

## 🧪 Testing & Quality Assurance

Run the automated test suite across all monorepo packages:

```bash
# Run all unit, integration, and E2E simulation tests
pnpm test

# Run tests in watch mode for development
pnpm --filter=@repo/backend test:watch

# Execute full monorepo typecheck without emitting artifacts
pnpm build
```

---

## 🏷️ White-Label & Domain Configuration

This repository is strictly **brand-agnostic**. All client-facing brand identifiers, taglines, legal URLs, and theme palettes are configured dynamically via environment variables and resolved through `packages/shared-types/src/branding.config.ts`:

```typescript
export const branding = {
  appName:      process.env.NEXT_PUBLIC_APP_NAME      || 'LocalStore',
  tagline:      process.env.NEXT_PUBLIC_APP_TAGLINE   || 'Shop Local. Shop Smart.',
  domain:       process.env.NEXT_PUBLIC_APP_DOMAIN    || 'localhost',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@example.com',
  logoUrl:      process.env.NEXT_PUBLIC_LOGO_URL      || '/logo.svg',
  themeColor:   process.env.NEXT_PUBLIC_THEME_COLOR   || '#6366f1',
} as const;
```

---

## 🚢 Production Deployment

### Docker Deployment
The repository includes a production multi-stage `Dockerfile`:

```bash
docker build -t platform-backend:latest .
docker run -p 5000:5000 --env-file .env platform-backend:latest
```

### Cloud Platforms
- **Backend API**: Deploys natively to Render or Railway using `render.yaml` or `railway.json`.
- **Customer Web (`apps/web`)**: Optimized for deployment on Vercel with Next.js App Router edge caching.
- **Merchant Panel (`apps/merchant`)**: Builds as a static Single Page Application (`pnpm --filter=@repo/merchant build`) suitable for Vercel, Netlify, or Cloudflare Pages.
- **Corporate Site (`apps/company`)**: Deployable to Vercel with static page pre-rendering.

---

## 📄 License & IP

Private & Confidential. All intellectual property and codebase rights reserved.

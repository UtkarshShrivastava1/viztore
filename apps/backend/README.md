# Backend API Engine (@repo/backend)

The core modular monolith REST API and real-time WebSocket backend engine for the hyperlocal multi-vendor commerce platform.

---

## 🏛️ Architecture & Principles

- **Modular Monolith**: Organized into clean domain boundaries (`src/modules/{auth, stores, catalog, orders, delivery, billing, coupons, notifications}`).
- **Facade Pattern**: Modules expose strict public facades for inter-module communication; direct cross-boundary model imports are forbidden.
- **Transactional Outbox Pattern**: Outbox event table backed by MongoDB Atlas ensures reliable asynchronous event delivery.
- **Optimistic Concurrency Control (OCC)**: Order and stock updates enforce version checks (`expectedVersion`) to prevent race conditions.
- **Geospatial Proximity**: 2dsphere indexing on MongoDB for sub-4km store discovery.

---

## 📂 Module Structure

Each domain module under `src/modules/<module-name>/` follows consistent layering:

```
src/modules/<module>/
├── <module>.controller.ts    # HTTP request handling and status codes
├── <module>.service.ts       # Core business logic and transactions
├── <module>.model.ts         # Mongoose schema and MongoDB models
├── <module>.repository.ts    # Data access layer
├── <module>.validation.ts    # Zod schemas for request validation
├── <module>.routes.ts        # Express route definitions & middlewares
├── <module>.types.ts         # Module-specific TypeScript interfaces
└── index.ts                  # Public module facade exports
```

---

## 🛠️ Scripts & Commands

```bash
# Start backend in development mode with hot-reloading
pnpm dev

# Run Vitest test suite (all unit and integration tests)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Compile TypeScript to dist/
pnpm build

# Start compiled production server
pnpm start
```

---

## 🔒 Security & Middleware

- Strict JWT access & refresh token rotation with HTTP-only cookies.
- Role-based access control (RBAC): `customer`, `merchant`, `admin`, `rider`.
- Rate limiting per endpoint (general API limiter, auth limiter, OTP verification limiter).
- Strict Zod schema validation on all incoming request payloads and query parameters.

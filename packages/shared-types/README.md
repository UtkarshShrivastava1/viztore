# Shared Contracts & Branding Configuration (@repo/shared-types)

Centralized contract repository containing shared TypeScript interfaces, Zod validation schemas, domain types, and the platform branding configuration.

---

## 📂 Contents

- `branding.config.ts`: Central dynamic branding configuration pulling from environment variables.
- `standardFields.ts`: Standardized validators, regex patterns, sanitizers, and Zod schemas for 10-digit phone numbers, 6-digit PIN codes, PAN, GSTIN, and IFSC.
- `order.types.ts`: Universal order data models, stage enums, and shipping address contracts.
- `customer.types.ts`: Khata customer records, billing addresses, and transaction histories.
- `store.types.ts`: Store metadata, spatial geo-coordinates, operating hours, and commission settings.
- `catalog.types.ts`: Master categories, product variants, SKUs, and pricing rules.

---

## 🛠️ Build Commands

```bash
# Compile TypeScript declarations to dist/
pnpm build

# Watch mode for monorepo development
pnpm dev
```


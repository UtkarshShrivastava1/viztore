# Customer Mobile App (@repo/mobile-customer)

This is the **Customer Mobile App** for the hyperlocal multi-vendor platform, built with **React Native + Expo SDK 51 + Expo Router v3**.

## Directory Structure
- `app/(tabs)/`: 5-Tab Bottom Navigator
  - `index.tsx`: Home Screen (`Mob 1.0`, `Mob 1.1`)
  - `categories.tsx`: Category Hub (`Mob 2.0`)
  - `stores.tsx`: Stores Near Me (`Mob 3.0`)
  - `cart.tsx`: Single-Store Cart (`Mob 5.0`)
  - `account.tsx`: Customer Account Hub (`Mob 4.0`)
- `app/products/[slug].tsx`: Product Details Screen (`Mob 2.2`, `Mob 2.3`)
- `app/checkout/`:
  - `index.tsx`: 4-Step Checkout Flow (`Mob 5.1`, `Mob 5.2`)
  - `success.tsx`: Order Confirmation with 4-Digit Delivery OTP (`Mob 5.3`)

## Running Locally
```bash
# Start Expo development server
pnpm --filter @repo/mobile-customer start
```

# 🛵 Hyperlocal Rider Fleet Pool Broadcast & Atomic Claim Engine
## Architectural Specification & Implementation Plan

---

### 1. Executive Summary & Objective
Transform the current 1-to-1 targeted delivery dispatch into an autonomous, shared **Zomato/Swiggy-style Rider Fleet Pool** for Indian hyperlocal markets (e.g., Bhilai, Durg, Raipur).
- **Core Problem Solved:** Eliminates the burden on local brick-and-mortar merchants to hire or manage delivery staff.
- **Concurrency Guarantee:** Broadcasts open runs to nearby active platform riders while mathematically guaranteeing that **exactly one rider** can claim the assignment using an atomic database mutex (`findOneAndUpdate`).

---

### 2. End-to-End Operational Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Merchant as Merchant Shop
    participant Backend as Backend Delivery Service
    participant WhatsApp as Meta WhatsApp Cloud API
    actor Rider1 as Rider 1 (Raju - 0.5s)
    actor Rider2 as Rider 2 (Vikram - 1.2s)
    actor Customer as Pooja (Customer)

    Merchant->>Backend: Mark Order "PACKED" / "Ready to Ship"
    Backend->>Backend: Find active, idle riders within 3km of store
    Backend->>WhatsApp: Broadcast Run Teaser (Pickup area, drop area, payout ₹40)
    WhatsApp-->>Rider1: Ping with [ACCEPT RUN] button/link
    WhatsApp-->>Rider2: Ping with [ACCEPT RUN] button/link
    
    Rider1->>Backend: POST /api/v1/delivery/:orderId/claim (Winner)
    Note over Backend: Atomic Mutex Lock: status='SEARCHING_PARTNER' -> 'ASSIGNED'
    Backend-->>Rider1: ✅ 200 OK + Unlocks Google Maps & Store Pickup Code
    
    Rider2->>Backend: POST /api/v1/delivery/:orderId/claim (Too late)
    Backend-->>Rider2: ⚠️ 409 Conflict: "Order already claimed"
    
    Rider1->>Merchant: Arrives at Shop, quotes Pickup Code
    Merchant->>Rider1: Hands over sealed package with thermal bill
    Rider1->>Customer: Arrives at Doorstep, collects Cash (COD)
    Customer->>Rider1: Hands over secret 4-digit Delivery OTP (5575)
    Rider1->>Backend: POST /api/v1/delivery/:orderId/verify-otp (5575)
    Backend-->>Merchant: Status -> DELIVERED
    Backend-->>Rider1: Delivery Fee (+₹40) credited to Rider Wallet
```

---

### 3. Concrete Implementation Phases

#### Phase A: Backend Delivery Pool & Mutex Engine (`apps/backend`)
1. **Extend `DeliveryModel` (`apps/backend/src/modules/delivery/delivery.model.ts`)**:
   - Add `broadcastRiderPool: Array<{ riderId: string; pingedAt: Date }>`
   - Add `claimExpiresAt: Date` (60-second time-to-live for pool claims)
   - Add `pickupVerificationCode: string` (e.g. `PICKUP-79`)
2. **Atomic Claim Service & Route (`POST /api/v1/delivery/:orderId/claim`)**:
   ```typescript
   async function claimDeliveryRun(orderId: string, riderId: string): Promise<ClaimResult> {
     const claimed = await DeliveryModel.findOneAndUpdate(
       {
         orderId,
         status: DeliveryStatus.SEARCHING_PARTNER,
         rider: null,
       },
       {
         $set: {
           status: DeliveryStatus.ASSIGNED,
           rider: riderSnapshot,
           assignedAt: new Date(),
         },
       },
       { new: true }
     );
     if (!claimed) {
       throw AppError.conflict('Order already claimed by another partner', 'ALREADY_CLAIMED');
     }
     return { success: true, delivery: claimed };
   }
   ```
3. **Automated WhatsApp Interactive Broadcast**:
   - Update `whatsapp.service.ts` to format WhatsApp interactive message template with a Quick Reply button: `[ 🟢 ACCEPT RUN ]` or short-link URL (`https://delivery.platform.in/claim/:token`).

---

#### Phase B: Mobile-Optimized Rider Claim & Verification View
1. **Lightweight Mobile Web Interface (`apps/web` or dedicated PWA route `/delivery/claim/[token]`)**:
   - Screen 1: **One-Tap Claim Button** showing Store Name, Drop Neighborhood, Distance, and Payout (₹40).
   - Screen 2: **Active Run Dashboard** (Once claimed):
     - Direct *"Open in Google Maps"* button (`travelmode=two-wheeler`).
     - Store Pickup Code to show shopkeeper (`PICKUP-79`).
     - Customer Call Button.
     - 4-Digit OTP entry input to complete delivery at the doorstep.
   - Screen 3: **Already Claimed Zero-State** with friendly notification if another rider tapped first.

---

#### Phase C: Rider Ledger & Earnings Reconciliation
1. **Rider Wallet Balance (`rider_wallets` collection)**:
   - Track delivery payouts: `+₹40` per completed delivery.
   - Track Cash on Delivery (COD) in-hand: `+₹838.95` collected cash liability.
   - Daily end-of-day cash sweep / settlement calculation.

---

### 4. Technical Invariants
- **Zero Client Brand Hardcoding:** All rider notifications and claim screens dynamically pull from `branding.config.ts`.
- **Zero Customer Address Leaks:** Drop-off building name and phone number are strictly withheld until the atomic lock is won.
- **Zero Double-Delivery:** Enforced mathematically at MongoDB query level via ACID atomic filter matching.

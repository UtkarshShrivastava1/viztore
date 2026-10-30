# 🔍 Manual Testing Issue & Bug Tracker (Round 2)

## 📊 Live Progress & Remediation Dashboard

> **Active Phase**: Founder / User End-to-End Manual Commerce Verification  
> **Testing Scope**: Merchant Onboarding ➔ Catalog Management ➔ Customer Discovery ➔ Cart & Checkout ➔ Real-Time Audio & Order Fulfillment ➔ 4-Digit Handshake OTP ➔ Counter POS Walk-in Sale  
> **Environment**: Local Monolith (`apps/backend` on `:5000`, `apps/merchant` on `:3001`, `apps/web` on `:3000`) — Fresh 100% Blank Slate Atlas DB  
> **Status**: **READY FOR INBOUND ISSUES** 🚀  
> **Items Logged**: **0 Total** | **0 Open** | **0 In Progress** | **0 Resolved**  
> **Remediation Progress**: `[--------------------] 0.0%`

---

### Layer Distribution Summary

| Application Layer | Total Logged | Critical (P0) | High (P1) | Medium (P2) | Polish (P3) | Resolved | Status |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Merchant Hub (`apps/merchant` :3001)** | 0 | 0 | 0 | 0 | 0 | 0 | Ready 🟢 |
| **Customer Web (`apps/web` :3000)** | 0 | 0 | 0 | 0 | 0 | 0 | Ready 🟢 |
| **Backend API Monolith (`apps/backend` :5000)** | 0 | 0 | 0 | 0 | 0 | 0 | Ready 🟢 |
| **Cross-Cutting (Sockets, Redis, DB, Print)** | 0 | 0 | 0 | 0 | 0 | 0 | Ready 🟢 |
| **TOTAL** | **0** | **0** | **0** | **0** | **0** | **0** | **0.0%** |

---

## 1. Master Issue & Bug Registry

| ID | Issue Title | Layer | Module / Screen | Type | Severity | Reported In | Status |
|---|---|---|---|---|:---:|:---:|:---:|
| *Waiting for issues* | *Share any bugs, layout glitches, or unexpected behavior in chat — they will be logged here with root-cause analysis and immediate patches.* | — | — | — | — | — | `READY` |

---

## 2. Issue Detail & Remediation Log

*(New issues will be documented here with exact reproduction steps, root cause analysis, target files, code patches, and verification status.)*

---

## 3. How to Report an Issue in Chat

When you encounter any problem during manual testing, simply describe it in chat (or paste a screenshot/error message). Helpful details to include (any or all):
- **Screen / URL**: e.g., `http://localhost:3001/register` or `http://localhost:3000/cart`
- **What happened**: e.g., *"Clicked Submit button, nothing happened"* or *"The button is misaligned on mobile"*
- **Browser Console Error (if open)**: e.g., `POST /api/v1/orders 400 Bad Request` or red JS errors
- **Screenshot**: Attach directly in chat.

The tracker will be updated with:
1. Sequential tracking ID (`ISSUE-001`, `ISSUE-002`, etc.)
2. Root cause diagnosis across backend, frontend, or shared types
3. Direct code fix and verification
4. Live progress updates in the dashboard above.

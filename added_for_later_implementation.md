# 📌 Deferred Features & Implementation Roadmap Backlog
## Document: "Added for Later Implementation"

**Maintained By:** Lead Architect & Senior Full-Stack Engineering Team  
**Initiated Date:** October 12, 2026  
**Status:** `DEFERRED / ROADMAP BACKLOG` ⏳  

---

## 1. Overview & Architectural Policy

To guarantee the **Enterprise Production Invariant** across the platform, no UI element may present inactive, simulated, or dummy behavior to end users. Features that require external third-party API keys, OAuth consent screens, or paid gateway configurations are formally cataloged in this document and hidden from production view until their full backend pipelines and credentials are operational.

---

## 2. Deferred Feature Catalog

### 🔑 Feature 01: Google OAuth 2.0 Single Sign-On (SSO)
* **Status:** `DEFERRED — READY FOR IMPLEMENTATION WHEN CREDS PROVIDED`
* **Affected Applications:**
  - `apps/web/` (Customer Storefront Auth Modal)
  - `apps/merchant/` (Merchant & Admin Panel Login)
* **Reason for Deferral:**
  The current platform launch scope prioritizes rock-solid direct credentials (Email, 10-Digit Mobile Number, Password with bcrypt $\ge 12$ salt rounds, and JWT Access/Refresh tokens). Third-party Google OAuth requires active Google Cloud Console OAuth 2.0 Client credentials (`Client ID` and `Client Secret`) and authorized redirect URIs. To prevent fake user simulation or broken clicks, the button has been removed from `AuthModal.tsx`.

#### Technical Blueprint for Activation:
1. **Google Cloud Console Setup:**
   - Create OAuth 2.0 Client ID for Web Application.
   - Authorized Javascript Origins:
     - `http://localhost:3000` (Customer Web Dev)
     - `http://localhost:3001` (Merchant Panel Dev)
     - Production domains (`https://...`)
   - Authorized Redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (if NextAuth) or pop-up GIS flow.

2. **Environment Variables Required:**
   ```env
   # Backend (.env)
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # Customer Web (.env.local)
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

   # Merchant Panel (.env)
   VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ```

3. **Backend Service Contract (`apps/backend`):**
   - Install dependency: `pnpm --filter backend add google-auth-library`
   - Create Route: `POST /api/v1/auth/google`
   - Request Body:
     ```json
     {
       "credential": "<Google_ID_Token_JWT>"
     }
     ```
   - Service Logic (`auth.service.ts`):
     ```typescript
     import { OAuth2Client } from 'google-auth-library';
     const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

     export async function verifyGoogleToken(idToken: string) {
       const ticket = await client.verifyIdToken({
         idToken,
         audience: process.env.GOOGLE_CLIENT_ID,
       });
       const payload = ticket.getPayload();
       if (!payload || !payload.email) throw new AppError(400, 'INVALID_GOOGLE_TOKEN', 'Google verification failed');

       // Find or create user
       let user = await UserModel.findOne({ email: payload.email });
       if (!user) {
         user = await UserModel.create({
           fullName: payload.name || 'Google User',
           email: payload.email,
           role: 'customer',
           isVerified: true,
           googleId: payload.sub,
         });
       }
       return generateTokenPair(user);
     }
     ```

4. **Frontend UI Re-activation (`apps/web`):**
   - Install `@react-oauth/google` or render native Google Identity Services button via `<GoogleOAuthProvider>`.
   - On credential response, post token to `/api/v1/auth/google`.
   - Dispatch `setAuth(res.user, res.tokens.accessToken)`.

---

### 📱 Feature 02: SMS OTP Direct Phone Authentication
* **Status:** `PHASE 2 ROADMAP`
* **Affected Applications:** `apps/web/`, `apps/merchant/`
* **Reason for Deferral:**
  Requires dedicated SMS Gateway integration (MSG91 / Twilio / Fast2SMS) and DLT template approval under Indian TRAI regulations.
* **Activation Path:**
  - Create `apps/backend/src/shared/services/sms.service.ts`.
  - Add OTP generation, Redis TTL expiration (5 minutes), and rate limiting.
  - Endpoints: `POST /api/v1/auth/otp/send` and `POST /api/v1/auth/otp/verify`.

---

### 💳 Feature 03: Razorpay / Cashfree Live Payment Gateway
* **Status:** `PHASE 2 ROADMAP`
* **Affected Applications:** `apps/web/src/features/checkout/`
* **Reason for Deferral:**
  Currently standard Cash on Delivery (COD) and Pay on Pickup are active for local hyper-local merchants. Online payment gateways will be wired with merchant sub-merchant split settlements once KYC keys are connected.

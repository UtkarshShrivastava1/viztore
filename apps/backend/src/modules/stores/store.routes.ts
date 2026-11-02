import { Router } from 'express';
import {
  createStoreSchema,
  updateStoreSchema,
  nearbyStoresQuerySchema,
  approveStoreSchema,
  completeOnboardingSchema,
  rateStoreSchema,
  UserRole,
} from '@repo/shared-types';
import { validateRequest } from '../../shared/middlewares/validateRequest.js';
import { authGuard } from '../../shared/middlewares/authGuard.js';
import { roleGuard } from '../../shared/middlewares/roleGuard.js';
import * as storeController from './store.controller.js';
import * as onboardingController from './onboarding.controller.js';
import * as onboardingPaymentController from './onboarding-payment.controller.js';

const router = Router();

// ==========================================
// Merchant 6-Step Onboarding Pipeline
// ==========================================
router.post(
  ['/verify-pan', '/onboarding/verify-pan'],
  storeController.verifyPan,
);

router.post(
  '/onboarding/verify-gstin',
  onboardingController.verifyGstin,
);

router.post(
  '/onboarding/submit',
  authGuard,
  roleGuard(UserRole.MERCHANT, UserRole.ADMIN),
  validateRequest({ body: completeOnboardingSchema }),
  onboardingController.submitOnboarding,
);

router.get(
  '/onboarding/status',
  authGuard,
  onboardingController.getOnboardingStatus,
);

// ==========================================
// Merchant Onboarding Commercial Plan & Payment Routes
// ==========================================
router.get(
  '/onboarding/payment/plans',
  onboardingPaymentController.getPlans,
);

router.post(
  '/onboarding/payment/validate-coupon',
  onboardingPaymentController.validateCoupon,
);

router.post(
  '/onboarding/payment/create-order',
  authGuard,
  roleGuard(UserRole.MERCHANT, UserRole.ADMIN),
  onboardingPaymentController.createPaymentOrder,
);

router.post(
  '/onboarding/payment/verify',
  authGuard,
  roleGuard(UserRole.MERCHANT, UserRole.ADMIN),
  onboardingPaymentController.verifyPayment,
);


// ==========================================
// Super Admin Queue & Review Endpoints
// ==========================================
router.get(
  '/admin/pending',
  authGuard,
  roleGuard(UserRole.ADMIN),
  onboardingController.getPendingQueue,
);

router.patch(
  '/admin/:id/review',
  authGuard,
  roleGuard(UserRole.ADMIN),
  onboardingController.reviewStore,
);

// ==========================================
// Public Store Discovery Endpoints
// ==========================================
router.get(
  '/nearby',
  validateRequest({ query: nearbyStoresQuerySchema }),
  storeController.getNearbyStores,
);

router.get(
  '/',
  storeController.listStores,
);

router.get(
  '/slug/:slug',
  storeController.getStoreBySlug,
);

// ==========================================
// Merchant Authenticated Store Management
// ==========================================
router.get(
  ['/me', '/mine', '/my-stores', '/my-store'],
  authGuard,
  roleGuard(UserRole.MERCHANT, UserRole.ADMIN),
  storeController.getMyStores,
);

router.post(
  '/',
  authGuard,
  roleGuard(UserRole.MERCHANT, UserRole.ADMIN),
  validateRequest({ body: createStoreSchema }),
  storeController.createStore,
);


router.get(
  '/:id/settings',
  authGuard,
  roleGuard(UserRole.MERCHANT, UserRole.ADMIN),
  storeController.getStoreSettings,
);

router.patch(
  '/:id/settings',
  authGuard,
  roleGuard(UserRole.MERCHANT, UserRole.ADMIN),
  storeController.updateStoreSettings,
);

router.put(
  '/:id/settings',
  authGuard,
  roleGuard(UserRole.MERCHANT, UserRole.ADMIN),
  storeController.updateStoreSettings,
);

router.patch(
  ['/:id', '/:id/status'],
  authGuard,
  roleGuard(UserRole.MERCHANT, UserRole.ADMIN),
  validateRequest({ body: updateStoreSchema }),
  storeController.updateStore,
);

// Admin Direct Approval
router.patch(
  '/:id/approve',
  authGuard,
  roleGuard(UserRole.ADMIN),
  validateRequest({ body: approveStoreSchema }),
  storeController.approveStore,
);

// Store Ratings & Feedback
router.post(
  '/:id/rating',
  authGuard,
  validateRequest({ body: rateStoreSchema }),
  storeController.rateStore,
);

router.get(
  '/:id/rating',
  storeController.getStoreRatings,
);

// Public Single Store by ID
router.get(
  '/:id',
  storeController.getStoreById,
);

export const storeRouter = router;

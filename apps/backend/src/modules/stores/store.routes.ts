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

const router = Router();

// ==========================================
// Merchant 6-Step Onboarding Pipeline
// ==========================================
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
  '/mine',
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

router.patch(
  '/:id',
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

import { Router } from 'express';
import { ReturnController } from './return.controller.js';
import { optionalAuthGuard } from '../../shared/middlewares/authGuard.js';
import {
  validateCreateReturn,
  validateApproveReturn,
  validateRejectReturn,
  validateRefundReturn,
  validateQueryReturns,
} from './return.validation.js';

const router = Router();

// Customer or merchant can create returns
router.post(
  '/',
  optionalAuthGuard,
  validateCreateReturn,
  ReturnController.createReturn
);

// Customer query for own returns
router.get(
  '/my-returns',
  optionalAuthGuard,
  ReturnController.getMyReturns
);

// Merchant list store returns
router.get(
  '/',
  optionalAuthGuard,
  validateQueryReturns,
  ReturnController.getStoreReturns
);

router.get(
  '/store/:storeId',
  optionalAuthGuard,
  validateQueryReturns,
  ReturnController.getStoreReturns
);

// Single return inspection
router.get(
  '/:id',
  optionalAuthGuard,
  ReturnController.getReturnById
);

// Merchant action: Approve return
router.patch(
  '/:id/approve',
  optionalAuthGuard,
  validateApproveReturn,
  ReturnController.approveReturn
);

// Merchant action: Reject return
router.patch(
  '/:id/reject',
  optionalAuthGuard,
  validateRejectReturn,
  ReturnController.rejectReturn
);

// Merchant action: Process refund
router.post(
  '/:id/refund',
  optionalAuthGuard,
  validateRefundReturn,
  ReturnController.processRefund
);

export const returnRoutes = router;

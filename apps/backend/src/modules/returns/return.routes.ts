import { Router } from 'express';
import { ReturnController } from './return.controller.js';
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
  validateCreateReturn,
  ReturnController.createReturn
);

// Customer query for own returns
router.get(
  '/my-returns',
  ReturnController.getMyReturns
);

// Merchant list store returns
router.get(
  '/',
  validateQueryReturns,
  ReturnController.getStoreReturns
);

router.get(
  '/store/:storeId',
  validateQueryReturns,
  ReturnController.getStoreReturns
);

// Single return inspection
router.get(
  '/:id',
  ReturnController.getReturnById
);

// Merchant action: Approve return
router.patch(
  '/:id/approve',
  validateApproveReturn,
  ReturnController.approveReturn
);

// Merchant action: Reject return
router.patch(
  '/:id/reject',
  validateRejectReturn,
  ReturnController.rejectReturn
);

// Merchant action: Process refund
router.post(
  '/:id/refund',
  validateRefundReturn,
  ReturnController.processRefund
);

export const returnRoutes = router;

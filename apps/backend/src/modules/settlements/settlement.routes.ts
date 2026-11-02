import { Router } from 'express';
import { SettlementController } from './settlement.controller.js';
import {
  validateSaveBankAccount,
  validateRequestPayout,
  validateQuerySettlements,
} from './settlement.validation.js';

const router = Router();

// Store overview
router.get('/overview', SettlementController.getOverview);
router.get('/store/:storeId/overview', SettlementController.getOverview);

// Past settlements history
router.get('/', validateQuerySettlements, SettlementController.getHistory);
router.get('/store/:storeId/history', validateQuerySettlements, SettlementController.getHistory);

// Bank account configuration
router.get('/bank-account', SettlementController.getBankAccount);
router.post('/bank-account', validateSaveBankAccount, SettlementController.saveBankAccount);

// On-demand payout request
router.post('/request', validateRequestPayout, SettlementController.requestPayout);

// Single settlement details
router.get('/:id', SettlementController.getById);

export const settlementRoutes = router;


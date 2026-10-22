import { Request, Response } from 'express';
import { analyticsService } from './analytics.service.js';
import { AnalyticsTimePeriod } from '@repo/shared-types';

export class AnalyticsController {
  private resolveStoreId(req: Request): string | undefined {
    const user = (req as any).user;
    if (user?.role === 'admin' && req.query.storeId) {
      return String(req.query.storeId);
    }
    return user?.storeId || (req.query.storeId ? String(req.query.storeId) : undefined);
  }

  getOverview = async (req: Request, res: Response): Promise<void> => {
    const storeId = this.resolveStoreId(req);
    const period = (req.query.period as AnalyticsTimePeriod) || '7d';
    const data = await analyticsService.getOverview(storeId, period);
    res.json({ success: true, data });
  };

  getProfitLoss = async (req: Request, res: Response): Promise<void> => {
    const storeId = this.resolveStoreId(req);
    const period = (req.query.period as AnalyticsTimePeriod) || 'this_month';
    const data = await analyticsService.getProfitLoss(storeId, period);
    res.json({ success: true, data });
  };

  getProductWise = async (req: Request, res: Response): Promise<void> => {
    const storeId = this.resolveStoreId(req);
    const period = (req.query.period as AnalyticsTimePeriod) || '7d';
    const category = req.query.category ? String(req.query.category) : undefined;
    const data = await analyticsService.getProductWise(storeId, period, category);
    res.json({ success: true, data });
  };

  getTotalOrders = async (req: Request, res: Response): Promise<void> => {
    const storeId = this.resolveStoreId(req);
    const period = (req.query.period as AnalyticsTimePeriod) || '7d';
    const data = await analyticsService.getTotalOrders(storeId, period);
    res.json({ success: true, data });
  };

  getOfflineBilling = async (req: Request, res: Response): Promise<void> => {
    const storeId = this.resolveStoreId(req);
    const period = (req.query.period as AnalyticsTimePeriod) || '7d';
    const data = await analyticsService.getOfflineBilling(storeId, period);
    res.json({ success: true, data });
  };

  getGSTReport = async (req: Request, res: Response): Promise<void> => {
    const storeId = this.resolveStoreId(req);
    const period = (req.query.period as AnalyticsTimePeriod) || 'this_month';
    const data = await analyticsService.getGSTReport(storeId, period);
    res.json({ success: true, data });
  };

  getPayouts = async (req: Request, res: Response): Promise<void> => {
    const storeId = this.resolveStoreId(req);
    const period = (req.query.period as AnalyticsTimePeriod) || 'this_month';
    const data = await analyticsService.getPayouts(storeId, period);
    res.json({ success: true, data });
  };

  getSettlements = async (req: Request, res: Response): Promise<void> => {
    const storeId = this.resolveStoreId(req);
    const period = (req.query.period as AnalyticsTimePeriod) || 'this_month';
    const data = await analyticsService.getSettlements(storeId, period);
    res.json({ success: true, data });
  };

  getTransactions = async (req: Request, res: Response): Promise<void> => {
    const storeId = this.resolveStoreId(req);
    const period = (req.query.period as AnalyticsTimePeriod) || 'this_month';
    const data = await analyticsService.getTransactions(storeId, period);
    res.json({ success: true, data });
  };

  exportCsv = async (req: Request, res: Response): Promise<void> => {
    const storeId = this.resolveStoreId(req);
    const reportType = req.query.report ? String(req.query.report) : 'overview';
    const period = (req.query.period as AnalyticsTimePeriod) || 'this_month';
    const { filename, csv } = await analyticsService.exportReportCsv(storeId, reportType, period);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  };
}

export const analyticsController = new AnalyticsController();

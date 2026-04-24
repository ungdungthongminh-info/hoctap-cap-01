import { Request, Response } from 'express';
import PaymentService from '../services/PaymentService';

export async function getCustomerSubscriptions(req: Request, res: Response) {
  try {
    const { planId, status } = req.query;
    const rows = await PaymentService.getAdminSubscriptions(
      typeof planId === 'string' ? planId : undefined,
      typeof status === 'string' ? status : undefined
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Admin subscriptions error:', error);
    res.status(500).json({ error: 'Failed to load subscriptions' });
  }
}

export async function getPlanSummary(req: Request, res: Response) {
  try {
    const summary = await PaymentService.getPlanSummary();
    res.json({ success: true, data: summary });
  } catch (error) {
    console.error('Admin summary error:', error);
    res.status(500).json({ error: 'Failed to load plan summary' });
  }
}

export async function getPendingZaloJobs(req: Request, res: Response) {
  try {
    const limit = Math.min(Number(req.query.limit || 50), 200);
    const jobs = await PaymentService.getPendingNotificationJobs(limit);
    res.json({ success: true, data: jobs });
  } catch (error) {
    console.error('Admin pending jobs error:', error);
    res.status(500).json({ error: 'Failed to load pending jobs' });
  }
}

export async function markZaloJobSent(req: Request, res: Response) {
  try {
    const { jobId } = req.params;
    await PaymentService.markNotificationJobSent(jobId);
    res.json({ success: true, message: 'Marked as sent' });
  } catch (error) {
    console.error('Mark sent error:', error);
    res.status(500).json({ error: 'Failed to update notification job' });
  }
}

export async function markZaloJobFailed(req: Request, res: Response) {
  try {
    const { jobId } = req.params;
    const errorMessage = typeof req.body?.errorMessage === 'string' ? req.body.errorMessage : 'Unknown error';
    await PaymentService.markNotificationJobFailed(jobId, errorMessage);
    res.json({ success: true, message: 'Marked as failed' });
  } catch (error) {
    console.error('Mark failed error:', error);
    res.status(500).json({ error: 'Failed to update notification job' });
  }
}

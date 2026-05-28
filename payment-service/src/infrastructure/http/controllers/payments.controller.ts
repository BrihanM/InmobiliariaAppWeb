import { Request, Response } from 'express';
import { RegisterPaymentUseCase } from '../../../application/use-cases/register-payment.usecase';
import { GetHistoryUseCase } from '../../../application/use-cases/get-history.usecase';

export class PaymentsController {
  constructor(private registerUC: RegisterPaymentUseCase, private historyUC: GetHistoryUseCase) {}

  async register(req: Request, res: Response) {
    const dto = req.body;
    const result = await this.registerUC.execute(dto);
    return res.status(201).json(result);
  }

  /**
   * GET /payments/history
   * userId comes from the x-user-id header injected by the gateway.
   * Supports query params: status, page, limit.
   */
  async history(req: Request, res: Response) {
    const userId = String(req.headers['x-user-id'] || req.query.userId || '');
    const role   = String(req.headers['x-user-role'] || 'CLIENT');

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const filters = {
      status: req.query.status ? String(req.query.status) : undefined,
      page:   req.query.page   ? Number(req.query.page)   : 1,
      limit:  req.query.limit  ? Number(req.query.limit)  : 10,
    };

    const data = await this.historyUC.execute(userId, role, filters);
    return res.json(data);
  }
}

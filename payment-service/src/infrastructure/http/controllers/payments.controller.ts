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

  async history(req: Request, res: Response) {
    const userId = String(req.query.userId || req.body.userId);
    const data = await this.historyUC.execute(userId);
    return res.json(data);
  }
}

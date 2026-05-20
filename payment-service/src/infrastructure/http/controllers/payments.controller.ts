import { Request, Response } from 'express';
import { RegisterPaymentUseCase } from '../../../application/use-cases/register-payment.usecase';
import { GetHistoryUseCase } from '../../../application/use-cases/get-history.usecase';

/**
 * Controlador HTTP para operaciones de pagos.
 * Expone métodos que delegan en los casos de uso correspondientes.
 */
export class PaymentsController {
  constructor(private registerUC: RegisterPaymentUseCase, private historyUC: GetHistoryUseCase) {}

  /**
   * Registra un nuevo pago y devuelve el `clientSecret` de Stripe
   * junto con la entidad `payment` creada en la base de datos.
   */
  async register(req: Request, res: Response) {
    const dto = req.body;
    const result = await this.registerUC.execute(dto);
    return res.status(201).json(result);
  }

  /**
   * Devuelve el historial de transacciones (cambios de estado)
   * para los pagos asociados a un usuario.
   */
  async history(req: Request, res: Response) {
    const userId = String(req.query.userId || req.body.userId);
    const data = await this.historyUC.execute(userId);
    return res.json(data);
  }
}

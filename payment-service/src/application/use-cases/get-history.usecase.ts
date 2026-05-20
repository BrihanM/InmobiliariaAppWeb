import { PaymentRepository } from '../../domain/repositories/payment.repository.interface';

/**
 * Caso de uso: obtener historial de cambios de estado de pagos
 * para un usuario.
 */
export class GetHistoryUseCase {
  constructor(private repo: PaymentRepository) {}

  async execute(userId: string) {
    return this.repo.findHistoryByUser(userId);
  }
}

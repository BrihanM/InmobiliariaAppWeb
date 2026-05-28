import { PaymentRepository, PaymentFilters } from '../../domain/repositories/payment.repository.interface';

/**
 * Caso de uso: obtener pagos paginados de un usuario (o todos si es ADMIN).
 */
export class GetHistoryUseCase {
  constructor(private repo: PaymentRepository) {}

  async execute(userId: string, role: string, filters: PaymentFilters) {
    return this.repo.findPaginated(userId, role, filters);
  }
}

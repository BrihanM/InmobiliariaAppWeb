import { PaymentRepository } from '../../domain/repositories/payment.repository.interface';

export class GetHistoryUseCase {
  constructor(private repo: PaymentRepository) {}

  async execute(userId: string) {
    return this.repo.findHistoryByUser(userId);
  }
}

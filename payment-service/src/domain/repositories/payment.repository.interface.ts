import { Payment } from '../entities/payment.entity';

export interface PaymentRepository {
  create(payment: Partial<Payment>): Promise<Payment>;
  updateStatus(paymentId: string, newStatus: string, txRef?: string | null): Promise<void>;
  findById(id: string): Promise<Payment | null>;
  findHistoryByUser(userId: string): Promise<any[]>;
}

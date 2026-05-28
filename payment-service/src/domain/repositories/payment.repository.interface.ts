import { Payment } from '../entities/payment.entity';

export interface PaymentFilters {
  status?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedPayments {
  data: EnrichedPayment[];
  total: number;
  page: number;
  totalPages: number;
}

export interface EnrichedPayment {
  id: string;
  userId: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  propertyImage: string;
  amount: number;
  currency: string;
  status: string;
  stripePaymentIntentId: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRepository {
  create(payment: Partial<Payment>): Promise<Payment>;
  updateStatus(paymentId: string, newStatus: string, txRef?: string | null): Promise<void>;
  findById(id: string): Promise<Payment | null>;
  findHistoryByUser(userId: string): Promise<any[]>;
  findPaginated(userId: string, role: string, filters: PaymentFilters): Promise<PaginatedPayments>;
}

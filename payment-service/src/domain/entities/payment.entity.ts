export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  userId: string;
  propertyId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: PaymentStatus;
  transactionReference?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

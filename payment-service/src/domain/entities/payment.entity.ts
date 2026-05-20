/**
 * Estados soportados por un pago.
 */
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

/**
 * Entidad `Payment` representando el registro persistido de un intento
 * de cobro. `transactionReference` guarda identificadores externos
 * (p. ej. id de PaymentIntent/Charge de Stripe).
 */
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

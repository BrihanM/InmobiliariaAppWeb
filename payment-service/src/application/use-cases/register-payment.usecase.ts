import { PaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { CreatePaymentDTO } from '../dtos/create-payment.dto';
import Stripe from 'stripe';

/**
 * Caso de uso: registrar un pago.
 * - Persiste un registro de pago en estado `pending`.
 * - Crea un `PaymentIntent` en Stripe y devuelve el `clientSecret`
 *   necesario para completar el pago desde el cliente.
 */
export class RegisterPaymentUseCase {
  constructor(private repo: PaymentRepository, private stripe: Stripe) {}

  async execute(dto: CreatePaymentDTO) {
    // create DB payment (pending)
    const payment = await this.repo.create({
      ...dto,
      status: 'pending',
    });

    // create Stripe PaymentIntent
    const intent = await this.stripe.paymentIntents.create({
      amount: Math.round(dto.amount * 100),
      currency: dto.currency || 'USD',
      metadata: { paymentId: payment.id, userId: dto.userId },
    });

    return { payment, clientSecret: intent.client_secret };
  }
}

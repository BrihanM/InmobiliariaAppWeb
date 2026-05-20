import prisma from './client';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentRepository } from '../../domain/repositories/payment.repository.interface';

/**
 * Implementación de `PaymentRepository` usando Prisma.
 *
 * Nota: se usan casts mínimos (`as any`) para adaptar temporalmente
 * los tipos entre los modelos Prisma y los DTOs del dominio.
 */
export class PrismaPaymentRepository implements PaymentRepository {
  /**
   * Crea un registro de pago en estado `pending`.
   * Retorna la entidad `Payment` creada.
   */
  async create(payment: Partial<Payment>): Promise<Payment> {
    const created = await prisma.payment.create({ data: payment as any });
    return created as unknown as Payment;
  }

  /**
   * Actualiza el estado del pago dentro de una transacción y
   * registra el cambio en `paymentHistory` para trazabilidad.
   */
  async updateStatus(paymentId: string, newStatus: string, txRef?: string | null) {
    await prisma.$transaction(async (tx) => {
      const prev = await tx.payment.findUnique({ where: { id: paymentId } });
      await tx.payment.update({ where: { id: paymentId }, data: { status: newStatus as any, transactionReference: txRef } });
      await tx.paymentHistory.create({ data: { paymentId, previousStatus: prev?.status as any, newStatus: newStatus as any } });
    });
  }

  /**
   * Busca un pago por su identificador.
   */
  async findById(id: string) {
    return prisma.payment.findUnique({ where: { id } }) as unknown as Payment | null;
  }

  /**
   * Recupera el historial de cambios de estado para todos los pagos
   * asociados a un usuario, ordenado por fecha (más reciente primero).
   */
  async findHistoryByUser(userId: string) {
    const payments = await prisma.payment.findMany({ where: { userId } });
    const ids = payments.map((p) => p.id);
    return prisma.paymentHistory.findMany({ where: { paymentId: { in: ids } }, orderBy: { changedAt: 'desc' } });
  }
}

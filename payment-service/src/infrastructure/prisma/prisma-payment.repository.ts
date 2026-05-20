import prisma from './client';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentRepository } from '../../domain/repositories/payment.repository.interface';

export class PrismaPaymentRepository implements PaymentRepository {
  async create(payment: Partial<Payment>): Promise<Payment> {
    const created = await prisma.payment.create({ data: payment as any });
    return created as unknown as Payment;
  }

  async updateStatus(paymentId: string, newStatus: string, txRef?: string | null) {
    await prisma.$transaction(async (tx) => {
      const prev = await tx.payment.findUnique({ where: { id: paymentId } });
      await tx.payment.update({ where: { id: paymentId }, data: { status: newStatus as any, transactionReference: txRef } });
      await tx.paymentHistory.create({ data: { paymentId, previousStatus: prev?.status as any, newStatus: newStatus as any } });
    });
  }

  async findById(id: string) {
    return prisma.payment.findUnique({ where: { id } }) as unknown as Payment | null;
  }

  async findHistoryByUser(userId: string) {
    // get payment histories for user's payments
    const payments = await prisma.payment.findMany({ where: { userId } });
    const ids = payments.map((p) => p.id);
    return prisma.paymentHistory.findMany({ where: { paymentId: { in: ids } }, orderBy: { changedAt: 'desc' } });
  }
}

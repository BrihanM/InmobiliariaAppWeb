import prisma from './client';
import { Payment } from '../../domain/entities/payment.entity';
import {
  PaymentRepository,
  PaymentFilters,
  PaginatedPayments,
  EnrichedPayment,
} from '../../domain/repositories/payment.repository.interface';

// Map backend status values to frontend-friendly values
function mapStatus(status: string): string {
  if (status === 'paid') return 'completed';
  return status; // pending, failed, refunded pass through
}

/**
 * Implementación de `PaymentRepository` usando Prisma.
 */
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
    const payments = await prisma.payment.findMany({ where: { userId } });
    const ids = payments.map((p) => p.id);
    return prisma.paymentHistory.findMany({ where: { paymentId: { in: ids } }, orderBy: { changedAt: 'desc' } });
  }

  /**
   * Returns paginated payments enriched with property data via raw SQL.
   * ADMIN sees all payments; CLIENT sees only their own.
   */
  async findPaginated(userId: string, role: string, filters: PaymentFilters): Promise<PaginatedPayments> {
    const page  = Math.max(1, filters.page  ?? 1);
    const limit = Math.max(1, filters.limit ?? 10);
    const offset = (page - 1) * limit;

    // Build WHERE clause
    const conditions: string[] = [];
    const params: unknown[]    = [];

    if (role !== 'ADMIN') {
      params.push(userId);
      conditions.push(`p."userId" = $${params.length}`);
    }

    // Map incoming frontend status back to DB status
    if (filters.status) {
      const dbStatus = filters.status === 'completed' ? 'paid' : filters.status;
      params.push(dbStatus);
      conditions.push(`p.status::text = $${params.length}`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count query
    const countResult = await prisma.$queryRawUnsafe<[{ count: bigint }]>(
      `SELECT COUNT(*) AS count FROM "Payment" p ${where}`,
      ...params,
    );
    const total = Number(countResult[0]?.count ?? 0);

    // Data query — left-join properties + addresses for enrichment
    params.push(limit, offset);
    const rows = await prisma.$queryRawUnsafe<any[]>(
      `SELECT
         p.id,
         p."userId",
         p."propertyId",
         COALESCE(prop.title, 'Propiedad') AS "propertyTitle",
         COALESCE(
           CONCAT(addr.street, ', ', addr.city),
           'Sin dirección'
         ) AS "propertyAddress",
         COALESCE(img.image_url, '') AS "propertyImage",
         p.amount,
         p.currency,
         p.status::text AS status,
         p."transactionReference" AS "stripePaymentIntentId",
         p."paymentMethod" AS description,
         p."createdAt",
         p."updatedAt"
       FROM "Payment" p
       LEFT JOIN properties prop ON prop.id::text = p."propertyId"
       LEFT JOIN addresses addr ON addr.id = prop.address_id
       LEFT JOIN LATERAL (
         SELECT image_url FROM property_images
         WHERE property_id = prop.id AND is_primary = true
         LIMIT 1
       ) img ON true
       ${where}
       ORDER BY p."createdAt" DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      ...params,
    );

    const data: EnrichedPayment[] = rows.map((r) => ({
      id:                   r.id,
      userId:               r.userId,
      propertyId:           r.propertyId,
      propertyTitle:        r.propertyTitle,
      propertyAddress:      r.propertyAddress,
      propertyImage:        r.propertyImage,
      amount:               Number(r.amount),
      currency:             r.currency,
      status:               mapStatus(r.status),
      stripePaymentIntentId: r.stripePaymentIntentId ?? null,
      description:          r.description ?? null,
      createdAt:            r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
      updatedAt:            r.updatedAt instanceof Date ? r.updatedAt.toISOString() : String(r.updatedAt),
    }));

    return {
      data,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }
}

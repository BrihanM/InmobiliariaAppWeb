/**
 * Payment-service seed
 *
 * Creates simulated payments for 3 CLIENT users, referencing real property IDs
 * from the property-service table (same shared DB).
 * Safe to re-run (uses upsert-like logic via deleteMany + createMany).
 */
import { PrismaClient, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Must match auth-service seed IDs
const CLIENT_1 = '33333333-3333-3333-3333-333333333333'; // María Gómez
const CLIENT_2 = '33333333-3333-3333-3333-333333333334'; // Juan Pérez
const CLIENT_3 = '33333333-3333-3333-3333-333333333335'; // Laura Torres

type SeedPayment = {
  id: string;
  userId: string;
  propertyId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: PaymentStatus;
  transactionReference: string | null;
  createdAt: Date;
};

async function main() {
  // ── Fetch real property IDs from the shared DB ─────────────────────────────
  const properties = await prisma.$queryRaw<{ id: string; price: number }[]>`
    SELECT id, price FROM properties ORDER BY created_at ASC LIMIT 20
  `;

  if (properties.length < 6) {
    console.error('❌ Not enough properties in DB. Run property-service seed first.');
    process.exit(1);
  }

  // Assign convenient aliases — pick specific ones by index
  const [p0, p1, p2, p3, p4, p5, p6, p7] = properties;

  // Helper to build a past date
  const daysAgo = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
  };

  const payments: SeedPayment[] = [
    // ── María Gómez (CLIENT_1) — 5 pagos ─────────────────────────────────────
    {
      id:                   'pay-0001-0000-0000-0000-000000000001',
      userId:               CLIENT_1,
      propertyId:           p0.id,
      amount:               950_000_000,
      currency:             'COP',
      paymentMethod:        'Tarjeta de crédito',
      status:               'paid' as PaymentStatus,
      transactionReference: 'pi_test_MG001_success',
      createdAt:            daysAgo(60),
    },
    {
      id:                   'pay-0001-0000-0000-0000-000000000002',
      userId:               CLIENT_1,
      propertyId:           p2.id,
      amount:               1_850_000_000,
      currency:             'COP',
      paymentMethod:        'Transferencia bancaria',
      status:               'pending' as PaymentStatus,
      transactionReference: null,
      createdAt:            daysAgo(14),
    },
    {
      id:                   'pay-0001-0000-0000-0000-000000000003',
      userId:               CLIENT_1,
      propertyId:           p4.id,
      amount:               2_100_000,
      currency:             'COP',
      paymentMethod:        'Tarjeta débito',
      status:               'paid' as PaymentStatus,
      transactionReference: 'pi_test_MG003_success',
      createdAt:            daysAgo(45),
    },
    {
      id:                   'pay-0001-0000-0000-0000-000000000004',
      userId:               CLIENT_1,
      propertyId:           p5.id,
      amount:               1_200_000_000,
      currency:             'COP',
      paymentMethod:        'Tarjeta de crédito',
      status:               'failed' as PaymentStatus,
      transactionReference: 'pi_test_MG004_failed',
      createdAt:            daysAgo(30),
    },
    {
      id:                   'pay-0001-0000-0000-0000-000000000005',
      userId:               CLIENT_1,
      propertyId:           p1.id,
      amount:               480_000_000,
      currency:             'COP',
      paymentMethod:        'Tarjeta de crédito',
      status:               'refunded' as PaymentStatus,
      transactionReference: 'pi_test_MG005_refund',
      createdAt:            daysAgo(90),
    },

    // ── Juan Pérez (CLIENT_2) — 4 pagos ──────────────────────────────────────
    {
      id:                   'pay-0002-0000-0000-0000-000000000001',
      userId:               CLIENT_2,
      propertyId:           p3.id,
      amount:               8_500_000,
      currency:             'COP',
      paymentMethod:        'Tarjeta débito',
      status:               'paid' as PaymentStatus,
      transactionReference: 'pi_test_JP001_success',
      createdAt:            daysAgo(20),
    },
    {
      id:                   'pay-0002-0000-0000-0000-000000000002',
      userId:               CLIENT_2,
      propertyId:           p6.id,
      amount:               620_000_000,
      currency:             'COP',
      paymentMethod:        'Transferencia bancaria',
      status:               'paid' as PaymentStatus,
      transactionReference: 'pi_test_JP002_success',
      createdAt:            daysAgo(7),
    },
    {
      id:                   'pay-0002-0000-0000-0000-000000000003',
      userId:               CLIENT_2,
      propertyId:           p0.id,
      amount:               950_000_000,
      currency:             'COP',
      paymentMethod:        'Tarjeta de crédito',
      status:               'pending' as PaymentStatus,
      transactionReference: null,
      createdAt:            daysAgo(2),
    },
    {
      id:                   'pay-0002-0000-0000-0000-000000000004',
      userId:               CLIENT_2,
      propertyId:           p7.id,
      amount:               540_000_000,
      currency:             'COP',
      paymentMethod:        'Tarjeta de crédito',
      status:               'failed' as PaymentStatus,
      transactionReference: 'pi_test_JP004_failed',
      createdAt:            daysAgo(50),
    },

    // ── Laura Torres (CLIENT_3) — 3 pagos ─────────────────────────────────────
    {
      id:                   'pay-0003-0000-0000-0000-000000000001',
      userId:               CLIENT_3,
      propertyId:           p1.id,
      amount:               480_000_000,
      currency:             'COP',
      paymentMethod:        'Tarjeta de crédito',
      status:               'paid' as PaymentStatus,
      transactionReference: 'pi_test_LT001_success',
      createdAt:            daysAgo(10),
    },
    {
      id:                   'pay-0003-0000-0000-0000-000000000002',
      userId:               CLIENT_3,
      propertyId:           p5.id,
      amount:               1_200_000_000,
      currency:             'COP',
      paymentMethod:        'Transferencia bancaria',
      status:               'paid' as PaymentStatus,
      transactionReference: 'pi_test_LT002_success',
      createdAt:            daysAgo(35),
    },
    {
      id:                   'pay-0003-0000-0000-0000-000000000003',
      userId:               CLIENT_3,
      propertyId:           p3.id,
      amount:               8_500_000,
      currency:             'COP',
      paymentMethod:        'Tarjeta débito',
      status:               'refunded' as PaymentStatus,
      transactionReference: 'pi_test_LT003_refund',
      createdAt:            daysAgo(75),
    },
  ];

  // Idempotent: delete existing seed payments, then re-create
  const seedIds = payments.map((p) => p.id);
  await prisma.paymentHistory.deleteMany({ where: { paymentId: { in: seedIds } } });
  await prisma.transaction.deleteMany({ where: { paymentId: { in: seedIds } } });
  await prisma.payment.deleteMany({ where: { id: { in: seedIds } } });

  for (const p of payments) {
    await prisma.payment.create({ data: p });

    // Create a PaymentHistory entry to reflect final status
    if (p.status !== 'pending') {
      await prisma.paymentHistory.create({
        data: {
          paymentId:      p.id,
          previousStatus: 'pending',
          newStatus:       p.status,
          changedAt:       p.createdAt,
        },
      });
    }
  }

  console.log(`✅ ${payments.length} pagos simulados creados`);
  console.log(`   María Gómez   (CLIENT_1): 5 pagos`);
  console.log(`   Juan Pérez    (CLIENT_2): 4 pagos`);
  console.log(`   Laura Torres  (CLIENT_3): 3 pagos`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());


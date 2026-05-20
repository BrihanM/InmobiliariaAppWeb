import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
  const types = ["House", "Apartment", "Land"].map((n) => ({ id: randomUUID(), name: n }));
  const txns = ["Sale", "Rent"].map((n) => ({ id: randomUUID(), name: n }));
  const statuses = ["AVAILABLE", "UNAVAILABLE"].map((n) => ({ id: randomUUID(), name: n }));

  for (const t of types) await prisma.property_types.upsert({ where: { name: t.name }, update: {}, create: t });
  for (const t of txns) await prisma.transaction_types.upsert({ where: { name: t.name }, update: {}, create: t });
  for (const s of statuses) await prisma.property_status.upsert({ where: { name: s.name }, update: {}, create: s });

  console.log("Seed complete");
}

main().catch(console.error).finally(async () => await prisma.$disconnect());

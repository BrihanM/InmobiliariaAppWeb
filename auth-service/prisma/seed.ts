import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
  const roles = [
    { id: randomUUID(), name: "ADMIN", description: "Administrator" },
    { id: randomUUID(), name: "AGENT", description: "Agent" },
    { id: randomUUID(), name: "CLIENT", description: "Client" }
  ];

  for (const r of roles) {
    await prisma.roles.upsert({ where: { name: r.name }, update: {}, create: r });
  }

  console.log("Seed complete");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

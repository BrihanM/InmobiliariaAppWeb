import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Fixed IDs so re-runs are idempotent
const ADMIN_ID  = "11111111-1111-1111-1111-111111111111";
const AGENT_ID  = "22222222-2222-2222-2222-222222222222";
const CLIENT_ID = "33333333-3333-3333-3333-333333333333";

const ROLE_IDS = {
  ADMIN:  "44444444-4444-4444-4444-444444444444",
  AGENT:  "55555555-5555-5555-5555-555555555555",
  CLIENT: "66666666-6666-6666-6666-666666666666",
};

async function main() {
  // ── 1. Roles ──────────────────────────────────────────────
  const roles = [
    { id: ROLE_IDS.ADMIN,  name: "ADMIN",  description: "Administrador del sistema" },
    { id: ROLE_IDS.AGENT,  name: "AGENT",  description: "Agente inmobiliario" },
    { id: ROLE_IDS.CLIENT, name: "CLIENT", description: "Cliente comprador/arrendatario" },
  ];

  for (const role of roles) {
    await prisma.roles.upsert({ where: { name: role.name }, update: {}, create: role });
  }
  console.log("✅ Roles creados");

  // ── 2. Usuarios ───────────────────────────────────────────
  const SALT = 10;
  const users = [
    {
      id: ADMIN_ID,
      first_name: "Admin",
      last_name: "Sistema",
      email: "admin@inmobiliaria.co",
      password: "Admin123!",
      roleId: ROLE_IDS.ADMIN,
    },
    {
      id: AGENT_ID,
      first_name: "Carlos",
      last_name: "Ramírez",
      email: "agente@inmobiliaria.co",
      password: "Agente123!",
      roleId: ROLE_IDS.AGENT,
    },
    {
      id: CLIENT_ID,
      first_name: "María",
      last_name: "Gómez",
      email: "cliente@inmobiliaria.co",
      password: "Cliente123!",
      roleId: ROLE_IDS.CLIENT,
    },
  ];

  for (const u of users) {
    const password_hash = await bcrypt.hash(u.password, SALT);
    const user = await prisma.users.upsert({
      where: { email: u.email },
      update: {},
      create: {
        id: u.id,
        first_name: u.first_name,
        last_name: u.last_name,
        email: u.email,
        password_hash,
        status: "active",
      },
    });

    await prisma.user_roles.upsert({
      where: { user_id_role_id: { user_id: user.id, role_id: u.roleId } },
      update: {},
      create: { user_id: user.id, role_id: u.roleId },
    });
  }

  console.log("✅ Usuarios creados:");
  console.log("   admin@inmobiliaria.co    → Admin123!   (ADMIN)");
  console.log("   agente@inmobiliaria.co   → Agente123!  (AGENT)");
  console.log("   cliente@inmobiliaria.co  → Cliente123! (CLIENT)");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());


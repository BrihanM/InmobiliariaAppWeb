import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ADMIN_ID    = '11111111-1111-1111-1111-111111111111';
const AGENT_ID    = '22222222-2222-2222-2222-222222222222';
const AGENT_2_ID  = '22222222-2222-2222-2222-222222222223';
const CLIENT_ID   = '33333333-3333-3333-3333-333333333333';
const CLIENT_2_ID = '33333333-3333-3333-3333-333333333334';
const CLIENT_3_ID = '33333333-3333-3333-3333-333333333335';

const ROLE_IDS = {
  ADMIN:  '44444444-4444-4444-4444-444444444444',
  AGENT:  '55555555-5555-5555-5555-555555555555',
  CLIENT: '66666666-6666-6666-6666-666666666666',
};

async function main() {
  // Roles
  const roles = [
    { id: ROLE_IDS.ADMIN,  name: 'ADMIN',  description: 'Administrador del sistema' },
    { id: ROLE_IDS.AGENT,  name: 'AGENT',  description: 'Agente inmobiliario' },
    { id: ROLE_IDS.CLIENT, name: 'CLIENT', description: 'Cliente comprador/arrendatario' },
  ];
  for (const r of roles) {
    await prisma.role.upsert({ where: { name: r.name }, update: {}, create: r });
  }

  const SALT = 10;
  const users = [
    { id: ADMIN_ID,    firstName: 'Admin',   lastName: 'Sistema',  email: 'admin@inmobiliaria.co',   password: 'Admin123!',   roleId: ROLE_IDS.ADMIN  },
    { id: AGENT_ID,    firstName: 'Carlos',  lastName: 'Ramírez',  email: 'agente@inmobiliaria.co',  password: 'Agente123!',  roleId: ROLE_IDS.AGENT  },
    { id: AGENT_2_ID,  firstName: 'Sandra',  lastName: 'López',    email: 'sandra@inmobiliaria.co',  password: 'Sandra123!',  roleId: ROLE_IDS.AGENT  },
    { id: CLIENT_ID,   firstName: 'María',   lastName: 'Gómez',    email: 'cliente@inmobiliaria.co', password: 'Cliente123!', roleId: ROLE_IDS.CLIENT },
    { id: CLIENT_2_ID, firstName: 'Juan',    lastName: 'Pérez',    email: 'juan@inmobiliaria.co',    password: 'Juan123!',    roleId: ROLE_IDS.CLIENT },
    { id: CLIENT_3_ID, firstName: 'Laura',   lastName: 'Torres',   email: 'laura@inmobiliaria.co',   password: 'Laura123!',   roleId: ROLE_IDS.CLIENT },
  ];

  for (const u of users) {
    const password_hash = await bcrypt.hash(u.password, SALT);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        id:        u.id,
        firstName: u.firstName,
        lastName:  u.lastName,
        email:     u.email,
        password:  password_hash,
        status:    'active',
      },
    });
    await prisma.userRole.upsert({
      where:  { userId_roleId: { userId: user.id, roleId: u.roleId } },
      update: {},
      create: { userId: user.id, roleId: u.roleId },
    });
  }

  console.log('✅ user-service seed finished');
  console.log('   6 users created: 1 admin, 2 agents, 3 clients');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());


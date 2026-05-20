import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(){
  const roles = ['ADMIN','USER','AGENT'];
  for(const r of roles){
    await prisma.role.upsert({ where: { name: r }, update: {}, create: { name: r } });
  }
  console.log('Seed finished');
}

main().catch(e=>{ console.error(e); process.exit(1); }).finally(()=>prisma.$disconnect());

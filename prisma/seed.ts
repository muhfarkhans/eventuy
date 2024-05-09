// run "npx prisma db seed" to running the seeder
import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await argon.hash('password');
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@admin.admin' },
    update: {},
    create: {
      name: 'admin',
      email: 'admin@admin.admin',
      password: passwordHash,
    },
  });

  console.log({ admin });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

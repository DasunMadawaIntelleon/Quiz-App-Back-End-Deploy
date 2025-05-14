import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import logger from '../../utils/logger';

const prisma = new PrismaClient();

async function main() {
  const adminUsername = process.env.ADMIN_USERNAME || 'antonranaveera';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin1234';

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { user_name: adminUsername },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        user_name: adminUsername,
        name: "Admin User",
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    logger.info(`Superuser created with username: ${adminUsername}`);
  } else {
    logger.info(`Superuser already exists: ${adminUsername}`);
  }
}

main()
  .catch((error) => {
    logger.error(`Error seeding superuser`, { error });
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

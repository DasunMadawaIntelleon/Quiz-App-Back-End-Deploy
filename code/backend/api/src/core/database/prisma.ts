import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

export const createPrismaClient = () => {
  const prisma = new PrismaClient();

  process.on('SIGINT', async () => {
    logger.info(`Disconnecting Prisma...`);
    await prisma.$disconnect();
    process.exit(0);
  });

  return prisma;
};
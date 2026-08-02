import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as { prisma4: PrismaClient | undefined; pool: Pool | undefined };

const pool = globalForPrisma.pool || new Pool({ connectionString: process.env.DATABASE_URL });

// Increase max listeners to prevent warning when creating many connections in dev
pool.setMaxListeners(20);

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma4 ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma4 = prisma;
  globalForPrisma.pool = pool;
}

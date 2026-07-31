import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined; pool: Pool | undefined };

const pool = globalForPrisma.pool || new Pool({ connectionString: process.env.DATABASE_URL });

// Increase max listeners to prevent warning when multiple queries run in parallel
pool.setMaxListeners(30);

if (process.env.NODE_ENV !== 'production') globalForPrisma.pool = pool;

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

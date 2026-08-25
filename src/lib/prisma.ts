import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined; pool: Pool | undefined };

const pool = globalForPrisma.pool || new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 1, // Mencegah batas koneksi Supabase (connection_limit=1) terlampaui
  idleTimeoutMillis: 5000, // Menutup koneksi idle sebelum diputus paksa oleh Supabase
  connectionTimeoutMillis: 10000
});

pool.setMaxListeners(20);

// Menangkap error putus koneksi idle agar server tidak crash
if (!globalForPrisma.pool) {
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });
}

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter, log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'] });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

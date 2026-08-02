const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to database...');
  try {
    const start = Date.now();
    const infrastruktur = await prisma.infrastruktur.findMany({ take: 1 });
    console.log('Connected! Query took:', Date.now() - start, 'ms');
    console.log('Result:', infrastruktur);
  } catch (e) {
    console.error('Error connecting to DB:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();

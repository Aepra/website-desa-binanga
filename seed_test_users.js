require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash('adminpassword123', 10);
  const wargaPassword = await bcrypt.hash('wargapassword123', 10);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      password: adminPassword,
      role: 'ADMIN',
      name: 'Bapak Operator Desa'
    },
    create: {
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
      name: 'Bapak Operator Desa'
    }
  });

  const warga = await prisma.user.upsert({
    where: { username: 'warga' },
    update: {
      password: wargaPassword,
      role: 'USER',
      name: 'Sudirman (Warga Desa)'
    },
    create: {
      username: 'warga',
      password: wargaPassword,
      role: 'USER',
      name: 'Sudirman (Warga Desa)'
    }
  });

  // Seed sample Layanan & Pesan for Warga & Admin
  let layanan = await prisma.layanan.findFirst({
    where: { perihal: 'Surat Keterangan Tidak Mampu (SKTM)' }
  });

  if (!layanan) {
    layanan = await prisma.layanan.create({
      data: {
        userEmail: 'warga@binanga.web.id',
        namaPemohon: 'Sudirman',
        perihal: 'Surat Keterangan Tidak Mampu (SKTM)',
        judul: 'Permohonan SKTM untuk Beasiswa Kuliah Anak',
        deskripsi: 'Mohon dapat diterbitkan SKTM untuk melengkapi berkas pendaftaran beasiswa KIP Kuliah anak saya.',
        status: 'MENUNGGU'
      }
    });
  }

  console.log('SUCCESS: Test accounts & data seeded successfully!');
  console.log('ADMIN -> Username:', admin.username, '| Password: adminpassword123');
  console.log('WARGA -> Username:', warga.username, '| Password: wargapassword123');
}

main()
  .catch(e => console.error('Error seeding test accounts:', e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

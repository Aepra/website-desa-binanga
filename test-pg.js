const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  try {
    console.log('Connecting to DB...', process.env.DATABASE_URL);
    const res = await pool.query('SELECT NOW()');
    console.log('DB Time:', res.rows[0]);
  } catch(e) {
    console.error('DB Error:', e);
  } finally {
    await pool.end();
  }
}
main();

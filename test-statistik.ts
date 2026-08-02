import { getStatistikByTahun } from './src/server/actions/statistik.action';

async function main() {
  console.log('Testing getStatistikByTahun(2026)...');
  const start = Date.now();
  try {
    const res = await getStatistikByTahun(2026);
    console.log('Success! Took:', Date.now() - start, 'ms');
    console.log('Global Stats:', res.globalStats);
  } catch (e) {
    console.error('Error:', e);
  }
}
main();

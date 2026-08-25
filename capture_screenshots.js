const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'https://binanga.web.id';
const SS_DIR = path.resolve(__dirname, 'bukuPanduan', 'screenshots');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1400,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  // 1. Login page (initial - Google button)
  console.log('1. Opening login page...');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(SS_DIR, 'ss_login_page.png'), fullPage: false });
  console.log('   -> ss_login_page.png saved');

  // 2. Click "Login Admin via Username & Password" toggle to reveal admin form
  console.log('2. Clicking admin login toggle...');
  const toggleButtons = await page.$$('button');
  for (const btn of toggleButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Login Admin via Username')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 800));
      break;
    }
  }

  // Screenshot with admin form visible
  await page.screenshot({ path: path.join(SS_DIR, 'ss_login_admin_form.png'), fullPage: false });
  console.log('   -> ss_login_admin_form.png saved');

  // 3. Login as Admin
  console.log('3. Logging in as ADMIN...');
  const usernameInput = await page.$('input[name="username"]');
  const passwordInput = await page.$('input[name="password"]');
  if (usernameInput && passwordInput) {
    await usernameInput.click({ clickCount: 3 });
    await usernameInput.type('admin');
    await passwordInput.click({ clickCount: 3 });
    await passwordInput.type('adminpassword123');
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) await submitBtn.click();
    await new Promise(r => setTimeout(r, 5000));
  } else {
    console.log('   ERROR: Could not find username/password fields!');
  }

  // Take screenshot of wherever we ended up
  await page.screenshot({ path: path.join(SS_DIR, 'ss_after_admin_login.png'), fullPage: false });
  console.log('   Current URL:', page.url());
  console.log('   -> ss_after_admin_login.png saved');

  // 4. Admin Dashboard
  console.log('4. Admin Dashboard...');
  await page.goto(`${BASE_URL}/admin/dashboard`, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(SS_DIR, 'ss_admin_dashboard.png'), fullPage: false });
  console.log('   URL:', page.url());
  console.log('   -> ss_admin_dashboard.png saved');

  // 5. Admin Layanan (Surat Masuk)
  console.log('5. Admin Layanan...');
  await page.goto(`${BASE_URL}/admin/layanan`, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(SS_DIR, 'ss_admin_layanan.png'), fullPage: false });
  console.log('   URL:', page.url());
  console.log('   -> ss_admin_layanan.png saved');

  // 6. Admin Penduduk
  console.log('6. Admin Penduduk...');
  await page.goto(`${BASE_URL}/admin/penduduk`, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(SS_DIR, 'ss_admin_penduduk.png'), fullPage: false });
  console.log('   URL:', page.url());
  console.log('   -> ss_admin_penduduk.png saved');

  // 7. Admin Berita
  console.log('7. Admin Berita...');
  await page.goto(`${BASE_URL}/admin/berita`, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(SS_DIR, 'ss_admin_berita.png'), fullPage: false });
  console.log('   URL:', page.url());
  console.log('   -> ss_admin_berita.png saved');

  // 8. Admin Pengaturan
  console.log('8. Admin Pengaturan...');
  await page.goto(`${BASE_URL}/admin/pengaturan`, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(SS_DIR, 'ss_admin_pengaturan.png'), fullPage: false });
  console.log('   URL:', page.url());
  console.log('   -> ss_admin_pengaturan.png saved');

  // 9. Logout & login as Warga
  console.log('9. Logging out and logging in as WARGA...');
  const cookies = await page.cookies();
  await page.deleteCookie(...cookies);
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  // Click toggle again
  const toggleButtons2 = await page.$$('button');
  for (const btn of toggleButtons2) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Login Admin via Username')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 800));
      break;
    }
  }

  const usernameInput2 = await page.$('input[name="username"]');
  const passwordInput2 = await page.$('input[name="password"]');
  if (usernameInput2 && passwordInput2) {
    await usernameInput2.click({ clickCount: 3 });
    await usernameInput2.type('warga');
    await passwordInput2.click({ clickCount: 3 });
    await passwordInput2.type('wargapassword123');
    const submitBtn2 = await page.$('button[type="submit"]');
    if (submitBtn2) await submitBtn2.click();
    await new Promise(r => setTimeout(r, 5000));
  }

  // 10. User Dashboard
  console.log('10. User Dashboard...');
  await page.goto(`${BASE_URL}/user-dashboard`, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(SS_DIR, 'ss_user_dashboard.png'), fullPage: false });
  console.log('   URL:', page.url());
  console.log('   -> ss_user_dashboard.png saved');

  console.log('\nDONE! All key screenshots captured.');
  await browser.close();
})();

const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const htmlPath = path.resolve(__dirname, 'modul_panduan.html');
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0', timeout: 60000 });
  
  // Wait for fonts to load
  await new Promise(r => setTimeout(r, 3000));
  
  const outputPath = path.resolve(__dirname, 'bukuPanduan', 'Buku_Panduan_Website_Desa_Binanga.pdf');
  
  await page.pdf({
    path: outputPath,
    width: '148mm',
    height: '210mm',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true
  });
  
  console.log('PDF berhasil dibuat: ' + outputPath);
  await browser.close();
})();

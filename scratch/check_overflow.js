const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const htmlPath = path.resolve(__dirname, '..', 'modul_panduan.html');
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
  
  await new Promise(r => setTimeout(r, 2000));
  
  const pageOverflows = await page.evaluate(() => {
    const pages = Array.from(document.querySelectorAll('.page, .page-cover'));
    return pages.map((p, index) => {
      // Temporarily remove overflow hidden to measure actual content height
      const oldOverflow = p.style.overflow;
      p.style.overflow = 'visible';
      
      const scrollHeight = p.scrollHeight;
      const clientHeight = p.clientHeight || 793; // 210mm in px at 96dpi is ~793px
      
      // Get all child elements and check if any element extends past bottom padding
      const children = Array.from(p.children).filter(c => !c.classList.contains('footer-page-num') && !c.classList.contains('footer-doc-title') && !c.classList.contains('header-logos'));
      let maxBottom = 0;
      let lastElementText = '';
      
      children.forEach(c => {
        const rect = c.getBoundingClientRect();
        const pRect = p.getBoundingClientRect();
        const relativeBottom = rect.bottom - pRect.top;
        if (relativeBottom > maxBottom) {
          maxBottom = relativeBottom;
          lastElementText = c.innerText ? c.innerText.substring(0, 50).replace(/\n/g, ' ') : c.tagName;
        }
      });
      
      p.style.overflow = oldOverflow;
      
      // Total available height inside page padding (210mm - 18mm bottom padding = ~725px)
      const isOverflowing = scrollHeight > clientHeight + 2 || maxBottom > (clientHeight - 55); // 55px safety margin for footer
      
      const pageNumEl = p.querySelector('.footer-page-num');
      const pageNumStr = pageNumEl ? pageNumEl.innerText : `Page ${index + 1}`;
      
      return {
        pageIndex: index + 1,
        pageLabel: pageNumStr,
        clientHeight,
        scrollHeight,
        maxBottom: Math.round(maxBottom),
        allowedMaxBottom: clientHeight - 55,
        isOverflowing,
        lastElementText
      };
    });
  });
  
  console.log('=== PAGE OVERFLOW REPORT ===');
  let overflowCount = 0;
  pageOverflows.forEach(po => {
    if (po.isOverflowing) {
      overflowCount++;
      console.log(`❌ Page ${po.pageIndex} (${po.pageLabel}): OVERFLOWING! Max bottom element: ${po.maxBottom}px (Allowed: ${po.allowedMaxBottom}px). Last element: "${po.lastElementText}"`);
    } else {
      console.log(`OK Page ${po.pageIndex} (${po.pageLabel}): Fits cleanly (${po.maxBottom}px / ${po.allowedMaxBottom}px)`);
    }
  });
  
  console.log(`\nSummary: ${overflowCount} out of ${pageOverflows.length} pages are overflowing/clipped.`);
  
  await browser.close();
})();

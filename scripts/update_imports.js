const fs = require('fs');
const path = require('path');

const modules = ['apbdes', 'bansos', 'berita', 'infrastruktur', 'login', 'penduduk', 'pengaturan', 'sejarah', 'statistik', 'struktur', 'umkm', 'wisata'];

modules.forEach(mod => {
  const dir = path.join('src/app/admin', mod);
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      if(file.endsWith('.tsx') || file.endsWith('.ts')) {
        const fp = path.join(dir, file);
        let content = fs.readFileSync(fp, 'utf8');
        content = content.replace(/from\s+['\"](?:\.\/|\.\.\/)*actions['\"]/g, `from '@/server/actions/${mod}.action'`);
        fs.writeFileSync(fp, content);
        console.log('Updated ' + fp);
      }
    });
  }
});

const fs = require('fs');

function replaceInFile(fp, searchValue, replaceValue) {
  let content = fs.readFileSync(fp, 'utf8');
  content = content.replace(searchValue, replaceValue);
  fs.writeFileSync(fp, content);
  console.log('Fixed ' + fp);
}

replaceInFile('src/app/admin/bansos/page.tsx', "import styles from '../Admin.module.css';", "");
replaceInFile('src/app/admin/penduduk/page.tsx', "import styles from '../Admin.module.css';", "");

replaceInFile('src/app/admin/apbdes/[id]/page.tsx', "from '../actions'", "from '@/server/actions/apbdes.action'");

replaceInFile('src/app/home/page.tsx', "from '@/app/admin/pengaturan/actions'", "from '@/server/actions/pengaturan.action'");
replaceInFile('src/app/home/page.tsx', "from '@/app/admin/struktur/actions'", "from '@/server/actions/struktur.action'");

replaceInFile('src/app/profil-desa/ProfilDesaClient.tsx', "from '@/app/admin/pengaturan/actions'", "from '@/server/actions/pengaturan.action'");
replaceInFile('src/app/profil-desa/ProfilDesaClient.tsx', "from '@/app/admin/struktur/actions'", "from '@/server/actions/struktur.action'");

replaceInFile('src/app/data-statistik/page.tsx', "from '@/app/admin/statistik/actions'", "from '@/server/actions/statistik.action'");

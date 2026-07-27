const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next')) {
        results = results.concat(walk(file));
      }
    } else {
      if(file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src');
files.forEach(fp => {
  let content = fs.readFileSync(fp, 'utf8');
  if (content.includes('@/lib/data-actions')) {
    content = content.replace(/@\/lib\/data-actions/g, '@/server/queries/public.query');
    fs.writeFileSync(fp, content);
    console.log('Updated ' + fp);
  }
});

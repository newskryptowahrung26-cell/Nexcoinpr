const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.resolve(dir, file);
    if (file === 'node_modules' || file === '.git') return;
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
};

const htmlFiles = walk(__dirname + '/..');
let updatedCount = 0;
htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  if (content.includes('/assets/css/main.css')) {
    content = content.replace(/\/assets\/css\/main\.css(\?v=[^"']*)?/g, '/assets/css/main.css?v=4.0');
    changed = true;
  }
  if (content.includes('/assets/css/components.css')) {
    content = content.replace(/\/assets\/css\/components\.css(\?v=[^"']*)?/g, '/assets/css/components.css?v=4.0');
    changed = true;
  }
  if (content.includes('/assets/css/pages.css')) {
    content = content.replace(/\/assets\/css\/pages\.css(\?v=[^"']*)?/g, '/assets/css/pages.css?v=4.0');
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    updatedCount++;
  }
});
console.log('Updated cache busters in', updatedCount, 'HTML files');

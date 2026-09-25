const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function getAllHtml(dir) {
  let res = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== 'node_modules' && e.name !== '.git') {
      res = res.concat(getAllHtml(full));
    } else if (e.name.endsWith('.html')) {
      res.push(full);
    }
  });
  return res;
}

const htmlFiles = getAllHtml(ROOT);
let broken = [];
let internalExternalBroken = [];

htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Match href and src
  const matches = content.matchAll(/(?:href|src)=["']([^"'#?]+)["']/g);
  for (const m of matches) {
    let url = m[1].trim();
    if (!url || url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('javascript:') || url.startsWith('data:')) continue;
    
    if (url.startsWith('https://www.nexcoinpr.agency') || url.startsWith('https://nexcoinpr.com')) {
      url = url.replace('https://www.nexcoinpr.agency', '').replace('https://nexcoinpr.com', '');
      if (url === '') url = '/';
    } else if (url.startsWith('http')) {
      continue;
    }

    // Now url is local path like /crypto-pr or /assets/images/...
    let localPath = path.join(ROOT, url.replace(/^\//, ''));
    let exists = fs.existsSync(localPath);
    if (!exists && !path.extname(localPath)) {
      exists = fs.existsSync(localPath + '.html');
    }
    if (!exists) {
      broken.push({ from: path.relative(ROOT, f), link: m[1], checkedPath: path.relative(ROOT, localPath) });
    }
  }
});

console.log(`Found ${broken.length} broken links/assets in HTML:`);
broken.forEach(b => console.log(`In ${b.from} -> ${b.link} (cannot find ${b.checkedPath})`));

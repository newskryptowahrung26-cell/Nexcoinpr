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

// Map of canonical URL -> incoming count
const incomingLinks = {};
htmlFiles.forEach(f => {
  const rel = path.relative(ROOT, f).replace(/\\/g, '/');
  let clean = '/' + rel.replace(/\.html$/, '');
  if (clean === '/index') clean = '/';
  incomingLinks[clean] = 0;
});

htmlFiles.forEach(f => {
  const fromRel = '/' + path.relative(ROOT, f).replace(/\\/g, '/').replace(/\.html$/, '');
  const content = fs.readFileSync(f, 'utf8');
  const hrefMatches = content.matchAll(/href=["']([^"']+)["']/g);
  for (const m of hrefMatches) {
    let link = m[1].trim();
    if (link.startsWith('https://www.nexcoinpr.agency')) {
      link = link.replace('https://www.nexcoinpr.agency', '');
    }
    if (link.startsWith('http')) continue;
    const clean = link.split('?')[0].split('#')[0] || '/';
    if (incomingLinks[clean] !== undefined && clean !== fromRel) {
      incomingLinks[clean]++;
    }
  }
});

console.log('Incoming links count per page:');
const sorted = Object.entries(incomingLinks).sort((a, b) => a[1] - b[1]);
sorted.forEach(([page, count]) => {
  if (count <= 2) {
    console.log(`- ${page}: ${count} incoming links`);
  }
});

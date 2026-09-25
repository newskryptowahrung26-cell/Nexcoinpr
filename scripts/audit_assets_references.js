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

const cssRefs = new Set();
const jsRefs = new Set();

htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const cssMatches = [...content.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi)];
  cssMatches.forEach(m => {
    const hrefMatch = m[0].match(/href=["']([^"']+)["']/i);
    if (hrefMatch) cssRefs.add(hrefMatch[1]);
  });

  const jsMatches = [...content.matchAll(/<script[^>]+src=["']([^"']+)["'][^>]*>/gi)];
  jsMatches.forEach(m => {
    jsRefs.add(m[1]);
  });
});

console.log('CSS References across site:');
console.log(Array.from(cssRefs));
console.log('\nJS References across site:');
console.log(Array.from(jsRefs));

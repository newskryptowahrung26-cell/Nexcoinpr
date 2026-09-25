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
let totalAssetsChecked = 0;
let errors = [];

htmlFiles.forEach(f => {
  const rel = path.relative(ROOT, f);
  const content = fs.readFileSync(f, 'utf8');

  // Check CSS links
  const cssMatches = [...content.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi)];
  cssMatches.forEach(m => {
    const hrefMatch = m[0].match(/href=["']([^"']+)["']/i);
    if (hrefMatch) {
      const href = hrefMatch[1];
      if (href.startsWith('/assets/')) {
        totalAssetsChecked++;
        const localPath = path.join(ROOT, href.split('?')[0]);
        if (!fs.existsSync(localPath)) {
          errors.push(`Missing CSS asset referenced in ${rel}: ${href} -> ${localPath}`);
        }
      }
    }
  });

  // Check JS links
  const jsMatches = [...content.matchAll(/<script[^>]+src=["']([^"']+)["'][^>]*>/gi)];
  jsMatches.forEach(m => {
    const src = m[1];
    if (src.startsWith('/assets/')) {
      totalAssetsChecked++;
      const localPath = path.join(ROOT, src.split('?')[0]);
      if (!fs.existsSync(localPath)) {
        errors.push(`Missing JS asset referenced in ${rel}: ${src} -> ${localPath}`);
      }
    }
  });
});

console.log(`Audited ${htmlFiles.length} HTML files and ${totalAssetsChecked} asset references.`);
if (errors.length === 0) {
  console.log('SUCCESS: All referenced CSS and JS assets exist on disk and resolve with 0 missing files!');
} else {
  console.error('FAILURES:', errors);
  process.exit(1);
}

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

console.log(`=== AUDITING ${htmlFiles.length} HTML FILES ===`);

let canonicalWithHtml = 0;
let ogUrlWithHtml = 0;
let internalLinksWithHtml = 0;
let metaDescOver160 = [];
let brokenLinks = [];

htmlFiles.forEach(f => {
  const rel = path.relative(ROOT, f);
  const content = fs.readFileSync(f, 'utf8');

  // 1. Canonical
  const canonMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i) ||
                     content.match(/<link\s+href=["']([^"']+)["']\s+rel=["']canonical["']/i);
  if (canonMatch) {
    const canon = canonMatch[1];
    if (canon.endsWith('.html')) {
      canonicalWithHtml++;
      // console.log(`Canonical .html: ${rel} -> ${canon}`);
    }
  }

  // 2. og:url
  const ogMatch = content.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i) ||
                  content.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:url["']/i);
  if (ogMatch) {
    const og = ogMatch[1];
    if (og.endsWith('.html')) {
      ogUrlWithHtml++;
    }
  }

  // 3. Meta description length
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                    content.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  if (descMatch) {
    const desc = descMatch[1];
    if (desc.length > 155) {
      metaDescOver160.push({ file: rel, length: desc.length, desc });
    }
  }

  // 4. Internal hrefs with .html
  const hrefMatches = content.matchAll(/href=["']([^"']+)["']/g);
  for (const m of hrefMatches) {
    let link = m[1].trim();
    if (link.startsWith('http://') || link.startsWith('https://')) {
      if (link.startsWith('https://www.nexcoinpr.agency') || link.startsWith('https://nexcoinpr.com')) {
        link = link.replace(/https:\/\/(www\.)?nexcoinpr\.(agency|com)/, '');
      } else {
        continue;
      }
    }
    if (link.startsWith('/') && link.includes('.html')) {
      internalLinksWithHtml++;
    } else if (!link.startsWith('http') && !link.startsWith('#') && !link.startsWith('mailto:') && !link.startsWith('tel:') && link.includes('.html')) {
      internalLinksWithHtml++;
    }
  }
});

console.log(`Canonical tags ending in .html: ${canonicalWithHtml}`);
console.log(`og:url tags ending in .html: ${ogUrlWithHtml}`);
console.log(`Internal links with .html: ${internalLinksWithHtml}`);
console.log(`Meta descriptions > 155 chars: ${metaDescOver160.length}`);
metaDescOver160.forEach(m => console.log(`  - [${m.length} chars] ${m.file}: "${m.desc.slice(0, 60)}..."`));

// Check sitemaps
const sitemaps = ['sitemap.xml', 'sitemap-pages.xml', 'sitemap-news.xml', 'sitemap-press-releases.xml'];
sitemaps.forEach(sm => {
  const p = path.join(ROOT, sm);
  if (fs.existsSync(p)) {
    const c = fs.readFileSync(p, 'utf8');
    const locMatches = c.match(/<loc>[^<]+<\/loc>/g) || [];
    const htmlLocs = locMatches.filter(l => l.includes('.html'));
    console.log(`${sm}: total URLs = ${locMatches.length}, URLs ending with .html = ${htmlLocs.length}`);
  }
});

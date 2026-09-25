const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

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
console.log(`Checking ${htmlFiles.length} HTML files for Ahrefs issues...\n`);

// 1. STRUCTURED DATA VALIDATION
console.log('--- 1. CHECKING STRUCTURED DATA (JSON-LD) ---');
let invalidSchemas = [];
htmlFiles.forEach(f => {
  const rel = path.relative(ROOT, f);
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi);
  for (const m of matches) {
    let raw = m[1].trim();
    try {
      const parsed = JSON.parse(raw);
      // Check required fields for common schemas
      const schemas = Array.isArray(parsed) ? parsed : (parsed['@graph'] || [parsed]);
      for (const s of schemas) {
        if (!s['@context']) invalidSchemas.push({ file: rel, issue: 'Missing @context', data: s });
        if (!s['@type']) invalidSchemas.push({ file: rel, issue: 'Missing @type', data: s });

        if (s['@type'] === 'NewsArticle' || s['@type'] === 'Article') {
          if (!s.headline) invalidSchemas.push({ file: rel, issue: 'Article missing headline', type: s['@type'] });
          if (!s.image) invalidSchemas.push({ file: rel, issue: 'Article missing image', type: s['@type'] });
          if (!s.datePublished) invalidSchemas.push({ file: rel, issue: 'Article missing datePublished', type: s['@type'] });
          if (!s.author) invalidSchemas.push({ file: rel, issue: 'Article missing author', type: s['@type'] });
          if (!s.publisher) invalidSchemas.push({ file: rel, issue: 'Article missing publisher', type: s['@type'] });
        }
      }
    } catch (e) {
      invalidSchemas.push({ file: rel, issue: 'Invalid JSON syntax: ' + e.message, raw: raw.slice(0, 100) });
    }
  }
});
console.log(`Found ${invalidSchemas.length} structured data issues:`);
invalidSchemas.forEach(s => console.log(`  - [${s.file}] ${s.issue}: type=${s.type || (s.data ? s.data['@type'] : '')}`));

// 2. TITLE TAG LENGTH
console.log('\n--- 2. CHECKING TITLE TAG LENGTH (> 60 chars) ---');
let titlesOver60 = [];
htmlFiles.forEach(f => {
  const rel = path.relative(ROOT, f);
  const content = fs.readFileSync(f, 'utf8');
  const match = content.match(/<title>([^<]*)<\/title>/i);
  if (match) {
    const title = match[1].trim();
    if (title.length > 60) {
      titlesOver60.push({ file: rel, length: title.length, title });
    }
  }
});
console.log(`Found ${titlesOver60.length} titles > 60 chars:`);
titlesOver60.forEach(t => console.log(`  - [${t.length} chars] ${t.file}: "${t.title}"`));

// 3. IMAGES WITHOUT ALT ATTRIBUTES
console.log('\n--- 3. CHECKING IMAGES MISSING ALT ATTRIBUTES ---');
let imagesMissingAlt = [];
let externalImages = [];
htmlFiles.forEach(f => {
  const rel = path.relative(ROOT, f);
  const content = fs.readFileSync(f, 'utf8');
  const imgMatches = content.matchAll(/<img\b([^>]*)>/gi);
  for (const m of imgMatches) {
    const attrs = m[1];
    const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
    const altMatch = attrs.match(/alt=["']([^"']*)["']/i);
    const src = srcMatch ? srcMatch[1] : 'unknown';
    
    if (!altMatch || altMatch[1].trim() === '') {
      imagesMissingAlt.push({ file: rel, src, fullTag: m[0] });
    }

    if (src.startsWith('http://') || src.startsWith('https://')) {
      if (!src.includes('nexcoinpr.agency') && !src.includes('nexcoinpr.com')) {
        externalImages.push({ file: rel, src });
      }
    }
  }
});
console.log(`Found ${imagesMissingAlt.length} images without alt attribute:`);
imagesMissingAlt.forEach(img => console.log(`  - [${img.file}] src="${img.src}"`));

console.log(`\nFound ${externalImages.length} external images to check for 404:`);
externalImages.forEach(img => console.log(`  - [${img.file}] ${img.src}`));

// 4. LINKS WITH NO ANCHOR TEXT
console.log('\n--- 4. CHECKING LINKS WITH NO ANCHOR TEXT ---');
let emptyLinks = [];
htmlFiles.forEach(f => {
  const rel = path.relative(ROOT, f);
  const content = fs.readFileSync(f, 'utf8');
  const linkMatches = content.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi);
  for (const m of linkMatches) {
    const attrs = m[1];
    const inner = m[2].trim();
    // Check if inner text has characters or img alt or aria-label
    const hasAria = /aria-label=["']([^"']+)["']/i.test(attrs);
    const hasImgWithAlt = /<img\b[^>]*alt=["']([^"']+)["']/i.test(inner);
    const textOnly = inner.replace(/<[^>]+>/g, '').trim();

    if (!hasAria && !hasImgWithAlt && textOnly.length === 0) {
      const hrefMatch = attrs.match(/href=["']([^"']+)["']/i);
      emptyLinks.push({ file: rel, href: hrefMatch ? hrefMatch[1] : 'none', tag: m[0].slice(0, 80) });
    }
  }
});
console.log(`Found ${emptyLinks.length} links with no anchor text:`);
emptyLinks.forEach(l => console.log(`  - [${l.file}] href="${l.href}" tag="${l.tag}"`));

// 5. CHECK ORPHANED PAGES IN SITEMAPS
console.log('\n--- 5. CHECKING ORPHANED PAGES IN SITEMAPS ---');
const sitemaps = ['sitemap-pages.xml', 'sitemap-news.xml', 'sitemap-press-releases.xml'];
let sitemapUrls = [];
sitemaps.forEach(sm => {
  const p = path.join(ROOT, sm);
  if (!fs.existsSync(p)) return;
  const c = fs.readFileSync(p, 'utf8');
  const locMatches = c.matchAll(/<loc>(https:\/\/www\.nexcoinpr\.agency\/[^<]*)<\/loc>/g);
  for (const m of locMatches) {
    let u = m[1].replace('https://www.nexcoinpr.agency', '');
    if (u === '') u = '/';
    sitemapUrls.push(u);
  }
});

let internalLinkTargets = new Set();
htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const hrefMatches = content.matchAll(/href=["']([^"']+)["']/g);
  for (const m of hrefMatches) {
    let link = m[1].trim();
    if (link.startsWith('https://www.nexcoinpr.agency')) link = link.replace('https://www.nexcoinpr.agency', '');
    if (link.startsWith('/')) {
      const clean = link.split('?')[0].split('#')[0];
      internalLinkTargets.add(clean);
    }
  }
});

let orphaned = sitemapUrls.filter(u => u !== '/' && !internalLinkTargets.has(u));
console.log(`Found ${orphaned.length} orphaned pages in sitemap:`, orphaned);

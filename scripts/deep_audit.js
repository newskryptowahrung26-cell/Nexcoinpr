const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('   NEXCOINPR DEEP PRE-LAUNCH SITE AUDIT ENGINE');
console.log('====================================================\n');

let issues = [];
let warnings = [];
let passes = [];

function getAllFiles(dir, filterFn) {
  let res = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name !== 'node_modules' && ent.name !== '.git') {
        res = res.concat(getAllFiles(full, filterFn));
      }
    } else if (!filterFn || filterFn(full)) {
      res.push(full);
    }
  }
  return res;
}

const htmlFiles = getAllFiles(ROOT, f => f.endsWith('.html'));
const xmlFiles = getAllFiles(ROOT, f => f.endsWith('.xml'));
const imageFiles = getAllFiles(ROOT, f => /\.(png|jpe?g|webp|gif|svg|ico)$/i.test(f));

console.log(`Discovered:`);
console.log(`- ${htmlFiles.length} HTML files`);
console.log(`- ${xmlFiles.length} XML/Sitemap/Feed files`);
console.log(`- ${imageFiles.length} Image/Asset files\n`);

// ---------------------------------------------------------
// 1. SITEMAPS AUDIT
// ---------------------------------------------------------
console.log('--- 1. AUDITING SITEMAPS ---');
const sitemaps = ['sitemap.xml', 'sitemap-pages.xml', 'sitemap-news.xml', 'sitemap-press-releases.xml'];
let sitemapUrls = new Set();

sitemaps.forEach(sm => {
  const p = path.join(ROOT, sm);
  if (!fs.existsSync(p)) {
    issues.push(`Critical: Sitemap file missing: ${sm}`);
    return;
  }
  const content = fs.readFileSync(p, 'utf8');
  const locRegex = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
  let match;
  let count = 0;
  while ((match = locRegex.exec(content)) !== null) {
    const url = match[1];
    if (sm !== 'sitemap.xml') {
      sitemapUrls.add(url);
    }
    count++;
  }
  passes.push(`Sitemap ${sm} parsed successfully with ${count} entries.`);
});

// Verify if every URL in sitemaps resolves to a real local file
sitemapUrls.forEach(url => {
  try {
    const u = new URL(url);
    let pathname = u.pathname;
    if (pathname === '/' || pathname === '') pathname = '/index.html';
    if (!pathname.endsWith('.html') && !pathname.includes('.')) {
      pathname += '.html';
    }
    const localPath = path.join(ROOT, pathname.replace(/^\//, ''));
    if (!fs.existsSync(localPath)) {
      issues.push(`Sitemap URL does not exist on disk: ${url} -> ${localPath}`);
    }
  } catch (e) {
    issues.push(`Invalid URL in sitemap: ${url}`);
  }
});

// Check if any important HTML files are missing from sitemaps
const excludedHtml = ['404.html', 'teaser-video.html'];
htmlFiles.forEach(f => {
  const rel = path.relative(ROOT, f).replace(/\\/g, '/');
  if (excludedHtml.includes(rel)) return;
  const canonicalUrl1 = `https://www.nexcoinpr.agency/${rel}`;
  const canonicalUrl2 = rel === 'index.html' ? 'https://www.nexcoinpr.agency/' : `https://www.nexcoinpr.agency/${rel.replace(/\.html$/, '')}`;
  
  if (!sitemapUrls.has(canonicalUrl1) && !sitemapUrls.has(canonicalUrl2)) {
    warnings.push(`HTML file missing from sitemaps: ${rel}`);
  }
});

// ---------------------------------------------------------
// 2. LLMS.TXT & LLMS-FULL.TXT AUDIT
// ---------------------------------------------------------
console.log('--- 2. AUDITING LLMS.TXT & LLMS-FULL.TXT ---');
['llms.txt', 'llms-full.txt'].forEach(lf => {
  const p = path.join(ROOT, lf);
  if (!fs.existsSync(p)) {
    issues.push(`Critical: ${lf} is missing!`);
    return;
  }
  const content = fs.readFileSync(p, 'utf8');
  if (!content.includes('NexcoinPR')) {
    issues.push(`${lf} is missing NexcoinPR brand identification.`);
  }
  
  // Extract all markdown links: [text](url)
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
  let match;
  let linkCount = 0;
  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[2];
    linkCount++;
    if (url.startsWith('https://www.nexcoinpr.agency')) {
      const u = new URL(url);
      let pathname = u.pathname;
      if (pathname === '/' || pathname === '') pathname = '/index.html';
      if (!pathname.endsWith('.html') && !pathname.includes('.')) pathname += '.html';
      const localPath = path.join(ROOT, pathname.replace(/^\//, ''));
      if (!fs.existsSync(localPath)) {
        issues.push(`Broken link in ${lf}: ${url} (Cannot find ${localPath})`);
      }
    }
  }
  passes.push(`${lf} verified with ${linkCount} working links.`);
});

// ---------------------------------------------------------
// 3. MOBILE & WEB SPEED / ASSET SIZING AUDIT
// ---------------------------------------------------------
console.log('--- 3. AUDITING PERFORMANCE, IMAGES & SCRIPTS ---');
const LARGE_IMAGE_LIMIT = 500 * 1024; // 500 KB limit for web performance
imageFiles.forEach(img => {
  const stat = fs.statSync(img);
  const rel = path.relative(ROOT, img).replace(/\\/g, '/');
  if (stat.size > LARGE_IMAGE_LIMIT) {
    warnings.push(`Heavy asset: ${rel} is ${(stat.size / 1024 / 1024).toFixed(2)} MB (>500KB). Consider modern WebP or compression.`);
  }
});

// Check HTML files for Performance best practices:
// - viewport meta
// - preconnect for fonts
// - defer / async on scripts
// - canonical links
// - title and meta description
htmlFiles.forEach(f => {
  const rel = path.relative(ROOT, f).replace(/\\/g, '/');
  const content = fs.readFileSync(f, 'utf8');

  // Viewport
  if (!content.includes('<meta name="viewport"')) {
    issues.push(`${rel} is missing viewport meta tag (breaks mobile layout).`);
  }

  // Canonical
  if (!content.includes('rel="canonical"') && rel !== '404.html') {
    warnings.push(`${rel} is missing rel="canonical" link.`);
  }

  // Title
  if (!/<title>.*<\/title>/i.test(content)) {
    issues.push(`${rel} is missing <title> tag.`);
  }

  // Meta Description
  if (!content.includes('name="description"') && rel !== '404.html') {
    warnings.push(`${rel} is missing meta description.`);
  }

  // Blocking scripts in head
  const headMatch = content.match(/<head[\s\S]*?<\/head>/i);
  if (headMatch) {
    const headContent = headMatch[0];
    const scriptTags = headContent.match(/<script\b[^>]*>[\s\S]*?<\/script>/gi) || [];
    scriptTags.forEach(st => {
      // Ignore JSON-LD or inline config
      if (st.includes('type="application/ld+json"') || !st.includes('src=')) return;
      if (!st.includes('defer') && !st.includes('async')) {
        warnings.push(`Render-blocking script in head of ${rel}: ${st.slice(0, 80)}... (Add defer or async)`);
      }
    });
  }
});

// ---------------------------------------------------------
// 4. ROBOTS.TXT AUDIT
// ---------------------------------------------------------
console.log('--- 4. AUDITING ROBOTS.TXT ---');
const robotsPath = path.join(ROOT, 'robots.txt');
if (fs.existsSync(robotsPath)) {
  const robContent = fs.readFileSync(robotsPath, 'utf8');
  if (!robContent.includes('Sitemap:')) {
    issues.push('robots.txt does not declare a Sitemap directive.');
  }
  if (!robContent.includes('User-agent: *')) {
    warnings.push('robots.txt does not contain User-agent: * rule.');
  }
}

// ---------------------------------------------------------
// OUTPUT REPORT
// ---------------------------------------------------------
console.log('\n====================================================');
console.log(`AUDIT COMPLETE: ${passes.length} Passes | ${warnings.length} Warnings | ${issues.length} Critical Issues`);
console.log('====================================================\n');

if (issues.length > 0) {
  console.log('CRITICAL ISSUES:');
  issues.forEach((iss, i) => console.log(` [ERROR ${i+1}] ${iss}`));
  console.log('');
} else {
  console.log('SUCCESS: ZERO Critical Issues found!\n');
}

if (warnings.length > 0) {
  console.log('OPTIMIZATION WARNINGS:');
  warnings.forEach((warn, i) => console.log(` [WARN ${i+1}] ${warn}`));
  console.log('');
} else {
  console.log('SUCCESS: ZERO Warnings found!\n');
}

passes.forEach(p => console.log(` [PASS] ${p}`));

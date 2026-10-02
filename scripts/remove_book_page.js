const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// 1. Delete book.html
const bookHtmlPath = path.join(ROOT_DIR, 'book.html');
if (fs.existsSync(bookHtmlPath)) {
  fs.unlinkSync(bookHtmlPath);
  console.log('Deleted book.html');
} else {
  console.log('book.html already deleted');
}

// 2. Remove /book from sitemap-pages.xml
const sitemapPath = path.join(ROOT_DIR, 'sitemap-pages.xml');
if (fs.existsSync(sitemapPath)) {
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const bookEntryRegex = /\s*<url>\s*<loc>https:\/\/www\.nexcoinpr\.agency\/book<\/loc>[\s\S]*?<\/url>/i;
  if (bookEntryRegex.test(sitemap)) {
    sitemap = sitemap.replace(bookEntryRegex, '');
    fs.writeFileSync(sitemapPath, sitemap, 'utf8');
    console.log('Removed /book from sitemap-pages.xml');
  }
}

// 3. Remove all references from all HTML files
function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file === 'scratch') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = getAllHtmlFiles(ROOT_DIR);
console.log(`Scanning ${htmlFiles.length} HTML files for /book links...`);

let modifiedCount = 0;

for (const filePath of htmlFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Remove nav list items
  content = content.replace(/\s*<li><a href="\/book" class="dropdown-link"[^>]*>PR Playbook<\/a><\/li>/gi, '');
  content = content.replace(/\s*<li><a href="\/book"[^>]*>PR Playbook<\/a><\/li>/gi, '');
  content = content.replace(/\s*<li><a href="\/book\.html"[^>]*>.*?<\/a><\/li>/gi, '');

  // In index.html, remove the strategic book guide card
  if (path.basename(filePath) === 'index.html') {
    const cardRegex = /\s*<a href="\/book" class="guide-card"[\s\S]*?<\/a>/i;
    content = content.replace(cardRegex, '');
  }

  // In news/guides.html, remove the premier strategic book featured banner
  if (filePath.endsWith('news' + path.sep + 'guides.html') || filePath.endsWith('news/guides.html')) {
    const bannerRegex = /\s*<div class="card card-featured"[^>]*style="[^"]*border: 2px solid #C9A84C;[\s\S]*?Read PR Playbook Online &rarr;<\/a>\s*<\/div>\s*<\/div>/i;
    content = content.replace(bannerRegex, '');
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedCount++;
  }
}

console.log(`Cleaned /book references from ${modifiedCount} HTML files.`);

// 4. Update vercel.json with clean 301 redirect to homepage so no 404 occurs
const vercelPath = path.join(ROOT_DIR, 'vercel.json');
if (fs.existsSync(vercelPath)) {
  let vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  if (!vercel.redirects) vercel.redirects = [];
  
  // Remove existing /book redirect if present
  vercel.redirects = vercel.redirects.filter(r => r.source !== '/book' && r.source !== '/book.html');
  
  // Add 301 redirect
  vercel.redirects.unshift(
    { source: "/book", destination: "/", permanent: true },
    { source: "/book.html", destination: "/", permanent: true }
  );

  fs.writeFileSync(vercelPath, JSON.stringify(vercel, null, 2), 'utf8');
  console.log('Added 301 redirect for /book in vercel.json');
}

console.log('All deletion and cleanup of /book completed successfully!');

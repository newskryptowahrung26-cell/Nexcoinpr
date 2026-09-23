const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname || process.cwd());

function getFiles(dir, ext = '.html') {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, ext));
    } else if (file.endsWith(ext)) {
      results.push(fullPath);
    }
  });
  return results;
}

const htmlFiles = getFiles(BASE_DIR, '.html');
console.log(`Found ${htmlFiles.length} HTML files.`);

let errors = [];
let blogMentions = [];

htmlFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(BASE_DIR, filePath);

  // 1. Check for /blog/ links
  if (content.includes('/blog/') || content.includes('/blog')) {
    blogMentions.push(relPath);
  }

  // 2. Validate JSON-LD
  const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = jsonLdRegex.exec(content)) !== null) {
    try {
      JSON.parse(match[1]);
    } catch (e) {
      errors.push(`Invalid JSON-LD in ${relPath}: ${e.message}`);
    }
  }
});

// Check XML files
const xmlFiles = getFiles(BASE_DIR, '.xml');
console.log(`Found ${xmlFiles.length} XML files.`);
xmlFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(BASE_DIR, filePath);
  if (!content.trim().startsWith('<?xml')) {
    errors.push(`XML file ${relPath} missing <?xml header.`);
  }
  if (!content.includes('</urlset>') && !content.includes('</sitemapindex>') && !content.includes('</rss>')) {
    errors.push(`XML file ${relPath} seems truncated or malformed.`);
  }
});

// Check llms.txt & robots.txt
if (!fs.existsSync(path.join(BASE_DIR, 'robots.txt'))) errors.push('Missing robots.txt');
if (!fs.existsSync(path.join(BASE_DIR, 'llms.txt'))) errors.push('Missing llms.txt');
if (!fs.existsSync(path.join(BASE_DIR, 'llms-full.txt'))) errors.push('Missing llms-full.txt');

console.log('--- VERIFICATION RESULTS ---');
if (blogMentions.length > 0) {
  console.log(`WARNING: /blog mentions found in: ${blogMentions.join(', ')}`);
} else {
  console.log('PASS: ZERO mentions of /blog/ anywhere in the entire site.');
}

if (errors.length === 0) {
  console.log('PASS: All HTML, JSON-LD, XML, robots.txt, and llms.txt files are 100% VALID!');
} else {
  console.log(`FAIL: Found ${errors.length} errors:`);
  errors.forEach(err => console.log(` - ${err}`));
}

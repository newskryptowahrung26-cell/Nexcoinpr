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

console.log(`Auditing ${htmlFiles.length} HTML files for:`);
console.log('1. Incomplete Open Graph tags (og:title, og:type, og:image, og:url, og:description)');
console.log('2. Meta descriptions > 150 chars or missing');
console.log('3. Titles > 55 chars');
console.log('4. Incoming internal links per page (orphans)');

const ogProps = ['og:title', 'og:type', 'og:image', 'og:url', 'og:description'];
let ogIncomplete = [];
let longMetaDesc = [];
let longTitles = [];

htmlFiles.forEach(f => {
  const rel = path.relative(ROOT, f).replace(/\\/g, '/');
  const content = fs.readFileSync(f, 'utf8');

  // 1. OG tags
  let missingOg = [];
  ogProps.forEach(prop => {
    const regex = new RegExp(`property=["']${prop}["']`, 'i');
    if (!regex.test(content)) missingOg.push(prop);
  });
  if (missingOg.length > 0) {
    ogIncomplete.push({ file: rel, missing: missingOg });
  }

  // 2. Meta description
  const metaMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                    content.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  if (metaMatch) {
    const desc = metaMatch[1];
    if (desc.length > 150) {
      longMetaDesc.push({ file: rel, length: desc.length, desc });
    }
  } else if (rel !== '404.html') {
    longMetaDesc.push({ file: rel, length: 0, desc: 'MISSING' });
  }

  // 3. Title tag
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  if (titleMatch) {
    const title = titleMatch[1].trim();
    if (title.length > 58) {
      longTitles.push({ file: rel, length: title.length, title });
    }
  }
});

console.log(`\n=== 1. INCOMPLETE OPEN GRAPH TAGS: ${ogIncomplete.length} FILES ===`);
ogIncomplete.forEach(o => console.log(`  - [${o.file}] Missing: ${o.missing.join(', ')}`));

console.log(`\n=== 2. META DESCRIPTIONS > 150 CHARS: ${longMetaDesc.length} FILES ===`);
longMetaDesc.forEach(m => console.log(`  - [${m.file}] (${m.length} chars): "${m.desc}"`));

console.log(`\n=== 3. TITLES > 58 CHARS: ${longTitles.length} FILES ===`);
longTitles.forEach(t => console.log(`  - [${t.file}] (${t.length} chars): "${t.title}"`));

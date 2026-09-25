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

htmlFiles.forEach(f => {
  const rel = path.relative(ROOT, f);
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi);
  for (const m of matches) {
    const raw = m[1].trim();
    try {
      const obj = JSON.parse(raw);
      // Validate schema
      validateObj(obj, rel);
    } catch (e) {
      console.log(`[SYNTAX ERROR] in ${rel}: ${e.message}`);
    }
  }
});

function validateObj(obj, file) {
  if (!obj['@context'] && !Array.isArray(obj)) {
    console.log(`[MISSING ROOT @context] in ${file}`);
  }
  if (Array.isArray(obj)) {
    obj.forEach(item => validateItem(item, file));
  } else if (obj['@graph']) {
    obj['@graph'].forEach(item => validateItem(item, file));
  } else {
    validateItem(obj, file);
  }
}

function validateItem(item, file) {
  const type = item['@type'];
  if (!type) {
    console.log(`[INVALID] ${file}: missing @type`);
    return;
  }

  if (type === 'NewsArticle' || type === 'Article') {
    if (!item.headline) console.log(`[INVALID ARTICLE] ${file}: missing headline`);
    if (!item.image) console.log(`[INVALID ARTICLE] ${file}: missing image`);
    if (!item.datePublished) console.log(`[INVALID ARTICLE] ${file}: missing datePublished`);
    if (!item.publisher) console.log(`[INVALID ARTICLE] ${file}: missing publisher`);
  }

  if (type === 'BreadcrumbList') {
    if (!item.itemListElement || !Array.isArray(item.itemListElement)) {
      console.log(`[INVALID BREADCRUMB] ${file}: missing itemListElement`);
    }
  }

  if (type === 'FAQPage') {
    if (!item.mainEntity || !Array.isArray(item.mainEntity)) {
      console.log(`[INVALID FAQ] ${file}: missing mainEntity array`);
    }
  }
}

console.log('Finished structured data validation.');

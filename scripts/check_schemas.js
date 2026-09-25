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
  const matches = [...content.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
  matches.forEach((m, idx) => {
    try {
      const obj = JSON.parse(m[1].trim());
      // check any object for Organization with serviceType or any other invalid props
      function scan(node, pathStr) {
        if (!node || typeof node !== 'object') return;
        if (node['@type'] === 'Organization') {
          if (node.serviceType) {
            console.log(`[INVALID SCHEMA] ${rel} -> Organization at ${pathStr} has serviceType!`);
          }
        }
        for (const k of Object.keys(node)) {
          scan(node[k], pathStr ? `${pathStr}.${k}` : k);
        }
      }
      scan(obj, `script[${idx}]`);
    } catch (err) {
      console.error(`[JSON PARSE ERROR] in ${rel}: ${err.message}`);
    }
  });
});

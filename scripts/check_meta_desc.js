const fs = require('fs');
const path = require('path');

function walk(d) {
  let r = [];
  for (let f of fs.readdirSync(d)) {
    let p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git') r = r.concat(walk(p));
    } else if (f.endsWith('.html')) {
      r.push(p);
    }
  }
  return r;
}

let count = 0;
for (let f of walk('.')) {
  const content = fs.readFileSync(f, 'utf8');
  const m = content.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
  if (m) {
    const desc = m[1];
    if (desc.length > 140) {
      console.log(`${f} (${desc.length} chars): "${desc}"`);
      count++;
    }
  }
}

console.log(`\nTotal files with meta description > 140 chars: ${count}`);

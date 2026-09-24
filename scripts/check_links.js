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

const allFiles = walk('.');
const allHtmlPaths = new Set(allFiles.map(f => '/' + f.replace(/\\/g, '/').replace(/^\.\//, '')));

const routeSet = new Set(allHtmlPaths);
allHtmlPaths.forEach(p => {
  if (p.endsWith('.html')) {
    routeSet.add(p.replace(/\.html$/, ''));
    if (p.endsWith('/index.html')) {
      routeSet.add(p.replace(/index\.html$/, ''));
    }
  }
});
routeSet.add('/');

let broken = 0;
for (let f of allFiles) {
  const content = fs.readFileSync(f, 'utf8');
  const hrefs = [...content.matchAll(/href=["']([^"'#?]+)["']/g)].map(m => m[1]);
  for (let h of hrefs) {
    if (h.startsWith('http://') || h.startsWith('https://') || h.startsWith('mailto:') || h.startsWith('tel:') || h.startsWith('javascript:')) continue;
    let target = h;
    if (!target.startsWith('/')) {
      const dir = path.dirname(f).replace(/\\/g, '/');
      target = path.posix.normalize('/' + dir + '/' + target);
    }
    // Check if target or target.html exists or asset exists
    const exists = routeSet.has(target) ||
      routeSet.has(target + '.html') ||
      routeSet.has(target + '/index.html') ||
      fs.existsSync(path.join(__dirname, '..', target));
      
    if (!exists) {
      console.log(`[BROKEN LINK] in ${f} -> "${h}" (resolved: "${target}")`);
      broken++;
    }
  }
}

console.log(`\nTotal broken internal links: ${broken}`);

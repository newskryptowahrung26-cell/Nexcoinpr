const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function walk(dir) {
  let files = [];
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (file === 'node_modules' || file.startsWith('.')) return;
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(walk(full));
    } else if (file.endsWith('.html')) {
      files.push(full);
    }
  });
  return files;
}

const htmlFiles = walk(rootDir);
let count = 0;

htmlFiles.forEach(file => {
  let c = fs.readFileSync(file, 'utf8');
  let original = c;
  
  // Replace any ?v=X.X with ?v=5.0
  c = c.replace(/href="\/assets\/css\/([^"]+)\.css(\?v=[^"]*)?"/g, 'href="/assets/css/$1.css?v=5.0"');
  
  if (c !== original) {
    fs.writeFileSync(file, c, 'utf8');
    count++;
  }
});

console.log(`Updated cache busters to v=5.0 across ${count} HTML files`);

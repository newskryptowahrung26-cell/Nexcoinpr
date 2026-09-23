const fs = require('fs');

// Check main.css, components.css, pages.css for min-width, fixed width, or overflow
const cssFiles = ['assets/css/main.css', 'assets/css/components.css', 'assets/css/pages.css'];
cssFiles.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const lines = c.split('\n');
  lines.forEach((line, i) => {
    if (line.includes('min-width') && line.includes('px')) {
      const m = line.match(/min-width:\s*(\d+)px/);
      if (m && parseInt(m[1]) > 300) {
        console.log(`${f}:${i+1} -> ${line.trim()}`);
      }
    }
    if (line.includes('width') && line.includes('px') && !line.includes('max-width') && !line.includes('border') && !line.includes('stroke')) {
      const m = line.match(/(?<![a-zA-Z-])width:\s*(\d+)px/);
      if (m && parseInt(m[1]) > 500) {
        console.log(`${f}:${i+1} -> ${line.trim()}`);
      }
    }
  });
});

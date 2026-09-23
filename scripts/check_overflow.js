const fs = require('fs');

const html = fs.readFileSync('crypto-pr.html', 'utf8');
const mainCss = fs.readFileSync('assets/css/main.css', 'utf8');
const compCss = fs.readFileSync('assets/css/components.css', 'utf8');
const pageCss = fs.readFileSync('assets/css/pages.css', 'utf8');

// Check all inline widths, min-widths, and overflow properties
const lines = html.split('\n');
lines.forEach((line, i) => {
  if (line.includes('width') || line.includes('min-width') || line.includes('margin') || line.includes('padding')) {
    if (line.includes('px') && !line.includes('max-width')) {
      // check if any fixed width exceeds container
      const m = line.match(/width:\s*(\d+)px/);
      if (m && parseInt(m[1]) > 500) {
        console.log(`Line ${i+1}: ${line.trim()}`);
      }
    }
  }
});
console.log('Checked widths in crypto-pr.html');

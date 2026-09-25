const fs = require('fs');
const content = fs.readFileSync('markets.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  const trimmed = l.trim();
  if (trimmed.startsWith('<section') || trimmed.startsWith('<div class="tab-panel') || trimmed.startsWith('<footer') || trimmed.startsWith('<!-- ===')) {
    console.log(`Line ${i + 1}: ${trimmed.substring(0, 90)}`);
  }
});

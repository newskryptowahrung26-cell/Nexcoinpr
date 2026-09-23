const fs = require('fs');
const c = fs.readFileSync('pricing.html', 'utf8');
const idx = c.indexOf('class="pricing-card');
console.log(c.substring(idx - 100, idx + 1200));

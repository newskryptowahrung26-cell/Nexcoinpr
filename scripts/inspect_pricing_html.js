const fs = require('fs');
const c = fs.readFileSync('pricing.html', 'utf8');
let idx = c.indexOf('class="pricing-card');
console.log('Index:', idx);
if (idx !== -1) {
  console.log(c.substring(idx - 50, idx + 400));
}

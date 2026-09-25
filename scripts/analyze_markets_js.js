const fs = require('fs');
const content = fs.readFileSync('markets.html', 'utf8');
const onclicks = [...content.matchAll(/onclick=["']([^"']+)["']/gi)];
const unique = Array.from(new Set(onclicks.map(m => m[1])));
console.log('Unique onclick count:', unique.length);
console.log('Sample onclicks:', unique.slice(0, 10));

const fs = require('fs');

console.log('=== Checking press-releases.html ===');
const prHtml = fs.readFileSync('press-releases.html', 'utf8');
const prDates = [...prHtml.matchAll(/<span class=["']pr-card-date["']>([^<]+)<\/span>/g)].map(m => m[1]);
prDates.forEach((d, idx) => console.log(`  Card ${idx+1}: ${d}`));

console.log('\n=== Checking news.html ===');
const newsHtml = fs.readFileSync('news.html', 'utf8');
const heroDate = newsHtml.match(/<span class=["']news-card-date["']>([^<]+)<\/span>/);
console.log(`  Featured Hero: ${heroDate ? heroDate[1] : 'none'}`);

const gridDates = [...newsHtml.matchAll(/<span class=["']news-card-date["']>([^<]+)<\/span>/g)].map(m => m[1]);
gridDates.slice(1).forEach((d, idx) => console.log(`  Grid Card ${idx+1}: ${d}`));

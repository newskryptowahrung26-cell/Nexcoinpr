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

const aiPatterns = [
  /\bas an ai\b/i,
  /\blanguage model\b/i,
  /\bopenai\b/i,
  /\bchatgpt\b/i,
  /\bwatermark\b/i,
  /\bdelve into\b/i,
  /\btapestry of\b/i,
  /\btestament to\b/i,
  /\bbeacon of\b/i,
  /\bgame-changer\b/i,
  /\bunleash\b/i,
  /\bseamlessly\b/i,
  /\belevate your\b/i,
  /\brobust solution\b/i,
  /\bharness the power\b/i,
  /\bembark on a journey\b/i
];

let issues = 0;
for (let f of walk('.')) {
  const content = fs.readFileSync(f, 'utf8');
  for (let p of aiPatterns) {
    const matches = content.match(p);
    if (matches) {
      console.log(`[AI PATTERN FOUND] ${f} matched ${p}: "${matches[0]}"`);
      issues++;
    }
  }
}

console.log(`\nTotal AI pattern flags: ${issues}`);

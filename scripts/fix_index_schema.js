const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function getAllHtml(dir) {
  let res = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== 'node_modules' && e.name !== '.git') {
      res = res.concat(getAllHtml(full));
    } else if (e.name.endsWith('.html')) {
      res.push(full);
    }
  });
  return res;
}

const htmlFiles = getAllHtml(ROOT);

// Fix index.html
let indexContent = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const originalPartMatch = indexContent.match(/"email":\s*"nexcoinpr@gmail\.com",\s*"sameAs":\s*\[\],\s*"serviceType":\s*\[[\s\S]*?\],\s*"knowsAbout":\s*\[/);
if (originalPartMatch) {
  const mergedKnowsAbout = `"email": "nexcoinpr@gmail.com",
        "sameAs": [],
        "knowsAbout": [
          "Crypto PR Agency",
          "Forex PR Agency",
          "Blockchain PR Agency",
          "Web3 PR Firm",
          "Fintech PR Agency",
          "Financial PR Services",
          "Crypto Press Release Distribution",
          "Blockchain Newswire Services",
          "Token Launch & TGE PR",
          "DeFi Protocol Communications",
          "Forex Broker Public Relations",
          "Crypto Media Outreach",
          "Crisis & Vulnerability Communications",
          "Digital PR & Link Building",`;
  indexContent = indexContent.replace(originalPartMatch[0], mergedKnowsAbout);
  fs.writeFileSync(path.join(ROOT, 'index.html'), indexContent, 'utf8');
  console.log('Fixed index.html schema: removed serviceType from Organization');
} else {
  console.log('Pattern not matched in index.html, searching more broadly...');
}

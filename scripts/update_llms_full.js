const fs = require('fs');
const path = require('path');

const pubs = require('./master_single_publications.json');
const llmsFullPath = path.resolve('d:/Agency Site/llms-full.txt');

let content = fs.readFileSync(llmsFullPath, 'utf8');

const marker = '- **27 A La Carte Single Publication Direct Placements (USD Flat Rates):**';
const endMarker = '## 7. Comprehensive Keyword Map & Semantic Associations';

const lines = [
  `- **${pubs.length} A La Carte Single Publication Direct Placements (USD Flat Rates):**`
];

pubs.forEach(p => {
  lines.push(`  - ${p.name} (${p.domain}): ${p.price} USD [${p.categoryLabel} | Est. ${p.traffic}]`);
});

lines.push('');

const startIndex = content.indexOf('- **27 A La Carte Single Publication Direct Placements');
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = content.slice(0, startIndex) + lines.join('\n') + '\n' + content.slice(endIndex);
  fs.writeFileSync(llmsFullPath, newContent, 'utf8');
  console.log(`Updated llms-full.txt with all ${pubs.length} publications!`);
} else {
  console.error('Markers not found!');
}

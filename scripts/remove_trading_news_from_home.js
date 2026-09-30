const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// Identify the block from SECTION 9 (LATEST CRYPTO NEWS) to SECTION 11 (INDUSTRY INSIGHTS)
const startMarker = '<!-- ============================================================\r\n       SECTION 9, LATEST CRYPTO NEWS';
const startMarkerLf = '<!-- ============================================================\n       SECTION 9, LATEST CRYPTO NEWS';

const endMarker = '<!-- ============================================================\r\n       SECTION 11, INDUSTRY INSIGHTS';
const endMarkerLf = '<!-- ============================================================\n       SECTION 11, INDUSTRY INSIGHTS';

let startIndex = content.indexOf(startMarker);
let isCrLf = true;
if (startIndex === -1) {
  startIndex = content.indexOf(startMarkerLf);
  isCrLf = false;
}

if (startIndex === -1) {
  // Try regex match
  const regex = /<!--\s*=+\s*SECTION 9, LATEST CRYPTO NEWS[\s\S]*?(?=<!--\s*=+\s*SECTION 11, INDUSTRY INSIGHTS)/i;
  const match = content.match(regex);
  if (match) {
    content = content.replace(regex, '');
    console.log('Removed market news sections via regex.');
  } else {
    console.error('Could not find start/end markers in index.html!');
    process.exit(1);
  }
} else {
  const targetEndMarker = isCrLf ? endMarker : endMarkerLf;
  const endIndex = content.indexOf(targetEndMarker, startIndex);
  if (endIndex === -1) {
    console.error('Could not find endMarker in index.html!');
    process.exit(1);
  }
  content = content.slice(0, startIndex) + content.slice(endIndex);
  console.log('Successfully removed Section 9 & Section 10 from index.html.');
}

// Renumber remaining sections in comments
content = content.replace('SECTION 11, INDUSTRY INSIGHTS', 'SECTION 9, INDUSTRY INSIGHTS');
content = content.replace('SECTION 12, GUIDES & EXPLAINERS', 'SECTION 10, GUIDES & EXPLAINERS');
content = content.replace('SECTION 13, CASE STUDIES', 'SECTION 11, CASE STUDIES');
content = content.replace('SECTION 14, FAQ', 'SECTION 12, FAQ');
content = content.replace('SECTION 15, FINAL CTA', 'SECTION 13, FINAL CTA');

fs.writeFileSync(indexPath, content, 'utf8');
console.log('Successfully saved updated index.html.');

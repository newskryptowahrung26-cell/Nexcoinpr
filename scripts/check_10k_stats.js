const fs = require('fs');

function parseCsvLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i+1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur);
  return result;
}

const lines = fs.readFileSync('C:\\Users\\NDCOM\\Downloads\\Crypto_Forex_Trading_10000_B2B_Master_Leads.csv', 'utf8').split('\r\n').filter(Boolean);
console.log('Total Rows in CSV (including header):', lines.length);

const tiers = {};
const cats = {};
for (let i = 1; i < lines.length; i++) {
  const cols = parseCsvLine(lines[i]);
  const cat = cols[2] || 'Unknown';
  const tier = cols[8] || 'Unknown';
  tiers[tier] = (tiers[tier] || 0) + 1;
  cats[cat] = (cats[cat] || 0) + 1;
}

console.log('\n--- VERIFICATION TIERS ---');
console.log(tiers);

console.log('\n--- TOP 20 CATEGORIES ---');
const sortedCats = Object.entries(cats).sort((a,b) => b[1] - a[1]).slice(0, 20);
sortedCats.forEach(([cat, count]) => {
  console.log(`- ${cat}: ${count}`);
});

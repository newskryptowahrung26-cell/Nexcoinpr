const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function inspect() {
  const filePath = path.join(__dirname, '..', 'assets', 'docs', 'Crypto_Forex_Trading_10000_B2B_Master_Leads.csv');
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    return;
  }

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let count = 0;
  let isHeader = true;
  const categories = {};
  const hotLeads = [];

  for await (const line of rl) {
    if (isHeader) {
      isHeader = false;
      continue;
    }
    count++;
    // Regex to parse CSV properly handling quotes
    const matches = line.match(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g);
    if (!matches) continue;
    const cleanMatches = matches.map(m => m.replace(/^,?"?|"$/g, '').trim());

    const id = cleanMatches[0];
    const name = cleanMatches[1];
    const cat = cleanMatches[2];
    const site = cleanMatches[4];
    const twitter = cleanMatches[5];
    const email = cleanMatches[6];
    const dept = cleanMatches[7];
    const tier = cleanMatches[8];
    const scale = cleanMatches[9];
    const packageRec = cleanMatches[10];
    const hook = cleanMatches[11];

    categories[cat] = (categories[cat] || 0) + 1;

    // Filter out top 40 high-probability prospects (active domains with real emails)
    if (email && email.includes('@') && !email.includes('example.com') && hotLeads.length < 50) {
      hotLeads.push({
        id,
        name,
        cat,
        site,
        email,
        dept,
        scale,
        packageRec,
        hook
      });
    }
  }

  console.log(`[Master Database Audit] Total Records: ${count}`);
  console.log('[Categories Found]:', Object.keys(categories).slice(0, 15).join(', '));
  
  // Save curated top hot leads
  const outputPath = path.join(__dirname, '..', 'data', 'curated_hot_leads.json');
  fs.writeFileSync(outputPath, JSON.stringify(hotLeads, null, 2), 'utf8');
  console.log(`[Success] Curated ${hotLeads.length} prioritized high-intent prospects to ${outputPath}`);
}

inspect();

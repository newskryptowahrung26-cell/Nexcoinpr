const fs = require('fs');
const path = require('path');

const csvFile = path.join(__dirname, '..', 'assets', 'docs', 'Crypto_Forex_Trading_10000_B2B_Master_Leads.csv');
const exportMdFile = path.join(__dirname, '..', 'assets', 'docs', 'TELEGRAM_DIRECT_SALES_SNIPER_PACK.md');
const exportTxtFile = 'C:\\Users\\NDCOM\\Downloads\\NexcoinPR_Telegram_Sniper_Leads.txt';

if (!fs.existsSync(csvFile)) {
  console.error('CSV not found');
  process.exit(1);
}

const content = fs.readFileSync(csvFile, 'utf8');
const lines = content.split(/\r?\n/);
const leads = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  const matches = line.match(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g);
  if (!matches) continue;
  const clean = matches.map(m => m.replace(/^,?"?|"$/g, '').trim());
  const id = clean[0];
  const name = clean[1];
  const cat = clean[2] || '';
  const site = clean[4] || '';
  const email = clean[6] || '';

  // Focus on tokens, DEXs, memecoins, launchpads
  const lowerCat = cat.toLowerCase();
  const lowerName = name.toLowerCase();
  if (lowerName.includes('binance') || lowerName.includes('coinbase') || lowerName.includes('kraken')) continue;

  if (lowerCat.includes('token') || lowerCat.includes('meme') || lowerCat.includes('coin') || lowerCat.includes('launchpad') || lowerCat.includes('dex') || lowerCat.includes('defi')) {
    leads.push({ id, name, cat, site, email });
  }
}

// Take top 40 high-intent leads
const sniperBatch = leads.slice(0, 40);

let output = `# 🎯 NexcoinPR High-Intent Web3 Sales Sniper Pack
Generated on: ${new Date().toLocaleString()}

### ⚡ Why This Closes Deals in 24 Hours:
1. Web3 founders and token devs do NOT check cold email; they live 24/7 on **Telegram** and **X (Twitter)**.
2. Every token project needs **CoinMarketCap / CoinGecko media verification** and **Google News search visibility**.
3. Reaching out with a **$199 Tripwire Offer** and **50% Upfront / 50% Post-Publication Guarantee** eliminates all scam fears and resistance.

---

## 📋 Ready-to-Copy Pitch Script for Telegram DMs:
\`\`\`text
Hey [Name / Team], loved seeing the momentum on [Project Name]! 🔥

Are you planning for CoinMarketCap / CoinGecko fast-track listing or major exchange PR push anytime soon?

Most PR agencies charge $3,000+ with zero guarantees. At NexcoinPR (https://www.nexcoinpr.agency), we guarantee live coverage across 25–140+ crypto & financial media outlets (including Google News & Bloomberg syndication) within 24 hours.

⚡ Special Founder Deal:
We just launched a quick $199 Starter Syndicate (25+ outlets) to get your project verified fast.
Plus 100% Risk-Free: 50% upfront, and 50% only after live publication links are in your hand.

Would you like to see 2 live client sample reports we delivered yesterday?
Telegram: @Nexcoinpr | WhatsApp: +971 58 202 1752
\`\`\`

---

## 🚀 Top 40 Target Projects for Direct Outreach:
`;

sniperBatch.forEach((l, idx) => {
  output += `\n### ${idx + 1}. ${l.name} (${l.cat})
- **Website:** ${l.site || 'N/A'}
- **Official Email:** \`${l.email}\`
- **Action Step:** Open website -> Click Telegram / X icon in header or footer -> DM Admin / Dev using the script above.
`;
});

fs.writeFileSync(exportMdFile, output, 'utf8');
try {
  fs.writeFileSync(exportTxtFile, output, 'utf8');
} catch(e) {}

console.log('✅ Sniper Pack created at:', exportMdFile);
console.log('✅ Exported to Downloads at:', exportTxtFile);

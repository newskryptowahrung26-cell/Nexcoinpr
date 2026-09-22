const fs = require('fs');
const path = require('path');

const steps = [
  { name: 'Chainwire', file: 'C:/Users/NDCOM/.gemini/antigravity/brain/45d74118-1c97-4e28-8316-86cea5814901/.system_generated/steps/143/content.md' },
  { name: 'Web3Newswire', file: 'C:/Users/NDCOM/.gemini/antigravity/brain/45d74118-1c97-4e28-8316-86cea5814901/.system_generated/steps/144/content.md' },
  { name: 'MarketAcross', file: 'C:/Users/NDCOM/.gemini/antigravity/brain/45d74118-1c97-4e28-8316-86cea5814901/.system_generated/steps/145/content.md' },
  { name: 'FinPR Agency', file: 'C:/Users/NDCOM/.gemini/antigravity/brain/45d74118-1c97-4e28-8316-86cea5814901/.system_generated/steps/146/content.md' },
  { name: 'CryptoVirally', file: 'C:/Users/NDCOM/.gemini/antigravity/brain/45d74118-1c97-4e28-8316-86cea5814901/.system_generated/steps/147/content.md' },
  { name: 'Salient PR', file: 'C:/Users/NDCOM/.gemini/antigravity/brain/45d74118-1c97-4e28-8316-86cea5814901/.system_generated/steps/149/content.md' },
  { name: 'BlockchainPR', file: 'C:/Users/NDCOM/.gemini/antigravity/brain/45d74118-1c97-4e28-8316-86cea5814901/.system_generated/steps/150/content.md' },
  { name: 'Crypto-PR', file: 'C:/Users/NDCOM/.gemini/antigravity/brain/45d74118-1c97-4e28-8316-86cea5814901/.system_generated/steps/151/content.md' },
  { name: 'BTCWire', file: 'C:/Users/NDCOM/.gemini/antigravity/brain/45d74118-1c97-4e28-8316-86cea5814901/.system_generated/steps/152/content.md' },
  { name: 'InfluenceTechPR', file: 'C:/Users/NDCOM/.gemini/antigravity/brain/45d74118-1c97-4e28-8316-86cea5814901/.system_generated/steps/155/content.md' },
  { name: 'Blockman', file: 'C:/Users/NDCOM/.gemini/antigravity/brain/45d74118-1c97-4e28-8316-86cea5814901/.system_generated/steps/157/content.md' },
  { name: 'CryptoPotato', file: 'C:/Users/NDCOM/.gemini/antigravity/brain/45d74118-1c97-4e28-8316-86cea5814901/.system_generated/steps/158/content.md' }
];

let summary = {};

steps.forEach(s => {
  if (!fs.existsSync(s.file)) return;
  const raw = fs.readFileSync(s.file, 'utf8');

  // Title
  const titleMatch = raw.match(/<title>([^<]+)<\/title>/i);
  // Description
  const descMatch = raw.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ||
                    raw.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
  // Headings
  const h1Matches = [...raw.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  const h2Matches = [...raw.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  
  summary[s.name] = {
    title: titleMatch ? titleMatch[1].trim() : 'N/A',
    description: descMatch ? descMatch[1].trim() : 'N/A',
    h1: h1Matches.slice(0, 5),
    h2: h2Matches.slice(0, 10)
  };
});

fs.writeFileSync('C:/Users/NDCOM/.gemini/antigravity/brain/45d74118-1c97-4e28-8316-86cea5814901/competitor_summary.json', JSON.stringify(summary, null, 2));
console.log('Competitor extraction complete');

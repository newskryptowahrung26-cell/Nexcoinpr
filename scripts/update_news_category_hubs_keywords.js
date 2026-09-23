const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. Update news/guides.html
const guidesPath = path.join(rootDir, 'news', 'guides.html');
if (fs.existsSync(guidesPath)) {
  let c = fs.readFileSync(guidesPath, 'utf8');
  
  // Add keywords to meta if not present or expand
  if (c.includes('<title>')) {
    c = c.replace(/<title>(.*?)<\/title>/, `<title>PR &amp; Financial Media Guides — Web3 PR Playbooks &amp; Agency Comparisons | NexcoinPR</title>\n  <meta name="keywords" content="crypto pr guides, what is crypto pr, how to write a crypto press release, crypto press release distribution, chainwire alternative, marketacross review, finpr alternative, coinscribble alternative, pr newswire crypto, forex pr guide, cointelegraph pr wire, web3 pr playbook">`);
  }
  
  // Enrich guide cards with keywords
  c = c.replace(
    'A comprehensive overview of how cryptocurrency public relations operates, why blockchain projects require specialized communications, and how to avoid costly regulatory pitfalls.',
    'Exhaustive master guide covering cryptocurrency PR lifecycle, Tier-1 placements (Cointelegraph, The Block), regulatory compliance (MiCA/SEC), and detailed agency comparisons (NexcoinPR vs Chainwire, MarketAcross, FINPR, Coinscribble).'
  );
  
  c = c.replace(
    'Learn the exact structure journalists look for: impactful headlines, factual lead paragraphs, executive attribution, and proper company boilerplate formatting.',
    'Complete master guide with 4 production-ready templates (TGE, Mainnet, Funding, CEX Listing), AP-style rules, compliance safe harbors, and newswire submission comparisons (Chainwire vs Coinscribble vs NexcoinPR).'
  );
  
  c = c.replace(
    'Understand the technical pipeline: RSS injection, syndication networks, partner news desks, and verification reporting methodologies.',
    'Technical architecture of crypto wire syndication, direct Tier-1 newsroom desks, Wall Street terminal broadcasts (Benzinga, AP News), and exchange listing verification (Binance, CoinMarketCap).'
  );

  fs.writeFileSync(guidesPath, c, 'utf8');
  console.log('Updated news/guides.html');
}

// 2. Update news/crypto.html
const cryptoPath = path.join(rootDir, 'news', 'crypto.html');
if (fs.existsSync(cryptoPath)) {
  let c = fs.readFileSync(cryptoPath, 'utf8');
  if (c.includes('<title>')) {
    c = c.replace(/<title>(.*?)<\/title>/, `<title>Crypto News &amp; Web3 PR Intelligence | NexcoinPR</title>\n  <meta name="keywords" content="crypto news, cryptocurrency pr news, crypto press release distribution, chainwire alternative, marketacross alternative, finpr review, web3 pr wire, cointelegraph press releases, coindesk media distribution">`);
  }
  fs.writeFileSync(cryptoPath, c, 'utf8');
  console.log('Updated news/crypto.html');
}

// 3. Update news/blockchain.html
const blockchainPath = path.join(rootDir, 'news', 'blockchain.html');
if (fs.existsSync(blockchainPath)) {
  let c = fs.readFileSync(blockchainPath, 'utf8');
  if (c.includes('<title>')) {
    c = c.replace(/<title>(.*?)<\/title>/, `<title>Blockchain News &amp; Protocol Infrastructure PR | NexcoinPR</title>\n  <meta name="keywords" content="blockchain news, protocol infrastructure pr, layer 1 layer 2 pr, zero knowledge pr, chainwire alternative, blockchain press release distribution, web3 pr agency">`);
  }
  fs.writeFileSync(blockchainPath, c, 'utf8');
  console.log('Updated news/blockchain.html');
}

// 4. Update news/forex.html
const forexPath = path.join(rootDir, 'news', 'forex.html');
if (fs.existsSync(forexPath)) {
  let c = fs.readFileSync(forexPath, 'utf8');
  if (c.includes('<title>')) {
    c = c.replace(/<title>(.*?)<\/title>/, `<title>Forex News &amp; Currency Broker PR Intelligence | NexcoinPR</title>\n  <meta name="keywords" content="forex news, forex broker pr, cfd trading pr, prop firm pr, finance magnates press release, fxstreet media placement, investing.com sponsored pr">`);
  }
  fs.writeFileSync(forexPath, c, 'utf8');
  console.log('Updated news/forex.html');
}

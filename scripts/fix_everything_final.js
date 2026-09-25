const fs = require('fs');
const path = require('path');
const https = require('https');

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

// 1. Precise Title Map (All strictly <= 55 characters)
const TITLE_MAP = {
  'index.html': 'Crypto & Forex PR Agency: Tier-1 Wire | NexcoinPR',
  'services.html': 'PR Services: Crypto, Forex & Financial | NexcoinPR',
  'crypto-pr.html': 'Crypto PR Agency: Guaranteed Media | NexcoinPR',
  'forex-pr.html': 'Forex PR Agency: Broker & Prop Firm PR | NexcoinPR',
  'blockchain-pr.html': 'Blockchain PR Agency: Layer 1/2 & ZK PR | NexcoinPR',
  'web3-pr.html': 'Web3 PR Agency: DeFi, dApps & DAO PR | NexcoinPR',
  'fintech-pr.html': 'Fintech PR Agency: Payments Tech PR | NexcoinPR',
  'financial-pr.html': 'Financial PR Agency: Capital Markets PR | NexcoinPR',
  'press-release-distribution.html': 'Crypto & Forex PR Distribution Wire | NexcoinPR',
  'press-releases.html': 'Press Releases: Crypto & Forex News | NexcoinPR',
  'pricing.html': 'Crypto & Forex PR Pricing Packages | NexcoinPR',
  'markets.html': 'Crypto Trading Hub & Live Markets | NexcoinPR',
  'media.html': 'Media Network: Distribution Channels | NexcoinPR',
  'case-studies.html': 'Case Studies: Verified Media Results | NexcoinPR',
  'about.html': 'About NexcoinPR: Mission & Standards | NexcoinPR',
  'faq.html': 'FAQ: Crypto PR & Press Distribution | NexcoinPR',
  'authors.html': 'Authors: Financial Journalists & Team | NexcoinPR',
  'authors/editorial-team.html': 'Editorial Team: Author Profiles | NexcoinPR',
  'companies.html': 'Companies: Crypto & Fintech Profiles | NexcoinPR',
  'glossary.html': 'Glossary: Crypto & Forex Terminology | NexcoinPR',
  'contact.html': 'Contact NexcoinPR: Editorial & Press | NexcoinPR',
  'editorial-policy.html': 'Editorial Policy & Ethics Guidelines | NexcoinPR',
  'corrections-policy.html': 'Corrections Policy & Fact Checking | NexcoinPR',
  'disclaimer.html': 'Financial Disclaimer & Disclosures | NexcoinPR',
  'privacy-policy.html': 'Privacy Policy: Data Protection | NexcoinPR',
  'terms.html': 'Terms of Service & Wire Agreement | NexcoinPR',
  'cookie-policy.html': 'Cookie Policy & Tracking Consent | NexcoinPR',
  'news.html': 'Crypto & Forex News: Markets Hub | NexcoinPR',
  'news/crypto.html': 'Crypto News & Web3 PR Intelligence | NexcoinPR',
  'news/forex.html': 'Forex News: Central Banks & Currency | NexcoinPR',
  'news/blockchain.html': 'Blockchain News & Protocol Tech | NexcoinPR',
  'news/web3.html': 'Web3 & DeFi Protocol News Intelligence | NexcoinPR',
  'news/fintech.html': 'Fintech News: Digital Banking & Pay | NexcoinPR',
  'news/financial-markets.html': 'Financial Markets News: Macro Trends | NexcoinPR',
  'news/guides.html': 'PR & Financial Media Guides: Web3 | NexcoinPR',
  'news/guides/what-is-crypto-pr.html': 'What Is Crypto PR? The 2026 Guide | NexcoinPR',
  'news/guides/how-to-write-a-crypto-press-release.html': 'How to Write a Crypto Press Release | NexcoinPR',
  'news/guides/what-is-forex-pr.html': 'What Is Forex PR? Currency PR Guide | NexcoinPR',
  'news/guides/how-press-release-distribution-works.html': 'How Press Release Distribution Works | NexcoinPR',
  'news/bitcoin-slips-under-84k-us-treasury-yields-surge.html': 'Bitcoin Under $84K as Yields Surge | NexcoinPR',
  'news/bitgets-352-million-hack-happened-via-spoofed-transfers-not-private-keys-ce.html': 'Bitget $352M Exploit via Spoofing | NexcoinPR',
  'news/trump-administration-weighs-a-global-stablecoin-plan-to-cement-dollar-s-dom.html': 'Trump Stablecoin Plan for US Dollar | NexcoinPR',
  'news/usd-jpy-outlook-fed-recalibration-pressures-yen.html': 'USD/JPY Outlook: Hawkish Fed & Yen | NexcoinPR',
  'press-releases/bcgames-bc-engine-rewards-surpass-86-million-as-ecosystem-growth-accelerate.html': 'BC.GAME BC Engine Rewards Top $8.6M | NexcoinPR',
  'press-releases/cregis-marks-two-years-of-middle-east-growth-as-traditional-financial-firms.html': 'Cregis Marks 2 Years of ME Growth | NexcoinPR',
  'press-releases/easy-lemon-announces-new-guide-explaining-vehicle-buybacks-calculated-under.html': 'Easy Lemon Releases Lemon Law Guide | NexcoinPR',
  'press-releases/lbank-ranks-no-1-for-mainstream-crypto-5216m-and-stock-depth-44x-in-beincry.html': 'LBank Ranks #1 for Crypto Liquidity | NexcoinPR',
  'press-releases/nextlm-brings-its-ai-prospecting-agent-to-google-cloud-marketplace-and-gemi.html': 'NextLM Launches AI Agent on GCP | NexcoinPR',
  'press-releases/sample-press-release.html': 'AuraChain Deploys High-Capacity L2 | NexcoinPR',
  'press-releases/streamex-converts-interest-into-capital-as-gldy-investment-strategy-secures.html': 'Streamex Secures $1M+ for GLDY | NexcoinPR',
  'press-releases/the-biggest-technology-booms-have-one-overlooked-thing-in-common-motors-nas.html': 'Motors (NASDAQ: EMAT): Powering Tech | NexcoinPR',
  'teaser-video.html': 'NexcoinPR Teaser Video & Preview | NexcoinPR'
};

// 2. Concise Meta Descriptions Map (All strictly <= 145 characters)
const META_MAP = {
  'blockchain-pr.html': 'NexcoinPR is the premier blockchain PR agency for Layer-1/2 networks, ZK protocols, and smart contracts. Tier-1 syndication from $800.',
  'financial-pr.html': 'NexcoinPR is the premier financial PR agency for asset managers, hedge funds, and fintech firms. Tier-1 financial syndication from $800.',
  'forex-pr.html': 'Leading forex PR agency for FX brokers, prop trading firms, and CFD platforms. Guaranteed Tier-1 media syndication from $800.',
  'markets.html': 'Track real-time crypto prices, buy with fiat, test strategies with a demo paper account, and trade Spot & Futures with fee discounts.',
  'news/guides/what-is-crypto-pr.html': 'Discover what crypto PR is, how it differs from traditional PR, agency models, pricing, and how to earn Tier-1 media coverage.',
  'press-release-distribution.html': 'Premier press release distribution newswire for crypto, forex, and fintech brands. Guaranteed Tier-1 syndication from $800.',
  'pricing.html': 'Media distribution packages and direct single placements across 144+ top outlets including Forbes, Decrypt, and Cointelegraph.',
  'about.html': 'NexcoinPR is a global PR and wire distribution agency for crypto, Web3, forex, and fintech brands. Learn about our mission and standards.',
  'crypto-pr.html': 'NexcoinPR delivers guaranteed crypto PR across CoinDesk, Cointelegraph, and Decrypt. Transparent pricing from $800 with 24-48h execution.',
  'fintech-pr.html': 'NexcoinPR is the leading fintech PR agency for payment gateways, neobanks, and wealthtech. Guaranteed Tier-1 media coverage from $800.',
  'index.html': 'PR and press release distribution agency for crypto, blockchain, Web3, forex, and fintech brands. Get published in Tier-1 media.',
  'news/guides/how-press-release-distribution-works.html': 'Learn how crypto press release distribution works, from editorial review to Tier-1 syndication. Compare wires and SEO impact.',
  'news/guides/how-to-write-a-crypto-press-release.html': 'Learn how to write a high-impact crypto press release that editors publish. Includes 4 real Web3 templates and compliance tips.',
  'news/guides/what-is-forex-pr.html': 'Discover what Forex PR is, how FX brokers build credibility, acquire traders, and earn media coverage across Finance Magnates.',
  'web3-pr.html': 'NexcoinPR is the premier Web3 PR agency for DeFi protocols, dApps, DePIN, and DAOs. Guaranteed Tier-1 syndication from $800.'
};

console.log('--- 1. UPDATING TITLES AND META DESCRIPTIONS ---');
htmlFiles.forEach(f => {
  const rel = path.relative(ROOT, f).replace(/\\/g, '/');
  let content = fs.readFileSync(f, 'utf8');

  // Title
  if (TITLE_MAP[rel]) {
    content = content.replace(/<title>[^<]*<\/title>/i, `<title>${TITLE_MAP[rel]}</title>`);
  }

  // Meta description
  if (META_MAP[rel]) {
    content = content.replace(/(<meta\s+[^>]*name=["']description["'][^>]*content=["'])([^"']*)(["'][^>]*>)/i, `$1${META_MAP[rel]}$3`);
    content = content.replace(/(<meta\s+[^>]*content=["'])([^"']*)(["'][^>]*name=["']description["'][^>]*>)/i, `$1${META_MAP[rel]}$3`);
  }

  // Clean canonical and og:url
  const cleanUrl = rel === 'index.html' ? 'https://www.nexcoinpr.agency/' : `https://www.nexcoinpr.agency/${rel.replace(/\.html$/, '')}`;

  // Ensure Complete Open Graph tags
  const ogTitle = TITLE_MAP[rel] || 'NexcoinPR';
  const ogDesc = META_MAP[rel] || 'NexcoinPR is a premier PR and press release distribution newswire for crypto, forex, and fintech.';
  const defaultImage = 'https://www.nexcoinpr.agency/assets/images/nexcoinpr-logo-dark.jpg';

  // Check if og:image exists
  if (!content.includes('property="og:image"') && !content.includes("property='og:image'")) {
    // Add og:image before </head>
    content = content.replace('</head>', `  <meta property="og:image" content="${defaultImage}">\n</head>`);
  }

  // Check if og:title exists
  if (!content.includes('property="og:title"') && !content.includes("property='og:title'")) {
    content = content.replace('</head>', `  <meta property="og:title" content="${ogTitle}">\n</head>`);
  } else {
    // Update existing og:title to matching clean title
    content = content.replace(/(<meta\s+[^>]*property=["']og:title["'][^>]*content=["'])([^"']*)(["'][^>]*>)/i, `$1${ogTitle}$3`);
  }

  // Check if og:description exists
  if (!content.includes('property="og:description"') && !content.includes("property='og:description'")) {
    content = content.replace('</head>', `  <meta property="og:description" content="${ogDesc}">\n</head>`);
  } else if (META_MAP[rel]) {
    content = content.replace(/(<meta\s+[^>]*property=["']og:description["'][^>]*content=["'])([^"']*)(["'][^>]*>)/i, `$1${ogDesc}$3`);
  }

  // Check if og:url exists
  if (!content.includes('property="og:url"') && !content.includes("property='og:url'")) {
    content = content.replace('</head>', `  <meta property="og:url" content="${cleanUrl}">\n</head>`);
  }

  // Check if og:type exists
  if (!content.includes('property="og:type"') && !content.includes("property='og:type'")) {
    const isArticle = rel.startsWith('news/') || rel.startsWith('press-releases/');
    content = content.replace('</head>', `  <meta property="og:type" content="${isArticle ? 'article' : 'website'}">\n</head>`);
  }

  // Check if twitter:image exists
  if (!content.includes('name="twitter:image"') && !content.includes("name='twitter:image'")) {
    content = content.replace('</head>', `  <meta name="twitter:image" content="${defaultImage}">\n</head>`);
  }

  fs.writeFileSync(f, content, 'utf8');
});
console.log('Updated titles, descriptions, and Open Graph tags across all HTML files.');

// 3. Create IndexNow key file
const indexNowKey = '8f8b89694e9f45618b76a084795e1e12';
fs.writeFileSync(path.join(ROOT, `${indexNowKey}.txt`), indexNowKey, 'utf8');
console.log(`Created IndexNow key file: ${indexNowKey}.txt`);

// 4. Submit to IndexNow
const sitemaps = ['sitemap-pages.xml', 'sitemap-news.xml', 'sitemap-press-releases.xml'];
let allUrls = [];
sitemaps.forEach(sm => {
  const p = path.join(ROOT, sm);
  if (fs.existsSync(p)) {
    const c = fs.readFileSync(p, 'utf8');
    const matches = c.matchAll(/<loc>([^<]+)<\/loc>/g);
    for (const m of matches) allUrls.push(m[1]);
  }
});
allUrls = [...new Set(allUrls)];

console.log(`Submitting ${allUrls.length} clean URLs to IndexNow...`);
const payload = JSON.stringify({
  host: 'www.nexcoinpr.agency',
  key: indexNowKey,
  keyLocation: `https://www.nexcoinpr.agency/${indexNowKey}.txt`,
  urlList: allUrls
});

const req = https.request('https://api.indexnow.org/IndexNow', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload)
  }
}, res => {
  console.log(`IndexNow API Response Status: ${res.statusCode} (${res.statusMessage})`);
  let resBody = '';
  res.on('data', d => resBody += d);
  res.on('end', () => console.log('IndexNow submission finished.', resBody));
});

req.on('error', e => console.error('IndexNow submission error:', e.message));
req.write(payload);
req.end();

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// 1. TITLES MAP (All <= 60 characters)
const TITLE_MAP = {
  'authors/editorial-team.html': 'Editorial Team: Author Profiles & Articles | NexcoinPR',
  'blockchain-pr.html': 'Blockchain PR Agency: Layer 1/2 & ZK Protocol PR | NexcoinPR',
  'case-studies.html': 'Case Studies: Verified PR & Media Results | NexcoinPR',
  'companies.html': 'Companies Directory: Crypto & Fintech Brands | NexcoinPR',
  'crypto-pr.html': 'Crypto PR Agency: Guaranteed Tier-1 Media | NexcoinPR',
  'faq.html': 'FAQ: Crypto PR & Press Release Distribution | NexcoinPR',
  'financial-pr.html': 'Financial PR Agency: Capital Markets & Asset PR | NexcoinPR',
  'fintech-pr.html': 'Fintech PR Agency: Payments & Wealthtech PR | NexcoinPR',
  'forex-pr.html': 'Forex PR Agency: Broker, Prop Firm & FX PR | NexcoinPR',
  'media.html': 'Media Network: Verified Distribution Channels | NexcoinPR',
  'news/bitcoin-slips-under-84k-us-treasury-yields-surge.html': 'Bitcoin Drops Under $84K as Treasury Yields Surge | NexcoinPR',
  'news/bitgets-352-million-hack-happened-via-spoofed-transfers-not-private-keys-ce.html': 'Bitget $352M Exploit via Spoofed Transfers | NexcoinPR',
  'news/financial-markets.html': 'Financial Markets News: Central Banks & Macro | NexcoinPR',
  'news/fintech.html': 'Fintech News: Digital Banking & Payments Tech | NexcoinPR',
  'news/guides/how-press-release-distribution-works.html': 'How Crypto Press Release Distribution Works | NexcoinPR',
  'news/guides/how-to-write-a-crypto-press-release.html': 'How to Write a Crypto Press Release: Guide | NexcoinPR',
  'news/guides/what-is-crypto-pr.html': 'What Is Crypto PR? The Complete 2026 Guide | NexcoinPR',
  'news/guides/what-is-forex-pr.html': 'What Is Forex PR? Currency Broker PR Guide | NexcoinPR',
  'news/guides.html': 'PR & Financial Media Guides: Web3 Playbooks | NexcoinPR',
  'news/trump-administration-weighs-a-global-stablecoin-plan-to-cement-dollar-s-dom.html': 'Trump Weighs Global Stablecoin Framework Plan | NexcoinPR',
  'news/usd-jpy-outlook-fed-recalibration-pressures-yen.html': 'USD/JPY Outlook: Hawkish Fed Pressures Yen | NexcoinPR',
  'news.html': 'Crypto & Forex News: Financial Markets News | NexcoinPR',
  'press-release-distribution.html': 'Crypto & Forex Press Release Distribution | NexcoinPR',
  'press-releases/bcgames-bc-engine-rewards-surpass-86-million-as-ecosystem-growth-accelerate.html': 'BC.GAME BC Engine Rewards Surpass $8.6M | NexcoinPR',
  'press-releases/cregis-marks-two-years-of-middle-east-growth-as-traditional-financial-firms.html': 'Cregis Marks 2 Years of Middle East Growth | NexcoinPR',
  'press-releases/easy-lemon-announces-new-guide-explaining-vehicle-buybacks-calculated-under.html': 'Easy Lemon Releases Lemon Law Buyback Guide | NexcoinPR',
  'press-releases/lbank-ranks-no-1-for-mainstream-crypto-5216m-and-stock-depth-44x-in-beincry.html': 'LBank Ranks #1 for Mainstream Crypto Depth | NexcoinPR',
  'press-releases/nextlm-brings-its-ai-prospecting-agent-to-google-cloud-marketplace-and-gemi.html': 'NextLM Launches AI Agent on Google Cloud | NexcoinPR',
  'press-releases/sample-press-release.html': 'AuraChain Deploys High-Capacity L2 Mainnet | NexcoinPR',
  'press-releases/streamex-converts-interest-into-capital-as-gldy-investment-strategy-secures.html': 'Streamex Secures $1M+ Allocation for GLDY | NexcoinPR',
  'press-releases/the-biggest-technology-booms-have-one-overlooked-thing-in-common-motors-nas.html': 'Motors (NASDAQ: EMAT): Powering Tech Booms | NexcoinPR',
  'press-releases.html': 'Press Releases: Crypto & Forex Announcements | NexcoinPR',
  'pricing.html': 'Crypto & Forex PR Pricing & Media Packages | NexcoinPR',
  'services.html': 'PR Services: Crypto, Forex & Financial Agency | NexcoinPR',
  'web3-pr.html': 'Web3 PR Agency: DeFi, dApps, DePIN & DAO PR | NexcoinPR'
};

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

console.log('--- 1. UPDATING TITLE TAGS (< 60 chars) ---');
let titlesUpdated = 0;
htmlFiles.forEach(f => {
  const rel = path.relative(ROOT, f).replace(/\\/g, '/');
  if (TITLE_MAP[rel]) {
    let content = fs.readFileSync(f, 'utf8');
    const newTitle = TITLE_MAP[rel];
    content = content.replace(/<title>[^<]*<\/title>/i, `<title>${newTitle}</title>`);
    fs.writeFileSync(f, content, 'utf8');
    titlesUpdated++;
  }
});
console.log(`Updated ${titlesUpdated} page titles.`);

console.log('\n--- 2. FIXING ORPHANED PRESS RELEASE IN PRESS-RELEASES.HTML ---');
const prFile = path.join(ROOT, 'press-releases.html');
if (fs.existsSync(prFile)) {
  let prContent = fs.readFileSync(prFile, 'utf8');
  if (!prContent.includes('/press-releases/the-biggest-technology-booms-have-one-overlooked-thing-in-common-motors-nas')) {
    const newCard = `            <article class="pr-card" data-category="financial">
              <div class="pr-card-header">
                <span class="content-label">Press Release</span>
                <span class="badge badge-financial">Financial</span>
                <span class="pr-card-company">Motors (NASDAQ: EMAT)</span>
                <span class="pr-card-date">23 September 2026</span>
              </div>
              <h2 class="pr-card-title">
                <a href="/press-releases/the-biggest-technology-booms-have-one-overlooked-thing-in-common-motors-nas">Motors (NASDAQ: EMAT): Powering Electric Vehicles &amp; AI Data Center Booms</a>
              </h2>
              <p class="pr-card-excerpt">Electric cars topped 20M sales in 2025 while AI data center power demand jumped 50%, highlighting motor innovations from EMAT.</p>
              <div class="pr-card-footer">
                <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
                  <span class="tag">Financial</span>
                </div>
                <a href="/press-releases/the-biggest-technology-booms-have-one-overlooked-thing-in-common-motors-nas" class="pr-card-read">Read full release &rarr;</a>
              </div>
            </article>`;
    prContent = prContent.replace('<div class="pr-grid" data-filter-container>', `<div class="pr-grid" data-filter-container>\n${newCard}`);
    fs.writeFileSync(prFile, prContent, 'utf8');
    console.log('Added missing article card to press-releases.html');
  }
}

console.log('\n--- 3. ADDING MARKETS LINK TO FOOTERS FOR SITE-WIDE INCOMING EQUITY ---');
let footersUpdated = 0;
htmlFiles.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('<li><a href="/crypto-pr">Crypto PR</a></li>') && !content.includes('<li><a href="/markets">Live Markets</a></li>')) {
    content = content.replace(
      '<li><a href="/crypto-pr">Crypto PR</a></li>',
      '<li><a href="/markets">Live Markets</a></li>\n            <li><a href="/crypto-pr">Crypto PR</a></li>'
    );
    fs.writeFileSync(f, content, 'utf8');
    footersUpdated++;
  }
});
console.log(`Added Markets to ${footersUpdated} footer menus.`);

console.log('\n--- 4. FIXING AND ENRICHING STRUCTURED DATA (JSON-LD) ---');
// 4a. Fix news/crypto.html schema
const cryptoHtmlFile = path.join(ROOT, 'news', 'crypto.html');
if (fs.existsSync(cryptoHtmlFile)) {
  let c = fs.readFileSync(cryptoHtmlFile, 'utf8');
  c = c.replace(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?"@type":\s*"NewsArticle"[\s\S]*?<\/script>/i, `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Crypto News & Web3 PR Intelligence",
    "url": "https://www.nexcoinpr.agency/news/crypto",
    "description": "Latest cryptocurrency news, Bitcoin updates, Ethereum developments, and crypto press release distribution intelligence from NexcoinPR."
  }
  </script>`);
  fs.writeFileSync(cryptoHtmlFile, c, 'utf8');
  console.log('Replaced invalid NewsArticle schema with CollectionPage in news/crypto.html');
}

// 4b. Ensure all NewsArticle / Article have image, publisher logo, and mainEntityOfPage
let articlesEnriched = 0;
htmlFiles.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('"@type": "NewsArticle"') || content.includes('"@type": "Article"') || content.includes('"@type":"NewsArticle"')) {
    // Check if missing image inside schema
    const rel = path.relative(ROOT, f).replace(/\\/g, '/');
    const cleanUrl = rel === 'index.html' ? 'https://www.nexcoinpr.agency/' : `https://www.nexcoinpr.agency/${rel.replace(/\.html$/, '')}`;

    content = content.replace(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi, (m, jsonStr) => {
      try {
        let parsed = JSON.parse(jsonStr.trim());
        let modified = false;

        function enrichItem(item) {
          if (item['@type'] === 'NewsArticle' || item['@type'] === 'Article') {
            if (!item.image) {
              item.image = 'https://www.nexcoinpr.agency/assets/images/nexcoinpr-logo-dark.jpg';
              modified = true;
            }
            if (!item.mainEntityOfPage) {
              item.mainEntityOfPage = {
                "@type": "WebPage",
                "@id": cleanUrl
              };
              modified = true;
            }
            if (item.publisher && typeof item.publisher === 'object' && !item.publisher.logo) {
              item.publisher.logo = {
                "@type": "ImageObject",
                "url": "https://www.nexcoinpr.agency/assets/images/nexcoinpr-logo-dark.jpg"
              };
              modified = true;
            }
          }
        }

        if (Array.isArray(parsed)) parsed.forEach(enrichItem);
        else if (parsed['@graph']) parsed['@graph'].forEach(enrichItem);
        else enrichItem(parsed);

        if (modified) {
          articlesEnriched++;
          return `<script type="application/ld+json">\n${JSON.stringify(parsed, null, 2)}\n  </script>`;
        }
      } catch (e) {}
      return m;
    });

    fs.writeFileSync(f, content, 'utf8');
  }
});
console.log(`Enriched ${articlesEnriched} NewsArticle schemas with image, mainEntityOfPage, and publisher logo.`);

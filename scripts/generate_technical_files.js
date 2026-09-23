const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve('d:/Agency Site');
const SITE_URL = 'https://nexcoinpr.com';
const TODAY = '2026-09-22';

// 1. sitemap.xml (Sitemap Index)
const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap-pages.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-news.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-press-releases.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
</sitemapindex>
`;
fs.writeFileSync(path.join(BASE_DIR, 'sitemap.xml'), sitemapIndexXml);
console.log('Created sitemap.xml');

// 2. sitemap-pages.xml
const pagesList = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/services.html', priority: '0.9', changefreq: 'weekly' },
  { loc: '/crypto-pr.html', priority: '0.9', changefreq: 'weekly' },
  { loc: '/forex-pr.html', priority: '0.9', changefreq: 'weekly' },
  { loc: '/blockchain-pr.html', priority: '0.9', changefreq: 'weekly' },
  { loc: '/web3-pr.html', priority: '0.9', changefreq: 'weekly' },
  { loc: '/fintech-pr.html', priority: '0.9', changefreq: 'weekly' },
  { loc: '/financial-pr.html', priority: '0.9', changefreq: 'weekly' },
  { loc: '/press-release-distribution.html', priority: '0.95', changefreq: 'daily' },
  { loc: '/press-releases.html', priority: '0.9', changefreq: 'daily' },
  { loc: '/pricing.html', priority: '0.85', changefreq: 'monthly' },
  { loc: '/media.html', priority: '0.8', changefreq: 'monthly' },
  { loc: '/case-studies.html', priority: '0.8', changefreq: 'monthly' },
  { loc: '/about.html', priority: '0.8', changefreq: 'monthly' },
  { loc: '/faq.html', priority: '0.8', changefreq: 'monthly' },
  { loc: '/authors.html', priority: '0.7', changefreq: 'monthly' },
  { loc: '/authors/editorial-team.html', priority: '0.7', changefreq: 'monthly' },
  { loc: '/companies.html', priority: '0.75', changefreq: 'weekly' },
  { loc: '/glossary.html', priority: '0.8', changefreq: 'monthly' },
  { loc: '/contact.html', priority: '0.85', changefreq: 'monthly' },
  { loc: '/editorial-policy.html', priority: '0.6', changefreq: 'yearly' },
  { loc: '/corrections-policy.html', priority: '0.6', changefreq: 'yearly' },
  { loc: '/disclaimer.html', priority: '0.6', changefreq: 'yearly' },
  { loc: '/privacy-policy.html', priority: '0.5', changefreq: 'yearly' },
  { loc: '/terms.html', priority: '0.5', changefreq: 'yearly' },
  { loc: '/cookie-policy.html', priority: '0.5', changefreq: 'yearly' }
];

const sitemapPagesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pagesList.map(p => `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(BASE_DIR, 'sitemap-pages.xml'), sitemapPagesXml);
console.log('Created sitemap-pages.xml');

// 3. sitemap-news.xml (Google News Sitemap format)
const newsList = [
  { loc: '/news.html', title: 'Crypto, Forex & Financial Markets News Hub', pubDate: '2026-09-22' },
  { loc: '/news/crypto.html', title: 'Cryptocurrency Industry News & Protocol Developments', pubDate: '2026-09-22' },
  { loc: '/news/forex.html', title: 'Forex Markets, Central Banks and Currency News', pubDate: '2026-09-22' },
  { loc: '/news/blockchain.html', title: 'Blockchain Infrastructure and Consensus Technology News', pubDate: '2026-09-22' },
  { loc: '/news/guides.html', title: 'Crypto & Forex Public Relations Guides and Explainers', pubDate: '2026-09-22' },
  { loc: '/news/guides/what-is-crypto-pr.html', title: 'What Is Crypto PR? Complete Guide to Cryptocurrency Public Relations', pubDate: '2026-09-22' },
  { loc: '/news/guides/how-to-write-a-crypto-press-release.html', title: 'How to Write a Crypto Press Release: Step-by-Step Structure & Template', pubDate: '2026-09-22' },
  { loc: '/news/guides/what-is-forex-pr.html', title: 'What Is Forex PR? A Guide to Foreign Exchange Public Relations', pubDate: '2026-09-22' },
  { loc: '/news/guides/how-press-release-distribution-works.html', title: 'How Press Release Distribution Works: Wire Networks & Syndication', pubDate: '2026-09-22' }
];

const sitemapNewsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsList.map(n => `  <url>
    <loc>${SITE_URL}${n.loc}</loc>
    <news:news>
      <news:publication>
        <news:name>NexcoinPR</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${n.pubDate}</news:publication_date>
      <news:title>${n.title}</news:title>
    </news:news>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(BASE_DIR, 'sitemap-news.xml'), sitemapNewsXml);
console.log('Created sitemap-news.xml');

// 4. sitemap-press-releases.xml
const prList = [
  { loc: '/press-releases.html', priority: '0.9', changefreq: 'daily' },
  { loc: '/press-releases/sample-press-release.html', priority: '0.8', changefreq: 'monthly' }
];

const sitemapPrXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${prList.map(p => `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(BASE_DIR, 'sitemap-press-releases.xml'), sitemapPrXml);
console.log('Created sitemap-press-releases.xml');

// 5. RSS Feeds (RSS 2.0)
function generateRssFeed({ title, description, feedUrl, items }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title}</title>
    <link>${SITE_URL}</link>
    <description>${description}</description>
    <language>en-us</language>
    <lastBuildDate>Tue, 22 Sep 2026 08:00:00 GMT</lastBuildDate>
    <atom:link href="${SITE_URL}/${feedUrl}" rel="self" type="application/rss+xml" />
${items.map(item => `    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${SITE_URL}${item.link}</link>
      <guid isPermaLink="true">${SITE_URL}${item.link}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <description><![CDATA[${item.description}]]></description>
      <category>${item.category}</category>
    </item>`).join('\n')}
  </channel>
</rss>
`;
}

// Feed 1: feed.xml (All News)
const allNewsFeed = generateRssFeed({
  title: "NexcoinPR — Crypto, Forex & Financial News Feed",
  description: "Latest news, regulatory analysis, and market explainers from NexcoinPR's financial media desk.",
  feedUrl: "feed.xml",
  items: [
    {
      title: "Zero-Knowledge Prover Latency Drops 40% Across Major Testnets",
      link: "/news/blockchain.html",
      pubDate: "Tue, 22 Sep 2026 08:00:00 GMT",
      description: "Benchmark data indicates hardware acceleration optimizations are significantly compressing verification costs for modular rollups.",
      category: "Blockchain"
    },
    {
      title: "Central Banks Evaluate Real-Time FX Liquidity Buffers",
      link: "/news/forex.html",
      pubDate: "Mon, 21 Sep 2026 14:00:00 GMT",
      description: "Monetary authorities analyze intraday currency volatility and interbank settlement buffers.",
      category: "Forex"
    },
    {
      title: "What Is Crypto PR? Complete Guide to Cryptocurrency Public Relations",
      link: "/news/guides/what-is-crypto-pr.html",
      pubDate: "Sun, 20 Sep 2026 09:30:00 GMT",
      description: "An educational guide examining earned media, media relations, and reputation management for digital asset protocols.",
      category: "Guides"
    }
  ]
});
fs.writeFileSync(path.join(BASE_DIR, 'feed.xml'), allNewsFeed);
console.log('Created feed.xml');

// Feed 2: feed-crypto.xml
const cryptoFeed = generateRssFeed({
  title: "NexcoinPR — Crypto News Feed",
  description: "Cryptocurrency market developments, Web3 dApps, and blockchain protocol news.",
  feedUrl: "feed-crypto.xml",
  items: [
    {
      title: "Zero-Knowledge Prover Latency Drops 40% Across Major Testnets",
      link: "/news/blockchain.html",
      pubDate: "Tue, 22 Sep 2026 08:00:00 GMT",
      description: "Hardware acceleration optimizations compress state verification overhead for Ethereum Layer 2 rollups.",
      category: "Crypto"
    },
    {
      title: "Decentralized Physical Infrastructure Networks Reach Compute Milestones",
      link: "/news/crypto.html",
      pubDate: "Mon, 21 Sep 2026 12:00:00 GMT",
      description: "Distributed GPU grids demonstrate real-world utility for open-source AI model inference.",
      category: "Crypto"
    }
  ]
});
fs.writeFileSync(path.join(BASE_DIR, 'feed-crypto.xml'), cryptoFeed);
console.log('Created feed-crypto.xml');

// Feed 3: feed-forex.xml
const forexFeed = generateRssFeed({
  title: "NexcoinPR — Forex & Currency News Feed",
  description: "Foreign exchange markets, currency trading technology, and macroeconomic policy.",
  feedUrl: "feed-forex.xml",
  items: [
    {
      title: "Central Banks Evaluate Real-Time FX Liquidity Buffers",
      link: "/news/forex.html",
      pubDate: "Mon, 21 Sep 2026 14:00:00 GMT",
      description: "Macro analysis of central bank interest rate projections and cross-border currency settlement channels.",
      category: "Forex"
    },
    {
      title: "Retail Brokers Expand Algorithmic Risk Management Integrations",
      link: "/news/forex.html",
      pubDate: "Fri, 18 Sep 2026 10:00:00 GMT",
      description: "Multi-asset currency platforms deploy real-time slippage monitoring tools for retail traders.",
      category: "Forex"
    }
  ]
});
fs.writeFileSync(path.join(BASE_DIR, 'feed-forex.xml'), forexFeed);
console.log('Created feed-forex.xml');

// Feed 4: feed-press-releases.xml
const prFeed = generateRssFeed({
  title: "NexcoinPR — Corporate Press Releases Feed",
  description: "Verified corporate announcements and press releases from crypto, forex, and fintech organizations.",
  feedUrl: "feed-press-releases.xml",
  items: [
    {
      title: "[Press Release] AuraChain Deploys High-Throughput Layer 2 Mainnet with Zero-Knowledge State Compression",
      link: "/press-releases/sample-press-release.html",
      pubDate: "Tue, 22 Sep 2026 09:00:00 GMT",
      description: "Official press release: AuraChain Foundation deploys Layer 2 mainnet with EVM equivalence and verified audits.",
      category: "Press Release"
    }
  ]
});
fs.writeFileSync(path.join(BASE_DIR, 'feed-press-releases.xml'), prFeed);
console.log('Created feed-press-releases.xml');

// 6. llms.txt (Standardized concise AI Context)
const llmsTxt = `# NexcoinPR

> NexcoinPR is a professional international public relations and press release distribution agency specializing in cryptocurrency, blockchain, Web3, DeFi, foreign exchange (forex), and financial technology (fintech) communications.

## Brand Identity & Operating Model
- **Agency Name:** NexcoinPR
- **Website:** https://nexcoinpr.com
- **Official Contact:** nexcoinpr@gmail.com
- **Business Focus:** PR campaigns, wire syndication, media outreach, and financial news publication for digital asset protocols, forex brokers, and fintech innovators.
- **Content Architecture:** The platform features ONE unified content hub: \`/news/\` (covering Breaking News, Crypto, Forex, Blockchain, Web3, Fintech, Financial Markets, PR Insights, and Guides). There is NO separate /blog/.
- **Commercial Content Transparency:** All paid press releases and sponsored materials are explicitly labeled as "Press Release" or "Client Content" to separate client communications from independent editorial reporting.

## Core PR Services
- [Crypto PR](https://nexcoinpr.com/crypto-pr.html): Strategic media relations for cryptocurrency projects, token foundations, and crypto exchanges.
- [Forex PR](https://nexcoinpr.com/forex-pr.html): Communications and regulatory milestone announcements for foreign exchange brokers and trading venues.
- [Blockchain PR](https://nexcoinpr.com/blockchain-pr.html): Technical messaging for Layer 1/2 networks, cryptography research, and enterprise ledgers.
- [Web3 PR](https://nexcoinpr.com/web3-pr.html): Launch campaigns and governance communications for dApps, DAOs, and DeFi protocols.
- [Fintech PR](https://nexcoinpr.com/fintech-pr.html): Public relations for payment gateways, neobanks, regtech, and wealthtech startups.
- [Financial PR](https://nexcoinpr.com/financial-pr.html): Corporate communications for asset managers, hedge funds, and capital markets platforms.
- [Press Release Distribution](https://nexcoinpr.com/press-release-distribution.html): Multi-channel wire transmission across crypto and financial media endpoints.

## Content & Educational Resources
- [News Hub](https://nexcoinpr.com/news.html): Daily reporting on crypto, forex, and fintech market trends.
- [Crypto News](https://nexcoinpr.com/news/crypto.html): Coverage of digital assets, tokenomics, and decentralized networks.
- [Forex News](https://nexcoinpr.com/news/forex.html): Macroeconomic analysis, central bank decisions, and currency benchmarks.
- [Blockchain News](https://nexcoinpr.com/news/blockchain.html): In-depth reporting on consensus mechanics, scaling, and privacy proofs.
- [PR Guides & Explainers](https://nexcoinpr.com/news/guides.html): Comprehensive educational guides.
  - [What Is Crypto PR?](https://nexcoinpr.com/news/guides/what-is-crypto-pr.html)
  - [How to Write a Crypto Press Release](https://nexcoinpr.com/news/guides/how-to-write-a-crypto-press-release.html)
  - [What Is Forex PR?](https://nexcoinpr.com/news/guides/what-is-forex-pr.html)
  - [How Press Release Distribution Works](https://nexcoinpr.com/news/guides/how-press-release-distribution-works.html)
- [Glossary](https://nexcoinpr.com/glossary.html): Factual definitions for 20+ financial and blockchain terms.
- [Press Releases](https://nexcoinpr.com/press-releases.html): Permanent repository of client announcements and commercial disclosures.

## Trust & Governance
- [Editorial Policy](https://nexcoinpr.com/editorial-policy.html): Complete standards on independence, labeling, and source attribution.
- [Corrections Policy](https://nexcoinpr.com/corrections-policy.html): Procedures for submitting and handling factual amendments.
- [Financial Disclaimer](https://nexcoinpr.com/disclaimer.html): Explicit statement that content does not constitute financial, investment, or legal advice.
- [About NexcoinPR](https://nexcoinpr.com/about.html): Agency mission, core team, and operational standards.
- [Contact](https://nexcoinpr.com/contact.html): Official inquiry forms and departmental email channels.
`;
fs.writeFileSync(path.join(BASE_DIR, 'llms.txt'), llmsTxt);
console.log('Created llms.txt');

// 7. llms-full.txt (Comprehensive LLM context)
const llmsFullTxt = `# NexcoinPR — Full Organizational & Structural Reference Document

## 1. Executive Summary & Brand Positioning
NexcoinPR is a premier international public relations agency, press release distribution platform, and digital financial media publication. Operating at the confluence of digital asset innovation, currency markets, and institutional fintech, NexcoinPR delivers strategic media relations, targeted wire distribution, and independent industry journalism.

- **Official Brand Name:** NexcoinPR
- **Canonical Website:** https://nexcoinpr.com
- **Core Email Contacts:**
  - Client & General Enquiries: nexcoinpr@gmail.com
  - Media & Press Desk: nexcoinpr@gmail.com
  - Editorial Corrections: nexcoinpr@gmail.com
  - Privacy Officer: nexcoinpr@gmail.com

## 2. Core Operational Pillars
1. **Strategic PR & Earned Media:** Delivering targeted media outreach, executive thought leadership, and narrative positioning for high-technology firms without resorting to unverified claims or fake statistics.
2. **Press Release Syndication:** Managing structured distribution across specialized cryptocurrency newsrooms, forex trading feeds, market research portals, and search engines with verifiable reporting.
3. **Financial Media Journalism:** Operating an independent, unbiased editorial newsroom under \`/news/\` covering breaking developments across crypto, forex, blockchain, Web3, and fintech.
4. **Absolute Architectural Separation:** NexcoinPR does NOT operate a separate "blog" section. All educational and evergreen knowledge lives exclusively within \`/news/guides/\`.

## 3. Detailed Service Breakdown
### 3.1 Crypto PR (\`/crypto-pr.html\`)
Targeted at cryptocurrency exchanges, token foundations, and mining operations. Focuses on technological differentiation, community credibility, developer engagement, and responsible regulatory communications.

### 3.2 Forex PR (\`/forex-pr.html\`)
Designed for retail foreign exchange brokers, liquidity providers, institutional ECN venues, and charting platforms. Specializes in multi-jurisdictional licensing disclosures, risk-disclosure positioning, and macroeconomic commentary.

### 3.3 Blockchain PR (\`/blockchain-pr.html\`)
Focused on Layer 1 and Layer 2 protocols, modular data availability layers, zero-knowledge research foundations, and enterprise consortiums. Translates advanced cryptographic proofs into accessible, credible stories for technology journalists.

### 3.4 Web3 PR (\`/web3-pr.html\`)
Tailored for decentralized finance (DeFi) platforms, dApps, DAO governance committees, decentralized identity providers, and digital ownership networks.

### 3.5 Fintech PR (\`/fintech-pr.html\`)
Serving payment gateways, digital banking neobanks, cross-border remittance platforms, and regtech compliance suites. Coordinates funding round announcements (Seed to Series C), banking partnerships, and API debuts.

### 3.6 Financial PR (\`/financial-pr.html\`)
Corporate communications for asset managers, hedge funds, venture capital investors, and capital markets infrastructure providers.

### 3.7 Press Release Distribution (\`/press-release-distribution.html\`)
The central syndication platform providing 24-48 hour editorial review, NewsArticle schema structuring, transmission across specialized news feeds, and delivery of verifiable syndication reports.

## 4. Editorial Integrity & Anti-Deception Standards
NexcoinPR adheres to strict global communications ethics:
- **No Fabricated Data:** We do not publish false client statistics, unverified awards, or fake testimonials.
- **No Deceptive Guarantees:** We explicitly reject claims guaranteeing specific media coverage, search rankings, or token value appreciation.
- **Distinct Commercial Labeling:** Commercial releases hosted in \`/press-releases/\` are prominently marked with "Press Release" or "Client Content" banners to prevent confusion with independent journalism.
- **Statutory Financial Disclaimer:** Digital assets and leveraged currency trading carry substantial market risk. No content distributed through NexcoinPR represents financial, legal, or investment advice.

## 5. Information Architecture & Canonical Endpoints
- Homepage: https://nexcoinpr.com/
- Services Directory: https://nexcoinpr.com/services.html
  - Crypto PR: https://nexcoinpr.com/crypto-pr.html
  - Forex PR: https://nexcoinpr.com/forex-pr.html
  - Blockchain PR: https://nexcoinpr.com/blockchain-pr.html
  - Web3 PR: https://nexcoinpr.com/web3-pr.html
  - Fintech PR: https://nexcoinpr.com/fintech-pr.html
  - Financial PR: https://nexcoinpr.com/financial-pr.html
  - Press Release Distribution: https://nexcoinpr.com/press-release-distribution.html
- Commercial Newsroom: https://nexcoinpr.com/press-releases.html
  - Sample Press Release: https://nexcoinpr.com/press-releases/sample-press-release.html
- News & Content Hub: https://nexcoinpr.com/news.html
  - Crypto News: https://nexcoinpr.com/news/crypto.html
  - Forex News: https://nexcoinpr.com/news/forex.html
  - Blockchain News: https://nexcoinpr.com/news/blockchain.html
  - Guides Index: https://nexcoinpr.com/news/guides.html
  - Guide - What Is Crypto PR: https://nexcoinpr.com/news/guides/what-is-crypto-pr.html
  - Guide - How to Write a Press Release: https://nexcoinpr.com/news/guides/how-to-write-a-crypto-press-release.html
  - Guide - What Is Forex PR: https://nexcoinpr.com/news/guides/what-is-forex-pr.html
  - Guide - Distribution Mechanics: https://nexcoinpr.com/news/guides/how-press-release-distribution-works.html
- Supporting Pages:
  - Pricing & Packages: https://nexcoinpr.com/pricing.html
  - Media & Distribution Channels: https://nexcoinpr.com/media.html
  - Case Studies: https://nexcoinpr.com/case-studies.html
  - About NexcoinPR: https://nexcoinpr.com/about.html
  - FAQ: https://nexcoinpr.com/faq.html
  - Authors Directory: https://nexcoinpr.com/authors.html
  - Editorial Team Profile: https://nexcoinpr.com/authors/editorial-team.html
  - Companies Directory: https://nexcoinpr.com/companies.html
  - Industry Glossary: https://nexcoinpr.com/glossary.html
  - Contact Us: https://nexcoinpr.com/contact.html
- Governance & Legal:
  - Editorial Policy: https://nexcoinpr.com/editorial-policy.html
  - Corrections Policy: https://nexcoinpr.com/corrections-policy.html
  - Financial Disclaimer: https://nexcoinpr.com/disclaimer.html
  - Privacy Policy: https://nexcoinpr.com/privacy-policy.html
  - Terms & Conditions: https://nexcoinpr.com/terms.html
  - Cookie Policy: https://nexcoinpr.com/cookie-policy.html
- Feeds & Sitemaps:
  - Sitemap Index: https://nexcoinpr.com/sitemap.xml
  - Pages Sitemap: https://nexcoinpr.com/sitemap-pages.xml
  - Google News Sitemap: https://nexcoinpr.com/sitemap-news.xml
  - Press Releases Sitemap: https://nexcoinpr.com/sitemap-press-releases.xml
  - All News RSS: https://nexcoinpr.com/feed.xml
  - Crypto RSS: https://nexcoinpr.com/feed-crypto.xml
  - Forex RSS: https://nexcoinpr.com/feed-forex.xml
  - Press Releases RSS: https://nexcoinpr.com/feed-press-releases.xml
  - LLM Manifest: https://nexcoinpr.com/llms.txt
`;
fs.writeFileSync(path.join(BASE_DIR, 'llms-full.txt'), llmsFullTxt);
console.log('Created llms-full.txt');

const https = require('https');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const TRACKING_FILE = path.join(ROOT_DIR, 'data', 'imported_press_releases.json');
const PR_HTML_FILE = path.join(ROOT_DIR, 'press-releases.html');
const SITEMAP_FILE = path.join(ROOT_DIR, 'sitemap-press-releases.xml');
const PR_DIR = path.join(ROOT_DIR, 'press-releases');
const NEWSROOM_URL = 'https://financewire.com/newsroom/';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('/')) {
          redirectUrl = 'https://financewire.com' + redirectUrl;
        }
        return fetchUrl(redirectUrl).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch ${url}, status: ${res.statusCode}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function cleanDashesAndAi(text) {
  if (!text) return '';
  let str = text;
  // Replace dashes
  str = str.replace(/—|&mdash;/g, ', ');
  str = str.replace(/–|&ndash;/g, ', ');
  str = str.replace(/\s+-\s+/g, ', ');
  str = str.replace(/,\s*,/g, ',');
  str = str.replace(/:\s*,/g, ':');
  str = str.replace(/,\s*:/g, ':');
  // Clean basic AI buzzwords
  str = str.replace(/\bgame-changer\b/gi, 'major shift');
  str = str.replace(/\bcutting-edge\b/gi, 'advanced');
  str = str.replace(/\bseamless\b/gi, 'frictionless');
  str = str.replace(/\bleverage\b/gi, 'use');
  str = str.replace(/\brobust\b/gi, 'durable and strong');
  str = str.replace(/\bstreamline\b/gi, 'simplify');
  str = str.replace(/\bempower\b/gi, 'help');
  str = str.replace(/\bcomprehensive\b/gi, 'full-scale');
  str = str.replace(/\bgroundbreaking\b/gi, 'pioneering');
  str = str.replace(/\blandscape\b/gi, 'market');
  return stripWireWords(str.trim());
}

function stripWireWords(text) {
  if (!text) return '';
  let str = text;
  // Remove trailing syndication blurb if present
  str = str.replace(/<p>The post\s+<a[^>]*>[\s\S]*?<\/a>\s+appeared first on\s+<a[^>]*>[\s\S]*?<\/a>\.?<\/p>/gi, '');
  // Dateline at end: e.g. ', Chainwire' or ', FinanceWire'
  str = str.replace(/[,–—-]\s*(?:FinanceWire|Chainwire)\b/gi, '');
  // Dateline at start: e.g. 'Chainwire, ' or 'FinanceWire, '
  str = str.replace(/\b(?:FinanceWire|Chainwire)\s*[,–—-]\s*/gi, '');
  // Standalone word in text:
  str = str.replace(/\b(?:FinanceWire|Chainwire)\b/gi, '');
  // Cleanup punctuation artifacts
  str = str.replace(/,\s*,/g, ',');
  str = str.replace(/,\s*<\/strong>/gi, '</strong>');
  return str.trim();
}

function createSummary(text, maxLength = 140) {
  if (!text) return '';
  let str = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  // Strip leading wire datelines if present (e.g. "CITY, Date, Wire")
  str = str.replace(/^[A-Za-z\s,.-]+,\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d+(?:st|nd|rd|th)?,\s+\d{4},\s+(?:Chainwire|FinanceWire|Newswire|PR Newswire|Business Wire|GlobeNewswire)\s*/i, '');
  str = cleanDashesAndAi(str);
  str = str.replace(/\s+/g, ' ').trim();
  
  if (str.length <= maxLength) return str;

  // Truncate at word boundary to fit strictly within maxLength (accounting for '...')
  const target = maxLength - 3;
  let truncated = str.slice(0, target);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > target * 0.65) {
    truncated = truncated.slice(0, lastSpace);
  }
  truncated = truncated.replace(/[,;:. -]+$/, '');
  const result = truncated + '...';
  return result.length > maxLength ? result.slice(0, maxLength) : result;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 75)
    .replace(/-$/, '');
}

function formatDate(dateObj) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const day = dateObj.getUTCDate();
  const month = months[dateObj.getUTCMonth()];
  const year = dateObj.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

function determineCategory(title, body) {
  const combined = (title + ' ' + body.substring(0, 1500)).toLowerCase();
  const cats = [];
  if (combined.includes('crypto') || combined.includes('bitcoin') || combined.includes('ethereum') || combined.includes('token') || combined.includes('cex') || combined.includes('dex') || combined.includes('digital asset exchange')) {
    cats.push('crypto');
  }
  if (combined.includes('blockchain') || combined.includes('layer 1') || combined.includes('layer 2') || combined.includes('consensus') || combined.includes('smart contract')) {
    cats.push('blockchain');
  }
  if (combined.includes('web3') || combined.includes('dao') || combined.includes('dapp') || combined.includes('defi')) {
    cats.push('web3');
  }
  if (combined.includes('forex') || combined.includes('fx ') || combined.includes('currency trading') || combined.includes('prop firm')) {
    cats.push('forex');
  }
  if (combined.includes('fintech') || combined.includes('payment') || combined.includes('banking') || combined.includes('ai security') || combined.includes('cyber') || combined.includes('agent') || combined.includes('enterprise')) {
    cats.push('fintech');
  }
  if (cats.length === 0 || combined.includes('financial') || combined.includes('market') || combined.includes('capital') || combined.includes('fund')) {
    cats.push('financial');
  }
  const primary = cats[0] || 'financial';
  return { primary, all: cats.join(' ') };
}

function extractCompany(title, body) {
  const tickerMatch = title.match(/([A-Z0-9\s]+)\s*\((?:NASDAQ|NYSE|TSX|LSE):\s*([A-Z]+)\)/i);
  if (tickerMatch) {
    const raw = tickerMatch[1].trim();
    const words = raw.split(/\s+/);
    return words.slice(-2).join(' ') || tickerMatch[2];
  }
  const verbMatch = title.match(/^([A-Z][A-Za-z0-9\s&]+?)\s+(?:Acquires|Brings|Launches|Announces|Reports|Secures|Expands|Unveils|Receives|Closes|Partners|Introduces)/);
  if (verbMatch && verbMatch[1].length < 35) {
    return verbMatch[1].trim();
  }
  // Check first paragraph for company before comma
  const firstP = body.replace(/<[^>]+>/g, ' ').substring(0, 250);
  const m = firstP.match(/(?:FinanceWire\s+)?([A-Z][A-Za-z0-9\s&]+?),\s+(?:a\s+|an\s+|the\s+)/i);
  if (m && m[1].length < 30) {
    return m[1].trim();
  }
  return 'Financial News Issuer';
}

async function run() {
  console.log(`Fetching FinanceWire Newsroom from: ${NEWSROOM_URL}`);
  const newsroomHtml = await fetchUrl(NEWSROOM_URL);

  // Ensure data directory exists
  if (!fs.existsSync(path.dirname(TRACKING_FILE))) {
    fs.mkdirSync(path.dirname(TRACKING_FILE), { recursive: true });
  }

  let imported = [];
  if (fs.existsSync(TRACKING_FILE)) {
    try {
      imported = JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf8'));
    } catch (e) {
      imported = [];
    }
  }

  // Parse article links from newsroom page
  const regex = /<a\s+[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  let newsroomArticles = [];
  while ((m = regex.exec(newsroomHtml)) !== null) {
    const link = m[1];
    const text = m[2].replace(/<[^>]+>/g, '').trim();
    if (link.includes('financewire.com/') && /\/\d{4}\/\d{2}\/\d{2}\//.test(link)) {
      if (text && text.length > 15 && !newsroomArticles.some(a => a.link === link)) {
        newsroomArticles.push({ link, text });
      }
    }
  }

  console.log(`Found ${newsroomArticles.length} articles on FinanceWire Newsroom.`);

  let candidate = null;
  for (let art of newsroomArticles) {
    if (!imported.includes(art.link)) {
      candidate = art;
      break;
    }
  }

  if (!candidate) {
    console.log('All articles currently listed on FinanceWire Newsroom have already been imported.');
    return;
  }

  console.log(`Selected article from newsroom: ${candidate.text} (${candidate.link})`);
  console.log('Fetching full article content...');
  const articleHtmlRaw = await fetchUrl(candidate.link);

  // Extract Title
  const titleMatch = articleHtmlRaw.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const rawTitle = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : candidate.text;
  const cleanTitle = cleanDashesAndAi(rawTitle);

  // Extract Content
  let bodyContent = '';
  const contentMatch = articleHtmlRaw.match(/<div class="entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                       articleHtmlRaw.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (contentMatch) {
    bodyContent = contentMatch[1];
  } else {
    // Fallback: extract paragraphs
    const pMatches = articleHtmlRaw.match(/<p>[\s\S]*?<\/p>/gi) || [];
    bodyContent = pMatches.join('\n');
  }

  // Clean body text
  bodyContent = cleanDashesAndAi(bodyContent);
  bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  bodyContent = bodyContent.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  bodyContent = bodyContent.replace(/<!--[\s\S]*?-->/g, '');

  // Extract date from URL or page
  let dateObj = new Date();
  const dateFromUrl = candidate.link.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
  if (dateFromUrl) {
    dateObj = new Date(`${dateFromUrl[1]}-${dateFromUrl[2]}-${dateFromUrl[3]}T12:00:00Z`);
  }
  const formattedDate = formatDate(dateObj);
  const isoDate = dateObj.toISOString();

  const slug = `${slugify(cleanTitle)}.html`;
  const articleUrl = `/press-releases/${slug}`;
  const fullArticleUrl = `https://nexcoinpr.com/press-releases/${slug}`;

  // SEO Summary (strictly locked to max 140 characters)
  const excerpt = createSummary(bodyContent, 140);

  const catObj = determineCategory(cleanTitle, bodyContent);
  const category = catObj.primary;
  const categoryAttr = catObj.all;
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
  const company = extractCompany(cleanTitle, bodyContent);

  console.log('Article details:');
  console.log(' - Title:', cleanTitle);
  console.log(' - Company:', company);
  console.log(' - Category:', categoryLabel);
  console.log(' - Published:', formattedDate);
  console.log(' - Saved Slug:', slug);

  // 1. Generate standalone article HTML
  const articleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cleanTitle} | NexcoinPR</title>
  <meta name="description" content="${excerpt.replace(/"/g, '&quot;')}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${fullArticleUrl}">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${cleanTitle.replace(/"/g, '&quot;')} | NexcoinPR">
  <meta property="og:description" content="${excerpt.replace(/"/g, '&quot;')}">
  <meta property="og:url" content="${fullArticleUrl}">
  <meta property="og:site_name" content="NexcoinPR">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${cleanTitle.replace(/"/g, '&quot;')} | NexcoinPR">
  <meta name="twitter:description" content="${excerpt.replace(/"/g, '&quot;')}">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/main.css?v=6.0">
  <link rel="stylesheet" href="/assets/css/components.css?v=6.0">
  <link rel="stylesheet" href="/assets/css/pages.css?v=6.0">

  <!-- JSON-LD -->
  <script type="application/ld+json">
  {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "NewsArticle",
      "@id": "${fullArticleUrl}#article",
      "headline": "${cleanTitle.replace(/"/g, '\\"')}",
      "description": "${excerpt.replace(/"/g, '\\"')}",
      "datePublished": "${isoDate}",
      "dateModified": "${isoDate}",
      "author": {
        "@type": "Organization",
        "name": "${company.replace(/"/g, '\\"')}",
        "url": "https://nexcoinpr.com/companies.html"
      },
      "publisher": {
        "@type": "Organization",
        "name": "NexcoinPR",
        "url": "https://nexcoinpr.com"
      }
    }
  ]
}
  </script>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#0A1628">
  <meta property="og:image" content="https://nexcoinpr.com/assets/images/nexcoinpr-logo-dark.jpg">
</head>
<body>
  <!-- HEADER -->
  <header class="site-header" id="site-header">
    <div class="container">
      <nav class="nav-bar" aria-label="Main navigation">
        <a href="/" class="nav-logo" aria-label="NexcoinPR home">
          <img src="/favicon.svg" alt="NexcoinPR" width="32" height="32" class="nav-logo-icon">
          <span class="logo-text">Nexcoin<span class="logo-accent">PR</span></span>
        </a>
        <ul class="nav-menu" id="nav-menu" role="list">
          <li><a href="/" class="nav-link">Home</a></li>
          <li class="nav-item-dropdown">
            <button class="nav-link nav-dropdown-btn" aria-expanded="false" aria-haspopup="true">Services <span class="dropdown-arrow">▾</span></button>
            <ul class="dropdown-menu" role="list">
              <li><a href="/crypto-pr.html" class="dropdown-link">Crypto PR</a></li>
              <li><a href="/forex-pr.html" class="dropdown-link">Forex PR</a></li>
              <li><a href="/blockchain-pr.html" class="dropdown-link">Blockchain PR</a></li>
              <li><a href="/web3-pr.html" class="dropdown-link">Web3 PR</a></li>
              <li><a href="/fintech-pr.html" class="dropdown-link">Fintech PR</a></li>
              <li><a href="/financial-pr.html" class="dropdown-link">Financial PR</a></li>
              <li><a href="/press-release-distribution.html" class="dropdown-link">Press Release Distribution</a></li>
            </ul>
          </li>
          <li><a href="/press-releases.html" class="nav-link active">Press Releases</a></li>
          <li class="nav-item-dropdown">
            <button class="nav-link nav-dropdown-btn" aria-expanded="false" aria-haspopup="true">News <span class="dropdown-arrow">▾</span></button>
            <ul class="dropdown-menu" role="list">
              <li><a href="/news.html" class="dropdown-link">All News</a></li>
              <li><a href="/news/crypto.html" class="dropdown-link">Crypto</a></li>
              <li><a href="/news/forex.html" class="dropdown-link">Forex</a></li>
              <li><a href="/news/blockchain.html" class="dropdown-link">Blockchain</a></li>
              <li><a href="/news/guides.html" class="dropdown-link">Guides</a></li>
            </ul>
          </li>
          <li><a href="/pricing.html" class="nav-link">Pricing</a></li>
          <li><a href="/media.html" class="nav-link">Media</a></li>
          <li><a href="/about.html" class="nav-link">About</a></li>
          <li><a href="/contact.html" class="nav-link">Contact</a></li>
        </ul>
        <a href="/press-release-distribution.html" class="btn-primary nav-cta">Submit Press Release</a>
        <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Open menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </nav>
    </div>
  </header>

<main id="main-content">
  <article class="article-container">
    <header class="page-hero">
      <div class="container">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="/" class="breadcrumb-item">Home</a>
          <span class="breadcrumb-separator">/</span>
          <a href="/press-releases.html" class="breadcrumb-item">Press Releases</a>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-item active">${company}</span>
        </nav>
        <div class="page-hero-content">
          <div class="mb-2">
            <span class="badge badge-pr">Client Content / Press Release</span>
            <span class="badge badge-${category}">${categoryLabel}</span>
          </div>
          <h1 class="page-hero-title">${cleanTitle}</h1>
          <p class="hero-intro">${excerpt}</p>
          <div class="author-meta text-white">
            <span>Issuer: <strong>${company}</strong></span> &bull; 
            <span>Source: <a href="${candidate.link}" target="_blank" rel="noopener nofollow" style="color:var(--color-gold);text-decoration:underline;">Original Publication &rarr;</a></span> &bull; 
            <span>Published: ${formattedDate}</span>
          </div>
        </div>
      </div>
    </header>

    <div class="section section-white">
      <div class="container">
        <div class="two-col-layout">
          <div class="main-content-col article-body">
            <div class="notice-financial mb-4">
              <p><strong>Commercial Content Disclosure:</strong> The following announcement is an official press release syndicated on behalf of ${company} (<a href="${candidate.link}" target="_blank" rel="noopener nofollow" style="text-decoration:underline;">view source publication</a>). NexcoinPR provides media distribution and editorial hosting. This content does not represent independent editorial reporting or investment advice.</p>
            </div>

            ${bodyContent}

            <div style="margin-top:24px;padding:12px 16px;background:var(--color-gray-100);border-left:4px solid var(--color-gold);font-size:0.9rem;">
              <strong>Source Publication:</strong> <a href="${candidate.link}" target="_blank" rel="noopener nofollow" style="color:var(--color-gold);text-decoration:underline;">${candidate.link}</a>
            </div>

            <div class="notice-financial mt-4">
              <h4>NexcoinPR Disclaimer</h4>
              <p>NexcoinPR distributes client press releases for verified organizations. Information presented has not been independently confirmed by NexcoinPR journalists. Users should exercise independent diligence before engaging with any digital asset, financial offering, or investment platform.</p>
            </div>
          </div>

          <aside class="sidebar-col">
            <div class="card card-dark">
              <h3 class="text-gold">Submit Your Press Release</h3>
              <p class="text-muted">Broadcast your company's news across our verified crypto and financial network.</p>
              <a href="/press-release-distribution.html" class="btn-primary btn-block mt-3">Submit Press Release</a>
              <a href="/pricing.html" class="btn-secondary btn-block mt-2">View Pricing</a>
            </div>

            <div class="card mt-4">
              <h4>Distribution Standards</h4>
              <ul class="sidebar-links">
                <li><a href="/editorial-policy.html">Editorial &amp; Disclosure Policy</a></li>
                <li><a href="/corrections-policy.html">Corrections Process</a></li>
                <li><a href="/news/guides/how-to-write-a-crypto-press-release.html">Writing Guidelines</a></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </article>
</main>

  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="/" class="footer-logo" aria-label="NexcoinPR home"><img src="/favicon.svg" alt="NexcoinPR" width="28" height="28" class="footer-logo-icon"><span>Nexcoin<span class="logo-accent">PR</span></span></a>
          <p class="footer-tagline">Premium Crypto, Forex &amp; Financial PR and press release distribution for blockchain, Web3, fintech and financial brands.</p>
          <p class="footer-disclaimer-mini">NexcoinPR is an international PR and media services agency. Content published on this site does not constitute financial, investment or trading advice.</p>
        </div>
        <div class="footer-col">
          <h3 class="footer-heading">Company</h3>
          <ul class="footer-links">
            <li><a href="/about.html">About NexcoinPR</a></li>
            <li><a href="/contact.html">Contact</a></li>
            <li><a href="/case-studies.html">Case Studies</a></li>
            <li><a href="/media.html">Media</a></li>
            <li><a href="/authors.html">Authors</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3 class="footer-heading">Services</h3>
          <ul class="footer-links">
            <li><a href="/crypto-pr.html">Crypto PR</a></li>
            <li><a href="/forex-pr.html">Forex PR</a></li>
            <li><a href="/blockchain-pr.html">Blockchain PR</a></li>
            <li><a href="/web3-pr.html">Web3 PR</a></li>
            <li><a href="/fintech-pr.html">Fintech PR</a></li>
            <li><a href="/financial-pr.html">Financial PR</a></li>
            <li><a href="/press-release-distribution.html">Press Release Distribution</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3 class="footer-heading">Content</h3>
          <ul class="footer-links">
            <li><a href="/news.html">News</a></li>
            <li><a href="/press-releases.html">Press Releases</a></li>
            <li><a href="/news/guides.html">Guides</a></li>
            <li><a href="/glossary.html">Glossary</a></li>
            <li><a href="/companies.html">Companies</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3 class="footer-heading">Trust &amp; Legal</h3>
          <ul class="footer-links">
            <li><a href="/editorial-policy.html">Editorial Policy</a></li>
            <li><a href="/corrections-policy.html">Corrections Policy</a></li>
            <li><a href="/disclaimer.html">Disclaimer</a></li>
            <li><a href="/privacy-policy.html">Privacy Policy</a></li>
            <li><a href="/terms.html">Terms &amp; Conditions</a></li>
            <li><a href="/cookie-policy.html">Cookie Policy</a></li>
            <li><a href="/faq.html">FAQ</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-copy">&copy; <span id="footer-year">2026</span> NexcoinPR. All rights reserved.</p>
        <p class="footer-legal">NexcoinPR provides PR and media distribution services. We do not provide financial, investment or trading advice. Press releases and client content are clearly labelled and do not represent independent editorial views.</p>
      </div>
    </div>
  </footer>

  <div class="cookie-banner" id="cookie-banner" role="dialog" aria-label="Cookie consent" hidden>
    <div class="cookie-content">
      <p>We use cookies to improve your experience. See our <a href="/cookie-policy.html">Cookie Policy</a>.</p>
      <div class="cookie-actions">
        <button class="btn-primary cookie-accept" id="cookie-accept">Accept</button>
        <button class="btn-ghost cookie-reject" id="cookie-reject">Reject</button>
      </div>
    </div>
  </div>
  <script src="/assets/js/main.js" defer></script>
</body>
</html>`;

  fs.writeFileSync(path.join(PR_DIR, slug), articleHtml, 'utf8');
  console.log(`Created new standalone press release: press-releases/${slug}`);

  // 2. Inject new card into press-releases.html
  let prHtml = fs.readFileSync(PR_HTML_FILE, 'utf8');
  const cardHtml = `
            <article class="pr-card" data-category="${categoryAttr}">
              <div class="pr-card-header">
                <span class="content-label">Press Release</span>
                <span class="badge badge-${category}">${categoryLabel}</span>
                <span class="pr-card-company">${company}</span>
                <span class="pr-card-date">${formattedDate}</span>
              </div>
              <h2 class="pr-card-title">
                <a href="${articleUrl}">${cleanTitle}</a>
              </h2>
              <p class="pr-card-excerpt">${excerpt}</p>
              <div class="pr-card-footer">
                <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
                  <span class="tag">${categoryLabel}</span>
                  <a href="${candidate.link}" target="_blank" rel="noopener nofollow" class="tag" style="text-decoration:none;">Source Link &#8599;</a>
                </div>
                <a href="${articleUrl}" class="pr-card-read">Read full release &rarr;</a>
              </div>
            </article>`;

  const gridAnchor = '<div class="pr-grid" data-filter-container>';
  if (prHtml.includes(gridAnchor)) {
    prHtml = prHtml.replace(gridAnchor, `${gridAnchor}${cardHtml}`);
    fs.writeFileSync(PR_HTML_FILE, prHtml, 'utf8');
    console.log('Injected new card at top of press-releases.html');
  }

  // 3. Update sitemap-press-releases.xml
  let sitemap = fs.readFileSync(SITEMAP_FILE, 'utf8');
  const dateFormattedYMD = dateObj.toISOString().split('T')[0];
  const urlEntry = `  <url>
    <loc>${fullArticleUrl}</loc>
    <lastmod>${dateFormattedYMD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

  if (sitemap.includes('</urlset>')) {
    sitemap = sitemap.replace('</urlset>', urlEntry);
    fs.writeFileSync(SITEMAP_FILE, sitemap, 'utf8');
    console.log('Updated sitemap-press-releases.xml');
  }

  // 4. Update tracking JSON
  imported.push(candidate.link);
  fs.writeFileSync(TRACKING_FILE, JSON.stringify(imported, null, 2), 'utf8');
  console.log('Recorded imported URL in tracking manifest.');

  console.log('SUCCESS: Imported 1 daily press release from FinanceWire Newsroom.');
}

run().catch(err => {
  console.error('Error running FinanceWire Newsroom fetcher:', err);
  process.exit(1);
});

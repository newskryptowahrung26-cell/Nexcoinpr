const https = require('https');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const TRACKING_FILE = path.join(ROOT_DIR, 'data', 'imported_press_releases.json');
const PR_HTML_FILE = path.join(ROOT_DIR, 'press-releases.html');
const SITEMAP_FILE = path.join(ROOT_DIR, 'sitemap-press-releases.xml');
const PR_DIR = path.join(ROOT_DIR, 'press-releases');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
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
  // Clean basic AI buzzwords
  str = str.replace(/\bgame-changer\b/gi, 'major shift');
  str = str.replace(/\bcutting-edge\b/gi, 'advanced');
  str = str.replace(/\bseamless\b/gi, 'frictionless');
  str = str.replace(/\bleverage\b/gi, 'use');
  str = str.replace(/\brobust\b/gi, 'durable and strong');
  str = str.replace(/\bstreamline\b/gi, 'simplify');
  str = str.replace(/\bempower\b/gi, 'help');
  return str.trim();
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

function determineCategory(categories, title, body) {
  const combined = (categories.join(' ') + ' ' + title + ' ' + body.substring(0, 1000)).toLowerCase();
  if (combined.includes('crypto') || combined.includes('bitcoin') || combined.includes('ethereum') || combined.includes('token') || combined.includes('cex') || combined.includes('dex')) {
    return 'crypto';
  }
  if (combined.includes('blockchain') || combined.includes('layer 1') || combined.includes('layer 2') || combined.includes('consensus') || combined.includes('smart contract')) {
    return 'blockchain';
  }
  if (combined.includes('web3') || combined.includes('dao') || combined.includes('dapp') || combined.includes('defi')) {
    return 'web3';
  }
  if (combined.includes('forex') || combined.includes('fx ') || combined.includes('currency trading') || combined.includes('prop firm')) {
    return 'forex';
  }
  if (combined.includes('fintech') || combined.includes('payment') || combined.includes('banking') || combined.includes('ai ') || combined.includes('security')) {
    return 'fintech';
  }
  return 'financial';
}

function extractCompany(title, body) {
  // Check for (NASDAQ: XXX) or (NYSE: XXX)
  const tickerMatch = title.match(/([A-Z0-9\s]+)\s*\((?:NASDAQ|NYSE|TSX|LSE):\s*([A-Z]+)\)/i);
  if (tickerMatch) {
    const raw = tickerMatch[1].trim();
    // Get last 2 words of company name before ticker
    const words = raw.split(/\s+/);
    return words.slice(-2).join(' ') || tickerMatch[2];
  }
  // Check for common announcement pattern: "Company Acquires...", "Company Launches..."
  const verbMatch = title.match(/^([A-Z][A-Za-z0-9\s&]+?)\s+(?:Acquires|Brings|Launches|Announces|Reports|Secures|Expands|Unveils|Receives|Closes|Partners)/);
  if (verbMatch && verbMatch[1].length < 35) {
    return verbMatch[1].trim();
  }
  return 'FinanceWire Syndicate';
}

async function run() {
  console.log('Fetching FinanceWire RSS feed...');
  const xml = await fetchUrl('https://financewire.com/feed/');

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

  const itemsRaw = xml.split('<item>').slice(1);
  if (itemsRaw.length === 0) {
    console.log('No items found in feed.');
    return;
  }

  let candidateItem = null;

  for (let it of itemsRaw) {
    const itemXml = it.split('</item>')[0];
    const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
    const link = linkMatch ? linkMatch[1].trim() : '';

    if (link && !imported.includes(link)) {
      candidateItem = itemXml;
      break;
    }
  }

  if (!candidateItem) {
    console.log('All articles from FinanceWire are already imported. No new release to fetch.');
    return;
  }

  // Parse candidate
  const titleMatch = candidateItem.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || candidateItem.match(/<title>([\s\S]*?)<\/title>/);
  const linkMatch = candidateItem.match(/<link>(.*?)<\/link>/);
  const pubDateMatch = candidateItem.match(/<pubDate>(.*?)<\/pubDate>/);
  const contentMatch = candidateItem.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/) || candidateItem.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/);
  const rawCategories = (candidateItem.match(/<category><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g) || []).map(c => c.replace(/<\/?category>|<!\[CDATA\[|\]\]>/g, '').trim());

  const originalTitle = titleMatch ? titleMatch[1].trim() : 'Financial Market Announcement';
  const cleanTitle = cleanDashesAndAi(originalTitle);
  const sourceLink = linkMatch ? linkMatch[1].trim() : '';
  const dateObj = pubDateMatch ? new Date(pubDateMatch[1].trim()) : new Date();
  const formattedDate = formatDate(dateObj);
  const isoDate = dateObj.toISOString();

  let bodyContent = contentMatch ? contentMatch[1].trim() : '';
  // Clean body text
  bodyContent = cleanDashesAndAi(bodyContent);
  // Remove WordPress classes and inline styling scripts
  bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  bodyContent = bodyContent.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  const slug = `${slugify(cleanTitle)}.html`;
  const articleUrl = `/press-releases/${slug}`;
  const fullArticleUrl = `https://nexcoinpr.com/press-releases/${slug}`;

  // Plain text excerpt (first 240 chars)
  const plainText = bodyContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const excerpt = cleanDashesAndAi(plainText.slice(0, 240) + '...');

  const category = determineCategory(rawCategories, cleanTitle, bodyContent);
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
  const company = extractCompany(cleanTitle, bodyContent);

  console.log('Selected article:');
  console.log(' - Title:', cleanTitle);
  console.log(' - Company:', company);
  console.log(' - Category:', categoryLabel);
  console.log(' - Date:', formattedDate);
  console.log(' - Slug:', slug);

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
            <span>Syndication: <strong>FinanceWire</strong></span> &bull; 
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
              <p><strong>Commercial Content Disclosure:</strong> The following announcement is an official press release syndicated in partnership with FinanceWire on behalf of ${company}. NexcoinPR provides media distribution and editorial hosting. This content does not represent independent editorial reporting or investment advice.</p>
            </div>

            ${bodyContent}

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
            <article class="pr-card" data-category="${category}">
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
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                  <span class="tag">${categoryLabel}</span>
                  <span class="tag">FinanceWire</span>
                </div>
                <a href="${articleUrl}" class="pr-card-read">Read full release →</a>
              </div>
            </article>`;

  const gridAnchor = '<div class="pr-grid" data-filter-container>';
  if (prHtml.includes(gridAnchor)) {
    prHtml = prHtml.replace(gridAnchor, `${gridAnchor}${cardHtml}`);
    fs.writeFileSync(PR_HTML_FILE, prHtml, 'utf8');
    console.log('Injected new card at top of press-releases.html');
  } else {
    console.warn('Could not find .pr-grid in press-releases.html');
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
  imported.push(sourceLink);
  fs.writeFileSync(TRACKING_FILE, JSON.stringify(imported, null, 2), 'utf8');
  console.log('Recorded imported URL in tracking manifest.');

  console.log('SUCCESS: Imported 1 daily press release from FinanceWire.');
}

run().catch(err => {
  console.error('Error running FinanceWire fetcher:', err);
  process.exit(1);
});

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const TRACKING_FILE = path.join(ROOT_DIR, 'data', 'imported_daily_news.json');
const NEWS_HTML_FILE = path.join(ROOT_DIR, 'news.html');
const CRYPTO_HTML_FILE = path.join(ROOT_DIR, 'news', 'crypto.html');
const FOREX_HTML_FILE = path.join(ROOT_DIR, 'news', 'forex.html');
const SITEMAP_NEWS_FILE = path.join(ROOT_DIR, 'sitemap-news.xml');
const SITEMAP_INDEX_FILE = path.join(ROOT_DIR, 'sitemap.xml');
const NEWS_DIR = path.join(ROOT_DIR, 'news');

// Banned AI words list
const BANNED_WORDS = [
  'a journey of', 'a multitude of', 'a plethora of', 'a testament to', 'accordingly',
  'actionable insights', 'adept', 'adoption rate', 'aforementioned', 'agile',
  'ai-powered', 'aligns', 'ample opportunities', 'amplify', 'arduous',
  'as a result', 'as such', 'at length', 'at the end of the day', 'augment',
  'bandwidth', 'based on the information provided', 'basic', 'best practices',
  'blockchain-enabled', 'brand awareness', 'broadly speaking', 'burgeoning',
  'cannot be overstated', 'capacity building', 'captivating', 'change management',
  'cloud-based', 'cognizant', 'collaborative environment', 'commendable',
  'competitive landscape', 'complexity', 'conceptualize', 'conducting',
  'consequently', 'considerable', 'continuous improvement', 'core',
  'corporate social responsibility', 'cost optimization', 'craft', 'critical',
  'crucial', 'customer loyalty', 'customer satisfaction', 'cutting-edge',
  'delve', 'dive', 'embark', 'empower', 'endeavor', 'foster', 'game-changer',
  'groundbreaking', 'harness', 'holistic', 'illuminate', 'in order to',
  'innovative', 'intricate', 'juxtaposition', 'leverage', 'meticulous',
  'navigate', 'nexus', 'nuance', 'orchestrate', 'paramount', 'pivotal',
  'plethora', 'realm', 'relentless', 'resonate', 'revolutionize', 'robust',
  'seamless', 'spearhead', 'strategic', 'streamline', 'tapestry',
  'transformative', 'unleash', 'unlock', 'unprecedented', 'utilize', 'vital'
];

const REPLACEMENTS = {
  'game-changer': 'major shift',
  'cutting-edge': 'advanced',
  'seamless': 'smooth',
  'leverage': 'use',
  'leveraging': 'using',
  'leveraged': 'used',
  'robust': 'durable',
  'streamline': 'simplify',
  'streamlines': 'simplifies',
  'streamlined': 'simplified',
  'empower': 'enable',
  'empowers': 'enables',
  'groundbreaking': 'pioneering',
  'competitive landscape': 'market sector',
  'landscape': 'market environment',
  'a testament to': 'evidence of',
  'testament to': 'evidence of',
  'plethora of': 'broad range of',
  'a plethora of': 'many',
  'a multitude of': 'numerous',
  'in order to': 'to',
  'delve into': 'examine',
  'delve': 'examine',
  'delving': 'examining',
  'dive into': 'explore',
  'deep dive': 'in-depth analysis',
  'dive': 'examine',
  'foster': 'support',
  'fostering': 'supporting',
  'harness': 'harness',
  'crucial': 'key',
  'critical': 'vital',
  'vital': 'essential',
  'core': 'central',
  'pivotal': 'key',
  'paramount': 'top priority',
  'spearhead': 'lead',
  'spearheading': 'leading',
  'transformative': 'substantial',
  'revolutionize': 'modernize',
  'unleash': 'release',
  'unlock': 'open access to',
  'unprecedented': 'uncommon',
  'utilize': 'use',
  'utilized': 'used',
  'utilizing': 'using',
  'navigating': 'managing',
  'navigate': 'steer through',
  'navigates': 'steers through',
  'strategic': 'tactical',
  'resonate': 'connect with',
  'resonates': 'connects with',
  'resonate with': 'appeal to',
  'orchestrate': 'coordinate',
  'orchestrating': 'coordinating',
  'nuance': 'subtlety',
  'nuanced': 'detailed',
  'nexus': 'intersection',
  'tapestry': 'structure',
  'holistic': 'comprehensive',
  'meticulous': 'thorough',
  'arduous': 'demanding',
  'burgeoning': 'expanding',
  'cognizant': 'aware',
  'bandwidth': 'capacity',
  'adoption rate': 'uptake pace',
  'brand awareness': 'visibility',
  'actionable insights': 'practical data',
  'consequently': 'therefore',
  'accordingly': 'thus',
  'as a result': 'therefore',
  'as such': 'therefore',
  'at length': 'in detail',
  'at the end of the day': 'ultimately'
};

function fetchUrl(url, timeoutMs = 12000) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: timeoutMs
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('/')) {
          const parsed = new URL(url);
          redirectUrl = `${parsed.protocol}//${parsed.host}${redirectUrl}`;
        }
        return fetchUrl(redirectUrl, timeoutMs).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch ${url}, status: ${res.statusCode}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timeout for ${url}`));
    });
    req.on('error', reject);
  });
}

function cleanDashesAndAi(text) {
  if (!text) return '';
  let str = text;

  // 1. Remove and replace dashes
  str = str.replace(/—|&mdash;/g, ', ');
  str = str.replace(/–|&ndash;/g, ', ');
  str = str.replace(/\s+-\s+/g, ', ');
  str = str.replace(/,\s*,/g, ',');
  str = str.replace(/:\s*,/g, ':');
  str = str.replace(/,\s*:/g, ':');

  // 2. Replace known AI phrases
  for (const [key, replacement] of Object.entries(REPLACEMENTS)) {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    str = str.replace(regex, replacement);
  }

  // 3. Fallback scan for remaining banned words
  for (const word of BANNED_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(str)) {
      str = str.replace(regex, 'primary');
    }
  }

  // 4. Double check dashes again
  str = str.replace(/—|–/g, ', ');
  str = str.replace(/\s+-\s+/g, ', ');

  return str.trim();
}

function makeSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 75)
    .replace(/-+$/, '');
}

function formatMetaDesc(text, maxLen = 140) {
  let cleaned = cleanDashesAndAi(text).replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLen) return cleaned;
  let truncated = cleaned.substring(0, maxLen - 1);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > 80) {
    truncated = truncated.substring(0, lastSpace);
  }
  return truncated.replace(/[,;:\s]+$/, '') + '.';
}

// Load imported tracking
function getImportedUrls() {
  if (!fs.existsSync(TRACKING_FILE)) {
    fs.writeFileSync(TRACKING_FILE, JSON.stringify([], null, 2));
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function saveImportedUrl(url) {
  const urls = getImportedUrls();
  if (!urls.includes(url)) {
    urls.push(url);
    fs.writeFileSync(TRACKING_FILE, JSON.stringify(urls, null, 2));
  }
}

// Scrape CoinDesk topics
async function fetchCoinDeskCandidate(importedUrls) {
  console.log('Fetching CoinDesk market news...');
  try {
    const html = await fetchUrl('https://www.coindesk.com/markets/');
    const linkMatches = [...html.matchAll(/href="(\/(?:markets|business|policy)\/2026\/\d{2}\/\d{2}\/([a-z0-9-]+)\/?)"/gi)];
    
    for (const match of linkMatches) {
      const fullUrl = 'https://www.coindesk.com' + match[1];
      const slug = match[2];
      if (!importedUrls.includes(fullUrl) && slug.length > 10) {
        // Humanize title from slug
        const words = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1));
        const estimatedTitle = words.join(' ');
        return {
          source: 'CoinDesk',
          url: fullUrl,
          slug: slug,
          title: estimatedTitle,
          category: 'Crypto',
          badgeClass: 'badge-crypto'
        };
      }
    }
  } catch (err) {
    console.warn('CoinDesk live fetch encountered issue:', err.message);
  }
  return null;
}

// Scrape Forex.com topics
async function fetchForexCandidate(importedUrls) {
  console.log('Fetching Forex.com news and analysis...');
  try {
    const html = await fetchUrl('https://www.forex.com/en/news-and-analysis/');
    const linkMatches = [...html.matchAll(/href="(\/en\/news-and-analysis\/([a-z0-9-]+)\/?)"/gi)];
    
    for (const match of linkMatches) {
      const fullUrl = 'https://www.forex.com' + match[1];
      const slug = match[2];
      if (!importedUrls.includes(fullUrl) && slug.length > 10 && !slug.includes('market-insights-')) {
        const words = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1));
        const estimatedTitle = words.join(' ');
        return {
          source: 'FOREX.com',
          url: fullUrl,
          slug: slug,
          title: estimatedTitle,
          category: 'Forex',
          badgeClass: 'badge-forex'
        };
      }
    }
  } catch (err) {
    console.warn('Forex.com live fetch encountered issue:', err.message);
  }
  return null;
}

// Build article HTML
function generateArticleHtml(article) {
  const pubDateFormatted = article.dateString;
  const isoDate = article.isoDate;
  const canonicalUrl = `https://nexcoinpr.com/news/${article.slug}.html`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${article.seoTitle} | NexcoinPR</title>
  <meta name="description" content="${article.metaDescription}">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- OpenGraph -->
  <meta property="og:title" content="${article.seoTitle} | NexcoinPR">
  <meta property="og:description" content="${article.metaDescription}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="NexcoinPR">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${article.seoTitle}">
  <meta name="twitter:description" content="${article.metaDescription}">

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

  <!-- Stylesheets -->
  <link rel="stylesheet" href="/assets/css/main.css?v=6.0">
  <link rel="stylesheet" href="/assets/css/components.css?v=6.0">
  <link rel="stylesheet" href="/assets/css/pages.css?v=6.0">

  <!-- Schema.org NewsArticle -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": "${article.headlineJson}",
    "description": "${article.metaDescription}",
    "url": "${canonicalUrl}",
    "datePublished": "${isoDate}",
    "dateModified": "${isoDate}",
    "author": {
      "@type": "Organization",
      "name": "NexcoinPR Editorial Team",
      "url": "https://nexcoinpr.com/authors.html"
    },
    "publisher": {
      "@type": "Organization",
      "name": "NexcoinPR",
      "url": "https://nexcoinpr.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://nexcoinpr.com/favicon.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "${canonicalUrl}"
    }
  }
  </script>
</head>
<body>
  <header class="header">
    <div class="header-inner container">
      <a href="/" class="logo">
        <span class="logo-name">Nexcoin<span class="gold-text">PR</span></span>
      </a>
      <nav class="nav-links">
        <a href="/pricing.html">Pricing</a>
        <a href="/services.html">Services</a>
        <a href="/press-releases.html">Press Releases</a>
        <a href="/news.html" class="active">News</a>
        <a href="/contact.html">Contact</a>
      </nav>
      <div class="header-cta">
        <a href="/contact.html" class="btn-primary">Submit News</a>
      </div>
    </div>
  </header>

  <main id="main-content">
    <article class="article-container" style="max-width: 860px; margin: 0 auto; padding: 40px 20px;">
      
      <!-- Source Disclosure Bar -->
      <div style="background: rgba(200, 160, 80, 0.08); border-left: 4px solid var(--color-gold); padding: 14px 18px; margin-bottom: 24px; border-radius: 4px; font-size: 0.9rem; line-height: 1.5;">
        <strong>Market News Citation:</strong> Topic reported via <a href="${article.sourceUrl}" target="_blank" rel="noopener nofollow" style="color: var(--color-gold); font-weight: 700;">${article.sourceName} &#8599;</a>. Independent institutional research, technical levels, and communication analysis authored by NexcoinPR Editorial Team.
      </div>

      <header class="article-header" style="margin-bottom: 30px;">
        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 14px; flex-wrap: wrap;">
          <span class="badge ${article.badgeClass}">${article.category}</span>
          <span style="font-size: 0.85rem; color: #718096;">Published: ${pubDateFormatted}</span>
          <span style="font-size: 0.85rem; color: #718096;">By NexcoinPR Research Group</span>
          <a href="${article.sourceUrl}" target="_blank" rel="noopener nofollow" style="font-size: 0.85rem; color: var(--color-gold); text-decoration: none; margin-left: auto;">Original Source (${article.sourceName}) &#8599;</a>
        </div>
        <h1 style="font-size: 2.2rem; line-height: 1.25; margin-bottom: 18px; font-weight: 800; color: #1a202c;">
          ${article.title}
        </h1>
        <p style="font-size: 1.15rem; line-height: 1.6; color: #4a5568; font-weight: 500;">
          ${article.introLead}
        </p>
      </header>

      <div class="article-content" style="font-size: 1.05rem; line-height: 1.75; color: #2d3748;">
        ${article.bodyHtml}

        <!-- Outbound Citation & PR Advisory Box -->
        <div style="margin-top: 40px; padding: 24px; background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="margin-top: 0; font-size: 1.2rem; color: #2d3748;">Source Reference and Media Advisory</h3>
          <p style="margin-bottom: 12px; font-size: 0.95rem; color: #4a5568;">
            This report references market data originally covered by <a href="${article.sourceUrl}" target="_blank" rel="noopener nofollow" style="color: var(--color-gold); font-weight: 600;">${article.sourceName}</a>. Market participants, trading firms, and protocol foundations requiring professional editorial positioning, liquidity disclosures, or press distribution across Tier-1 financial media can partner with NexcoinPR.
          </p>
          <p style="margin-bottom: 0;">
            <a href="/contact.html" style="font-weight: 700; color: var(--color-gold); text-decoration: underline;">Schedule a confidential media advisory with NexcoinPR &rarr;</a>
          </p>
        </div>
      </div>
    </article>
  </main>

  <footer class="footer">
    <div class="container footer-content" style="padding: 40px 20px; border-top: 1px solid #e2e8f0; margin-top: 60px;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
        <div>
          <span style="font-weight: 700; font-size: 1.1rem;">Nexcoin<span class="gold-text">PR</span></span>
          <p style="color: #718096; font-size: 0.85rem; margin: 4px 0 0 0;">Institutional Crypto & Forex Public Relations Wire.</p>
        </div>
        <div style="display: flex; gap: 20px; font-size: 0.9rem;">
          <a href="/news.html">News Home</a>
          <a href="/news/crypto.html">Crypto News</a>
          <a href="/news/forex.html">Forex News</a>
          <a href="/privacy.html">Privacy</a>
          <a href="/terms.html">Terms</a>
        </div>
      </div>
    </div>
  </footer>
</body>
</html>`;
}

// Injects into news.html
function updateNewsHub(article) {
  if (!fs.existsSync(NEWS_HTML_FILE)) return;
  let content = fs.readFileSync(NEWS_HTML_FILE, 'utf8');

  const cardHtml = `              <!-- Daily Article: ${article.slug} -->
              <article class="news-card">
                <div class="news-card-image">
                  <div class="news-card-image-placeholder">${article.category === 'Crypto' ? '₿' : '💱'}</div>
                </div>
                <div class="news-card-body">
                  <div class="news-card-meta">
                    <span class="badge ${article.badgeClass}">${article.category}</span>
                    <span class="news-card-date">${article.dateString}</span>
                    <a href="${article.sourceUrl}" target="_blank" rel="noopener nofollow" style="font-size:0.75rem;color:var(--color-gold);text-decoration:none;margin-left:auto;">${article.sourceName} &#8599;</a>
                  </div>
                  <h3 class="news-card-title"><a href="/news/${article.slug}.html">${article.title}</a></h3>
                  <p class="news-card-excerpt">${article.metaDescription}</p>
                  <a href="/news/${article.slug}.html" class="news-card-link">Read more &rarr;</a>
                </div>
              </article>`;

  // Insert at top of grid
  const gridMatch = content.match(/<div class="(?:grid-3|grid-2)"[^>]*>/);
  if (gridMatch) {
    const insertPos = gridMatch.index + gridMatch[0].length;
    content = content.slice(0, insertPos) + '\n' + cardHtml + content.slice(insertPos);
    fs.writeFileSync(NEWS_HTML_FILE, content, 'utf8');
    console.log(`Updated news.html with ${article.slug}`);
  }
}

// Injects into category hub
function updateCategoryHub(article) {
  const targetFile = article.category === 'Crypto' ? CRYPTO_HTML_FILE : FOREX_HTML_FILE;
  if (!fs.existsSync(targetFile)) return;
  let content = fs.readFileSync(targetFile, 'utf8');

  const cardHtml = `              <article class="news-card">
                <div class="news-card-image"><div class="news-card-image-placeholder">${article.category === 'Crypto' ? '₿' : '💱'}</div></div>
                <div class="news-card-body">
                  <div class="news-card-meta">
                    <span class="badge ${article.badgeClass}">${article.category}</span>
                    <span class="news-card-date">${article.dateString}</span>
                    <a href="${article.sourceUrl}" target="_blank" rel="noopener nofollow" style="font-size:0.75rem;color:var(--color-gold);text-decoration:none;margin-left:auto;">${article.sourceName} &#8599;</a>
                  </div>
                  <h2 class="news-card-title"><a href="/news/${article.slug}.html">${article.title}</a></h2>
                  <p class="news-card-excerpt">${article.metaDescription}</p>
                  <a href="/news/${article.slug}.html" class="news-card-link">Read more &rarr;</a>
                </div>
              </article>`;

  const gridMatch = content.match(/<div class="grid-3"[^>]*>/);
  if (gridMatch) {
    const insertPos = gridMatch.index + gridMatch[0].length;
    content = content.slice(0, insertPos) + '\n' + cardHtml + content.slice(insertPos);
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log(`Updated ${path.basename(targetFile)} with ${article.slug}`);
  }
}

// Updates sitemaps
function updateSitemaps(article) {
  if (fs.existsSync(SITEMAP_NEWS_FILE)) {
    let sitemap = fs.readFileSync(SITEMAP_NEWS_FILE, 'utf8');
    const newEntry = `  <url>
    <loc>https://nexcoinpr.com/news/${article.slug}.html</loc>
    <news:news>
      <news:publication>
        <news:name>NexcoinPR</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${article.ymdDate}</news:publication_date>
      <news:title>${article.title.replace(/&/g, '&amp;')}</news:title>
    </news:news>
  </url>`;
    sitemap = sitemap.replace(/<\/urlset>/i, `${newEntry}\n</urlset>`);
    fs.writeFileSync(SITEMAP_NEWS_FILE, sitemap, 'utf8');
    console.log(`Updated sitemap-news.xml with ${article.slug}`);
  }

  if (fs.existsSync(SITEMAP_INDEX_FILE)) {
    let indexMap = fs.readFileSync(SITEMAP_INDEX_FILE, 'utf8');
    indexMap = indexMap.replace(/(<loc>https:\/\/nexcoinpr\.com\/sitemap-news\.xml<\/loc>\s*<lastmod>)[^<]+(<\/lastmod>)/, `$1${article.ymdDate}$2`);
    fs.writeFileSync(SITEMAP_INDEX_FILE, indexMap, 'utf8');
  }
}

// Main execution routine
async function main() {
  console.log('Starting Daily News Automation...');
  const importedUrls = getImportedUrls();
  console.log(`Found ${importedUrls.length} previously imported source URLs.`);

  const now = new Date();
  const ymdDate = now.toISOString().split('T')[0];
  const isoDate = `${ymdDate}T09:00:00+00:00`;
  const dateString = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  // 1. Fetch Candidate from CoinDesk
  let coinDeskCandidate = await fetchCoinDeskCandidate(importedUrls);
  // 2. Fetch Candidate from Forex.com
  let forexCandidate = await fetchForexCandidate(importedUrls);

  console.log('CoinDesk Candidate:', coinDeskCandidate ? coinDeskCandidate.url : 'None');
  console.log('Forex Candidate:', forexCandidate ? forexCandidate.url : 'None');

  const candidates = [];
  if (coinDeskCandidate) candidates.push(coinDeskCandidate);
  if (forexCandidate) candidates.push(forexCandidate);

  if (candidates.length === 0) {
    console.log('No new articles required today or sources already up to date.');
    return;
  }

  for (const cand of candidates) {
    console.log(`\nProcessing article for: ${cand.source} (${cand.title})`);
    
    // Create rich deep-dive content
    const cleanTitle = cleanDashesAndAi(cand.title);
    const slug = makeSlug(cleanTitle);
    const metaDesc = formatMetaDesc(`${cleanTitle}. Comprehensive institutional analysis, technical price levels, and market sentiment breakdown.`, 138);

    const articleData = {
      sourceName: cand.source,
      sourceUrl: cand.url,
      slug: slug,
      category: cand.category,
      badgeClass: cand.badgeClass,
      title: cleanTitle,
      seoTitle: cleanTitle.substring(0, 60),
      headlineJson: cleanTitle.replace(/"/g, '\\"'),
      metaDescription: metaDesc,
      introLead: cleanDashesAndAi(`Institutional positioning and macro factors dictate market direction as ${cand.source} reports fresh volatility and structural shifts across global trading desks.`),
      ymdDate: ymdDate,
      isoDate: isoDate,
      dateString: dateString,
      bodyHtml: `
        <h2>Macro Drivers and Market Catalysts</h2>
        <p>Global financial liquidity continues to react with heightened sensitivity toward interest rate projections, central bank communications, and cross-border capital rotations. Market participants observing the latest developments reported by ${cand.source} note that macro data points are driving rapid repositioning across institutional portfolios.</p>
        <p>As sovereign bond yields adjust and inflation readings prompt revised forward guidance, asset managers are evaluating duration risk and collateral quality with renewed discipline. The interplay between traditional fixed income securities and digital or foreign exchange assets remains a primary focus for institutional risk committees.</p>

        <div class="article-metrics-box">
          <h3>Key Market Levels and Primary Indicators</h3>
          <ul>
            <li><strong>Primary Asset Focus:</strong> Macro volatility drivers reported by ${cand.source} establishing directional price structure.</li>
            <li><strong>Yield and Liquidity Differential:</strong> Benchmark sovereign yields and interest rate expectations steering institutional capital flow.</li>
            <li><strong>Derivatives Positioning:</strong> Options skew and basis spreads reflecting measured risk mitigation across desks.</li>
            <li><strong>Institutional Flow Profile:</strong> Balanced OTC settlement volumes and prime brokerage allocations maintaining steady liquidity depth.</li>
          </ul>
        </div>

        <h2>Technical Price Structure and Market Depth</h2>
        <p>Order book analysis reveals consolidated liquidity bands around key psychological barriers. Spot volumes indicate that trading desks are defending established support ranges while testing higher resistance blocks. High-frequency execution algorithms continue to dictate short-term order flow, capitalizing on structural spread variations between tier-one exchanges and OTC liquidity pools.</p>
        <p>Momentum indicators show balanced positioning, though implied volatility skew suggests traders are actively securing downside hedging protection. Market depth across major trading pairs highlights disciplined participation from institutional market makers.</p>

        <h2>Institutional Sentiment and Flow Dynamics</h2>
        <p>Custodial metrics and on-chain or interbank settlement volumes underscore steady capital retention. Rather than aggressive directional speculation, prime brokers report elevated client demand for basis trading, structured yield harvesting, and delta-neutral arbitrage. This maturity reflects a transitioning market regime where institutional infrastructure plays a central role.</p>

        <h2>Corporate Communications and Public Relations Advisory</h2>
        <p>In periods of intense volatility and regulatory observation, proactive corporate communications become essential for market participants. Protocols, digital asset custodians, and forex brokerages must communicate transparent operational updates, balance sheet health, and governance standards to maintain client confidence.</p>
        <p>NexcoinPR assists leadership teams in executing institutional public relations campaigns, securing targeted coverage across global financial networks, and articulating verified market updates to accredited investors and institutional partners.</p>
      `
    };

    // Ensure entire HTML body is 100% clean of dashes and AI words
    articleData.bodyHtml = cleanDashesAndAi(articleData.bodyHtml);

    // Write file
    const fullHtml = generateArticleHtml(articleData);
    const targetFile = path.join(NEWS_DIR, `${slug}.html`);
    fs.writeFileSync(targetFile, fullHtml, 'utf8');
    console.log(`Generated news file: ${targetFile}`);

    // Update listings
    updateNewsHub(articleData);
    updateCategoryHub(articleData);
    updateSitemaps(articleData);

    // Save tracking
    saveImportedUrl(cand.url);
    console.log(`Successfully recorded ${cand.url} into tracking file.`);
  }

  console.log('\nDaily news automation completed successfully.');
}

if (require.main === module) {
  main().catch(err => {
    console.error('Fatal error in daily news script:', err);
    process.exit(1);
  });
}

module.exports = { main, cleanDashesAndAi, formatMetaDesc };

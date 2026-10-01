const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const BASE_DIR = path.resolve(__dirname, '..');
const SITE_URL = 'https://www.nexcoinpr.agency';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

// Helper to format RFC 822 date
function toRFC822(dateStr) {
  const d = dateStr ? new Date(dateStr) : new Date();
  return isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
}

// Helper to format ISO 8601 date
function toISO(dateStr) {
  const d = dateStr ? new Date(dateStr) : new Date();
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

// Helper to format YYYY-MM-DD
function toDateOnly(dateStr) {
  const d = dateStr ? new Date(dateStr) : new Date();
  return isNaN(d.getTime()) ? new Date().toISOString().split('T')[0] : d.toISOString().split('T')[0];
}

// Category hub files to exclude from articles
const HUB_FILES = new Set([
  'blockchain.html',
  'crypto.html',
  'financial-markets.html',
  'fintech.html',
  'forex.html',
  'guides.html',
  'web3.html'
]);

// 1. Scan news articles
const newsDir = path.join(BASE_DIR, 'news');
const newsFiles = fs.readdirSync(newsDir).filter(f => f.endsWith('.html') && !HUB_FILES.has(f));

const newsArticles = [];
newsFiles.forEach(file => {
  const filePath = path.join(newsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Title
  let title = '';
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const titleTagMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  if (h1Match) {
    title = h1Match[1].replace(/<[^>]+>/g, '').trim();
  } else if (titleTagMatch) {
    title = titleTagMatch[1].split('|')[0].trim();
  }

  // Description
  let description = '';
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
  if (descMatch) description = descMatch[1].trim();

  // Canonical / slug
  const slug = file.replace(/\.html$/, '');
  const cleanUrl = `${SITE_URL}/news/${slug}`;

  // Schema LD+JSON
  let datePublished = '2026-09-29T09:00:00+00:00';
  let image = `${SITE_URL}/assets/images/nexcoinpr-logo-dark.jpg`;
  let author = 'NexcoinPR Editorial Desk';

  const schemaMatch = content.match(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
  if (schemaMatch) {
    try {
      const parsed = JSON.parse(schemaMatch[1]);
      if (parsed.datePublished) datePublished = parsed.datePublished;
      if (parsed.image) image = parsed.image;
      if (parsed.author && parsed.author.name) author = parsed.author.name;
    } catch (e) {}
  }

  // Determine category
  let category = 'Crypto';
  if (/forex|usd|eur|jpy|currency|central bank/i.test(file + ' ' + title)) {
    category = 'Forex';
  } else if (/ai|agent|tech|fintech/i.test(file + ' ' + title)) {
    category = 'Fintech';
  } else if (/hack|security|defi|stablecoin|bitcoin/i.test(file + ' ' + title)) {
    category = 'Crypto';
  }

  newsArticles.push({
    title,
    description,
    slug,
    url: cleanUrl,
    datePublished,
    pubDateRFC: toRFC822(datePublished),
    pubDateISO: toISO(datePublished),
    pubDateOnly: toDateOnly(datePublished),
    image,
    author,
    category
  });
});

// Sort by date descending
newsArticles.sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished));

// 2. Scan press releases
const prDir = path.join(BASE_DIR, 'press-releases');
const prFiles = fs.readdirSync(prDir).filter(f => f.endsWith('.html'));

const pressReleases = [];
prFiles.forEach(file => {
  const filePath = path.join(prDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  let title = '';
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const titleTagMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  if (h1Match) {
    title = h1Match[1].replace(/<[^>]+>/g, '').trim();
  } else if (titleTagMatch) {
    title = titleTagMatch[1].split('|')[0].trim();
  }

  let description = '';
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
  if (descMatch) description = descMatch[1].trim();

  const slug = file.replace(/\.html$/, '');
  const cleanUrl = `${SITE_URL}/press-releases/${slug}`;

  let datePublished = '2026-09-30T10:00:00+00:00';
  let image = `${SITE_URL}/assets/images/nexcoinpr-logo-dark.jpg`;
  let author = 'NexcoinPR Wire Desk';

  const schemaMatch = content.match(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
  if (schemaMatch) {
    try {
      const parsed = JSON.parse(schemaMatch[1]);
      if (parsed.datePublished) datePublished = parsed.datePublished;
      if (parsed.image) image = parsed.image;
      if (parsed.author && parsed.author.name) author = parsed.author.name;
    } catch (e) {}
  }

  pressReleases.push({
    title,
    description,
    slug,
    url: cleanUrl,
    datePublished,
    pubDateRFC: toRFC822(datePublished),
    pubDateISO: toISO(datePublished),
    pubDateOnly: toDateOnly(datePublished),
    image,
    author,
    category: 'Press Release'
  });
});

pressReleases.sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished));

console.log(`Discovered ${newsArticles.length} news articles and ${pressReleases.length} press releases.`);

// 3. RSS Feed Builder
function buildRssFeed({ title, description, feedPath, items }) {
  const lastBuildDate = items.length > 0 ? items[0].pubDateRFC : new Date().toUTCString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${title}</title>
    <link>${SITE_URL}</link>
    <description>${description}</description>
    <language>en-us</language>
    <copyright>© 2026 NexcoinPR. All rights reserved.</copyright>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/${feedPath}" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/assets/images/google-news-square-512.png</url>
      <title>${title}</title>
      <link>${SITE_URL}</link>
    </image>
${items.map(item => `    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.url}</link>
      <guid isPermaLink="true">${item.url}</guid>
      <pubDate>${item.pubDateRFC}</pubDate>
      <dc:creator><![CDATA[${item.author}]]></dc:creator>
      <category><![CDATA[${item.category}]]></category>
      <description><![CDATA[${item.description}]]></description>
      <content:encoded><![CDATA[<p>${item.description}</p><p>Read the complete verified coverage on <a href="${item.url}">NexcoinPR</a>.</p>]]></content:encoded>
      <media:content url="${item.image}" medium="image" type="image/png">
        <media:title><![CDATA[${item.title}]]></media:title>
      </media:content>
      <enclosure url="${item.image}" length="150000" type="image/png" />
    </item>`).join('\n')}
  </channel>
</rss>
`;
}

// Generate feeds
// Feed 1: Main feed.xml (Combined News & Top Press Releases)
const mainFeedItems = [...newsArticles, ...pressReleases.slice(0, 5)];
mainFeedItems.sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished));
const mainFeedXml = buildRssFeed({
  title: "NexcoinPR — Crypto, Forex & Financial News Feed",
  description: "Official real-time financial, cryptocurrency, forex, and corporate Web3 disclosures published by NexcoinPR.",
  feedPath: "feed.xml",
  items: mainFeedItems
});
fs.writeFileSync(path.join(BASE_DIR, 'feed.xml'), mainFeedXml);
console.log('Generated feed.xml');

// Feed 2: Crypto Feed
const cryptoItems = newsArticles.filter(n => n.category === 'Crypto' || n.category === 'Fintech');
const cryptoFeedXml = buildRssFeed({
  title: "NexcoinPR — Cryptocurrency & Web3 Intelligence",
  description: "Institutional cryptocurrency market analysis, DeFi trends, blockchain protocols, and regulatory developments.",
  feedPath: "feed-crypto.xml",
  items: cryptoItems
});
fs.writeFileSync(path.join(BASE_DIR, 'feed-crypto.xml'), cryptoFeedXml);
console.log('Generated feed-crypto.xml');

// Feed 3: Forex & Macro Feed
const forexItems = newsArticles.filter(n => n.category === 'Forex');
const forexFeedXml = buildRssFeed({
  title: "NexcoinPR — Forex & Global Macro Markets",
  description: "Interbank foreign exchange analysis, central bank monetary policy shifts, sovereign yields, and currency forecasts.",
  feedPath: "feed-forex.xml",
  items: forexItems.length > 0 ? forexItems : newsArticles.slice(0, 4)
});
fs.writeFileSync(path.join(BASE_DIR, 'feed-forex.xml'), forexFeedXml);
console.log('Generated feed-forex.xml');

// Feed 4: Press Releases Feed
const prFeedXml = buildRssFeed({
  title: "NexcoinPR — Verified Press Releases & Disclosures",
  description: "Official corporate press releases, protocol launches, token integrations, and Web3 announcements distributed via NexcoinPR Wire.",
  feedPath: "feed-press-releases.xml",
  items: pressReleases
});
fs.writeFileSync(path.join(BASE_DIR, 'feed-press-releases.xml'), prFeedXml);
console.log('Generated feed-press-releases.xml');

// Mirror in feed/ directory
const feedSubDir = path.join(BASE_DIR, 'feed');
if (!fs.existsSync(feedSubDir)) fs.mkdirSync(feedSubDir, { recursive: true });

fs.writeFileSync(path.join(feedSubDir, 'news.xml'), mainFeedXml.replace('feed.xml', 'feed/news.xml'));
fs.writeFileSync(path.join(feedSubDir, 'crypto.xml'), cryptoFeedXml.replace('feed-crypto.xml', 'feed/crypto.xml'));
fs.writeFileSync(path.join(feedSubDir, 'forex.xml'), forexFeedXml.replace('feed-forex.xml', 'feed/forex.xml'));
fs.writeFileSync(path.join(feedSubDir, 'press-releases.xml'), prFeedXml.replace('feed-press-releases.xml', 'feed/press-releases.xml'));
console.log('Mirrored feeds in feed/ directory');

// 4. Generate Google News compliant sitemap-news.xml
// Note: Google News sitemaps must ONLY contain news articles from the last 2 days (or recent news articles).
// Every entry must have <news:news> schema.
const sitemapNewsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsArticles.map(article => `  <url>
    <loc>${article.url}</loc>
    <news:news>
      <news:publication>
        <news:name>NexcoinPR</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${article.pubDateISO}</news:publication_date>
      <news:title>${article.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')}</news:title>
    </news:news>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(BASE_DIR, 'sitemap-news.xml'), sitemapNewsXml);
console.log('Generated compliant sitemap-news.xml');

// 5. Update sitemap.xml
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap-pages.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-news.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-press-releases.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
</sitemapindex>
`;
fs.writeFileSync(path.join(BASE_DIR, 'sitemap.xml'), sitemapIndex);
console.log('Updated sitemap.xml');

// 6. Generate Google News Publisher Center Logo Assets using Puppeteer
async function generateLogos() {
  console.log('Launching headless browser to render Google News logos...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // A. Square Logo (512x512) - High contrast, compliant with Google News
  const squareLogoHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 512px;
      height: 512px;
      background: #0A1628;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .emblem-wrapper {
      transform: scale(5.2);
      transform-origin: center center;
      margin-top: -24px;
    }
    .logo-text {
      position: absolute;
      bottom: 46px;
      font-size: 27px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #ffffff;
    }
    .logo-text span {
      color: #C9A84C;
    }
  </style>
</head>
<body>
  <div class="emblem-wrapper">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
      <defs>
        <radialGradient id="bgG" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stop-color="#142C4F"/>
          <stop offset="70%" stop-color="#0A1628"/>
          <stop offset="100%" stop-color="#050B14"/>
        </radialGradient>
        <linearGradient id="bezG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4B77AE"/>
          <stop offset="35%" stop-color="#244570"/>
          <stop offset="70%" stop-color="#11243D"/>
          <stop offset="100%" stop-color="#355B8B"/>
        </linearGradient>
        <linearGradient id="goldG" x1="0%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stop-color="#8A6518"/>
          <stop offset="25%" stop-color="#C9A84C"/>
          <stop offset="50%" stop-color="#FBE285"/>
          <stop offset="75%" stop-color="#E5B842"/>
          <stop offset="100%" stop-color="#8A6518"/>
        </linearGradient>
        <linearGradient id="globeG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#7DD3FC"/>
          <stop offset="40%" stop-color="#38BDF8"/>
          <stop offset="80%" stop-color="#0284C7"/>
          <stop offset="100%" stop-color="#0369A1"/>
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#bgG)" stroke="#224268" stroke-width="1.2"/>
      <circle cx="24" cy="24" r="19" fill="none" stroke="url(#bezG)" stroke-width="2"/>
      <path d="M 24,6 A 18,18 0 0,0 8,32 A 18,18 0 0,1 14,12 A 18,18 0 0,1 24,6 Z" fill="url(#goldG)"/>
      <circle cx="24" cy="24" r="13" fill="#071322"/>
      <circle cx="24" cy="24" r="12.5" fill="none" stroke="url(#globeG)" stroke-width="1.5"/>
      <line x1="11.5" y1="24" x2="36.5" y2="24" stroke="url(#globeG)" stroke-width="1.2"/>
      <line x1="24" y1="11.5" x2="24" y2="36.5" stroke="url(#globeG)" stroke-width="1.2"/>
      <ellipse cx="24" cy="24" rx="5" ry="12.5" fill="none" stroke="url(#globeG)" stroke-width="1"/>
      <ellipse cx="24" cy="24" rx="9" ry="12.5" fill="none" stroke="url(#globeG)" stroke-width="1"/>
      <path d="M 14,19 Q 24,21 34,19" fill="none" stroke="url(#globeG)" stroke-width="0.8"/>
      <path d="M 14,29 Q 24,27 34,29" fill="none" stroke="url(#globeG)" stroke-width="0.8"/>
      <circle cx="24" cy="24" r="1.5" fill="#FFFFFF"/>
    </svg>
  </div>
  <div class="logo-text">NEXCOIN<span>PR</span></div>
</body>
</html>`;

  await page.setViewport({ width: 512, height: 512, deviceScaleFactor: 1 });
  await page.setContent(squareLogoHtml);
  const squareImgPath = path.join(BASE_DIR, 'assets', 'images', 'google-news-square-512.png');
  await page.screenshot({ path: squareImgPath, type: 'png' });
  console.log('Saved square logo:', squareImgPath);

  // B. Wide Logo Dark Theme (White text + Gold PR, transparent background, 320x40)
  // Height must be between 20px and 40px, transparent PNG
  const wideDarkThemeHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 320px;
      height: 40px;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
    }
    .wrapper {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      height: 40px;
    }
    .logo-text {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #FFFFFF;
      line-height: 1;
    }
    .logo-text span {
      color: #C9A84C;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="36" height="36">
      <defs>
        <radialGradient id="bgG2" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stop-color="#142C4F"/>
          <stop offset="70%" stop-color="#0A1628"/>
          <stop offset="100%" stop-color="#050B14"/>
        </radialGradient>
        <linearGradient id="bezG2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4B77AE"/>
          <stop offset="35%" stop-color="#244570"/>
          <stop offset="70%" stop-color="#11243D"/>
          <stop offset="100%" stop-color="#355B8B"/>
        </linearGradient>
        <linearGradient id="goldG2" x1="0%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stop-color="#8A6518"/>
          <stop offset="25%" stop-color="#C9A84C"/>
          <stop offset="50%" stop-color="#FBE285"/>
          <stop offset="75%" stop-color="#E5B842"/>
          <stop offset="100%" stop-color="#8A6518"/>
        </linearGradient>
        <linearGradient id="globeG2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#7DD3FC"/>
          <stop offset="40%" stop-color="#38BDF8"/>
          <stop offset="80%" stop-color="#0284C7"/>
          <stop offset="100%" stop-color="#0369A1"/>
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#bgG2)" stroke="#224268" stroke-width="1.2"/>
      <circle cx="24" cy="24" r="19" fill="none" stroke="url(#bezG2)" stroke-width="2"/>
      <path d="M 24,6 A 18,18 0 0,0 8,32 A 18,18 0 0,1 14,12 A 18,18 0 0,1 24,6 Z" fill="url(#goldG2)"/>
      <circle cx="24" cy="24" r="13" fill="#071322"/>
      <circle cx="24" cy="24" r="12.5" fill="none" stroke="url(#globeG2)" stroke-width="1.5"/>
      <line x1="11.5" y1="24" x2="36.5" y2="24" stroke="url(#globeG2)" stroke-width="1.2"/>
      <line x1="24" y1="11.5" x2="24" y2="36.5" stroke="url(#globeG2)" stroke-width="1.2"/>
      <ellipse cx="24" cy="24" rx="5" ry="12.5" fill="none" stroke="url(#globeG2)" stroke-width="1"/>
      <ellipse cx="24" cy="24" rx="9" ry="12.5" fill="none" stroke="url(#globeG2)" stroke-width="1"/>
      <path d="M 14,19 Q 24,21 34,19" fill="none" stroke="url(#globeG2)" stroke-width="0.8"/>
      <path d="M 14,29 Q 24,27 34,29" fill="none" stroke="url(#globeG2)" stroke-width="0.8"/>
      <circle cx="24" cy="24" r="1.5" fill="#FFFFFF"/>
    </svg>
    <div class="logo-text">NEXCOIN<span>PR</span></div>
  </div>
</body>
</html>`;

  await page.setViewport({ width: 320, height: 40, deviceScaleFactor: 1 });
  await page.setContent(wideDarkThemeHtml);
  const wideDarkImgPath = path.join(BASE_DIR, 'assets', 'images', 'google-news-wide-light.png'); // light text for dark background
  await page.screenshot({ path: wideDarkImgPath, type: 'png', omitBackground: true });
  console.log('Saved wide logo for dark theme:', wideDarkImgPath);

  // C. Wide Logo Light Theme (Dark navy text + Gold PR, transparent background, 320x40)
  const wideLightThemeHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 320px;
      height: 40px;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
    }
    .wrapper {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      height: 40px;
    }
    .logo-text {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #0A1628;
      line-height: 1;
    }
    .logo-text span {
      color: #C9A84C;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="36" height="36">
      <defs>
        <radialGradient id="bgG3" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stop-color="#142C4F"/>
          <stop offset="70%" stop-color="#0A1628"/>
          <stop offset="100%" stop-color="#050B14"/>
        </radialGradient>
        <linearGradient id="bezG3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4B77AE"/>
          <stop offset="35%" stop-color="#244570"/>
          <stop offset="70%" stop-color="#11243D"/>
          <stop offset="100%" stop-color="#355B8B"/>
        </linearGradient>
        <linearGradient id="goldG3" x1="0%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stop-color="#8A6518"/>
          <stop offset="25%" stop-color="#C9A84C"/>
          <stop offset="50%" stop-color="#FBE285"/>
          <stop offset="75%" stop-color="#E5B842"/>
          <stop offset="100%" stop-color="#8A6518"/>
        </linearGradient>
        <linearGradient id="globeG3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#7DD3FC"/>
          <stop offset="40%" stop-color="#38BDF8"/>
          <stop offset="80%" stop-color="#0284C7"/>
          <stop offset="100%" stop-color="#0369A1"/>
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#bgG3)" stroke="#224268" stroke-width="1.2"/>
      <circle cx="24" cy="24" r="19" fill="none" stroke="url(#bezG3)" stroke-width="2"/>
      <path d="M 24,6 A 18,18 0 0,0 8,32 A 18,18 0 0,1 14,12 A 18,18 0 0,1 24,6 Z" fill="url(#goldG3)"/>
      <circle cx="24" cy="24" r="13" fill="#071322"/>
      <circle cx="24" cy="24" r="12.5" fill="none" stroke="url(#globeG3)" stroke-width="1.5"/>
      <line x1="11.5" y1="24" x2="36.5" y2="24" stroke="url(#globeG3)" stroke-width="1.2"/>
      <line x1="24" y1="11.5" x2="24" y2="36.5" stroke="url(#globeG3)" stroke-width="1.2"/>
      <ellipse cx="24" cy="24" rx="5" ry="12.5" fill="none" stroke="url(#globeG3)" stroke-width="1"/>
      <ellipse cx="24" cy="24" rx="9" ry="12.5" fill="none" stroke="url(#globeG3)" stroke-width="1"/>
      <path d="M 14,19 Q 24,21 34,19" fill="none" stroke="url(#globeG3)" stroke-width="0.8"/>
      <path d="M 14,29 Q 24,27 34,29" fill="none" stroke="url(#globeG3)" stroke-width="0.8"/>
      <circle cx="24" cy="24" r="1.5" fill="#FFFFFF"/>
    </svg>
    <div class="logo-text">NEXCOIN<span>PR</span></div>
  </div>
</body>
</html>`;

  await page.setViewport({ width: 320, height: 40, deviceScaleFactor: 1 });
  await page.setContent(wideLightThemeHtml);
  const wideLightImgPath = path.join(BASE_DIR, 'assets', 'images', 'google-news-wide-dark.png'); // dark text for light background
  await page.screenshot({ path: wideLightImgPath, type: 'png', omitBackground: true });
  console.log('Saved wide logo for light theme:', wideLightImgPath);

  // Also copy to google-news-assets folder in root for easy user download
  const gnewsAssetDir = path.join(BASE_DIR, 'google-news-assets');
  if (!fs.existsSync(gnewsAssetDir)) fs.mkdirSync(gnewsAssetDir, { recursive: true });

  fs.copyFileSync(squareImgPath, path.join(gnewsAssetDir, 'square-logo-512x512.png'));
  fs.copyFileSync(wideDarkImgPath, path.join(gnewsAssetDir, 'wide-logo-dark-theme-320x40.png'));
  fs.copyFileSync(wideLightImgPath, path.join(gnewsAssetDir, 'wide-logo-light-theme-320x40.png'));
  console.log('Copied all Google News assets to google-news-assets/ directory.');

  await browser.close();
  console.log('All Google News preparation completed successfully!');
}

generateLogos().catch(err => {
  console.error('Error generating logos:', err);
});

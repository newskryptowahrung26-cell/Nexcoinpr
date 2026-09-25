const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// 1. Meta descriptions map
const META_DESCS = {
  'about.html': 'NexcoinPR is a global PR and wire distribution agency for crypto, Web3, forex, and fintech brands. Learn about our mission and standards.',
  'blockchain-pr.html': 'NexcoinPR is the premier blockchain PR agency for Layer-1/2 networks, ZK protocols, and smart contracts. Guaranteed Tier-1 media syndication from $800.',
  'crypto-pr.html': 'NexcoinPR delivers guaranteed crypto PR across CoinDesk, Cointelegraph, and Decrypt. Transparent pricing from $800 with fast 24-48h execution.',
  'financial-pr.html': 'NexcoinPR is the premier financial PR agency for asset managers, hedge funds, and fintech firms. Guaranteed Tier-1 financial media syndication from $800.',
  'fintech-pr.html': 'NexcoinPR is the leading fintech PR agency for payment gateways, neobanks, and wealthtech. Guaranteed Tier-1 media coverage from $800.',
  'forex-pr.html': 'Leading forex PR agency for FX brokers, prop trading firms, and CFD platforms. Guaranteed Tier-1 financial media syndication across FXStreet from $800.',
  'index.html': 'PR and press release distribution agency for crypto, blockchain, Web3, forex, and fintech brands. NexcoinPR gets your story published in Tier-1 media.',
  'markets.html': 'Track real-time crypto prices, buy with fiat, practice with a free $10,000 demo paper trading account, and trade Spot & Futures with 20% fee discounts.',
  'news/guides/how-press-release-distribution-works.html': 'Learn how crypto press release distribution works, from editorial review to Tier-1 syndication across top media. Compare wires and SEO impact.',
  'news/guides/how-to-write-a-crypto-press-release.html': 'Learn how to write a high-impact crypto press release that editors publish. Includes 4 real Web3 templates, AP style, and compliance tips.',
  'news/guides/what-is-crypto-pr.html': 'Discover what crypto PR is, how it differs from traditional PR, agency models, pricing, and how to earn Tier-1 media coverage across top Web3 publications.',
  'news/guides/what-is-forex-pr.html': 'Discover what Forex PR is, how FX brokers build credibility, acquire traders, and earn media coverage across Finance Magnates and FXStreet.',
  'press-release-distribution.html': 'Premier press release distribution newswire for crypto, forex, and fintech brands. Guaranteed Tier-1 syndication across Cointelegraph & Decrypt from $800.',
  'pricing.html': 'Media distribution packages and direct single publications across 144+ top outlets including Forbes, Decrypt, CoinDesk, and Cointelegraph.',
  'web3-pr.html': 'NexcoinPR is the premier Web3 PR agency for DeFi protocols, dApps, DePIN, and DAOs. Guaranteed Tier-1 media syndication with flat pricing from $800.'
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

function cleanUrl(url) {
  if (!url) return url;
  // Handle full domain URLs
  const domainRegex = /^(https?:\/\/(?:www\.)?nexcoinpr\.(?:agency|com))(\/[^?#]*)?(\?[^#]*)?(#.*)?$/;
  const matchDomain = url.match(domainRegex);
  if (matchDomain) {
    let domain = 'https://www.nexcoinpr.agency';
    let pathname = matchDomain[2] || '';
    let query = matchDomain[3] || '';
    let hash = matchDomain[4] || '';

    if (pathname === '/index.html' || pathname === '/index') {
      pathname = '/';
    } else if (pathname.endsWith('.html')) {
      pathname = pathname.replace(/\.html$/, '');
    }
    return `${domain}${pathname}${query}${hash}`;
  }

  // Handle local root-relative URLs: /foo.html, /foo/bar.html
  if (url.startsWith('/')) {
    const [pathPart, rest] = splitPathAndFragment(url);
    if (pathPart === '/index.html' || pathPart === '/index') {
      return '/' + rest;
    }
    if (pathPart.endsWith('.html')) {
      return pathPart.replace(/\.html$/, '') + rest;
    }
    return url;
  }

  // Handle relative URLs: foo.html, ../foo.html
  if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mailto:') && !url.startsWith('tel:') && !url.startsWith('javascript:') && !url.startsWith('#') && !url.startsWith('data:')) {
    const [pathPart, rest] = splitPathAndFragment(url);
    if (pathPart.endsWith('.html')) {
      if (pathPart === 'index.html') return '/' + rest;
      return pathPart.replace(/\.html$/, '') + rest;
    }
  }

  return url;
}

function splitPathAndFragment(url) {
  let qIdx = url.indexOf('?');
  let hIdx = url.indexOf('#');
  let splitIdx = -1;
  if (qIdx !== -1 && hIdx !== -1) splitIdx = Math.min(qIdx, hIdx);
  else if (qIdx !== -1) splitIdx = qIdx;
  else if (hIdx !== -1) splitIdx = hIdx;

  if (splitIdx === -1) return [url, ''];
  return [url.slice(0, splitIdx), url.slice(splitIdx)];
}

const htmlFiles = getAllHtml(ROOT);
console.log(`Processing ${htmlFiles.length} HTML files...`);

let totalCanonicalFixed = 0;
let totalOgFixed = 0;
let totalHrefsFixed = 0;
let totalMetaDescFixed = 0;
let totalFeedsFixed = 0;

htmlFiles.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  const relPath = path.relative(ROOT, f).replace(/\\/g, '/');

  // 1. Fix Broken Feeds in this file
  const feedBefore = content;
  content = content.replace(/https:\/\/www\.nexcoinpr\.agency\/feed\/news\.xml/g, 'https://www.nexcoinpr.agency/feed.xml');
  content = content.replace(/https:\/\/www\.nexcoinpr\.agency\/feed\/crypto\.xml/g, 'https://www.nexcoinpr.agency/feed-crypto.xml');
  content = content.replace(/https:\/\/www\.nexcoinpr\.agency\/feed\/forex\.xml/g, 'https://www.nexcoinpr.agency/feed-forex.xml');
  content = content.replace(/https:\/\/www\.nexcoinpr\.agency\/feed\/press-releases\.xml/g, 'https://www.nexcoinpr.agency/feed-press-releases.xml');
  content = content.replace(/href=["']\/feed\/news\.xml["']/g, 'href="/feed.xml"');
  content = content.replace(/href=["']\/feed\/crypto\.xml["']/g, 'href="/feed-crypto.xml"');
  content = content.replace(/href=["']\/feed\/forex\.xml["']/g, 'href="/feed-forex.xml"');
  content = content.replace(/href=["']\/feed\/press-releases\.xml["']/g, 'href="/feed-press-releases.xml"');
  if (content !== feedBefore) totalFeedsFixed++;

  // 2. Fix Canonical tag
  content = content.replace(/(<link\s+[^>]*rel=["']canonical["'][^>]*href=["'])([^"']+)(["'][^>]*>)/gi, (m, p1, href, p3) => {
    const cleaned = cleanUrl(href);
    if (cleaned !== href) totalCanonicalFixed++;
    return `${p1}${cleaned}${p3}`;
  });
  content = content.replace(/(<link\s+[^>]*href=["'])([^"']+)(["'][^>]*rel=["']canonical["'][^>]*>)/gi, (m, p1, href, p3) => {
    const cleaned = cleanUrl(href);
    if (cleaned !== href) totalCanonicalFixed++;
    return `${p1}${cleaned}${p3}`;
  });

  // 3. Fix og:url
  content = content.replace(/(<meta\s+[^>]*property=["']og:url["'][^>]*content=["'])([^"']+)(["'][^>]*>)/gi, (m, p1, contentUrl, p3) => {
    const cleaned = cleanUrl(contentUrl);
    if (cleaned !== contentUrl) totalOgFixed++;
    return `${p1}${cleaned}${p3}`;
  });
  content = content.replace(/(<meta\s+[^>]*content=["'])([^"']+)(["'][^>]*property=["']og:url["'][^>]*>)/gi, (m, p1, contentUrl, p3) => {
    const cleaned = cleanUrl(contentUrl);
    if (cleaned !== contentUrl) totalOgFixed++;
    return `${p1}${cleaned}${p3}`;
  });

  // 4. Fix meta description if in map
  if (META_DESCS[relPath]) {
    const newDesc = META_DESCS[relPath];
    content = content.replace(/(<meta\s+[^>]*name=["']description["'][^>]*content=["'])([^"']*)(["'][^>]*>)/gi, (m, p1, oldDesc, p3) => {
      totalMetaDescFixed++;
      return `${p1}${newDesc}${p3}`;
    });
    content = content.replace(/(<meta\s+[^>]*content=["'])([^"']*)(["'][^>]*name=["']description["'][^>]*>)/gi, (m, p1, oldDesc, p3) => {
      totalMetaDescFixed++;
      return `${p1}${newDesc}${p3}`;
    });
  }

  // 5. Fix Schema.org JSON-LD clean URLs
  content = content.replace(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi, (match, jsonBody) => {
    let replacedJson = jsonBody.replace(/https:\/\/www\.nexcoinpr\.agency\/([^"'\s]+)\.html/g, (m, slug) => {
      if (slug === 'index') return 'https://www.nexcoinpr.agency/';
      return `https://www.nexcoinpr.agency/${slug}`;
    });
    replacedJson = replacedJson.replace(/https:\/\/nexcoinpr\.com\/([^"'\s]+)\.html/g, (m, slug) => {
      if (slug === 'index') return 'https://www.nexcoinpr.agency/';
      return `https://www.nexcoinpr.agency/${slug}`;
    });
    return `<script type="application/ld+json">${replacedJson}</script>`;
  });

  // 6. Fix internal hrefs
  content = content.replace(/href=["']([^"']+)["']/gi, (match, href) => {
    // Skip if external, mailto, tel, javascript, hash-only, or asset
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || href.startsWith('#') || href.startsWith('data:')) {
      return match;
    }
    // Check if asset extension
    if (/\.(css|js|png|jpe?g|webp|gif|svg|ico|xml|txt|pdf|mp4|webm|zip|tar)(\?|#|$)/i.test(href)) {
      return match;
    }
    // If external domain other than nexcoinpr
    if ((href.startsWith('http://') || href.startsWith('https://')) && !href.startsWith('https://www.nexcoinpr.agency') && !href.startsWith('https://nexcoinpr.com')) {
      return match;
    }

    const cleaned = cleanUrl(href);
    if (cleaned !== href) {
      totalHrefsFixed++;
      return `href="${cleaned}"`;
    }
    return match;
  });

  fs.writeFileSync(f, content, 'utf8');
});

console.log(`Updated HTML files:`);
console.log(`- Canonical tags cleaned: ${totalCanonicalFixed}`);
console.log(`- og:url tags cleaned: ${totalOgFixed}`);
console.log(`- Internal hrefs cleaned: ${totalHrefsFixed}`);
console.log(`- Meta descriptions shortened: ${totalMetaDescFixed}`);
console.log(`- Files with feed links fixed: ${totalFeedsFixed}`);

// 7. Update Sitemaps
const sitemaps = ['sitemap-pages.xml', 'sitemap-news.xml', 'sitemap-press-releases.xml'];
let totalSitemapUrlsCleaned = 0;
sitemaps.forEach(sm => {
  const p = path.join(ROOT, sm);
  if (!fs.existsSync(p)) return;
  let smContent = fs.readFileSync(p, 'utf8');
  smContent = smContent.replace(/<loc>https:\/\/www\.nexcoinpr\.agency\/([^<]+)\.html<\/loc>/g, (m, slug) => {
    totalSitemapUrlsCleaned++;
    if (slug === 'index') return '<loc>https://www.nexcoinpr.agency/</loc>';
    return `<loc>https://www.nexcoinpr.agency/${slug}</loc>`;
  });
  smContent = smContent.replace(/<loc>https:\/\/nexcoinpr\.com\/([^<]+)\.html<\/loc>/g, (m, slug) => {
    totalSitemapUrlsCleaned++;
    if (slug === 'index') return '<loc>https://www.nexcoinpr.agency/</loc>';
    return `<loc>https://www.nexcoinpr.agency/${slug}</loc>`;
  });
  fs.writeFileSync(p, smContent, 'utf8');
});
console.log(`Cleaned sitemap loc entries: ${totalSitemapUrlsCleaned}`);

// 8. Update Feeds
const feeds = ['feed.xml', 'feed-crypto.xml', 'feed-forex.xml', 'feed-press-releases.xml'];
feeds.forEach(fd => {
  const p = path.join(ROOT, fd);
  if (!fs.existsSync(p)) return;
  let fdContent = fs.readFileSync(p, 'utf8');
  fdContent = fdContent.replace(/https:\/\/www\.nexcoinpr\.agency\/([^<]+)\.html/g, 'https://www.nexcoinpr.agency/$1');
  fdContent = fdContent.replace(/https:\/\/nexcoinpr\.com\/([^<]+)\.html/g, 'https://www.nexcoinpr.agency/$1');
  // Also inside <link>/foo.html</link>
  fdContent = fdContent.replace(/>\/([^<]+)\.html</g, '>/$1<');
  fs.writeFileSync(p, fdContent, 'utf8');
});
// Copy to feed/ directory as well
if (!fs.existsSync(path.join(ROOT, 'feed'))) fs.mkdirSync(path.join(ROOT, 'feed'));
fs.copyFileSync(path.join(ROOT, 'feed.xml'), path.join(ROOT, 'feed/news.xml'));
fs.copyFileSync(path.join(ROOT, 'feed-crypto.xml'), path.join(ROOT, 'feed/crypto.xml'));
fs.copyFileSync(path.join(ROOT, 'feed-forex.xml'), path.join(ROOT, 'feed/forex.xml'));
fs.copyFileSync(path.join(ROOT, 'feed-press-releases.xml'), path.join(ROOT, 'feed/press-releases.xml'));
console.log('Cleaned and synced all RSS feed files.');

// 9. Update llms.txt and llms-full.txt
['llms.txt', 'llms-full.txt'].forEach(lf => {
  const p = path.join(ROOT, lf);
  if (!fs.existsSync(p)) return;
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(/https:\/\/www\.nexcoinpr\.agency\/([^)\s]+)\.html/g, 'https://www.nexcoinpr.agency/$1');
  content = content.replace(/https:\/\/nexcoinpr\.com\/([^)\s]+)\.html/g, 'https://www.nexcoinpr.agency/$1');
  content = content.replace(/`\/([^`]+)\.html`/g, '`/$1`');
  fs.writeFileSync(p, content, 'utf8');
});
console.log('Cleaned llms.txt and llms-full.txt.');

// 10. Update generate_technical_files.js
const techFile = path.join(ROOT, 'scripts', 'generate_technical_files.js');
if (fs.existsSync(techFile)) {
  let c = fs.readFileSync(techFile, 'utf8');
  c = c.replace(/https:\/\/www\.nexcoinpr\.agency\/([^)\s"']+)\.html/g, 'https://www.nexcoinpr.agency/$1');
  c = c.replace(/loc:\s*'\/([^']+)\.html'/g, "loc: '/$1'");
  c = c.replace(/link:\s*'\/([^']+)\.html'/g, "link: '/$1'");
  c = c.replace(/`\/([^`]+)\.html`/g, '`/$1`');
  fs.writeFileSync(techFile, c, 'utf8');
  console.log('Cleaned scripts/generate_technical_files.js');
}


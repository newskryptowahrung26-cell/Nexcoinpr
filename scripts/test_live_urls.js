const https = require('https');

const urls = [
  'https://www.nexcoinpr.agency/',
  'https://www.nexcoinpr.agency/services',
  'https://www.nexcoinpr.agency/crypto-pr',
  'https://www.nexcoinpr.agency/sitemap-pages.xml',
  'https://www.nexcoinpr.agency/sitemap-news.xml',
  'https://www.nexcoinpr.agency/feed.xml',
  'https://www.nexcoinpr.agency/feed-crypto.xml',
  'https://www.nexcoinpr.agency/feed/news.xml',
  'https://www.nexcoinpr.agency/feed/crypto.xml'
];

function fetchPage(url) {
  return new Promise(resolve => {
    const req = https.get(url, { headers: { 'User-Agent': 'AhrefsBot/7.0' } }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        resolve({ url, status: res.statusCode, location: res.headers.location || null, body });
      });
    });
    req.on('error', err => resolve({ url, error: err.message, body: '' }));
  });
}

(async () => {
  console.log('Testing live URLs on https://www.nexcoinpr.agency ...');
  for (const u of urls) {
    const res = await fetchPage(u);
    console.log(`${res.status || 'ERR'} | ${res.url} ${res.location ? '-> ' + res.location : ''}`);
    if (res.body && u.endsWith('/services') || u.endsWith('/crypto-pr')) {
      const canon = res.body.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
      const desc = res.body.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
      console.log(`   Canonical: ${canon ? canon[1] : 'none'}`);
      console.log(`   Meta Desc (${desc ? desc[1].length : 0} chars): ${desc ? desc[1].slice(0, 70) + '...' : 'none'}`);
    }
  }
})();

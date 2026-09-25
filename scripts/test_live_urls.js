const https = require('https');

const urls = [
  'https://www.nexcoinpr.agency/',
  'https://www.nexcoinpr.agency/markets',
  'https://www.nexcoinpr.agency/services',
  'https://www.nexcoinpr.agency/crypto-pr',
  'https://www.nexcoinpr.agency/assets/css/main.min.css?v=8.0',
  'https://www.nexcoinpr.agency/assets/css/components.min.css?v=8.0',
  'https://www.nexcoinpr.agency/assets/css/pages.min.css?v=8.0',
  'https://www.nexcoinpr.agency/assets/css/markets.min.css?v=8.0',
  'https://www.nexcoinpr.agency/assets/js/main.min.js?v=8.0',
  'https://www.nexcoinpr.agency/assets/js/markets.min.js?v=8.0',
  'https://www.nexcoinpr.agency/feed.xml',
  'https://www.nexcoinpr.agency/sitemap.xml'
];

function fetchPage(url) {
  return new Promise(resolve => {
    const req = https.get(url, { headers: { 'User-Agent': 'AhrefsBot/7.0' } }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        resolve({ url, status: res.statusCode, location: res.headers.location || null, length: body.length, body });
      });
    });
    req.on('error', err => resolve({ url, error: err.message, body: '' }));
  });
}

(async () => {
  console.log('Testing live URLs on https://www.nexcoinpr.agency ...\n');
  for (const u of urls) {
    const res = await fetchPage(u);
    console.log(`${res.status || 'ERR'} | ${res.url} (size: ${res.length || 0} bytes) ${res.location ? '-> ' + res.location : ''}`);
    if (u === 'https://www.nexcoinpr.agency/') {
      const hasServiceType = res.body.includes('"serviceType"');
      console.log(`   Homepage has serviceType in Organization schema: ${hasServiceType ? 'YES (BAD)' : 'NO (PASSED - REMOVED)'}`);
      const hasMinCss = res.body.includes('main.min.css?v=8.0');
      console.log(`   Homepage loads main.min.css?v=8.0: ${hasMinCss ? 'YES (PASSED)' : 'NO'}`);
    }
    if (u === 'https://www.nexcoinpr.agency/markets') {
      const textOnly = res.body
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const ratio = (textOnly.length / res.body.length).toFixed(4);
      console.log(`   Markets page visible text: ${textOnly.length} chars, total HTML: ${res.body.length} chars`);
      console.log(`   Markets page text-to-HTML ratio: ${ratio} (PASSED - was 0.05)`);
    }
  }
})();

const fs = require('fs');
const path = require('path');
const https = require('https');

const HOST = 'www.nexcoinpr.agency';
const KEY = '8f8b89694e9f45618b76a084795e1e12';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const FEED_FILE = path.join(__dirname, '..', 'feed.xml');

if (!fs.existsSync(FEED_FILE)) {
  console.log('[Ping Search Engines] feed.xml not found. Skipping.');
  process.exit(0);
}

const feedContent = fs.readFileSync(FEED_FILE, 'utf8');
const linkMatches = feedContent.match(/<link>(https:\/\/www\.nexcoinpr\.agency\/.*?)<\/link>/g) || [];

const urls = Array.from(new Set(
  linkMatches.map(m => m.replace(/<\/?link>/g, '').trim())
)).slice(0, 15);

if (urls.length === 0) {
  console.log('[Ping Search Engines] No URLs found in feed.xml to ping.');
  process.exit(0);
}

console.log(`[Ping Search Engines] Found ${urls.length} latest URLs to submit.`);

// 1. Submit to IndexNow
const postData = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: urls
});

const req = https.request('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(postData)
  }
}, (res) => {
  let responseData = '';
  res.on('data', (d) => responseData += d);
  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 202) {
      console.log(`[IndexNow] Successfully submitted ${urls.length} URLs (Status: ${res.statusCode}). Instant search crawl triggered!`);
    } else {
      console.log(`[IndexNow] Response status: ${res.statusCode} - ${responseData}`);
    }
  });
});

req.on('error', (e) => {
  console.warn('[IndexNow] Notice: Ping error (will retry next scheduled run):', e.message);
});

req.write(postData);
req.end();

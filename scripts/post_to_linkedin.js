const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const ORG_ID = process.env.LINKEDIN_ORG_ID || '106105732'; // NexcoinPR Agency
const ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const HISTORY_FILE = path.join(__dirname, 'linkedin_posted_history.json');
const FEED_FILE = path.join(__dirname, '..', 'feed.xml');

// Load history
let history = [];
if (fs.existsSync(HISTORY_FILE)) {
  try {
    history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  } catch (e) {
    history = [];
  }
}

if (!ACCESS_TOKEN) {
  console.log('[LinkedIn Auto-Post] Notice: LINKEDIN_ACCESS_TOKEN is not configured in environment/secrets.');
  console.log('[LinkedIn Auto-Post] To enable direct API posting to https://www.linkedin.com/company/nexcoinpr-agency:');
  console.log('  1. Add LINKEDIN_ACCESS_TOKEN to GitHub Repository Secrets (Settings -> Secrets -> Actions).');
  console.log('  2. Or connect https://nexcoinpr.com/feed.xml to Buffer.com / Zapier for 100% no-code auto-posting.');
  process.exit(0);
}

// Read RSS feed
if (!fs.existsSync(FEED_FILE)) {
  console.error('[LinkedIn Auto-Post] Error: feed.xml not found.');
  process.exit(1);
}

const feedXml = fs.readFileSync(FEED_FILE, 'utf8');

// Simple regex parser for top item in RSS
const itemMatch = feedXml.match(/<item>([\s\S]*?)<\/item>/);
if (!itemMatch) {
  console.log('[LinkedIn Auto-Post] No items found in feed.xml.');
  process.exit(0);
}

const itemContent = itemMatch[1];
const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || itemContent.match(/<title>(.*?)<\/title>/);
const linkMatch = itemContent.match(/<link>(.*?)<\/link>/);
const descMatch = itemContent.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || itemContent.match(/<description>(.*?)<\/description>/);

const title = titleMatch ? titleMatch[1].trim() : '';
const link = linkMatch ? linkMatch[1].trim() : '';
const desc = descMatch ? descMatch[1].trim() : '';

if (!title || !link) {
  console.log('[LinkedIn Auto-Post] Missing title or link for latest item.');
  process.exit(0);
}

if (history.includes(link)) {
  console.log(`[LinkedIn Auto-Post] Latest article already posted: "${title}" (${link})`);
  process.exit(0);
}

console.log(`[LinkedIn Auto-Post] Preparing post for: "${title}"`);

// Build LinkedIn Post Payload (LinkedIn Version 202401+ /rest/posts API)
const postData = JSON.stringify({
  author: `urn:li:organization:${ORG_ID}`,
  commentary: `${title}\n\n${desc}\n\nRead the full release on NexcoinPR: ${link}\n\n#crypto #web3 #blockchain #forex #fintech #pressrelease #nexcoinpr`,
  visibility: 'PUBLIC',
  distribution: {
    feedDistribution: 'MAIN_FEED',
    targetEntities: [],
    thirdPartyDistributionChannels: []
  },
  content: {
    article: {
      source: link,
      title: title,
      description: desc
    }
  },
  lifecycleState: 'PUBLISHED',
  isReshareDisabledByAuthor: false
});

const req = https.request({
  hostname: 'api.linkedin.com',
  path: '/rest/posts',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    'X-Restli-Protocol-Version': '2.0.0',
    'LinkedIn-Version': '202401',
    'Content-Length': Buffer.byteLength(postData)
  }
}, (res) => {
  let responseBody = '';
  res.on('data', chunk => responseBody += chunk);
  res.on('end', () => {
    if (res.statusCode === 201 || res.statusCode === 200) {
      console.log('[LinkedIn Auto-Post] SUCCESS! Published to NexcoinPR Agency page.');
      history.push(link);
      fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
    } else {
      console.error(`[LinkedIn Auto-Post] Failed with HTTP ${res.statusCode}:`, responseBody);
    }
  });
});

req.on('error', (err) => {
  console.error('[LinkedIn Auto-Post] Request error:', err.message);
});

req.write(postData);
req.end();

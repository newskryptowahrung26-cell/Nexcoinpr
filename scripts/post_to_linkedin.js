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

// Helper to send HTTP request
function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function run() {
  // First attempt: Try posting as Organization (w_organization_social)
  const commentary = `${title}\n\n${desc}\n\nRead the full release on NexcoinPR: ${link}\n\n#crypto #web3 #blockchain #forex #fintech #pressrelease #nexcoinpr`;
  
  const orgPayload = JSON.stringify({
    author: `urn:li:organization:${ORG_ID}`,
    commentary,
    visibility: 'PUBLIC',
    distribution: {
      feedDistribution: 'MAIN_FEED',
      targetEntities: [],
      thirdPartyDistributionChannels: []
    },
    content: {
      article: {
        source: link,
        title,
        description: desc
      }
    },
    lifecycleState: 'PUBLISHED',
    isReshareDisabledByAuthor: false
  });

  const orgOptions = {
    hostname: 'api.linkedin.com',
    path: '/rest/posts',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
      'LinkedIn-Version': '202401',
      'Content-Length': Buffer.byteLength(orgPayload)
    }
  };

  try {
    const orgRes = await makeRequest(orgOptions, orgPayload);
    if (orgRes.statusCode === 201 || orgRes.statusCode === 200) {
      console.log('[LinkedIn Auto-Post] SUCCESS! Published to NexcoinPR Agency Company Page.');
      history.push(link);
      fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
      return;
    }

    console.log(`[LinkedIn Auto-Post] Organization post returned HTTP ${orgRes.statusCode}. Checking for Personal Profile access (w_member_social)...`);

    // Fallback attempt: If token has w_member_social, find the member ID and post to personal profile
    const userinfoOptions = {
      hostname: 'api.linkedin.com',
      path: '/v2/userinfo',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      }
    };

    const userinfoRes = await makeRequest(userinfoOptions);
    let memberSub = null;
    if (userinfoRes.statusCode === 200) {
      try {
        const parsed = JSON.parse(userinfoRes.body);
        memberSub = parsed.sub;
      } catch (e) {}
    }

    if (!memberSub) {
      // Try /v2/me
      const meOptions = {
        hostname: 'api.linkedin.com',
        path: '/v2/me',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
      };
      const meRes = await makeRequest(meOptions);
      if (meRes.statusCode === 200) {
        try {
          const parsed = JSON.parse(meRes.body);
          memberSub = parsed.id;
        } catch (e) {}
      }
    }

    if (memberSub) {
      console.log(`[LinkedIn Auto-Post] Found Member ID (${memberSub}). Posting via w_member_social...`);
      const memberPayload = JSON.stringify({
        author: `urn:li:person:${memberSub}`,
        commentary,
        visibility: 'PUBLIC',
        distribution: {
          feedDistribution: 'MAIN_FEED',
          targetEntities: [],
          thirdPartyDistributionChannels: []
        },
        content: {
          article: {
            source: link,
            title,
            description: desc
          }
        },
        lifecycleState: 'PUBLISHED',
        isReshareDisabledByAuthor: false
      });

      const memberOptions = {
        hostname: 'api.linkedin.com',
        path: '/rest/posts',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
          'LinkedIn-Version': '202401',
          'Content-Length': Buffer.byteLength(memberPayload)
        }
      };

      const memberRes = await makeRequest(memberOptions, memberPayload);
      if (memberRes.statusCode === 201 || memberRes.statusCode === 200) {
        console.log('[LinkedIn Auto-Post] SUCCESS! Published to your personal LinkedIn profile.');
        history.push(link);
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
        return;
      } else {
        console.error(`[LinkedIn Auto-Post] Member post failed with HTTP ${memberRes.statusCode}:`, memberRes.body);
      }
    } else {
      console.error('[LinkedIn Auto-Post] Could not determine author URN. Details:', orgRes.body);
    }
  } catch (err) {
    console.error('[LinkedIn Auto-Post] Error:', err.message);
  }
}

run();

const fs = require('fs');
const path = require('path');
const https = require('https');

const ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const ORG_ID = process.env.LINKEDIN_ORG_ID || '106105732'; // NexcoinPR Agency

const POST_TEXT = `92% of Web3 & Crypto press releases get rejected within 3 seconds.

Not because the protocol's technology is weak.
It's because founders pitch like marketers, while editors on Bloomberg and CoinDesk look for institutional news.

If your announcement uses words like:
❌ "Groundbreaking"
❌ "Revolutionary"
❌ "Next-gen game-changer"
❌ "Unprecedented yield"
...it gets flagged by automated editorial spam filters before a human journalist ever opens it.

📌 The 5-Point Formula Tier-1 Desks Actually Accept:
1️⃣ Macro Trend Hook: Anchor your news to institutional market movements.
2️⃣ Verifiable Metrics: Hard TVL, transaction volume, or verified audit links.
3️⃣ Executive Perspective: 2-sentence founder quote explaining industry impact.
4️⃣ Clean Issuer Boilerplate: Official domain email (never @gmail) and entity jurisdiction.
5️⃣ Controlled Link Architecture: Max 1–2 clean canonical backlinks to avoid spam flags.

Before you publish your next announcement:
👉 Test your draft with our 100% Free Interactive PR Grader:
https://www.nexcoinpr.agency/free-pr-grader

💬 Need guaranteed publication across Bloomberg, CoinDesk, and 350+ financial media networks?
Reach our editorial desk directly on WhatsApp (+971 58 202 1752) or Telegram (@Nexcoinpr).

#CryptoPR #Web3Marketing #BlockchainPR #Fintech #PublicRelations #TokenLaunch #CryptoFounders #DeFi #ForexPR #NexcoinPR`;

const TARGET_URL = 'https://www.nexcoinpr.agency/free-pr-grader';
const TITLE = 'The 2026 Web3 & Crypto PR Blueprint | NexcoinPR Free Grader';

if (!ACCESS_TOKEN) {
  console.log('================================================================');
  console.log('📢 NexcoinPR LinkedIn Educational Publisher');
  console.log('================================================================');
  console.log('Notice: LINKEDIN_ACCESS_TOKEN is not currently exported in local terminal.');
  console.log('\nYou can post this in 2 easy ways:');
  console.log('1. Manual 1-Click Post (Recommended for Carousels):');
  console.log('   Open LinkedIn -> "Create a post" -> Add Document -> Choose:');
  console.log('   C:\\Users\\NDCOM\\Downloads\\NexcoinPR-2026-Web3-PR-Blueprint.pdf');
  console.log('   And paste the text from: C:\\Users\\NDCOM\\Downloads\\NexcoinPR_LinkedIn_Posts_Guide.txt');
  console.log('\n2. Via API / GitHub Actions:');
  console.log('   Run: $env:LINKEDIN_ACCESS_TOKEN="your_token"; node scripts/publish_educational_post_to_linkedin.js');
  console.log('================================================================\n');
  process.exit(0);
}

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data, headers: res.headers }));
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function publish() {
  console.log('[LinkedIn Publisher] Preparing educational post for LinkedIn...');
  
  const payload = JSON.stringify({
    author: `urn:li:organization:${ORG_ID}`,
    commentary: POST_TEXT,
    visibility: 'PUBLIC',
    distribution: {
      feedDistribution: 'MAIN_FEED',
      targetEntities: [],
      thirdPartyDistributionChannels: []
    },
    content: {
      article: {
        source: TARGET_URL,
        title: TITLE,
        description: 'Interactive Tier-1 Crypto PR Grader and editorial framework for Web3 & Forex founders.'
      }
    },
    lifecycleState: 'PUBLISHED',
    isReshareDisabledByAuthor: false
  });

  const options = {
    hostname: 'api.linkedin.com',
    path: '/rest/posts',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'X-Restli-Protocol-Version': '2.0.0',
      'LinkedIn-Version': '202401',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  try {
    const res = await makeRequest(options, payload);
    if (res.statusCode === 201 || res.statusCode === 200) {
      console.log('🎉 SUCCESS! Educational post published live to NexcoinPR LinkedIn Organization Page.');
    } else {
      console.log(`HTTP ${res.statusCode}:`, res.body);
    }
  } catch (err) {
    console.error('Publish error:', err.message);
  }
}

publish();

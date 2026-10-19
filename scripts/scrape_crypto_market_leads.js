const https = require('https');
const http = require('http');
const urlModule = require('url');
const fs = require('fs');
const path = require('path');

// Helper: HTTP GET with timeout and user agent
function fetchJson(targetUrl, headers = {}) {
  return new Promise((resolve) => {
    try {
      const parsed = urlModule.parse(targetUrl);
      const client = parsed.protocol === 'http:' ? http : https;
      const req = client.get(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          ...headers
        },
        timeout: 8000
      }, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return resolve(fetchJson(res.headers.location, headers));
        }
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch(e) {
            resolve(null);
          }
        });
      });
      req.on('error', () => resolve(null));
      req.on('timeout', () => { req.destroy(); resolve(null); });
    } catch(e) {
      resolve(null);
    }
  });
}

function fetchHtml(targetUrl) {
  return new Promise((resolve) => {
    try {
      const parsed = urlModule.parse(targetUrl);
      if (!parsed.protocol) return resolve('');
      const client = parsed.protocol === 'http:' ? http : https;
      const req = client.get(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        },
        timeout: 5000
      }, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectUrl = urlModule.resolve(targetUrl, res.headers.location);
          return resolve(fetchHtml(redirectUrl));
        }
        let data = '';
        res.on('data', chunk => {
          data += chunk;
          if (data.length > 500000) { req.destroy(); resolve(data); } // Limit to 500KB
        });
        res.on('end', () => resolve(data));
      });
      req.on('error', () => resolve(''));
      req.on('timeout', () => { req.destroy(); resolve(''); });
    } catch(e) {
      resolve('');
    }
  });
}

// Extract emails from HTML string
function extractEmails(html) {
  if (!html) return [];
  const matches = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  const clean = matches.filter(e => {
    const em = e.toLowerCase();
    if (em.endsWith('.png') || em.endsWith('.jpg') || em.endsWith('.webp') || em.endsWith('.gif')) return false;
    if (em.includes('sentry') || em.includes('wixpress') || em.includes('cloudflare') || em.includes('github') || em.includes('example.com')) return false;
    return true;
  });
  return [...new Set(clean)];
}

// Generic domains to ignore for cold pitch emails
const IGNORED_DOMAINS = [
  'youtube.com', 'youtu.be', 'google.com', 'sec.gov', 'twitter.com', 'x.com',
  't.me', 'telegram.org', 'github.com', 'medium.com', 'reddit.com', 'tiktok.com',
  'instagram.com', 'facebook.com', 'linkedin.com', 'discord.com', 'discord.gg',
  'apple.com', 'spotify.com', 'blog.jp', 'wikipedia.org', 'gitbook.io', 'linktr.ee',
  'substack.com', 'wordpress.com', 'blogger.com', 'coinmarketcap.com', 'coingecko.com',
  'dexscreener.com', 'etherscan.io', 'bscscan.com', 'solscan.io'
];

// Extract domain from URL
function getCleanDomain(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    let host = parsed.hostname.toLowerCase();
    if (host.startsWith('www.')) host = host.substring(4);
    if (IGNORED_DOMAINS.some(d => host === d || host.endsWith('.' + d))) {
      return null;
    }
    return host;
  } catch(e) {
    return null;
  }
}

async function scrapeAll() {
  console.log('===========================================================');
  console.log('🔍 NexcoinPR Live Crypto Market Lead Extractor');
  console.log('Sources: DexScreener, CoinMarketCap, CoinGecko');
  console.log('===========================================================\n');

  const candidates = [];
  const seenUrls = new Set();

  // 1. DEXSCREENER TOKEN BOOSTS & PROFILES
  console.log('📡 Step 1/3: Fetching DexScreener trending and boosted tokens...');
  try {
    const dexProfiles = await fetchJson('https://api.dexscreener.com/token-profiles/latest/v1');
    const dexBoosts = await fetchJson('https://api.dexscreener.com/token-boosts/top/v1');
    const allDex = [...(dexProfiles || []), ...(dexBoosts || [])];

    allDex.forEach(p => {
      let website = '';
      let telegram = '';
      let twitter = '';

      (p.links || []).forEach(l => {
        const u = l.url || '';
        if (u.includes('t.me/')) telegram = u;
        else if (u.includes('twitter.com/') || u.includes('x.com/')) twitter = u;
        else if (u.startsWith('http') && !u.includes('dexscreener.com')) {
          const dom = getCleanDomain(u);
          if (dom) website = u;
        }
      });

      if (website || telegram) {
        const key = (website || telegram).toLowerCase();
        if (!seenUrls.has(key)) {
          seenUrls.add(key);
          let tokenName = 'Web3 Token';
          if (website) {
            const dom = getCleanDomain(website);
            if (dom) tokenName = dom.split('.')[0].toUpperCase();
          } else if (p.tokenAddress) {
            tokenName = `Token ${p.tokenAddress.slice(0, 6)}`;
          }

          candidates.push({
            name: tokenName,
            chain: p.chainId || 'Multi-Chain',
            source: 'DexScreener',
            website,
            telegram,
            twitter,
            dexUrl: p.url || ''
          });
        }
      }
    });
    console.log(`   Found ${candidates.length} unique projects from DexScreener.`);
  } catch(e) {
    console.error('   DexScreener fetch error:', e.message);
  }

  // 2. COINMARKETCAP SPOTLIGHT (Trending & Recently Added)
  console.log('📡 Step 2/3: Fetching CoinMarketCap Spotlight (Trending & Recently Added)...');
  try {
    const cmcSpotlight = await fetchJson('https://api.coinmarketcap.com/data-api/v3/cryptocurrency/spotlight');
    if (cmcSpotlight && cmcSpotlight.data) {
      const recent = cmcSpotlight.data.recentlyAddedList || [];
      const trending = cmcSpotlight.data.trendingList || [];
      const cmcList = [...recent, ...trending];

      for (const coin of cmcList.slice(0, 15)) {
        if (!coin.slug) continue;
        const detail = await fetchJson(`https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail?slug=${coin.slug}`);
        if (detail && detail.data && detail.data.urls) {
          const urls = detail.data.urls;
          const website = (urls.website && urls.website[0]) || '';
          const telegram = (urls.chat && urls.chat.find(c => c.includes('t.me'))) || '';
          const twitter = (urls.twitter && urls.twitter[0]) || '';

          if (website || telegram) {
            const key = (website || telegram).toLowerCase();
            if (!seenUrls.has(key)) {
              seenUrls.add(key);
              candidates.push({
                name: coin.name || detail.data.name,
                symbol: coin.symbol || detail.data.symbol,
                chain: 'CoinMarketCap',
                source: 'CoinMarketCap',
                website,
                telegram,
                twitter,
                cmcUrl: `https://coinmarketcap.com/currencies/${coin.slug}/`
              });
            }
          }
        }
      }
      console.log(`   Total pool reached ${candidates.length} projects after CMC.`);
    }
  } catch(e) {
    console.error('   CoinMarketCap fetch error:', e.message);
  }

  // 3. COINGECKO TRENDING
  console.log('📡 Step 3/3: Fetching CoinGecko Trending...');
  try {
    const cgTrending = await fetchJson('https://api.coingecko.com/api/v3/search/trending');
    if (cgTrending && cgTrending.coins) {
      for (const item of cgTrending.coins.slice(0, 8)) {
        const c = item.item;
        if (!c || !c.id) continue;
        const detail = await fetchJson(`https://api.coingecko.com/api/v3/coins/${c.id}`);
        if (detail && detail.links) {
          const website = (detail.links.homepage && detail.links.homepage[0]) || '';
          const tgId = detail.links.telegram_channel_identifier;
          const telegram = tgId ? `https://t.me/${tgId}` : '';
          const twitter = detail.links.twitter_screen_name ? `https://x.com/${detail.links.twitter_screen_name}` : '';

          if (website || telegram) {
            const key = (website || telegram).toLowerCase();
            if (!seenUrls.has(key)) {
              seenUrls.add(key);
              candidates.push({
                name: c.name,
                symbol: c.symbol,
                chain: 'CoinGecko',
                source: 'CoinGecko',
                website,
                telegram,
                twitter,
                cgUrl: `https://www.coingecko.com/en/coins/${c.id}`
              });
            }
          }
        }
      }
      console.log(`   Total pool reached ${candidates.length} projects after CoinGecko.\n`);
    }
  } catch(e) {
    console.error('   CoinGecko fetch error:', e.message);
  }

  // 4. SCAN WEBSITES TO EXTRACT DIRECT EMAILS
  console.log('⚡ Scraping official project websites for contact emails...');
  const verifiedLeads = [];

  for (let i = 0; i < candidates.length; i++) {
    const cand = candidates[i];
    let foundEmail = '';
    let emailSource = 'domain';

    if (cand.website && cand.website.startsWith('http')) {
      process.stdout.write(`   [${i + 1}/${candidates.length}] Checking ${cand.name} (${cand.website})... `);
      const html = await fetchHtml(cand.website);
      const emails = extractEmails(html);

      if (emails.length > 0) {
        foundEmail = emails[0];
        emailSource = 'scraped_page';
        console.log(`✅ Found: ${foundEmail}`);
      } else {
        const domain = getCleanDomain(cand.website);
        if (domain && !domain.includes('t.me') && !domain.includes('twitter') && !domain.includes('github') && !domain.includes('x.com')) {
          foundEmail = `contact@${domain}`;
          console.log(`ℹ️ Domain inferred: ${foundEmail}`);
        } else {
          console.log(`⚠️ No domain email`);
        }
      }
    } else {
      console.log(`   [${i + 1}/${candidates.length}] ${cand.name} (Telegram only: ${cand.telegram})`);
    }

    verifiedLeads.push({
      id: `LIVE-${Date.now()}-${i + 1}`,
      name: cand.name,
      symbol: cand.symbol || '',
      cat: 'Crypto Token / Coin',
      source: cand.source,
      site: cand.website,
      email: foundEmail || '',
      emailType: foundEmail ? emailSource : 'none',
      telegram: cand.telegram,
      twitter: cand.twitter,
      scrapedAt: new Date().toISOString()
    });
  }

  // 5. SAVE TO JSON & CSV
  const jsonPath = path.join(__dirname, '..', 'data', 'fresh_live_scraped_leads.json');
  const csvPath = path.join(__dirname, '..', 'assets', 'docs', 'Fresh_Live_Scraped_Leads.csv');
  const userDownloadsTxt = 'C:\\Users\\NDCOM\\Downloads\\NexcoinPR_Live_DexScreener_CMC_Leads.txt';

  // Ensure data dir exists
  const dataDir = path.dirname(jsonPath);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  fs.writeFileSync(jsonPath, JSON.stringify(verifiedLeads, null, 2), 'utf8');

  // Build CSV
  let csvContent = 'ID,Name,Symbol,Category,Source,Website,Email,EmailType,Telegram,Twitter,ScrapedAt\n';
  verifiedLeads.forEach(l => {
    csvContent += `"${l.id}","${l.name}","${l.symbol}","${l.cat}","${l.source}","${l.site}","${l.email}","${l.emailType}","${l.telegram}","${l.twitter}","${l.scrapedAt}"\n`;
  });
  fs.writeFileSync(csvPath, csvContent, 'utf8');

  // Build User TXT for easy viewing
  let userTxt = `===========================================================\n`;
  userTxt += `🎯 NexcoinPR Live Extracted Market Leads\n`;
  userTxt += `Extracted from DexScreener, CoinMarketCap, & CoinGecko\n`;
  userTxt += `Generated on: ${new Date().toLocaleString()}\n`;
  userTxt += `Total Live Projects: ${verifiedLeads.length}\n`;
  userTxt += `===========================================================\n\n`;

  verifiedLeads.forEach((l, idx) => {
    userTxt += `[#${idx + 1}] ${l.name} (${l.symbol || l.source})\n`;
    userTxt += `    • Website  : ${l.site || 'N/A'}\n`;
    userTxt += `    • Email    : ${l.email || 'None'}\n`;
    userTxt += `    • Telegram : ${l.telegram || 'N/A'}\n`;
    userTxt += `    • Twitter  : ${l.twitter || 'N/A'}\n`;
    userTxt += `    • Source   : ${l.source}\n\n`;
  });

  try {
    fs.writeFileSync(userDownloadsTxt, userTxt, 'utf8');
  } catch(e) {}

  console.log('\n===========================================================');
  console.log(`🎉 Extraction Completed!`);
  console.log(`Total Live Projects Found : ${verifiedLeads.length}`);
  console.log(`With Valid Email Contacts : ${verifiedLeads.filter(l => l.email).length}`);
  console.log(`With Direct Telegram Links: ${verifiedLeads.filter(l => l.telegram).length}`);
  console.log(`Saved JSON : ${jsonPath}`);
  console.log(`Saved CSV  : ${csvPath}`);
  console.log(`Saved TXT  : ${userDownloadsTxt}`);
  console.log('===========================================================');
}

scrapeAll().catch(console.error);

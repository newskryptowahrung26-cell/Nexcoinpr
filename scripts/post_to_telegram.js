const fs = require('fs');
const path = require('path');
const https = require('https');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID; // e.g. @NexcoinPR_News or -100xxxxxxxxx
const HISTORY_FILE = path.join(__dirname, 'telegram_posted_history.json');
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

if (!BOT_TOKEN || !CHANNEL_ID) {
  console.log('[Telegram Auto-Post] Notice: TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID not set in environment/secrets.');
  console.log('[Telegram Auto-Post] To activate 100% free automated Telegram news broadcasts:');
  console.log('  1. Message @BotFather on Telegram to create a bot and get your BOT_TOKEN.');
  console.log('  2. Create a public channel (e.g. @NexcoinPR_News) and add your bot as Administrator.');
  console.log('  3. Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID to your GitHub Secrets.');
  process.exit(0);
}

if (!fs.existsSync(FEED_FILE)) {
  console.error('[Telegram Auto-Post] feed.xml not found.');
  process.exit(0);
}

const feedXml = fs.readFileSync(FEED_FILE, 'utf8');
const itemMatch = feedXml.match(/<item>([\s\S]*?)<\/item>/);
if (!itemMatch) {
  console.log('[Telegram Auto-Post] No items found in feed.xml.');
  process.exit(0);
}

const itemContent = itemMatch[1];
const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || itemContent.match(/<title>(.*?)<\/title>/);
const linkMatch = itemContent.match(/<link>(.*?)<\/link>/);
const descMatch = itemContent.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || itemContent.match(/<description>(.*?)<\/description>/);
const categoryMatch = itemContent.match(/<category><!\[CDATA\[(.*?)\]\]><\/category>/) || itemContent.match(/<category>(.*?)<\/category>/);

const title = titleMatch ? titleMatch[1].trim() : '';
const link = linkMatch ? linkMatch[1].trim() : '';
let desc = descMatch ? descMatch[1].trim().replace(/<[^>]+>/g, '') : '';
const category = categoryMatch ? categoryMatch[1].trim() : 'Market News';

if (!title || !link) {
  console.log('[Telegram Auto-Post] Missing title or link for latest item.');
  process.exit(0);
}

if (history.includes(link)) {
  console.log(`[Telegram Auto-Post] Article already posted to Telegram: "${title}"`);
  process.exit(0);
}

if (desc.length > 250) {
  desc = desc.slice(0, 247) + '...';
}

const tag = category.toLowerCase().includes('forex') ? '#Forex #Trading #NexcoinPR' : '#Crypto #Web3 #NexcoinPR';

const messageText = `⚡ <b>NexcoinPR Breaking News | ${category}</b>\n\n<b>${title}</b>\n\n${desc}\n\n📰 <a href="${link}">Read Verified Story on NexcoinPR</a>\n\n🚀 <i>Submit your press release: https://www.nexcoinpr.agency/pricing</i>\n\n${tag}`;

const postData = JSON.stringify({
  chat_id: CHANNEL_ID,
  text: messageText,
  parse_mode: 'HTML',
  disable_web_page_preview: false
});

const req = https.request(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const resp = JSON.parse(body);
      if (resp.ok) {
        console.log(`[Telegram Auto-Post] Successfully posted: "${title}" to Telegram channel!`);
        history.push(link);
        if (history.length > 100) history = history.slice(-100);
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
      } else {
        console.error(`[Telegram Auto-Post] Telegram API Error:`, resp.description);
      }
    } catch (e) {
      console.error('[Telegram Auto-Post] Parse error:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error('[Telegram Auto-Post] Network Error:', e.message);
});

req.write(postData);
req.end();

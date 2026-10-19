const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Automatically load .env if present
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

// Parse CLI Arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run') || !process.env.GMAIL_APP_PASSWORD;
const isTestMe = args.includes('--test-me');
const batchSizeArg = args.find(a => a.startsWith('--batch='));
const categoryArg = args.find(a => a.startsWith('--category='));
const TARGET_CATEGORY = categoryArg ? categoryArg.split('=')[1].toLowerCase().trim() : 'priority';
const BATCH_SIZE = batchSizeArg ? parseInt(batchSizeArg.split('=')[1], 10) : 10;
const DELAY_SEC = 10; // 10 seconds between emails to maintain 100% clean sender score

// Configuration
const SENDER_EMAIL = process.env.GMAIL_USER || 'nexcoinpr@gmail.com';
const APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || '';
const DATA_FILE = path.join(__dirname, '..', 'data', 'curated_hot_leads.json');
const HISTORY_FILE = path.join(__dirname, 'contacted_leads.json');

// Helper: Sleep
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Load History
let history = [];
if (fs.existsSync(HISTORY_FILE)) {
  try {
    history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  } catch (e) {
    history = [];
  }
}
const contactedEmails = new Set(history.map(h => (h.email || '').toLowerCase().trim()));

// Load Leads from Mega PR Buyers, Fresh Scraped, Curated list, and Master 10,000+ CSV
function loadAllLeads() {
  const leads = [];
  const seen = new Set();

  // 0. Verified Real PR Buyers (Decrypt, FinanceWire, etc.)
  const megaFile = path.join(__dirname, '..', 'data', 'mega_verified_pr_buyers.json');
  if (fs.existsSync(megaFile)) {
    try {
      const mega = JSON.parse(fs.readFileSync(megaFile, 'utf8'));
      mega.forEach(m => {
        if (m.email && m.email.includes('@')) {
          const em = m.email.toLowerCase().trim();
          if (!seen.has(em)) {
            seen.add(em);
            leads.push({
              id: m.id,
              name: m.name,
              cat: m.cat || 'Paid PR Advertiser',
              site: m.site || '',
              email: em,
              dept: 'Media & Marketing Desk',
              scale: 'Confirmed PR Budget Buyer',
              packageRec: '$199 Web3 Starter Wire or 10-Media Syndicate',
              hook: `Pitching guaranteed syndication across 140+ outlets vs single-site publication.`
            });
          }
        }
      });
    } catch(e) {}
  }

  // 0. Fresh Live Scraped Leads (DexScreener, CoinMarketCap, CoinGecko)
  const freshFile = path.join(__dirname, '..', 'data', 'fresh_live_scraped_leads.json');
  if (fs.existsSync(freshFile)) {
    try {
      const fresh = JSON.parse(fs.readFileSync(freshFile, 'utf8'));
      fresh.forEach(f => {
        if (f.email && f.email.includes('@')) {
          const em = f.email.toLowerCase().trim();
          if (!seen.has(em)) {
            seen.add(em);
            leads.push({
              id: f.id,
              name: f.name,
              cat: f.cat || 'Crypto Token / Coin',
              site: f.site || '',
              email: em,
              dept: 'Founder / Marketing',
              scale: 'Trending Market Project',
              packageRec: '$199 Web3 Starter Wire',
              hook: `Pitching guaranteed CoinMarketCap / Google News syndication for newly listed ${f.name}.`
            });
          }
        }
      });
    } catch(e) {}
  }

  // 1. Curated Hot Leads
  if (fs.existsSync(DATA_FILE)) {
    try {
      const hot = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      hot.forEach(h => {
        if (h.email && h.email.includes('@')) {
          const em = h.email.toLowerCase().trim();
          if (!seen.has(em)) {
            seen.add(em);
            leads.push(h);
          }
        }
      });
    } catch(e) {}
  }

  // 2. Master 10,000+ Database
  const csvFile = path.join(__dirname, '..', 'assets', 'docs', 'Crypto_Forex_Trading_10000_B2B_Master_Leads.csv');
  if (fs.existsSync(csvFile)) {
    try {
      const content = fs.readFileSync(csvFile, 'utf8');
      const lines = content.split(/\r?\n/);
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const matches = line.match(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g);
        if (!matches) continue;
        const clean = matches.map(m => m.replace(/^,?"?|"$/g, '').trim());
        const id = clean[0];
        const name = clean[1];
        const cat = clean[2];
        const site = clean[4];
        const email = clean[6];
        const dept = clean[7];
        const scale = clean[9];
        const packageRec = clean[10];
        const hook = clean[11];

        if (email && email.includes('@') && !email.includes('example.com')) {
          const em = email.toLowerCase().trim();
          if (!seen.has(em)) {
            seen.add(em);
            leads.push({ id, name, cat, site, email: em, dept, scale, packageRec, hook });
          }
        }
      }
    } catch(e) {}
  }

  return leads;
}

const allLeads = loadAllLeads();

const EXCLUDE_DOMAINS = new Set([
  'americankratom.org',
  'nutra-harmony.com',
  'omeristanbul.com',
  'topships.org',
  'worldimpactmedia.org'
]);

function cleanBrandName(lead) {
  // First check domain if known
  if (lead.email && lead.email.includes('@')) {
    const domain = lead.email.split('@')[1].split('.')[0].toLowerCase();
    const domainMap = {
      'stakerx': 'StakerX',
      'dachain': 'DAC',
      'changenow': 'ChangeNOW',
      'pixarex': 'Pixagram',
      'bybit': 'Bybit',
      '1win': '1win',
      'trustlinq': 'TrustLinq',
      'biggerz': 'BiggerZ',
      '150bond': '150Bond',
      'sui': 'Sui Foundation',
      'piplabs': 'Pip Labs',
      'nowpayments': 'NOWPayments',
      'lbank': 'LBank',
      'pressboxpr': 'Pressbox PR',
      'liquidmercury': 'Liquid Mercury',
      'vanafoundation': 'Vana Foundation',
      'lowestfeebitcoinatms': 'Lowest Fee Bitcoin ATMs',
      'colb': 'Colb Finance',
      'changer': 'Changer+',
      'asicid': 'ASICID',
      'whitebit': 'WhiteBIT',
      'nextlm': 'NextLM',
      'useflip': 'Flip',
      'concrete': 'Concrete',
      'aerodrome': 'Aerodrome Finance',
      'solana': 'Solana Foundation',
      'near': 'NEAR Protocol',
      'arbitrum': 'Arbitrum'
    };
    if (domainMap[domain]) return domainMap[domain];
  }

  let raw = (lead.name || '')
    .replace(/&#x27;|&apos;|&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .trim();

  // Pattern matching for typical PR headlines: '[Brand] Announces...', '[Brand] Launches...', '[Brand]\'s...', etc.
  const verbMatch = raw.match(/^([A-Za-z0-9\.\-\s]+?)(?:'s|\s+(?:Announces|Highlights|Expands|Launches|to\s+unveil|joins|Completes|Brings|Introduces|Ranks|Calls|Converts|Executes|Selects|Unveils|Partners|Receives|Secures|Integrates|Reports|Files|Debuts|Reveals|Releases|Wins|Opens|Rolls))\b/i);
  if (verbMatch && verbMatch[1] && verbMatch[1].trim().length > 1 && verbMatch[1].trim().length < 30) {
    const extracted = verbMatch[1].trim();
    if (extracted.toLowerCase() === 'data network') return 'DATA Network';
    return extracted;
  }

  // Fallback to domain name if email exists
  if (lead.email && lead.email.includes('@')) {
    const domain = lead.email.split('@')[1].split('.')[0].toLowerCase();
    if (domain.length > 2 && !['gmail','yahoo','hotmail','outlook','proton','protonmail','icloud'].includes(domain)) {
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    }
  }

  return raw.length > 30 ? raw.slice(0, 30) : raw;
}

// Calculate High-Conversion Priority Score
function getLeadPriorityScore(lead) {
  const c = (lead.cat || '').toLowerCase();
  const n = (lead.name || '').toLowerCase();
  const id = (lead.id || '');
  const em = (lead.email || '').toLowerCase();
  const domain = em.split('@')[1] || '';

  if (EXCLUDE_DOMAINS.has(domain)) {
    return 0; // Filter out non-crypto/non-finance domains
  }

  let score = 50;

  // Absolute #1 Priority: Confirmed Paying PR Buyers from Decrypt/FinanceWire
  if (id.startsWith('PR-BUYER-')) {
    score = 200;
  } else if (id.startsWith('LIVE-')) {
    score = 150;
  } else if (c.includes('token') || c.includes('coin') || c.includes('meme')) {
    score = 100;
  } else if (c.includes('launchpad')) {
    score = 95;
  } else if (c.includes('dex')) {
    score = 90;
  } else if (c.includes('prop')) {
    score = 85;
  } else if (c.includes('yield') || c.includes('lending') || c.includes('defi')) {
    score = 80;
  } else if (c.includes('forex') || c.includes('broker')) {
    score = 75;
  }

  // Bonus for targeted press/media desks
  if (em.startsWith('press@') || em.startsWith('pr@') || em.startsWith('media@') || em.startsWith('comms@')) {
    score += 15;
  }

  // Avoid mega exchanges and open-source foundations for commercial pitches
  if (n.includes('binance') || n.includes('coinbase') || n.includes('okx') || n.includes('kraken') || n.includes('bybit') || n.includes('kucoin') || domain === 'ethereum.org' || domain === 'bitcoin.org') {
    score = Math.min(score, 10);
  }

  return score;
}

// Filter Uncontacted Leads
let filteredQueue = allLeads.filter(lead => {
  return lead.email && lead.email.includes('@') && !contactedEmails.has(lead.email.toLowerCase().trim());
});

// Category filtering if requested
if (TARGET_CATEGORY === 'tokens') {
  filteredQueue = filteredQueue.filter(l => (l.cat || '').toLowerCase().includes('token') || (l.cat || '').toLowerCase().includes('coin'));
} else if (TARGET_CATEGORY === 'defi') {
  filteredQueue = filteredQueue.filter(l => (l.cat || '').toLowerCase().includes('dex') || (l.cat || '').toLowerCase().includes('defi') || (l.cat || '').toLowerCase().includes('yield'));
} else if (TARGET_CATEGORY === 'prop') {
  filteredQueue = filteredQueue.filter(l => (l.cat || '').toLowerCase().includes('prop'));
} else if (TARGET_CATEGORY === 'forex') {
  filteredQueue = filteredQueue.filter(l => (l.cat || '').toLowerCase().includes('forex') || (l.cat || '').toLowerCase().includes('broker'));
}

// Sort by Priority Score (Highest first)
filteredQueue.sort((a, b) => getLeadPriorityScore(b) - getLeadPriorityScore(a));

console.log('===========================================================');
console.log('🚀 NexcoinPR High-Conversion B2B Media Pitch Sender');
console.log('===========================================================');
console.log(`Total Leads in Database : ${allLeads.length}`);
console.log(`Already Contacted       : ${contactedEmails.size}`);
console.log(`Remaining in Queue      : ${filteredQueue.length}`);
console.log(`Target Category Filter  : ${TARGET_CATEGORY.toUpperCase()}`);
console.log(`Current Batch Size      : ${BATCH_SIZE}`);
console.log(`Execution Mode          : ${isDryRun ? 'DRY-RUN (Simulated - No real emails sent)' : 'LIVE OUTBOUND'}`);
console.log('===========================================================\n');

if (isDryRun && !isTestMe) {
  console.log('💡 NOTICE: Running in DRY-RUN mode because GMAIL_APP_PASSWORD is not set.');
  console.log('To send real emails to your prospective clients:');
  console.log('  1. Go to your Google Account -> Security -> 2-Step Verification -> App passwords.');
  console.log('  2. Create a new app password named "NexcoinPR Outreach" (16 letters).');
  console.log('  3. Run the script with:');
  console.log('     $env:GMAIL_APP_PASSWORD="your_16_char_password"; node scripts/send_outbound_pitches.js --batch=10\n');
}

// Generate Personalized Pitch Content with $199 Tripwire & 50/50 Risk Reversal
function generateEmail(lead) {
  const brand = cleanBrandName(lead);
  const cat = (lead.cat || '').toLowerCase();
  const isPaidBuyer = cat.includes('paid pr advertiser') || (lead.id && lead.id.startsWith('PR-BUYER-'));
  const isForex = cat.includes('forex') || cat.includes('broker') || cat.includes('prop');
  const isToken = cat.includes('token') || cat.includes('coin') || cat.includes('meme') || cat.includes('launchpad');
  
  const nicheName = isForex ? 'Forex & financial trading' : (isToken ? 'Web3 & token ecosystem' : 'DeFi & blockchain');
  const targetMedia = isForex ? 'Bloomberg, Yahoo Finance, Benzinga, and MarketWatch' : 'CoinDesk, Cointelegraph, Bloomberg, and Yahoo Finance';

  // High-open subject lines
  let subject = `Editorial Syndication Proposal for ${brand} | Guaranteed 24h Placement`;
  if (isPaidBuyer) {
    subject = `Media syndication for ${brand} | Guaranteed 25–140+ Outlets ($199 Entry Wire)`;
  } else if (isToken) {
    subject = `Media syndication for ${brand} | Guaranteed CoinMarketCap & Google News ($199 Starter Wire)`;
  }
  
  const introHook = isPaidBuyer
    ? `I came across your recent media announcement regarding ${brand} and wanted to congratulate your team on your active publicity in the Web3 space!`
    : `I came across ${brand} and noticed your active momentum in the ${nicheName} space.`;

  const comparisonHook = isPaidBuyer
    ? `When publishing announcements, single-outlet sponsored placements typically charge upwards of $2,000–$4,000+ for just one website. At <a href="https://www.nexcoinpr.agency" style="color: #0284C7; font-weight: 700; text-decoration: none;">NexcoinPR</a>, we syndicate across <strong>25 to 140+ Tier-1 financial &amp; crypto outlets</strong> — including <strong>${targetMedia}</strong> — with guaranteed live indexing within 24 to 48 hours starting at just $199.`
    : `Most traditional PR agencies charge upwards of $3,000–$5,000+ per month on open retainers with zero placement guarantees. At <a href="https://www.nexcoinpr.agency" style="color: #0284C7; font-weight: 700; text-decoration: none;">NexcoinPR</a>, we provide <strong>100% guaranteed editorial syndication</strong> across Tier-1 media — including <strong>${targetMedia}</strong> — with live publication within 24 to 48 hours.`;

  const textBody = `Hi ${brand} Team,

${introHook}

${isPaidBuyer ? 'When publishing announcements, single-outlet sponsored placements typically charge upwards of $2,000–$4,000+ for just one website. At NexcoinPR (https://www.nexcoinpr.agency), we syndicate across 25 to 140+ Tier-1 financial & crypto outlets — including ' + targetMedia + ' — with guaranteed live indexing within 24 to 48 hours starting at just $199.' : 'Most PR agencies charge upwards of $3,000–$5,000+ per month on open retainers with zero placement guarantees. At NexcoinPR (https://www.nexcoinpr.agency), we provide 100% guaranteed editorial syndication across Tier-1 financial and crypto media — including ' + targetMedia + ' — with live publication delivered within 24 to 48 hours.'}

⚡ Special Founder Launch Offer — $199 Starter Flash Wire:
To help projects secure mass distribution, pass CoinMarketCap/CoinGecko media criteria, and maximize search authority, we offer a dedicated $199 Web3 Starter Syndicate (https://www.nexcoinpr.agency/pricing#section-starter-wire):
• 25+ Guaranteed Outlets (Google News indexed)
• Permanent Do-Follow Backlinks (DA 60–85) for SEO ranking
• 24-Hour Guaranteed Turnaround + Live Spreadsheet Proof Report
• 🛡️ 100% Risk-Free Guarantee: Pay 50% ($99.50) upfront. Pay the remaining 50% only after live published URLs are delivered in your hand.

Would you be open to reviewing our live distribution clipping samples for ${brand}?

Best regards,

NexcoinPR Editorial & Media Desk
Official Website: https://www.nexcoinpr.agency
Direct WhatsApp: https://wa.me/971582021752 (+971-582021752)
Official Telegram: https://t.me/Nexcoinpr
Email: nexcoinpr@gmail.com`;

  const htmlBody = `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1E293B; max-width: 600px;">
    <p>Hi <strong>${brand}</strong> Team,</p>
    
    <p>${introHook}</p>
    
    <p>${comparisonHook}</p>
    
    <div style="background: #F8FAFC; border-left: 4px solid #C9A84C; padding: 16px 20px; margin: 20px 0; border-radius: 6px;">
      <p style="margin: 0 0 8px; font-weight: 800; color: #0F172A; font-size: 1.05rem;">⚡ $199 Web3 Starter Flash Wire (Special Founder Offer):</p>
      <p style="margin: 0 0 10px; font-size: 0.92rem; color: #475569;">Engineered for token launches, DeFi protocols, and trading firms seeking rapid CoinMarketCap / CoinGecko media verification:</p>
      <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 0.93rem;">
        <li><strong>25+ Guaranteed Outlets</strong> (Google News indexed)</li>
        <li><strong>Permanent Do-Follow Backlinks (DA 60–85)</strong> for search authority</li>
        <li><strong>24-Hour Guaranteed Turnaround</strong> with full live spreadsheet clipping report</li>
        <li>🛡️ <strong>Zero-Risk Payment:</strong> Pay 50% ($99.50) upfront. Pay the remaining 50% only after live URLs are in your hand.</li>
      </ul>
    </div>
    
    <p>Would you be open to reviewing our live distribution clipping samples for ${brand}?</p>
    
    <div style="margin: 26px 0; display: flex; gap: 12px; flex-wrap: wrap;">
      <a href="https://wa.me/971582021752?text=Hi%20NexcoinPR!%20I%20received%20your%20email%20regarding%20media%20syndication%20for%20${encodeURIComponent(brand)}.%20Please%20share%20details." style="background: #25D366; color: #FFFFFF; font-weight: 700; text-decoration: none; padding: 11px 20px; border-radius: 6px; display: inline-block; font-size: 0.92rem;">Chat on WhatsApp (+971-582021752) &rarr;</a>
      <a href="https://t.me/Nexcoinpr" style="background: #229ED9; color: #FFFFFF; font-weight: 700; text-decoration: none; padding: 11px 20px; border-radius: 6px; display: inline-block; font-size: 0.92rem;">Direct Telegram (@Nexcoinpr) &rarr;</a>
    </div>
    
    <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 28px 0;" />
    
    <p style="font-size: 0.85rem; color: #64748B; margin: 0;">
      <strong>NexcoinPR Editorial &amp; Media Desk</strong><br />
      Web: <a href="https://www.nexcoinpr.agency" style="color: #64748B;">https://www.nexcoinpr.agency</a> | Telegram: <a href="https://t.me/Nexcoinpr" style="color: #64748B;">@Nexcoinpr</a><br />
      Dubai, UAE &bull; Global Financial &amp; Web3 Communications Wire
    </p>
  </div>`;

  return { subject, textBody, htmlBody, brand };
}

async function main() {
  let transporter = null;

  if (!isDryRun) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SENDER_EMAIL,
        pass: APP_PASSWORD.replace(/\s+/g, '')
      }
    });

    try {
      console.log('Verifying SMTP connection to Gmail...');
      await transporter.verify();
      console.log('✅ SMTP connection authenticated successfully!\n');
    } catch (err) {
      console.error('❌ SMTP Authentication failed:', err.message);
      console.log('Please ensure your 16-character Google App Password is correct.');
      process.exit(1);
    }
  }

  // Handle test email to self
  if (isTestMe) {
    console.log(`[TEST MODE] Sending test sample to yourself: ${SENDER_EMAIL}`);
    const sampleLead = { name: "Sample Web3 Protocol", cat: "Crypto Token / Coin", site: "https://example.com" };
    const { subject, textBody, htmlBody } = generateEmail(sampleLead);

    if (isDryRun) {
      console.log(`Subject: ${subject}`);
      console.log(`\n--- Text Preview ---\n${textBody}\n`);
    } else {
      const info = await transporter.sendMail({
        from: `"NexcoinPR Media Desk" <${SENDER_EMAIL}>`,
        to: SENDER_EMAIL,
        subject: `[TEST] ${subject}`,
        text: textBody,
        html: htmlBody
      });
      console.log('✅ Test email delivered successfully! Message ID:', info.messageId);
      console.log('Check your inbox at', SENDER_EMAIL);
    }
    return;
  }

  // Process Batch with domain-level deduplication
  const batch = [];
  const domainInBatch = new Set();

  for (const lead of filteredQueue) {
    if (batch.length >= BATCH_SIZE) break;
    const domain = (lead.email.split('@')[1] || '').toLowerCase();
    const isGenericHost = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'proton.me', 'protonmail.com'].includes(domain);
    if (!isGenericHost && domainInBatch.has(domain)) {
      continue; // Skip duplicate company in this batch
    }
    batch.push(lead);
    if (!isGenericHost) {
      domainInBatch.add(domain);
    }
  }

  if (batch.length === 0) {
    console.log('🎉 All leads in the queue have been contacted!');
    return;
  }

  console.log(`Preparing to process ${batch.length} prospects in this batch...\n`);

  for (let i = 0; i < batch.length; i++) {
    const lead = batch[i];
    const { subject, textBody, htmlBody, brand } = generateEmail(lead);

    console.log(`[${i + 1}/${batch.length}] Targeting: ${brand} (${lead.email}) [Cat: ${lead.cat}]`);

    if (isDryRun) {
      console.log(`   Simulated Subject: "${subject}"`);
      console.log(`   [DRY-RUN] Email not dispatched.`);
    } else {
      try {
        const info = await transporter.sendMail({
          from: `"NexcoinPR Media Desk" <${SENDER_EMAIL}>`,
          to: lead.email,
          subject: subject,
          text: textBody,
          html: htmlBody,
          replyTo: SENDER_EMAIL
        });

        console.log(`   ✅ Sent! (Message ID: ${info.messageId})`);

        // Record in history
        history.push({
          id: lead.id,
          brand: brand,
          name: lead.name,
          email: lead.email,
          cat: lead.cat,
          sentAt: new Date().toISOString()
        });
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');

        // Rate limit pause
        if (i < batch.length - 1) {
          console.log(`   ⏳ Pausing ${DELAY_SEC} seconds to maintain clean sender score...`);
          await sleep(DELAY_SEC * 1000);
        }
      } catch (err) {
        console.error(`   ❌ Failed to send to ${lead.email}:`, err.message);
      }
    }
  }

  console.log('\n===========================================================');
  console.log('✅ Batch processing completed!');
  console.log(`Total successfully logged to contacted_leads.json: ${history.length}`);
  console.log('===========================================================');
}

main().catch(console.error);

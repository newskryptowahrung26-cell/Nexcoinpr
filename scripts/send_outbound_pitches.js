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

// Load Leads from both Curated list and Master 10,000+ CSV
function loadAllLeads() {
  const leads = [];
  const seen = new Set();

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

// Calculate High-Conversion Priority Score
function getLeadPriorityScore(lead) {
  const c = (lead.cat || '').toLowerCase();
  const n = (lead.name || '').toLowerCase();

  // Avoid mega exchanges for cold emails (low response rate)
  if (n.includes('binance') || n.includes('coinbase') || n.includes('okx') || n.includes('kraken') || n.includes('bybit') || n.includes('kucoin')) {
    return 10;
  }

  // Tier 1 High Intent: Crypto Tokens, Memes, Launchpads, DEXs (Urgent need for CMC/CG PR)
  if (c.includes('token') || c.includes('coin') || c.includes('meme')) return 100;
  if (c.includes('launchpad')) return 95;
  if (c.includes('dex')) return 90;
  if (c.includes('prop')) return 85;
  if (c.includes('yield') || c.includes('lending') || c.includes('defi')) return 80;
  if (c.includes('forex') || c.includes('broker')) return 75;

  return 50;
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
  const cat = (lead.cat || '').toLowerCase();
  const isForex = cat.includes('forex') || cat.includes('broker') || cat.includes('prop');
  const isToken = cat.includes('token') || cat.includes('coin') || cat.includes('meme') || cat.includes('launchpad');
  
  const nicheName = isForex ? 'Forex & financial trading' : (isToken ? 'Web3 & token ecosystem' : 'DeFi & blockchain');
  const targetMedia = isForex ? 'Bloomberg, Yahoo Finance, Benzinga, and MarketWatch' : 'CoinDesk, Cointelegraph, Bloomberg, and Yahoo Finance';

  // High-open subject lines
  const subject = isToken 
    ? `Media syndication for ${lead.name} | Guaranteed CoinMarketCap & Google News ($199 Starter Wire)`
    : `Editorial Syndication Proposal for ${lead.name} | Guaranteed 24h Placement`;
  
  const textBody = `Hi ${lead.name} Team,

I came across ${lead.name} and noticed your active momentum in the ${nicheName} space.

Most PR agencies charge upwards of $3,000–$5,000+ per month on open retainers with zero placement guarantees. At NexcoinPR (https://www.nexcoinpr.agency), we provide 100% guaranteed editorial syndication across Tier-1 financial and crypto media — including ${targetMedia} — with live publication delivered within 24 to 48 hours.

⚡ Special Founder Launch Offer — $199 Starter Flash Wire:
To help emerging projects pass CoinMarketCap / CoinGecko media verification and secure Google News search authority, we offer a dedicated $199 Web3 Starter Syndicate (https://www.nexcoinpr.agency/pricing#section-starter-wire):
• 25+ Guaranteed Outlets (Google News indexed)
• Permanent Do-Follow Backlinks (DA 60–85) for SEO ranking
• 24-Hour Guaranteed Turnaround + Live Spreadsheet Proof Report
• 🛡️ 100% Risk-Free Guarantee: Pay 50% ($99.50) upfront. Pay the remaining 50% only after live published URLs are delivered in your hand.

Would you be open to reviewing our live distribution clipping samples for ${lead.name}?

Best regards,

NexcoinPR Editorial & Media Desk
Official Website: https://www.nexcoinpr.agency
Direct WhatsApp: https://wa.me/971582021752 (+971-582021752)
Official Telegram: https://t.me/Nexcoinpr
Email: nexcoinpr@gmail.com`;

  const htmlBody = `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1E293B; max-width: 600px;">
    <p>Hi <strong>${lead.name}</strong> Team,</p>
    
    <p>I came across <strong>${lead.name}</strong> and noticed your active momentum in the ${nicheName} space.</p>
    
    <p>Most traditional PR agencies charge upwards of $3,000–$5,000+ per month on open retainers with zero placement guarantees. At <a href="https://www.nexcoinpr.agency" style="color: #0284C7; font-weight: 700; text-decoration: none;">NexcoinPR</a>, we provide <strong>100% guaranteed editorial syndication</strong> across Tier-1 media — including <strong>${targetMedia}</strong> — with live publication within 24 to 48 hours.</p>
    
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
    
    <p>Would you be open to reviewing our live distribution clipping samples for ${lead.name}?</p>
    
    <div style="margin: 26px 0; display: flex; gap: 12px; flex-wrap: wrap;">
      <a href="https://wa.me/971582021752?text=Hi%20NexcoinPR!%20I%20received%20your%20email%20regarding%20media%20syndication%20for%20${encodeURIComponent(lead.name)}.%20Please%20share%20details." style="background: #25D366; color: #FFFFFF; font-weight: 700; text-decoration: none; padding: 11px 20px; border-radius: 6px; display: inline-block; font-size: 0.92rem;">Chat on WhatsApp (+971-582021752) &rarr;</a>
      <a href="https://t.me/Nexcoinpr" style="background: #229ED9; color: #FFFFFF; font-weight: 700; text-decoration: none; padding: 11px 20px; border-radius: 6px; display: inline-block; font-size: 0.92rem;">Direct Telegram (@Nexcoinpr) &rarr;</a>
    </div>
    
    <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 28px 0;" />
    
    <p style="font-size: 0.85rem; color: #64748B; margin: 0;">
      <strong>NexcoinPR Editorial &amp; Media Desk</strong><br />
      Web: <a href="https://www.nexcoinpr.agency" style="color: #64748B;">https://www.nexcoinpr.agency</a> | Telegram: <a href="https://t.me/Nexcoinpr" style="color: #64748B;">@Nexcoinpr</a><br />
      Dubai, UAE &bull; Global Financial &amp; Web3 Communications Wire
    </p>
  </div>`;

  return { subject, textBody, htmlBody };
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

  // Process Batch
  const batch = filteredQueue.slice(0, BATCH_SIZE);
  if (batch.length === 0) {
    console.log('🎉 All leads in the queue have been contacted!');
    return;
  }

  console.log(`Preparing to process ${batch.length} prospects in this batch...\n`);

  for (let i = 0; i < batch.length; i++) {
    const lead = batch[i];
    const { subject, textBody, htmlBody } = generateEmail(lead);

    console.log(`[${i + 1}/${batch.length}] Targeting: ${lead.name} (${lead.cat}) -> ${lead.email}`);

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

const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Parse CLI Arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run') || !process.env.GMAIL_APP_PASSWORD;
const isTestMe = args.includes('--test-me');
const batchSizeArg = args.find(a => a.startsWith('--batch='));
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
const contactedEmails = new Set(history.map(h => (h.email || '').toLowerCase()));

// Load Leads
if (!fs.existsSync(DATA_FILE)) {
  console.error('[Error] Curated leads file not found at:', DATA_FILE);
  console.log('Run `node scripts/curate_hot_leads.js` first.');
  process.exit(1);
}
const allLeads = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

// Filter Uncontacted Leads
const queue = allLeads.filter(lead => {
  return lead.email && lead.email.includes('@') && !contactedEmails.has(lead.email.toLowerCase());
});

console.log('===========================================================');
console.log('🚀 NexcoinPR Automated B2B Media Pitch Sender');
console.log('===========================================================');
console.log(`Total Leads in Database : ${allLeads.length}`);
console.log(`Already Contacted       : ${contactedEmails.size}`);
console.log(`Remaining in Queue      : ${queue.length}`);
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

// Generate Personalized Pitch Content
function generateEmail(lead) {
  const isForex = (lead.cat || '').toLowerCase().includes('forex') || (lead.cat || '').toLowerCase().includes('broker');
  const nicheName = isForex ? 'Forex & financial trading' : 'Web3 & digital asset';
  const targetMedia = isForex ? 'Bloomberg, Yahoo Finance, Benzinga, and MarketWatch' : 'CoinDesk, Cointelegraph, Bloomberg, and Yahoo Finance';

  const subject = `Media Syndication Proposal for ${lead.name} | Guaranteed Tier-1 Distribution`;
  
  const textBody = `Hi ${lead.name} Team,

I came across ${lead.name} and noticed your active presence in the ${nicheName} sector.

Most PR agencies charge upwards of $5,000+ per month on open retainers with zero placement guarantees. At NexcoinPR (https://www.nexcoinpr.agency), we provide 100% guaranteed editorial syndication across Tier-1 financial media — including ${targetMedia} — with live publication within 24 to 48 hours.

What we provide for ${lead.name}:
• 100% Guaranteed Publication across 140+ global financial & crypto newsrooms
• High Domain Authority (DA 80–94) Permanent Do-Follow Backlinks
• Fast 24–48 Hour Editorial Turnaround & Live Syndication Report
• Guaranteed Google News and search engine indexing

🎁 Launch Offer: We are currently offering a 20% discount on initial syndication packages for new partners with promo code NEXCOIN20.

Would you be open to reviewing our distribution deck, sample live coverage links, and package options for your upcoming announcement?

Best regards,

NexcoinPR Editorial & Media Desk
Official Website: https://www.nexcoinpr.agency
Direct WhatsApp: https://wa.me/971582021752 (+971-582021752)
Official Telegram: https://t.me/Nexcoinpr
Email: nexcoinpr@gmail.com`;

  const htmlBody = `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1E293B; max-width: 600px;">
    <p>Hi <strong>${lead.name}</strong> Team,</p>
    
    <p>I came across <strong>${lead.name}</strong> and noticed your active presence in the ${nicheName} sector.</p>
    
    <p>Most traditional PR agencies charge upwards of $5,000+ per month on open retainers with zero placement guarantees. At <a href="https://www.nexcoinpr.agency" style="color: #0284C7; font-weight: 700; text-decoration: none;">NexcoinPR</a>, we provide <strong>100% guaranteed editorial syndication</strong> across Tier-1 financial media — including <strong>${targetMedia}</strong> — with live publication within 24 to 48 hours.</p>
    
    <div style="background: #F8FAFC; border-left: 4px solid #C9A84C; padding: 14px 18px; margin: 18px 0; border-radius: 4px;">
      <p style="margin: 0 0 8px; font-weight: 700; color: #0F172A;">What we provide for ${lead.name}:</p>
      <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 0.95rem;">
        <li><strong>100% Guaranteed Publication</strong> across 140+ global financial &amp; crypto outlets</li>
        <li><strong>High Domain Authority (DA 80–94)</strong> Permanent Do-Follow SEO Backlinks</li>
        <li><strong>24–48h Fast Turnaround</strong> with full live syndication clipping report</li>
        <li><strong>Google News &amp; Terminal Indexing</strong> for maximum investor reach</li>
      </ul>
    </div>
    
    <p>🎁 <strong>Launch Promotion:</strong> We are offering <strong>20% off</strong> on all initial media distribution packages with promo code <strong style="color: #B45309;">NEXCOIN20</strong>.</p>
    
    <p>Would you be open to reviewing our distribution deck, sample live coverage links, and package options for your upcoming announcement?</p>
    
    <p style="margin-top: 24px;">
      <a href="https://wa.me/971582021752?text=Hi%20NexcoinPR%20team%2C%20I%20received%20your%20email%20regarding%20media%20syndication%20for%20${encodeURIComponent(lead.name)}.%20Please%20share%20details." style="background: #25D366; color: #FFFFFF; font-weight: 700; text-decoration: none; padding: 10px 18px; border-radius: 6px; display: inline-block; font-size: 0.9rem;">Chat on WhatsApp (+971-582021752) &rarr;</a>
    </p>
    
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
    const sampleLead = { name: "Sample Protocol", cat: "DeFi Platform", site: "https://example.com" };
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
  const batch = queue.slice(0, BATCH_SIZE);
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

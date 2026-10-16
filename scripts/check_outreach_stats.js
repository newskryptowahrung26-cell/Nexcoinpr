const fs = require('fs');
const path = require('path');

const HISTORY_FILE = path.join(__dirname, 'contacted_leads.json');
const DATA_FILE = path.join(__dirname, '..', 'data', 'curated_hot_leads.json');
const CSV_FILE = path.join(__dirname, '..', 'assets', 'docs', 'Crypto_Forex_Trading_10000_B2B_Master_Leads.csv');

let history = [];
if (fs.existsSync(HISTORY_FILE)) {
  try {
    history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  } catch (e) {
    history = [];
  }
}

const contactedSet = new Set(history.map(h => (h.email || '').toLowerCase().trim()));

// Count master leads
let totalLeads = 0;
const uniqueEmails = new Set();
const nextQueue = [];

if (fs.existsSync(CSV_FILE)) {
  const content = fs.readFileSync(CSV_FILE, 'utf8');
  const lines = content.split(/\r?\n/);
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const matches = line.match(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g);
    if (!matches) continue;
    const clean = matches.map(m => m.replace(/^,?"?|"$/g, '').trim());
    const name = clean[1];
    const cat = clean[2];
    const email = clean[6];
    if (email && email.includes('@') && !email.includes('example.com')) {
      const em = email.toLowerCase().trim();
      if (!uniqueEmails.has(em)) {
        uniqueEmails.add(em);
        totalLeads++;
        if (!contactedSet.has(em) && nextQueue.length < 5) {
          nextQueue.push({ name, cat, email: em });
        }
      }
    }
  }
}

console.log('===========================================================');
console.log('📊 NexcoinPR Autonomous Outbound & Growth Dashboard');
console.log('===========================================================');
console.log(`🎯 Total B2B Prospects in Master Vault : ${totalLeads.toLocaleString()}`);
console.log(`✉️ Total Pitches Successfully Sent   : ${history.length}`);
console.log(`⏳ Uncontacted Prospects in Queue      : ${(totalLeads - history.length).toLocaleString()}`);
console.log(`🤖 Automated Delivery Schedule         : Mon–Fri @ 08:00 AM UTC (15 leads/day)`);
console.log('===========================================================\n');

if (history.length > 0) {
  console.log('🕒 Recently Contacted Prospects (Last 5):');
  history.slice(-5).reverse().forEach((h, i) => {
    console.log(`  ${i + 1}. ${h.name} (${h.cat}) -> ${h.email} [${new Date(h.sentAt).toLocaleString()}]`);
  });
  console.log('');
}

if (nextQueue.length > 0) {
  console.log('🚀 Next In Line for Automated Outreach:');
  nextQueue.forEach((q, i) => {
    console.log(`  ${i + 1}. ${q.name} (${q.cat}) -> ${q.email}`);
  });
  console.log('');
}
console.log('💡 All replies from these prospects will land directly in:');
console.log('   • WhatsApp: +971-582021752');
console.log('   • Telegram: @Nexcoinpr');
console.log('   • Email   : nexcoinpr@gmail.com\n');

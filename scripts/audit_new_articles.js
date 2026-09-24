const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '..', 'news', 'bitcoin-slips-under-84k-us-treasury-yields-surge.html'),
  path.join(__dirname, '..', 'news', 'usd-jpy-outlook-fed-recalibration-pressures-yen.html'),
  path.join(__dirname, '..', 'news', 'trump-administration-weighs-a-global-stablecoin-plan-to-cement-dollar-s-dom.html')
];

const bannedWords = [
  'a journey of', 'a multitude of', 'a plethora of', 'a testament to', 'accordingly',
  'actionable insights', 'adept', 'adoption rate', 'aforementioned', 'agile',
  'ai-powered', 'aligns', 'ample opportunities', 'amplify', 'arduous',
  'as a result', 'as such', 'at length', 'at the end of the day', 'augment',
  'bandwidth', 'based on the information provided', 'basic', 'best practices',
  'blockchain-enabled', 'brand awareness', 'broadly speaking', 'burgeoning',
  'cannot be overstated', 'capacity building', 'captivating', 'change management',
  'cloud-based', 'cognizant', 'collaborative environment', 'commendable',
  'competitive landscape', 'complexity', 'conceptualize', 'conducting',
  'consequently', 'considerable', 'continuous improvement', 'core',
  'corporate social responsibility', 'cost optimization', 'craft', 'critical',
  'crucial', 'customer loyalty', 'customer satisfaction', 'cutting-edge',
  'delve', 'dive', 'embark', 'empower', 'endeavor', 'foster', 'game-changer',
  'groundbreaking', 'harness', 'holistic', 'illuminate', 'in order to',
  'innovative', 'intricate', 'juxtaposition', 'leverage', 'meticulous',
  'navigate', 'nexus', 'nuance', 'orchestrate', 'paramount', 'pivotal',
  'plethora', 'realm', 'relentless', 'resonate', 'revolutionize', 'robust',
  'seamless', 'spearhead', 'strategic', 'streamline', 'tapestry',
  'transformative', 'unleash', 'unlock', 'unprecedented', 'utilize', 'vital'
];

let issues = 0;
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const base = path.basename(f);
  
  // 1. Check dashes
  const dashMatches = content.match(/[—–]|(\s-\s)/g);
  if (dashMatches) {
    console.log(`[DASH ISSUE in ${base}]: Found ${dashMatches.length} dashes!`);
    issues++;
  } else {
    console.log(`[PASS] Zero dashes in ${base}`);
  }

  // 2. Check banned words
  bannedWords.forEach(word => {
    const reg = new RegExp(`\\b${word}\\b`, 'gi');
    const m = content.match(reg);
    if (m) {
      console.log(`[BANNED WORD in ${base}]: "${word}" found ${m.length} times`);
      issues++;
    }
  });

  // 3. Check meta description length
  const metaDescMatch = content.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
  if (metaDescMatch) {
    const desc = metaDescMatch[1];
    console.log(`[DESC in ${base}]: ${desc.length} chars (<= 140: ${desc.length <= 140}) -> "${desc}"`);
    if (desc.length > 140) issues++;
  }
});

console.log('\nTotal issues found:', issues);

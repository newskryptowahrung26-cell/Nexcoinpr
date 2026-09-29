const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT_DIR = path.join(__dirname, 'play-store-assets');
const DOWNLOADS_DIR = 'C:\\Users\\NDCOM\\Downloads\\PlayStoreAssets';

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
if (!fs.existsSync(DOWNLOADS_DIR)) fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });

// Read local logo as base64
const logoPath = path.join(__dirname, 'assets', 'images', 'nexcoinpr-official-logo.png');
let logoBase64 = '';
if (fs.existsSync(logoPath)) {
  logoBase64 = 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64');
}

// 1. Feature Graphic HTML (1024x500)
const featureGraphicHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body {
      width: 1024px;
      height: 500px;
      background: radial-gradient(circle at 80% 20%, rgba(0, 242, 254, 0.15), transparent 40%),
                  radial-gradient(circle at 20% 80%, rgba(121, 40, 202, 0.2), transparent 45%),
                  linear-gradient(135deg, #090d16 0%, #04060a 100%);
      color: #ffffff;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 0 65px;
      position: relative;
      overflow: hidden;
    }
    .grid-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 32px 32px;
      pointer-events: none;
    }
    .left-content {
      max-width: 540px;
      z-index: 2;
    }
    .logo-badge {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(0, 242, 254, 0.3);
      padding: 6px 16px;
      border-radius: 9999px;
      margin-bottom: 22px;
      backdrop-filter: blur(10px);
    }
    .logo-badge img {
      height: 28px;
      width: auto;
    }
    .logo-badge span {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #00f2fe;
    }
    h1 {
      font-size: 42px;
      line-height: 1.15;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin-bottom: 14px;
      background: linear-gradient(135deg, #ffffff 40%, #00f2fe 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p.tagline {
      font-size: 17px;
      color: #94a3b8;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    .features-row {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
    }
    .badge {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      color: #e2e8f0;
    }
    .badge span.dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }
    .media-brands {
      font-size: 12px;
      color: #64748b;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-weight: 600;
    }
    .media-brands span {
      color: #cbd5e1;
      font-weight: 700;
      margin: 0 6px;
    }
    .right-card {
      width: 320px;
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(0, 242, 254, 0.25);
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 242, 254, 0.1);
      backdrop-filter: blur(16px);
      z-index: 2;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 12px;
    }
    .card-title {
      font-size: 14px;
      font-weight: 700;
      color: #f8fafc;
    }
    .status-live {
      font-size: 11px;
      font-weight: 700;
      color: #10b981;
      background: rgba(16, 185, 129, 0.15);
      padding: 3px 8px;
      border-radius: 12px;
    }
    .stat-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 14px;
    }
    .stat-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 12px;
      width: 48%;
    }
    .stat-val {
      font-size: 20px;
      font-weight: 800;
      color: #00f2fe;
    }
    .stat-lbl {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 2px;
    }
    .pub-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .pub-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255, 255, 255, 0.04);
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      color: #e2e8f0;
    }
    .pub-check {
      color: #00f2fe;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="grid-overlay"></div>
  <div class="left-content">
    <div class="logo-badge">
      ${logoBase64 ? `<img src="${logoBase64}" alt="NexcoinPR Logo" />` : ''}
      <span>NEXCOINPR AGENCY</span>
    </div>
    <h1>Global Crypto & Forex PR Agency</h1>
    <p class="tagline">Guaranteed tier-1 publication across top-tier crypto and financial media networks worldwide.</p>
    <div class="features-row">
      <div class="badge"><span class="dot"></span> Tier-1 Media Placement</div>
      <div class="badge"><span class="dot"></span> Real-Time Analytics</div>
      <div class="badge"><span class="dot"></span> Guaranteed Wire</div>
    </div>
    <div class="media-brands">
      <span>CoinDesk</span> • <span>Cointelegraph</span> • <span>Bloomberg</span> • <span>Yahoo Finance</span> • <span>Benzinga</span>
    </div>
  </div>
  <div class="right-card">
    <div class="card-header">
      <div class="card-title">Live Wire Campaign</div>
      <div class="status-live">● ACTIVE</div>
    </div>
    <div class="stat-row">
      <div class="stat-box">
        <div class="stat-val">350+</div>
        <div class="stat-lbl">Global Outlets</div>
      </div>
      <div class="stat-box">
        <div class="stat-val">2.8M</div>
        <div class="stat-lbl">Media Reach</div>
      </div>
    </div>
    <div class="pub-list">
      <div class="pub-item"><span>Bloomberg Terminal</span> <span class="pub-check">✓ PUBLISHED</span></div>
      <div class="pub-item"><span>CoinDesk Wire</span> <span class="pub-check">✓ PUBLISHED</span></div>
      <div class="pub-item"><span>Yahoo! Finance</span> <span class="pub-check">✓ PUBLISHED</span></div>
    </div>
  </div>
</body>
</html>`;

// Phone Screenshot generator helper
function getPhoneScreenshotHtml(title, subtitle, badge, contentHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body {
      width: 1080px;
      height: 1920px;
      background: #070a13;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 90px 60px 40px;
      position: relative;
      overflow: hidden;
    }
    .bg-glow-1 {
      position: absolute;
      top: -100px;
      right: -100px;
      width: 700px;
      height: 700px;
      background: radial-gradient(circle, rgba(0, 242, 254, 0.18) 0%, transparent 70%);
      pointer-events: none;
    }
    .bg-glow-2 {
      position: absolute;
      bottom: -150px;
      left: -150px;
      width: 800px;
      height: 800px;
      background: radial-gradient(circle, rgba(121, 40, 202, 0.22) 0%, transparent 70%);
      pointer-events: none;
    }
    .top-badge {
      background: rgba(0, 242, 254, 0.1);
      border: 1px solid rgba(0, 242, 254, 0.4);
      color: #00f2fe;
      padding: 10px 28px;
      border-radius: 9999px;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 28px;
    }
    h1.header-title {
      font-size: 64px;
      font-weight: 800;
      text-align: center;
      line-height: 1.18;
      letter-spacing: -1px;
      margin-bottom: 20px;
      background: linear-gradient(135deg, #ffffff 40%, #00f2fe 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      max-width: 960px;
    }
    p.header-subtitle {
      font-size: 28px;
      color: #94a3b8;
      text-align: center;
      line-height: 1.45;
      max-width: 880px;
      margin-bottom: 60px;
    }
    .mockup-container {
      width: 100%;
      flex: 1;
      background: rgba(15, 23, 42, 0.85);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 36px 36px 0 0;
      padding: 45px;
      box-shadow: 0 -20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(0, 242, 254, 0.1);
      backdrop-filter: blur(20px);
      display: flex;
      flex-direction: column;
    }
  </style>
</head>
<body>
  <div class="bg-glow-1"></div>
  <div class="bg-glow-2"></div>
  <div class="top-badge">${badge}</div>
  <h1 class="header-title">${title}</h1>
  <p class="header-subtitle">${subtitle}</p>
  <div class="mockup-container">
    ${contentHtml}
  </div>
</body>
</html>`;
}

// Screenshot 1: Home & Hero
const screen1Html = getPhoneScreenshotHtml(
  'Leading Crypto & Forex PR Agency',
  'Guaranteed distribution across tier-1 publications, newswires, and major crypto media.',
  'NEXCOINPR OFFICIAL APP',
  `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
      <div style="font-size:32px; font-weight:800; color:#fff;">Live Media Desk</div>
      <div style="background:#10b981; color:#fff; font-size:18px; font-weight:700; padding:8px 20px; border-radius:30px;">● CLOUD SYNC LIVE</div>
    </div>
    <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(201,168,76,0.3); border-radius:24px; padding:28px; margin-bottom:26px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span style="font-size:22px; color:#C9A84C; font-weight:700;">FEATURED SYNDICATION</span>
        <span style="font-size:26px; font-weight:900; color:#F3D785;">$7,000</span>
      </div>
      <div style="font-size:36px; font-weight:800; color:#fff; margin-bottom:8px;">60 Media Mega Package</div>
      <div style="font-size:19px; color:#cbd5e1;">60 indexed crypto & financial publications with guaranteed live syndication reports.</div>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:26px;">
      <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:20px; padding:22px;">
        <div style="font-size:36px; font-weight:800; color:#C9A84C;">144+</div>
        <div style="font-size:17px; color:#94a3b8; margin-top:4px;">Verified Outlets</div>
      </div>
      <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:20px; padding:22px;">
        <div style="font-size:36px; font-weight:800; color:#00F2FE;">$100 - $8.5k</div>
        <div style="font-size:17px; color:#94a3b8; margin-top:4px;">Flat Transparent Rates</div>
      </div>
    </div>
    <div style="font-size:24px; font-weight:700; color:#fff; margin-bottom:16px;">Top Outlets by Volume</div>
    <div style="display:flex; flex-direction:column; gap:14px;">
      <div style="background:rgba(255,255,255,0.05); padding:18px 24px; border-radius:16px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:22px; font-weight:700; color:#fff;">Forbes</div>
          <div style="font-size:15px; color:#94a3b8;">Mainstream Tier-1</div>
        </div>
        <span style="color:#F3D785; font-size:22px; font-weight:900;">$7,500</span>
      </div>
      <div style="background:rgba(255,255,255,0.05); padding:18px 24px; border-radius:16px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:22px; font-weight:700; color:#fff;">Coindesk</div>
          <div style="font-size:15px; color:#94a3b8;">Crypto & Web3 Leader</div>
        </div>
        <span style="color:#F3D785; font-size:22px; font-weight:900;">$8,000</span>
      </div>
      <div style="background:rgba(255,255,255,0.05); padding:18px 24px; border-radius:16px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:22px; font-weight:700; color:#fff;">Cointelegraph (Full PR)</div>
          <div style="font-size:15px; color:#94a3b8;">Crypto Authority</div>
        </div>
        <span style="color:#F3D785; font-size:22px; font-weight:900;">$6,999</span>
      </div>
    </div>
  `
);

// Screenshot 2: Media Network with REAL AUTHENTIC PRICES
const screen2Html = getPhoneScreenshotHtml(
  '144+ Single Media Outlets',
  'Authentic flat rates from $100 to $8,500 across verified global media desks.',
  'TRANSPARENT PRICING',
  `
    <div style="font-size:28px; font-weight:700; color:#fff; margin-bottom:20px;">A La Carte Media Placements</div>
    <div style="display:flex; flex-direction:column; gap:16px;">
      <div style="background:rgba(13,31,60,0.85); border:1.5px solid rgba(201,168,76,0.4); padding:20px 24px; border-radius:18px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:24px; font-weight:800; color:#fff;">Entrepreneur.com</div>
          <div style="font-size:16px; color:#94a3b8;">Mainstream Tier-1 • 24-48h</div>
        </div>
        <div style="background:rgba(201,168,76,0.2); border:1px solid #D4AF37; padding:8px 18px; border-radius:10px; font-size:24px; font-weight:900; color:#F3D785;">$8,500</div>
      </div>
      <div style="background:rgba(13,31,60,0.85); border:1.5px solid rgba(201,168,76,0.4); padding:20px 24px; border-radius:18px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:24px; font-weight:800; color:#fff;">Coindesk</div>
          <div style="font-size:16px; color:#94a3b8;">Crypto & Web3 • Direct Submission</div>
        </div>
        <div style="background:rgba(201,168,76,0.2); border:1px solid #D4AF37; padding:8px 18px; border-radius:10px; font-size:24px; font-weight:900; color:#F3D785;">$8,000</div>
      </div>
      <div style="background:rgba(13,31,60,0.85); border:1.5px solid rgba(201,168,76,0.4); padding:20px 24px; border-radius:18px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:24px; font-weight:800; color:#fff;">Forbes</div>
          <div style="font-size:16px; color:#94a3b8;">Global Authority • Editorial Wire</div>
        </div>
        <div style="background:rgba(201,168,76,0.2); border:1px solid #D4AF37; padding:8px 18px; border-radius:10px; font-size:24px; font-weight:900; color:#F3D785;">$7,500</div>
      </div>
      <div style="background:rgba(13,31,60,0.85); border:1.5px solid rgba(201,168,76,0.4); padding:20px 24px; border-radius:18px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:24px; font-weight:800; color:#fff;">Cointelegraph (Full PR)</div>
          <div style="font-size:16px; color:#94a3b8;">Crypto Leader • Frontpage Indexing</div>
        </div>
        <div style="background:rgba(201,168,76,0.2); border:1px solid #D4AF37; padding:8px 18px; border-radius:10px; font-size:24px; font-weight:900; color:#F3D785;">$6,999</div>
      </div>
      <div style="background:rgba(13,31,60,0.85); border:1.5px solid rgba(201,168,76,0.4); padding:20px 24px; border-radius:18px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:24px; font-weight:800; color:#fff;">Cointelegraph (Lite PR)</div>
          <div style="font-size:16px; color:#94a3b8;">Crypto & Web3 • Press Syndication</div>
        </div>
        <div style="background:rgba(201,168,76,0.2); border:1px solid #D4AF37; padding:8px 18px; border-radius:10px; font-size:24px; font-weight:900; color:#F3D785;">$3,500</div>
      </div>
      <div style="background:rgba(13,31,60,0.85); border:1.5px solid rgba(201,168,76,0.4); padding:20px 24px; border-radius:18px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:24px; font-weight:800; color:#fff;">Decrypt.co</div>
          <div style="font-size:16px; color:#94a3b8;">Web3 & DeFi News Desk</div>
        </div>
        <div style="background:rgba(201,168,76,0.2); border:1px solid #D4AF37; padding:8px 18px; border-radius:10px; font-size:24px; font-weight:900; color:#F3D785;">$2,000</div>
      </div>
      <div style="background:rgba(13,31,60,0.85); border:1.5px solid rgba(201,168,76,0.4); padding:20px 24px; border-radius:18px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:24px; font-weight:800; color:#fff;">Bitcoin.com</div>
          <div style="font-size:16px; color:#94a3b8;">Crypto Giant • Guaranteed Indexing</div>
        </div>
        <div style="background:rgba(201,168,76,0.2); border:1px solid #D4AF37; padding:8px 18px; border-radius:10px; font-size:24px; font-weight:900; color:#F3D785;">$2,000</div>
      </div>
    </div>
  `
);

// Screenshot 3: 13 PR Bundled Packages with REAL AUTHENTIC PRICES
const screen3Html = getPhoneScreenshotHtml(
  '13 Curated Distribution Packages',
  'Turnkey syndication bundles guaranteed across top-tier crypto & financial wires.',
  'OFFICIAL PACKAGES',
  `
    <div style="display:flex; flex-direction:column; gap:18px;">
      <div style="background:linear-gradient(135deg, rgba(201,168,76,0.2), rgba(13,31,60,0.9)); border:2px solid #D4AF37; padding:24px 26px; border-radius:20px; position:relative;">
        <div style="position:absolute; top:-12px; right:24px; background:#D4AF37; color:#0A1628; font-size:14px; font-weight:900; padding:4px 14px; border-radius:20px;">PRESTIGE FLAGSHIP</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div style="font-size:28px; font-weight:900; color:#fff;">ELITE: A</div>
          <div style="font-size:28px; font-weight:900; color:#F3D785;">$20,000</div>
        </div>
        <div style="font-size:18px; color:#e2e8f0; line-height:1.45;">Top 5 Crypto Giants: CoinDesk, Cointelegraph, Decrypt, Bitcoin.com, and BeInCrypto.</div>
      </div>
      <div style="background:rgba(13,31,60,0.85); border:1.5px solid rgba(201,168,76,0.3); padding:22px 26px; border-radius:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div style="font-size:26px; font-weight:800; color:#fff;">ELITE: B</div>
          <div style="font-size:26px; font-weight:900; color:#F3D785;">$11,000</div>
        </div>
        <div style="font-size:17px; color:#94a3b8; line-height:1.45;">5 Major Crypto Desks: Cointelegraph, Decrypt, Bitcoin.com, TheBlock, and Watcher.guru.</div>
      </div>
      <div style="background:rgba(13,31,60,0.85); border:1.5px solid rgba(201,168,76,0.3); padding:22px 26px; border-radius:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div style="font-size:26px; font-weight:800; color:#fff;">VIRAL (10 Crypto Media)</div>
          <div style="font-size:26px; font-weight:900; color:#F3D785;">$8,300</div>
        </div>
        <div style="font-size:17px; color:#94a3b8; line-height:1.45;">10 Verified Crypto publications for maximum reach and community momentum.</div>
      </div>
      <div style="background:rgba(13,31,60,0.85); border:1.5px solid rgba(201,168,76,0.3); padding:22px 26px; border-radius:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div style="font-size:26px; font-weight:800; color:#fff;">60 Media Mega Package</div>
          <div style="font-size:26px; font-weight:900; color:#F3D785;">$7,000</div>
        </div>
        <div style="font-size:17px; color:#94a3b8; line-height:1.45;">Massive full-spectrum syndication across 60 global crypto and financial wires.</div>
      </div>
      <div style="background:rgba(13,31,60,0.85); border:1.5px solid rgba(201,168,76,0.3); padding:22px 26px; border-radius:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div style="font-size:26px; font-weight:800; color:#fff;">Fintech & Forex (10 Media)</div>
          <div style="font-size:26px; font-weight:900; color:#F3D785;">$3,999</div>
        </div>
        <div style="font-size:17px; color:#94a3b8; line-height:1.45;">Targeted distribution for forex brokers, trading platforms, and financial software.</div>
      </div>
    </div>
  `
);

// Screenshot 4: Real-Time Insights & Reports
const screen4Html = getPhoneScreenshotHtml(
  'Live Cloud Sync & News Feed',
  'Live prices, publication additions, and market news auto-sync without app updates.',
  'REAL-TIME SYNC',
  `
    <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(0,242,254,0.3); border-radius:24px; padding:28px; margin-bottom:24px;">
      <div style="font-size:20px; color:#00F2FE; font-weight:700; margin-bottom:6px;">⚡ LIVE CLOUD ENGINE</div>
      <div style="font-size:32px; font-weight:800; color:#10b981; margin-bottom:12px;">Auto-Sync Connected</div>
      <div style="font-size:18px; color:#cbd5e1;">All 144 outlets & 13 packages synchronize directly from website data in real-time.</div>
    </div>
    <div style="font-size:24px; font-weight:700; color:#fff; margin-bottom:16px;">Latest Market Editorial</div>
    <div style="display:flex; flex-direction:column; gap:16px;">
      <div style="background:rgba(255,255,255,0.04); padding:20px 24px; border-radius:18px;">
        <div style="font-size:14px; color:#C9A84C; font-weight:700; margin-bottom:4px;">CRYPTO PR GUIDE</div>
        <div style="font-size:20px; font-weight:700; color:#fff;">Token Launch PR: How to Guarantee CoinDesk & Cointelegraph Indexing</div>
      </div>
      <div style="background:rgba(255,255,255,0.04); padding:20px 24px; border-radius:18px;">
        <div style="font-size:14px; color:#00F2FE; font-weight:700; margin-bottom:4px;">FOREX & BROKERS</div>
        <div style="font-size:20px; font-weight:700; color:#fff;">Forex Broker PR Strategies for Rapid Global Trader Acquisition</div>
      </div>
      <div style="background:rgba(255,255,255,0.04); padding:20px 24px; border-radius:18px;">
        <div style="font-size:14px; color:#10B981; font-weight:700; margin-bottom:4px;">1-TAP ORDERING</div>
        <div style="font-size:20px; font-weight:700; color:#fff;">Direct Telegram Desk (@Nexcoinpr) — Instant Confirmation & Scheduling</div>
      </div>
    </div>
  `
);

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. Feature Graphic (1024x500)
  console.log('Generating Feature Graphic (1024x500)...');
  await page.setViewport({ width: 1024, height: 500, deviceScaleFactor: 1 });
  await page.setContent(featureGraphicHtml, { waitUntil: 'load' });
  const featOut = path.join(OUT_DIR, 'feature-graphic-1024x500.png');
  const featDl = path.join(DOWNLOADS_DIR, '02-feature-graphic-1024x500.png');
  await page.screenshot({ path: featOut });
  fs.copyFileSync(featOut, featDl);
  console.log('Feature graphic created at:', featDl);

  // 2. Phone Screenshots (1080x1920)
  const screens = [
    { name: '03-screenshot-1-hero.png', html: screen1Html },
    { name: '04-screenshot-2-media.png', html: screen2Html },
    { name: '05-screenshot-3-packages.png', html: screen3Html },
    { name: '06-screenshot-4-insights.png', html: screen4Html }
  ];

  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });

  for (const s of screens) {
    console.log('Generating ' + s.name + '...');
    await page.setContent(s.html, { waitUntil: 'load' });
    const localOut = path.join(OUT_DIR, s.name);
    const dlOut = path.join(DOWNLOADS_DIR, s.name);
    await page.screenshot({ path: localOut });
    fs.copyFileSync(localOut, dlOut);
    console.log('Saved to:', dlOut);
  }

  await browser.close();
  console.log('ALL GOOGLE PLAY ASSETS GENERATED SUCCESSFULLY!');
}

run().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});

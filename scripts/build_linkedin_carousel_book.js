const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const SCRATCH_DIR = path.join(ROOT_DIR, 'scratch');
const ASSETS_DOCS_DIR = path.join(ROOT_DIR, 'assets', 'docs');
const ASSETS_CAROUSEL_DIR = path.join(ROOT_DIR, 'assets', 'images', 'carousel');
const DOWNLOADS_DIR = 'C:\\Users\\NDCOM\\Downloads';
const DOWNLOADS_SLIDES_DIR = path.join(DOWNLOADS_DIR, 'NexcoinPR-LinkedIn-Slides');
const EDGE_PATH = 'C:\\\\Program Files (x86)\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe';

[SCRATCH_DIR, ASSETS_DOCS_DIR, ASSETS_CAROUSEL_DIR, DOWNLOADS_SLIDES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Official NexcoinPR Logo Emblem (circular globe, gold crescent & blue bezel)
const FAVICON_PATH = path.join(ROOT_DIR, 'favicon.svg');
const FAVICON_B64 = fs.readFileSync(FAVICON_PATH).toString('base64');
const OFFICIAL_LOGO = `<img src="data:image/svg+xml;base64,${FAVICON_B64}" width="36" height="36" style="border-radius:50%;display:inline-block;vertical-align:middle;margin-right:10px;box-shadow:0 2px 10px rgba(0,0,0,0.5), 0 0 12px rgba(201,168,76,0.35);" alt="NexcoinPR">`;


function renderProgressBars(activeIdx, total = 8) {
  let bars = '';
  for (let i = 1; i <= total; i++) {
    const isActive = i === activeIdx;
    bars += `<div style="height: 4px; border-radius: 2px; transition: all 0.3s; ${
      isActive ? 'width: 50px; background: #C9A84C;' : 'width: 24px; background: #1E293B;'
    }"></div>`;
  }
  return `<div style="display: flex; gap: 8px; align-items: center;">${bars}</div>`;
}

// 8 High-Converting Advertising & Media Kit Slides
const slidesData = [
  // Slide 1: High-Impact Hook & Media Showcase
  {
    page: 1,
    series: 'AGENCY MEDIA KIT',
    eyebrow: 'GUARANTEED COVERAGE',
    quoteMark: false,
    headline: 'Get Guaranteed Tier-1 Editorial Coverage for Your Web3 & Forex Brand.',
    bodyText: `<div style="font-size:23px;line-height:1.6;color:#CBD5E1;margin-bottom:28px;">
      Stop pitching busy journalists who ignore your emails. We bypass the pitch inbox and publish your announcement directly on the world's most authoritative crypto and financial publications.
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:28px;">
      <span style="background:#131B29;border:1px solid rgba(201,168,76,0.35);color:#F3D785;font-weight:700;font-size:17px;padding:8px 18px;border-radius:20px;">Cointelegraph</span>
      <span style="background:#131B29;border:1px solid rgba(201,168,76,0.35);color:#F3D785;font-weight:700;font-size:17px;padding:8px 18px;border-radius:20px;">CoinDesk</span>
      <span style="background:#131B29;border:1px solid rgba(201,168,76,0.35);color:#F3D785;font-weight:700;font-size:17px;padding:8px 18px;border-radius:20px;">Forbes</span>
      <span style="background:#131B29;border:1px solid rgba(201,168,76,0.35);color:#F3D785;font-weight:700;font-size:17px;padding:8px 18px;border-radius:20px;">Bloomberg</span>
      <span style="background:#131B29;border:1px solid rgba(201,168,76,0.35);color:#F3D785;font-weight:700;font-size:17px;padding:8px 18px;border-radius:20px;">Yahoo Finance</span>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <div style="background:#0F172A;border:1px solid rgba(201,168,76,0.25);padding:16px 20px;border-radius:10px;">
        <div style="color:#C9A84C;font-size:26px;font-weight:800;margin-bottom:4px;">100%</div>
        <div style="color:#E2E8F0;font-size:16px;font-weight:600;">Guaranteed Live Link or Full Refund</div>
      </div>
      <div style="background:#0F172A;border:1px solid rgba(201,168,76,0.25);padding:16px 20px;border-radius:10px;">
        <div style="color:#C9A84C;font-size:26px;font-weight:800;margin-bottom:4px;">24–48h</div>
        <div style="color:#E2E8F0;font-size:16px;font-weight:600;">Rapid Editorial Turnaround</div>
      </div>
    </div>`,
    callout: 'Swipe to see our live pricing matrix, strategic packages, and verified client results →',
    footerNote: null
  },
  // Slide 2: Traditional PR vs NexcoinPR
  {
    page: 2,
    series: 'AGENCY COMPARISON',
    eyebrow: 'STOP BURNING BUDGET',
    quoteMark: false,
    headline: 'Traditional PR Retainers vs. The NexcoinPR Model',
    bodyText: `<div style="display:flex;flex-direction:column;gap:18px;">
      <div style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.28);border-radius:10px;padding:22px 24px;">
        <div style="color:#F87171;font-weight:800;font-size:18px;margin-bottom:10px;letter-spacing:0.04em;">❌ TRADITIONAL PR AGENCIES</div>
        <div style="color:#CBD5E1;font-size:17px;line-height:1.6;">
          • <strong>$5,000 to $10,000/mo</strong> non-refundable retainers<br>
          • <strong>Zero guarantees</strong> — you pay even if nobody covers you<br>
          • <strong>6-week delays</strong> and endless discovery meetings<br>
          • Releases blasted to automated scrapers &amp; no-index subdomains
        </div>
      </div>
      <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.35);border-radius:10px;padding:22px 24px;">
        <div style="color:#F3D785;font-weight:800;font-size:18px;margin-bottom:10px;letter-spacing:0.04em;"> THE NEXCOINPR ADVANTAGE</div>
        <div style="color:#E2E8F0;font-size:17px;line-height:1.6;">
          • <strong>Fixed Pay-Per-Placement:</strong> 100% transparent pricing<br>
          • <strong>100% Publication Guarantee:</strong> Live link or full refund<br>
          • <strong>24 to 48 Hour Turnaround:</strong> Direct editorial desk access<br>
          • <strong>Permanent Dofollow Backlinks:</strong> Verified Google News indexing
        </div>
      </div>
    </div>`,
    callout: 'Pay only for verified results. Zero monthly retainers. Zero guesswork.',
    footerNote: null
  },
  // Slide 3: Single Media Placements & Transparent Costs
  {
    page: 3,
    series: 'FLAGSHIP OUTLETS',
    eyebrow: 'TRANSPARENT PRICING MATRIX',
    quoteMark: false,
    headline: 'Direct Access to Global Crypto & Financial Powerhouses.',
    bodyText: `<div style="display:flex;flex-direction:column;gap:14px;">
      <div style="background:#111827;border:1px solid rgba(201,168,76,0.25);border-radius:10px;padding:16px 22px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="color:#FFFFFF;font-weight:800;font-size:20px;">Cointelegraph</div>
          <div style="color:#94A3B8;font-size:15px;">DA 90 • Organic Editorial • 8M+ Monthly Web3 Readers</div>
        </div>
        <div style="text-align:right;">
          <div style="color:#F3D785;font-weight:800;font-size:24px;">$6,999</div>
          <div style="color:#22C55E;font-size:13px;font-weight:700;">Guaranteed Link</div>
        </div>
      </div>
      <div style="background:#111827;border:1px solid rgba(201,168,76,0.25);border-radius:10px;padding:16px 22px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="color:#FFFFFF;font-weight:800;font-size:20px;">CoinDesk</div>
          <div style="color:#94A3B8;font-size:15px;">The Gold Standard in Crypto Institutional Journalism</div>
        </div>
        <div style="text-align:right;">
          <div style="color:#F3D785;font-weight:800;font-size:24px;">$8,000</div>
          <div style="color:#22C55E;font-size:13px;font-weight:700;">Guaranteed Link</div>
        </div>
      </div>
      <div style="background:#111827;border:1px solid rgba(201,168,76,0.25);border-radius:10px;padding:16px 22px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="color:#FFFFFF;font-weight:800;font-size:20px;">Forbes</div>
          <div style="color:#94A3B8;font-size:15px;">Global Business Prestige &amp; Executive Authority</div>
        </div>
        <div style="text-align:right;">
          <div style="color:#F3D785;font-weight:800;font-size:24px;">$7,500</div>
          <div style="color:#22C55E;font-size:13px;font-weight:700;">Guaranteed Link</div>
        </div>
      </div>
      <div style="background:#111827;border:1px solid rgba(201,168,76,0.25);border-radius:10px;padding:16px 22px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="color:#FFFFFF;font-weight:800;font-size:20px;">Entrepreneur</div>
          <div style="color:#94A3B8;font-size:15px;">Full Editorial Feature • High Founder Credibility</div>
        </div>
        <div style="text-align:right;">
          <div style="color:#F3D785;font-weight:800;font-size:24px;">$8,500</div>
          <div style="color:#22C55E;font-size:13px;font-weight:700;">Guaranteed Link</div>
        </div>
      </div>
    </div>`,
    callout: 'Browse all 144 single media outlets live at nexcoinpr.agency/pricing',
    footerNote: null
  },
  // Slide 4: All-In-One Strategic Packages
  {
    page: 4,
    series: 'ALL-IN-ONE PACKAGES',
    eyebrow: 'MAXIMUM BUNDLED VALUE',
    quoteMark: false,
    headline: 'Pre-Engineered PR Packages for Explosive Growth.',
    bodyText: `<div style="display:flex;flex-direction:column;gap:16px;">
      <div style="background:#111827;border:1px solid rgba(201,168,76,0.25);border-radius:10px;padding:18px 22px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="color:#FFFFFF;font-weight:800;font-size:19px;">Web3 &amp; Crypto Starter</span>
          <span style="color:#F3D785;font-weight:800;font-size:20px;">$700 – $1,400</span>
        </div>
        <div style="color:#94A3B8;font-size:15px;line-height:1.5;">Targeted 5-to-10 outlet crypto distribution. Perfect for token presales, DEX listings, and rapid community momentum.</div>
      </div>
      <div style="background:#111827;border:1px solid rgba(201,168,76,0.25);border-radius:10px;padding:18px 22px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="color:#FFFFFF;font-weight:800;font-size:19px;">Financial Growth Surge</span>
          <span style="color:#F3D785;font-weight:800;font-size:20px;">$4,500</span>
        </div>
        <div style="color:#94A3B8;font-size:15px;line-height:1.5;">Multi-wire financial syndication across Yahoo Finance, Benzinga, AP News, MarketWatch, and high-DA fintech portals.</div>
      </div>
      <div style="background:linear-gradient(135deg,#131F33 0%,#0E1726 100%);border:1px solid rgba(201,168,76,0.4);border-radius:10px;padding:18px 22px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="color:#FBE285;font-weight:800;font-size:19px;">Global Authority Elite</span>
          <span style="color:#F3D785;font-weight:800;font-size:20px;">$12,000 – $20,000</span>
        </div>
        <div style="color:#CBD5E1;font-size:15px;line-height:1.5;">The ultimate Tier-1 market blitz. Direct organic editorial across Bloomberg, Cointelegraph, CoinDesk, Forbes, and global financial wires.</div>
      </div>
    </div>`,
    callout: 'Save up to 40% with bundled packages compared to individual single placements.',
    footerNote: null
  },
  // Slide 5: The 4 Ironclad Guarantees
  {
    page: 5,
    series: 'CLIENT PROTECTION',
    eyebrow: 'ZERO FINANCIAL RISK',
    quoteMark: false,
    headline: '4 Ironclad Guarantees Behind Every Single Campaign.',
    bodyText: `<div style="display:flex;flex-direction:column;gap:18px;color:#CBD5E1;">
      <div style="display:flex;align-items:flex-start;gap:14px;">
        <div style="background:#C9A84C;color:#0A1628;font-weight:800;font-size:15px;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">1</div>
        <div><strong style="color:#FFFFFF;font-size:19px;">100% Publication Guarantee</strong><br><span style="font-size:16px;color:#94A3B8;">If your editorial does not go live on the agreed outlet, you receive an immediate 100% refund. Zero risk.</span></div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:14px;">
        <div style="background:#C9A84C;color:#0A1628;font-weight:800;font-size:15px;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">2</div>
        <div><strong style="color:#FFFFFF;font-size:19px;">Permanent Dofollow Backlinks</strong><br><span style="font-size:16px;color:#94A3B8;">Articles remain live indefinitely, channeling high-DA link equity directly to your website to boost your Google search rank.</span></div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:14px;">
        <div style="background:#C9A84C;color:#0A1628;font-weight:800;font-size:15px;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">3</div>
        <div><strong style="color:#FFFFFF;font-size:19px;">Rapid 24 to 48 Hour Turnaround</strong><br><span style="font-size:16px;color:#94A3B8;">Crypto and financial markets move by the minute. Our established desks ensure swift turnaround without red tape.</span></div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:14px;">
        <div style="background:#C9A84C;color:#0A1628;font-weight:800;font-size:15px;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">4</div>
        <div><strong style="color:#FFFFFF;font-size:19px;">Financial Ghostwriting Included</strong><br><span style="font-size:16px;color:#94A3B8;">Don't have an article ready? Our experienced financial journalists draft, structure, and polish your narrative at no extra charge.</span></div>
      </div>
    </div>`,
    callout: 'Real PR accountability: You only invest when guaranteed publication is delivered.',
    footerNote: null
  },
  // Slide 6: Real Proven Case Studies
  {
    page: 6,
    series: 'PROVEN ROI',
    eyebrow: 'REAL CAMPAIGN RESULTS',
    quoteMark: false,
    headline: 'How Market Leaders Scaled With NexcoinPR.',
    bodyText: `<div style="display:flex;flex-direction:column;gap:16px;">
      <div style="background:#131B29;border:1px solid rgba(201,168,76,0.25);padding:18px 22px;border-radius:10px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="color:#F3D785;font-weight:800;font-size:18px;">DeFi Liquidity Protocol</span><span style="color:#22C55E;font-weight:800;font-size:18px;">+240% Volume Surge</span></div>
        <div style="font-size:15px;color:#CBD5E1;line-height:1.5;">Cointelegraph Feature + 8 Syndicated Crypto Portals drove $18M+ new TVL and top organic Google ranking within 72 hours of launch.</div>
      </div>
      <div style="background:#131B29;border:1px solid rgba(201,168,76,0.25);padding:18px 22px;border-radius:10px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="color:#F3D785;font-weight:800;font-size:18px;">Regulated Forex Brokerage</span><span style="color:#22C55E;font-weight:800;font-size:18px;">38 Institutional Leads</span></div>
        <div style="font-size:15px;color:#CBD5E1;line-height:1.5;">Forbes Council Editorial + Tier-1 Financial Wire generated 38 institutional partner inquiries and solidified European regulatory trust.</div>
      </div>
      <div style="background:#131B29;border:1px solid rgba(201,168,76,0.25);padding:18px 22px;border-radius:10px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="color:#F3D785;font-weight:800;font-size:18px;">\$BHAD Community Token</span><span style="color:#22C55E;font-weight:800;font-size:18px;">14.2M Impressions</span></div>
        <div style="font-size:15px;color:#CBD5E1;line-height:1.5;">Bloomberg, Cointelegraph &amp; Yahoo Finance distribution catalyzed global social viral pickup and secured Tier-1 CEX exchange listings.</div>
      </div>
    </div>`,
    callout: 'From viral token momentum to institutional broker credibility, we deliver measurable market authority.',
    footerNote: null
  },
  // Slide 7: Mobile App & Live Cloud Sync
  {
    page: 7,
    series: 'EXCLUSIVE TECH',
    eyebrow: 'TRANSPARENCY IN YOUR POCKET',
    quoteMark: false,
    headline: '144 Media Outlets & Live Pricing Inside Our Mobile App.',
    bodyText: `<div style="font-size:21px;line-height:1.6;color:#CBD5E1;margin-bottom:20px;">
      We eliminated the PR industry's closed-door pricing games with our official Android mobile application:
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:24px;color:#E2E8F0;font-size:18px;">
      <div style="display:flex;align-items:center;gap:10px;"><span style="color:#C9A84C;font-size:22px;">▸</span> <strong>Browse 144 Single Media Placements</strong> with exact costs</div>
      <div style="display:flex;align-items:center;gap:10px;"><span style="color:#C9A84C;font-size:22px;">▸</span> <strong>Compare 13 Strategic Packages</strong> ($700 to $20,000)</div>
      <div style="display:flex;align-items:center;gap:10px;"><span style="color:#C9A84C;font-size:22px;">▸</span> <strong>Live Cloud Sync:</strong> App updates live from site database</div>
      <div style="display:flex;align-items:center;gap:10px;"><span style="color:#C9A84C;font-size:22px;">▸</span> <strong>Official Android APK:</strong> Direct instant download</div>
    </div>
    <div style="background:#0F172A;border:1px solid rgba(201,168,76,0.3);padding:14px 20px;border-radius:8px;font-size:16px;color:#F3D785;">
      Download the APK free today: <strong>https://www.nexcoinpr.agency/app</strong>
    </div>`,
    callout: 'Check prices, plan budgets, and submit campaigns directly from your phone.',
    footerNote: null
  },
  // Slide 8: Closing Offer & Direct Call To Action
  {
    page: 8,
    series: 'CLAIM YOUR EDITORIAL',
    eyebrow: 'SPECIAL LINKEDIN OFFER',
    quoteMark: false,
    headline: 'Ready to Put Your Brand on the Front Page?',
    bodyText: `<div style="background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.35);border-radius:10px;padding:20px 24px;margin-bottom:22px;">
      <div style="color:#FBE285;font-weight:800;font-size:18px;margin-bottom:4px;letter-spacing:0.04em;">🎁 SPECIAL LINKEDIN ADVERTISER OFFER</div>
      <div style="color:#E2E8F0;font-size:16px;line-height:1.5;">
        Mention this <strong>LinkedIn Playbook</strong> to receive a <strong>Complimentary Editorial Narrative Review</strong> + <strong>Priority 24-Hour Drafting</strong> on your first campaign.
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:16px;font-size:20px;color:#E2E8F0;margin-bottom:20px;">
      <div><strong>1. Explore Live Media Matrix:</strong><br><span style="color:#C9A84C;font-size:17px;">https://www.nexcoinpr.agency/pricing</span></div>
      <div><strong>2. Download Official Android App:</strong><br><span style="color:#C9A84C;font-size:17px;">https://www.nexcoinpr.agency/app</span></div>
      <div><strong>3. Direct VIP Telegram Desk:</strong><br><span style="color:#C9A84C;font-size:17px;">@nexcoinpr (Instant Quote &amp; Editorial Consultation)</span></div>
    </div>`,
    callout: `<div style="display:flex;align-items:center;gap:18px;">
      <img src="data:image/svg+xml;base64,${FAVICON_B64}" width="56" height="56" style="border-radius:50%;box-shadow:0 0 16px rgba(201,168,76,0.45);flex-shrink:0;" alt="NexcoinPR">
      <div>
        <strong style="font-size:22px;color:#FFFFFF;display:block;margin-bottom:4px;">NexcoinPR Agency</strong>
        <div style="font-size:16px;color:#94A3B8;margin-bottom:4px;">The Premier Web3, Crypto &amp; Forex PR Partner</div>
        <div style="font-size:15px;color:#C9A84C;font-weight:600;">https://www.nexcoinpr.agency</div>
      </div>
    </div>`,
    footerNote: 'DM us on LinkedIn or email contact@nexcoinpr.agency to lock in your editorial slot.'
  }
];

function generateSlideHtml(slide) {
  return `
  <div class="slide" id="slide-${slide.page}">
    <!-- Header -->
    <div class="slide-header">
      <div class="series-tag">${slide.series}</div>
      <div class="page-counter">0${slide.page} / 08</div>
    </div>

    <!-- Main Content -->
    <div class="slide-content">
      <div class="eyebrow-container">
        <div class="eyebrow-dash"></div>
        <div class="eyebrow-text">${slide.eyebrow}</div>
      </div>

      ${slide.quoteMark ? '<div class="quote-mark">“</div>' : ''}

      <h1 class="headline">${slide.headline}</h1>

      <div class="body-text">${slide.bodyText}</div>

      ${slide.callout ? `
      <div class="callout-box">
        <div class="callout-bar"></div>
        <div class="callout-text">${slide.callout}</div>
      </div>` : ''}

      ${slide.footerNote ? `
      <div style="margin-top:20px;font-size:16px;color:#64748B;font-style:italic;">
        ${slide.footerNote}
      </div>` : ''}
    </div>

    <!-- Footer -->
    <div class="slide-footer">
      <div class="progress-container">
        ${renderProgressBars(slide.page, 8)}
      </div>
      <div class="brand-container">
        ${OFFICIAL_LOGO}
        <span class="brand-text">Nexcoin<span class="brand-gold">PR</span></span>
      </div>
    </div>
  </div>
  `;
}

// Generate the master multi-page HTML
const masterHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>The Web3 & Forex PR Playbook | NexcoinPR LinkedIn Book</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

    @page {
      size: 1080px 1350px;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background: #000000;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #FFFFFF;
      -webkit-font-smoothing: antialiased;
    }

    .slide {
      width: 1080px;
      height: 1350px;
      padding: 80px 85px;
      background: #0B0E14;
      background: radial-gradient(circle at 80% 20%, #111726 0%, #0B0E14 70%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      page-break-after: always;
      break-after: page;
    }

    .slide:last-child {
      page-break-after: avoid;
      break-after: avoid;
    }

    /* Ambient Corner Glow */
    .slide::before {
      content: '';
      position: absolute;
      top: -150px;
      right: -150px;
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, rgba(201, 168, 76, 0.08) 0%, transparent 70%);
      pointer-events: none;
    }

    /* Header */
    .slide-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .series-tag {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.18em;
      color: #64748B;
      text-transform: uppercase;
    }

    .page-counter {
      font-size: 16px;
      font-weight: 800;
      letter-spacing: 0.12em;
      color: #C9A84C;
    }

    /* Main Content */
    .slide-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 40px 0;
    }

    .eyebrow-container {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    .eyebrow-dash {
      width: 32px;
      height: 3px;
      background: #C9A84C;
      border-radius: 2px;
    }

    .eyebrow-text {
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 0.15em;
      color: #C9A84C;
      text-transform: uppercase;
    }

    .quote-mark {
      font-size: 110px;
      line-height: 0.7;
      color: rgba(201, 168, 76, 0.28);
      font-family: Georgia, serif;
      margin-bottom: 20px;
      user-select: none;
    }

    .headline {
      font-size: 42px;
      font-weight: 800;
      line-height: 1.25;
      color: #FFFFFF;
      letter-spacing: -0.025em;
      margin-bottom: 24px;
    }

    .body-text {
      font-size: 21px;
      line-height: 1.55;
      color: #94A3B8;
      font-weight: 400;
    }

    .body-text strong {
      color: #FFFFFF;
      font-weight: 600;
    }

    /* Callout Box */
    .callout-box {
      margin-top: 24px;
      background: #111724;
      border: 1px solid rgba(201, 168, 76, 0.22);
      border-radius: 10px;
      padding: 18px 24px;
      display: flex;
      align-items: flex-start;
      gap: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    .callout-bar {
      width: 4px;
      min-height: 44px;
      background: #C9A84C;
      border-radius: 2px;
      flex-shrink: 0;
    }

    .callout-text {
      font-size: 18px;
      line-height: 1.5;
      color: #E2E8F0;
      font-style: italic;
    }

    /* Footer */
    .slide-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .progress-container {
      display: flex;
      align-items: center;
    }

    .brand-container {
      display: flex;
      align-items: center;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .brand-text {
      color: #FFFFFF;
    }

    .brand-gold {
      color: #C9A84C;
    }
  </style>
</head>
<body>
  ${slidesData.map(s => generateSlideHtml(s)).join('\n')}
</body>
</html>`;

const masterHtmlPath = path.join(SCRATCH_DIR, 'linkedin_carousel_master.html');
fs.writeFileSync(masterHtmlPath, masterHtml, 'utf8');
console.log('Generated master HTML:', masterHtmlPath);

// Generate individual slide HTMLs for standalone screenshot rendering
slidesData.forEach(slide => {
  const singleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Slide ${slide.page}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #000; font-family: 'Inter', sans-serif; }
    .slide {
      width: 1080px; height: 1350px; padding: 80px 85px; background: #0B0E14;
      background: radial-gradient(circle at 80% 20%, #111726 0%, #0B0E14 70%);
      display: flex; flex-direction: column; justify-content: space-between;
      position: relative; overflow: hidden;
    }
    .slide::before { content: ''; position: absolute; top: -150px; right: -150px; width: 450px; height: 450px; background: radial-gradient(circle, rgba(201, 168, 76, 0.08) 0%, transparent 70%); pointer-events: none; }
    .slide-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
    .series-tag { font-size: 14px; font-weight: 700; letter-spacing: 0.18em; color: #64748B; text-transform: uppercase; }
    .page-counter { font-size: 16px; font-weight: 800; letter-spacing: 0.12em; color: #C9A84C; }
    .slide-content { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 40px 0; }
    .eyebrow-container { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
    .eyebrow-dash { width: 32px; height: 3px; background: #C9A84C; border-radius: 2px; }
    .eyebrow-text { font-size: 14px; font-weight: 800; letter-spacing: 0.15em; color: #C9A84C; text-transform: uppercase; }
    .quote-mark { font-size: 110px; line-height: 0.7; color: rgba(201, 168, 76, 0.28); font-family: Georgia, serif; margin-bottom: 20px; }
    .headline { font-size: 42px; font-weight: 800; line-height: 1.25; color: #FFFFFF; letter-spacing: -0.025em; margin-bottom: 24px; }
    .body-text { font-size: 21px; line-height: 1.55; color: #94A3B8; font-weight: 400; }
    .body-text strong { color: #FFFFFF; font-weight: 600; }
    .callout-box { margin-top: 24px; background: #111724; border: 1px solid rgba(201, 168, 76, 0.22); border-radius: 10px; padding: 18px 24px; display: flex; align-items: flex-start; gap: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    .callout-bar { width: 4px; min-height: 44px; background: #C9A84C; border-radius: 2px; flex-shrink: 0; }
    .callout-text { font-size: 18px; line-height: 1.5; color: #E2E8F0; font-style: italic; }
    .slide-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.06); }
    .progress-container { display: flex; align-items: center; }
    .brand-container { display: flex; align-items: center; font-size: 20px; font-weight: 800; letter-spacing: -0.02em; }
    .brand-text { color: #FFFFFF; }
    .brand-gold { color: #C9A84C; }
  </style>
</head>
<body>
  ${generateSlideHtml(slide)}
</body>
</html>`;
  fs.writeFileSync(path.join(SCRATCH_DIR, `slide_${slide.page}.html`), singleHtml, 'utf8');
});

// Compile Master PDF using Edge
const targetPdfPath = path.join(ASSETS_DOCS_DIR, 'NexcoinPR-LinkedIn-Carousel-Book.pdf');
const downloadsPdfPath = path.join(DOWNLOADS_DIR, 'NexcoinPR-LinkedIn-Carousel-Book.pdf');
const ARTIFACT_DIR = 'C:\\Users\\NDCOM\\.gemini\\antigravity\\brain\\45d74118-1c97-4e28-8316-86cea5814901';

console.log('Rendering 8-page PDF via Edge headless...');
try {
  execSync(`"${EDGE_PATH}" --headless=new --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${targetPdfPath}" --no-pdf-header-footer "file:///${masterHtmlPath.replace(/\\\\/g, '/')}"`, { stdio: 'inherit' });
  console.log('Successfully generated PDF:', targetPdfPath);
  fs.copyFileSync(targetPdfPath, downloadsPdfPath);
  console.log('Copied PDF to Downloads:', downloadsPdfPath);
  if (fs.existsSync(ARTIFACT_DIR)) {
    fs.copyFileSync(targetPdfPath, path.join(ARTIFACT_DIR, 'NexcoinPR-LinkedIn-Carousel-Book.pdf'));
    console.log('Copied PDF to Artifacts directory');
  }
} catch (e) {
  console.error('Error generating PDF:', e.message);
}

// Render individual slide PNG images
console.log('Rendering individual slide PNGs via Edge headless...');
slidesData.forEach(slide => {
  const singleHtmlPath = path.join(SCRATCH_DIR, `slide_${slide.page}.html`);
  const targetPngPath = path.join(ASSETS_CAROUSEL_DIR, `nexcoinpr-slide-${slide.page}.png`);
  const downloadsPngPath = path.join(DOWNLOADS_SLIDES_DIR, `nexcoinpr-slide-${slide.page}.png`);
  try {
    execSync(`"${EDGE_PATH}" --headless=new --disable-gpu --screenshot="${targetPngPath}" --window-size=1080,1350 --hide-scrollbars "file:///${singleHtmlPath.replace(/\\\\/g, '/')}"`, { stdio: 'inherit' });
    fs.copyFileSync(targetPngPath, downloadsPngPath);
    if (fs.existsSync(ARTIFACT_DIR)) {
      fs.copyFileSync(targetPngPath, path.join(ARTIFACT_DIR, `nexcoinpr-slide-${slide.page}.png`));
    }
    console.log(`Rendered slide ${slide.page}: ${targetPngPath}`);
  } catch (err) {
    console.warn(`Error rendering slide ${slide.page}:`, err.message);
  }
});

console.log('All PDF and slide PNG generation complete!');


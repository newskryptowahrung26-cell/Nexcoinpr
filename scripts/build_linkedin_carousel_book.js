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

// 8 Slides Data
const slidesData = [
  // Slide 1
  {
    page: 1,
    series: 'THE PR PLAYBOOK',
    eyebrow: 'THE UNTOLD REALITY',
    quoteMark: true,
    headline: '“We spent $5,000 on a wire distribution. Nobody covered us.”',
    bodyText: 'Logged as poor marketing ROI by executive teams.<br><br>Reported as an unfortunate quarter by the agency.<br><br>In reality, it was a distribution trap that 90% of Web3 and Forex founders walk into every single launch.',
    callout: null,
    footerNote: null
  },
  // Slide 2
  {
    page: 2,
    series: 'THE PR PLAYBOOK',
    eyebrow: 'THE CORE PROBLEM',
    quoteMark: false,
    headline: 'Syndication is not Coverage.',
    bodyText: 'Most legacy PR wires do not pitch active journalists or senior editors. Instead, they blast your release across automated RSS scrapers, empty affiliate blogs, and hidden corporate subdomains that receive zero human traffic.',
    callout: 'An empty subdomain with a no-index tag is not media presence. It is an expensive digital ghost town.',
    footerNote: null
  },
  // Slide 3
  {
    page: 3,
    series: 'THE PR PLAYBOOK',
    eyebrow: 'INSIDE THE NEWSROOM',
    quoteMark: false,
    headline: 'Crypto and financial editors receive 400+ pitches every morning.',
    bodyText: '95% of them are deleted within 3 seconds because they share the exact same fatal flaws:<br><br>• Corporate jargon with zero real market tension<br>• Empty claims unsupported by verified onchain data<br>• Self-congratulatory announcements that offer no reader value',
    callout: 'If your release reads like an internal company memo, an editor will not read past your first sentence.',
    footerNote: null
  },
  // Slide 4
  {
    page: 4,
    series: 'THE PR PLAYBOOK',
    eyebrow: 'THE STRATEGIC BLUEPRINT',
    quoteMark: false,
    headline: 'The 3 Laws of High-Impact Financial PR:',
    bodyText: `<div style="display:flex;flex-direction:column;gap:20px;">
      <div><strong style="color:#F3D785;font-size:22px;">01 / Anchor to Macro Market Tension</strong><br><span style="font-size:18px;color:#94A3B8;">Tie your product or token announcement to active macro narratives: regulatory shifts, yield dynamics, or institutional adoption.</span></div>
      <div><strong style="color:#F3D785;font-size:22px;">02 / Proprietary Data Commands Authority</strong><br><span style="font-size:18px;color:#94A3B8;">Editors do not quote promises. They quote proprietary research, liquidity depth benchmarks, and verified volume metrics.</span></div>
      <div><strong style="color:#F3D785;font-size:22px;">03 / Direct Desk Relationships Win</strong><br><span style="font-size:18px;color:#94A3B8;">Direct editorial desks guarantee high-tier syndication on CoinDesk, Bloomberg, Forbes & Cointelegraph.</span></div>
    </div>`,
    callout: null,
    footerNote: null
  },
  // Slide 5
  {
    page: 5,
    series: 'THE PR PLAYBOOK',
    eyebrow: 'PROVEN CASE STUDIES',
    quoteMark: false,
    headline: 'What Authentic Tier-1 Distribution Delivers:',
    bodyText: `<div style="display:flex;flex-direction:column;gap:18px;">
      <div style="background:#131B29;border:1px solid rgba(201,168,76,0.2);padding:18px 22px;border-radius:8px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="color:#F3D785;font-weight:700;font-size:18px;">LBank Exchange Study</span><span style="color:#C9A84C;font-weight:800;font-size:18px;">4.4x Liquidity Depth</span></div>
        <div style="font-size:16px;color:#94A3B8;">Order-book depth report syndicated across leading crypto publications, cementing institutional liquidity dominance.</div>
      </div>
      <div style="background:#131B29;border:1px solid rgba(201,168,76,0.2);padding:18px 22px;border-radius:8px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="color:#F3D785;font-weight:700;font-size:18px;">\$BHAD Meme Token</span><span style="color:#C9A84C;font-weight:800;font-size:18px;">14.2M Impressions</span></div>
        <div style="font-size:16px;color:#94A3B8;">Tier-1 placements across Bloomberg, Cointelegraph and Yahoo Finance driving top-tier exchange listings and community surge.</div>
      </div>
      <div style="background:#131B29;border:1px solid rgba(201,168,76,0.2);padding:18px 22px;border-radius:8px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="color:#F3D785;font-weight:700;font-size:18px;">Cregis Enterprise Growth</span><span style="color:#C9A84C;font-weight:800;font-size:18px;">\$4.2B Settlement</span></div>
        <div style="font-size:16px;color:#94A3B8;">Showcasing institutional Web3 MPC treasury adoption to traditional banking allocators across the Middle East.</div>
      </div>
    </div>`,
    callout: null,
    footerNote: null
  },
  // Slide 6
  {
    page: 6,
    series: 'THE PR PLAYBOOK',
    eyebrow: 'THE MEDIA NETWORK',
    quoteMark: false,
    headline: '140+ Direct Tier-1 Media Outlets. Zero Guesswork.',
    bodyText: `<div style="display:flex;flex-direction:column;gap:18px;font-size:20px;color:#CBD5E1;">
      <div style="display:flex;align-items:flex-start;gap:12px;">
        <span style="color:#C9A84C;font-size:24px;">✓</span>
        <div><strong style="color:#FFFFFF;">Guaranteed Placements:</strong> Direct publishing across Bloomberg, CoinDesk, Forbes, Cointelegraph, Benzinga, Decrypt, and 140+ crypto & forex outlets.</div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:12px;">
        <span style="color:#C9A84C;font-size:24px;">✓</span>
        <div><strong style="color:#FFFFFF;">24 to 48 Hour Turnaround:</strong> High-velocity editorial review, formatting, and live distribution without bureaucratic delays.</div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:12px;">
        <span style="color:#C9A84C;font-size:24px;">✓</span>
        <div><strong style="color:#FFFFFF;">Permanent Dofollow Authority:</strong> High-DA organic backlink equity and Google News indexing that cements multi-year search visibility.</div>
      </div>
    </div>`,
    callout: 'Real PR is not an expense. It is permanent enterprise equity.',
    footerNote: null
  },
  // Slide 7
  {
    page: 7,
    series: 'THE PR PLAYBOOK',
    eyebrow: 'COMPLETE TRANSPARENCY',
    quoteMark: false,
    headline: 'The Entire PR Media Matrix Inside a Mobile App.',
    bodyText: 'We believe PR pricing should be 100% transparent. No sales interrogation calls. No arbitrary markups.<br><br>• <strong>Browse 144 Single Media Placements</strong> with exact costs<br>• <strong>Compare 13 Authentic Packages</strong> ($700 to $20,000)<br>• <strong>Live Cloud Sync</strong> connects app directly to website data<br>• <strong>Official Android APK</strong> available for immediate direct download',
    callout: 'Know your exact publication costs and deliverables before spending a single dollar.',
    footerNote: null
  },
  // Slide 8
  {
    page: 8,
    series: 'THE PR PLAYBOOK',
    eyebrow: 'YOUR NEXT MOVE',
    quoteMark: false,
    headline: 'Ready to Turn Your Announcement into Real Authority?',
    bodyText: `<div style="display:flex;flex-direction:column;gap:20px;font-size:21px;color:#E2E8F0;">
      <div><strong>1. Explore our Live Pricing Matrix:</strong><br><span style="color:#C9A84C;font-size:18px;">nexcoinpr.agency/pricing</span></div>
      <div><strong>2. Download the Official Mobile App:</strong><br><span style="color:#C9A84C;font-size:18px;">nexcoinpr.agency/app</span></div>
      <div><strong>3. Submit Your Campaign:</strong><br><span style="color:#94A3B8;font-size:18px;">Fast 24-48h distribution across 140+ Tier-1 financial and Web3 outlets.</span></div>
    </div>`,
    callout: `<div style="display:flex;align-items:center;gap:18px;">
      <img src="data:image/svg+xml;base64,${FAVICON_B64}" width="54" height="54" style="border-radius:50%;box-shadow:0 0 16px rgba(201,168,76,0.45);flex-shrink:0;" alt="NexcoinPR">
      <div>
        <strong style="font-size:22px;color:#FFFFFF;display:block;margin-bottom:4px;">NexcoinPR Agency</strong>
        <div style="font-size:16px;color:#94A3B8;margin-bottom:4px;">The Premier Web3, Crypto &amp; Forex PR Partner</div>
        <div style="font-size:15px;color:#C9A84C;font-weight:600;">https://www.nexcoinpr.agency</div>
      </div>
    </div>`,
    footerNote: 'Save this post or share it with your marketing team.'
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
      font-size: 46px;
      font-weight: 800;
      line-height: 1.25;
      color: #FFFFFF;
      letter-spacing: -0.025em;
      margin-bottom: 28px;
    }

    .body-text {
      font-size: 23px;
      line-height: 1.6;
      color: #94A3B8;
      font-weight: 400;
    }

    .body-text strong {
      color: #FFFFFF;
      font-weight: 600;
    }

    /* Callout Box */
    .callout-box {
      margin-top: 36px;
      background: #111724;
      border: 1px solid rgba(201, 168, 76, 0.22);
      border-radius: 10px;
      padding: 24px 28px;
      display: flex;
      align-items: flex-start;
      gap: 18px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    .callout-bar {
      width: 4px;
      min-height: 48px;
      background: #C9A84C;
      border-radius: 2px;
      flex-shrink: 0;
    }

    .callout-text {
      font-size: 20px;
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
    .headline { font-size: 46px; font-weight: 800; line-height: 1.25; color: #FFFFFF; letter-spacing: -0.025em; margin-bottom: 28px; }
    .body-text { font-size: 23px; line-height: 1.6; color: #94A3B8; font-weight: 400; }
    .body-text strong { color: #FFFFFF; font-weight: 600; }
    .callout-box { margin-top: 36px; background: #111724; border: 1px solid rgba(201, 168, 76, 0.22); border-radius: 10px; padding: 24px 28px; display: flex; align-items: flex-start; gap: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    .callout-bar { width: 4px; min-height: 48px; background: #C9A84C; border-radius: 2px; flex-shrink: 0; }
    .callout-text { font-size: 20px; line-height: 1.5; color: #E2E8F0; font-style: italic; }
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


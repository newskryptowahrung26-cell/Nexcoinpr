const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const SCRATCH_DIR = path.join(ROOT_DIR, 'scratch', 'educational_carousel');
const ASSETS_DOCS_DIR = path.join(ROOT_DIR, 'assets', 'docs');
const ASSETS_CAROUSEL_DIR = path.join(ROOT_DIR, 'assets', 'images', 'carousel-educational');
const DOWNLOADS_DIR = 'C:\\Users\\NDCOM\\Downloads';
const DOWNLOADS_SLIDES_DIR = path.join(DOWNLOADS_DIR, 'NexcoinPR-LinkedIn-Educational-Slides');
const ARTIFACT_DIR = 'C:\\Users\\NDCOM\\.gemini\\antigravity\\brain\\45d74118-1c97-4e28-8316-86cea5814901';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

[SCRATCH_DIR, ASSETS_DOCS_DIR, ASSETS_CAROUSEL_DIR, DOWNLOADS_SLIDES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Logo setup
const FAVICON_PATH = path.join(ROOT_DIR, 'favicon.svg');
let FAVICON_B64 = '';
if (fs.existsSync(FAVICON_PATH)) {
  FAVICON_B64 = fs.readFileSync(FAVICON_PATH).toString('base64');
}
const OFFICIAL_LOGO = `<img src="data:image/svg+xml;base64,${FAVICON_B64}" width="36" height="36" style="border-radius:50%;display:inline-block;vertical-align:middle;margin-right:10px;box-shadow:0 2px 10px rgba(0,0,0,0.5), 0 0 12px rgba(201,168,76,0.35);" alt="NexcoinPR">`;

function renderProgressBars(activeIdx, total = 8) {
  let bars = '';
  for (let i = 1; i <= total; i++) {
    const isActive = i === activeIdx;
    bars += `<div style="height: 5px; border-radius: 3px; transition: all 0.3s; ${
      isActive ? 'width: 55px; background: #C9A84C; box-shadow: 0 0 10px rgba(201,168,76,0.6);' : 'width: 26px; background: #1E293B;'
    }"></div>`;
  }
  return `<div style="display: flex; gap: 8px; align-items: center;">${bars}</div>`;
}

// 8 Master Educational Slides
const slides = [
  // SLIDE 1: COVER
  {
    page: 1,
    series: '2026 INDUSTRY CHEAT SHEET',
    eyebrow: 'TIER-1 MEDIA PLAYBOOK',
    headline: 'How Top Web3 & Crypto Protocols Secure Tier-1 Media Coverage in 2026',
    subheadline: 'The exact framework to get featured on Bloomberg, CoinDesk, and Cointelegraph without burning $50,000 on PR agency retainers.',
    contentHtml: `
      <div style="background: linear-gradient(135deg, rgba(201,168,76,0.12), rgba(0,242,254,0.06)); border: 1px solid rgba(201,168,76,0.35); border-radius: 16px; padding: 26px 30px; margin: 30px 0;">
        <div style="color: #F3D785; font-size: 15px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; margin-bottom: 12px;">What Inside This Guide:</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 17px; color: #E2E8F0; font-weight: 600;">
          <div><span style="color:#00F2FE;">✔</span> Why 92% of PRs get rejected</div>
          <div><span style="color:#00F2FE;">✔</span> The 5-Point Editorial Rule</div>
          <div><span style="color:#00F2FE;">✔</span> 2026 Media Hierarchy Matrix</div>
          <div><span style="color:#00F2FE;">✔</span> Tier-1 Media vs KOL ROI</div>
          <div><span style="color:#00F2FE;">✔</span> 48-Hour Launch Timeline</div>
          <div><span style="color:#00F2FE;">✔</span> Free PR Headline Grader</div>
        </div>
      </div>
      <div style="display: flex; align-items: center; justify-content: space-between; background: #0F172A; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 18px 24px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="background: #10B981; color: #000; font-size: 11px; font-weight: 900; padding: 4px 10px; border-radius: 6px;">ACTIONABLE</div>
          <div style="color: #94A3B8; font-size: 15px;">Targeted for Founders, CMOs & Web3 Growth Leads</div>
        </div>
        <div style="color: #C9A84C; font-weight: 800; font-size: 16px;">Swipe &rarr;</div>
      </div>
    `
  },

  // SLIDE 2: THE PROBLEM (WHY 92% FAIL)
  {
    page: 2,
    series: 'EDITORIAL REALITY CHECK',
    eyebrow: 'COMMON PITFALLS',
    headline: 'Why 92% of Crypto Press Releases Get Rejected in 2026',
    subheadline: 'Financial journalists receive 400+ email pitches every morning. If you make any of these 3 mistakes, your email is deleted within 3 seconds.',
    contentHtml: `
      <div style="display: flex; flex-direction: column; gap: 16px; margin: 24px 0;">
        <div style="background: #0F172A; border-left: 5px solid #EF4444; border-radius: 12px; padding: 20px 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="color: #EF4444; font-size: 18px;">1. The "Hype Trap" Words</strong>
            <span style="background: rgba(239,68,68,0.15); color: #EF4444; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px;">AUTOMATED SPAM FILTER</span>
          </div>
          <div style="color: #CBD5E1; font-size: 15px; line-height: 1.5;">
            Using words like <em>"groundbreaking", "revolutionary", "game-changer", "unprecedented"</em> triggers editorial AI filters on Bloomberg, Reuters, and CoinDesk. They want objective news, not adjectives.
          </div>
        </div>

        <div style="background: #0F172A; border-left: 5px solid #F59E0B; border-radius: 12px; padding: 20px 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="color: #F59E0B; font-size: 18px;">2. Unbacked APY & Price Predictions</strong>
            <span style="background: rgba(245,158,11,0.15); color: #F59E0B; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px;">REGULATORY RED FLAG</span>
          </div>
          <div style="color: #CBD5E1; font-size: 15px; line-height: 1.5;">
            Tier-1 financial desks operate under strict SEC/ESMA compliance. Promising <em>"100x returns"</em> or unverified token yields results in an instant domain blacklist.
          </div>
        </div>

        <div style="background: #0F172A; border-left: 5px solid #3B82F6; border-radius: 12px; padding: 20px 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="color: #3B82F6; font-size: 18px;">3. The Cold Email Pitch Graveyard</strong>
            <span style="background: rgba(59,130,246,0.15); color: #3B82F6; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px;">0.4% RESPONSE RATE</span>
          </div>
          <div style="color: #CBD5E1; font-size: 15px; line-height: 1.5;">
            Cold-pitching editors via generic contact forms has an abysmal success rate. Tier-1 placement requires direct syndication wire agreements and institutional relationship desks.
          </div>
        </div>
      </div>
    `
  },

  // SLIDE 3: THE 5-POINT EDITORIAL FORMULA
  {
    page: 3,
    series: 'THE EDITORIAL STANDARD',
    eyebrow: 'PROVEN FRAMEWORK',
    headline: 'The 5-Point Press Release Formula That Actually Gets Published',
    subheadline: 'Follow this exact structural layout when drafting your next milestone release.',
    contentHtml: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 26px 0;">
        <div style="background: #0F172A; border: 1px solid rgba(0,242,254,0.25); border-radius: 12px; padding: 18px 20px;">
          <div style="color: #00F2FE; font-weight: 800; font-size: 16px; margin-bottom: 6px;">1. The Macro/Market Hook</div>
          <div style="color: #94A3B8; font-size: 14px; line-height: 1.45;">
            Anchor your announcement to a broader trend (e.g. <em>"Institutional RWA tokenization surges"</em> vs <em>"We launched a dApp"</em>).
          </div>
        </div>

        <div style="background: #0F172A; border: 1px solid rgba(201,168,76,0.25); border-radius: 12px; padding: 18px 20px;">
          <div style="color: #C9A84C; font-weight: 800; font-size: 16px; margin-bottom: 6px;">2. Hard Quantitative Proof</div>
          <div style="color: #94A3B8; font-size: 14px; line-height: 1.45;">
            Include verifiable numbers: $ Volume, active wallet count, TVL, audited smart contract hashes, or certified partner logos.
          </div>
        </div>

        <div style="background: #0F172A; border: 1px solid rgba(16,185,129,0.25); border-radius: 12px; padding: 18px 20px;">
          <div style="color: #10B981; font-weight: 800; font-size: 16px; margin-bottom: 6px;">3. Executive Strategic Quote</div>
          <div style="color: #94A3B8; font-size: 14px; line-height: 1.45;">
            A 2-sentence perspective from your Founder or CEO explaining <em>why this solves an industry bottleneck</em>.
          </div>
        </div>

        <div style="background: #0F172A; border: 1px solid rgba(168,85,247,0.25); border-radius: 12px; padding: 18px 20px;">
          <div style="color: #A855F7; font-weight: 800; font-size: 16px; margin-bottom: 6px;">4. Verified Issuer Identity</div>
          <div style="color: #94A3B8; font-size: 14px; line-height: 1.45;">
            Clean boilerplate, legal jurisdiction, and corporate email (<code>press@yourprotocol.com</code>, never a free Gmail).
          </div>
        </div>
      </div>
      <div style="background: #131E35; border: 1px solid #00F2FE; border-radius: 12px; padding: 16px 22px; display: flex; align-items: center; justify-content: space-between;">
        <span style="color: #FFFFFF; font-weight: 700; font-size: 15px;">5. Natural Link Architecture:</span>
        <span style="color: #00F2FE; font-size: 14px; font-weight: 600;">Max 1–2 clean canonical backlinks to avoid search spam flags</span>
      </div>
    `
  },

  // SLIDE 4: MEDIA HIERARCHY MATRIX
  {
    page: 4,
    series: 'MEDIA PLANNING MATRIX',
    eyebrow: '2026 LANDSCAPE',
    headline: 'The 2026 Crypto & Financial Media Hierarchy Matrix',
    subheadline: 'Not all media outlets serve the same purpose. Match your milestone to the right tier.',
    contentHtml: `
      <div style="display: flex; flex-direction: column; gap: 14px; margin: 24px 0;">
        <div style="background: #0F172A; border: 1px solid rgba(201,168,76,0.3); border-radius: 12px; padding: 18px 22px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="background: #C9A84C; color: #000; font-size: 11px; font-weight: 900; padding: 3px 8px; border-radius: 4px;">TIER 1 GLOBAL</span>
              <strong style="color: #FFFFFF; font-size: 17px;">Bloomberg Terminal • Yahoo Finance • MarketWatch</strong>
            </div>
            <span style="color: #C9A84C; font-size: 13px; font-weight: 700;">Institutional Scale</span>
          </div>
          <div style="color: #94A3B8; font-size: 14px; line-height: 1.45;">
            <strong>Target Audience:</strong> Venture capital funds, family offices, liquidity providers, institutional partners.<br>
            <strong>Best For:</strong> Funding rounds ($1M+), enterprise partnerships, regulated token launches, corporate M&A.
          </div>
        </div>

        <div style="background: #0F172A; border: 1px solid rgba(0,242,254,0.3); border-radius: 12px; padding: 18px 22px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="background: #00F2FE; color: #000; font-size: 11px; font-weight: 900; padding: 3px 8px; border-radius: 4px;">TIER 1 CRYPTO</span>
              <strong style="color: #FFFFFF; font-size: 17px;">CoinDesk • Cointelegraph • Decrypt • The Block</strong>
            </div>
            <span style="color: #00F2FE; font-size: 13px; font-weight: 700;">Web3 Authority</span>
          </div>
          <div style="color: #94A3B8; font-size: 14px; line-height: 1.45;">
            <strong>Target Audience:</strong> Active crypto traders, Web3 developers, DeFi yield farmers, DAO treasuries.<br>
            <strong>Best For:</strong> Mainnet releases, token listings, cross-chain bridge expansions, governance updates.
          </div>
        </div>

        <div style="background: #0F172A; border: 1px solid rgba(148,163,184,0.25); border-radius: 12px; padding: 18px 22px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="background: #64748B; color: #FFF; font-size: 11px; font-weight: 900; padding: 3px 8px; border-radius: 4px;">TIER 2 SYNDICATE</span>
              <strong style="color: #FFFFFF; font-size: 17px;">BeInCrypto • Bitcoin.com • CryptoSlate • 120+ Wires</strong>
            </div>
            <span style="color: #94A3B8; font-size: 13px; font-weight: 700;">Organic SEO</span>
          </div>
          <div style="color: #94A3B8; font-size: 14px; line-height: 1.45;">
            <strong>Target Audience:</strong> Retail community, Google News searchers, Telegram & Discord members.<br>
            <strong>Best For:</strong> High domain authority backlinks, community credibility, brand protection.
          </div>
        </div>
      </div>
    `
  },

  // SLIDE 5: PR VS TWITTER KOLS COMPARISON
  {
    page: 5,
    series: 'BUDGET EFFICIENCY',
    eyebrow: 'ROI BREAKDOWN',
    headline: 'Tier-1 PR vs. Twitter (X) Influencers: The 2026 Comparison',
    subheadline: 'Why smart founders allocate 60% of their marketing budget to earned PR instead of short-lived paid tweets.',
    contentHtml: `
      <div style="background: #0F172A; border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; overflow: hidden; margin: 26px 0;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 15px;">
          <thead>
            <tr style="background: #1E293B; color: #FFFFFF;">
              <th style="padding: 14px 18px;">Metric</th>
              <th style="padding: 14px 18px; color: #EF4444;">X (Twitter) KOLs</th>
              <th style="padding: 14px 18px; color: #10B981;">Tier-1 Media PR (NexcoinPR)</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
              <td style="padding: 14px 18px; color: #F3D785; font-weight: 700;">Lifespan</td>
              <td style="padding: 14px 18px; color: #94A3B8;">4 to 12 Hours (Buried in feed)</td>
              <td style="padding: 14px 18px; color: #FFFFFF; font-weight: 600;">Permanent (Indexed on Google forever)</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
              <td style="padding: 14px 18px; color: #F3D785; font-weight: 700;">Investor Trust</td>
              <td style="padding: 14px 18px; color: #94A3B8;">Low (Perceived as paid promotion)</td>
              <td style="padding: 14px 18px; color: #FFFFFF; font-weight: 600;">High (Independent 3rd-party journalism)</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
              <td style="padding: 14px 18px; color: #F3D785; font-weight: 700;">Exchange Listing</td>
              <td style="padding: 14px 18px; color: #94A3B8;">Zero weight with Binance/Coinbase</td>
              <td style="padding: 14px 18px; color: #FFFFFF; font-weight: 600;">Mandatory due diligence requirement</td>
            </tr>
            <tr>
              <td style="padding: 14px 18px; color: #F3D785; font-weight: 700;">Average Cost</td>
              <td style="padding: 14px 18px; color: #94A3B8;">$5,000 to $25,000 per post</td>
              <td style="padding: 14px 18px; color: #10B981; font-weight: 700;">$950 to $4,500 across 30–120+ outlets</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style="text-align: center; color: #CBD5E1; font-size: 15px; font-weight: 500;">
        💡 <em>Pro Tip: Use Tier-1 PR to build foundational trust first, then quote your Bloomberg coverage in influencer campaigns.</em>
      </div>
    `
  },

  // SLIDE 6: 48-HOUR LAUNCH PLAYBOOK
  {
    page: 6,
    series: 'TACTICAL EXECUTION',
    eyebrow: 'STEP-BY-STEP',
    headline: 'The 48-Hour Protocol Launch Timeline',
    subheadline: 'The synchronized execution workflow top crypto projects use on launch day.',
    contentHtml: `
      <div style="display: flex; flex-direction: column; gap: 14px; margin: 26px 0;">
        <div style="display: flex; gap: 16px; background: #0F172A; border-radius: 12px; padding: 16px 20px; align-items: flex-start;">
          <div style="background: #C9A84C; color: #000; font-weight: 900; font-size: 14px; padding: 6px 12px; border-radius: 8px; flex-shrink: 0;">T-48h</div>
          <div>
            <div style="color: #FFFFFF; font-weight: 700; font-size: 16px; margin-bottom: 4px;">Editorial Compliance & Grader Audit</div>
            <div style="color: #94A3B8; font-size: 14px; line-height: 1.45;">Run copy through NexcoinPR Free PR Grader. Strip hype words, verify smart contract audit links, and finalize quotes.</div>
          </div>
        </div>

        <div style="display: flex; gap: 16px; background: #0F172A; border-radius: 12px; padding: 16px 20px; align-items: flex-start;">
          <div style="background: #00F2FE; color: #000; font-weight: 900; font-size: 14px; padding: 6px 12px; border-radius: 8px; flex-shrink: 0;">T-24h</div>
          <div>
            <div style="color: #FFFFFF; font-weight: 700; font-size: 16px; margin-bottom: 4px;">Wire Embargo & Editorial Intake Lock-in</div>
            <div style="color: #94A3B8; font-size: 14px; line-height: 1.45;">Submit release to Bloomberg Terminal, Yahoo Finance, and crypto desks under embargo for synchronized delivery.</div>
          </div>
        </div>

        <div style="display: flex; gap: 16px; background: #0F172A; border: 1px solid #10B981; border-radius: 12px; padding: 16px 20px; align-items: flex-start;">
          <div style="background: #10B981; color: #000; font-weight: 900; font-size: 14px; padding: 6px 12px; border-radius: 8px; flex-shrink: 0;">HOUR 0</div>
          <div>
            <div style="color: #10B981; font-weight: 800; font-size: 16px; margin-bottom: 4px;">Synchronized Global Distribution Blast</div>
            <div style="color: #E2E8F0; font-size: 14px; line-height: 1.45;">Embargo lifts. Announcement publishes simultaneously across 350+ financial publications, RSS feeds, and Google News terminals.</div>
          </div>
        </div>

        <div style="display: flex; gap: 16px; background: #0F172A; border-radius: 12px; padding: 16px 20px; align-items: flex-start;">
          <div style="background: #A855F7; color: #FFF; font-weight: 900; font-size: 14px; padding: 6px 12px; border-radius: 8px; flex-shrink: 0;">T+24h</div>
          <div>
            <div style="color: #FFFFFF; font-weight: 700; font-size: 16px; margin-bottom: 4px;">Amplification & Institutional Outreach</div>
            <div style="color: #94A3B8; font-size: 14px; line-height: 1.45;">Pin live Bloomberg & CoinDesk links to X, Discord, Telegram, and attach verified clipping reports to exchange listing decks.</div>
          </div>
        </div>
      </div>
    `
  },

  // SLIDE 7: CASE STUDY
  {
    page: 7,
    series: 'PROVEN CASE STUDY',
    eyebrow: 'MEASURABLE RESULTS',
    headline: 'Real Impact: +147% Market Cap & 3M+ Audience in 1 Week',
    subheadline: 'How Aria Coin ($ARIA) turned an overlooked token announcement into an institutional trend.',
    contentHtml: `
      <div style="background: #0F172A; border: 1px solid rgba(201,168,76,0.3); border-radius: 16px; padding: 26px; margin: 26px 0;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 22px;">
          <div style="background: #131E35; padding: 18px; border-radius: 12px;">
            <div style="color: #94A3B8; font-size: 13px; text-transform: uppercase; font-weight: 700;">Challenge</div>
            <div style="color: #E2E8F0; font-size: 15px; margin-top: 6px; line-height: 1.45;">
              Strong technical architecture but low retail volume and skepticism from major exchanges due to lack of verified media coverage.
            </div>
          </div>
          <div style="background: #131E35; padding: 18px; border-radius: 12px;">
            <div style="color: #00F2FE; font-size: 13px; text-transform: uppercase; font-weight: 700;">NexcoinPR Strategy</div>
            <div style="color: #E2E8F0; font-size: 15px; margin-top: 6px; line-height: 1.45;">
              Guaranteed Cointelegraph Feature + 85-outlet financial wire syndication targeting liquidity and protocol security.
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; text-align: center;">
          <div style="background: #1E293B; padding: 16px; border-radius: 10px;">
            <div style="color: #C9A84C; font-size: 28px; font-weight: 900;">+147%</div>
            <div style="color: #94A3B8; font-size: 13px; font-weight: 600; margin-top: 4px;">Price Jump in 2h</div>
          </div>
          <div style="background: #1E293B; padding: 16px; border-radius: 10px;">
            <div style="color: #00F2FE; font-size: 28px; font-weight: 900;">3M+</div>
            <div style="color: #94A3B8; font-size: 13px; font-weight: 600; margin-top: 4px;">Audience Reach</div>
          </div>
          <div style="background: #1E293B; padding: 16px; border-radius: 10px;">
            <div style="color: #10B981; font-size: 28px; font-weight: 900;">5 Days</div>
            <div style="color: #94A3B8; font-size: 13px; font-weight: 600; margin-top: 4px;">Exchange Approval</div>
          </div>
        </div>
      </div>
      <div style="text-align: center; color: #94A3B8; font-size: 14px;">
        <em>Verified milestone documented on nexcoinpr.agency/case-studies.html</em>
      </div>
    `
  },

  // SLIDE 8: FREE PR GRADER CTA & CONTACT
  {
    page: 8,
    series: 'FREE DIAGNOSTIC TOOL',
    eyebrow: 'TAKE ACTION TODAY',
    headline: 'Audit Your Next Announcement for Free in 60 Seconds',
    subheadline: 'Don\'t risk getting ignored or blacklisted. Run your draft through our automated editorial scoring engine before you publish.',
    contentHtml: `
      <div style="background: linear-gradient(135deg, rgba(201,168,76,0.18), rgba(0,242,254,0.09)); border: 2px solid #C9A84C; border-radius: 18px; padding: 28px; margin: 26px 0; text-align: center;">
        <div style="display: inline-block; background: #C9A84C; color: #000; font-weight: 900; font-size: 13px; padding: 6px 14px; border-radius: 20px; margin-bottom: 14px;">100% FREE INTERACTIVE TOOL</div>
        <div style="color: #FFFFFF; font-size: 24px; font-weight: 900; margin-bottom: 10px;">NexcoinPR Free PR Grader</div>
        <div style="color: #CBD5E1; font-size: 15px; line-height: 1.5; max-width: 580px; margin: 0 auto 20px;">
          Calculates your Headline Strength, Tier-1 Compliance, Banned Words Check, and Backlink SEO Readiness instantly.
        </div>
        <div style="background: #0F172A; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 20px; display: inline-flex; align-items: center; gap: 10px;">
          <span style="color: #00F2FE; font-weight: 800; font-size: 17px;">👉 https://www.nexcoinpr.agency/free-pr-grader</span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 18px;">
        <div style="background: #0F172A; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; gap: 12px;">
          <div style="color: #10B981; font-size: 22px;">💬</div>
          <div>
            <div style="color: #94A3B8; font-size: 11px; text-transform: uppercase; font-weight: 700;">Direct WhatsApp Desk</div>
            <div style="color: #FFFFFF; font-weight: 700; font-size: 15px;">+971 58 202 1752</div>
          </div>
        </div>
        <div style="background: #0F172A; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; gap: 12px;">
          <div style="color: #00F2FE; font-size: 22px;">✈️</div>
          <div>
            <div style="color: #94A3B8; font-size: 11px; text-transform: uppercase; font-weight: 700;">Official Telegram Desk</div>
            <div style="color: #FFFFFF; font-weight: 700; font-size: 15px;">@Nexcoinpr</div>
          </div>
        </div>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #64748B; font-size: 13px; font-weight: 600;">
        🔖 Save this carousel to your bookmarks &amp; share with your Web3 founding team!
      </div>
    `
  }
];

function generateSlideHtml(slide) {
  return `
  <div class="slide-wrapper">
    <div class="slide-card">
      <div class="slide-header">
        <div class="series-tag">
          ${OFFICIAL_LOGO}
          <span>${slide.series}</span>
        </div>
        <div class="page-pill">SLIDE ${slide.page} / ${slides.length}</div>
      </div>

      <div class="slide-body">
        <div class="eyebrow">${slide.eyebrow}</div>
        <div class="headline">${slide.headline}</div>
        ${slide.subheadline ? `<div class="subheadline">${slide.subheadline}</div>` : ''}
        ${slide.contentHtml}
      </div>

      <div class="slide-footer">
        <div class="brand-container">
          <span class="brand-text">Nexcoin</span><span class="brand-gold">PR</span>
          <span style="color: #64748B; font-size: 13px; font-weight: 500; margin-left: 10px;">• nexcoinpr.agency</span>
        </div>
        <div class="progress-container">
          ${renderProgressBars(slide.page, slides.length)}
        </div>
      </div>
    </div>
  </div>`;
}

const masterHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The 2026 Web3 & Crypto PR Blueprint | NexcoinPR</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #030712;
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      color: #F8FAFC;
      -webkit-font-smoothing: antialiased;
    }
    @page {
      size: 1080px 1350px;
      margin: 0;
    }
    .slide-wrapper {
      width: 1080px;
      height: 1350px;
      padding: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      page-break-after: always;
      page-break-inside: avoid;
      background: #030712;
    }
    .slide-card {
      width: 1000px;
      height: 1270px;
      background: radial-gradient(circle at 85% 15%, #0B1930 0%, #050B17 65%, #030712 100%);
      border: 1px solid rgba(201, 168, 76, 0.28);
      border-radius: 28px;
      padding: 56px 64px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      box-shadow: 0 25px 60px rgba(0,0,0,0.85);
      overflow: hidden;
    }
    .slide-card::before {
      content: '';
      position: absolute;
      top: -150px;
      right: -150px;
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, transparent 70%);
      pointer-events: none;
    }
    .slide-card::after {
      content: '';
      position: absolute;
      bottom: -150px;
      left: -150px;
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, rgba(201, 168, 76, 0.12) 0%, transparent 70%);
      pointer-events: none;
    }
    .slide-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 22px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      position: relative;
      z-index: 2;
    }
    .series-tag {
      display: flex;
      align-items: center;
      color: #F3D785;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    .page-pill {
      background: #111B2C;
      border: 1px solid rgba(201, 168, 76, 0.35);
      color: #CBD5E1;
      font-size: 13px;
      font-weight: 800;
      padding: 6px 14px;
      border-radius: 20px;
    }
    .slide-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      z-index: 2;
      padding: 10px 0;
    }
    .eyebrow {
      color: #00F2FE;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .headline {
      font-size: 38px;
      font-weight: 900;
      line-height: 1.25;
      color: #FFFFFF;
      letter-spacing: -0.025em;
      margin-bottom: 12px;
    }
    .subheadline {
      font-size: 18px;
      line-height: 1.5;
      color: #94A3B8;
      font-weight: 500;
      margin-bottom: 8px;
    }
    .slide-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 22px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      position: relative;
      z-index: 2;
    }
    .brand-container {
      display: flex;
      align-items: center;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .brand-text { color: #FFFFFF; }
    .brand-gold { color: #C9A84C; }
  </style>
</head>
<body>
  ${slides.map(s => generateSlideHtml(s)).join('\n')}
</body>
</html>`;

const masterHtmlPath = path.join(SCRATCH_DIR, 'master_educational_carousel.html');
fs.writeFileSync(masterHtmlPath, masterHtml, 'utf8');

// Generate single slide HTML files
slides.forEach(slide => {
  const singleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Slide ${slide.page}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #030712;
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      color: #F8FAFC;
      width: 1080px;
      height: 1350px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .slide-wrapper { width: 1080px; height: 1350px; padding: 40px; display: flex; align-items: center; justify-content: center; }
    .slide-card {
      width: 1000px;
      height: 1270px;
      background: radial-gradient(circle at 85% 15%, #0B1930 0%, #050B17 65%, #030712 100%);
      border: 1px solid rgba(201, 168, 76, 0.28);
      border-radius: 28px;
      padding: 56px 64px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      box-shadow: 0 25px 60px rgba(0,0,0,0.85);
      overflow: hidden;
    }
    .slide-card::before {
      content: '';
      position: absolute;
      top: -150px;
      right: -150px;
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, transparent 70%);
      pointer-events: none;
    }
    .slide-card::after {
      content: '';
      position: absolute;
      bottom: -150px;
      left: -150px;
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, rgba(201, 168, 76, 0.12) 0%, transparent 70%);
      pointer-events: none;
    }
    .slide-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 22px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); position: relative; z-index: 2; }
    .series-tag { display: flex; align-items: center; color: #F3D785; font-size: 14px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; }
    .page-pill { background: #111B2C; border: 1px solid rgba(201, 168, 76, 0.35); color: #CBD5E1; font-size: 13px; font-weight: 800; padding: 6px 14px; border-radius: 20px; }
    .slide-body { flex: 1; display: flex; flex-direction: column; justify-content: center; position: relative; z-index: 2; padding: 10px 0; }
    .eyebrow { color: #00F2FE; font-size: 13px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; }
    .headline { font-size: 38px; font-weight: 900; line-height: 1.25; color: #FFFFFF; letter-spacing: -0.025em; margin-bottom: 12px; }
    .subheadline { font-size: 18px; line-height: 1.5; color: #94A3B8; font-weight: 500; margin-bottom: 8px; }
    .slide-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 22px; border-top: 1px solid rgba(255, 255, 255, 0.08); position: relative; z-index: 2; }
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

// 1. Compile Master PDF via Edge Headless
const targetPdfPath = path.join(ASSETS_DOCS_DIR, 'NexcoinPR-2026-Web3-PR-Blueprint.pdf');
const downloadsPdfPath = path.join(DOWNLOADS_DIR, 'NexcoinPR-2026-Web3-PR-Blueprint.pdf');

console.log('Rendering 8-page Educational Carousel PDF via Edge headless...');
try {
  execSync(`"${EDGE_PATH}" --headless=new --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${targetPdfPath}" --no-pdf-header-footer "file:///${masterHtmlPath.replace(/\\/g, '/')}"`, { stdio: 'inherit' });
  console.log('Successfully generated PDF:', targetPdfPath);
  fs.copyFileSync(targetPdfPath, downloadsPdfPath);
  console.log('Copied PDF to Downloads:', downloadsPdfPath);
  if (fs.existsSync(ARTIFACT_DIR)) {
    fs.copyFileSync(targetPdfPath, path.join(ARTIFACT_DIR, 'NexcoinPR-2026-Web3-PR-Blueprint.pdf'));
    console.log('Copied PDF to Artifacts directory');
  }
} catch (e) {
  console.error('Error generating PDF:', e.message);
}

// 2. Render Individual Slide PNGs
console.log('Rendering 8 individual high-resolution PNG slides...');
slides.forEach(slide => {
  const singleHtmlPath = path.join(SCRATCH_DIR, `slide_${slide.page}.html`);
  const targetPngPath = path.join(ASSETS_CAROUSEL_DIR, `slide-${slide.page}.png`);
  const downloadsPngPath = path.join(DOWNLOADS_SLIDES_DIR, `slide-${slide.page}.png`);
  try {
    execSync(`"${EDGE_PATH}" --headless=new --disable-gpu --screenshot="${targetPngPath}" --window-size=1080,1350 --hide-scrollbars "file:///${singleHtmlPath.replace(/\\/g, '/')}"`, { stdio: 'inherit' });
    fs.copyFileSync(targetPngPath, downloadsPngPath);
    if (fs.existsSync(ARTIFACT_DIR)) {
      fs.copyFileSync(targetPngPath, path.join(ARTIFACT_DIR, `nexcoinpr-educational-slide-${slide.page}.png`));
    }
    console.log(`Rendered Slide ${slide.page}: ${targetPngPath}`);
  } catch (err) {
    console.warn(`Error rendering slide ${slide.page}:`, err.message);
  }
});

console.log('All educational LinkedIn slides generated successfully!');

const fs = require('fs');
const path = require('path');

const WA_URL = "https://wa.me/971582021752?text=Hi%20NexcoinPR%20team%2C%20I%20am%20interested%20in%20Press%20Release%20Distribution%20for%20my%20project.%20Please%20share%20details%20and%20pricing.";
const WA_CLAIM_URL = "https://wa.me/971582021752?text=Hi%20NexcoinPR%20team%2C%20I%20would%20like%20to%20claim%20the%2020%25%20discount%20offer%20(Code%3A%20NEXCOIN20)%20for%20my%20press%20release.";

// 1. Update index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Add PR Grader to services dropdown if not present
if (!indexHtml.includes('/free-pr-grader.html')) {
  indexHtml = indexHtml.replace(
    '<li><a href="/press-release-distribution" class="dropdown-link">Press Release Distribution</a></li>',
    '<li><a href="/press-release-distribution" class="dropdown-link">Press Release Distribution</a></li>\n            <li><a href="/free-pr-grader.html" class="dropdown-link" style="color:#F3D785; font-weight:700;">★ Free PR Grader Tool</a></li>'
  );
  console.log('[index.html] Added Free PR Grader to services dropdown.');
}

// Add PR Grader in Hero CTAs if not present
if (!indexHtml.includes('hero-pr-grader-btn')) {
  indexHtml = indexHtml.replace(
    '<a href="/services" class="btn-secondary">View PR Services</a>',
    '<a href="/services" class="btn-secondary">View PR Services</a>\n            <a href="/free-pr-grader.html" class="btn-supporting hero-pr-grader-btn" style="display:inline-flex; align-items:center; gap:8px; border-color:#F3D785; color:#F3D785; font-weight:700;">★ Free PR Grader Tool</a>'
  );
  console.log('[index.html] Added Free PR Grader button to hero CTAs.');
}

// Add Verified Media Outlets Trust Section after Hero section if not present
const TRUST_SECTION = `
  <!-- ============================================================
       VERIFIED MEDIA SYNDICATION & COVERAGE PROOF
  ============================================================ -->
  <section class="section" style="padding: 40px 0; background: #071222; border-bottom: 1px solid rgba(201,168,76,0.18);" aria-label="Verified media syndication network">
    <div class="container">
      <div style="text-align: center; margin-bottom: 24px;">
        <p style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.14em; color: #C9A84C; font-weight: 700; margin: 0 0 6px;">Guaranteed Tier-1 Syndication Network</p>
        <h2 style="font-size: clamp(1.3rem, 2.8vw, 1.9rem); font-weight: 800; color: #FFFFFF; margin: 0;">Featured Across Global Financial &amp; Crypto Media</h2>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 16px; align-items: center; justify-content: center;">
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 18px 12px; text-align: center;">
          <strong style="color: #FFFFFF; font-size: 1.15rem; display: block; letter-spacing: -0.01em;">Bloomberg</strong>
          <span style="font-size: 0.72rem; color: #C9A84C; font-weight: 600; text-transform: uppercase;">Terminal &amp; Markets</span>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 18px 12px; text-align: center;">
          <strong style="color: #FFFFFF; font-size: 1.15rem; display: block; letter-spacing: -0.01em;">CoinDesk</strong>
          <span style="font-size: 0.72rem; color: #C9A84C; font-weight: 600; text-transform: uppercase;">Institutional Wire</span>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 18px 12px; text-align: center;">
          <strong style="color: #FFFFFF; font-size: 1.15rem; display: block; letter-spacing: -0.01em;">Cointelegraph</strong>
          <span style="font-size: 0.72rem; color: #C9A84C; font-weight: 600; text-transform: uppercase;">Top Web3 Readers</span>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 18px 12px; text-align: center;">
          <strong style="color: #FFFFFF; font-size: 1.15rem; display: block; letter-spacing: -0.01em;">Yahoo Finance</strong>
          <span style="font-size: 0.72rem; color: #C9A84C; font-weight: 600; text-transform: uppercase;">Investor Reach</span>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 18px 12px; text-align: center;">
          <strong style="color: #FFFFFF; font-size: 1.15rem; display: block; letter-spacing: -0.01em;">Benzinga</strong>
          <span style="font-size: 0.72rem; color: #C9A84C; font-weight: 600; text-transform: uppercase;">Fintech &amp; Trading</span>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 18px 12px; text-align: center;">
          <strong style="color: #FFFFFF; font-size: 1.15rem; display: block; letter-spacing: -0.01em;">MarketWatch</strong>
          <span style="font-size: 0.72rem; color: #C9A84C; font-weight: 600; text-transform: uppercase;">Dow Jones Network</span>
        </div>
      </div>

      <div style="margin-top: 24px; display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; font-size: 0.84rem; color: #CBD5E1;">
        <span><strong style="color: #10B981;">✓</strong> 100% Guaranteed Publication</span>
        <span><strong style="color: #10B981;">✓</strong> Permanent Dofollow SEO Backlinks</span>
        <span><strong style="color: #10B981;">✓</strong> Rapid 24–48h Turnaround</span>
        <span><strong style="color: #10B981;">✓</strong> Full Live Syndication Report</span>
      </div>
    </div>
  </section>
`;

if (!indexHtml.includes('Guaranteed Tier-1 Syndication Network')) {
  indexHtml = indexHtml.replace('</section>\n\n  <!-- ============================================================\n       SECTION 2, WHAT NEXCOINPR DOES', '</section>\n' + TRUST_SECTION + '\n  <!-- ============================================================\n       SECTION 2, WHAT NEXCOINPR DOES');
  console.log('[index.html] Added Verified Media Trust Section.');
}

// Update WhatsApp URLs
indexHtml = indexHtml.replace(/href="https:\/\/wa\.me\/971582021752"/g, `href="${WA_URL}"`);
indexHtml = indexHtml.replace(/href="https:\/\/wa\.me\/971582021752\?text=Hi%20NexcoinPR%20team%2C%20I%20would%20like%20to%20claim/g, `href="${WA_CLAIM_URL}`);

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('Successfully enhanced index.html');

// 2. Enhance pricing.html
let pricingHtml = fs.readFileSync('pricing.html', 'utf8');
if (!pricingHtml.includes('/free-pr-grader.html')) {
  pricingHtml = pricingHtml.replace(
    '<li><a href="/press-release-distribution" class="dropdown-link">Press Release Distribution</a></li>',
    '<li><a href="/press-release-distribution" class="dropdown-link">Press Release Distribution</a></li>\n            <li><a href="/free-pr-grader.html" class="dropdown-link" style="color:#F3D785; font-weight:700;">★ Free PR Grader Tool</a></li>'
  );
}

// Add promo notice on pricing.html if not present
const PRICING_PROMO = `
    <!-- 20% DISCOUNT OFFER BANNER -->
    <div style="background: linear-gradient(135deg, #102A54 0%, #0A1628 100%); border: 1.5px solid #C9A84C; border-radius: 12px; padding: 24px 28px; margin: 0 auto 36px; max-width: 900px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.35);">
      <span style="background: #C9A84C; color: #0A1628; font-weight: 800; font-size: 0.76rem; padding: 3px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em; display: inline-block; margin-bottom: 8px;">Exclusive Client Promotion</span>
      <h3 style="color: #FFFFFF; font-size: 1.35rem; margin: 0 0 8px; font-weight: 800;">Get 20% Off Any Press Release Package — Use Promo Code <span style="color: #F3D785;">NEXCOIN20</span></h3>
      <p style="color: #CBD5E1; font-size: 0.92rem; margin: 0 0 16px; line-height: 1.5;">Mention code <strong>NEXCOIN20</strong> when booking or chatting with our media specialists to instantly apply your discount.</p>
      <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
        <a href="${WA_CLAIM_URL}" target="_blank" rel="noopener noreferrer" style="background: #25D366; color: #FFFFFF; font-weight: 700; font-size: 0.9rem; padding: 10px 20px; border-radius: 6px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">Claim 20% Discount on WhatsApp &rarr;</a>
        <a href="/free-pr-grader.html" style="background: transparent; color: #F3D785; border: 1.5px solid #C9A84C; font-weight: 700; font-size: 0.9rem; padding: 10px 20px; border-radius: 6px; text-decoration: none;">Grade PR Draft First &rarr;</a>
      </div>
    </div>
`;

if (!pricingHtml.includes('Exclusive Client Promotion') && pricingHtml.includes('<main id="main-content">')) {
  pricingHtml = pricingHtml.replace('<main id="main-content">', '<main id="main-content">\n' + PRICING_PROMO);
  console.log('[pricing.html] Added 20% promo offer box.');
}

pricingHtml = pricingHtml.replace(/href="https:\/\/wa\.me\/971582021752"/g, `href="${WA_URL}"`);
fs.writeFileSync('pricing.html', pricingHtml, 'utf8');
console.log('Successfully enhanced pricing.html');

console.log('All conversion and trust enhancements successfully applied.');

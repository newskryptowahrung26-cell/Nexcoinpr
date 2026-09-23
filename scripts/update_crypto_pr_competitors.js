const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'crypto-pr.html');
let content = fs.readFileSync(filePath, 'utf8');

// Update meta keywords
const oldKeywords = 'name="keywords" content="crypto pr agency, best crypto pr agency';
const newKeywords = 'name="keywords" content="crypto pr agency, chainwire alternative, chainwire review, marketacross alternative, finpr alternative, coinscribble alternative, blockchain wire alternative, pr newswire for crypto, best crypto pr agency';

if (content.includes(oldKeywords)) {
  content = content.replace(oldKeywords, newKeywords);
}

// Add competitor comparison section before compliance fortress
const targetSection = '<!-- ══ REGULATORY COMPLIANCE FORTRESS ═════════════════════ -->';
const competitorSection = `<!-- ══ COMPETITIVE COMPARISON: NEXCOINPR VS CHAINWIRE, MARKETACROSS & FINPR ═ -->
    <section class="section-light section" id="competitor-comparison">
      <div class="container">
        <div class="section-heading center">
          <span class="eyebrow">Industry Comparison</span>
          <h2>Why Web3 Leaders Choose NexcoinPR Over Retainers and Wire Networks</h2>
          <p style="max-width: 860px; margin-inline: auto;">Compare how NexcoinPR's guaranteed publication model outperforms expensive monthly retainer agencies (MarketAcross, FINPR), automated wire platforms (Chainwire, Coinscribble), and legacy corporate newswires (PR Newswire, Business Wire).</p>
        </div>

        <div class="table-responsive" style="margin-top: var(--space-8);">
          <table class="data-table">
            <thead>
              <tr>
                <th>Feature / Capability</th>
                <th>NexcoinPR</th>
                <th>Chainwire</th>
                <th>MarketAcross</th>
                <th>FINPR</th>
                <th>PR Newswire (Cision)</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: rgba(201, 168, 76, 0.08); font-weight: 600;">
                <td><strong>Operational Model</strong></td>
                <td>Guaranteed Wire &amp; Direct Desks</td>
                <td>Automated Crypto Newswire</td>
                <td>Full-Service Agency Retainer</td>
                <td>Hybrid PR &amp; Marketing Agency</td>
                <td>Legacy Corporate Wire</td>
              </tr>
              <tr>
                <td><strong>Tier-1 Outlets Guaranteed</strong></td>
                <td><strong>100% Guaranteed</strong> (Cointelegraph, The Block, Decrypt)</td>
                <td>Requires expensive custom add-ons</td>
                <td>No (Organic pitching only)</td>
                <td>Select bundled packages only</td>
                <td><strong>0% Pickup</strong> (Zero Tier-1 crypto media)</td>
              </tr>
              <tr>
                <td><strong>Pricing Transparency</strong></td>
                <td><strong>Flat-Rate</strong> ($800 – $8,300)</td>
                <td>$1,399 – $3,199+ per wire</td>
                <td>$15,000 – $30,000/mo (3–6 mo lock-in)</td>
                <td>$2,500 – $10,000+ packages</td>
                <td>$1,500 – $3,500+ (High per-word fees)</td>
              </tr>
              <tr>
                <td><strong>SEO Backlink Status</strong></td>
                <td><strong>Permanent Dofollow</strong> on DA 75–92 outlets</td>
                <td>Mixed / often nofollow on affiliates</td>
                <td>Editorial dependent (often unlinked)</td>
                <td>Mixed depending on outlet agreement</td>
                <td><strong>Strictly Nofollow</strong></td>
              </tr>
              <tr>
                <td><strong>Wall Street Syndication</strong></td>
                <td><strong>Included</strong> (Benzinga, AP News, Yahoo Finance)</td>
                <td>Limited / extra fees</td>
                <td>Requires custom pitch outreach</td>
                <td>Limited</td>
                <td>Yes (Mainstream TradFi only)</td>
              </tr>
              <tr>
                <td><strong>Turnaround Time</strong></td>
                <td><strong>24–48 Hours</strong> standard</td>
                <td>24–72 Hours</td>
                <td>4 to 8 Weeks</td>
                <td>3 to 7 Days</td>
                <td>24 Hours</td>
              </tr>
              <tr>
                <td><strong>MiCA &amp; SEC Legal Proofing</strong></td>
                <td><strong>Included free</strong> with every campaign</td>
                <td>Automated keyword filter</td>
                <td>Included in retainer</td>
                <td>Included in custom campaigns</td>
                <td>Strict corporate scrutiny</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="grid-3" style="margin-top: var(--space-8);">
          <div class="card" style="background: white; border: 1px solid var(--color-border-light);">
            <h4 style="color: var(--color-navy); margin-bottom: 0.5rem;">NexcoinPR vs. Chainwire</h4>
            <p style="font-size: 0.88rem; color: var(--color-text-secondary); line-height: 1.6; margin: 0;">While Chainwire automates submissions across partner blogs, NexcoinPR combines wide wire syndication with direct, guaranteed editorial placements on Cointelegraph, The Block, and Decrypt, plus mainstream Wall Street financial syndication.</p>
          </div>
          <div class="card" style="background: white; border: 1px solid var(--color-border-light);">
            <h4 style="color: var(--color-navy); margin-bottom: 0.5rem;">NexcoinPR vs. MarketAcross</h4>
            <p style="font-size: 0.88rem; color: var(--color-text-secondary); line-height: 1.6; margin: 0;">MarketAcross demands $15,000 to $30,000/month retainers with no guaranteed media coverage. NexcoinPR eliminates the retainer trap with transparent, deliverable-backed pricing from $800 to $8,300 with 100% guaranteed publishing results.</p>
          </div>
          <div class="card" style="background: white; border: 1px solid var(--color-border-light);">
            <h4 style="color: var(--color-navy); margin-bottom: 0.5rem;">NexcoinPR vs. FINPR &amp; Coinscribble</h4>
            <p style="font-size: 0.88rem; color: var(--color-text-secondary); line-height: 1.6; margin: 0;">Unlike budget self-service tools like Coinscribble or mixed marketing agencies like FINPR, NexcoinPR provides dedicated senior financial journalists, compliance vetting, and guaranteed dofollow link equity on top-tier publications.</p>
          </div>
        </div>
      </div>
    </section>

    `;

if (content.includes(targetSection) && !content.includes('id="competitor-comparison"')) {
  content = content.replace(targetSection, competitorSection + targetSection);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully added competitor comparison section to crypto-pr.html');
} else {
  console.log('Target section not found or competitor comparison already exists in crypto-pr.html');
}

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// Common components helper
function getHeader(activeLink = 'guides') {
  return `  <!-- ══ HEADER ══════════════════════════════════════════════ -->
  <header class="site-header" id="site-header">
    <div class="container">
      <nav class="nav-bar" aria-label="Main navigation">
        <a href="/" class="nav-logo" aria-label="NexcoinPR home">
          <img src="/favicon.svg" alt="NexcoinPR" width="32" height="32" class="nav-logo-icon">
          <span class="logo-text">Nexcoin<span class="logo-accent">PR</span></span>
        </a>
        <ul class="nav-menu" id="nav-menu" role="list">
          <li><a href="/" class="nav-link">Home</a></li>
          <li class="nav-item-dropdown">
            <button class="nav-link nav-dropdown-btn" aria-expanded="false" aria-haspopup="true">Services <span class="dropdown-arrow">▾</span></button>
            <ul class="dropdown-menu" role="list">
              <li><a href="/crypto-pr.html" class="dropdown-link">Crypto PR</a></li>
              <li><a href="/forex-pr.html" class="dropdown-link">Forex PR</a></li>
              <li><a href="/blockchain-pr.html" class="dropdown-link">Blockchain PR</a></li>
              <li><a href="/web3-pr.html" class="dropdown-link">Web3 PR</a></li>
              <li><a href="/fintech-pr.html" class="dropdown-link">Fintech PR</a></li>
              <li><a href="/financial-pr.html" class="dropdown-link">Financial PR</a></li>
              <li><a href="/press-release-distribution.html" class="dropdown-link">Press Release Distribution</a></li>
            </ul>
          </li>
          <li><a href="/press-releases.html" class="nav-link">Press Releases</a></li>
          <li class="nav-item-dropdown">
            <button class="nav-link nav-dropdown-btn active" aria-expanded="false" aria-haspopup="true">News <span class="dropdown-arrow">▾</span></button>
            <ul class="dropdown-menu" role="list">
              <li><a href="/news.html" class="dropdown-link">All News</a></li>
              <li><a href="/news/crypto.html" class="dropdown-link">Crypto</a></li>
              <li><a href="/news/forex.html" class="dropdown-link">Forex</a></li>
              <li><a href="/news/blockchain.html" class="dropdown-link">Blockchain</a></li>
              <li><a href="/news/guides.html" class="dropdown-link active">Guides</a></li>
            </ul>
          </li>
          <li><a href="/pricing.html" class="nav-link">Pricing</a></li>
          <li><a href="/media.html" class="nav-link">Media</a></li>
          <li><a href="/about.html" class="nav-link">About</a></li>
          <li><a href="/contact.html" class="nav-link">Contact</a></li>
        </ul>
        <a href="/press-release-distribution.html" class="btn-primary nav-cta">Submit Press Release</a>
        <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Open menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </nav>
    </div>
  </header>`;
}

function getFooter() {
  return `  <!-- ══ FOOTER ══════════════════════════════════════════════ -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="/" class="footer-logo" aria-label="NexcoinPR home"><img src="/favicon.svg" alt="NexcoinPR" width="28" height="28" style="margin-right: 9px; vertical-align: middle;">Nexcoin<span class="logo-accent">PR</span></a>
          <p class="footer-tagline">Premium Crypto, Forex &amp; Financial PR and press release distribution for blockchain, Web3, fintech, and digital asset leaders.</p>
          <p class="footer-disclaimer-mini">NexcoinPR is an international public relations and media syndication agency. Press releases and editorial content published on this site do not constitute investment, financial, or trading advice.</p>
        </div>
        <div class="footer-col">
          <h3 class="footer-heading">Company</h3>
          <ul class="footer-links">
            <li><a href="/about.html">About NexcoinPR</a></li>
            <li><a href="/contact.html">Contact Us</a></li>
            <li><a href="/case-studies.html">Case Studies</a></li>
            <li><a href="/media.html">Media Network</a></li>
            <li><a href="/authors.html">Authors &amp; Contributors</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3 class="footer-heading">Services</h3>
          <ul class="footer-links">
            <li><a href="/crypto-pr.html">Crypto PR Agency</a></li>
            <li><a href="/forex-pr.html">Forex PR Services</a></li>
            <li><a href="/blockchain-pr.html">Blockchain PR</a></li>
            <li><a href="/web3-pr.html">Web3 Public Relations</a></li>
            <li><a href="/fintech-pr.html">Fintech PR</a></li>
            <li><a href="/financial-pr.html">Financial PR</a></li>
            <li><a href="/press-release-distribution.html">PR Distribution</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3 class="footer-heading">Content Hub</h3>
          <ul class="footer-links">
            <li><a href="/news.html">All News</a></li>
            <li><a href="/press-releases.html">Press Releases</a></li>
            <li><a href="/news/guides.html">Educational Guides</a></li>
            <li><a href="/news/crypto.html">Crypto News</a></li>
            <li><a href="/news/forex.html">Forex News</a></li>
            <li><a href="/glossary.html">Web3 Glossary</a></li>
            <li><a href="/companies.html">Company Directory</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3 class="footer-heading">Trust &amp; Legal</h3>
          <ul class="footer-links">
            <li><a href="/editorial-policy.html">Editorial Policy</a></li>
            <li><a href="/corrections-policy.html">Corrections Policy</a></li>
            <li><a href="/disclaimer.html">Disclaimer</a></li>
            <li><a href="/privacy-policy.html">Privacy Policy</a></li>
            <li><a href="/terms.html">Terms &amp; Conditions</a></li>
            <li><a href="/cookie-policy.html">Cookie Policy</a></li>
            <li><a href="/faq.html">FAQ</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-copy">&copy; <span id="footer-year">2026</span> NexcoinPR. All rights reserved.</p>
        <p class="footer-legal">NexcoinPR provides professional PR and media distribution services. We do not provide financial, investment or trading advice. Content published on this site does not constitute financial, investment or trading advice.</p>
      </div>
    </div>
  </footer>

  <div class="cookie-banner" id="cookie-banner" role="dialog" aria-label="Cookie consent" hidden>
    <div class="cookie-content">
      <p>We use cookies to improve your experience. See our <a href="/cookie-policy.html">Cookie Policy</a>.</p>
      <div class="cookie-actions">
        <button class="btn-primary cookie-accept" id="cookie-accept">Accept</button>
        <button class="btn-ghost cookie-reject" id="cookie-reject">Reject</button>
      </div>
    </div>
  </div>
  <script src="/assets/js/main.js" defer></script>`;
}

function getSidebar() {
  return `          <aside class="sidebar-col">
            <div class="card card-dark" style="position: sticky; top: 96px; text-align: center;">
              <span class="badge badge-gold" style="margin-bottom: 0.5rem; display: inline-block;">Guaranteed Distribution</span>
              <h3 class="text-white" style="margin-top: 0.25rem;">Deploy Your Crypto PR Campaign</h3>
              <p class="text-white" style="opacity: 0.85; font-size: 0.95rem; line-height: 1.6; text-align: center;">Broadcast your announcement across Cointelegraph, The Block, Decrypt, and 140+ verified crypto newsrooms with 100% guaranteed publishing.</p>
              
              <div style="background: rgba(255,255,255,0.06); border-radius: var(--radius-sm); padding: 1rem; margin: 1.25rem 0; text-align: left;">
                <div style="font-size: 0.85rem; color: var(--color-gold); font-weight: 600; margin-bottom: 0.5rem;">Why NexcoinPR vs Retainers:</div>
                <ul style="font-size: 0.85rem; color: #E2E8F0; padding-left: 1.2rem; margin: 0; line-height: 1.6;">
                  <li>100% Guaranteed media deliverables</li>
                  <li>No $15k/mo retainer lock-ins</li>
                  <li>Permanent dofollow SEO backlinks</li>
                  <li>Fast 24–48h publishing turnaround</li>
                  <li>MiCA &amp; SEC compliance vetting</li>
                </ul>
              </div>

              <div class="sidebar-pricing-callout" style="margin-bottom: 1.25rem; text-align: center;">
                <span style="font-size: 0.85rem; color: #94A3B8;">Packages starting from</span>
                <div style="font-size: 2rem; font-weight: 800; color: #FFFFFF;">$800 <span style="font-size: 0.9rem; font-weight: 400; color: #94A3B8;">/ flat</span></div>
              </div>

              <a href="/press-release-distribution.html" class="btn-primary" style="width: 100%; text-align: center; justify-content: center; display: inline-flex;">Submit Press Release</a>
              <a href="/pricing.html" class="btn-secondary" style="width: 100%; text-align: center; justify-content: center; display: inline-flex; margin-top: 0.75rem; border-color: rgba(255,255,255,0.2); color: #FFFFFF;">View All 144+ Outlets &amp; Rates</a>

              <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.12); margin: 1.5rem 0;">

              <div style="text-align: left;">
                <h4 class="text-white" style="font-size: 0.95rem; margin-bottom: 0.75rem;">Related PR Guides</h4>
                <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.88rem; line-height: 1.8;">
                  <li><a href="/news/guides/what-is-crypto-pr.html" class="text-gold" style="text-decoration: none;">&rarr; What Is Crypto PR? Master Guide</a></li>
                  <li><a href="/news/guides/how-to-write-a-crypto-press-release.html" class="text-gold" style="text-decoration: none;">&rarr; How to Write a Crypto PR (Templates)</a></li>
                  <li><a href="/news/guides/how-press-release-distribution-works.html" class="text-gold" style="text-decoration: none;">&rarr; How PR Distribution Works</a></li>
                  <li><a href="/news/guides/what-is-forex-pr.html" class="text-gold" style="text-decoration: none;">&rarr; What Is Forex PR? Broker Playbook</a></li>
                </ul>
              </div>
            </div>
          </aside>`;
}

module.exports = { rootDir, getHeader, getFooter, getSidebar };

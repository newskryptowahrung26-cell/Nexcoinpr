const fs = require('fs');
const path = require('path');
const { BASE_DIR, pageTemplate } = require('./templates');

// Data structures for all packages
const packages5A = [
  {
    name: "ELITE: A",
    category: "5-media",
    price: "$20,000",
    traffic: "22M+ Monthly Traffic",
    featured: true,
    badge: "Highest Authority",
    pubs: ["CoinTelegraph", "Coindesk.com", "TheBlock.co", "Beincrypto.com", "Watcher.guru"],
    desc: "Top-tier Tier-1 global crypto media powerhouse package for major protocol launches, institutional milestones, and headline crypto news."
  },
  {
    name: "SUPERIOR: A",
    category: "5-media",
    price: "$2,800",
    traffic: "8M+ Monthly Traffic",
    featured: false,
    badge: "High Growth",
    pubs: ["Cryptopolitan.com", "Crypto.news", "Bitcoinist.com", "Hackernoon", "Business Insider, AP, Benzinga, MarketWatch syndication"],
    desc: "Targeted coverage across prominent crypto news websites and premier mainstream financial wire channels."
  },
  {
    name: "BASIC: A",
    category: "5-media",
    price: "$1,100",
    traffic: "1M+ Monthly Traffic",
    featured: false,
    badge: "Budget Friendly",
    pubs: ["Blockonomi", "Techbullion", "Publish0x", "Coinjournal.net", "Bitcoin Insider"],
    desc: "Essential starter visibility for token updates, feature enhancements, and early-stage blockchain announcements."
  }
];

const packages5B = [
  {
    name: "ELITE: B",
    category: "5-media",
    price: "$11,000",
    traffic: "15M+ Monthly Traffic",
    featured: true,
    badge: "Tier-1 Impact",
    pubs: ["CoinTelegraph", "Beincrypto.com", "Bitcoin.com", "AMBCrypto.com", "Business Insider, AP, Benzinga, MarketWatch syndication"],
    desc: "Commanding reach pairing CoinTelegraph and Bitcoin.com with global financial syndication."
  },
  {
    name: "SUPERIOR: B",
    category: "5-media",
    price: "$2,650",
    traffic: "7M+ Monthly Traffic",
    featured: false,
    badge: "Ecosystem Builder",
    pubs: ["Crypto.news", "Hackernoon", "CoinGape", "CoinCheckup", "Mpost.io"],
    desc: "Solid mid-tier visibility focused on Web3 researchers, technical readers, and crypto market watchers."
  },
  {
    name: "BASIC: B",
    category: "5-media",
    price: "$800",
    traffic: "600K+ Monthly Traffic",
    featured: false,
    badge: "Lowest Entry Cost",
    pubs: ["Digital Journal", "CaptainAltcoin", "TechAnnouncer", "Bitcoin Insider", "Techbullion"],
    desc: "Cost-effective distribution for smaller announcements and persistent indexed search visibility."
  }
];

const packages10 = [
  {
    name: "VIRAL (10 Media)",
    category: "10-media",
    price: "$8,300",
    traffic: "15M+ Monthly Traffic",
    featured: true,
    badge: "Maximum Organic Reach",
    pubs: [
      "TheBlock.co", "Cryptopolitan", "Beincrypto", "Bitcoin.com", "Bitcoinist",
      "Coingape.com", "AMB Crypto", "NewsBTC", "Investing.com", "Business Insider, AP, Benzinga, MarketWatch syndication"
    ],
    desc: "Comprehensive 10-outlet onslaught combining institutional crypto desks and mainstream financial giants."
  },
  {
    name: "PREMIUM (10 Media)",
    category: "10-media",
    price: "$3,250",
    traffic: "5M+ Monthly Traffic",
    featured: false,
    badge: "Popular Value",
    pubs: [
      "Hackernoon", "Thedefiant.io", "Coinedition.com", "Mpost.io", "Blockonomi",
      "Bravenewcoin.com", "Publish0x", "Coincu", "Investing.com", "Business Insider, AP, Benzinga, MarketWatch syndication"
    ],
    desc: "Deep tech, DeFi, and developer-centric distribution with global financial market presence."
  },
  {
    name: "STARTER (10 Media)",
    category: "10-media",
    price: "$2,350",
    traffic: "2M+ Monthly Traffic",
    featured: false,
    badge: "Multi-Outlet Starter",
    pubs: [
      "Coingabbar.com", "Invezz", "Bitcoin Insider", "Coinjournal", "Thebittimes.com",
      "timestabloid.com", "CaptainAltcoin", "Theblockopedia.com", "Investing.com", "Business Insider"
    ],
    desc: "Broad multi-outlet coverage for startup funding rounds and community growth announcements."
  }
];

const packagesNiche = [
  {
    name: "WEB3 GAMING (10 Media)",
    category: "niche",
    price: "$5,299",
    traffic: "10M+ Monthly Traffic",
    featured: false,
    badge: "Gaming & Metaverse",
    pubs: [
      "Gam3s.gg", "Playtoearn.com", "Chainplay.gg", "Beanstalk.io", "Gurugamer.com",
      "Gamejolt.com", "Gamespace.com", "Thenoobgamerz.com", "Investing.com", "Business Insider, AP, Benzinga, MarketWatch syndication"
    ],
    desc: "Bespoke distribution into Web3 gaming portals, play-to-earn communities, and gamer news outlets."
  },
  {
    name: "FINTECH & FOREX (10 Media)",
    category: "niche",
    price: "$3,999",
    traffic: "10M+ Monthly Traffic",
    featured: true,
    badge: "Brokers & Fintech",
    pubs: [
      "Financemagnates.com", "Invezz.com", "WalletInvestor.com", "Tradingbeasts.com", "Moneycheck.com",
      "Forexlive.com", "Gov.capital", "Financebuzz.net", "Investing.com", "Business Insider, AP, Benzinga, MarketWatch syndication"
    ],
    desc: "Specialized financial wire targeting forex brokers, trading desks, wealthtech apps, and institutional readers."
  },
  {
    name: "TECH & INNOVATION (10 Media)",
    category: "niche",
    price: "$2,899",
    traffic: "10M+ Monthly Traffic",
    featured: false,
    badge: "Technology Desks",
    pubs: [
      "Techbullion", "TechAnnouncer", "Hackernoon", "Techpanga.com", "Techpoint.africa",
      "Techiexpert.com", "Alltechmagazine.com", "99techpost.com", "Investing.com", "Business Insider, AP, Benzinga, MarketWatch syndication"
    ],
    desc: "Reaching technology enthusiasts, software engineers, and digital innovation reporters."
  }
];

const package60 = {
  name: "60 Media Mega Package",
  price: "$7,000",
  traffic: "Mass Syndication Network",
  badge: "Ultimate Volume & SEO Power",
  pubs: [
    "Blockonomi.com", "Blockzeit.com", "Coinworldstory.com", "Coincentral.com", "Publish0x.com",
    "Bitnewsbot.com", "Mpost.io", "Coinfea.com", "Cryptodirectories.com", "NullTx.com",
    "Cryptosavingexpert.com", "Thebittimes.com", "CryptoNewsLand.com", "Daotimes.com", "36crypto.com",
    "TheMerkle.com", "Btcpeers.com", "FxCryptoNews.com", "Thecryptoupdates.com", "TheNewsCrypto.com",
    "Cryptoboom.com", "Cryptowisser.com", "Theblockopedia.com", "Techbullion", "Coinjournal.net",
    "CaptainAltcoin.com", "Chainaffairs.com", "Invezz", "Crypto-reporter.com", "Blockchainaire.com",
    "Blockcrux.com", "Cryptobrowser.io", "Btcnews.com", "Coinedition.com", "Livebitcoinnews.com",
    "FintechMode.com", "Zycrypto.com", "Cryptomode.com", "Coinography.com", "Analyticsinsight.net",
    "Bitcoin Insider", "Memecoinist.com", "Moneycheck.com", "Coinpaper.com", "Cryptofingers.com",
    "Coinsprobe.com", "Timestabloid.com", "TechAnnouncer.com", "Coincu.com", "Cryptopress.site",
    "Coinnewsspan.com", "kanalcoin.com", "Stelareum.io", "Namecoinnews.com", "Theccpress.com",
    "Coingabbar.com", "Capitalbay.news", "Bitcoininfonews.com", "CoinRoop.com", "Cryptomoonpress.com"
  ],
  desc: "Massive 60-publication syndication network flooding digital newsrooms and search indexes with permanent backlinks, brand mentions, and organic trust signals."
};

// Render card helper
function renderCard(pkg) {
  return `
    <div class="pricing-card ${pkg.featured ? 'popular' : ''}">
      ${pkg.featured ? `<div class="pricing-badge">${pkg.badge}</div>` : ''}
      <h3 class="pricing-title">${pkg.name}</h3>
      <div class="pricing-price-box mt-2">
        <span class="pricing-currency">USD</span>
        <span class="pricing-amount">${pkg.price}</span>
      </div>
      <div class="traffic-pill mt-2">
        <span class="badge badge-crypto">${pkg.traffic}</span>
      </div>
      <p class="pricing-desc text-muted mt-3">${pkg.desc}</p>
      
      <div class="pricing-divider"></div>
      <h4 class="small text-gold uppercase mt-3">Included Publications:</h4>
      <ul class="pricing-pub-list mt-2">
        ${pkg.pubs.map(p => `<li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>${p}</span></li>`).join('\n        ')}
      </ul>

      <div class="mt-4 pt-2">
        <a href="/contact.html?package=${encodeURIComponent(pkg.name)}" class="btn-primary btn-block">Order ${pkg.name}</a>
      </div>
    </div>
  `;
}

// Generate complete pricing.html
const pricingHtml = pageTemplate({
  title: "Crypto & Forex Media Packages & Pricing | NexcoinPR",
  description: "Official media distribution packages for crypto, forex, Web3, and fintech companies. Guaranteed publication on CoinTelegraph, CoinDesk, The Block, and 60+ top media outlets.",
  canonical: "https://nexcoinpr.com/pricing.html",
  activePage: "pricing",
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Crypto & Forex Media Packages & Pricing — NexcoinPR",
    "description": "Transparent pricing packages for crypto, forex, and fintech press release distribution.",
    "url": "https://nexcoinpr.com/pricing.html",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://nexcoinpr.com/" },
        { "@type": "ListItem", "position": 2, "name": "Pricing", "item": "https://nexcoinpr.com/pricing.html" }
      ]
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": "NexcoinPR Media Distribution Packages",
      "itemListElement": [
        { "@type": "Offer", "name": "ELITE: A (5 Crypto Media)", "price": "20000", "priceCurrency": "USD" },
        { "@type": "Offer", "name": "ELITE: B (5 Crypto Media)", "price": "11000", "priceCurrency": "USD" },
        { "@type": "Offer", "name": "VIRAL (10 Crypto Media)", "price": "8300", "priceCurrency": "USD" },
        { "@type": "Offer", "name": "60 Media Mega Package", "price": "7000", "priceCurrency": "USD" },
        { "@type": "Offer", "name": "WEB3 GAMING (10 Media)", "price": "5299", "priceCurrency": "USD" },
        { "@type": "Offer", "name": "FINTECH & FOREX (10 Media)", "price": "3999", "priceCurrency": "USD" },
        { "@type": "Offer", "name": "PREMIUM (10 Crypto Media)", "price": "3250", "priceCurrency": "USD" },
        { "@type": "Offer", "name": "TECH & INNOVATION (10 Media)", "price": "2899", "priceCurrency": "USD" },
        { "@type": "Offer", "name": "SUPERIOR: A (5 Crypto Media)", "price": "2800", "priceCurrency": "USD" },
        { "@type": "Offer", "name": "SUPERIOR: B (5 Crypto Media)", "price": "2650", "priceCurrency": "USD" },
        { "@type": "Offer", "name": "STARTER (10 Crypto Media)", "price": "2350", "priceCurrency": "USD" },
        { "@type": "Offer", "name": "BASIC: A (5 Crypto Media)", "price": "1100", "priceCurrency": "USD" },
        { "@type": "Offer", "name": "BASIC: B (5 Crypto Media)", "price": "800", "priceCurrency": "USD" }
      ]
    }
  },
  bodyContent: `
  <section class="page-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/" class="breadcrumb-item">Home</a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">Pricing</span>
      </nav>
      <div class="page-hero-content text-center" style="max-width: 860px; margin-inline: auto;">
        <span class="badge badge-pr">Transparent Pricing Matrix</span>
        <h1 class="page-hero-title">Crypto &amp; Forex Media Packages</h1>
        <p class="hero-intro">Guaranteed distribution across tier-1 publications, crypto newswires, and specialized financial trading networks. Transparent rates with verifiable delivery reports.</p>
        
        <div class="package-filter-nav mt-4">
          <a href="#section-5-media" class="tag active">5 Media Packages</a>
          <a href="#section-10-media" class="tag">10 Media Packages</a>
          <a href="#section-niche" class="tag">Gaming &bull; Fintech &bull; Tech</a>
          <a href="#section-60-media" class="tag tag-gold">60 Media Mega Package ($7k)</a>
        </div>
      </div>
    </div>
  </section>

  <!-- 60 MEDIA HERO BANNER -->
  <section class="section section-dark" id="section-60-media" style="border-bottom: 2px solid var(--color-gold);">
    <div class="container">
      <div class="mega-package-card">
        <div class="mega-header text-center">
          <span class="badge badge-pr" style="font-size: 0.9rem; padding: 6px 14px;">MOST POWERFUL SYNDICATION NETWORK</span>
          <h2 class="mt-2 text-white" style="font-size: 2.4rem;">The 60 Media Mega Package</h2>
          <p class="text-gold" style="font-size: 1.8rem; font-weight: 800;">$7,000 USD <span class="text-muted" style="font-size: 1.05rem; font-weight: 400;">&bull; Total 60 Indexed Publications &bull; Complete Syndicate Report</span></p>
          <p class="text-muted mt-2" style="max-width: 780px; margin-inline: auto;">Flood the market with comprehensive coverage across 60 specialized crypto, blockchain, and financial publications. Perfect for token generation events (TGE), major exchange listings, protocol mainnet launches, and institutional fund raises.</p>
        </div>

        <div class="mega-grid mt-4">
          <div class="mega-pubs-container">
            ${package60.pubs.map(pub => `<div class="mega-pub-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>${pub}</span></div>`).join('\n            ')}
          </div>
        </div>

        <div class="text-center mt-5">
          <a href="/contact.html?package=60%20Media%20Mega%20Package" class="btn-primary" style="font-size: 1.1rem; padding: 14px 36px;">Order the 60 Media Package ($7,000)</a>
        </div>
      </div>
    </div>
  </section>

  <!-- 5 CRYPTO MEDIA PACKAGES (Series A & B) -->
  <section class="section section-white" id="section-5-media">
    <div class="container">
      <div class="section-header text-center mb-5">
        <span class="badge badge-crypto">High-Impact Selection</span>
        <h2>5 Crypto Media Packages</h2>
        <p class="section-subtitle">Curated 5-outlet tiers engineered for targeted visibility from tier-1 giants to cost-effective starter channels.</p>
      </div>

      <h3 class="mb-3 text-gold">Series A: Premium Reach</h3>
      <div class="grid-3 mb-5">
        ${packages5A.map(renderCard).join('\n')}
      </div>

      <h3 class="mb-3 text-gold">Series B: Broad Audience Distribution</h3>
      <div class="grid-3">
        ${packages5B.map(renderCard).join('\n')}
      </div>
    </div>
  </section>

  <!-- 10 CRYPTO MEDIA PACKAGES -->
  <section class="section section-light" id="section-10-media">
    <div class="container">
      <div class="section-header text-center mb-5">
        <span class="badge badge-blockchain">Maximum Momentum</span>
        <h2>10 Crypto Media Packages</h2>
        <p class="section-subtitle">Ten publications per package for maximum SEO authority, backlinks, and industry buzz.</p>
      </div>

      <div class="grid-3">
        ${packages10.map(renderCard).join('\n')}
      </div>
    </div>
  </section>

  <!-- NICHE PACKAGES (WEB3 GAMING, FINTECH, TECH) -->
  <section class="section section-white" id="section-niche">
    <div class="container">
      <div class="section-header text-center mb-5">
        <span class="badge badge-forex">Specialized Industry Verticals</span>
        <h2>Industry-Targeted Media Packages</h2>
        <p class="section-subtitle">Tailored specifically for Web3 gaming platforms, forex &amp; fintech companies, and technology innovators.</p>
      </div>

      <div class="grid-3">
        ${packagesNiche.map(renderCard).join('\n')}
      </div>
    </div>
  </section>

  <!-- DISTRIBUTION PROCESS & STANDARDS -->
  <section class="section section-dark">
    <div class="container">
      <div class="two-col-layout">
        <div class="main-content-col">
          <span class="badge badge-pr">Transparent Fulfillment</span>
          <h2 class="text-white mt-2">What Is Included With Every Media Package</h2>
          <ul class="styled-list text-muted mt-3">
            <li><strong class="text-white">100% Guaranteed Publication:</strong> Every outlet specified in your package is guaranteed to publish your news release or article.</li>
            <li><strong class="text-white">Editorial &amp; Compliance Review:</strong> Our senior editors format your release to pass the compliance desk of major publications (CoinTelegraph, CoinDesk, Benzinga, etc.).</li>
            <li><strong class="text-white">Permanent Live Links:</strong> Your announcement stays permanently indexed on news sites, passing SEO authority and building your public record.</li>
            <li><strong class="text-white">Detailed Syndication Report:</strong> Receive an audit-ready Excel &amp; PDF report with live URLs, traffic metrics, and publication timestamps within 24&ndash;48 hours of distribution.</li>
            <li><strong class="text-white">Mainstream Financial Syndication:</strong> Select packages include syndication to Business Insider, Associated Press (AP), Benzinga, and MarketWatch news feeds.</li>
          </ul>
        </div>

        <aside class="sidebar-col">
          <div class="card card-featured">
            <h3>Need a Custom Media Bundle?</h3>
            <p class="text-muted mt-2">Want to combine specific publications or require an enterprise multi-month campaign retainer? Contact our media desk for a custom quotation.</p>
            <a href="/contact.html" class="btn-primary btn-block mt-3">Request Custom Quote</a>
            <a href="mailto:hello@nexcoinpr.com" class="btn-secondary btn-block mt-2">Email Media Desk</a>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="section section-white">
    <div class="container">
      <div class="section-header text-center mb-5">
        <h2>Pricing &amp; Distribution FAQs</h2>
      </div>

      <div class="faq-accordion" style="max-width: 860px; margin-inline: auto;">
        <div class="faq-item">
          <button class="faq-question" aria-expanded="false">Are the publications in these packages 100% guaranteed? <span class="faq-icon">+</span></button>
          <div class="faq-answer">
            <p>Yes. Every publication listed in your chosen package is guaranteed to publish your news, provided the content complies with our editorial guidelines and avoids defamatory statements or unsubstantiated investment claims.</p>
          </div>
        </div>
        <div class="faq-item">
          <button class="faq-question" aria-expanded="false">What is the turnaround time for publication? <span class="faq-icon">+</span></button>
          <div class="faq-answer">
            <p>Once you approve the final draft, distribution is typically completed within 24 to 48 hours. The 60 Media Package is usually fully published and reported within 48 to 72 hours.</p>
          </div>
        </div>
        <div class="faq-item">
          <button class="faq-question" aria-expanded="false">What payment methods are accepted? <span class="faq-icon">+</span></button>
          <div class="faq-answer">
            <p>We accept USDT, USDC, BTC, ETH, and international bank wire transfers (USD, EUR, GBP).</p>
          </div>
        </div>
        <div class="faq-item">
          <button class="faq-question" aria-expanded="false">Do you provide copywriting if we don't have a press release written? <span class="faq-icon">+</span></button>
          <div class="faq-answer">
            <p>Yes. Our team of experienced financial and crypto journalists can craft a compelling, compliant press release for your project from your brief or bullet points.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
`
});

fs.writeFileSync(path.join(BASE_DIR, 'pricing.html'), pricingHtml);
console.log('Successfully regenerated pricing.html with all real packages!');

// Add CSS styling for new pricing elements if needed
const extraPricingCss = `
/* ── Mega Package & Advanced Pricing Styles ── */
.mega-package-card {
  background: linear-gradient(135deg, rgba(13, 31, 60, 0.95), rgba(10, 22, 40, 0.98));
  border: 1px solid rgba(201, 168, 76, 0.35);
  border-radius: var(--radius-lg);
  padding: clamp(1.5rem, 4vw, 3rem);
  box-shadow: var(--shadow-gold);
}
.mega-grid {
  background: rgba(0, 0, 0, 0.25);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  border: 1px solid rgba(201, 168, 76, 0.15);
}
.mega-pubs-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem 1rem;
}
.mega-pub-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.88);
}
.mega-pub-item span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.package-filter-nav {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}
.tag-gold {
  background: rgba(201, 168, 76, 0.15) !important;
  color: var(--color-gold) !important;
  border-color: var(--color-gold) !important;
  font-weight: 600;
}
.pricing-pub-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.pricing-pub-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}
.pricing-pub-list li span {
  flex: 1;
}
.traffic-pill {
  display: inline-block;
}
.pricing-price-box {
  display: flex;
  align-items: baseline;
  gap: 4px;
}
.pricing-currency {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-gold);
}
.pricing-amount {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-navy);
}
.pricing-card.popular .pricing-amount {
  color: var(--color-gold);
}
`;

const pagesCssPath = path.join(BASE_DIR, 'assets/css/pages.css');
let pagesCss = fs.readFileSync(pagesCssPath, 'utf8');
if (!pagesCss.includes('.mega-package-card')) {
  pagesCss += `\n${extraPricingCss}`;
  fs.writeFileSync(pagesCssPath, pagesCss);
  console.log('Appended mega package CSS styles to pages.css');
}

const fs = require('fs');
const path = require('path');
const { BASE_DIR, pageTemplate } = require('./templates');

// Data structures for all 13 bundled packages
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

// 27 Single Publication Direct Placements (A La Carte)
const singlePublications = [
  {
    name: "Entrepreneur.com",
    domain: "entrepreneur.com",
    priceNum: 8500,
    price: "$8,500",
    category: "mainstream",
    categoryLabel: "Mainstream Tier-1",
    traffic: "18M+ Monthly",
    turnaround: "48-72h",
    focus: "Global Business, Tech & Leadership",
    badge: "Pinnacle Authority"
  },
  {
    name: "Forbes",
    domain: "forbes.com",
    priceNum: 7500,
    price: "$7,500",
    category: "mainstream",
    categoryLabel: "Mainstream Tier-1",
    traffic: "80M+ Monthly",
    turnaround: "48-72h",
    focus: "World Business, C-Suite & Investing",
    badge: "Global Benchmark"
  },
  {
    name: "Decrypt.co",
    domain: "decrypt.co",
    priceNum: 2000,
    price: "$2,000",
    category: "crypto",
    categoryLabel: "Crypto & Web3",
    traffic: "5M+ Monthly",
    turnaround: "24-48h",
    focus: "Web3, Decentralized Tech & AI News",
    badge: "Tier-1 Crypto"
  },
  {
    name: "Bitcoin.com",
    domain: "bitcoin.com",
    priceNum: 2000,
    price: "$2,000",
    category: "crypto",
    categoryLabel: "Crypto & Web3",
    traffic: "6M+ Monthly",
    turnaround: "24-48h",
    focus: "Bitcoin, Blockchain & Crypto Economy",
    badge: "Legacy Crypto Giant"
  },
  {
    name: "BeInCrypto.com",
    domain: "beincrypto.com",
    priceNum: 1500,
    price: "$1,500",
    category: "crypto",
    categoryLabel: "Crypto & Web3",
    traffic: "10M+ Monthly",
    turnaround: "24-48h",
    focus: "Global Crypto News (Multi-Language)",
    badge: "Top Global Portal"
  },
  {
    name: "Bitcoinist.com",
    domain: "bitcoinist.com",
    priceNum: 1200,
    price: "$1,200",
    category: "crypto",
    categoryLabel: "Crypto & Web3",
    traffic: "4M+ Monthly",
    turnaround: "24-48h",
    focus: "Crypto Market Technical Analysis",
    badge: "Established 2013"
  },
  {
    name: "FXStreet.com",
    domain: "fxstreet.com",
    priceNum: 1000,
    price: "$1,000",
    category: "forex",
    categoryLabel: "Forex & Trading",
    traffic: "6M+ Monthly",
    turnaround: "24-48h",
    focus: "Foreign Exchange & Macro Trading",
    badge: "Top Forex Portal"
  },
  {
    name: "Forexlive.com",
    domain: "forexlive.com",
    priceNum: 700,
    price: "$700",
    category: "forex",
    categoryLabel: "Forex & Trading",
    traffic: "3M+ Monthly",
    turnaround: "24-48h",
    focus: "Real-Time FX Trading & Central Banks",
    badge: "Active Trading Desk"
  },
  {
    name: "WalletInvestor.com",
    domain: "walletinvestor.com",
    priceNum: 430,
    price: "$430",
    category: "forex",
    categoryLabel: "Forex & Trading",
    traffic: "2.5M+ Monthly",
    turnaround: "24-48h",
    focus: "AI Price Forecasts & Market Models",
    badge: "Algorithmic Desk"
  },
  {
    name: "AnalyticsInsight.net",
    domain: "analyticsinsight.net",
    priceNum: 400,
    price: "$400",
    category: "tech",
    categoryLabel: "Tech & Syndication",
    traffic: "3M+ Monthly",
    turnaround: "24-48h",
    focus: "AI, Big Data, Blockchain & Analytics",
    badge: "Deep Tech"
  },
  {
    name: "Yahoo Finance",
    domain: "finance.yahoo.com",
    priceNum: 300,
    price: "$300",
    category: "mainstream",
    categoryLabel: "Mainstream Tier-1",
    traffic: "150M+ Monthly",
    turnaround: "24-48h",
    focus: "World Financial News & Stock Tickers",
    badge: "Global Financial Portal"
  },
  {
    name: "MSN",
    domain: "msn.com",
    priceNum: 300,
    price: "$300",
    category: "mainstream",
    categoryLabel: "Mainstream Tier-1",
    traffic: "200M+ Monthly",
    turnaround: "24-48h",
    focus: "Microsoft Global News Network",
    badge: "Massive Reach"
  },
  {
    name: "ABPLive.com",
    domain: "abplive.com",
    priceNum: 300,
    price: "$300",
    category: "mainstream",
    categoryLabel: "Mainstream Tier-1",
    traffic: "40M+ Monthly",
    turnaround: "24-48h",
    focus: "Global News & International Broadcast",
    badge: "High-Traffic News"
  },
  {
    name: "CoinEdition",
    domain: "coinedition.com",
    priceNum: 300,
    price: "$300",
    category: "crypto",
    categoryLabel: "Crypto & Web3",
    traffic: "1.5M+ Monthly",
    turnaround: "24-48h",
    focus: "Crypto Market Intelligence & Altcoins",
    badge: "Fast Indexing"
  },
  {
    name: "TheCryptoUpdates with CMC",
    domain: "thecryptoupdates.com",
    priceNum: 300,
    price: "$300",
    category: "crypto",
    categoryLabel: "Crypto & Web3",
    traffic: "800K+ Monthly",
    turnaround: "24-48h",
    focus: "Crypto News + CoinMarketCap Feed",
    badge: "CMC Community Feed"
  },
  {
    name: "Mirror Review",
    domain: "mirrorreview.com",
    priceNum: 300,
    price: "$300",
    category: "tech",
    categoryLabel: "Tech & Syndication",
    traffic: "500K+ Monthly",
    turnaround: "24-48h",
    focus: "Business Leadership & Enterprise Tech",
    badge: "Executive Spotlight"
  },
  {
    name: "NY Wire",
    domain: "nywire.com",
    priceNum: 300,
    price: "$300",
    category: "tech",
    categoryLabel: "Tech & Syndication",
    traffic: "400K+ Monthly",
    turnaround: "24-48h",
    focus: "New York Business & Wall Street PR",
    badge: "Regional Wire"
  },
  {
    name: "Markets.BusinessInsider",
    domain: "markets.businessinsider.com",
    priceNum: 250,
    price: "$250",
    category: "mainstream",
    categoryLabel: "Mainstream Tier-1",
    traffic: "30M+ Monthly",
    turnaround: "24-48h",
    focus: "Institutional Markets & Financial Data",
    badge: "Institutional Desk"
  },
  {
    name: "The Globe and Mail",
    domain: "theglobeandmail.com",
    priceNum: 150,
    price: "$150",
    category: "mainstream",
    categoryLabel: "Mainstream Tier-1",
    traffic: "12M+ Monthly",
    turnaround: "24-48h",
    focus: "National Financial News of Record",
    badge: "Prestigious Press"
  },
  {
    name: "Benzinga",
    domain: "benzinga.com",
    priceNum: 150,
    price: "$150",
    category: "tech",
    categoryLabel: "Tech & Syndication",
    traffic: "14M+ Monthly",
    turnaround: "24-48h",
    focus: "Actionable Financial Media & Stocks",
    badge: "Trading Terminal"
  },
  {
    name: "Tekedia",
    domain: "tekedia.com",
    priceNum: 150,
    price: "$150",
    category: "tech",
    categoryLabel: "Tech & Syndication",
    traffic: "600K+ Monthly",
    turnaround: "24-48h",
    focus: "Technology, Innovation & Economy",
    badge: "Emerging Markets"
  },
  {
    name: "AP News (Associated Press)",
    domain: "apnews.com",
    priceNum: 100,
    price: "$100",
    category: "mainstream",
    categoryLabel: "Mainstream Tier-1",
    traffic: "60M+ Monthly",
    turnaround: "24-48h",
    focus: "Global Newswire & Public Record",
    badge: "Official Wire"
  },
  {
    name: "Barchart.com",
    domain: "barchart.com",
    priceNum: 100,
    price: "$100",
    category: "forex",
    categoryLabel: "Forex & Trading",
    traffic: "5M+ Monthly",
    turnaround: "24-48h",
    focus: "Commodities, FX & Market Analytics",
    badge: "Trading Terminal"
  },
  {
    name: "StreetInsider.com",
    domain: "streetinsider.com",
    priceNum: 100,
    price: "$100",
    category: "forex",
    categoryLabel: "Forex & Trading",
    traffic: "1.2M+ Monthly",
    turnaround: "24-48h",
    focus: "Wall Street Intelligence & Market Wire",
    badge: "Wall Street Desk"
  },
  {
    name: "TechBullion",
    domain: "techbullion.com",
    priceNum: 100,
    price: "$100",
    category: "tech",
    categoryLabel: "Tech & Syndication",
    traffic: "1M+ Monthly",
    turnaround: "24-48h",
    focus: "London Fintech & Tech News",
    badge: "Fintech Focus"
  },
  {
    name: "Digital Journal",
    domain: "digitaljournal.com",
    priceNum: 100,
    price: "$100",
    category: "tech",
    categoryLabel: "Tech & Syndication",
    traffic: "2M+ Monthly",
    turnaround: "24-48h",
    focus: "Global News Portal & Syndication",
    badge: "Google News Feed"
  },
  {
    name: "Big News Network",
    domain: "bignewsnetwork.com",
    priceNum: 100,
    price: "$100",
    category: "tech",
    categoryLabel: "Tech & Syndication",
    traffic: "1.5M+ Monthly",
    turnaround: "24-48h",
    focus: "Global Syndicated News Network",
    badge: "Global Wire"
  }
];

// Helper to render package card
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

// Build JSON-LD itemListElement for 13 packages + 27 single publications (40 total)
const schemaOffers = [
  // 13 Packages
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
  { "@type": "Offer", "name": "BASIC: B (5 Crypto Media)", "price": "800", "priceCurrency": "USD" },
  // 27 Single Publications
  ...singlePublications.map(pub => ({
    "@type": "Offer",
    "name": `${pub.name} Direct Placement`,
    "price": String(pub.priceNum),
    "priceCurrency": "USD",
    "category": pub.categoryLabel
  }))
];

// Generate complete pricing.html
const pricingHtml = pageTemplate({
  title: "Crypto & Forex Media Packages & Single Media Pricing | NexcoinPR",
  description: "Official media distribution packages and direct single publication placements. Guaranteed publication on Forbes, Entrepreneur, Decrypt, Bitcoin.com, CoinTelegraph, and 60+ top media outlets.",
  canonical: "https://nexcoinpr.com/pricing.html",
  activePage: "pricing",
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Crypto & Forex Media Packages & Single Media Pricing — NexcoinPR",
    "description": "Transparent pricing packages and single publication placements for crypto, forex, and fintech press release distribution.",
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
      "name": "NexcoinPR Media Distribution Packages and Single Media Placements",
      "itemListElement": schemaOffers
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
        <h1 class="page-hero-title">Crypto, Forex &amp; Financial Media Packages</h1>
        <p class="hero-intro">Guaranteed distribution across tier-1 publications, crypto newswires, and specialized financial trading networks. Choose comprehensive syndication bundles or individual single-outlet direct placements.</p>
        
        <div class="package-filter-nav mt-4">
          <a href="#section-single-media" class="tag tag-gold" style="font-weight: 700;">Single Media (A La Carte 27 Outlets)</a>
          <a href="#section-60-media" class="tag tag-gold">60 Media Mega Package ($7k)</a>
          <a href="#section-5-media" class="tag">5 Media Packages</a>
          <a href="#section-10-media" class="tag">10 Media Packages</a>
          <a href="#section-niche" class="tag">Gaming &bull; Fintech &bull; Tech</a>
        </div>
      </div>
    </div>
  </section>

  <!-- 27 SINGLE PUBLICATION PLACEMENTS (A LA CARTE) -->
  <section class="section section-white" id="section-single-media" style="border-bottom: 2px solid var(--color-gold);">
    <div class="container">
      <div class="section-header text-center mb-4">
        <span class="badge badge-pr">A La Carte Media Desks</span>
        <h2>Single Publication Direct Placements</h2>
        <p class="section-subtitle" style="max-width: 800px; margin-inline: auto;">Target individual publications with guaranteed editorial or sponsored release placement. Select by tier, industry vertical, and transparent flat pricing starting from $100 up to Tier-1 global institutions.</p>
      </div>

      <!-- Quick Trust Indicators -->
      <div class="grid-4 mb-5 text-center">
        <div class="card card-light" style="padding: 1.25rem;">
          <h3 class="text-gold" style="font-size: 1.75rem; margin-bottom: 0.25rem;">27</h3>
          <p class="text-muted small mb-0"><strong>Verified Media Desks</strong><br>Direct editorial submission</p>
        </div>
        <div class="card card-light" style="padding: 1.25rem;">
          <h3 class="text-gold" style="font-size: 1.75rem; margin-bottom: 0.25rem;">$100 &ndash; $8.5k</h3>
          <p class="text-muted small mb-0"><strong>Transparent Rates</strong><br>Flat USD, zero surprises</p>
        </div>
        <div class="card card-light" style="padding: 1.25rem;">
          <h3 class="text-gold" style="font-size: 1.75rem; margin-bottom: 0.25rem;">24&ndash;48h</h3>
          <p class="text-muted small mb-0"><strong>Guaranteed Turnaround</strong><br>Fast editorial review</p>
        </div>
        <div class="card card-light" style="padding: 1.25rem;">
          <h3 class="text-gold" style="font-size: 1.75rem; margin-bottom: 0.25rem;">100%</h3>
          <p class="text-muted small mb-0"><strong>Guaranteed Live URL</strong><br>Complete audit report</p>
        </div>
      </div>

      <!-- Interactive Toolbar -->
      <div class="single-media-toolbar mb-4">
        <div class="search-box-wrapper">
          <input type="text" id="single-media-search" class="form-input" placeholder="Search publication, domain, or vertical (e.g. Forbes, Decrypt, Forex, Yahoo)..." aria-label="Search media outlets">
        </div>
        <div class="filter-pills-wrapper">
          <button type="button" class="btn-filter-pill active" data-filter="all">All Outlets (27)</button>
          <button type="button" class="btn-filter-pill" data-filter="mainstream">Mainstream Tier-1 (8)</button>
          <button type="button" class="btn-filter-pill" data-filter="crypto">Crypto &amp; Web3 (6)</button>
          <button type="button" class="btn-filter-pill" data-filter="forex">Forex &amp; Trading (5)</button>
          <button type="button" class="btn-filter-pill" data-filter="tech">Tech &amp; Syndication (8)</button>
        </div>
      </div>

      <!-- Live Outlets Table -->
      <div class="table-responsive">
        <table class="data-table single-media-table" id="single-media-table">
          <thead>
            <tr>
              <th scope="col" style="min-width: 200px;">Publication &amp; Domain</th>
              <th scope="col" style="min-width: 170px;">Category &amp; Vertical</th>
              <th scope="col" style="min-width: 130px;">Est. Reach</th>
              <th scope="col" style="min-width: 110px;">Turnaround</th>
              <th scope="col" style="min-width: 130px;">Direct Price</th>
              <th scope="col" style="min-width: 140px; text-align: center;">Direct Order</th>
            </tr>
          </thead>
          <tbody id="single-media-tbody">
            ${singlePublications.map(pub => `
            <tr data-category="${pub.category}" data-name="${pub.name.toLowerCase()}" data-domain="${pub.domain.toLowerCase()}" data-focus="${pub.focus.toLowerCase()}">
              <td>
                <div class="media-row-title">
                  <span class="media-name-strong">${pub.name}</span>
                  <span class="media-domain-muted">${pub.domain}</span>
                </div>
              </td>
              <td>
                <span class="badge ${pub.category === 'crypto' ? 'badge-crypto' : pub.category === 'forex' ? 'badge-forex' : pub.category === 'mainstream' ? 'badge-pr' : 'badge-blockchain'}">${pub.categoryLabel}</span>
                <div class="small text-muted mt-1">${pub.focus}</div>
              </td>
              <td>
                <span class="text-dark font-weight-medium">${pub.traffic}</span>
              </td>
              <td>
                <span class="badge badge-light">${pub.turnaround}</span>
              </td>
              <td>
                <span class="single-price-tag">${pub.price}</span>
                <span class="small text-muted block">USD Flat</span>
              </td>
              <td style="text-align: center;">
                <a href="/contact.html?placement=${encodeURIComponent(pub.name)}" class="btn-primary btn-sm" style="padding: 6px 14px; font-size: 0.85rem; white-space: nowrap;">Order Placement</a>
              </td>
            </tr>
            `).join('\n')}
          </tbody>
        </table>
      </div>

      <div id="no-media-results" class="text-center py-5" style="display: none;">
        <p class="text-muted">No publications match your filter. Try clearing your search query.</p>
        <button type="button" class="btn-secondary btn-sm mt-2" id="reset-media-filter">Reset Filters</button>
      </div>

      <div class="card card-featured mt-4 text-center" style="max-width: 900px; margin-inline: auto;">
        <h4 class="text-gold">Need Multi-Outlet Syndication or Custom Bundle?</h4>
        <p class="text-muted small mt-1">Combine any of the above 27 outlets into a tailored press package or explore our pre-negotiated volume bundles below with massive savings.</p>
        <div class="mt-3">
          <a href="#section-60-media" class="btn-secondary btn-sm mr-2">View 60 Media Package ($7,000)</a>
          <a href="/contact.html" class="btn-primary btn-sm">Request Custom Bundle Quote</a>
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
            <li><strong class="text-white">100% Guaranteed Publication:</strong> Every outlet specified in your package or single media order is guaranteed to publish your news release or article.</li>
            <li><strong class="text-white">Editorial &amp; Compliance Review:</strong> Our senior editors format your release to pass the compliance desk of major publications (CoinTelegraph, CoinDesk, Forbes, Benzinga, etc.).</li>
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
          <button class="faq-question" aria-expanded="false">Are the single publications and packages 100% guaranteed? <span class="faq-icon">+</span></button>
          <div class="faq-answer">
            <p>Yes. Every publication listed in your chosen package or individual placement is guaranteed to publish your news, provided the content complies with standard editorial guidelines and avoids defamatory statements or unsubstantiated investment claims.</p>
          </div>
        </div>
        <div class="faq-item">
          <button class="faq-question" aria-expanded="false">What is the difference between Single Media Placements and Bundled Packages? <span class="faq-icon">+</span></button>
          <div class="faq-answer">
            <p>Single Media Placements allow you to target one specific high-prestige publication (such as Forbes, Entrepreneur, Decrypt, or FXStreet) on an a la carte basis. Bundled packages (5 Media, 10 Media, and the 60 Media Mega Package) combine multiple curated publications at substantial wholesale discounts for maximum syndication reach and SEO impact.</p>
          </div>
        </div>
        <div class="faq-item">
          <button class="faq-question" aria-expanded="false">What is the turnaround time for publication? <span class="faq-icon">+</span></button>
          <div class="faq-answer">
            <p>Once you approve the final draft, distribution is typically completed within 24 to 48 hours for crypto news portals and mainstream wires. Tier-1 outlets like Forbes and Entrepreneur typically publish within 48 to 72 hours.</p>
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

  <!-- Interactive Search & Filter Script -->
  <script>
  document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('single-media-search');
    const filterPills = document.querySelectorAll('.btn-filter-pill');
    const tbody = document.getElementById('single-media-tbody');
    const noResults = document.getElementById('no-media-results');
    const resetBtn = document.getElementById('reset-media-filter');

    if (!tbody || !searchInput) return;

    let currentFilter = 'all';

    function filterTable() {
      const query = searchInput.value.toLowerCase().trim();
      const rows = tbody.querySelectorAll('tr');
      let visibleCount = 0;

      rows.forEach(function (row) {
        const cat = row.getAttribute('data-category');
        const name = row.getAttribute('data-name');
        const domain = row.getAttribute('data-domain');
        const focus = row.getAttribute('data-focus');

        const matchesCat = (currentFilter === 'all' || cat === currentFilter);
        const matchesQuery = (!query || name.includes(query) || domain.includes(query) || focus.includes(query));

        if (matchesCat && matchesQuery) {
          row.style.display = '';
          visibleCount++;
        } else {
          row.style.display = 'none';
        }
      });

      if (noResults) {
        noResults.style.display = (visibleCount === 0) ? 'block' : 'none';
      }
    }

    searchInput.addEventListener('input', filterTable);

    filterPills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentFilter = pill.getAttribute('data-filter');
        filterTable();
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        searchInput.value = '';
        currentFilter = 'all';
        filterPills.forEach(p => p.classList.remove('active'));
        if (filterPills[0]) filterPills[0].classList.add('active');
        filterTable();
      });
    }
  });
  </script>
`
});

fs.writeFileSync(path.join(BASE_DIR, 'pricing.html'), pricingHtml);
console.log('Successfully regenerated pricing.html with all 13 packages AND 27 single publication direct placements!');

// Add CSS styling for new single media table and toolbar elements if needed
const extraPricingCss = `
/* ── Single Media Table & Toolbar Styles ── */
.single-media-toolbar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
@media (min-width: 768px) {
  .single-media-toolbar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
.search-box-wrapper {
  flex: 1;
  max-width: 480px;
}
.filter-pills-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.btn-filter-pill {
  padding: 0.4rem 0.85rem;
  font-size: 0.825rem;
  font-weight: 600;
  border-radius: 9999px;
  background: var(--color-gray-100);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.btn-filter-pill:hover,
.btn-filter-pill.active {
  background: var(--color-navy);
  color: var(--color-gold);
  border-color: var(--color-gold);
}
.media-row-title {
  display: flex;
  flex-direction: column;
}
.media-name-strong {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--color-navy);
}
.media-domain-muted {
  font-size: 0.775rem;
  color: var(--color-text-muted);
}
.single-price-tag {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--color-gold);
}
`;

const pagesCssPath = path.join(BASE_DIR, 'assets/css/pages.css');
let pagesCss = fs.readFileSync(pagesCssPath, 'utf8');
if (!pagesCss.includes('.single-media-toolbar')) {
  pagesCss += `\n${extraPricingCss}`;
  fs.writeFileSync(pagesCssPath, pagesCss);
  console.log('Appended single media CSS styles to pages.css');
}

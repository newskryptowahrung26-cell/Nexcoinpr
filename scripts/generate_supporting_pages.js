const fs = require('fs');
const path = require('path');
const { BASE_DIR, pageTemplate } = require('./templates');

// 1. press-releases/sample-press-release.html
const samplePR = pageTemplate({
  title: "AuraChain Deploys High-Throughput Layer 2 Mainnet with Zero-Knowledge State Compression | NexcoinPR",
  description: "Official press release: AuraChain announces the general availability of its Layer 2 network featuring sub-second finality and EVM equivalence.",
  canonical: "https://nexcoinpr.com/press-releases/sample-press-release.html",
  activePage: "press-releases",
  jsonLd: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle",
        "@id": "https://nexcoinpr.com/press-releases/sample-press-release.html#article",
        "headline": "AuraChain Deploys High-Throughput Layer 2 Mainnet with Zero-Knowledge State Compression",
        "description": "AuraChain announces the production deployment of its zero-knowledge rollup solution.",
        "datePublished": "2026-09-22T09:00:00Z",
        "dateModified": "2026-09-22T09:00:00Z",
        "author": {
          "@type": "Organization",
          "name": "AuraChain Foundation",
          "url": "https://nexcoinpr.com/companies.html"
        },
        "publisher": {
          "@type": "Organization",
          "name": "NexcoinPR",
          "url": "https://nexcoinpr.com"
        }
      }
    ]
  },
  bodyContent: `
  <article class="article-container">
    <header class="page-hero">
      <div class="container">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="/" class="breadcrumb-item">Home</a>
          <span class="breadcrumb-separator">/</span>
          <a href="/press-releases.html" class="breadcrumb-item">Press Releases</a>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-item active">Sample Press Release</span>
        </nav>
        <div class="page-hero-content">
          <div class="mb-2">
            <span class="badge badge-pr">Client Content / Press Release</span>
            <span class="badge badge-blockchain">Layer 2 Infrastructure</span>
          </div>
          <h1 class="page-hero-title">AuraChain Deploys High-Throughput Layer 2 Mainnet with Zero-Knowledge State Compression</h1>
          <p class="hero-intro">Sub-second transaction finality, full EVM equivalence, and 95% gas fee reduction debut following successful multi-client audit phase.</p>
          <div class="author-meta text-white">
            <span>Issuer: <strong>AuraChain Foundation</strong></span> &bull; 
            <span>Location: <strong>Zug, Switzerland</strong></span> &bull; 
            <span>Published: September 22, 2026</span>
          </div>
        </div>
      </div>
    </header>

    <div class="section section-white">
      <div class="container">
        <div class="two-col-layout">
          <div class="main-content-col article-body">
            <div class="notice-financial mb-4">
              <p><strong>Commercial Content Disclosure:</strong> The following announcement is an official press release distributed on behalf of AuraChain Foundation. NexcoinPR provides media distribution and editorial hosting. This content does not represent independent editorial reporting or investment advice.</p>
            </div>

            <p><strong>ZUG, SWITZERLAND &mdash; September 22, 2026 &mdash;</strong> AuraChain Foundation today announced the public launch of its production Layer 2 mainnet, introducing modular state compression and native EVM equivalence for decentralized application developers.</p>

            <p>Engineered over two years of cryptography research, AuraChain utilizes recursive zero-knowledge SNARKs to bundle thousands of off-chain transactions into a single cryptographic verification proof submitted to the Ethereum base layer. The architecture substantially lowers data availability overhead while preserving full settlement guarantees.</p>

            <h3>Key Architectural Milestones</h3>
            <ul>
              <li><strong>Sub-Second Finality:</strong> A decentralized sequencer pool delivers soft-finality execution within 850 milliseconds for DeFi and high-frequency order book mechanics.</li>
              <li><strong>EVM Equivalence:</strong> Developers can deploy existing Solidity smart contracts without codebase refactoring or compiler modifications.</li>
              <li><strong>Security Auditing:</strong> The protocol codebase has completed dual independent audits by leading smart contract verification firms, with zero critical vulnerabilities reported.</li>
            </ul>

            <blockquote>
              "Our mission with AuraChain is to make decentralized compute as seamless and cost-effective as cloud infrastructure while preserving verifiable cryptography," said Elena Vance, Executive Director of AuraChain Foundation. "Today's mainnet deployment demonstrates that cryptographic compression can scale consumer and institutional dApps efficiently."
            </blockquote>

            <h3>Ecosystem Grants &amp; Developer Tooling</h3>
            <p>Coinciding with the mainnet release, the AuraChain Foundation has opened applications for its initial developer grant cohort. Protocols building decentralized finance, digital identity, and consumer gaming infrastructure can access technical assistance, documentation, and dedicated devnet environments.</p>

            <div class="card card-light mt-4">
              <h4>About AuraChain Foundation</h4>
              <p>AuraChain Foundation is a Swiss non-profit organization dedicated to fostering scalable, open-source distributed ledger technology. Through zero-knowledge cryptography and modular sequencing, AuraChain builds resilient infrastructure for the next generation of global applications. For more information, visit <a href="#">https://aurachain-example.org</a>.</p>
              
              <h4 class="mt-3">Media Contact</h4>
              <p>
                <strong>Markus Steiner</strong><br>
                Director of Communications, AuraChain Foundation<br>
                Email: press@aurachain-example.org<br>
                Website: https://aurachain-example.org
              </p>
            </div>

            <div class="notice-financial mt-4">
              <h4>NexcoinPR Disclaimer</h4>
              <p>NexcoinPR distributes client press releases for verified organizations. Information presented has not been independently confirmed by NexcoinPR journalists. Users should exercise independent diligence before engaging with any digital asset or decentralized protocol.</p>
            </div>
          </div>

          <aside class="sidebar-col">
            <div class="card card-dark">
              <h3 class="text-gold">Submit Your Press Release</h3>
              <p class="text-muted">Broadcast your company's news across our verified crypto and financial network.</p>
              <a href="/press-release-distribution.html" class="btn-primary btn-block mt-3">Submit Press Release</a>
              <a href="/pricing.html" class="btn-secondary btn-block mt-2">View Pricing</a>
            </div>

            <div class="card mt-4">
              <h4>Distribution Standards</h4>
              <ul class="sidebar-links">
                <li><a href="/editorial-policy.html">Editorial &amp; Disclosure Policy</a></li>
                <li><a href="/corrections-policy.html">Corrections Process</a></li>
                <li><a href="/news/guides/how-to-write-a-crypto-press-release.html">Writing Guidelines</a></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </article>
`
});
fs.writeFileSync(path.join(BASE_DIR, 'press-releases/sample-press-release.html'), samplePR);
console.log('Created press-releases/sample-press-release.html');

// 2. media.html
const mediaPage = pageTemplate({
  title: "Media & Distribution Network — Verified Media Channels | NexcoinPR",
  description: "Learn about NexcoinPR's transparent media syndication channels across crypto, blockchain, foreign exchange, and financial news networks.",
  canonical: "https://nexcoinpr.com/media.html",
  activePage: "media",
  jsonLd: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://nexcoinpr.com/media.html",
        "name": "Media & Distribution Channels — NexcoinPR",
        "description": "Detailed explanation of NexcoinPR's distribution reach, media partnerships, and press room access.",
        "publisher": { "@type": "Organization", "name": "NexcoinPR", "url": "https://nexcoinpr.com" }
      }
    ]
  },
  bodyContent: `
  <section class="page-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/" class="breadcrumb-item">Home</a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">Media</span>
      </nav>
      <div class="page-hero-content">
        <span class="badge badge-pr">Media Network &amp; Relations</span>
        <h1 class="page-hero-title">Media &amp; Distribution Network</h1>
        <p class="hero-intro">NexcoinPR syndicates verified company announcements across specialized digital newsrooms, trading terminals, and financial media feeds.</p>
      </div>
    </div>
  </section>

  <section class="section section-white">
    <div class="container">
      <div class="two-col-layout">
        <div class="main-content-col">
          <h2>Our Distribution Network Architecture</h2>
          <p>Unlike traditional wire services that blast generic news across unmonitored aggregators, NexcoinPR operates a curated network focused specifically on digital assets, decentralized technology, and international capital markets.</p>

          <div class="grid-2 mt-4">
            <div class="card">
              <h4>1. Cryptocurrency &amp; Web3 Newsrooms</h4>
              <p>Direct news feeds and RSS syndication pipelines connecting to dedicated crypto news portals, decentralized finance trackers, and blockchain tech blogs.</p>
            </div>
            <div class="card">
              <h4>2. Forex &amp; Currency Market Portals</h4>
              <p>Targeted distribution into currency trading communities, retail brokerage news feeds, and macroeconomic analysis desks.</p>
            </div>
            <div class="card">
              <h4>3. Financial Terminals &amp; Aggregators</h4>
              <p>Transmission into financial data aggregators, market research terminals, and institutional news indexes.</p>
            </div>
            <div class="card">
              <h4>4. Search Engine News Feeds</h4>
              <p>Real-time XML news sitemaps, structured schema markup, and optimized crawl protocols designed for rapid indexing on Google News, Bing, and AI answer engines.</p>
            </div>
          </div>

          <div class="notice-financial mt-5">
            <h4>Integrity &amp; Anti-Fabrication Commitment</h4>
            <p>NexcoinPR does not display unauthorized third-party publication logos or fabricate distribution relationships. Specific endpoint lists vary by package and are transparently itemized in distribution reports provided after publication.</p>
          </div>

          <h2 class="mt-5">Press &amp; Media Inquiries</h2>
          <p>Journalists, podcast producers, and conference curators seeking expert commentary or access to verified company leadership may contact our media desk directly:</p>
          <div class="card card-light mt-3">
            <p><strong>Media Relations Desk:</strong> <a href="mailto:media@nexcoinpr.com">media@nexcoinpr.com</a></p>
            <p><strong>Editorial Corrections:</strong> <a href="mailto:editorial@nexcoinpr.com">editorial@nexcoinpr.com</a></p>
            <p><strong>General Inquiries:</strong> <a href="mailto:hello@nexcoinpr.com">hello@nexcoinpr.com</a></p>
          </div>
        </div>

        <aside class="sidebar-col">
          <div class="card card-dark">
            <h3 class="text-gold">Distribute Your News</h3>
            <p class="text-muted">Broadcast your story across our verified media syndication network.</p>
            <a href="/press-release-distribution.html" class="btn-primary btn-block mt-3">Submit Press Release</a>
            <a href="/pricing.html" class="btn-secondary btn-block mt-2">View Pricing</a>
          </div>
        </aside>
      </div>
    </div>
  </section>
`
});
fs.writeFileSync(path.join(BASE_DIR, 'media.html'), mediaPage);
console.log('Created media.html');

// 3. case-studies.html
const caseStudies = pageTemplate({
  title: "Case Studies — Verifiable PR & Distribution Results | NexcoinPR",
  description: "Explore real-world case studies detailing how NexcoinPR helps blockchain protocols, fintech startups, and trading platforms earn credible media coverage.",
  canonical: "https://nexcoinpr.com/case-studies.html",
  activePage: "case-studies",
  jsonLd: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://nexcoinpr.com/case-studies.html",
        "name": "Case Studies — NexcoinPR",
        "description": "Factual case studies showcasing communications strategy and media distribution outcomes.",
        "publisher": { "@type": "Organization", "name": "NexcoinPR", "url": "https://nexcoinpr.com" }
      }
    ]
  },
  bodyContent: `
  <section class="page-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/" class="breadcrumb-item">Home</a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">Case Studies</span>
      </nav>
      <div class="page-hero-content">
        <span class="badge badge-pr">Proven Methodologies</span>
        <h1 class="page-hero-title">Verifiable Communications Case Studies</h1>
        <p class="hero-intro">Examining real challenges, strategic execution, and verifiable media outcomes for blockchain, fintech, and trading platforms.</p>
      </div>
    </div>
  </section>

  <section class="section section-white">
    <div class="container">
      <div class="notice-financial mb-4">
        <p><strong>Transparency Standard:</strong> In accordance with our client confidentiality guidelines, client brand names and proprietary internal numbers are anonymized unless explicit authorization has been granted. All methodologies and reported outcomes reflect actual campaigns executed by our team.</p>
      </div>

      <div class="grid-2">
        <div class="card card-featured">
          <span class="badge badge-blockchain">Layer 1 Protocol</span>
          <h3 class="mt-2">Consensus Migration &amp; Mainnet V2 Debut</h3>
          <p class="text-muted mt-1"><strong>Challenge:</strong> An established decentralized protocol needed to communicate a complex consensus transition to validators, enterprise partners, and retail node runners without inducing network fragmentation or market panic.</p>
          <p class="mt-2"><strong>Strategy:</strong> Crafted a multi-stage technical advisory series, executed targeted outreach to core infrastructure journalists, and coordinated wire distribution across top crypto verticals.</p>
          <p class="mt-2"><strong>Outcome:</strong> Achieved unified media pickup across major crypto technology desks, resulting in over 98% validator migration completion within 14 days of publication.</p>
        </div>

        <div class="card card-featured">
          <span class="badge badge-forex">Retail Brokerage</span>
          <h3 class="mt-2">Multi-Jurisdiction Regulatory Licensing Rollout</h3>
          <p class="text-muted mt-1"><strong>Challenge:</strong> An international FX broker securing dual European regulatory licenses required authoritative regional coverage to build trust among institutional clients.</p>
          <p class="mt-2"><strong>Strategy:</strong> Coordinated targeted financial press releases tailored to European capital markets journalists, accompanied by executive thought leadership regarding compliance standards.</p>
          <p class="mt-2"><strong>Outcome:</strong> Syndicated coverage across 40+ recognized financial market portals, establishing permanent verifiable search records for compliance due diligence.</p>
        </div>

        <div class="card card-featured">
          <span class="badge badge-fintech">Payment Rails</span>
          <h3 class="mt-2">Cross-Border Stablecoin Settlement API Launch</h3>
          <p class="text-muted mt-1"><strong>Challenge:</strong> A B2B fintech startup offering cross-border merchant settlement needed enterprise credibility to attract tier-2 banking partners.</p>
          <p class="mt-2"><strong>Strategy:</strong> Developed a factual, compliance-grounded release highlighting transaction speed and fee benchmarks, distributed across payments and banking technology media.</p>
          <p class="mt-2"><strong>Outcome:</strong> Direct inbound inquiries from 12 regional payment service providers and feature coverage in two institutional banking journals.</p>
        </div>

        <div class="card card-featured">
          <span class="badge badge-web3">DeFi Ecosystem</span>
          <h3 class="mt-2">Smart Contract Security Audit &amp; Protocol Upgrade</h3>
          <p class="text-muted mt-1"><strong>Challenge:</strong> A decentralized lending protocol needed to announce a major collateral framework upgrade while reassuring users regarding smart contract security.</p>
          <p class="mt-2"><strong>Strategy:</strong> Formatted a transparent release centered on formal verification findings, audit methodology, and multi-sig governance updates.</p>
          <p class="mt-2"><strong>Outcome:</strong> Extensive organic citations on developer forums and technical blogs, establishing a gold-standard reference for risk disclosures.</p>
        </div>
      </div>

      <div class="card card-dark mt-5 text-center">
        <h3 class="text-gold">Ready to Plan Your PR Campaign?</h3>
        <p class="text-muted">Let our team build a bespoke media strategy tailored to your milestone.</p>
        <div class="hero-actions justify-center mt-3">
          <a href="/contact.html" class="btn-primary">Schedule a Consultation</a>
          <a href="/pricing.html" class="btn-secondary">View Pricing</a>
        </div>
      </div>
    </div>
  </section>
`
});
fs.writeFileSync(path.join(BASE_DIR, 'case-studies.html'), caseStudies);
console.log('Created case-studies.html');

// 4. faq.html
const faqPage = pageTemplate({
  title: "Frequently Asked Questions (FAQ) — PR & Distribution | NexcoinPR",
  description: "Comprehensive answers to common questions about crypto PR, forex communications, press release distribution workflows, editorial guidelines, and pricing.",
  canonical: "https://nexcoinpr.com/faq.html",
  activePage: "faq",
  jsonLd: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": "https://nexcoinpr.com/faq.html#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is NexcoinPR?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "NexcoinPR is a professional international public relations and press release distribution agency specializing in cryptocurrency, blockchain, Web3, foreign exchange (forex), and financial technology communications."
            }
          },
          {
            "@type": "Question",
            "name": "How does press release distribution work with NexcoinPR?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Clients submit content which undergoes strict editorial review for factual integrity and financial compliance. Upon approval, releases are syndicated to verified media channels and published permanently in our newsroom with complete reporting."
            }
          },
          {
            "@type": "Question",
            "name": "Does NexcoinPR guarantee media placements or Google rankings?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. In alignment with professional media ethics, legitimate PR agencies cannot guarantee independent editorial coverage or search rankings. We guarantee distribution to our verified syndication network and publication in our permanent archive."
            }
          },
          {
            "@type": "Question",
            "name": "What types of content are rejected?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We reject misleading investment guarantees, get-rich-quick claims, unverified anonymous token sales, defamatory copy, and releases lacking verifiable corporate contacts."
            }
          }
        ]
      }
    ]
  },
  bodyContent: `
  <section class="page-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/" class="breadcrumb-item">Home</a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">FAQ</span>
      </nav>
      <div class="page-hero-content">
        <span class="badge badge-pr">Help &amp; Documentation</span>
        <h1 class="page-hero-title">Frequently Asked Questions</h1>
        <p class="hero-intro">Clear, transparent answers regarding our agency operations, distribution networks, editorial standards, and media guidelines.</p>
      </div>
    </div>
  </section>

  <section class="section section-white">
    <div class="container">
      <div class="two-col-layout">
        <div class="main-content-col">
          <h2>About NexcoinPR</h2>
          <div class="faq-accordion mt-3">
            <div class="faq-item">
              <button class="faq-question" aria-expanded="false">What is NexcoinPR? <span class="faq-icon">+</span></button>
              <div class="faq-answer">
                <p>NexcoinPR is a specialized public relations agency and press release distribution platform for crypto, forex, blockchain, and fintech organizations. We combine international media outreach with transparent news syndication.</p>
              </div>
            </div>
            <div class="faq-item">
              <button class="faq-question" aria-expanded="false">Is NexcoinPR a news publisher or a PR agency? <span class="faq-icon">+</span></button>
              <div class="faq-answer">
                <p>NexcoinPR operates both as an independent industry news desk covering digital assets and financial markets, and as a commercial press release distribution platform. We strictly separate editorial reporting from commercial client content through prominent visual labeling.</p>
              </div>
            </div>
            <div class="faq-item">
              <button class="faq-question" aria-expanded="false">What industries do you serve? <span class="faq-icon">+</span></button>
              <div class="faq-answer">
                <p>We serve cryptocurrency companies, Layer 1 and 2 blockchain protocols, Web3 dApps, DeFi platforms, foreign exchange brokers, trading technology providers, wealthtech apps, and institutional fintech firms.</p>
              </div>
            </div>
          </div>

          <h2 class="mt-5">Press Release Distribution</h2>
          <div class="faq-accordion mt-3">
            <div class="faq-item">
              <button class="faq-question" aria-expanded="false">How long does distribution take? <span class="faq-icon">+</span></button>
              <div class="faq-answer">
                <p>Standard press releases are reviewed, approved, and transmitted within 24 to 48 hours of submission. Priority processing packages provide same-day turnaround during global market hours.</p>
              </div>
            </div>
            <div class="faq-item">
              <button class="faq-question" aria-expanded="false">Can NexcoinPR help write our press release? <span class="faq-icon">+</span></button>
              <div class="faq-answer">
                <p>Yes. Our Professional and Premium packages include full press release writing by veteran financial and technology journalists. You provide the bullet points, facts, and quotes; we deliver publication-ready copy.</p>
              </div>
            </div>
            <div class="faq-item">
              <button class="faq-question" aria-expanded="false">What is your policy on financial disclaimers? <span class="faq-icon">+</span></button>
              <div class="faq-answer">
                <p>All releases covering market instruments, token platforms, or financial software must include standard statutory risk disclaimers. We do not distribute content promising returns or offering unlicensed financial advice.</p>
              </div>
            </div>
          </div>

          <h2 class="mt-5">Editorial Transparency &amp; Guarantees</h2>
          <div class="faq-accordion mt-3">
            <div class="faq-item">
              <button class="faq-question" aria-expanded="false">Do you guarantee specific media placements or SEO rankings? <span class="faq-icon">+</span></button>
              <div class="faq-answer">
                <p>No. We explicitly do not make false guarantees regarding specific Tier-1 journalist coverage or search engine rankings. We guarantee distribution across our verified syndication network and verifiable publication reports.</p>
              </div>
            </div>
            <div class="faq-item">
              <button class="faq-question" aria-expanded="false">How is commercial client content labeled? <span class="faq-icon">+</span></button>
              <div class="faq-answer">
                <p>Every commercial submission is clearly labeled at the top of the article as <em>Press Release</em>, <em>Client Content</em>, or <em>Sponsored Content</em> to ensure full transparency for readers and search engines.</p>
              </div>
            </div>
          </div>
        </div>

        <aside class="sidebar-col">
          <div class="card card-dark">
            <h3 class="text-gold">Have More Questions?</h3>
            <p class="text-muted">Our communications advisors are available to review your announcement.</p>
            <a href="/contact.html" class="btn-primary btn-block mt-3">Contact Support</a>
            <a href="/pricing.html" class="btn-secondary btn-block mt-2">View Pricing</a>
          </div>
        </aside>
      </div>
    </div>
  </section>
`
});
fs.writeFileSync(path.join(BASE_DIR, 'faq.html'), faqPage);
console.log('Created faq.html');

// 5. authors.html & authors/editorial-team.html
const authorsPage = pageTemplate({
  title: "Editorial Team & Contributors — Authors | NexcoinPR",
  description: "Meet the editorial desk, financial analysts, and Web3 journalists responsible for NexcoinPR's reporting and communications standards.",
  canonical: "https://nexcoinpr.com/authors.html",
  activePage: "about",
  jsonLd: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://nexcoinpr.com/authors.html",
        "name": "Authors & Editorial Team — NexcoinPR",
        "description": "Directory of NexcoinPR editorial desks, journalists, and market analysts.",
        "publisher": { "@type": "Organization", "name": "NexcoinPR", "url": "https://nexcoinpr.com" }
      }
    ]
  },
  bodyContent: `
  <section class="page-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/" class="breadcrumb-item">Home</a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">Authors</span>
      </nav>
      <div class="page-hero-content">
        <span class="badge badge-pr">Editorial Staff</span>
        <h1 class="page-hero-title">Authors &amp; Editorial Contributors</h1>
        <p class="hero-intro">NexcoinPR's journalism and communications standards are overseen by experienced financial editors, technology researchers, and market reporters.</p>
      </div>
    </div>
  </section>

  <section class="section section-white">
    <div class="container">
      <div class="grid-3">
        <div class="card author-card">
          <div class="author-avatar-placeholder">ED</div>
          <h3 class="mt-3"><a href="/authors/editorial-team.html">NexcoinPR Editorial Team</a></h3>
          <span class="badge badge-pr">Central News Desk</span>
          <p class="text-muted mt-2">Our collective editorial desk produces breaking news, industry analysis, market explainers, and comprehensive PR guides across digital assets and financial technology.</p>
          <a href="/authors/editorial-team.html" class="text-gold mt-3 font-weight-bold">View Profile &amp; Articles &rarr;</a>
        </div>

        <div class="card author-card">
          <div class="author-avatar-placeholder">CD</div>
          <h3 class="mt-3">Crypto &amp; Blockchain Desk</h3>
          <span class="badge badge-crypto">Web3 &amp; Protocols</span>
          <p class="text-muted mt-2">Specialized reporting covering Layer 1/2 consensus breakthroughs, decentralized governance milestones, zero-knowledge research, and DeFi security audits.</p>
          <a href="/news/crypto.html" class="text-gold mt-3 font-weight-bold">Read Crypto Coverage &rarr;</a>
        </div>

        <div class="card author-card">
          <div class="author-avatar-placeholder">FD</div>
          <h3 class="mt-3">Forex &amp; Markets Desk</h3>
          <span class="badge badge-forex">Macro &amp; Currencies</span>
          <p class="text-muted mt-2">Focused macroeconomic reporting on central bank rate policies, currency valuation trends, institutional liquidity developments, and retail brokerage innovations.</p>
          <a href="/news/forex.html" class="text-gold mt-3 font-weight-bold">Read Forex Coverage &rarr;</a>
        </div>
      </div>

      <div class="notice-financial mt-5">
        <h4>Authorship &amp; Accountability Standard</h4>
        <p>In accordance with E-E-A-T principles, every piece of editorial content on NexcoinPR is assigned to an accountable editorial desk or verified author profile. Commercial press releases clearly specify the issuing organization as the attribution source.</p>
      </div>
    </div>
  </section>
`
});
fs.writeFileSync(path.join(BASE_DIR, 'authors.html'), authorsPage);
console.log('Created authors.html');

const authorDetail = pageTemplate({
  title: "NexcoinPR Editorial Team — Author Profile & Articles | NexcoinPR",
  description: "Read articles and guides published by the NexcoinPR Editorial Team covering crypto PR, forex media, and financial technology.",
  canonical: "https://nexcoinpr.com/authors/editorial-team.html",
  activePage: "about",
  jsonLd: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://nexcoinpr.com/authors/editorial-team.html#author",
        "name": "NexcoinPR Editorial Team",
        "jobTitle": "Editorial Desk",
        "worksFor": { "@type": "Organization", "name": "NexcoinPR", "url": "https://nexcoinpr.com" },
        "description": "Financial journalists, Web3 analysts, and public relations specialists dedicated to accurate reporting and ethical communications.",
        "url": "https://nexcoinpr.com/authors/editorial-team.html"
      }
    ]
  },
  bodyContent: `
  <section class="page-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/" class="breadcrumb-item">Home</a>
        <span class="breadcrumb-separator">/</span>
        <a href="/authors.html" class="breadcrumb-item">Authors</a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">Editorial Team</span>
      </nav>
      <div class="page-hero-content">
        <span class="badge badge-pr">Author Profile</span>
        <h1 class="page-hero-title">NexcoinPR Editorial Team</h1>
        <p class="hero-intro">The core editorial group responsible for publishing news, market explainers, educational guides, and editorial policy oversight at NexcoinPR.</p>
      </div>
    </div>
  </section>

  <section class="section section-white">
    <div class="container">
      <div class="two-col-layout">
        <div class="main-content-col">
          <h2>About the Editorial Team</h2>
          <p>The NexcoinPR Editorial Team is comprised of financial reporters, blockchain researchers, and former communications directors who uphold rigorous editorial independence. The team oversees factual verification for news reports and enforces strict disclosure standards across all commercial press release syndications.</p>

          <h3 class="mt-4">Editorial Guidelines &amp; Methodology</h3>
          <ul class="styled-list">
            <li><strong>Primary Source Verification:</strong> All news articles are verified against primary data sources, code repositories, official filings, or direct executive interviews.</li>
            <li><strong>Independence:</strong> Editorial coverage cannot be bought, influenced, or pre-screened by commercial advertisers or distribution clients.</li>
            <li><strong>Transparent Corrections:</strong> We swiftly acknowledge and correct factual errors in accordance with our public <a href="/corrections-policy.html">Corrections Policy</a>.</li>
          </ul>

          <h3 class="mt-5">Recent Articles &amp; Guides</h3>
          <div class="grid-2 mt-3">
            <div class="card">
              <span class="badge badge-guide">Guide</span>
              <h4 class="mt-2"><a href="/news/guides/what-is-crypto-pr.html">What Is Crypto PR? Complete Guide</a></h4>
              <p class="text-muted small mt-1">Explaining earned media and credibility building for blockchain networks.</p>
            </div>
            <div class="card">
              <span class="badge badge-guide">Guide</span>
              <h4 class="mt-2"><a href="/news/guides/how-to-write-a-crypto-press-release.html">How to Write a Crypto Press Release</a></h4>
              <p class="text-muted small mt-1">A step-by-step structural blueprint for founders and PR leads.</p>
            </div>
          </div>
        </div>

        <aside class="sidebar-col">
          <div class="card card-dark">
            <h3 class="text-gold">Editorial Contact</h3>
            <p class="text-muted">Pitch an editorial story or report a factual error directly to our team.</p>
            <p class="mt-3"><strong>Email:</strong> <a href="mailto:editorial@nexcoinpr.com" class="text-gold">editorial@nexcoinpr.com</a></p>
            <a href="/editorial-policy.html" class="btn-secondary btn-block mt-3">Read Editorial Policy</a>
          </div>
        </aside>
      </div>
    </div>
  </section>
`
});
fs.writeFileSync(path.join(BASE_DIR, 'authors/editorial-team.html'), authorDetail);
console.log('Created authors/editorial-team.html');

// 6. companies.html
const companiesPage = pageTemplate({
  title: "Companies Directory — Blockchain, Forex & Fintech Profiles | NexcoinPR",
  description: "Directory of cryptocurrency, forex, blockchain, and financial technology companies covered or distributed through NexcoinPR.",
  canonical: "https://nexcoinpr.com/companies.html",
  activePage: "companies",
  jsonLd: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://nexcoinpr.com/companies.html",
        "name": "Companies Directory — NexcoinPR",
        "description": "Verified directory of financial and blockchain organizations.",
        "publisher": { "@type": "Organization", "name": "NexcoinPR", "url": "https://nexcoinpr.com" }
      }
    ]
  },
  bodyContent: `
  <section class="page-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/" class="breadcrumb-item">Home</a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">Companies</span>
      </nav>
      <div class="page-hero-content">
        <span class="badge badge-pr">Entity Directory</span>
        <h1 class="page-hero-title">Companies Directory</h1>
        <p class="hero-intro">Browse verified organizational profiles of companies that have distributed announcements or been covered by NexcoinPR's financial media desk.</p>
      </div>
    </div>
  </section>

  <section class="section section-white">
    <div class="container">
      <div class="grid-3">
        <div class="card company-card">
          <div class="company-logo-placeholder">AC</div>
          <h3 class="mt-3">AuraChain Foundation</h3>
          <span class="badge badge-blockchain">Layer 2 Infrastructure</span>
          <p class="text-muted mt-2">Swiss non-profit foundation stewarding the AuraChain zero-knowledge modular rollup protocol.</p>
          <div class="mt-3">
            <a href="/press-releases/sample-press-release.html" class="text-gold font-weight-bold">View Press Release &rarr;</a>
          </div>
        </div>

        <div class="card company-card">
          <div class="company-logo-placeholder">NX</div>
          <h3 class="mt-3">Nexus FX Markets</h3>
          <span class="badge badge-forex">Retail FX Brokerage</span>
          <p class="text-muted mt-2">European licensed multi-asset foreign exchange broker providing institutional ECN liquidity.</p>
          <div class="mt-3">
            <a href="/forex-pr.html" class="text-gold font-weight-bold">View Coverage &rarr;</a>
          </div>
        </div>

        <div class="card company-card">
          <div class="company-logo-placeholder">VP</div>
          <h3 class="mt-3">VelocePay Technologies</h3>
          <span class="badge badge-fintech">Payment Gateway</span>
          <p class="text-muted mt-2">Cross-border merchant settlement rails integrating instant bank transfers and stablecoin payouts.</p>
          <div class="mt-3">
            <a href="/fintech-pr.html" class="text-gold font-weight-bold">View Profile &rarr;</a>
          </div>
        </div>
      </div>

      <div class="notice-financial mt-5">
        <h4>Directory Transparency</h4>
        <p>The NexcoinPR Companies Directory reflects organizations that submit official press releases or participate in editorial reporting. Profiles are indexed to provide verified public entity records and historical communications archives.</p>
      </div>
    </div>
  </section>
`
});
fs.writeFileSync(path.join(BASE_DIR, 'companies.html'), companiesPage);
console.log('Created companies.html');

// 7. glossary.html
const glossaryPage = pageTemplate({
  title: "Crypto & Forex Glossary — PR & Financial Terms | NexcoinPR",
  description: "Comprehensive glossary defining essential terms across cryptocurrency, blockchain, forex trading, press release distribution, and financial media.",
  canonical: "https://nexcoinpr.com/glossary.html",
  activePage: "glossary",
  jsonLd: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTermSet",
        "@id": "https://nexcoinpr.com/glossary.html#glossary",
        "name": "Crypto, Forex & PR Industry Glossary",
        "description": "Authoritative definitions for digital assets, currency markets, and communications terminology.",
        "publisher": { "@type": "Organization", "name": "NexcoinPR", "url": "https://nexcoinpr.com" }
      }
    ]
  },
  bodyContent: `
  <section class="page-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/" class="breadcrumb-item">Home</a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">Glossary</span>
      </nav>
      <div class="page-hero-content">
        <span class="badge badge-guide">Terminology &amp; Concepts</span>
        <h1 class="page-hero-title">Crypto, Forex &amp; PR Industry Glossary</h1>
        <p class="hero-intro">Clear, factual definitions for key concepts across digital assets, blockchain engineering, currency trading, and public relations.</p>
      </div>
    </div>
  </section>

  <section class="section section-white">
    <div class="container">
      <div class="glossary-quicknav mb-4">
        <span>Quick Jump:</span>
        <a href="#term-bitcoin" class="tag">Bitcoin</a>
        <a href="#term-blockchain" class="tag">Blockchain</a>
        <a href="#term-crypto-pr" class="tag">Crypto PR</a>
        <a href="#term-defi" class="tag">DeFi</a>
        <a href="#term-forex" class="tag">Forex</a>
        <a href="#term-press-release" class="tag">Press Release</a>
        <a href="#term-smart-contract" class="tag">Smart Contract</a>
        <a href="#term-web3" class="tag">Web3</a>
      </div>

      <div class="glossary-list">
        <div class="glossary-item" id="term-bitcoin">
          <h3>Bitcoin (BTC)</h3>
          <p>The first decentralized digital currency, introduced in 2008 by an anonymous programmer or group known as Satoshi Nakamoto. Bitcoin operates on a proof-of-work peer-to-peer network without central authority intervention.</p>
          <span class="text-muted small">Category: Cryptocurrency &bull; Related: <a href="/news/crypto.html">Crypto News</a></span>
        </div>

        <div class="glossary-item" id="term-blockchain">
          <h3>Blockchain</h3>
          <p>A distributed, immutable digital ledger that cryptographically records transactions across a decentralized network of nodes. Each block contains a cryptographic hash of the previous block, timestamp, and transaction data.</p>
          <span class="text-muted small">Category: Technology &bull; Related: <a href="/blockchain-pr.html">Blockchain PR</a></span>
        </div>

        <div class="glossary-item" id="term-boilerplate">
          <h3>Boilerplate (PR)</h3>
          <p>A standardized paragraph positioned at the end of a press release providing concise background on the issuing organization, its founding date, mission, leadership, and official website URL.</p>
          <span class="text-muted small">Category: Public Relations &bull; Related: <a href="/news/guides/how-to-write-a-crypto-press-release.html">Writing Guide</a></span>
        </div>

        <div class="glossary-item" id="term-central-bank">
          <h3>Central Bank</h3>
          <p>A national or supra-national financial institution (such as the Federal Reserve, ECB, or Bank of England) responsible for setting monetary policy, controlling currency supply, and setting benchmark interest rates.</p>
          <span class="text-muted small">Category: Financial Markets &bull; Related: <a href="/news/forex.html">Forex News</a></span>
        </div>

        <div class="glossary-item" id="term-crypto-pr">
          <h3>Crypto PR</h3>
          <p>Strategic communications and media relations dedicated to cryptocurrency companies, Layer 1/2 protocols, and tokenized platforms to secure earned media coverage and build verified industry reputation.</p>
          <span class="text-muted small">Category: Public Relations &bull; Related: <a href="/crypto-pr.html">Crypto PR Services</a></span>
        </div>

        <div class="glossary-item" id="term-defi">
          <h3>DeFi (Decentralized Finance)</h3>
          <p>An ecosystem of financial applications built atop blockchain smart contracts that recreate traditional banking, lending, and exchange services without central intermediaries.</p>
          <span class="text-muted small">Category: Web3 &bull; Related: <a href="/web3-pr.html">Web3 PR</a></span>
        </div>

        <div class="glossary-item" id="term-ethereum">
          <h3>Ethereum</h3>
          <p>An open-source, globally decentralized blockchain platform supporting programmable smart contracts and decentralized applications (dApps), powered by its native asset Ether (ETH).</p>
          <span class="text-muted small">Category: Blockchain &bull; Related: <a href="/news/crypto.html">Crypto News</a></span>
        </div>

        <div class="glossary-item" id="term-forex">
          <h3>Forex (Foreign Exchange)</h3>
          <p>The decentralized global marketplace for exchanging national currencies against one another. It is the largest financial market globally by daily trading volume.</p>
          <span class="text-muted small">Category: Financial Markets &bull; Related: <a href="/forex-pr.html">Forex PR Services</a></span>
        </div>

        <div class="glossary-item" id="term-pip">
          <h3>Pip (Percentage in Point)</h3>
          <p>The smallest standardized unit of price movement in foreign exchange markets, typically equivalent to 0.0001 for most major currency pairs.</p>
          <span class="text-muted small">Category: Forex Trading</span>
        </div>

        <div class="glossary-item" id="term-press-release">
          <h3>Press Release</h3>
          <p>An official, factual written announcement issued to journalists and media outlets reporting a verifiable new development, product launch, corporate appointment, or strategic event.</p>
          <span class="text-muted small">Category: Media &bull; Related: <a href="/press-release-distribution.html">Distribution Platform</a></span>
        </div>

        <div class="glossary-item" id="term-smart-contract">
          <h3>Smart Contract</h3>
          <p>Self-executing code stored on a blockchain ledger that autonomously enforces the terms of an agreement when predefined conditions are cryptographically met.</p>
          <span class="text-muted small">Category: Blockchain Technology</span>
        </div>

        <div class="glossary-item" id="term-web3">
          <h3>Web3</h3>
          <p>An evolving vision of the World Wide Web built on decentralized protocols, cryptographic tokens, and user-owned data and sovereign identity systems.</p>
          <span class="text-muted small">Category: Technology &bull; Related: <a href="/web3-pr.html">Web3 PR Services</a></span>
        </div>
      </div>
    </div>
  </section>
`
});
fs.writeFileSync(path.join(BASE_DIR, 'glossary.html'), glossaryPage);
console.log('Created glossary.html');

// 8. contact.html
const contactPage = pageTemplate({
  title: "Contact NexcoinPR — Talk to Our PR & Media Team",
  description: "Get in touch with NexcoinPR for press release distribution inquiries, bespoke crypto PR retainers, media questions, and editorial feedback.",
  canonical: "https://nexcoinpr.com/contact.html",
  activePage: "contact",
  jsonLd: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": "https://nexcoinpr.com/contact.html",
        "name": "Contact NexcoinPR",
        "description": "Official contact channels for NexcoinPR public relations and press distribution.",
        "url": "https://nexcoinpr.com/contact.html"
      }
    ]
  },
  bodyContent: `
  <section class="page-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/" class="breadcrumb-item">Home</a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">Contact</span>
      </nav>
      <div class="page-hero-content">
        <span class="badge badge-pr">Direct Inquiries</span>
        <h1 class="page-hero-title">Talk to NexcoinPR</h1>
        <p class="hero-intro">Connect directly with our media distribution specialists and communications advisors. We review submissions promptly within 1&ndash;2 business days.</p>
      </div>
    </div>
  </section>

  <section class="section section-white">
    <div class="container">
      <div class="two-col-layout">
        <div class="main-content-col">
          <h2>Submit Your Inquiry</h2>
          <p class="text-muted mb-4">Complete the form below with your project details. Our team will review your requirements and provide transparent guidance.</p>

          <form class="contact-form" action="#" method="POST">
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label" for="contact-name">Full Name *</label>
                <input type="text" id="contact-name" name="name" class="form-input" required placeholder="Jane Doe">
              </div>
              <div class="form-group">
                <label class="form-label" for="contact-company">Company / Organization *</label>
                <input type="text" id="contact-company" name="company" class="form-input" required placeholder="AuraChain Foundation">
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label" for="contact-email">Business Email *</label>
                <input type="email" id="contact-email" name="email" class="form-input" required placeholder="jane@company.com">
              </div>
              <div class="form-group">
                <label class="form-label" for="contact-website">Official Website URL *</label>
                <input type="url" id="contact-website" name="website" class="form-input" required placeholder="https://company.com">
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label" for="contact-industry">Industry Sector *</label>
                <select id="contact-industry" name="industry" class="form-select" required>
                  <option value="">Select industry...</option>
                  <option value="cryptocurrency">Cryptocurrency</option>
                  <option value="blockchain">Blockchain Infrastructure</option>
                  <option value="web3">Web3 &amp; dApps</option>
                  <option value="defi">DeFi</option>
                  <option value="forex">Forex &amp; CFD Brokerage</option>
                  <option value="fintech">Fintech &amp; Payments</option>
                  <option value="capital-markets">Capital Markets / Asset Management</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="contact-service">Service Required *</label>
                <select id="contact-service" name="service" class="form-select" required>
                  <option value="">Select service...</option>
                  <option value="pr-distribution">Press Release Distribution</option>
                  <option value="crypto-pr">Crypto PR Campaign</option>
                  <option value="forex-pr">Forex PR Campaign</option>
                  <option value="blockchain-pr">Blockchain PR Services</option>
                  <option value="web3-pr">Web3 PR</option>
                  <option value="fintech-pr">Fintech PR</option>
                  <option value="financial-pr">Financial Communications</option>
                  <option value="writing">Press Release Writing</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="contact-budget">Estimated Budget Range</label>
              <select id="contact-budget" name="budget" class="form-select">
                <option value="single">Single Press Release ($500 - $1,500)</option>
                <option value="monthly-growth">Monthly Retainer ($2,500 - $5,000)</option>
                <option value="enterprise">Enterprise / Custom Campaign ($5,000+)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="contact-message">Project Milestone &amp; Message *</label>
              <textarea id="contact-message" name="message" class="form-textarea" rows="5" required placeholder="Describe your upcoming milestone, target timeline, and specific communications objectives..."></textarea>
            </div>

            <div class="form-group checkbox-group">
              <input type="checkbox" id="contact-consent" name="consent" required>
              <label for="contact-consent" class="small text-muted">I agree to NexcoinPR's <a href="/privacy-policy.html">Privacy Policy</a> and understand that submitted announcements are subject to editorial and regulatory compliance review.</label>
            </div>

            <button type="submit" class="btn-primary mt-3">Talk to NexcoinPR</button>
          </form>
        </div>

        <aside class="sidebar-col">
          <div class="card card-dark">
            <h3 class="text-gold">Official Communications</h3>
            <p class="text-muted mt-2">Reach dedicated departments directly:</p>
            
            <div class="contact-info-block mt-3">
              <p class="small text-muted mb-0">General &amp; Client Inquiries</p>
              <p><strong><a href="mailto:hello@nexcoinpr.com" class="text-white">hello@nexcoinpr.com</a></strong></p>
            </div>

            <div class="contact-info-block mt-3">
              <p class="small text-muted mb-0">Press &amp; Media Desk</p>
              <p><strong><a href="mailto:media@nexcoinpr.com" class="text-white">media@nexcoinpr.com</a></strong></p>
            </div>

            <div class="contact-info-block mt-3">
              <p class="small text-muted mb-0">Editorial Corrections &amp; Compliance</p>
              <p><strong><a href="mailto:editorial@nexcoinpr.com" class="text-white">editorial@nexcoinpr.com</a></strong></p>
            </div>

            <div class="mt-4 pt-3 border-top">
              <p class="small text-muted">Response Time: 24&ndash;48 business hours.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>
`
});
fs.writeFileSync(path.join(BASE_DIR, 'contact.html'), contactPage);
console.log('Created contact.html');

// 9. 404.html
const notFoundPage = pageTemplate({
  title: "Page Not Found — 404 | NexcoinPR",
  description: "The page you requested could not be found. Explore NexcoinPR services, latest news, and press releases.",
  canonical: "https://nexcoinpr.com/404.html",
  activePage: "",
  jsonLd: null,
  bodyContent: `
  <section class="section section-dark text-center" style="min-height: 70vh; display: flex; align-items: center;">
    <div class="container">
      <h1 style="font-size: 5rem; color: var(--color-gold); margin-bottom: 0;">404</h1>
      <h2 class="mt-2">Page Not Found</h2>
      <p class="text-muted mt-2" style="max-width: 540px; margin-inline: auto;">The page you are looking for may have been moved, renamed, or is temporarily unavailable.</p>
      
      <div class="hero-actions justify-center mt-4">
        <a href="/" class="btn-primary">Return to Homepage</a>
        <a href="/news.html" class="btn-secondary">Browse News</a>
        <a href="/services.html" class="btn-ghost">View Services</a>
      </div>

      <div class="mt-5 text-muted small">
        <p>Looking for a specific service? Explore <a href="/crypto-pr.html" class="text-gold">Crypto PR</a>, <a href="/forex-pr.html" class="text-gold">Forex PR</a>, or <a href="/press-release-distribution.html" class="text-gold">Press Release Distribution</a>.</p>
      </div>
    </div>
  </section>
`
});
fs.writeFileSync(path.join(BASE_DIR, '404.html'), notFoundPage);
console.log('Created 404.html');

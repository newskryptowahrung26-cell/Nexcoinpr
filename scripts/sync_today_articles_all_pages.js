const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// 1. Update data/live_news.json
const liveNewsPath = path.join(ROOT_DIR, 'data', 'live_news.json');
const todayLiveNews = [
  {
    "title": "Live Updates: Bitcoin Rebounds Above $84,000 as ETFs Draw In $30 Million",
    "source": "CoinDesk",
    "date": "29 Sep 2026",
    "category": "Markets • Crypto",
    "url": "https://www.coindesk.com/markets/2026/09/29/live-updates-bitcoin-rebounds-above-usd84-000-as-treasury-yields-steady",
    "excerpt": "Bitcoin pushed back above the $84,000 threshold as spot exchange-traded funds registered over $30 million in net institutional inflows amidst steadying bond yields."
  },
  {
    "title": "Bitcoin Recovers to $84,000 While Stocks Fall on Bond Market Pressure",
    "source": "CoinDesk",
    "date": "29 Sep 2026",
    "category": "Macro • Trading",
    "url": "https://www.coindesk.com/markets/2026/09/29/aave-leads-defi-higher-as-crypto-shrugs-off-surging-treasury-yields",
    "excerpt": "Digital asset markets demonstrated structural resilience as Bitcoin decoupled from broader US equities while decentralized finance tokens led sectoral gains."
  },
  {
    "title": "EUR/USD & US Dollar Outlook: Fed Rate Cut Expectations Face Yield Pressures",
    "source": "NexcoinPR Editorial",
    "date": "29 Sep 2026",
    "category": "Forex • FX Desk",
    "url": "https://www.nexcoinpr.agency/news/eur-usd-dollar-index-outlook-fed-yields-inflation",
    "excerpt": "EUR/USD consolidates near key technical thresholds as sticky US inflation prints and elevated 10-year Treasury yields reinforce US dollar dominance across global FX sessions."
  },
  {
    "title": "Bitget's $352M Hack Happened Via Spoofed Transfers, Not Private Keys, CEO Gray Chen Says",
    "source": "CoinDesk",
    "date": "25 Sep 2026",
    "category": "Security • Crypto",
    "url": "https://www.coindesk.com/markets/2026/09/25/bitget-s-usd351-million-hack-happened-via-spoofed-transfers-not-private-keys-ceo-gray-chen-says",
    "excerpt": "Bitget CEO Gray Chen clarified that the recent $352M capital incident occurred due to unauthorized address spoofing mechanisms rather than compromised institutional private keys."
  },
  {
    "title": "Trump Administration Weighs Global Stablecoin Framework for US Dollar Dominance",
    "source": "CoinDesk",
    "date": "24 Sep 2026",
    "category": "Macro • Policy",
    "url": "https://www.coindesk.com/markets/2026/09/24/trump-administration-weighs-a-global-stablecoin-plan-to-cement-dollar-s-dominance",
    "excerpt": "The administration evaluates global stablecoin initiatives to cement US dollar hegemony and boost demand for short-term Treasury bills across international digital asset markets."
  },
  {
    "title": "USD/JPY Outlook: Hawkish Federal Reserve Recalibration Mounts Pressure on the Japanese Yen",
    "source": "FOREX.com",
    "date": "24 Sep 2026",
    "category": "Forex • FX Wire",
    "url": "https://www.forex.com/en/news-and-analysis/usd-jpy-outlook-hawkish-fed-recalibration-pressures-the-yen/",
    "excerpt": "Resilient US macroeconomic indicators and surging yields widened the interest rate differential between the US and Japan, pushing USD/JPY toward major multi-month resistance."
  }
];

fs.writeFileSync(liveNewsPath, JSON.stringify(todayLiveNews, null, 2), 'utf8');
console.log('Updated data/live_news.json with today articles.');

// 2. Update data/imported_daily_news.json
const importedNewsPath = path.join(ROOT_DIR, 'data', 'imported_daily_news.json');
let importedNews = JSON.parse(fs.readFileSync(importedNewsPath, 'utf8'));
const forexUrl = 'https://www.nexcoinpr.agency/news/eur-usd-dollar-index-outlook-fed-yields-inflation';
if (!importedNews.includes(forexUrl)) {
  importedNews.push(forexUrl);
  fs.writeFileSync(importedNewsPath, JSON.stringify(importedNews, null, 2), 'utf8');
  console.log('Added forex article to data/imported_daily_news.json');
}

// 3. Update sitemap-news.xml
const sitemapNewsPath = path.join(ROOT_DIR, 'sitemap-news.xml');
let sitemapContent = fs.readFileSync(sitemapNewsPath, 'utf8');
if (!sitemapContent.includes('eur-usd-dollar-index-outlook-fed-yields-inflation')) {
  const newUrlBlock = `  <url>
    <loc>https://www.nexcoinpr.agency/news/eur-usd-dollar-index-outlook-fed-yields-inflation</loc>
    <lastmod>2026-09-29T09:00:00Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  sitemapContent = sitemapContent.replace('</urlset>', `${newUrlBlock}</urlset>`);
  fs.writeFileSync(sitemapNewsPath, sitemapContent, 'utf8');
  console.log('Updated sitemap-news.xml with today forex article.');
}

// 4. Update news/forex.html
const forexHtmlPath = path.join(ROOT_DIR, 'news', 'forex.html');
let forexHtml = fs.readFileSync(forexHtmlPath, 'utf8');
if (!forexHtml.includes('eur-usd-dollar-index-outlook-fed-yields-inflation')) {
  const newForexCard = `              <article class="news-card" data-category="forex currencies central-banks interest-rates trading economic-data">
                <div class="news-card-image"><img src="/assets/images/news/usdjpy-forex-outlook.jpg" alt="EUR/USD &amp; US Dollar Outlook: Fed Rate Cut Expectations Face Pressure from Sticky Inflation and Treasury Yields" loading="lazy"></div>
                <div class="news-card-body">
                  <div class="news-card-meta">
                    <span class="badge badge-forex">Currencies</span>
                    <span class="news-card-date">29 Sep 2026</span>
                    <span style="font-size:0.75rem;color:var(--color-gold);margin-left:auto;">NexcoinPR Editorial</span>
                  </div>
                  <h2 class="news-card-title"><a href="/news/eur-usd-dollar-index-outlook-fed-yields-inflation">EUR/USD &amp; US Dollar Outlook: Fed Rate Cut Expectations Face Pressure from Sticky Inflation and Treasury Yields</a></h2>
                  <p class="news-card-excerpt">EUR/USD consolidates near key technical thresholds as sticky US inflation prints and elevated 10-year Treasury yields reinforce US dollar dominance across global FX sessions.</p>
                  <a href="/news/eur-usd-dollar-index-outlook-fed-yields-inflation" class="news-card-link">Read more &rarr;</a>
                </div>
              </article>\n`;

  forexHtml = forexHtml.replace('<div class="grid-3" data-news-container>', '<div class="grid-3" data-news-container>\n' + newForexCard);
  fs.writeFileSync(forexHtmlPath, forexHtml, 'utf8');
  console.log('Updated news/forex.html with today article.');
}

// 5. Update news.html: Promote today's article to Featured Story Hero Card and insert today's forex card
const newsHtmlPath = path.join(ROOT_DIR, 'news.html');
let newsHtml = fs.readFileSync(newsHtmlPath, 'utf8');

// Replace hero card if older
const heroOldPattern = /<!-- Featured News Card -->[\s\S]*?<!-- Latest News Grid -->/;
const newHeroCard = `<!-- Featured News Card -->
            <div style="margin-bottom: 2.5rem;">
              <div class="section-label">Featured Story • Today</div>
              <article class="news-hero-card" aria-label="Featured article" data-category="crypto bitcoin etf markets">
                <div class="news-hero-card-visual">
                  <img src="/assets/images/news/live-updates-bitcoin-rebounds-above-usd84-000-as-treasury-yields-steady.png" alt="Live updates: Bitcoin rebounds above $84,000 as ETFs draw in $30 million" loading="eager">
                </div>
                <div class="news-hero-card-body">
                  <div class="news-card-meta">
                    <span class="badge badge-crypto">Crypto</span>
                    <span class="news-card-date">29 September 2026</span>
                    <span style="font-size:0.8rem;color:var(--color-gold);margin-left:auto;">CoinDesk &amp; NexcoinPR</span>
                  </div>
                  <h2 class="news-hero-card-title">
                    <a href="/news/live-updates-bitcoin-rebounds-above-84000-as-etfs-draw-in-30-million" style="color: inherit;">Live Updates: Bitcoin Rebounds Above $84,000 as ETFs Draw in $30 Million</a>
                  </h2>
                  <p class="news-hero-card-excerpt">Bitcoin pushed back above the $84,000 threshold as spot exchange-traded funds registered over $30 million in net institutional inflows amidst steadying Treasury yields and resilient market liquidity.</p>
                  <a href="/news/live-updates-bitcoin-rebounds-above-84000-as-etfs-draw-in-30-million" class="btn-secondary btn-sm">Read Full Story &rarr;</a>
                </div>
              </article>
            </div>

            <!-- Latest News Grid -->`;

newsHtml = newsHtml.replace(heroOldPattern, newHeroCard);

// Also add forex card into news.html grid if not present
if (!newsHtml.includes('eur-usd-dollar-index-outlook-fed-yields-inflation')) {
  const newsForexCard = `              <!-- Daily Article: eur-usd-dollar-index-outlook-fed-yields-inflation -->
              <article class="news-card">
                <div class="news-card-image">
                  <img src="/assets/images/news/usdjpy-forex-outlook.jpg" alt="EUR/USD &amp; US Dollar Outlook: Fed Rate Cut Expectations Face Pressure from Sticky Inflation and Treasury Yields" loading="lazy">
                </div>
                <div class="news-card-body">
                  <div class="news-card-meta">
                    <span class="badge badge-forex">Forex</span>
                    <span class="news-card-date">29 Sept 2026</span>
                    <span style="font-size:0.75rem;color:var(--color-gold);margin-left:auto;">NexcoinPR Editorial</span>
                  </div>
                  <h3 class="news-card-title"><a href="/news/eur-usd-dollar-index-outlook-fed-yields-inflation">EUR/USD &amp; US Dollar Outlook: Fed Rate Cut Expectations Face Pressure from Sticky Inflation and Treasury Yields</a></h3>
                  <p class="news-card-excerpt">EUR/USD consolidates near key technical thresholds as sticky US inflation prints and elevated 10-year Treasury yields reinforce US dollar dominance.</p>
                  <a href="/news/eur-usd-dollar-index-outlook-fed-yields-inflation" class="news-card-link">Read more &rarr;</a>
                </div>
              </article>`;
  newsHtml = newsHtml.replace('<div class="grid-2" style="margin-bottom: 3rem;" data-news-container>', '<div class="grid-2" style="margin-bottom: 3rem;" data-news-container>\n' + newsForexCard);
}

fs.writeFileSync(newsHtmlPath, newsHtml, 'utf8');
console.log('Updated news.html hero card and latest news grid.');

// 6. Update index.html Section 8 (Press Releases), Section 9 (Crypto News), Section 10 (Forex News)
const indexHtmlPath = path.join(ROOT_DIR, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// SECTION 8: FEATURED PRESS RELEASES
const newSection8Pr = `      <div class="pr-grid">

        <article class="pr-card">
          <div class="pr-card-header">
            <span class="content-label content-label-pr">Press Release</span>
            <span class="badge badge-crypto">Crypto</span>
            <span class="pr-card-company">Aster</span>
            <span class="pr-card-date">29 Sep 2026</span>
          </div>
          <h3 class="pr-card-title">
            <a href="/press-releases/aster-launches-perpetual-grid-trading-20-with-up-to-140000-aster-liquidity">Aster Launches Perpetual Grid Trading 2.0 with Up to 140,000 $ASTER Liquidity Campaign</a>
          </h3>
          <p class="pr-card-excerpt">Onchain trading protocol backed by YZi Labs unveils next-generation perpetual grid trading infrastructure and substantial community liquidity program.</p>
          <div class="pr-card-footer">
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
              <span class="tag">Crypto</span>
              <a href="https://decrypt.co/379431/aster-launches-perpetual-grid-trading-2-0-with-up-to-140000-aster-liquidity-mining-campaign" target="_blank" rel="noopener nofollow" class="tag" style="text-decoration:none;">Decrypt Source &#8599;</a>
            </div>
            <a href="/press-releases/aster-launches-perpetual-grid-trading-20-with-up-to-140000-aster-liquidity" class="pr-card-read">Read full release &rarr;</a>
          </div>
        </article>

        <article class="pr-card">
          <div class="pr-card-header">
            <span class="content-label content-label-pr">Press Release</span>
            <span class="badge badge-forex">Forex &amp; B2B</span>
            <span class="pr-card-company">iFX EXPO</span>
            <span class="pr-card-date">29 Sep 2026</span>
          </div>
          <h3 class="pr-card-title">
            <a href="/press-releases/ifx-expo-unveils-trader-first-format-for-mexico-as-global-trading-brands-co">iFX EXPO Unveils Trader-First Format for Mexico as Global Trading Brands Confirm Participation</a>
          </h3>
          <p class="pr-card-excerpt">Leading retail forex brokers and technology providers gather in Mexico City as premier B2B and retail trading expo unveils specialized trader pavilion.</p>
          <div class="pr-card-footer">
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
              <span class="tag">Forex</span>
              <a href="https://financewire.com/2026/09/29/ifx-expo-unveils-trader-first-format-for-mexico-as-global-trading-brands-confirm-participation/" target="_blank" rel="noopener nofollow" class="tag" style="text-decoration:none;">FinanceWire Source &#8599;</a>
            </div>
            <a href="/press-releases/ifx-expo-unveils-trader-first-format-for-mexico-as-global-trading-brands-co" class="pr-card-read">Read full release &rarr;</a>
          </div>
        </article>

        <article class="pr-card">
          <div class="pr-card-header">
            <span class="content-label content-label-pr">Press Release</span>
            <span class="badge badge-crypto">Institutional</span>
            <span class="pr-card-company">AlgoQuant</span>
            <span class="pr-card-date">29 Sep 2026</span>
          </div>
          <h3 class="pr-card-title">
            <a href="/press-releases/algoquant-asset-management-selects-liquid-mercury-to-enhance-digital-asset">AlgoQuant Asset Management Selects Liquid Mercury to Enhance Digital Asset Trading Infrastructure</a>
          </h3>
          <p class="pr-card-excerpt">Institutional digital asset manager deploys Liquid Mercury advanced execution and algorithmic order routing architecture across professional client books.</p>
          <div class="pr-card-footer">
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
              <span class="tag">Institutional</span>
              <a href="https://decrypt.co/379437/algoquant-asset-management-selects-liquid-mercury-to-enhance-digital-asset-trading-infrastructure" target="_blank" rel="noopener nofollow" class="tag" style="text-decoration:none;">Decrypt Source &#8599;</a>
            </div>
            <a href="/press-releases/algoquant-asset-management-selects-liquid-mercury-to-enhance-digital-asset" class="pr-card-read">Read full release &rarr;</a>
          </div>
        </article>

      </div>`;

const prGridRegex = /<div class="pr-grid">[\s\S]*?<\/div>(\s*<div class="section-cta">)/;
indexHtml = indexHtml.replace(prGridRegex, `${newSection8Pr}$1`);

// SECTION 9: LATEST CRYPTO NEWS
const newSection9Crypto = `      <div class="news-grid">

        <article class="news-card">
          <div class="news-card-image">
            <img src="/assets/images/news/live-updates-bitcoin-rebounds-above-usd84-000-as-treasury-yields-steady.png" alt="Live updates: Bitcoin rebounds above $84,000 as ETFs draw in $30 million" width="360" height="200" style="aspect-ratio:16/9;object-fit:cover;" loading="lazy">
          </div>
          <div class="news-card-body">
            <span class="badge badge-crypto">Crypto Markets</span>
            <h3 class="news-card-title">
              <a href="/news/live-updates-bitcoin-rebounds-above-84000-as-etfs-draw-in-30-million">Live Updates: Bitcoin Rebounds Above $84,000 as ETFs Draw in $30 Million</a>
            </h3>
            <p class="news-card-excerpt">Bitcoin pushed back above $84,000 as spot exchange-traded funds registered over $30 million in net institutional inflows amidst steadying yields.</p>
            <div class="news-card-meta">
              <span>NexcoinPR Editorial</span>
              <time datetime="2026-09-29">29 Sep 2026</time>
            </div>
          </div>
        </article>

        <article class="news-card">
          <div class="news-card-image">
            <img src="/assets/images/news/aave-leads-defi-higher-as-crypto-shrugs-off-surging-treasury-yields.png" alt="Bitcoin recovers to $84,000 while stocks fall on bond market pressure" width="360" height="200" style="aspect-ratio:16/9;object-fit:cover;" loading="lazy">
          </div>
          <div class="news-card-body">
            <span class="badge badge-crypto">Macro &amp; DeFi</span>
            <h3 class="news-card-title">
              <a href="/news/bitcoin-recovers-to-84000-while-stocks-fall-on-bond-market-pressure">Bitcoin Recovers to $84,000 While Stocks Fall on Bond Market Pressure</a>
            </h3>
            <p class="news-card-excerpt">Digital asset markets demonstrated structural resilience as Bitcoin decoupled from broader US equities while decentralized finance tokens led sectoral gains.</p>
            <div class="news-card-meta">
              <span>NexcoinPR Editorial</span>
              <time datetime="2026-09-29">29 Sep 2026</time>
            </div>
          </div>
        </article>

        <article class="news-card">
          <div class="news-card-image">
            <img src="/assets/images/news/bitget-s-usd351-million-hack-happened-via-spoofed-transfers-not-private-keys-ceo-gray-chen-says.jpg" alt="Bitget 352 Million Hack Happened via Spoofed Transfers, Not Private Keys" width="360" height="200" style="aspect-ratio:16/9;object-fit:cover;" loading="lazy">
          </div>
          <div class="news-card-body">
            <span class="badge badge-crypto">Security</span>
            <h3 class="news-card-title">
              <a href="/news/bitgets-352-million-hack-happened-via-spoofed-transfers-not-private-keys-ce">Bitget's $352M Hack Happened Via Spoofed Transfers, Not Private Keys</a>
            </h3>
            <p class="news-card-excerpt">Bitget CEO Gray Chen clarified that recent $352M capital incident occurred due to unauthorized address spoofing mechanisms rather than compromised private keys.</p>
            <div class="news-card-meta">
              <span>NexcoinPR Editorial</span>
              <time datetime="2026-09-25">25 Sep 2026</time>
            </div>
          </div>
        </article>

      </div>`;

const cryptoNewsRegex = /<section class="section section-white" aria-labelledby="crypto-news-heading">[\s\S]*?<div class="news-grid">[\s\S]*?<\/div>(\s*<div class="section-cta">)/;
indexHtml = indexHtml.replace(cryptoNewsRegex, (match, cta) => {
  return match.replace(/<div class="news-grid">[\s\S]*?<\/div>/, newSection9Crypto);
});

// SECTION 10: LATEST FOREX NEWS
const newSection10Forex = `      <div class="news-grid">

        <article class="news-card">
          <div class="news-card-image">
            <img src="/assets/images/news/usdjpy-forex-outlook.jpg" alt="EUR/USD &amp; US Dollar Outlook: Fed Rate Cut Expectations Face Pressure from Sticky Inflation and Treasury Yields" width="360" height="200" style="aspect-ratio:16/9;object-fit:cover;" loading="lazy">
          </div>
          <div class="news-card-body">
            <span class="badge badge-forex">Forex Markets</span>
            <h3 class="news-card-title">
              <a href="/news/eur-usd-dollar-index-outlook-fed-yields-inflation">EUR/USD &amp; US Dollar Outlook: Fed Rate Cut Expectations Face Yield Pressures</a>
            </h3>
            <p class="news-card-excerpt">EUR/USD consolidates near key technical thresholds as sticky US inflation prints and elevated 10-year Treasury yields reinforce US dollar dominance.</p>
            <div class="news-card-meta">
              <span>NexcoinPR Editorial</span>
              <time datetime="2026-09-29">29 Sep 2026</time>
            </div>
          </div>
        </article>

        <article class="news-card">
          <div class="news-card-image">
            <img src="/assets/images/news/usdjpy-forex-outlook.jpg" alt="USD/JPY Outlook: Hawkish Federal Reserve Recalibration Mounts Pressure on the Japanese Yen" width="360" height="200" style="aspect-ratio:16/9;object-fit:cover;" loading="lazy">
          </div>
          <div class="news-card-body">
            <span class="badge badge-forex">Forex Markets</span>
            <h3 class="news-card-title">
              <a href="/news/usd-jpy-outlook-fed-recalibration-pressures-yen">USD/JPY Outlook: Hawkish Federal Reserve Recalibration Mounts Pressure on Yen</a>
            </h3>
            <p class="news-card-excerpt">USD/JPY pushed higher toward key resistance zones as resilient US growth data and surging Treasury yields widened the US-Japan interest rate gap.</p>
            <div class="news-card-meta">
              <span>NexcoinPR Editorial</span>
              <time datetime="2026-09-24">24 Sep 2026</time>
            </div>
          </div>
        </article>

        <article class="news-card">
          <div class="news-card-image">
            <img src="/assets/images/news/default-forex.jpg" alt="What Is Forex PR? The Complete Broker Communications Guide" width="360" height="200" style="aspect-ratio:16/9;object-fit:cover;" loading="lazy">
          </div>
          <div class="news-card-body">
            <span class="badge badge-guide">Broker Strategy</span>
            <h3 class="news-card-title">
              <a href="/news/guides/what-is-forex-pr">What Is Forex PR? The Complete Broker Communications Guide</a>
            </h3>
            <p class="news-card-excerpt">Discover how retail FX brokers, prop trading firms, and CFD platforms build institutional credibility, acquire active traders, and satisfy global regulations.</p>
            <div class="news-card-meta">
              <span>NexcoinPR Editorial</span>
              <time datetime="2026-09-23">23 Sep 2026</time>
            </div>
          </div>
        </article>

      </div>`;

const forexNewsRegex = /<section class="section section-light" aria-labelledby="forex-news-heading">[\s\S]*?<div class="news-grid">[\s\S]*?<\/div>(\s*<div class="section-cta">)/;
indexHtml = indexHtml.replace(forexNewsRegex, (match, cta) => {
  return match.replace(/<div class="news-grid">[\s\S]*?<\/div>/, newSection10Forex);
});

fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('Updated index.html Section 8, 9, 10 with today articles.');

console.log('All synchronization complete.');

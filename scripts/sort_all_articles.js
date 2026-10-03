const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

function parseArticleDate(dateStr) {
  if (!dateStr) return 0;
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d.getTime();

  const cleaned = dateStr.replace(/Sept\b/i, 'Sep');
  const d2 = new Date(cleaned);
  if (!isNaN(d2.getTime())) return d2.getTime();

  return 0;
}

function formatDate(dateObj) {
  const day = dateObj.getUTCDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[dateObj.getUTCMonth()];
  const year = dateObj.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

function formatLongDate(dateObj) {
  const day = dateObj.getUTCDate();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const month = months[dateObj.getUTCMonth()];
  const year = dateObj.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

function sortAllArticles() {
  console.log('=== Running sortAllArticles ===');

  // 1. PRESS RELEASES
  const prDir = path.join(ROOT_DIR, 'press-releases');
  const prFiles = fs.readdirSync(prDir).filter(f => f.endsWith('.html') && f !== 'sample-press-release.html');
  const pressReleases = [];

  prFiles.forEach(file => {
    const filePath = path.join(prDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const slug = file.replace(/\.html$/, '');

    let title = '';
    const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const titleTagMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
    if (h1Match) {
      title = h1Match[1].replace(/<[^>]+>/g, '').trim();
    } else if (titleTagMatch) {
      title = titleTagMatch[1].split('|')[0].trim();
    }

    let datePublished = '';
    const schemaMatch = content.match(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
    if (schemaMatch) {
      try {
        const parsed = JSON.parse(schemaMatch[1]);
        if (parsed.datePublished) datePublished = parsed.datePublished;
      } catch (e) {}
    }
    if (!datePublished) {
      const metaDate = content.match(/name=["'](?:article:published_time|date|publish-date)["']\s+content=["'](.*?)["']/i);
      if (metaDate) datePublished = metaDate[1];
    }
    if (!datePublished) {
      const publishedSpan = content.match(/Published:\s*([^<&]+)/i);
      if (publishedSpan) datePublished = publishedSpan[1].trim();
    }

    let company = 'Crypto News Issuer';
    const issuerMatch = content.match(/Issuer:\s*<strong>(.*?)<\/strong>/i);
    if (issuerMatch) {
      company = issuerMatch[1].trim();
    } else {
      const companySpan = content.match(/class=["']pr-card-company["']>([^<]+)<\/span>/i);
      if (companySpan) company = companySpan[1].trim();
    }

    let category = 'crypto';
    let categoryLabel = 'Crypto';
    if (/forex/i.test(content) || /forex/i.test(title)) {
      category = 'forex';
      categoryLabel = 'Forex';
    } else if (/financial|acquisition|nyse|nasdaq|ships|lemon/i.test(content + ' ' + title)) {
      category = 'financial';
      categoryLabel = 'Financial';
    } else if (/blockchain|defi|token|staking/i.test(content + ' ' + title)) {
      category = 'crypto';
      categoryLabel = 'Crypto';
    }

    let excerpt = '';
    const descMatch = content.match(/<meta\s+name=["']description["']\s+content=(["'])([\s\S]*?)\1/i);
    if (descMatch) excerpt = descMatch[2].trim();

    let sourceUrl = '';
    let sourceName = 'Source Link';
    const sourceMatch = content.match(/Source:\s*<a\s+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/i);
    if (sourceMatch) {
      sourceUrl = sourceMatch[1];
      sourceName = sourceMatch[2].replace(/&rarr;|→/g, '').trim();
    } else {
      sourceUrl = `https://www.nexcoinpr.agency/press-releases/${slug}`;
    }

    const timestamp = parseArticleDate(datePublished);
    const dateObj = timestamp ? new Date(timestamp) : new Date('2026-09-25T10:00:00Z');

    pressReleases.push({
      file,
      slug,
      title,
      excerpt,
      company,
      category,
      categoryLabel,
      datePublished: dateObj.toISOString(),
      formattedDate: formatLongDate(dateObj),
      sourceUrl,
      sourceName,
      timestamp: dateObj.getTime()
    });
  });

  pressReleases.sort((a, b) => b.timestamp - a.timestamp);

  const prHtmlPath = path.join(ROOT_DIR, 'press-releases.html');
  let prHtml = fs.readFileSync(prHtmlPath, 'utf8');

  const prCardsHtml = pressReleases.map(pr => {
    return `            <article class="pr-card" data-category="${pr.category} ${pr.category === 'crypto' ? 'blockchain financial' : ''}">
              <div class="pr-card-header">
                <span class="content-label">Press Release</span>
                <span class="badge badge-${pr.category}">${pr.categoryLabel}</span>
                <span class="pr-card-company">${pr.company}</span>
                <span class="pr-card-date">${pr.formattedDate}</span>
              </div>
              <h2 class="pr-card-title">
                <a href="/press-releases/${pr.slug}">${pr.title}</a>
              </h2>
              <p class="pr-card-excerpt">${pr.excerpt}</p>
              <div class="pr-card-footer">
                <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
                  <span class="tag">${pr.categoryLabel}</span>
                  <a href="${pr.sourceUrl}" target="_blank" rel="noopener nofollow" class="tag" style="text-decoration:none;">${pr.sourceName} &#8599;</a>
                </div>
                <a href="/press-releases/${pr.slug}" class="pr-card-read">Read full release &rarr;</a>
              </div>
            </article>`;
  }).join('\n');

  const prGridRegex = /(<div class=["']pr-grid["']\s+data-filter-container>)([\s\S]*?)(<\/div>\s*<!-- \/?(?:Pagination|Main Column))/i;
  const prGridMatch = prHtml.match(prGridRegex);

  if (prGridMatch) {
    prHtml = prHtml.replace(prGridRegex, () => `${prGridMatch[1]}\n${prCardsHtml}\n          ${prGridMatch[3]}`);
  }

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Press Releases",
    "itemListElement": pressReleases.map((pr, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": pr.title,
      "url": `https://www.nexcoinpr.agency/press-releases/${pr.slug}`
    }))
  };

  prHtml = prHtml.replace(
    /"mainEntity":\s*\{\s*"@type":\s*"ItemList",[\s\S]*?"itemListElement":\s*\[[\s\S]*?\]\s*\}/,
    `"mainEntity": ${JSON.stringify(itemListSchema, null, 6).replace(/\n/g, '\n    ')}`
  );

  fs.writeFileSync(prHtmlPath, prHtml, 'utf8');
  console.log(`Saved press-releases.html with ${pressReleases.length} sorted releases.`);

  // 2. NEWS ARTICLES
  const newsDir = path.join(ROOT_DIR, 'news');
  const HUB_FILES = new Set([
    'blockchain.html',
    'crypto.html',
    'financial-markets.html',
    'fintech.html',
    'forex.html',
    'guides.html',
    'web3.html'
  ]);

  const newsFiles = fs.readdirSync(newsDir).filter(f => f.endsWith('.html') && !HUB_FILES.has(f));
  const newsArticles = [];

  newsFiles.forEach(file => {
    const filePath = path.join(newsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const slug = file.replace(/\.html$/, '');

    let title = '';
    const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const titleTagMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
    if (h1Match) {
      title = h1Match[1].replace(/<[^>]+>/g, '').trim();
    } else if (titleTagMatch) {
      title = titleTagMatch[1].split('|')[0].trim();
    }

    let datePublished = '';
    let image = '/assets/images/news/aave-leads-defi-higher-as-crypto-shrugs-off-surging-treasury-yields.png';
    let author = 'NexcoinPR Editorial Desk';

    const schemaMatch = content.match(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
    if (schemaMatch) {
      try {
        const parsed = JSON.parse(schemaMatch[1]);
        if (parsed.datePublished) datePublished = parsed.datePublished;
        if (parsed.image) image = parsed.image;
        if (parsed.author && parsed.author.name) author = parsed.author.name;
      } catch (e) {}
    }
    if (!datePublished) {
      const publishedSpan = content.match(/Published:\s*([^<&]+)/i);
      if (publishedSpan) datePublished = publishedSpan[1].trim();
    }

    if (image.startsWith('https://www.nexcoinpr.agency')) {
      image = image.replace('https://www.nexcoinpr.agency', '');
    }

    let excerpt = '';
    const descMatch = content.match(/<meta\s+name=["']description["']\s+content=(["'])([\s\S]*?)\1/i);
    if (descMatch) excerpt = descMatch[2].trim();

    let category = 'Crypto';
    let badgeClass = 'badge-crypto';
    let categoryFilter = 'crypto';

    const isForex = content.includes('class="breadcrumb-item">Forex</a>') || 
                    content.includes('class="badge badge-forex">Forex</span>') ||
                    /FXStreet|Forex\.com/i.test(content) ||
                    /forex|fx|usd|eur|jpy|gbp|aud|cad|chf|currency|currencies|silver|gold|xau|xag/i.test(slug);

    const isFintech = content.includes('class="badge badge-fintech">Fintech</span>') ||
                      /fintech|ai agent/i.test(slug);

    if (isForex) {
      category = 'Forex';
      badgeClass = 'badge-forex';
      categoryFilter = 'forex currencies';
    } else if (isFintech) {
      category = 'Fintech';
      badgeClass = 'badge-fintech';
      categoryFilter = 'fintech ai';
    }

    let sourceUrl = '';
    let sourceName = 'CoinDesk';
    const sourceMatch = content.match(/Topic Source:\s*<a\s+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/i) ||
                       content.match(/Source:\s*<a\s+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/i);
    if (sourceMatch) {
      sourceUrl = sourceMatch[1];
      sourceName = sourceMatch[2].replace(/&rarr;|→/g, '').trim();
    } else {
      sourceUrl = `https://www.nexcoinpr.agency/news/${slug}`;
      sourceName = 'NexcoinPR';
    }

    const timestamp = parseArticleDate(datePublished);
    const dateObj = timestamp ? new Date(timestamp) : new Date('2026-09-24T09:00:00Z');

    newsArticles.push({
      file,
      slug,
      title,
      excerpt,
      category,
      badgeClass,
      categoryFilter,
      datePublished: dateObj.toISOString(),
      formattedDate: formatDate(dateObj),
      longFormattedDate: formatLongDate(dateObj),
      image,
      sourceUrl,
      sourceName,
      author,
      timestamp: dateObj.getTime()
    });
  });

  newsArticles.sort((a, b) => b.timestamp - a.timestamp);

  const featuredArticle = newsArticles[0];
  const gridArticles = newsArticles.slice(1);

  const newsHtmlPath = path.join(ROOT_DIR, 'news.html');
  let newsHtml = fs.readFileSync(newsHtmlPath, 'utf8');

  const featuredCardHtml = `            <!-- Featured News Card -->
            <div style="margin-bottom: 2.5rem;">
              <div class="section-label">Featured Story • Latest Breaking</div>
              <article class="news-hero-card" aria-label="Featured article" data-category="${featuredArticle.categoryFilter}">
                <div class="news-hero-card-visual">
                  <img src="${featuredArticle.image}" alt="${featuredArticle.title}" loading="eager">
                </div>
                <div class="news-hero-card-body">
                  <div class="news-card-meta">
                    <span class="badge ${featuredArticle.badgeClass}">${featuredArticle.category}</span>
                    <span class="news-card-date">${featuredArticle.longFormattedDate}</span>
                    <span style="font-size:0.8rem;color:var(--color-gold);margin-left:auto;">${featuredArticle.sourceName} &amp; NexcoinPR</span>
                  </div>
                  <h2 class="news-hero-card-title">
                    <a href="/news/${featuredArticle.slug}" style="color: inherit;">${featuredArticle.title}</a>
                  </h2>
                  <p class="news-hero-card-excerpt">${featuredArticle.excerpt}</p>
                  <a href="/news/${featuredArticle.slug}" class="btn-secondary btn-sm">Read Full Story &rarr;</a>
                </div>
              </article>
            </div>`;

  const featuredRegex = /<!-- Featured News Card -->[\s\S]*?<\/article>\s*<\/div>/i;
  if (newsHtml.match(featuredRegex)) {
    newsHtml = newsHtml.replace(featuredRegex, () => featuredCardHtml);
  }

  const newsGridCardsHtml = gridArticles.map(article => {
    return `              <!-- Article: ${article.slug} -->
              <article class="news-card" data-category="${article.categoryFilter}">
                <div class="news-card-image">
                  <img src="${article.image}" alt="${article.title}" loading="lazy">
                </div>
                <div class="news-card-body">
                  <div class="news-card-meta">
                    <span class="badge ${article.badgeClass}">${article.category}</span>
                    <span class="news-card-date">${article.formattedDate}</span>
                    <a href="${article.sourceUrl}" target="_blank" rel="noopener nofollow" style="font-size:0.75rem;color:var(--color-gold);text-decoration:none;margin-left:auto;">${article.sourceName} &#8599;</a>
                  </div>
                  <h3 class="news-card-title"><a href="/news/${article.slug}">${article.title}</a></h3>
                  <p class="news-card-excerpt">${article.excerpt}</p>
                  <a href="/news/${article.slug}" class="news-card-link">Read more &rarr;</a>
                </div>
              </article>`;
  }).join('\n');

  const newsGridRegex = /(<div class=["']grid-2["'][^>]*data-news-container>)([\s\S]*?)(<\/div>\s*<!-- Guides Section Preview -->)/i;
  const newsGridMatch = newsHtml.match(newsGridRegex);

  if (newsGridMatch) {
    newsHtml = newsHtml.replace(newsGridRegex, () => `${newsGridMatch[1]}\n${newsGridCardsHtml}\n            ${newsGridMatch[3]}`);
  }

  fs.writeFileSync(newsHtmlPath, newsHtml, 'utf8');
  console.log(`Saved news.html with ${newsArticles.length} sorted articles.`);

  // 3. Update category pages
  const cryptoHtmlPath = path.join(ROOT_DIR, 'news', 'crypto.html');
  if (fs.existsSync(cryptoHtmlPath)) {
    let cryptoHtml = fs.readFileSync(cryptoHtmlPath, 'utf8');
    const cryptoArticles = newsArticles.filter(n => n.category === 'Crypto' || n.category === 'Fintech');
    const cryptoCardsHtml = cryptoArticles.map(article => `              <article class="news-card">
                <div class="news-card-image"><img src="${article.image}" alt="${article.title}" loading="lazy"></div>
                <div class="news-card-body">
                  <div class="news-card-meta">
                    <span class="badge ${article.badgeClass}">${article.category}</span>
                    <span class="news-card-date">${article.formattedDate}</span>
                    <a href="${article.sourceUrl}" target="_blank" rel="noopener nofollow" style="font-size:0.75rem;color:var(--color-gold);text-decoration:none;margin-left:auto;">${article.sourceName} &#8599;</a>
                  </div>
                  <h2 class="news-card-title"><a href="/news/${article.slug}">${article.title}</a></h2>
                  <p class="news-card-excerpt">${article.excerpt}</p>
                  <a href="/news/${article.slug}" class="news-card-link">Read more &rarr;</a>
                </div>
              </article>`).join('\n');

    const cryptoGridRegex = /(<div class=["'](?:grid-3|grid-2)["'][^>]*data-news-container>)([\s\S]*?)(<\/div>\s*<div style=["']margin-top:\s*2\.5rem;["']>)/i;
    const cryptoGridMatch = cryptoHtml.match(cryptoGridRegex);
    if (cryptoGridMatch) {
      cryptoHtml = cryptoHtml.replace(cryptoGridRegex, () => `${cryptoGridMatch[1]}\n${cryptoCardsHtml}\n            ${cryptoGridMatch[3]}`);
      fs.writeFileSync(cryptoHtmlPath, cryptoHtml, 'utf8');
      console.log(`Saved news/crypto.html with ${cryptoArticles.length} sorted articles.`);
    }
  }

  const forexHtmlPath = path.join(ROOT_DIR, 'news', 'forex.html');
  if (fs.existsSync(forexHtmlPath)) {
    let forexHtml = fs.readFileSync(forexHtmlPath, 'utf8');
    const forexArticles = newsArticles.filter(n => n.category === 'Forex');
    const forexCardsHtml = forexArticles.map(article => `              <article class="news-card">
                <div class="news-card-image"><img src="${article.image}" alt="${article.title}" loading="lazy"></div>
                <div class="news-card-body">
                  <div class="news-card-meta">
                    <span class="badge ${article.badgeClass}">${article.category}</span>
                    <span class="news-card-date">${article.formattedDate}</span>
                    <a href="${article.sourceUrl}" target="_blank" rel="noopener nofollow" style="font-size:0.75rem;color:var(--color-gold);text-decoration:none;margin-left:auto;">${article.sourceName} &#8599;</a>
                  </div>
                  <h2 class="news-card-title"><a href="/news/${article.slug}">${article.title}</a></h2>
                  <p class="news-card-excerpt">${article.excerpt}</p>
                  <a href="/news/${article.slug}" class="news-card-link">Read more &rarr;</a>
                </div>
              </article>`).join('\n');

    const forexGridRegex = /(<div class=["'](?:grid-3|grid-2)["'][^>]*data-news-container>)([\s\S]*?)(<\/div>\s*<div style=["']margin-top:\s*2\.5rem;["']>)/i;
    const forexGridMatch = forexHtml.match(forexGridRegex);
    if (forexGridMatch) {
      forexHtml = forexHtml.replace(forexGridRegex, () => `${forexGridMatch[1]}\n${forexCardsHtml}\n            ${forexGridMatch[3]}`);
      fs.writeFileSync(forexHtmlPath, forexHtml, 'utf8');
      console.log(`Saved news/forex.html with ${forexArticles.length} sorted articles.`);
    }
  }

  // 4. Update index.html featured press releases to the latest 3
  const indexPath = path.join(ROOT_DIR, 'index.html');
  if (fs.existsSync(indexPath) && pressReleases.length >= 3) {
    let indexHtml = fs.readFileSync(indexPath, 'utf8');
    const top3Pr = pressReleases.slice(0, 3);
    const top3Html = top3Pr.map(pr => `        <article class="pr-card">
          <div class="pr-card-header">
            <span class="content-label content-label-pr">Press Release</span>
            <span class="badge badge-${pr.category}">${pr.categoryLabel}</span>
            <span class="pr-card-company">${pr.company}</span>
            <span class="pr-card-date">${formatDate(new Date(pr.timestamp))}</span>
          </div>
          <h3 class="pr-card-title">
            <a href="/press-releases/${pr.slug}">${pr.title}</a>
          </h3>
          <p class="pr-card-excerpt">${pr.excerpt}</p>
          <div class="pr-card-footer">
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
              <span class="tag">${pr.categoryLabel}</span>
              <a href="${pr.sourceUrl}" target="_blank" rel="noopener nofollow" class="tag" style="text-decoration:none;">${pr.sourceName} &#8599;</a>
            </div>
            <a href="/press-releases/${pr.slug}" class="pr-card-read">Read full release &rarr;</a>
          </div>
        </article>`).join('\n\n');

    const indexPrRegex = /(<div class=["']pr-grid["']>)([\s\S]*?)(<\/div>\s*<div class=["']section-cta["']>)/i;
    const indexPrMatch = indexHtml.match(indexPrRegex);
    if (indexPrMatch) {
      indexHtml = indexHtml.replace(indexPrRegex, () => `${indexPrMatch[1]}\n\n${top3Html}\n\n      ${indexPrMatch[3]}`);
      fs.writeFileSync(indexPath, indexHtml, 'utf8');
      console.log('Updated index.html with latest 3 press releases.');
    }
  }
}

if (require.main === module) {
  sortAllArticles();
}

module.exports = { sortAllArticles };

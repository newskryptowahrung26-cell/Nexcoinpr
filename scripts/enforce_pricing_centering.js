const fs = require('fs');
const path = require('path');

const files = [
  'crypto-pr.html',
  'blockchain-pr.html',
  'web3-pr.html',
  'forex-pr.html',
  'fintech-pr.html',
  'financial-pr.html',
  'press-release-distribution.html'
];

const styleBlock = `  <style>
    /* Absolute Centering Enforcement for Pricing Packages */
    .pricing-card { text-align: center !important; display: flex !important; flex-direction: column !important; align-items: center !important; }
    .pricing-name, .pricing-title { text-align: center !important; width: 100% !important; margin-inline: auto !important; }
    .pricing-price, .pricing-price-box { display: flex !important; align-items: baseline !important; justify-content: center !important; text-align: center !important; width: 100% !important; margin-inline: auto !important; }
    .pricing-desc { text-align: center !important; width: 100% !important; margin-inline: auto !important; }
    .traffic-pill { display: flex !important; justify-content: center !important; text-align: center !important; width: 100% !important; margin-inline: auto !important; }
    .pricing-feature-list { width: 100% !important; text-align: left !important; list-style: none !important; padding: 0 !important; margin: 0 !important; }
    .pricing-feature-list li { display: block !important; position: relative !important; padding-left: 28px !important; text-align: left !important; line-height: 1.5 !important; }
    .pricing-feature-list li::before { content: '✓' !important; position: absolute !important; left: 0 !important; top: 1px !important; width: 20px !important; height: 20px !important; background: rgba(15, 123, 76, 0.1) !important; color: var(--color-blockchain) !important; border-radius: var(--radius-full) !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 0.7rem !important; font-weight: var(--font-weight-bold) !important; line-height: 20px !important; text-align: center !important; }
    .pricing-card .btn-ghost, .pricing-card .btn-secondary { width: 100% !important; text-align: center !important; justify-content: center !important; display: inline-flex !important; color: var(--color-gold) !important; border: 2px solid var(--color-gold) !important; background-color: transparent !important; }
    .pricing-card .btn-ghost:hover, .pricing-card .btn-secondary:hover { background-color: var(--color-gold) !important; color: var(--color-navy) !important; }
    .pricing-card .btn-primary { width: 100% !important; text-align: center !important; justify-content: center !important; display: inline-flex !important; }
    .disclaimer-box { text-align: center !important; margin-inline: auto !important; }
  </style>`;

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping missing ${file}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add styleBlock if not present
  if (!content.includes('Absolute Centering Enforcement for Pricing Packages')) {
    content = content.replace('</head>', `${styleBlock}\n</head>`);
  }

  // 2. Change btn-ghost inside pricing-card to btn-secondary
  // Match: <a href="/contact.html?plan=..." class="btn-ghost" ...>
  content = content.replace(/(<a\s+href="[^"]*plan=[^"]*"\s+)class="btn-ghost"/g, '$1class="btn-secondary"');

  // 3. Update CSS link tags to add ?v=4.0
  content = content.replace(/\/assets\/css\/main\.css(\?v=[^"]*)?/g, '/assets/css/main.css?v=4.0');
  content = content.replace(/\/assets\/css\/components\.css(\?v=[^"]*)?/g, '/assets/css/components.css?v=4.0');
  content = content.replace(/\/assets\/css\/pages\.css(\?v=[^"]*)?/g, '/assets/css/pages.css?v=4.0');

  // 4. Update pricing-name, pricing-price, pricing-desc inline
  content = content.replace(/<div class="pricing-name">/g, '<div class="pricing-name" style="text-align: center; width: 100%;">');
  content = content.replace(/<div class="pricing-price">/g, '<div class="pricing-price" style="display: flex; align-items: baseline; justify-content: center; text-align: center; width: 100%;">');
  content = content.replace(/<p class="pricing-desc">/g, '<p class="pricing-desc" style="text-align: center; width: 100%;">');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});

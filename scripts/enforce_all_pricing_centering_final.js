const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const cssSnippet = `
/* Absolute Centering Enforcement for Pricing Packages & Cards */
html, body {
  overflow-x: hidden !important;
  max-width: 100% !important;
}

#packages .container,
.pricing-section .container,
.container {
  margin-left: auto !important;
  margin-right: auto !important;
}

#packages .grid-4,
.pricing-section .grid-4 {
  display: grid !important;
  gap: var(--space-6) !important;
  justify-content: center !important;
  justify-items: center !important;
  margin-left: auto !important;
  margin-right: auto !important;
  width: 100% !important;
}

@media (min-width: 1100px) {
  #packages .grid-4,
  .pricing-section .grid-4 {
    grid-template-columns: repeat(4, 1fr) !important;
  }
}

@media (min-width: 768px) and (max-width: 1099px) {
  #packages .grid-4,
  .pricing-section .grid-4 {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 767px) {
  #packages .grid-4,
  .pricing-section .grid-4 {
    grid-template-columns: 1fr !important;
  }
}

.pricing-card {
  text-align: center !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: flex-start !important;
  margin-left: auto !important;
  margin-right: auto !important;
  width: 100% !important;
}

.pricing-name,
.pricing-title {
  text-align: center !important;
  width: 100% !important;
  margin-left: auto !important;
  margin-right: auto !important;
}

.pricing-price,
.pricing-price-box {
  display: flex !important;
  align-items: baseline !important;
  justify-content: center !important;
  text-align: center !important;
  width: 100% !important;
  margin-left: auto !important;
  margin-right: auto !important;
}

.pricing-desc {
  text-align: center !important;
  width: 100% !important;
  margin-left: auto !important;
  margin-right: auto !important;
}

.traffic-pill {
  display: flex !important;
  justify-content: center !important;
  text-align: center !important;
  width: 100% !important;
  margin-left: auto !important;
  margin-right: auto !important;
}

/* 100% Centered Feature List - Eliminating Left Gaps */
.pricing-feature-list {
  width: 100% !important;
  text-align: center !important;
  list-style: none !important;
  padding: 0 !important;
  margin: 0 auto 1.5rem auto !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 0.65rem !important;
}

.pricing-feature-list li {
  display: block !important;
  text-align: center !important;
  padding: 0 !important;
  margin: 0 auto !important;
  width: 100% !important;
  font-size: var(--font-size-sm) !important;
  color: var(--color-text-secondary) !important;
  line-height: 1.5 !important;
  position: static !important;
}

.pricing-feature-list li::before {
  content: '✓' !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 18px !important;
  height: 18px !important;
  min-width: 18px !important;
  min-height: 18px !important;
  background: rgba(15, 123, 76, 0.1) !important;
  color: var(--color-blockchain) !important;
  border-radius: var(--radius-full) !important;
  font-size: 0.7rem !important;
  font-weight: var(--font-weight-bold) !important;
  margin-right: 6px !important;
  vertical-align: -2px !important;
  position: static !important;
}

.pricing-pub-list {
  width: 100% !important;
  text-align: center !important;
  list-style: none !important;
  padding: 0 !important;
  margin: 0 auto 1.5rem auto !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 0.5rem !important;
}

.pricing-pub-list li {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  width: 100% !important;
  gap: 8px !important;
}

.pricing-pub-list li span {
  flex: none !important;
}

.pricing-card .btn-ghost,
.pricing-card .btn-secondary {
  width: 100% !important;
  text-align: center !important;
  justify-content: center !important;
  display: inline-flex !important;
  color: var(--color-gold) !important;
  border: 2px solid var(--color-gold) !important;
  background-color: transparent !important;
  margin-top: auto !important;
}

.pricing-card .btn-ghost:hover,
.pricing-card .btn-secondary:hover {
  background-color: var(--color-gold) !important;
  color: var(--color-navy) !important;
}

.pricing-card .btn-primary {
  width: 100% !important;
  text-align: center !important;
  justify-content: center !important;
  display: inline-flex !important;
  margin-top: auto !important;
}

.disclaimer-box {
  text-align: center !important;
  margin-inline: auto !important;
}
`;

// 1. Update components.css
const compCssPath = path.join(rootDir, 'assets', 'css', 'components.css');
let compCss = fs.readFileSync(compCssPath, 'utf8');
if (!compCss.includes('100% Centered Feature List')) {
  compCss += '\n' + cssSnippet;
  fs.writeFileSync(compCssPath, compCss, 'utf8');
  console.log('Updated components.css');
}

// 2. Update main.css
const mainCssPath = path.join(rootDir, 'assets', 'css', 'main.css');
let mainCss = fs.readFileSync(mainCssPath, 'utf8');
if (!mainCss.includes('overflow-x: hidden !important')) {
  mainCss += '\n' + cssSnippet;
  fs.writeFileSync(mainCssPath, mainCss, 'utf8');
  console.log('Updated main.css');
}

// 3. Update the 8 service and pricing HTML files
const htmlFiles = [
  'crypto-pr.html',
  'blockchain-pr.html',
  'web3-pr.html',
  'forex-pr.html',
  'fintech-pr.html',
  'financial-pr.html',
  'press-release-distribution.html',
  'pricing.html'
];

htmlFiles.forEach(fileName => {
  const filePath = path.join(rootDir, fileName);
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // Replace existing style block with new centering rules
  const styleStart = html.indexOf('<style>');
  const styleEnd = html.indexOf('</style>');

  if (styleStart !== -1 && styleEnd !== -1) {
    html = html.substring(0, styleStart + 7) + '\n' + cssSnippet + '\n' + html.substring(styleEnd);
  } else {
    // Insert style before </head>
    const headEnd = html.indexOf('</head>');
    if (headEnd !== -1) {
      html = html.substring(0, headEnd) + `  <style>${cssSnippet}</style>\n` + html.substring(headEnd);
    }
  }

  // Update inline styles on .pricing-feature-list to be centered
  html = html.replace(/<ul class="pricing-feature-list" style="[^"]*">/g, '<ul class="pricing-feature-list" style="width: 100%; text-align: center; list-style: none; padding: 0; margin: 0 auto 1.5rem auto; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.65rem;">');
  html = html.replace(/<ul class="pricing-feature-list">/g, '<ul class="pricing-feature-list" style="width: 100%; text-align: center; list-style: none; padding: 0; margin: 0 auto 1.5rem auto; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.65rem;">');

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Updated ${fileName} with centered pricing styles`);
});

/**
 * NexcoinPR — Favicon Generator
 * Creates a proper SVG favicon and PNG references to the generated favicon image.
 * 
 * The actual .ico / .png files must be exported from the JPEG using an image editor
 * or online tool like favicon.io. This script patches all HTML files to point to
 * the correct favicon paths and generates an SVG fallback favicon.
 */

const fs   = require('fs');
const path = require('path');

const BASE_DIR = path.resolve('d:/Agency Site');

// Generate SVG favicon — pure SVG version matching the brand icon
const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#E8C86A;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#C9A84C;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#9A7A2F;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0D1F3C;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0A1628;stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- Background hex shape -->
  <rect width="64" height="64" rx="10" fill="url(#bgGrad)"/>
  <!-- Hexagon outline -->
  <polygon points="32,4 56,18 56,46 32,60 8,46 8,18" fill="none" stroke="url(#goldGrad)" stroke-width="3.5"/>
  <!-- Circuit lines subtle -->
  <line x1="20" y1="24" x2="14" y2="30" stroke="#C9A84C" stroke-width="1" opacity="0.5"/>
  <line x1="44" y1="24" x2="50" y2="30" stroke="#C9A84C" stroke-width="1" opacity="0.5"/>
  <line x1="20" y1="40" x2="14" y2="34" stroke="#C9A84C" stroke-width="1" opacity="0.5"/>
  <line x1="44" y1="40" x2="50" y2="34" stroke="#C9A84C" stroke-width="1" opacity="0.5"/>
  <circle cx="14" cy="30" r="2" fill="#C9A84C" opacity="0.6"/>
  <circle cx="50" cy="30" r="2" fill="#C9A84C" opacity="0.6"/>
  <!-- Arrow up -->
  <polygon points="32,12 42,28 37,28 37,50 27,50 27,28 22,28" fill="url(#goldGrad)"/>
</svg>`;

// Save SVG favicon
fs.writeFileSync(path.join(BASE_DIR, 'favicon.svg'), svgFavicon);
console.log('Created favicon.svg');

// Read all HTML files and patch favicon references
function getHtmlFiles(dir) {
  let results = [];
  const list  = fs.readdirSync(dir);
  list.forEach(function (file) {
    const fullPath = path.join(dir, file);
    const stat     = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const faviconBlock = `  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/jpeg" href="/assets/images/nexcoinpr-favicon.jpg" sizes="32x32">
  <link rel="apple-touch-icon" href="/assets/images/nexcoinpr-favicon.jpg">
  <meta property="og:image" content="https://nexcoinpr.com/assets/images/nexcoinpr-logo-dark.jpg">`;

const htmlFiles = getHtmlFiles(BASE_DIR);
let patched = 0;

htmlFiles.forEach(function (filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Only add if favicon block not already present
  if (!content.includes('favicon.svg') && content.includes('</head>')) {
    content = content.replace('</head>', faviconBlock + '\n</head>');
    fs.writeFileSync(filePath, content);
    patched++;
  }
});

console.log('Patched ' + patched + ' HTML files with favicon and OG image references.');
console.log('Done! Favicon assets:');
console.log('  - favicon.svg (SVG, auto-generated, crisp at all sizes)');
console.log('  - assets/images/nexcoinpr-favicon.jpg (PNG fallback — rename to .png for best compatibility)');
console.log('  - assets/images/nexcoinpr-logo-dark.jpg (dark/nav logo)');
console.log('  - assets/images/nexcoinpr-logo-light.jpg (white bg logo)');

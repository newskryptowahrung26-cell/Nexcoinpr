const fs = require('fs');
const path = require('path');

console.log('=== Injecting Prominent WhatsApp (+971-582021752) Buttons Everywhere ===');

const waUrl = 'https://wa.me/971582021752';
const waNumber = '+971-582021752';

const waSvgWhite = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2Z" fill="#FFFFFF"/><path d="M9.34 7.62C9.17 7.62 8.89 7.68 8.66 7.93C8.42 8.18 7.76 8.8 7.76 10.05C7.76 11.3 8.67 12.51 8.8 12.68C8.93 12.85 10.56 15.35 13.06 16.43C15.14 17.33 15.56 17.15 16.02 17.11C16.48 17.07 17.5 16.5 17.71 15.92C17.92 15.34 17.92 14.84 17.85 14.74C17.78 14.64 17.59 14.58 17.31 14.44C17.03 14.3 15.68 13.63 15.43 13.54C15.18 13.45 15 13.4 14.82 13.68C14.64 13.96 14.12 14.58 13.96 14.76C13.8 14.94 13.64 14.96 13.36 14.82C13.08 14.68 12.18 14.38 11.11 13.43C10.28 12.69 9.72 11.78 9.56 11.5C9.4 11.22 9.54 11.07 9.68 10.93C9.81 10.8 9.97 10.58 10.11 10.42C10.25 10.26 10.3 10.14 10.39 9.96C10.48 9.78 10.43 9.62 10.36 9.48C10.29 9.34 9.73 7.97 9.5 7.42C9.28 6.89 9.05 6.96 8.88 6.95C8.72 6.95 8.53 6.95 8.34 6.95L9.34 7.62Z" fill="#25D366"/></svg>`;

const headerWaBtn = `<a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="nav-whatsapp-btn" style="display:inline-flex;align-items:center;gap:6px;background:#25D366;color:#FFFFFF;font-size:0.84rem;font-weight:700;padding:8px 14px;border-radius:6px;text-decoration:none;margin-left:8px;box-shadow:0 2px 8px rgba(37,211,102,0.3);flex-shrink:0;" title="Direct WhatsApp Chat (+971-582021752)">${waSvgWhite}<span>WhatsApp</span></a>`;

const floatingWidgetHtml = `
<!-- Permanent Floating WhatsApp Direct Contact -->
<a href="${waUrl}" id="site-floating-whatsapp" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp (+971-582021752)" style="position:fixed;bottom:24px;right:24px;z-index:999999;display:flex;align-items:center;gap:10px;background:#25D366;color:#FFFFFF;padding:12px 20px;border-radius:50px;box-shadow:0 6px 25px rgba(37,211,102,0.5);text-decoration:none;font-family:system-ui,-apple-system,sans-serif;font-size:0.92rem;font-weight:700;transition:transform 0.2s ease,box-shadow 0.2s ease;cursor:pointer;">
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="flex-shrink:0;"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2Z" fill="#FFFFFF"/><path d="M9.34 7.62C9.17 7.62 8.89 7.68 8.66 7.93C8.42 8.18 7.76 8.8 7.76 10.05C7.76 11.3 8.67 12.51 8.8 12.68C8.93 12.85 10.56 15.35 13.06 16.43C15.14 17.33 15.56 17.15 16.02 17.11C16.48 17.07 17.5 16.5 17.71 15.92C17.92 15.34 17.92 14.84 17.85 14.74C17.78 14.64 17.59 14.58 17.31 14.44C17.03 14.3 15.68 13.63 15.43 13.54C15.18 13.45 15 13.4 14.82 13.68C14.64 13.96 14.12 14.58 13.96 14.76C13.8 14.94 13.64 14.96 13.36 14.82C13.08 14.68 12.18 14.38 11.11 13.43C10.28 12.69 9.72 11.78 9.56 11.5C9.4 11.22 9.54 11.07 9.68 10.93C9.81 10.8 9.97 10.58 10.11 10.42C10.25 10.26 10.3 10.14 10.39 9.96C10.48 9.78 10.43 9.62 10.36 9.48C10.29 9.34 9.73 7.97 9.5 7.42C9.28 6.89 9.05 6.96 8.88 6.95C8.72 6.95 8.53 6.95 8.34 6.95L9.34 7.62Z" fill="#25D366"/></svg>
  <span>WhatsApp (+971-582021752)</span>
</a>
`;

function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'scratch') {
        getHtmlFiles(filePath, fileList);
      }
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const htmlFiles = getHtmlFiles('.');
let navUpdated = 0;
let floatingUpdated = 0;

htmlFiles.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;

  // 1. Add WhatsApp button in top nav header beside "Submit Press Release"
  if (!content.includes('nav-whatsapp-btn')) {
    const navCtaPattern = /(<a\s+href="\/press-release-distribution(?:\.html)?"\s+class="btn-primary\s+nav-cta">Submit Press Release<\/a>)/i;
    if (navCtaPattern.test(content)) {
      content = content.replace(navCtaPattern, `$1\n      ${headerWaBtn}`);
      changed = true;
      navUpdated++;
    }
  }

  // 2. Add Floating widget HTML right before </body>
  if (!content.includes('site-floating-whatsapp') && content.includes('</body>')) {
    content = content.replace('</body>', `${floatingWidgetHtml}\n</body>`);
    changed = true;
    floatingUpdated++;
  }

  if (changed) {
    fs.writeFileSync(f, content, 'utf8');
  }
});

console.log(`Added Header WhatsApp button to ${navUpdated} HTML files.`);
console.log(`Added Floating WhatsApp HTML widget to ${floatingUpdated} HTML files.`);

// 3. Add to Hero CTAs on index.html
let indexContent = fs.readFileSync('index.html', 'utf8');
if (!indexContent.includes('hero-whatsapp-btn')) {
  const heroCtaPattern = /(<div class="hero-ctas">[\s\S]*?)(<\/div>)/i;
  const heroWaBtn = `  <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-supporting hero-whatsapp-btn" style="display:inline-flex;align-items:center;gap:8px;border-color:#25D366;color:#25D366;background:rgba(37,211,102,0.12);font-weight:700;">${waSvgWhite}<span>Chat on WhatsApp (+971-582021752)</span></a>\n          `;
  if (heroCtaPattern.test(indexContent)) {
    indexContent = indexContent.replace(heroCtaPattern, `$1${heroWaBtn}$2`);
    fs.writeFileSync('index.html', indexContent, 'utf8');
    console.log('Added WhatsApp CTA button to Homepage Hero section!');
  }
}

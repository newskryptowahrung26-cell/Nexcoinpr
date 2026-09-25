const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const Terser = require('terser');

const ROOT = path.resolve(__dirname, '..');

// Helper to get all HTML files
function getAllHtml(dir) {
  let res = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== 'node_modules' && e.name !== '.git') {
      res = res.concat(getAllHtml(full));
    } else if (e.name.endsWith('.html')) {
      res.push(full);
    }
  });
  return res;
}

async function run() {
  console.log('=== STARTING PERMANENT ASSET MINIFICATION ===\n');

  // 1. Clean .html extensions in main.js
  const mainJsPath = path.join(ROOT, 'assets', 'js', 'main.js');
  let mainJsContent = fs.readFileSync(mainJsPath, 'utf8');
  
  // Replace links in main.js
  const htmlReplacements = [
    { from: '/crypto-pr.html', to: '/crypto-pr' },
    { from: '/forex-pr.html', to: '/forex-pr' },
    { from: '/blockchain-pr.html', to: '/blockchain-pr' },
    { from: '/web3-pr.html', to: '/web3-pr' },
    { from: '/fintech-pr.html', to: '/fintech-pr' },
    { from: '/financial-pr.html', to: '/financial-pr' },
    { from: '/press-release-distribution.html', to: '/press-release-distribution' },
    { from: '/press-releases.html', to: '/press-releases' },
    { from: '/news.html', to: '/news' },
    { from: '/news/crypto.html', to: '/news/crypto' },
    { from: '/news/forex.html', to: '/news/forex' },
    { from: '/news/blockchain.html', to: '/news/blockchain' },
    { from: '/news/web3.html', to: '/news/web3' },
    { from: '/news/fintech.html', to: '/news/fintech' },
    { from: '/news/financial-markets.html', to: '/news/financial-markets' },
    { from: '/news/guides.html', to: '/news/guides' },
    { from: '/pricing.html', to: '/pricing' },
    { from: '/media.html', to: '/media' },
    { from: '/about.html', to: '/about' },
    { from: '/contact.html', to: '/contact' }
  ];

  for (const r of htmlReplacements) {
    mainJsContent = mainJsContent.split(`'${r.from}'`).join(`'${r.to}'`);
    mainJsContent = mainJsContent.split(`"${r.from}"`).join(`"${r.to}"`);
  }
  fs.writeFileSync(mainJsPath, mainJsContent, 'utf8');
  console.log('Cleaned all .html extensions in assets/js/main.js');

  // 2. Minify CSS files
  const cssFiles = [
    'assets/css/main.css',
    'assets/css/components.css',
    'assets/css/pages.css',
    'assets/css/markets.css'
  ];

  const cleanCss = new CleanCSS({ level: 2 });

  for (const relCss of cssFiles) {
    const fullCssPath = path.join(ROOT, relCss);
    if (!fs.existsSync(fullCssPath)) continue;
    const rawCss = fs.readFileSync(fullCssPath, 'utf8');
    const minified = cleanCss.minify(rawCss);
    if (minified.errors && minified.errors.length > 0) {
      console.error(`Error minifying ${relCss}:`, minified.errors);
      continue;
    }
    const minCssPath = fullCssPath.replace(/\.css$/, '.min.css');
    fs.writeFileSync(minCssPath, minified.styles, 'utf8');
    // Also overwrite non-.min file with minified content as fallback
    fs.writeFileSync(fullCssPath, minified.styles, 'utf8');
    console.log(`Minified ${relCss}: ${rawCss.length} bytes -> ${minified.styles.length} bytes (${((1 - minified.styles.length / rawCss.length) * 100).toFixed(1)}% savings)`);
  }

  // 3. Minify JS files
  const jsFiles = [
    { rel: 'assets/js/main.js', mangle: true },
    { rel: 'assets/js/markets.js', mangle: false }
  ];

  for (const item of jsFiles) {
    const fullJsPath = path.join(ROOT, item.rel);
    if (!fs.existsSync(fullJsPath)) continue;
    const rawJs = fs.readFileSync(fullJsPath, 'utf8');
    const minified = await Terser.minify(rawJs, {
      compress: {
        dead_code: true,
        drop_debugger: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        keep_fargs: false,
        hoist_vars: true,
        if_return: true,
        join_vars: true,
        side_effects: true
      },
      mangle: item.mangle
    });

    if (minified.error) {
      console.error(`Error minifying ${item.rel}:`, minified.error);
      continue;
    }
    const minJsPath = fullJsPath.replace(/\.js$/, '.min.js');
    fs.writeFileSync(minJsPath, minified.code, 'utf8');
    // Also overwrite non-.min file with minified content
    fs.writeFileSync(fullJsPath, minified.code, 'utf8');
    console.log(`Minified ${item.rel}: ${rawJs.length} bytes -> ${minified.code.length} bytes (${((1 - minified.code.length / rawJs.length) * 100).toFixed(1)}% savings)`);
  }

  // 4. Update all HTML files
  console.log('\nUpdating asset links in all HTML files...');
  const htmlFiles = getAllHtml(ROOT);
  let updatedCount = 0;

  for (const htmlFile of htmlFiles) {
    let content = fs.readFileSync(htmlFile, 'utf8');
    let changed = false;

    // Replace main.css with main.min.css?v=8.0
    if (content.match(/\/assets\/css\/main\.css(\?v=[0-9.]+)?/g)) {
      content = content.replace(/\/assets\/css\/main\.css(\?v=[0-9.]+)?/g, '/assets/css/main.min.css?v=8.0');
      changed = true;
    }
    // Replace components.css with components.min.css?v=8.0
    if (content.match(/\/assets\/css\/components\.css(\?v=[0-9.]+)?/g)) {
      content = content.replace(/\/assets\/css\/components\.css(\?v=[0-9.]+)?/g, '/assets/css/components.min.css?v=8.0');
      changed = true;
    }
    // Replace pages.css with pages.min.css?v=8.0
    if (content.match(/\/assets\/css\/pages\.css(\?v=[0-9.]+)?/g)) {
      content = content.replace(/\/assets\/css\/pages\.css(\?v=[0-9.]+)?/g, '/assets/css/pages.min.css?v=8.0');
      changed = true;
    }
    // Replace markets.css with markets.min.css?v=8.0
    if (content.match(/\/assets\/css\/markets\.css(\?v=[0-9.]+)?/g)) {
      content = content.replace(/\/assets\/css\/markets\.css(\?v=[0-9.]+)?/g, '/assets/css/markets.min.css?v=8.0');
      changed = true;
    }

    // Replace main.js with main.min.js?v=8.0
    if (content.match(/\/assets\/js\/main\.js(\?v=[0-9.]+)?/g)) {
      content = content.replace(/\/assets\/js\/main\.js(\?v=[0-9.]+)?/g, '/assets/js/main.min.js?v=8.0');
      changed = true;
    }
    // Replace markets.js with markets.min.js?v=8.0
    if (content.match(/\/assets\/js\/markets\.js(\?v=[0-9.]+)?/g)) {
      content = content.replace(/\/assets\/js\/markets\.js(\?v=[0-9.]+)?/g, '/assets/js/markets.min.js?v=8.0');
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(htmlFile, content, 'utf8');
      updatedCount++;
    }
  }

  console.log(`Successfully updated asset links in ${updatedCount} HTML files.`);
  console.log('\n=== PERMANENT MINIFICATION COMPLETE ===');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

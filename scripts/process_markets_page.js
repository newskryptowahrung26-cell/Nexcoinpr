const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const Terser = require('terser');

const ROOT = path.resolve(__dirname, '..');
const marketsHtmlPath = path.join(ROOT, 'markets.html');

let content = fs.readFileSync(marketsHtmlPath, 'utf8');

// 1. Extract <style>
const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/i);
if (!styleMatch) {
  console.error('Could not find <style> in markets.html');
  process.exit(1);
}
const cssContent = styleMatch[1].trim();
const cssOutPath = path.join(ROOT, 'assets', 'css', 'markets.css');
const cssMinPath = path.join(ROOT, 'assets', 'css', 'markets.min.css');

fs.writeFileSync(cssOutPath, cssContent, 'utf8');
const minifiedCss = new CleanCSS({ level: 2 }).minify(cssContent);
fs.writeFileSync(cssMinPath, minifiedCss.styles, 'utf8');
console.log(`Extracted markets.css (${cssContent.length} bytes) -> markets.min.css (${minifiedCss.styles.length} bytes)`);

// 2. Extract inline <script> starting with const AFF_REF
const scriptStartToken = '<script>\n/* ============================================================\n   GLOBAL CONSTANTS & WEBSOCKET FEEDS';
const scriptStartIdx = content.indexOf('<script>\n/* ============================================================');
if (scriptStartIdx === -1) {
  console.error('Could not find script start index');
  process.exit(1);
}
const scriptEndIdx = content.lastIndexOf('</script>');
const scriptTagFull = content.substring(scriptStartIdx, scriptEndIdx + 9);
const jsContent = content.substring(scriptStartIdx + 8, scriptEndIdx).trim();

const jsOutPath = path.join(ROOT, 'assets', 'js', 'markets.js');
const jsMinPath = path.join(ROOT, 'assets', 'js', 'markets.min.js');

fs.writeFileSync(jsOutPath, jsContent, 'utf8');

(async () => {
  const minifiedJs = await Terser.minify(jsContent, {
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
    mangle: false // Preserve function names for inline onclick triggers
  });

  if (minifiedJs.error) {
    console.error('Terser error:', minifiedJs.error);
    process.exit(1);
  }

  fs.writeFileSync(jsMinPath, minifiedJs.code, 'utf8');
  console.log(`Extracted markets.js (${jsContent.length} bytes) -> markets.min.js (${minifiedJs.code.length} bytes)`);

  // 3. Replace <style> with <link rel="stylesheet">
  content = content.replace(styleMatch[0], '<link rel="stylesheet" href="/assets/css/markets.min.css?v=8.0">');

  // 4. Replace inline script with external script
  content = content.replace(scriptTagFull, '<script src="/assets/js/markets.min.js?v=8.0" defer></script>');

  // 5. Add rich educational and market analysis content before the closing tags
  const educationalContent = `
<!-- ============================================================
     MARKETS EDUCATIONAL GUIDE & INSTITUTIONAL ANALYSIS
============================================================ -->
<section class="markets-guide-section" style="max-width: 1440px; margin: 40px auto; padding: 40px 24px; background: rgba(13, 26, 45, 0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
  <div style="max-width: 1000px; margin: 0 auto; line-height: 1.8; color: #CBD5E1;">
    <h2 style="font-size: 28px; font-weight: 800; color: #fff; margin-bottom: 20px; border-bottom: 2px solid #C9A84C; padding-bottom: 12px;">Comprehensive Guide to Crypto Markets, Order Execution &amp; Trading Infrastructure</h2>
    <p style="margin-bottom: 20px; font-size: 16px;">Welcome to the NexcoinPR Digital Asset Hub. Whether you are executing high-frequency algorithmic spot orders, analyzing perpetual futures funding rates, or evaluating liquidity profiles across global venues, navigating digital asset markets requires institutional precision, deep market data, and risk-controlled execution strategies.</p>
    
    <h3 style="font-size: 22px; font-weight: 700; color: #E2E8F0; margin: 32px 0 16px;">1. Understanding Spot Markets vs. Perpetual Futures</h3>
    <p style="margin-bottom: 16px;"><strong>Spot Trading:</strong> In spot cryptocurrency markets, transactions involve the immediate purchase and delivery of underlying digital assets such as Bitcoin (BTC), Ethereum (ETH), Solana (SOL), and major altcoins. When you buy spot, you take direct legal ownership of the tokens, allowing you to withdraw them to cold storage hardware wallets, deploy them in decentralized finance (DeFi) yield protocols, or utilize them for on-chain staking and governance.</p>
    <p style="margin-bottom: 20px;"><strong>Perpetual Futures:</strong> Perpetual contracts are derivative instruments without an expiry date that track the underlying index price through an automated funding rate mechanism. Every 8 hours, longs pay shorts (or shorts pay longs) depending on market sentiment. This ensures perpetual contract prices tightly converge with spot index benchmarks. Futures enable capital efficiency through leverage, hedging spot portfolio risks, and executing directional delta-neutral trades.</p>

    <h3 style="font-size: 22px; font-weight: 700; color: #E2E8F0; margin: 32px 0 16px;">2. Order Types, Liquidity Profiles &amp; Execution Quality</h3>
    <p style="margin-bottom: 16px;">Navigating volatile cryptocurrency pairs demands strict mastery of advanced order types to minimize slippage and fee impact:</p>
    <ul style="margin-left: 24px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 10px;">
      <li><strong>Market Orders:</strong> Fill immediately at the best available ask (for buys) or bid (for sells). Market orders take liquidity from the order book, incurring taker fees and potential slippage in thin order books.</li>
      <li><strong>Limit Orders:</strong> Enter the order book at a designated target price or better. Limit orders provide liquidity to the venue, qualifying for reduced maker fee tiers and ensuring zero negative price slippage.</li>
      <li><strong>Stop-Market &amp; Stop-Limit Orders:</strong> Triggered once an activation price is touched. Crucial for automated risk mitigation, capital preservation stop-losses, and breakout momentum execution.</li>
      <li><strong>Trailing Stops:</strong> Dynamic exit orders that float a designated percentage below peak price, locking in accrued unrealized profits while allowing winning trends to run.</li>
    </ul>

    <h3 style="font-size: 22px; font-weight: 700; color: #E2E8F0; margin: 32px 0 16px;">3. Paper Trading Simulator: Zero-Risk Strategy Validation</h3>
    <p style="margin-bottom: 20px;">NexcoinPR features an integrated simulated paper trading workspace loaded with $100,000 in virtual USDT demo capital. Professional traders use paper simulations to backtest quantitative indicators, evaluate stop-loss placement, practice risk-reward calculation (e.g. 1:3 R:R ratios), and familiarize themselves with live order book mechanics before deploying real institutional capital.</p>

    <h3 style="font-size: 22px; font-weight: 700; color: #E2E8F0; margin: 32px 0 16px;">4. Order Book Depth, Spreads &amp; Slippage Dynamics</h3>
    <p style="margin-bottom: 20px;">The bid-ask spread represents the difference between the highest price a buyer is willing to pay and the lowest price a seller will accept. High liquidity assets like BTC/USDT feature razor-thin spreads (often less than 0.01%), ensuring minimal transaction drag. Low-cap tokens with shallow liquidity can exhibit wider spreads and notable slippage, necessitating TWAP (Time-Weighted Average Price) or iceberg execution algorithms.</p>

    <h3 style="font-size: 22px; font-weight: 700; color: #E2E8F0; margin: 32px 0 16px;">5. Trading Fee Schedules &amp; NexcoinPR Lifetime Rebate Benefits</h3>
    <p style="margin-bottom: 20px;">Transaction fees significantly impact cumulative trading performance. Through the NexcoinPR official partner integration, registered traders receive exclusive lifetime trading fee discounts, VIP fee tier upgrades, and priority customer support across spot and derivatives markets. Utilizing platform native utility tokens such as BNB further compounds fee savings by an additional 25%.</p>

    <h3 style="font-size: 22px; font-weight: 700; color: #E2E8F0; margin: 32px 0 16px;">Frequently Asked Questions (FAQ)</h3>
    <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 16px;">
      <div style="background: rgba(255,255,255,0.03); padding: 18px 20px; border-radius: 10px; border-left: 3px solid #C9A84C;">
        <h4 style="color: #fff; font-size: 16px; margin-bottom: 8px;">What is crypto paper trading?</h4>
        <p style="font-size: 14.5px; margin: 0;">Paper trading is simulated trading using real-time market data without risking actual funds. It allows traders to test technical strategies, monitor market behavior, and practice order entry with $100,000 in virtual demo balance.</p>
      </div>
      <div style="background: rgba(255,255,255,0.03); padding: 18px 20px; border-radius: 10px; border-left: 3px solid #C9A84C;">
        <h4 style="color: #fff; font-size: 16px; margin-bottom: 8px;">How do live price feeds work on NexcoinPR?</h4>
        <p style="font-size: 14.5px; margin: 0;">Our platform connects directly via low-latency WebSockets to Tier-1 global liquidity pools, updating quotes, order books, 24-hour volume metrics, and tick charts in sub-second intervals.</p>
      </div>
      <div style="background: rgba(255,255,255,0.03); padding: 18px 20px; border-radius: 10px; border-left: 3px solid #C9A84C;">
        <h4 style="color: #fff; font-size: 16px; margin-bottom: 8px;">What is the difference between maker and taker fees?</h4>
        <p style="font-size: 14.5px; margin: 0;">Maker orders place new liquidity into the order book (limit orders) and pay lower fees. Taker orders consume existing liquidity immediately (market orders) and pay standard taker fees.</p>
      </div>
      <div style="background: rgba(255,255,255,0.03); padding: 18px 20px; border-radius: 10px; border-left: 3px solid #C9A84C;">
        <h4 style="color: #fff; font-size: 16px; margin-bottom: 8px;">Can I buy cryptocurrencies using fiat currencies?</h4>
        <p style="font-size: 14.5px; margin: 0;">Yes. The integrated fiat gateway supports direct on-ramp options including Visa, MasterCard, Apple Pay, Google Pay, SEPA bank transfers, and local payment methods across 50+ currencies.</p>
      </div>
      <div style="background: rgba(255,255,255,0.03); padding: 18px 20px; border-radius: 10px; border-left: 3px solid #C9A84C;">
        <h4 style="color: #fff; font-size: 16px; margin-bottom: 8px;">How should I secure my cryptocurrency assets?</h4>
        <p style="font-size: 14.5px; margin: 0;">Always enable two-factor authentication (2FA via hardware keys or authenticator apps), set withdrawal address whitelists, and transfer long-term holdings into cold storage non-custodial hardware wallets.</p>
      </div>
    </div>
  </div>
</section>
`;

  content = content.replace('<script src="/assets/js/markets.min.js?v=8.0" defer></script>', educationalContent + '\n<script src="/assets/js/markets.min.js?v=8.0" defer></script>');

  fs.writeFileSync(marketsHtmlPath, content, 'utf8');
  console.log('Successfully updated markets.html with external minified CSS/JS and educational guide!');

  // Measure new ratio
  const textOnly = content
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  console.log('New visible text length:', textOnly.length);
  console.log('New total HTML length:', content.length);
  console.log('New Text-to-HTML Ratio:', (textOnly.length / content.length).toFixed(4));
})();

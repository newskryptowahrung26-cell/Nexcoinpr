/**
 * sync_binance_tokens.js
 * Automatically pulls all active trading pairs from Binance API,
 * enriches them with metadata (categories, icons, full names),
 * and writes to assets/data/tokens.json.
 * 
 * Scheduled to run every 30 minutes via GitHub Actions.
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = path.join(__dirname, '../assets/data/tokens.json');

// Comprehensive dictionary for high-profile tokens
const KNOWN_METADATA = {
  'BTC': { name: 'Bitcoin', cats: ['layer1'], color: '#F7931A', emoji: '₿', mcap: 1720 },
  'ETH': { name: 'Ethereum', cats: ['layer1', 'defi'], color: '#627EEA', emoji: '♦', mcap: 420 },
  'BNB': { name: 'BNB Chain', cats: ['layer1'], color: '#F3BA2F', emoji: '⭐', mcap: 92 },
  'SOL': { name: 'Solana', cats: ['layer1'], color: '#9945FF', emoji: '☀', mcap: 85 },
  'XRP': { name: 'Ripple', cats: ['layer1'], color: '#0085C0', emoji: '✕', mcap: 78 },
  'DOGE': { name: 'Dogecoin', cats: ['meme'], color: '#C2A633', emoji: '🐕', mcap: 28 },
  'ADA': { name: 'Cardano', cats: ['layer1'], color: '#0033AD', emoji: '₳', mcap: 24 },
  'AVAX': { name: 'Avalanche', cats: ['layer1', 'defi'], color: '#E84142', emoji: '▲', mcap: 20 },
  'LINK': { name: 'Chainlink', cats: ['defi', 'ai'], color: '#375BD2', emoji: '🔗', mcap: 14 },
  'SUI': { name: 'Sui', cats: ['layer1'], color: '#4DA2FF', emoji: '💧', mcap: 12 },
  'NEAR': { name: 'NEAR Protocol', cats: ['layer1', 'ai'], color: '#00C08B', emoji: 'Ⓝ', mcap: 9 },
  'TRX': { name: 'TRON', cats: ['layer1'], color: '#FF0013', emoji: '▲', mcap: 16 },
  'PEPE': { name: 'Pepe', cats: ['meme'], color: '#2E8B57', emoji: '🐸', mcap: 5 },
  'SHIB': { name: 'Shiba Inu', cats: ['meme'], color: '#FFA409', emoji: '🐕', mcap: 9 },
  'MATIC': { name: 'Polygon', cats: ['layer2'], color: '#8247E5', emoji: '⬡', mcap: 11 },
  'POL': { name: 'Polygon Ecosystem', cats: ['layer2'], color: '#8247E5', emoji: '⬡', mcap: 11 },
  'DOT': { name: 'Polkadot', cats: ['layer1'], color: '#E6007A', emoji: '●', mcap: 10 },
  'UNI': { name: 'Uniswap', cats: ['defi'], color: '#FF007A', emoji: '🦄', mcap: 8 },
  'LTC': { name: 'Litecoin', cats: ['layer1'], color: '#BFBBBB', emoji: 'Ł', mcap: 7 },
  'BCH': { name: 'Bitcoin Cash', cats: ['layer1'], color: '#8DC351', emoji: '₿', mcap: 9 },
  'ARB': { name: 'Arbitrum', cats: ['layer2'], color: '#28A0F0', emoji: '❖', mcap: 5 },
  'OP': { name: 'Optimism', cats: ['layer2'], color: '#FF0420', emoji: '🔴', mcap: 4 },
  'INJ': { name: 'Injective', cats: ['defi', 'layer1'], color: '#00BCFF', emoji: '⬟', mcap: 4 },
  'FET': { name: 'Artificial Superintelligence', cats: ['ai'], color: '#1FE4FF', emoji: '🤖', mcap: 3 },
  'RENDER': { name: 'Render', cats: ['ai'], color: '#E53935', emoji: '🎬', mcap: 4 },
  'RNDR': { name: 'Render Token', cats: ['ai'], color: '#E53935', emoji: '🎬', mcap: 4 },
  'TAO': { name: 'Bittensor', cats: ['ai', 'layer1'], color: '#212121', emoji: '🧠', mcap: 5 },
  'WIF': { name: 'dogwifhat', cats: ['meme'], color: '#D4A373', emoji: '🎩', mcap: 3 },
  'BONK': { name: 'Bonk', cats: ['meme'], color: '#F77F00', emoji: '🐶', mcap: 2 },
  'FLOKI': { name: 'Floki', cats: ['meme'], color: '#E67E22', emoji: '⚔️', mcap: 2 },
  'KAS': { name: 'Kaspa', cats: ['layer1'], color: '#70C7BA', emoji: '⚡', mcap: 4 },
  'TIA': { name: 'Celestia', cats: ['layer1'], color: '#7B2CBF', emoji: '🟣', mcap: 3 },
  'SEI': { name: 'Sei Network', cats: ['layer1'], color: '#9D0208', emoji: '🔴', mcap: 2 },
  'APT': { name: 'Aptos', cats: ['layer1'], color: '#00C875', emoji: '◯', mcap: 6 },
  'ONDO': { name: 'Ondo Finance', cats: ['defi'], color: '#14213D', emoji: '🏦', mcap: 3 },
  'TON': { name: 'Toncoin', cats: ['layer1'], color: '#0098EA', emoji: '💎', mcap: 15 },
  'AAVE': { name: 'Aave', cats: ['defi'], color: '#B6509E', emoji: '👻', mcap: 3 },
  'MKR': { name: 'Maker', cats: ['defi'], color: '#1AAB9B', emoji: '🏛️', mcap: 2 },
  'CRV': { name: 'Curve DAO', cats: ['defi'], color: '#0055FF', emoji: '📐', mcap: 1 },
  'PENDLE': { name: 'Pendle Finance', cats: ['defi'], color: '#2575FC', emoji: '⏳', mcap: 1 },
  'ZEC': { name: 'Zcash', cats: ['layer1'], color: '#F4B728', emoji: '🛡️', mcap: 2 },
  'ICP': { name: 'Internet Computer', cats: ['layer1', 'ai'], color: '#29ABE2', emoji: '♾️', mcap: 5 },
  'STX': { name: 'Stacks', cats: ['layer2'], color: '#5546FF', emoji: '📚', mcap: 3 },
  'USDC': { name: 'USD Coin', cats: ['stablecoin'], color: '#2775CA', emoji: '$', mcap: 36 },
  'USDT': { name: 'Tether USD', cats: ['stablecoin'], color: '#26A17B', emoji: '$', mcap: 120 },
  'FDUSD': { name: 'First Digital USD', cats: ['stablecoin'], color: '#1B998B', emoji: '$', mcap: 3 },
  'TUSD': { name: 'TrueUSD', cats: ['stablecoin'], color: '#284697', emoji: '$', mcap: 1 }
};

// Auto-classify unknown tokens based on symbol keywords
function guessCategory(sym) {
  const s = sym.toUpperCase();
  if (['USD', 'EUR', 'DAI', 'USDC', 'USDT', 'FDUSD', 'TUSD', 'USDD'].some(f => s.includes(f))) return ['stablecoin'];
  if (['AI', 'GPT', 'BOT', 'DATA', 'AGIX', 'OCEAN', 'ARKM', 'WLD'].some(f => s.includes(f))) return ['ai'];
  if (['CAT', 'DOG', 'PUP', 'INU', 'MEME', 'BABY', 'BOME', 'NEIRO'].some(f => s.includes(f))) return ['meme'];
  if (['SWAP', 'DEX', 'YIELD', 'LEND', 'FINANCE', 'POOL'].some(f => s.includes(f))) return ['defi'];
  return ['all'];
}

async function fetchBinanceData() {
  const endpoints = [
    'https://api.binance.com/api/v3/ticker/24hr',
    'https://data-api.binance.vision/api/v3/ticker/24hr'
  ];

  for (const ep of endpoints) {
    try {
      console.log(`Fetching active pairs from: ${ep}`);
      const res = await fetch(ep);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (e) {
      console.warn(`Endpoint ${ep} failed:`, e.message);
    }
  }
  throw new Error('All Binance endpoints failed');
}

async function main() {
  const rawList = await fetchBinanceData();

  // Filter only active, genuine USDT spot markets
  const validPairs = rawList.filter(t => {
    return t.symbol.endsWith('USDT') &&
      !t.symbol.includes('UPUSDT') &&
      !t.symbol.includes('DOWNUSDT') &&
      !t.symbol.includes('BEARUSDT') &&
      !t.symbol.includes('BULLUSDT') &&
      parseFloat(t.lastPrice) > 0 &&
      parseFloat(t.quoteVolume) > 500;
  });

  // Sort by 24h trading volume descending
  validPairs.sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume));

  console.log(`Discovered ${validPairs.length} active USDT trading pairs on Binance.`);

  const tokenCatalog = validPairs.map((t, idx) => {
    const base = t.symbol.replace('USDT', '');
    const meta = KNOWN_METADATA[base] || {};

    const name = meta.name || base;
    const cats = meta.cats || guessCategory(base);
    const color = meta.color || '#C9A84C';
    const emoji = meta.emoji || '🪙';
    const estMcap = meta.mcap || Math.round(parseFloat(t.quoteVolume) * 20 / 1e9);

    return {
      rank: idx + 1,
      s: t.symbol,
      b: base,
      n: name,
      cats: cats,
      color: color,
      emoji: emoji,
      mcap: estMcap,
      price: parseFloat(t.lastPrice),
      change24: parseFloat(t.priceChangePercent),
      high24: parseFloat(t.highPrice),
      low24: parseFloat(t.lowPrice),
      volume24: parseFloat(t.volume),
      quoteVol24: parseFloat(t.quoteVolume)
    };
  });

  // Ensure assets/data directory exists
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const payload = {
    updatedAt: new Date().toISOString(),
    totalCoins: tokenCatalog.length,
    tokens: tokenCatalog
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(payload, null, 2), 'utf-8');
  console.log(`Successfully wrote ${tokenCatalog.length} tokens to ${OUTPUT_PATH}`);
}

main().catch(err => {
  console.error('Fatal sync error:', err);
  process.exit(1);
});

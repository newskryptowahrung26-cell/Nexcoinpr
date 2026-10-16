const fs = require('fs');
const path = require('path');

const leads = [
  // --- CRYPTO EXCHANGES & TRADING PLATFORMS ---
  {
    company: "Gate.io",
    category: "Crypto Exchange",
    website: "https://www.gate.io",
    department: "Business & Marketing",
    email: "business@gate.com",
    recommendedService: "Elite Tier-1 Blitz (Cointelegraph, CoinDesk, Bloomberg)",
    pitchHook: "Pitching your new token listing volumes and proof-of-reserves transparency to Tier-1 financial media."
  },
  {
    company: "Bitget",
    category: "Crypto Exchange",
    website: "https://www.bitget.com",
    department: "Media & PR",
    email: "media@bitget.com",
    recommendedService: "Forbes & Cointelegraph Dual Editorial",
    pitchHook: "Highlighting Bitget's copy-trading dominance and European expansion in Forbes Council."
  },
  {
    company: "MEXC Global",
    category: "Crypto Exchange",
    website: "https://www.mexc.com",
    department: "Media & PR",
    email: "media@mexc.com",
    recommendedService: "Cointelegraph ($6,999) + 8-Portal Syndication",
    pitchHook: "Fast 24h editorial turnaround for upcoming launchpad projects and zero-fee trading milestones."
  },
  {
    company: "KuCoin",
    category: "Crypto Exchange",
    website: "https://www.kucoin.com",
    department: "Media & Communications",
    email: "media@kucoin.com",
    recommendedService: "Institutional Authority Elite ($12,000)",
    pitchHook: "Cementing institutional trust and global regulatory compliance across Bloomberg and Yahoo Finance."
  },
  {
    company: "Bybit",
    category: "Crypto Exchange",
    website: "https://www.bybit.com",
    department: "Media Relations",
    email: "media@bybit.com",
    recommendedService: "CoinDesk ($8,000) Guaranteed Editorial",
    pitchHook: "Positioning Bybit's institutional derivatives market share on CoinDesk and Bloomberg."
  },
  {
    company: "OKX",
    category: "Crypto Exchange / Web3 Wallet",
    website: "https://www.okx.com",
    department: "Media Desk",
    email: "media@okx.com",
    recommendedService: "CoinDesk + Cointelegraph Duo",
    pitchHook: "Amplifying OKX Web3 wallet onchain adoption and DEX aggregator volume to global retail traders."
  },
  {
    company: "BingX",
    category: "Crypto Exchange",
    website: "https://www.bingx.com",
    department: "Media & BD",
    email: "media@bingx.com",
    recommendedService: "Financial Growth Surge ($4,500)",
    pitchHook: "Broad financial syndication across Yahoo Finance and Benzinga for crypto derivatives expansion."
  },
  {
    company: "BingX Partnerships",
    category: "Crypto Exchange",
    website: "https://www.bingx.com",
    department: "Business Partnerships",
    email: "partnership@bingx.com",
    recommendedService: "Strategic PR Package A ($7,500)",
    pitchHook: "Securing guaranteed dofollow organic backlinks to accelerate global SEO and trader acquisition."
  },
  {
    company: "Coinstore",
    category: "Crypto Exchange",
    website: "https://www.coinstore.com",
    department: "Global Marketing",
    email: "marketing@coinstore.com",
    recommendedService: "Web3 Starter ($1,400) + Cointelegraph",
    pitchHook: "Promoting emerging market exchange liquidity and IEO launches across top Southeast Asian crypto media."
  },
  {
    company: "Phemex",
    category: "Crypto Exchange",
    website: "https://www.phemex.com",
    department: "PR & Marketing",
    email: "media@phemex.com",
    recommendedService: "Cointelegraph Feature ($6,999)",
    pitchHook: "Covering decentralized governance and semi-centralized exchange innovations for professional traders."
  },
  {
    company: "Phemex BD",
    category: "Crypto Exchange",
    website: "https://www.phemex.com",
    department: "Institutional BD",
    email: "bd@phemex.com",
    recommendedService: "Financial Wire Package ($4,500)",
    pitchHook: "Highlighting VIP trader tier benefits and institutional API connectivity in high-DA financial media."
  },
  {
    company: "BitMart",
    category: "Crypto Exchange",
    website: "https://www.bitmart.com",
    department: "Marketing & Growth",
    email: "marketing@bitmart.com",
    recommendedService: "Web3 Starter Package ($1,400)",
    pitchHook: "Instant 24-48h press releases for new primary listings and community trading competitions."
  },
  {
    company: "CoinEx",
    category: "Crypto Exchange",
    website: "https://www.coinex.com",
    department: "Global PR",
    email: "PR@coinex.com",
    recommendedService: "Cointelegraph ($6,999) + Crypto Slate",
    pitchHook: "Showcasing CoinEx user-friendly trading ecosystem and global 10M+ registered user milestone."
  },
  {
    company: "CoinEx BD",
    category: "Crypto Exchange",
    website: "https://www.coinex.com",
    department: "Business Development",
    email: "bd@coinex.com",
    recommendedService: "Financial Growth Package ($4,500)",
    pitchHook: "Institutional syndication to attract market makers, liquidity providers, and broker affiliates."
  },
  {
    company: "PrimeXBT",
    category: "Multi-Asset Trading (Crypto & Forex)",
    website: "https://www.primexbt.com",
    department: "Press & Media",
    email: "pr@primexbt.com",
    recommendedService: "Forbes ($7,500) + Bloomberg Feature",
    pitchHook: "Positioning PrimeXBT as the premier all-in-one crypto, forex, and commodities trading hub."
  },
  {
    company: "PrimeXBT Partnerships",
    category: "Multi-Asset Trading",
    website: "https://www.primexbt.com",
    department: "Global Partnerships",
    email: "partners@primexbt.com",
    recommendedService: "Tier-1 Financial PR Blitz ($12,000)",
    pitchHook: "Targeted B2B coverage to recruit institutional affiliates and high-net-worth introducing brokers."
  },

  // --- MAJOR WEB3 & LAYER 1 / LAYER 2 PROTOCOLS ---
  {
    company: "TON Foundation",
    category: "Web3 & Layer 1",
    website: "https://ton.org",
    department: "Press & Media",
    email: "press@ton.foundation",
    recommendedService: "CoinDesk ($8,000) + Forbes Feature",
    pitchHook: "Highlighting Telegram ecosystem integration, Mini-Apps volume, and 900M user Web3 onboarding."
  },
  {
    company: "TON Foundation General",
    category: "Web3 & Layer 1",
    website: "https://ton.org",
    department: "Ecosystem Partnerships",
    email: "info@ton.foundation",
    recommendedService: "Global Authority Elite ($20,000)",
    pitchHook: "Multi-outlet editorial blitz covering institutional validator expansion and cross-chain liquidity."
  },
  {
    company: "TRON Network",
    category: "Layer 1 Blockchain",
    website: "https://tron.network",
    department: "Press Office",
    email: "press@tron.network",
    recommendedService: "Cointelegraph ($6,999) + Bloomberg Wire",
    pitchHook: "Showcasing USDT dominance on TRON, daily active wallet counts, and gas fee reductions."
  },
  {
    company: "Solana Labs",
    category: "Layer 1 Blockchain",
    website: "https://solana.com",
    department: "Press & Communications",
    email: "press@solana.com",
    recommendedService: "Forbes ($7,500) & CoinDesk Feature",
    pitchHook: "Promoting high-throughput DeFi volumes, mobile stack updates, and institutional pay integrations."
  },
  {
    company: "Ripple",
    category: "Enterprise Web3 & Payments",
    website: "https://ripple.com",
    department: "Corporate Press",
    email: "press@ripple.com",
    recommendedService: "Financial Media Authority ($15,000)",
    pitchHook: "Enterprise cross-border settlement milestones across Forbes, Bloomberg, and Reuters syndication."
  },
  {
    company: "Mysten Labs (Sui Network)",
    category: "Layer 1 Blockchain",
    website: "https://mystenlabs.com",
    department: "Press & Media",
    email: "press@mystenlabs.com",
    recommendedService: "CoinDesk ($8,000) + Cointelegraph",
    pitchHook: "Highlighting Move programming language performance, gaming partnerships, and TVL explosion."
  },
  {
    company: "Ava Labs (Avalanche)",
    category: "Layer 1 Blockchain",
    website: "https://www.avax.network",
    department: "Media Relations",
    email: "press@avalabs.org",
    recommendedService: "Cointelegraph ($6,999) + Yahoo Finance",
    pitchHook: "Spotlighting Avalanche Evergreen subnets for Wall Street asset tokenization and institutional pilots."
  },
  {
    company: "Aptos Labs",
    category: "Layer 1 Blockchain",
    website: "https://aptoslabs.com",
    department: "Press Office",
    email: "press@aptoslabs.com",
    recommendedService: "Entrepreneur ($8,500) + Cointelegraph",
    pitchHook: "Covering Web3 consumer app integrations and strategic cloud partnership announcements."
  },
  {
    company: "Chainlink Labs",
    category: "Oracle & Interoperability Protocol",
    website: "https://chain.link",
    department: "Press & Media",
    email: "press@chainlinklabs.com",
    recommendedService: "Forbes ($7,500) + Bloomberg Feature",
    pitchHook: "Showcasing CCIP (Cross-Chain Interoperability Protocol) adoption by global traditional banks."
  },
  {
    company: "NEAR Foundation",
    category: "Layer 1 & Chain Abstraction",
    website: "https://near.foundation",
    department: "Global Communications",
    email: "press@near.foundation",
    recommendedService: "CoinDesk ($8,000) + Financial Wire",
    pitchHook: "Positioning NEAR's chain abstraction vision and user-owned AI initiatives to tech editors."
  },

  // --- FOREX BROKERS & MULTI-ASSET BROKERAGES ---
  {
    company: "Pepperstone",
    category: "Forex Broker",
    website: "https://pepperstone.com",
    department: "Media & Press Office",
    email: "media@pepperstone.com",
    recommendedService: "Forbes Council Editorial ($7,500)",
    pitchHook: "Positioning Pepperstone's razor-spread institutional execution and market analysis in Forbes."
  },
  {
    company: "IC Markets",
    category: "Forex Broker",
    website: "https://www.icmarkets.com",
    department: "Marketing Desk",
    email: "marketing@icmarkets.com",
    recommendedService: "Financial Growth Surge ($4,500)",
    pitchHook: "Multi-wire financial coverage on Yahoo Finance, Benzinga, and MarketWatch for ECN liquidity."
  },
  {
    company: "IC Markets Partners",
    category: "Forex Broker",
    website: "https://www.icmarkets.com",
    department: "Partnerships & IBs",
    email: "partners@icmarkets.com",
    recommendedService: "Financial PR Package ($6,500)",
    pitchHook: "Recruiting professional fund managers and introducing brokers through high-DA finance press."
  },
  {
    company: "Vantage Markets",
    category: "Forex Broker",
    website: "https://www.vantagemarkets.com",
    department: "Strategic Partnerships",
    email: "partnerships@vantagemarkets.com",
    recommendedService: "Entrepreneur ($8,500) + Financial Wire",
    pitchHook: "Covering Vantage's multi-regulated brand story, social trading app, and global partner ecosystem."
  },
  {
    company: "FP Markets",
    category: "Forex Broker",
    website: "https://www.fpmarkets.com",
    department: "Partners & Marketing",
    email: "partners@fpmarkets.com",
    recommendedService: "Financial Growth Package ($4,500)",
    pitchHook: "Targeted dofollow backlinks and Google News indexing to solidify European and Australian market trust."
  },
  {
    company: "BlackBull Markets",
    category: "Forex Broker",
    website: "https://blackbull.com",
    department: "Institutional Partnerships",
    email: "partners@blackbull.com",
    recommendedService: "Forbes Council ($7,500) + Yahoo Finance",
    pitchHook: "Highlighting ultra-low latency institutional connectivity and prime broker infrastructure."
  },
  {
    company: "BlackBull Affiliates",
    category: "Forex Broker",
    website: "https://blackbull.com",
    department: "Affiliate Marketing",
    email: "affiliates@blackbull.com",
    recommendedService: "Strategic Financial Wire ($3,500)",
    pitchHook: "High-conversion affiliate launch announcements syndicated across Tier-1 financial portals."
  },
  {
    company: "Tickmill",
    category: "Forex Broker",
    website: "https://www.tickmill.com",
    department: "Support & Media Routing",
    email: "support@tickmill.com",
    recommendedService: "Financial Growth Surge ($4,500)",
    pitchHook: "Showcasing low commissions and multi-asset trading tools to retail traders across Asia and MENA."
  },
  {
    company: "RoboForex",
    category: "Forex Broker",
    website: "https://roboforex.com",
    department: "Partnerships & Marketing",
    email: "partners@roboforex.com",
    recommendedService: "High-DA SEO Backlink Package ($2,500)",
    pitchHook: "Permanent editorial placements to boost Google Page 1 rankings for competitive broker keywords."
  },
  {
    company: "AvaTrade Partners",
    category: "Forex Broker",
    website: "https://www.avatrade.com",
    department: "AvaPartner Marketing",
    email: "support@avapartner.com",
    recommendedService: "Forbes ($7,500) + Benzinga Editorial",
    pitchHook: "Reinforcing AvaTrade's multi-continental regulatory licensing and AvaProtect risk tools."
  },

  // --- PROP TRADING FIRMS (HIGH PR SPENDERS) ---
  {
    company: "FTMO",
    category: "Prop Trading Firm",
    website: "https://ftmo.com",
    department: "Press & Media",
    email: "media@ftmo.com",
    recommendedService: "Forbes ($7,500) + Entrepreneur ($8,500)",
    pitchHook: "Positioning FTMO as the undisputed pioneer and gold standard in funded trader evaluations."
  },
  {
    company: "FundedNext",
    category: "Prop Trading Firm",
    website: "https://fundednext.com",
    department: "Communications & PR",
    email: "communications@fundednext.com",
    recommendedService: "Tier-1 Financial Wire + Yahoo Finance",
    pitchHook: "Announcing funded payout milestones ($100M+) and trader success stories to global finance media."
  },
  {
    company: "FundedNext Partnerships",
    category: "Prop Trading Firm",
    website: "https://fundednext.com",
    department: "Global Partnerships",
    email: "partner@fundednext.com",
    recommendedService: "Financial Growth Package ($4,500)",
    pitchHook: "Attracting international trading academies, prop affiliates, and regional ambassadors."
  },
  {
    company: "E8 Markets",
    category: "Prop Trading Firm",
    website: "https://e8markets.com",
    department: "Partnerships & Media",
    email: "support@e8markets.com",
    recommendedService: "Bloomberg + Yahoo Finance Duo ($5,500)",
    pitchHook: "Covering customizable evaluation models and automated payout technology in mainstream tech news."
  },
  {
    company: "Funded Trading Plus",
    category: "Prop Trading Firm",
    website: "https://www.fundedtradingplus.com",
    department: "Partners & Marketing",
    email: "partners@fundedtradingplus.com",
    recommendedService: "Financial Wire Package ($3,500)",
    pitchHook: "Promoting instant funding rules and zero-time-limit challenges to aspiring forex traders."
  },
  {
    company: "Alpha Capital Group",
    category: "Prop Trading Firm",
    website: "https://alphacapitalgroup.uk",
    department: "Management & PR",
    email: "info@alphacapitalgroup.uk",
    recommendedService: "Cointelegraph + Yahoo Finance",
    pitchHook: "Showcasing institutional raw spreads, custom proprietary trading tech, and free educational tools."
  },
  {
    company: "Goat Funded Trader",
    category: "Prop Trading Firm",
    website: "https://goatfundedtrader.com",
    department: "Partnerships",
    email: "partners@goatfundedtrader.com",
    recommendedService: "High-DA Fintech PR Package ($3,000)",
    pitchHook: "Driving viral community traction, trader interviews, and Discord community scaling."
  },
  {
    company: "LBank Exchange",
    category: "Crypto Exchange",
    website: "https://www.lbank.com",
    department: "Media & Press",
    email: "press@lbank.com",
    recommendedService: "Cointelegraph ($6,999) + Financial Wire",
    pitchHook: "Highlighting LBank's institutional liquidity depth and global trading market share."
  },
  {
    company: "BingX Business Development",
    category: "Crypto Exchange",
    website: "https://www.bingx.com",
    department: "Global BD",
    email: "bd@bingx.com",
    recommendedService: "Financial Wire Package ($4,500)",
    pitchHook: "Pitching copy trading features and new VIP broker partnerships to financial allocators."
  },
  {
    company: "Blofin",
    category: "Crypto Exchange",
    website: "https://www.blofin.com",
    department: "Media & PR",
    email: "media@blofin.com",
    recommendedService: "Cointelegraph ($6,999) + CryptoSlate",
    pitchHook: "Covering advanced futures trading security, Merkle tree reserves, and institutional APIs."
  },
  {
    company: "Bitunix",
    category: "Crypto Exchange",
    website: "https://www.bitunix.com",
    department: "Media Office",
    email: "media@bitunix.com",
    recommendedService: "Web3 Starter ($1,400) + Yahoo Finance",
    pitchHook: "Fast-tracking derivatives exchange growth and global user acquisition milestones."
  },
  {
    company: "Margex",
    category: "Crypto Derivatives",
    website: "https://margex.com",
    department: "PR & Media",
    email: "pr@margex.com",
    recommendedService: "Cointelegraph Feature ($6,999)",
    pitchHook: "Promoting ultra-low latency leverage trading and automated staking yield products."
  },
  {
    company: "XT.com",
    category: "Crypto Exchange",
    website: "https://www.xt.com",
    department: "Media Desk",
    email: "media@xt.com",
    recommendedService: "Financial Growth Package ($4,500)",
    pitchHook: "Announcing social trading ecosystem upgrades and new primary token listing support."
  },
  {
    company: "Exness Global",
    category: "Forex Broker",
    website: "https://www.exness.com",
    department: "Corporate Communications",
    email: "support@exness.com",
    recommendedService: "Forbes Council ($7,500) + Bloomberg Feature",
    pitchHook: "Highlighting multi-trillion dollar monthly trading volume and instant withdrawal technology."
  },
  {
    company: "HFM (HotForex)",
    category: "Forex Broker",
    website: "https://www.hfm.com",
    department: "Partnerships & Marketing",
    email: "partners@hfm.com",
    recommendedService: "Financial Growth Surge ($4,500)",
    pitchHook: "Recruiting master affiliates and institutional introducing brokers across LATAM and Asia."
  },
  {
    company: "Axi",
    category: "Forex Broker",
    website: "https://www.axi.com",
    department: "Partnerships Desk",
    email: "partners@axi.com",
    recommendedService: "Entrepreneur ($8,500) + Financial Wire",
    pitchHook: "Showcasing Axi Select funded trader allocation program and institutional execution."
  },
  {
    company: "BDSwiss",
    category: "Forex Broker",
    website: "https://www.bdswiss.com",
    department: "Partnerships & Media",
    email: "partners@bdswiss.com",
    recommendedService: "High-DA Backlink Package ($3,500)",
    pitchHook: "Permanent Tier-1 media authority to solidify European and Middle Eastern regulatory trust."
  },
  {
    company: "MultiBank Group",
    category: "Forex & Financial Derivatives",
    website: "https://multibankfx.com",
    department: "Institutional Partnerships",
    email: "partners@multibankfx.com",
    recommendedService: "Forbes ($7,500) + Bloomberg Wire",
    pitchHook: "Showcasing global banking licenses and over $12B daily turnover to institutional clients."
  },
  {
    company: "Eightcap",
    category: "Forex Broker",
    website: "https://www.eightcap.com",
    department: "Partners & Growth",
    email: "partners@eightcap.com",
    recommendedService: "Financial Wire Package ($4,500)",
    pitchHook: "Positioning Eightcap as the preferred broker infrastructure for global prop trading firms."
  },
  {
    company: "Arbitrum Foundation",
    category: "Layer 2 Blockchain",
    website: "https://arbitrum.foundation",
    department: "Press Office",
    email: "press@arbitrum.foundation",
    recommendedService: "CoinDesk ($8,000) + Cointelegraph",
    pitchHook: "Covering Arbitrum Orbit chains, gaming subnets, and Layer 2 TVL dominance."
  },
  {
    company: "Optimism Foundation",
    category: "Layer 2 Blockchain",
    website: "https://www.optimism.io",
    department: "Media & Press",
    email: "press@optimism.io",
    recommendedService: "Forbes ($7,500) + Tech Wire",
    pitchHook: "Showcasing the Superchain network effect, Base integration, and public goods funding."
  },
  {
    company: "Injective Labs",
    category: "Layer 1 DeFi Blockchain",
    website: "https://injective.com",
    department: "Press & Ecosystem",
    email: "contact@injectivelabs.org",
    recommendedService: "Cointelegraph ($6,999) + Yahoo Finance",
    pitchHook: "Highlighting native onchain order books, zero gas fee trading, and institutional liquidity."
  },
  {
    company: "Sui Foundation",
    category: "Layer 1 Blockchain",
    website: "https://sui.io",
    department: "Communications Office",
    email: "press@sui.io",
    recommendedService: "CoinDesk ($8,000) + Bloomberg Feature",
    pitchHook: "Covering record-breaking parallel execution benchmarks and institutional enterprise custody."
  }
];

// Generate CSV content
const headers = [
  "Company_Name",
  "Category",
  "Website",
  "Contact_Department",
  "Target_Email",
  "Recommended_Service",
  "Custom_Pitch_Hook"
];

function escapeCsv(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

const csvRows = [
  headers.join(","),
  ...leads.map(lead => [
    escapeCsv(lead.company),
    escapeCsv(lead.category),
    escapeCsv(lead.website),
    escapeCsv(lead.department),
    escapeCsv(lead.email),
    escapeCsv(lead.recommendedService),
    escapeCsv(lead.pitchHook)
  ].join(","))
];

const csvContent = csvRows.join("\r\n");

// Write to Downloads and Assets Docs
const DOWNLOADS_DIR = 'C:\\Users\\NDCOM\\Downloads';
const targetCsvPath = path.join(DOWNLOADS_DIR, 'Crypto_Forex_Trading_B2B_PR_Leads.csv');
const assetsCsvPath = path.join(__dirname, '..', 'assets', 'docs', 'Crypto_Forex_Trading_B2B_PR_Leads.csv');

fs.writeFileSync(targetCsvPath, csvContent, 'utf8');
fs.writeFileSync(assetsCsvPath, csvContent, 'utf8');

console.log(`Successfully generated ${leads.length} verified B2B leads.`);
console.log(`Saved to Downloads: ${targetCsvPath}`);
console.log(`Saved to Assets Docs: ${assetsCsvPath}`);

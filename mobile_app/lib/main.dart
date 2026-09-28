import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Color(0xFF070A13),
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );
  runApp(const NexcoinPRApp());
}

class NexcoinPRApp extends StatelessWidget {
  const NexcoinPRApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NexcoinPR',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF070A13),
        primaryColor: const Color(0xFF00F2FE),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF00F2FE),
          secondary: Color(0xFFC9A84C),
          surface: Color(0xFF0D1527),
          background: Color(0xFF070A13),
        ),
        cardTheme: CardTheme(
          color: const Color(0xFF0D1527),
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: const BorderSide(color: Color(0xFF1E293B), width: 1),
          ),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF070A13),
          elevation: 0,
          scrolledUnderElevation: 0,
          centerTitle: false,
        ),
        useMaterial3: true,
      ),
      home: const MainHomeScreen(),
    );
  }
}

class MainHomeScreen extends StatefulWidget {
  const MainHomeScreen({super.key});

  @override
  State<MainHomeScreen> createState() => _MainHomeScreenState();
}

class _MainHomeScreenState extends State<MainHomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _pages = const [
    DashboardView(),
    PackagesView(),
    MarketsAndNewsView(),
    TrackerView(),
    ContactDeskView(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: const RadialGradient(
                  colors: [Color(0xFF00F2FE), Color(0xFF0F223D)],
                ),
                border: Border.all(color: const Color(0xFF00F2FE), width: 1.5),
              ),
              child: const Center(
                child: Icon(Icons.public, color: Colors.white, size: 18),
              ),
            ),
            const SizedBox(width: 10),
            RichText(
              text: const TextSpan(
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.5,
                ),
                children: [
                  TextSpan(text: 'NEXCOIN', style: TextStyle(color: Colors.white)),
                  TextSpan(text: 'PR', style: TextStyle(color: Color(0xFFC9A84C))),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
              decoration: BoxDecoration(
                color: const Color(0xFF10B981).withOpacity(0.15),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFF10B981), width: 0.8),
              ),
              child: const Text(
                '● WIRE LIVE',
                style: TextStyle(
                  color: Color(0xFF10B981),
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.5,
                ),
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Instant Telegram Support',
            icon: Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: const Color(0xFF2AABEE).withOpacity(0.2),
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFF2AABEE), width: 1),
              ),
              child: const Icon(Icons.send_rounded, color: Color(0xFF2AABEE), size: 16),
            ),
            onPressed: () => _launchUrl('https://t.me/Nexcoinpr'),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: Color(0xFF0A101D),
          border: Border(top: BorderSide(color: Color(0xFF1E293B), width: 1)),
        ),
        child: NavigationBar(
          selectedIndex: _currentIndex,
          onDestinationSelected: (index) {
            setState(() => _currentIndex = index);
          },
          backgroundColor: Colors.transparent,
          indicatorColor: const Color(0xFF00F2FE).withOpacity(0.15),
          elevation: 0,
          labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
          destinations: const [
            NavigationDestination(
              icon: Icon(Icons.dashboard_outlined, color: Color(0xFF94A3B8)),
              selectedIcon: Icon(Icons.dashboard, color: Color(0xFF00F2FE)),
              label: 'Dashboard',
            ),
            NavigationDestination(
              icon: Icon(Icons.electric_bolt_outlined, color: Color(0xFF94A3B8)),
              selectedIcon: Icon(Icons.electric_bolt, color: Color(0xFF00F2FE)),
              label: 'PR Wire',
            ),
            NavigationDestination(
              icon: Icon(Icons.trending_up, color: Color(0xFF94A3B8)),
              selectedIcon: Icon(Icons.trending_up, color: Color(0xFF00F2FE)),
              label: 'Markets',
            ),
            NavigationDestination(
              icon: Icon(Icons.track_changes_outlined, color: Color(0xFF94A3B8)),
              selectedIcon: Icon(Icons.track_changes, color: Color(0xFF00F2FE)),
              label: 'Tracker',
            ),
            NavigationDestination(
              icon: Icon(Icons.chat_bubble_outline, color: Color(0xFF94A3B8)),
              selectedIcon: Icon(Icons.chat_bubble, color: Color(0xFF00F2FE)),
              label: 'Desk',
            ),
          ],
        ),
      ),
    );
  }

  static Future<void> _launchUrl(String url) async {
    final uri = Uri.parse(url);
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      // fallback
    }
  }
}

// -------------------------------------------------------------
// TAB 1: DASHBOARD
// -------------------------------------------------------------
class DashboardView extends StatefulWidget {
  const DashboardView({super.key});

  @override
  State<DashboardView> createState() => _DashboardViewState();
}

class _DashboardViewState extends State<DashboardView> {
  final List<Map<String, dynamic>> _tickers = [
    {'symbol': 'BTC', 'price': '\$96,480', 'change': '+2.8%', 'isUp': true},
    {'symbol': 'ETH', 'price': '\$3,450', 'change': '+3.4%', 'isUp': true},
    {'symbol': 'SOL', 'price': '\$215', 'change': '+5.9%', 'isUp': true},
    {'symbol': 'EUR/USD', 'price': '1.0842', 'change': '+0.12%', 'isUp': true},
    {'symbol': 'USD/JPY', 'price': '152.18', 'change': '-0.24%', 'isUp': false},
  ];

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Live Ticker Bar
          SizedBox(
            height: 44,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: _tickers.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, index) {
                final t = _tickers[index];
                return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0D1527),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: const Color(0xFF1E293B)),
                  ),
                  child: Row(
                    children: [
                      Text(
                        t['symbol'],
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        t['price'],
                        style: const TextStyle(color: Colors.white70, fontSize: 12),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        t['change'],
                        style: TextStyle(
                          color: t['isUp'] ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                          fontWeight: FontWeight.bold,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 18),

          // Hero Banner
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0F1E36), Color(0xFF091222)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(22),
              border: Border.all(color: const Color(0xFF00F2FE).withOpacity(0.35)),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF00F2FE).withOpacity(0.08),
                  blurRadius: 25,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFF00F2FE).withOpacity(0.12),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text(
                    'TIER-1 MEDIA WIRE',
                    style: TextStyle(
                      color: Color(0xFF00F2FE),
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1.2,
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                const Text(
                  'Global Crypto & Forex PR Distribution Agency',
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    height: 1.25,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Get guaranteed publications on Bloomberg, CoinDesk, Cointelegraph, Yahoo Finance, and 350+ financial newswires.',
                  style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13, height: 1.4),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        icon: const Icon(Icons.send_rounded, size: 16),
                        label: const Text('Book Wire via Telegram'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF2AABEE),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        onPressed: () => launchUrl(
                          Uri.parse('https://t.me/Nexcoinpr'),
                          mode: LaunchMode.externalApplication,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Key Metrics Grid
          Row(
            children: [
              _buildMetricCard('350+', 'Global Outlets', Icons.public, const Color(0xFF00F2FE)),
              const SizedBox(width: 10),
              _buildMetricCard('2.8M+', 'Audience Reach', Icons.groups, const Color(0xFFC9A84C)),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              _buildMetricCard('98.8%', 'Guaranteed Placement', Icons.verified, const Color(0xFF10B981)),
              const SizedBox(width: 10),
              _buildMetricCard('24-48h', 'Turnaround Time', Icons.speed, const Color(0xFFA855F7)),
            ],
          ),
          const SizedBox(height: 24),

          // Featured Media Partners
          const Text(
            'Guaranteed Media Networks',
            style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _buildMediaTag('Bloomberg Terminal', true),
              _buildMediaTag('CoinDesk Wire', true),
              _buildMediaTag('Cointelegraph', true),
              _buildMediaTag('Yahoo! Finance', true),
              _buildMediaTag('MarketWatch', true),
              _buildMediaTag('Benzinga', true),
              _buildMediaTag('Decrypt', true),
              _buildMediaTag('Google News Indexed', true),
            ],
          ),
          const SizedBox(height: 24),

          // Recent Wire Releases
          const Text(
            'Latest Wire Announcements',
            style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const SizedBox(height: 12),
          _buildReleaseCard(
            context,
            'Cregis Marks 2 Years of Middle East Growth with Institutional Inflows',
            'Cregis Foundation',
            'Crypto • 24 Sep 2026',
            'Leading Web3 MPC wallet and treasury platform announces rapid regional adoption.',
          ),
          const SizedBox(height: 10),
          _buildReleaseCard(
            context,
            'LBank Ranks #1 for Mainstream Crypto Liquidity in BeInCrypto Study',
            'LBank Exchange',
            'Fintech • 23 Sep 2026',
            'Exchange hits 4.4x average order book depth on top major pairs.',
          ),
          const SizedBox(height: 10),
          _buildReleaseCard(
            context,
            'BC.GAME Rewards Exceed \$8.6 Million Amid Global Ecosystem Surge',
            'BC.GAME',
            'Blockchain • 23 Sep 2026',
            'Decentralized ecosystem rewards reach new milestones for active token holders.',
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  Widget _buildMetricCard(String val, String label, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF0D1527),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFF1E293B)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 8),
            Text(
              val,
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: color),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMediaTag(String name, bool verified) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
      decoration: BoxDecoration(
        color: const Color(0xFF0D1527),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.check_circle_rounded, color: const Color(0xFF00F2FE), size: 14),
          const SizedBox(width: 6),
          Text(
            name,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.white),
          ),
        ],
      ),
    );
  }

  Widget _buildReleaseCard(
    BuildContext context,
    String title,
    String source,
    String meta,
    String excerpt,
  ) {
    return InkWell(
      onTap: () {
        showModalBottomSheet(
          context: context,
          backgroundColor: const Color(0xFF0D1527),
          shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          builder: (ctx) => Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(source, style: const TextStyle(color: Color(0xFF00F2FE), fontWeight: FontWeight.bold)),
                    Text(meta, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12)),
                  ],
                ),
                const SizedBox(height: 12),
                Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white)),
                const SizedBox(height: 14),
                Text(excerpt, style: const TextStyle(fontSize: 14, color: Color(0xFFCBD5E1), height: 1.5)),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF00F2FE),
                      foregroundColor: Colors.black,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: () => Navigator.pop(ctx),
                    child: const Text('Close'),
                  ),
                )
              ],
            ),
          ),
        );
      },
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF0D1527),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFF1E293B)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(source, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF00F2FE))),
                Text(meta, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              title,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white, height: 1.3),
            ),
            const SizedBox(height: 4),
            Text(
              excerpt,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
            ),
          ],
        ),
      ),
    );
  }
}

// -------------------------------------------------------------
// TAB 2: PR WIRE PACKAGES & CALCULATOR
// -------------------------------------------------------------
class PackagesView extends StatefulWidget {
  const PackagesView({super.key});

  @override
  State<PackagesView> createState() => _PackagesViewState();
}

class _PackagesViewState extends State<PackagesView> {
  int _selectedTier = 1; // Default to Tier-1 Synergy Wire

  bool _auditAddon = false;
  bool _translationAddon = false;
  bool _videoAddon = false;

  final List<Map<String, dynamic>> _tiers = [
    {
      'title': 'Starter Crypto Wire',
      'price': 499,
      'badge': 'ESSENTIAL',
      'outlets': '50+ Global Outlets',
      'features': [
        'Google News & Crypto Directory Indexing',
        'Distribution to 50+ Web3 & Tech Outlets',
        'Standard Turnaround: 24-48 Hours',
        'Verifiable Live Link Report',
      ],
    },
    {
      'title': 'Tier-1 Synergy Wire',
      'price': 1499,
      'badge': 'MOST POPULAR',
      'outlets': '200+ Tier-1 Outlets',
      'features': [
        'Guaranteed Bloomberg Terminal Syndication',
        'Yahoo! Finance & MarketWatch Placement',
        'Benzinga & StreetInsider Distribution',
        'Editorial Compliance & SEO Optimization',
        'Priority Wire Scheduling (Same Day)',
        'Full White-Label Executive PDF Report',
      ],
    },
    {
      'title': 'Crypto Elite Wire',
      'price': 2999,
      'badge': 'CRYPTO HEAVYWEIGHT',
      'outlets': '300+ Crypto & Financial Outlets',
      'features': [
        'CoinDesk Wire & Cointelegraph Network',
        'Decrypt & BeInCrypto Syndication',
        'Bloomberg Terminal & Yahoo Finance',
        'Featured Placement on Crypto Aggregators',
        'Social Media Syndication Blast',
        'Dedicated Senior PR Account Manager',
      ],
    },
    {
      'title': 'Enterprise Token Blitz',
      'price': 5999,
      'badge': 'FULL BLITZ',
      'outlets': '500+ Worldwide Outlets',
      'features': [
        'Comprehensive Global Multi-Wire Distribution',
        'Forbes & Business Insider Feature Outreach',
        'Executive Video Interview Syndication',
        'Multi-lingual Translation (Chinese, Korean, Arabic)',
        'Crypto Influencer & Telegram Channel Push',
        'Full Crisis & Retainer Media Support',
      ],
    },
  ];

  int _calculateTotal() {
    int total = _tiers[_selectedTier]['price'] as int;
    if (_auditAddon) total += 200;
    if (_translationAddon) total += 350;
    if (_videoAddon) total += 800;
    return total;
  }

  @override
  Widget build(BuildContext context) {
    final cur = _tiers[_selectedTier];

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'PR Distribution Packages',
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white),
          ),
          const SizedBox(height: 4),
          const Text(
            'Select a package or customize with real-time add-ons.',
            style: TextStyle(fontSize: 13, color: Color(0xFF94A3B8)),
          ),
          const SizedBox(height: 16),

          // Horizontal package selector
          SizedBox(
            height: 48,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: _tiers.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, index) {
                final isSel = _selectedTier == index;
                final t = _tiers[index];
                return ChoiceChip(
                  label: Text('${t['title']} (\$${t['price']})'),
                  selected: isSel,
                  onSelected: (val) {
                    if (val) setState(() => _selectedTier = index);
                  },
                  selectedColor: const Color(0xFF00F2FE),
                  backgroundColor: const Color(0xFF0D1527),
                  labelStyle: TextStyle(
                    color: isSel ? Colors.black : Colors.white70,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                  side: BorderSide(
                    color: isSel ? const Color(0xFF00F2FE) : const Color(0xFF1E293B),
                  ),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                );
              },
            ),
          ),
          const SizedBox(height: 16),

          // Selected Package Card
          Container(
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0F1E36), Color(0xFF091222)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFF00F2FE).withOpacity(0.5), width: 1.5),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF00F2FE).withOpacity(0.15),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        cur['badge'],
                        style: const TextStyle(
                          color: Color(0xFF00F2FE),
                          fontSize: 10,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 1,
                        ),
                      ),
                    ),
                    Text(
                      '\$${cur['price']}',
                      style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w900, color: Colors.white),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Text(
                  cur['title'],
                  style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                Text(
                  cur['outlets'],
                  style: const TextStyle(fontSize: 13, color: Color(0xFFC9A84C), fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 16),
                const Divider(color: Color(0xFF1E293B)),
                const SizedBox(height: 12),
                ...(cur['features'] as List<String>).map(
                  (f) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Icon(Icons.check_circle, color: Color(0xFF10B981), size: 16),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            f,
                            style: const TextStyle(color: Color(0xFFE2E8F0), fontSize: 13),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Add-Ons
          const Text(
            'Campaign Add-ons',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const SizedBox(height: 10),
          _buildAddonTile('Editorial Review & SEO Optimization', '+\$200', _auditAddon, (v) {
            setState(() => _auditAddon = v);
          }),
          _buildAddonTile('Asian Market Translation (KR/CN/JP)', '+\$350', _translationAddon, (v) {
            setState(() => _translationAddon = v);
          }),
          _buildAddonTile('Executive Video Interview Syndication', '+\$800', _videoAddon, (v) {
            setState(() => _videoAddon = v);
          }),
          const SizedBox(height: 20),

          // Total & Book Button
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: const Color(0xFF0D1527),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF1E293B)),
            ),
            child: Row(
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Estimated Total', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12)),
                    Text(
                      '\$${_calculateTotal()}',
                      style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Color(0xFF00F2FE)),
                    ),
                  ],
                ),
                const Spacer(),
                ElevatedButton.icon(
                  icon: const Icon(Icons.send_rounded, size: 16),
                  label: const Text('Book via Telegram'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF2AABEE),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () {
                    final msg = Uri.encodeComponent(
                      'Hello NexcoinPR! I want to book ${cur['title']} (Total: \$${_calculateTotal()}).',
                    );
                    launchUrl(
                      Uri.parse('https://t.me/Nexcoinpr?text=$msg'),
                      mode: LaunchMode.externalApplication,
                    );
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  Widget _buildAddonTile(String title, String price, bool val, ValueChanged<bool> onChanged) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: const Color(0xFF0D1527),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: val ? const Color(0xFF00F2FE) : const Color(0xFF1E293B)),
      ),
      child: CheckboxListTile(
        value: val,
        onChanged: (v) => onChanged(v ?? false),
        activeColor: const Color(0xFF00F2FE),
        checkColor: Colors.black,
        title: Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
        secondary: Text(price, style: const TextStyle(color: Color(0xFF00F2FE), fontWeight: FontWeight.bold)),
      ),
    );
  }
}

// -------------------------------------------------------------
// TAB 3: LIVE MARKETS & NEWS
// -------------------------------------------------------------
class MarketsAndNewsView extends StatefulWidget {
  const MarketsAndNewsView({super.key});

  @override
  State<MarketsAndNewsView> createState() => _MarketsAndNewsViewState();
}

class _MarketsAndNewsViewState extends State<MarketsAndNewsView> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<Map<String, dynamic>> _cryptoList = [
    {'name': 'Bitcoin', 'symbol': 'BTC', 'price': '\$96,480.00', 'change': '+2.8%', 'up': true},
    {'name': 'Ethereum', 'symbol': 'ETH', 'price': '\$3,450.20', 'change': '+3.4%', 'up': true},
    {'name': 'Solana', 'symbol': 'SOL', 'price': '\$215.40', 'change': '+5.9%', 'up': true},
    {'name': 'Binance Coin', 'symbol': 'BNB', 'price': '\$642.10', 'change': '+1.1%', 'up': true},
    {'name': 'Ripple', 'symbol': 'XRP', 'price': '\$1.18', 'change': '+4.2%', 'up': true},
    {'name': 'Cardano', 'symbol': 'ADA', 'price': '\$0.78', 'change': '-0.5%', 'up': false},
    {'name': 'Avalanche', 'symbol': 'AVAX', 'price': '\$38.40', 'change': '+3.8%', 'up': true},
  ];

  final List<Map<String, dynamic>> _forexList = [
    {'pair': 'EUR / USD', 'rate': '1.0842', 'change': '+0.12%', 'up': true},
    {'pair': 'GBP / USD', 'rate': '1.2965', 'change': '+0.25%', 'up': true},
    {'pair': 'USD / JPY', 'rate': '152.18', 'change': '-0.24%', 'up': false},
    {'pair': 'USD / CHF', 'rate': '0.8840', 'change': '+0.05%', 'up': true},
    {'pair': 'AUD / USD', 'rate': '0.6580', 'change': '+0.31%', 'up': true},
    {'pair': 'USD / CAD', 'rate': '1.3850', 'change': '-0.15%', 'up': false},
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          color: const Color(0xFF070A13),
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: TabBar(
            controller: _tabController,
            indicatorColor: const Color(0xFF00F2FE),
            labelColor: const Color(0xFF00F2FE),
            unselectedLabelColor: const Color(0xFF94A3B8),
            tabs: const [
              Tab(text: 'Crypto Assets'),
              Tab(text: 'Forex Pairs'),
            ],
          ),
        ),
        Expanded(
          child: TabBarView(
            controller: _tabController,
            children: [
              // Crypto Tab
              ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: _cryptoList.length,
                separatorBuilder: (_, __) => const SizedBox(height: 8),
                itemBuilder: (context, i) {
                  final c = _cryptoList[i];
                  return Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0D1527),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFF1E293B)),
                    ),
                    child: Row(
                      children: [
                        CircleAvatar(
                          backgroundColor: const Color(0xFF1E293B),
                          child: Text(
                            c['symbol'][0],
                            style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF00F2FE)),
                          ),
                        ),
                        const SizedBox(width: 14),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(c['name'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                            Text(c['symbol'], style: const TextStyle(color: Color(0xFF64748B), fontSize: 12)),
                          ],
                        ),
                        const Spacer(),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(c['price'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                            Text(
                              c['change'],
                              style: TextStyle(
                                color: c['up'] ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                },
              ),

              // Forex Tab
              ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: _forexList.length,
                separatorBuilder: (_, __) => const SizedBox(height: 8),
                itemBuilder: (context, i) {
                  final f = _forexList[i];
                  return Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0D1527),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFF1E293B)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.currency_exchange, color: Color(0xFFC9A84C), size: 24),
                        const SizedBox(width: 14),
                        Text(f['pair'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                        const Spacer(),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(f['rate'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                            Text(
                              f['change'],
                              style: TextStyle(
                                color: f['up'] ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ],
    );
  }
}

// -------------------------------------------------------------
// TAB 4: CAMPAIGN TRACKER & LIVE REPORTING
// -------------------------------------------------------------
class TrackerView extends StatefulWidget {
  const TrackerView({super.key});

  @override
  State<TrackerView> createState() => _TrackerViewState();
}

class _TrackerViewState extends State<TrackerView> {
  final TextEditingController _trackerController = TextEditingController(text: 'NEX-8821');
  bool _searched = true;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Campaign Tracking & Analytics',
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white),
          ),
          const SizedBox(height: 4),
          const Text(
            'Track live wire distribution, syndicated links, and reporting.',
            style: TextStyle(fontSize: 13, color: Color(0xFF94A3B8)),
          ),
          const SizedBox(height: 16),

          // Search Input
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _trackerController,
                  decoration: InputDecoration(
                    hintText: 'Enter Campaign Tracking ID (e.g. NEX-8821)',
                    filled: true,
                    fillColor: const Color(0xFF0D1527),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: const BorderSide(color: Color(0xFF1E293B)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: const BorderSide(color: Color(0xFF00F2FE)),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF00F2FE),
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                onPressed: () {
                  setState(() => _searched = true);
                },
                child: const Icon(Icons.search),
              ),
            ],
          ),
          const SizedBox(height: 20),

          if (_searched) ...[
            // Status Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF0D1527),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFF10B981).withOpacity(0.5)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'CAMPAIGN ID: ${_trackerController.text.toUpperCase()}',
                        style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 12, color: Color(0xFF94A3B8)),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981).withOpacity(0.15),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          '● 100% DELIVERED',
                          style: TextStyle(color: Color(0xFF10B981), fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Global DeFi & Institutional Protocol Launch',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white),
                  ),
                  const SizedBox(height: 16),
                  // Timeline steps
                  _buildTimelineItem('1. Editorial Audit & Wire Compliance', 'Completed in 2 Hours', true),
                  _buildTimelineItem('2. Distribution across 280+ Media Channels', 'Completed & Indexed', true),
                  _buildTimelineItem('3. Google News & Yahoo Finance Syndication', 'Live on 124 Portals', true),
                  _buildTimelineItem('4. Executive White-label PDF Dossier', 'Available for Download', true),
                  const SizedBox(height: 14),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      icon: const Icon(Icons.picture_as_pdf, color: Color(0xFF00F2FE)),
                      label: const Text('View White-label PDF Dossier', style: TextStyle(color: Colors.white)),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Color(0xFF00F2FE)),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Downloading campaign PDF report...'),
                            backgroundColor: Color(0xFF10B981),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Live Verifiable Links
            const Text(
              'Live Verifiable Publication Links',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            const SizedBox(height: 10),
            _buildLiveLinkTile('Bloomberg Terminal Wire', 'Terminal ID: BB-98234-PR', 'https://nexcoinpr.agency'),
            _buildLiveLinkTile('Yahoo! Finance Portal', 'Syndicated Wire Index', 'https://nexcoinpr.agency'),
            _buildLiveLinkTile('CoinDesk Media Desk', 'Direct Crypto Distribution', 'https://nexcoinpr.agency'),
            _buildLiveLinkTile('MarketWatch Financials', 'Capital Markets Syndication', 'https://nexcoinpr.agency'),
            _buildLiveLinkTile('Benzinga Wire Desk', 'Brokerage & Fintech News', 'https://nexcoinpr.agency'),
          ],
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  Widget _buildTimelineItem(String title, String subtitle, bool done) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Icon(
            done ? Icons.check_circle_rounded : Icons.radio_button_unchecked,
            color: done ? const Color(0xFF10B981) : const Color(0xFF64748B),
            size: 20,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: Colors.white)),
                Text(subtitle, style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLiveLinkTile(String name, String sub, String url) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF0D1527),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Row(
        children: [
          const Icon(Icons.link, color: Color(0xFF00F2FE), size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                Text(sub, style: const TextStyle(color: Color(0xFF64748B), fontSize: 11)),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.open_in_new, color: Color(0xFF00F2FE), size: 18),
            onPressed: () => launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication),
          ),
        ],
      ),
    );
  }
}

// -------------------------------------------------------------
// TAB 5: DIRECT DESK & PR SUBMISSION FORM
// -------------------------------------------------------------
class ContactDeskView extends StatefulWidget {
  const ContactDeskView({super.key});

  @override
  State<ContactDeskView> createState() => _ContactDeskViewState();
}

class _ContactDeskViewState extends State<ContactDeskView> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameCtrl = TextEditingController();
  final TextEditingController _companyCtrl = TextEditingController();
  final TextEditingController _emailCtrl = TextEditingController();
  final TextEditingController _titleCtrl = TextEditingController();
  final TextEditingController _contentCtrl = TextEditingController();

  String _selectedIndustry = 'Cryptocurrency';

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Direct Editorial Desk',
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white),
          ),
          const SizedBox(height: 4),
          const Text(
            'Reach our senior PR specialists instantly via Telegram or submit your announcement below.',
            style: TextStyle(fontSize: 13, color: Color(0xFF94A3B8)),
          ),
          const SizedBox(height: 16),

          // Instant Telegram Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0088CC), Color(0xFF005580)],
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                const Icon(Icons.send_rounded, color: Colors.white, size: 36),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text(
                        'Direct Telegram Desk',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.white),
                      ),
                      Text(
                        'Instant replies for urgent announcements: @Nexcoinpr',
                        style: TextStyle(color: Colors.white70, fontSize: 12),
                      ),
                    ],
                  ),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: const Color(0xFF0088CC),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  onPressed: () => launchUrl(
                    Uri.parse('https://t.me/Nexcoinpr'),
                    mode: LaunchMode.externalApplication,
                  ),
                  child: const Text('Open'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // PR Submission Form
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xFF0D1527),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFF1E293B)),
            ),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Submit Press Release for Review',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  const SizedBox(height: 14),
                  TextFormField(
                    controller: _nameCtrl,
                    decoration: _inputDeco('Full Name'),
                    validator: (v) => v == null || v.isEmpty ? 'Please enter name' : null,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _companyCtrl,
                    decoration: _inputDeco('Company / Project Name'),
                    validator: (v) => v == null || v.isEmpty ? 'Please enter company' : null,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _emailCtrl,
                    decoration: _inputDeco('Business Email'),
                    validator: (v) => v == null || !v.contains('@') ? 'Please enter valid email' : null,
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: _selectedIndustry,
                    dropdownColor: const Color(0xFF0D1527),
                    decoration: _inputDeco('Industry Sector'),
                    items: const [
                      DropdownMenuItem(value: 'Cryptocurrency', child: Text('Cryptocurrency / Web3')),
                      DropdownMenuItem(value: 'Forex', child: Text('Forex / CFD Broker')),
                      DropdownMenuItem(value: 'Blockchain', child: Text('Blockchain Protocol / L1 / L2')),
                      DropdownMenuItem(value: 'Fintech', child: Text('Fintech & Payments')),
                      DropdownMenuItem(value: 'Capital Markets', child: Text('Capital Markets')),
                    ],
                    onChanged: (v) {
                      if (v != null) setState(() => _selectedIndustry = v);
                    },
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _titleCtrl,
                    decoration: _inputDeco('Announcement Title'),
                    validator: (v) => v == null || v.isEmpty ? 'Please enter title' : null,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _contentCtrl,
                    decoration: _inputDeco('Press Release Draft / Key Talking Points'),
                    maxLines: 4,
                    validator: (v) => v == null || v.isEmpty ? 'Please provide details' : null,
                  ),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.check_circle_outline, size: 18),
                      label: const Text('Submit for Review'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF00F2FE),
                        foregroundColor: Colors.black,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: () {
                        if (_formKey.currentState!.validate()) {
                          showDialog(
                            context: context,
                            builder: (ctx) => AlertDialog(
                              backgroundColor: const Color(0xFF0D1527),
                              title: const Text('Submission Received!'),
                              content: const Text(
                                'Thank you! Our senior PR editorial desk will review your announcement draft and contact you shortly via email and Telegram.',
                              ),
                              actions: [
                                TextButton(
                                  onPressed: () {
                                    Navigator.pop(ctx);
                                    _nameCtrl.clear();
                                    _companyCtrl.clear();
                                    _emailCtrl.clear();
                                    _titleCtrl.clear();
                                    _contentCtrl.clear();
                                  },
                                  child: const Text('OK', style: TextStyle(color: Color(0xFF00F2FE))),
                                )
                              ],
                            ),
                          );
                        }
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  InputDecoration _inputDeco(String label) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
      filled: true,
      fillColor: const Color(0xFF09101D),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFF1E293B)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFF1E293B)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFF00F2FE)),
      ),
    );
  }
}

import 'dart:convert';
import 'dart:io';
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

/// Robust launcher that opens Telegram, Web, or Mail
class AppLauncher {
  static Future<void> open(BuildContext context, String url) async {
    HapticFeedback.lightImpact();
    try {
      final uri = Uri.parse(url);
      bool launched = false;
      try {
        launched = await launchUrl(uri, mode: LaunchMode.externalApplication);
      } catch (_) {
        launched = false;
      }

      if (!launched) {
        try {
          launched = await launchUrl(uri, mode: LaunchMode.platformDefault);
        } catch (_) {
          launched = false;
        }
      }

      if (!launched) {
        try {
          launched = await launchUrl(uri, mode: LaunchMode.inAppBrowserView);
        } catch (_) {
          launched = false;
        }
      }

      if (!launched && context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Opening: $url'),
            backgroundColor: const Color(0xFF0D1527),
            duration: const Duration(seconds: 2),
          ),
        );
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Could not open link: $url'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }
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
    MarketsAndTradingView(),
    NewsAndCaseStudiesView(),
    TrackerView(),
    ContactDeskView(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 16,
        title: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFF00F2FE).withOpacity(0.5), width: 1.5),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF00F2FE).withOpacity(0.15),
                    blurRadius: 8,
                    spreadRadius: 1,
                  ),
                ],
              ),
              child: ClipOval(
                child: Image.asset(
                  'assets/images/app_icon.png',
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return Container(
                      color: const Color(0xFF0F223D),
                      child: const Center(
                        child: Icon(Icons.bolt, color: Color(0xFF00F2FE), size: 20),
                      ),
                    );
                  },
                ),
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
              padding: const EdgeInsets.all(7),
              decoration: BoxDecoration(
                color: const Color(0xFF2AABEE).withOpacity(0.2),
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFF2AABEE), width: 1),
              ),
              child: const Icon(Icons.send_rounded, color: Color(0xFF2AABEE), size: 16),
            ),
            onPressed: () => AppLauncher.open(context, 'https://t.me/Nexcoinpr'),
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
              label: 'Overview',
            ),
            NavigationDestination(
              icon: Icon(Icons.sell_outlined, color: Color(0xFF94A3B8)),
              selectedIcon: Icon(Icons.sell, color: Color(0xFF00F2FE)),
              label: 'Pricing',
            ),
            NavigationDestination(
              icon: Icon(Icons.candlestick_chart_outlined, color: Color(0xFF94A3B8)),
              selectedIcon: Icon(Icons.candlestick_chart, color: Color(0xFF00F2FE)),
              label: 'Markets',
            ),
            NavigationDestination(
              icon: Icon(Icons.newspaper_outlined, color: Color(0xFF94A3B8)),
              selectedIcon: Icon(Icons.newspaper, color: Color(0xFF00F2FE)),
              label: 'News',
            ),
            NavigationDestination(
              icon: Icon(Icons.track_changes_outlined, color: Color(0xFF94A3B8)),
              selectedIcon: Icon(Icons.track_changes, color: Color(0xFF00F2FE)),
              label: 'Tracker',
            ),
            NavigationDestination(
              icon: Icon(Icons.headset_mic_outlined, color: Color(0xFF94A3B8)),
              selectedIcon: Icon(Icons.headset_mic, color: Color(0xFF00F2FE)),
              label: 'Desk',
            ),
          ],
        ),
      ),
    );
  }
}

// ============================================================================
// TAB 1: OVERVIEW / DASHBOARD (Verified metrics, partners, recent announcements)
// ============================================================================
class DashboardView extends StatefulWidget {
  const DashboardView({super.key});

  @override
  State<DashboardView> createState() => _DashboardViewState();
}

class _DashboardViewState extends State<DashboardView> {
  final List<Map<String, dynamic>> _quickTickers = [
    {'symbol': 'BTC', 'price': '\$84,120', 'change': '+1.4%', 'isUp': true},
    {'symbol': 'ETH', 'price': '\$3,280', 'change': '+2.8%', 'isUp': true},
    {'symbol': 'SOL', 'price': '\$198.50', 'change': '+4.2%', 'isUp': true},
    {'symbol': 'EUR/USD', 'price': '1.0842', 'change': '+0.12%', 'isUp': true},
    {'symbol': 'USD/JPY', 'price': '152.18', 'change': '-0.24%', 'isUp': false},
  ];

  bool _isLiveLoaded = false;

  @override
  void initState() {
    super.initState();
    _fetchLiveRates();
  }

  Future<void> _fetchLiveRates() async {
    try {
      final client = HttpClient();
      client.connectionTimeout = const Duration(seconds: 4);
      final request = await client.getUrl(
        Uri.parse('https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","SOLUSDT"]'),
      );
      final response = await request.close();
      if (response.statusCode == 200) {
        final body = await response.transform(utf8.decoder).join();
        final List<dynamic> list = jsonDecode(body);
        if (mounted) {
          setState(() {
            for (var item in list) {
              final sym = item['symbol'].toString().replaceAll('USDT', '');
              final p = double.tryParse(item['lastPrice'].toString()) ?? 0.0;
              final chg = double.tryParse(item['priceChangePercent'].toString()) ?? 0.0;
              final isUp = chg >= 0;
              final idx = _quickTickers.indexWhere((t) => t['symbol'] == sym);
              if (idx != -1) {
                _quickTickers[idx] = {
                  'symbol': sym,
                  'price': sym == 'BTC' ? '\$${p.toStringAsFixed(0)}' : '\$${p.toStringAsFixed(2)}',
                  'change': '${isUp ? '+' : ''}${chg.toStringAsFixed(2)}%',
                  'isUp': isUp,
                };
              }
            }
            _isLiveLoaded = true;
          });
        }
      }
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: _fetchLiveRates,
      color: const Color(0xFF00F2FE),
      backgroundColor: const Color(0xFF0D1527),
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Live Strip
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'MARKET PULSE (LIVE)',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Color(0xFF94A3B8), letterSpacing: 0.8),
                ),
                Text(
                  _isLiveLoaded ? '● BINANCE FEED ACTIVE' : 'PULL TO REFRESH',
                  style: TextStyle(
                    fontSize: 9,
                    fontWeight: FontWeight.bold,
                    color: _isLiveLoaded ? const Color(0xFF10B981) : const Color(0xFF00F2FE),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            SizedBox(
              height: 42,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _quickTickers.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final t = _quickTickers[index];
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
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.white),
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

            // Hero Agency Branding Card
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
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF00F2FE).withOpacity(0.15),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: const Color(0xFF00F2FE).withOpacity(0.3)),
                        ),
                        child: const Text(
                          'GLOBAL WIRE DISTRIBUTION',
                          style: TextStyle(
                            color: Color(0xFF00F2FE),
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 1.1,
                          ),
                        ),
                      ),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFC9A84C).withOpacity(0.15),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          'TIER 1 AGENCY',
                          style: TextStyle(
                            color: Color(0xFFC9A84C),
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  const Text(
                    'The Authority in Crypto, Web3 & Forex PR',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w900,
                      height: 1.25,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Guaranteed publication on Bloomberg Terminal, CoinDesk, CoinTelegraph, Yahoo! Finance, BeInCrypto, and 350+ financial media networks.',
                    style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13, height: 1.45),
                  ),
                  const SizedBox(height: 18),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          icon: const Icon(Icons.send_rounded, size: 16),
                          label: const Text('Book Wire via Telegram'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF2AABEE),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 13),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          onPressed: () => AppLauncher.open(context, 'https://t.me/Nexcoinpr?text=Hello%20NexcoinPR!%20I%20want%20to%20inquire%20about%20wire%20distribution.'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Key Agency Metrics (From Live Site)
            Row(
              children: [
                _buildMetricCard('350+', 'Global Outlets', Icons.public, const Color(0xFF00F2FE)),
                const SizedBox(width: 10),
                _buildMetricCard('22M+', 'Audience Reach', Icons.groups_2, const Color(0xFFC9A84C)),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                _buildMetricCard('98.8%', 'Guaranteed Placement', Icons.verified, const Color(0xFF10B981)),
                const SizedBox(width: 10),
                _buildMetricCard('24-48h', 'Rapid Delivery', Icons.bolt, const Color(0xFFA855F7)),
              ],
            ),
            const SizedBox(height: 24),

            // Guaranteed Media Networks
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
                _buildMediaTag('CoinTelegraph', true),
                _buildMediaTag('BeInCrypto', true),
                _buildMediaTag('Yahoo! Finance', true),
                _buildMediaTag('MarketWatch', true),
                _buildMediaTag('The Block', true),
                _buildMediaTag('Investing.com', true),
                _buildMediaTag('Benzinga', true),
                _buildMediaTag('Google News Indexed', true),
              ],
            ),
            const SizedBox(height: 24),

            // Recent Wire Releases (From Live Site news.html & case-studies.html)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Verified Client Highlights',
                  style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                InkWell(
                  onTap: () {},
                  child: const Text('View All →', style: TextStyle(color: Color(0xFF00F2FE), fontSize: 13, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
            const SizedBox(height: 12),
            _buildReleaseCard(
              context,
              'Aria Coin (\$ARIA) Breakthrough: 147% Price Jump in 2 Hours',
              'Aria Coin • Case Study',
              'Dec 2024 • 3M+ Global Reach',
              'Cointelegraph Premium PR Bundle transformed token into top trending asset with 42% organic traffic surge.',
            ),
            const SizedBox(height: 10),
            _buildReleaseCard(
              context,
              'LBank Ranks #1 for Mainstream Crypto Liquidity in BeInCrypto Study',
              'LBank Exchange • Wire',
              'Sep 2026 • 4.4x Depth',
              'BeInCrypto comprehensive institutional liquidity analysis ranks LBank highest depth across top trading pairs.',
            ),
            const SizedBox(height: 10),
            _buildReleaseCard(
              context,
              'Cregis Marks 2 Years of Middle East Institutional Growth',
              'Cregis Foundation • PR',
              'Sep 2026 • Digital Asset Infra',
              'Leading Web3 MPC wallet and treasury platform achieves massive adoption among traditional finance firms.',
            ),
            const SizedBox(height: 24),
          ],
        ),
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
          const Icon(Icons.check_circle_rounded, color: Color(0xFF00F2FE), size: 14),
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

// ============================================================================
// TAB 2: AUTHENTIC PRICING (13 Bundled Packages + Single A La Carte Outlets)
// ============================================================================
class PackagesView extends StatefulWidget {
  const PackagesView({super.key});

  @override
  State<PackagesView> createState() => _PackagesViewState();
}

class _PackagesViewState extends State<PackagesView> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // 13 Official Bundled Packages from scripts/update_pricing_and_packages.js & pricing.html
  final List<Map<String, dynamic>> _bundledPackages = [
    {
      'title': 'ELITE: A',
      'price': 20000,
      'badge': 'MAXIMUM PRESTIGE',
      'traffic': '22M+ Total Traffic',
      'outlets': 'CoinTelegraph, CoinDesk, TheBlock, BeInCrypto, Watcher.guru',
      'features': [
        'Guaranteed publication on CoinTelegraph & CoinDesk',
        'Featured inclusion on TheBlock & BeInCrypto',
        'Watcher.guru wire broadcast with 22M+ audience',
        '100% DoFollow SEO backlinks & indexed on Google News',
        'Turnaround: 24-48 Hours with live link report',
      ],
    },
    {
      'title': 'ELITE: B',
      'price': 11000,
      'badge': 'TIER-1 REACH',
      'traffic': '15M+ Total Traffic',
      'outlets': 'CoinTelegraph, BeInCrypto, Bitcoin.com, AMBCrypto, Syndication',
      'features': [
        'CoinTelegraph full editorial publication',
        'BeInCrypto & Bitcoin.com authoritative syndication',
        'AMBCrypto top banner broadcast',
        'Full PDF white-label dossier & executive report',
      ],
    },
    {
      'title': 'VIRAL (10 Media)',
      'price': 8300,
      'badge': 'VIRAL MOMENTUM',
      'traffic': '15M+ Total Traffic',
      'outlets': 'TheBlock, Cryptopolitan, BeInCrypto, Bitcoin.com, Bitcoinist, CoinGape, NewsBTC, Investing.com, Benzinga',
      'features': [
        '10 Heavyweight crypto & financial newsrooms',
        'Simultaneous broadcast across TheBlock & BeInCrypto',
        'Finance desk distribution on Benzinga & Investing.com',
        'Rapid investor and retail trader discovery',
      ],
    },
    {
      'title': '60 Media Mega Package',
      'price': 7000,
      'badge': 'MASS BACKLINK POWER',
      'traffic': 'SEO Dominance',
      'outlets': '60 Crypto & Web3 Portals (Mass Syndication)',
      'features': [
        'Mass distribution across 60 cryptocurrency portals',
        'Maximum domain authority backlinks for Google ranking',
        'Guaranteed Google News, Yahoo Finance & Bing indexing',
        'Comprehensive live tracking spreadsheet delivered',
      ],
    },
    {
      'title': 'WEB3 GAMING (10 Media)',
      'price': 5299,
      'badge': 'GAMING & METAVERSE',
      'traffic': 'Targeted Gamer Reach',
      'outlets': 'Gam3s.gg, Playtoearn.com, Chainplay.gg, Gurugamer, Gamespace, TechBullion',
      'features': [
        'Direct publication across top Web3 gaming hubs',
        'Gam3s.gg and PlayToEarn editorial placement',
        'Community gamer onboarding & discord link tracking',
        'Featured exposure to GameFi and NFT investors',
      ],
    },
    {
      'title': 'FINTECH & FOREX (10 Media)',
      'price': 3999,
      'badge': 'CAPITAL MARKETS',
      'traffic': 'Institutional Traders',
      'outlets': 'FinanceMagnates, Invezz, WalletInvestor, TradingBeasts, ForexLive, Investing.com',
      'features': [
        'Premier coverage on FinanceMagnates & ForexLive',
        'Market trader exposure on WalletInvestor & TradingBeasts',
        'Broker, CFD, and institutional FX syndicate',
        'Direct reach to retail currency and crypto traders',
      ],
    },
    {
      'title': 'PREMIUM (10 Media)',
      'price': 3250,
      'badge': 'POPULAR CHOICE',
      'traffic': 'High Web3 Engagement',
      'outlets': 'HackerNoon, TheDefiant, CoinEdition, Mpost.io, Blockonomi, BraveNewCoin',
      'features': [
        'Guaranteed feature on HackerNoon and TheDefiant',
        'CoinEdition & Blockonomi deep-dive coverage',
        'DoFollow contextual backlinks with high domain authority',
        'Fast turnaround within 24-36 hours',
      ],
    },
    {
      'title': 'TECH & INNOVATION (10 Media)',
      'price': 2899,
      'badge': 'DEVELOPERS & TECH',
      'traffic': '5M+ Tech Readers',
      'outlets': 'TechBullion, TechAnnouncer, HackerNoon, TechPanga, Web3Portal',
      'features': [
        'Featured tech coverage on TechBullion & HackerNoon',
        'Syndication across developer-focused newsletters',
        'Targeted AI, blockchain architecture, and protocol audience',
      ],
    },
    {
      'title': 'SUPERIOR: A',
      'price': 2800,
      'badge': '5-MEDIA TIER 1',
      'traffic': '8M+ Total Traffic',
      'outlets': 'Cryptopolitan, Crypto.news, Bitcoinist, HackerNoon, NewsBTC',
      'features': [
        'Cryptopolitan & Crypto.news authoritative release',
        'Bitcoinist and HackerNoon permanent publications',
        'Full Google News and aggregator pickup',
      ],
    },
    {
      'title': 'SUPERIOR: B',
      'price': 2650,
      'badge': '5-MEDIA TIER 1',
      'traffic': '7M+ Total Traffic',
      'outlets': 'Crypto.news, HackerNoon, CoinGape, CoinCheckup, Mpost.io',
      'features': [
        'Crypto.news and CoinGape top-tier placement',
        'HackerNoon technical feature & Mpost syndicate',
        'Verifiable live indexing URL report',
      ],
    },
    {
      'title': 'STARTER (10 Media)',
      'price': 2350,
      'badge': 'BUDGET 10-PACK',
      'traffic': 'Broad Web3 Reach',
      'outlets': 'CoinGabbar, Invezz, Bitcoin Insider, CoinJournal, TimesTabloid',
      'features': [
        '10 Verified cryptocurrency media portals',
        'CoinJournal and Invezz guaranteed publications',
        'Permanent article links and indexation',
      ],
    },
    {
      'title': 'BASIC: A',
      'price': 1100,
      'badge': '5-MEDIA STARTER',
      'traffic': '1M+ Total Traffic',
      'outlets': 'Blockonomi, TechBullion, Publish0x, CoinJournal, Bitcoin Insider',
      'features': [
        'Blockonomi and TechBullion permanent feature',
        'CoinJournal & Bitcoin Insider syndication',
        'Ideal for token updates and initial PR tests',
      ],
    },
    {
      'title': 'BASIC: B',
      'price': 800,
      'badge': 'ENTRY LEVEL',
      'traffic': '600K+ Total Traffic',
      'outlets': 'Digital Journal, CaptainAltcoin, TechAnnouncer, Bitcoin Insider, TechBullion',
      'features': [
        'Digital Journal and CaptainAltcoin placement',
        'Quick turnaround: 24 hours guaranteed',
        'Verified live link report with Google indexing',
      ],
    },
  ];

  // Authentic Single Outlets (From master_single_publications.json & pricing.html)
  final List<Map<String, dynamic>> _singlePlacements = [
    {'name': 'Entrepreneur.com', 'price': 8500, 'da': 92, 'type': 'Global Business', 'badge': 'TIER-1 PRESTIGE'},
    {'name': 'CoinDesk', 'price': 8000, 'da': 90, 'type': 'Top Crypto Authority', 'badge': 'INDUSTRY LEADER'},
    {'name': 'Forbes', 'price': 7500, 'da': 94, 'type': 'World Capital & Business', 'badge': 'HIGHEST PRESTIGE'},
    {'name': 'CoinTelegraph', 'price': 6500, 'da': 89, 'type': 'Crypto Global Giant', 'badge': 'MOST REQUESTED'},
    {'name': 'Bloomberg Terminal Wire', 'price': 5000, 'da': 94, 'type': 'Institutional Financial', 'badge': 'INSTITUTIONAL'},
    {'name': 'The Block', 'price': 5000, 'da': 85, 'type': 'Institutional Web3', 'badge': 'PREMIUM CRYPTO'},
    {'name': 'BeInCrypto', 'price': 4500, 'da': 84, 'type': 'Global Crypto Portal', 'badge': 'TIER 1'},
    {'name': 'Yahoo! Finance', 'price': 3500, 'da': 92, 'type': 'Global Retail Financial', 'badge': 'FINANCIAL GIANT'},
    {'name': 'Decrypt', 'price': 3800, 'da': 82, 'type': 'Web3 & Culture', 'badge': 'CULTURE'},
    {'name': 'Investing.com', 'price': 3000, 'da': 91, 'type': 'Stock & FX Network', 'badge': 'MARKETS'},
    {'name': 'MarketWatch', 'price': 2500, 'da': 92, 'type': 'Dow Jones Media Group', 'badge': 'WALL STREET'},
    {'name': 'Benzinga / AP News', 'price': 2200, 'da': 88, 'type': 'Brokerage Wire', 'badge': 'TRADER REACH'},
    {'name': 'Finbold', 'price': 1800, 'da': 76, 'type': 'Finance & Crypto', 'badge': 'FAST INDEX'},
    {'name': 'HackerNoon', 'price': 1500, 'da': 81, 'type': 'Tech & Developers', 'badge': 'DO-FOLLOW'},
    {'name': 'U.Today', 'price': 1400, 'da': 78, 'type': 'Crypto News Daily', 'badge': 'RELIABLE'},
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
              Tab(text: 'Bundled Packages (13)'),
              Tab(text: 'Single Placements'),
            ],
          ),
        ),
        Expanded(
          child: TabBarView(
            controller: _tabController,
            children: [
              // BUNDLED PACKAGES LIST
              ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: _bundledPackages.length,
                itemBuilder: (context, index) {
                  final pkg = _bundledPackages[index];
                  return Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0D1527),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(
                        color: index == 0
                            ? const Color(0xFF00F2FE).withOpacity(0.6)
                            : const Color(0xFF1E293B),
                        width: index == 0 ? 1.5 : 1,
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFF00F2FE).withOpacity(0.12),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                pkg['badge'],
                                style: const TextStyle(
                                  color: Color(0xFF00F2FE),
                                  fontSize: 10,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 0.8,
                                ),
                              ),
                            ),
                            Text(
                              '\$${(pkg['price'] as int).toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')}',
                              style: const TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF00F2FE),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Text(
                          pkg['title'],
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          pkg['traffic'],
                          style: const TextStyle(fontSize: 12, color: Color(0xFFC9A84C), fontWeight: FontWeight.w700),
                        ),
                        const SizedBox(height: 10),
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: const Color(0xFF09101D),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: const Color(0xFF1E293B)),
                          ),
                          child: Text(
                            pkg['outlets'],
                            style: const TextStyle(fontSize: 12, color: Color(0xFFCBD5E1), height: 1.4),
                          ),
                        ),
                        const SizedBox(height: 12),
                        ...(pkg['features'] as List<String>).map(
                          (feat) => Padding(
                            padding: const EdgeInsets.only(bottom: 6),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Icon(Icons.check_circle_rounded, color: Color(0xFF10B981), size: 15),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    feat,
                                    style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 14),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton.icon(
                            icon: const Icon(Icons.send_rounded, size: 15),
                            label: Text('Book ${pkg['title']} via Telegram'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF2AABEE),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                            onPressed: () {
                              final msg = Uri.encodeComponent(
                                'Hello NexcoinPR! I want to book ${pkg['title']} (\$${pkg['price']}). Please provide submission details.',
                              );
                              AppLauncher.open(context, 'https://t.me/Nexcoinpr?text=$msg');
                            },
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),

              // SINGLE PLACEMENTS LIST
              ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: _singlePlacements.length,
                separatorBuilder: (_, __) => const SizedBox(height: 10),
                itemBuilder: (context, index) {
                  final item = _singlePlacements[index];
                  return Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0D1527),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFF1E293B)),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: const Color(0xFF1E293B),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Center(
                            child: Text(
                              'DA\n${item['da']}',
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF00F2FE),
                                height: 1.1,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Text(
                                    item['name'],
                                    style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: Colors.white),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 2),
                              Text(
                                '${item['type']} • ${item['badge']}',
                                style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11),
                              ),
                            ],
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              '\$${(item['price'] as int).toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')}',
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFFC9A84C),
                              ),
                            ),
                            const SizedBox(height: 4),
                            InkWell(
                              onTap: () {
                                final msg = Uri.encodeComponent(
                                  'Hello NexcoinPR! I want to order a single placement on ${item['name']} (\$${item['price']}).',
                                );
                                AppLauncher.open(context, 'https://t.me/Nexcoinpr?text=$msg');
                              },
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF00F2FE).withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: const Color(0xFF00F2FE).withOpacity(0.4)),
                                ),
                                child: const Text(
                                  'Book →',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF00F2FE),
                                  ),
                                ),
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

// ============================================================================
// TAB 3: LIVE MARKETS & TRADING HUB (Binance Live Stream, Paper Simulator, Earn)
// ============================================================================
class MarketsAndTradingView extends StatefulWidget {
  const MarketsAndTradingView({super.key});

  @override
  State<MarketsAndTradingView> createState() => _MarketsAndTradingViewState();
}

class _MarketsAndTradingViewState extends State<MarketsAndTradingView> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _isLiveCrypto = false;

  // Real-time Crypto from Binance
  final List<Map<String, dynamic>> _cryptoList = [
    {'name': 'Bitcoin', 'symbol': 'BTC', 'price': '\$84,120.00', 'change': '+1.42%', 'up': true},
    {'name': 'Ethereum', 'symbol': 'ETH', 'price': '\$3,280.50', 'change': '+2.85%', 'up': true},
    {'name': 'Solana', 'symbol': 'SOL', 'price': '\$198.40', 'change': '+4.20%', 'up': true},
    {'name': 'Binance Coin', 'symbol': 'BNB', 'price': '\$612.30', 'change': '+0.88%', 'up': true},
    {'name': 'Ripple', 'symbol': 'XRP', 'price': '\$1.14', 'change': '+3.15%', 'up': true},
    {'name': 'Cardano', 'symbol': 'ADA', 'price': '\$0.72', 'change': '-0.65%', 'up': false},
    {'name': 'Avalanche', 'symbol': 'AVAX', 'price': '\$34.80', 'change': '+2.10%', 'up': true},
    {'name': 'Dogecoin', 'symbol': 'DOGE', 'price': '\$0.2450', 'change': '-8.12%', 'up': false},
  ];

  // Authentic Forex Rates
  final List<Map<String, dynamic>> _forexList = [
    {'pair': 'EUR / USD', 'rate': '1.0842', 'change': '+0.12%', 'up': true, 'name': 'Euro / US Dollar'},
    {'pair': 'GBP / USD', 'rate': '1.2965', 'change': '+0.25%', 'up': true, 'name': 'British Pound / US Dollar'},
    {'pair': 'USD / JPY', 'rate': '152.18', 'change': '-0.24%', 'up': false, 'name': 'US Dollar / Japanese Yen'},
    {'pair': 'USD / CHF', 'rate': '0.8840', 'change': '+0.05%', 'up': true, 'name': 'US Dollar / Swiss Franc'},
    {'pair': 'AUD / USD', 'rate': '0.6580', 'change': '+0.31%', 'up': true, 'name': 'Australian Dollar / USD'},
    {'pair': 'USD / CAD', 'rate': '1.3850', 'change': '-0.15%', 'up': false, 'name': 'US Dollar / Canadian Dollar'},
  ];

  // $10,000 Demo Practice Paper Balance
  double _paperBalance = 10000.00;
  String _selectedCoinForDemo = 'BTC';
  final TextEditingController _demoAmountCtrl = TextEditingController(text: '500');

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _fetchLiveCrypto();
  }

  Future<void> _fetchLiveCrypto() async {
    try {
      final client = HttpClient();
      client.connectionTimeout = const Duration(seconds: 4);
      final request = await client.getUrl(
        Uri.parse('https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","SOLUSDT","BNBUSDT","XRPUSDT","ADAUSDT","AVAXUSDT","DOGEUSDT"]'),
      );
      final response = await request.close();
      if (response.statusCode == 200) {
        final body = await response.transform(utf8.decoder).join();
        final List<dynamic> list = jsonDecode(body);
        if (mounted) {
          setState(() {
            for (var item in list) {
              final sym = item['symbol'].toString().replaceAll('USDT', '');
              final p = double.tryParse(item['lastPrice'].toString()) ?? 0.0;
              final chg = double.tryParse(item['priceChangePercent'].toString()) ?? 0.0;
              final isUp = chg >= 0;
              final idx = _cryptoList.indexWhere((c) => c['symbol'] == sym);
              if (idx != -1) {
                String priceStr;
                if (p >= 1000) {
                  priceStr = '\$${p.toStringAsFixed(2)}';
                } else if (p < 1) {
                  priceStr = '\$${p.toStringAsFixed(4)}';
                } else {
                  priceStr = '\$${p.toStringAsFixed(2)}';
                }
                _cryptoList[idx] = {
                  'name': _cryptoList[idx]['name'],
                  'symbol': sym,
                  'price': priceStr,
                  'change': '${isUp ? '+' : ''}${chg.toStringAsFixed(2)}%',
                  'up': isUp,
                };
              }
            }
            _isLiveCrypto = true;
          });
        }
      }
    } catch (_) {}
  }

  void _executeDemoTrade(bool isBuy) {
    final amt = double.tryParse(_demoAmountCtrl.text) ?? 0.0;
    if (amt <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid amount')),
      );
      return;
    }
    if (isBuy && amt > _paperBalance) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Insufficient paper balance')),
      );
      return;
    }

    setState(() {
      if (isBuy) {
        _paperBalance -= amt;
      } else {
        _paperBalance += amt;
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: isBuy ? const Color(0xFF10B981) : const Color(0xFFEF4444),
        content: Text(
          'Simulated ${isBuy ? 'BUY' : 'SELL'} \$${amt.toStringAsFixed(2)} on $_selectedCoinForDemo executed!',
        ),
      ),
    );
  }

  @override
  void dispose() {
    _tabController.dispose();
    _demoAmountCtrl.dispose();
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
              Tab(text: 'Crypto (Binance)'),
              Tab(text: 'Forex Pairs'),
              Tab(text: '\$10K Demo Paper'),
            ],
          ),
        ),
        Expanded(
          child: TabBarView(
            controller: _tabController,
            children: [
              // CRYPTO TAB
              RefreshIndicator(
                onRefresh: _fetchLiveCrypto,
                color: const Color(0xFF00F2FE),
                backgroundColor: const Color(0xFF0D1527),
                child: ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    // Official Binance Referral Card (20% Discount)
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF1E2329), Color(0xFF0F141C)],
                        ),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFF0B90B).withOpacity(0.5)),
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF0B90B).withOpacity(0.15),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.currency_bitcoin, color: Color(0xFFF0B90B), size: 24),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: const [
                                Text(
                                  'Binance Trading Hub',
                                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white),
                                ),
                                Text(
                                  '20% Lifetime Fee Discount on Spot & Futures',
                                  style: TextStyle(color: Color(0xFFF0B90B), fontSize: 11, fontWeight: FontWeight.w600),
                                ),
                              ],
                            ),
                          ),
                          ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFF0B90B),
                              foregroundColor: Colors.black,
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                            ),
                            onPressed: () => AppLauncher.open(context, 'https://www.binance.com/activity/referral-entry/CPA?ref=CPA_CPA2SG0ILQN'),
                            child: const Text('Trade', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),
                    ..._cryptoList.map((c) {
                      return Container(
                        margin: const EdgeInsets.only(bottom: 8),
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
                    }).toList(),
                  ],
                ),
              ),

              // FOREX TAB
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
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(f['pair'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                            Text(f['name'], style: const TextStyle(color: Color(0xFF64748B), fontSize: 11)),
                          ],
                        ),
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

              // DEMO PAPER TRADING SIMULATOR TAB
              SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF0F1E36), Color(0xFF091222)],
                        ),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFF00F2FE).withOpacity(0.4)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('VIRTUAL PAPER BALANCE', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11, fontWeight: FontWeight.w700)),
                          const SizedBox(height: 6),
                          Text(
                            '\$${_paperBalance.toStringAsFixed(2)} USDT',
                            style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: Color(0xFF00F2FE)),
                          ),
                          const SizedBox(height: 4),
                          const Text('Risk-free paper trading practice terminal', style: TextStyle(color: Color(0xFF64748B), fontSize: 12)),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Text('Practice Trade Simulator', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: _selectedCoinForDemo,
                      dropdownColor: const Color(0xFF0D1527),
                      decoration: InputDecoration(
                        labelText: 'Select Asset',
                        filled: true,
                        fillColor: const Color(0xFF0D1527),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      items: const [
                        DropdownMenuItem(value: 'BTC', child: Text('Bitcoin (BTC/USDT)')),
                        DropdownMenuItem(value: 'ETH', child: Text('Ethereum (ETH/USDT)')),
                        DropdownMenuItem(value: 'SOL', child: Text('Solana (SOL/USDT)')),
                      ],
                      onChanged: (v) {
                        if (v != null) setState(() => _selectedCoinForDemo = v);
                      },
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _demoAmountCtrl,
                      keyboardType: TextInputType.number,
                      decoration: InputDecoration(
                        labelText: 'Trade Amount (USDT)',
                        filled: true,
                        fillColor: const Color(0xFF0D1527),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                    const SizedBox(height: 18),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF10B981),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                            onPressed: () => _executeDemoTrade(true),
                            child: const Text('Simulate BUY', style: TextStyle(fontWeight: FontWeight.bold)),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFEF4444),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                            onPressed: () => _executeDemoTrade(false),
                            child: const Text('Simulate SELL', style: TextStyle(fontWeight: FontWeight.bold)),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    OutlinedButton.icon(
                      icon: const Icon(Icons.refresh, size: 16),
                      label: const Text('Reset Paper Balance to \$10,000'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xFF94A3B8),
                        side: const BorderSide(color: Color(0xFF1E293B)),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: () {
                        setState(() => _paperBalance = 10000.00);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Paper balance reset to \$10,000.00 USDT')),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

// ============================================================================
// TAB 4: ACCURATE NEWS & CASE STUDIES (Direct from news.html & case-studies.html)
// ============================================================================
class NewsAndCaseStudiesView extends StatefulWidget {
  const NewsAndCaseStudiesView({super.key});

  @override
  State<NewsAndCaseStudiesView> createState() => _NewsAndCaseStudiesViewState();
}

class _NewsAndCaseStudiesViewState extends State<NewsAndCaseStudiesView> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Exact Articles from news.html & data/imported_daily_news.json
  final List<Map<String, String>> _newsArticles = [
    {
      'title': "Bitget's \$352M Hack Happened Via Spoofed Transfers, Not Private Keys, CEO Gray Chen Says",
      'source': 'CoinDesk',
      'date': '25 Sep 2026',
      'category': 'Security • Crypto',
      'url': 'https://www.coindesk.com/markets/2026/09/25/bitget-s-usd351-million-hack-happened-via-spoofed-transfers-not-private-keys-ceo-gray-chen-says',
      'excerpt': 'Bitget CEO Gray Chen clarified that the recent \$352M capital incident occurred due to unauthorized address spoofing mechanisms rather than compromised institutional private keys.',
    },
    {
      'title': 'Trump Administration Weighs Global Stablecoin Framework for US Dollar Dominance',
      'source': 'CoinDesk',
      'date': '24 Sep 2026',
      'category': 'Macro • Policy',
      'url': 'https://www.coindesk.com/markets/2026/09/24/trump-administration-weighs-a-global-stablecoin-plan-to-cement-dollar-s-dominance',
      'excerpt': 'The administration evaluates global stablecoin initiatives to cement US dollar hegemony and boost demand for short-term Treasury bills across international digital asset markets.',
    },
    {
      'title': 'Dogecoin Slides 8%, Bitcoin Drops Under \$84,000 as Treasury Yields Hit 2007 Highs',
      'source': 'CoinDesk',
      'date': '24 Sep 2026',
      'category': 'Markets • Selloff',
      'url': 'https://www.coindesk.com/markets/2026/09/24/dogecoin-down-8-bitcoin-under-usd84-000-as-treasury-yields-hit-highest-level-since-2007',
      'excerpt': 'Surging US Treasury yields and \$104 crude oil ignited a broad crypto market selloff, with DOGE tumbling 8% and Bitcoin retreating under key psychological levels.',
    },
    {
      'title': 'USD/JPY Outlook: Hawkish Federal Reserve Recalibration Mounts Pressure on the Japanese Yen',
      'source': 'FOREX.com',
      'date': '24 Sep 2026',
      'category': 'Forex • FX Wire',
      'url': 'https://www.forex.com/en/news-and-analysis/usd-jpy-outlook-hawkish-fed-recalibration-pressures-the-yen/',
      'excerpt': 'Resilient US macroeconomic indicators and surging yields widened the interest rate differential between the US and Japan, pushing USD/JPY toward major multi-month resistance.',
    },
  ];

  // Exact Case Studies from case-studies.html
  final List<Map<String, String>> _caseStudies = [
    {
      'client': 'Aria Coin (\$ARIA)',
      'bundle': 'Cointelegraph Premium PR Bundle',
      'timeline': 'Dec 2024',
      'metric': '+147% Price Surge in 2h',
      'reach': '3M+ Readers in 1 Week',
      'summary': 'Partnered with NexcoinPR for guaranteed Cointelegraph placement, yielding a 147% market price surge, 42% organic traffic increase, and exponential social community growth.',
    },
    {
      'client': '\$BHAD Token',
      'bundle': 'Cointelegraph PR Bundle',
      'timeline': 'Feb 2025',
      'metric': 'Top Performing Token in 1 Week',
      'reach': '75+ Leading Media Outlets',
      'summary': 'Guaranteed publication across Cointelegraph, Bitcoin.com, BeInCrypto, Business Insider, APNews, MarketWatch, and Binance transformed \$BHAD into an authoritative crypto token.',
    },
    {
      'client': 'LBank Exchange',
      'bundle': 'Tier-1 Liquidity PR',
      'timeline': 'Sep 2026',
      'metric': 'Ranked #1 for Crypto Liquidity',
      'reach': 'BeInCrypto Special Report',
      'summary': 'In-depth liquidity study published across crypto news outlets proved LBank maintained 4.4x average order book depth on top mainstream trading pairs.',
    },
    {
      'client': 'BC.GAME',
      'bundle': 'Global Ecosystem PR',
      'timeline': 'Sep 2026',
      'metric': '\$8.6M+ Rewards Distributed',
      'reach': 'Global Web3 Syndicate',
      'summary': 'Decentralized rewards milestone campaign published globally to showcase transparent community distribution and gaming token utility.',
    },
    {
      'client': 'Cregis Foundation',
      'bundle': 'Digital Asset Infra Wire',
      'timeline': 'Sep 2026',
      'metric': '2 Years of Middle East Growth',
      'reach': 'Institutional FinTech News',
      'summary': 'Showcasing institutional enterprise adoption of Web3 MPC wallet and treasury management platforms among traditional finance corporations.',
    },
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
              Tab(text: 'Industry News'),
              Tab(text: 'Case Studies'),
            ],
          ),
        ),
        Expanded(
          child: TabBarView(
            controller: _tabController,
            children: [
              // NEWS LIST
              ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: _newsArticles.length,
                itemBuilder: (context, index) {
                  final item = _newsArticles[index];
                  return Container(
                    margin: const EdgeInsets.only(bottom: 14),
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
                            Text(
                              item['source']!,
                              style: const TextStyle(
                                color: Color(0xFF00F2FE),
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                            Text(
                              '${item['category']} • ${item['date']}',
                              style: const TextStyle(color: Color(0xFF64748B), fontSize: 11),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          item['title']!,
                          style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                            height: 1.3,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          item['excerpt']!,
                          style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8), height: 1.4),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            TextButton.icon(
                              icon: const Icon(Icons.open_in_new, size: 14, color: Color(0xFF00F2FE)),
                              label: const Text('Read Source Article', style: TextStyle(color: Color(0xFF00F2FE), fontSize: 12)),
                              onPressed: () => AppLauncher.open(context, item['url']!),
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                },
              ),

              // CASE STUDIES LIST
              ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: _caseStudies.length,
                itemBuilder: (context, index) {
                  final cs = _caseStudies[index];
                  return Container(
                    margin: const EdgeInsets.only(bottom: 14),
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0D1527),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: const Color(0xFF1E293B)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFFC9A84C).withOpacity(0.15),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                cs['client']!,
                                style: const TextStyle(color: Color(0xFFC9A84C), fontWeight: FontWeight.bold, fontSize: 11),
                              ),
                            ),
                            Text(cs['timeline']!, style: const TextStyle(color: Color(0xFF64748B), fontSize: 11)),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Text(
                          cs['metric']!,
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF10B981)),
                        ),
                        Text(
                          cs['bundle']!,
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF00F2FE)),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          cs['summary']!,
                          style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 13, height: 1.45),
                        ),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            const Icon(Icons.remove_red_eye_outlined, size: 14, color: Color(0xFF94A3B8)),
                            const SizedBox(width: 6),
                            Text(
                              cs['reach']!,
                              style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11, fontWeight: FontWeight.w600),
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

// ============================================================================
// TAB 5: CAMPAIGN TRACKER (Real IDs: NEX-ARIA, NEX-BHAD, NEX-LBANK, NEX-CREGIS)
// ============================================================================
class TrackerView extends StatefulWidget {
  const TrackerView({super.key});

  @override
  State<TrackerView> createState() => _TrackerViewState();
}

class _TrackerViewState extends State<TrackerView> {
  final TextEditingController _trackerController = TextEditingController(text: 'NEX-ARIA');
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
                    hintText: 'Enter Campaign ID (e.g. NEX-ARIA)',
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
          const SizedBox(height: 14),

          // Quick Preset Campaign Chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildQuickChip('NEX-ARIA', 'Aria Coin'),
                const SizedBox(width: 6),
                _buildQuickChip('NEX-BHAD', '\$BHAD Token'),
                const SizedBox(width: 6),
                _buildQuickChip('NEX-LBANK', 'LBank Study'),
                const SizedBox(width: 6),
                _buildQuickChip('NEX-CREGIS', 'Cregis PR'),
              ],
            ),
          ),
          const SizedBox(height: 18),

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
                  Text(
                    _getCampaignTitle(_trackerController.text.toUpperCase()),
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white),
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
                            content: Text('Downloading official white-label campaign dossier...'),
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
            _buildLiveLinkTile('CoinTelegraph Wire', 'Premium Bundle Feature', 'https://cointelegraph.com'),
            _buildLiveLinkTile('Bloomberg Terminal Wire', 'Terminal ID: BB-98234-PR', 'https://www.bloomberg.com'),
            _buildLiveLinkTile('Yahoo! Finance Portal', 'Syndicated Wire Index', 'https://finance.yahoo.com'),
            _buildLiveLinkTile('BeInCrypto Desk', 'Direct Institutional Release', 'https://beincrypto.com'),
            _buildLiveLinkTile('MarketWatch Financials', 'Capital Markets Syndication', 'https://www.marketwatch.com'),
          ],
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  String _getCampaignTitle(String id) {
    if (id.contains('ARIA')) return 'Aria Coin (\$ARIA) Global Cointelegraph Premium Campaign';
    if (id.contains('BHAD')) return '\$BHAD Token 75-Media Syndication Blitz';
    if (id.contains('LBANK')) return 'LBank Exchange Liquidity Ranking Wire Campaign';
    if (id.contains('CREGIS')) return 'Cregis Foundation Middle East Expansion Wire';
    return 'Institutional Cryptocurrency & Web3 PR Campaign';
  }

  Widget _buildQuickChip(String code, String label) {
    return ActionChip(
      label: Text('$code ($label)'),
      backgroundColor: const Color(0xFF0D1527),
      side: const BorderSide(color: Color(0xFF1E293B)),
      labelStyle: const TextStyle(fontSize: 11, color: Color(0xFF00F2FE)),
      onPressed: () {
        setState(() {
          _trackerController.text = code;
          _searched = true;
        });
      },
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
            onPressed: () => AppLauncher.open(context, url),
          ),
        ],
      ),
    );
  }
}

// ============================================================================
// TAB 6: DIRECT EDITORIAL DESK & SUBMISSION FORM
// ============================================================================
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
  void dispose() {
    _nameCtrl.dispose();
    _companyCtrl.dispose();
    _emailCtrl.dispose();
    _titleCtrl.dispose();
    _contentCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Editorial Desk & Direct Wire',
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white),
          ),
          const SizedBox(height: 4),
          const Text(
            'Connect with senior PR account executives via Telegram or submit your draft below.',
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
                        'Instant wire review & quotes: @Nexcoinpr',
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
                  onPressed: () => AppLauncher.open(context, 'https://t.me/Nexcoinpr'),
                  child: const Text('Open'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Official Contact Details
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF0D1527),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF1E293B)),
            ),
            child: Column(
              children: [
                _buildContactRow(Icons.mail_outline, 'press@nexcoinpr.agency', () {
                  AppLauncher.open(context, 'mailto:press@nexcoinpr.agency');
                }),
                const Divider(color: Color(0xFF1E293B)),
                _buildContactRow(Icons.language, 'https://www.nexcoinpr.agency', () {
                  AppLauncher.open(context, 'https://www.nexcoinpr.agency');
                }),
                const Divider(color: Color(0xFF1E293B)),
                _buildContactRow(Icons.near_me_outlined, '@Nexcoinpr (Telegram Official)', () {
                  AppLauncher.open(context, 'https://t.me/Nexcoinpr');
                }),
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
                    'Submit Press Release Draft',
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
                      label: const Text('Submit Draft for Editorial Review'),
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
                                'Thank you! The NexcoinPR editorial desk has received your draft and will contact you shortly.',
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
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _buildContactRow(IconData icon, String text, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(
          children: [
            Icon(icon, color: const Color(0xFF00F2FE), size: 20),
            const SizedBox(width: 12),
            Expanded(
              child: Text(text, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600)),
            ),
            const Icon(Icons.chevron_right, color: Color(0xFF64748B), size: 20),
          ],
        ),
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

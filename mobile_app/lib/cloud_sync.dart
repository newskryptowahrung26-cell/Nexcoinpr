import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'pricing_data.dart';

/// Live Cloud Sync Service for NexcoinPR Mobile App
/// Automatically pulls the newest packages, single media placement prices,
/// and live news articles from the official website repository without requiring
/// APK updates or manual reinstalls.
class CloudSyncService {
  static const String _singleOutletsUrl =
      'https://raw.githubusercontent.com/newskryptowahrung26-cell/Nexcoinpr/main/scripts/master_single_publications.json';

  static const String _packagesUrl =
      'https://raw.githubusercontent.com/newskryptowahrung26-cell/Nexcoinpr/main/data/packages.json';

  static const String _liveNewsUrl =
      'https://raw.githubusercontent.com/newskryptowahrung26-cell/Nexcoinpr/main/data/live_news.json';

  // In-memory live state initialized with built-in canonical defaults
  static List<NexcoinPackage> packages = List.from(kOfficialPackages);
  static List<NexcoinSingleOutlet> singleOutlets = List.from(kOfficialSingleOutlets);
  static List<Map<String, String>> newsArticles = [
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

  static bool isSyncing = false;
  static DateTime? lastSyncTime;
  static final ValueNotifier<int> syncNotifier = ValueNotifier(0);

  /// Synchronize all remote data feeds with cache-busting
  static Future<bool> syncAll() async {
    if (isSyncing) return false;
    isSyncing = true;
    syncNotifier.value++;

    bool anySuccess = false;
    final client = HttpClient();
    client.connectionTimeout = const Duration(seconds: 6);

    final timestamp = DateTime.now().millisecondsSinceEpoch;

    // 1. Sync Single Placements
    try {
      final req = await client.getUrl(Uri.parse('$_singleOutletsUrl?_t=$timestamp'));
      final res = await req.close();
      if (res.statusCode == 200) {
        final body = await res.transform(utf8.decoder).join();
        final List<dynamic> jsonList = jsonDecode(body);
        final List<NexcoinSingleOutlet> parsed = [];
        for (var item in jsonList) {
          parsed.add(
            NexcoinSingleOutlet(
              name: item['name']?.toString() ?? '',
              domain: item['domain']?.toString() ?? '',
              price: int.tryParse(item['priceNum']?.toString() ?? '') ??
                  int.tryParse(item['price']?.toString().replaceAll(RegExp(r'[^\d]'), '') ?? '') ??
                  0,
              category: item['category']?.toString() ?? '',
              categoryLabel: item['categoryLabel']?.toString() ?? 'Crypto & Web3',
              traffic: item['traffic']?.toString() ?? '',
              turnaround: item['turnaround']?.toString() ?? '24-48h',
              focus: item['focus']?.toString() ?? '',
              badge: item['badge']?.toString() ?? '',
            ),
          );
        }
        if (parsed.isNotEmpty) {
          singleOutlets = parsed;
          anySuccess = true;
        }
      }
    } catch (_) {}

    // 2. Sync Bundled Packages
    try {
      final req = await client.getUrl(Uri.parse('$_packagesUrl?_t=$timestamp'));
      final res = await req.close();
      if (res.statusCode == 200) {
        final body = await res.transform(utf8.decoder).join();
        final List<dynamic> jsonList = jsonDecode(body);
        final List<NexcoinPackage> parsed = [];
        for (var item in jsonList) {
          final List<dynamic> rawPubs = item['pubs'] as List<dynamic>? ?? [];
          parsed.add(
            NexcoinPackage(
              title: item['title']?.toString() ?? '',
              shortTitle: item['shortTitle']?.toString() ?? item['title']?.toString() ?? '',
              category: item['category']?.toString() ?? 'Packages',
              price: int.tryParse(item['price']?.toString().replaceAll(RegExp(r'[^\d]'), '') ?? '') ?? 0,
              badge: item['badge']?.toString() ?? '',
              traffic: item['traffic']?.toString() ?? '',
              desc: item['desc']?.toString() ?? '',
              pubs: rawPubs.map((e) => e.toString()).toList(),
            ),
          );
        }
        if (parsed.isNotEmpty) {
          packages = parsed;
          anySuccess = true;
        }
      }
    } catch (_) {}

    // 3. Sync Live News Articles
    try {
      final req = await client.getUrl(Uri.parse('$_liveNewsUrl?_t=$timestamp'));
      final res = await req.close();
      if (res.statusCode == 200) {
        final body = await res.transform(utf8.decoder).join();
        final List<dynamic> jsonList = jsonDecode(body);
        final List<Map<String, String>> parsed = [];
        for (var item in jsonList) {
          parsed.add({
            'title': item['title']?.toString() ?? '',
            'source': item['source']?.toString() ?? 'Wire',
            'date': item['date']?.toString() ?? 'Today',
            'category': item['category']?.toString() ?? 'News',
            'url': item['url']?.toString() ?? 'https://www.nexcoinpr.agency/news.html',
            'excerpt': item['excerpt']?.toString() ?? '',
          });
        }
        if (parsed.isNotEmpty) {
          newsArticles = parsed;
          anySuccess = true;
        }
      }
    } catch (_) {}

    isSyncing = false;
    if (anySuccess) {
      lastSyncTime = DateTime.now();
    }
    syncNotifier.value++;
    return anySuccess;
  }
}

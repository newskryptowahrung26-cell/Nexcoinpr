import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'pricing_data.dart';

/// Live Cloud Sync Service for NexcoinPR Mobile App
/// Automatically pulls the newest packages, single media placement prices,
/// and live news articles directly from the website CDN and GitHub repo without requiring
/// manual APK reinstalls.
class CloudSyncService {
  // Primary Fast CDN Endpoints (from live domain) with GitHub raw fallbacks
  static const List<String> _singleOutletsUrls = [
    'https://www.nexcoinpr.agency/scripts/master_single_publications.json',
    'https://raw.githubusercontent.com/newskryptowahrung26-cell/Nexcoinpr/main/scripts/master_single_publications.json',
  ];

  static const List<String> _packagesUrls = [
    'https://www.nexcoinpr.agency/data/packages.json',
    'https://raw.githubusercontent.com/newskryptowahrung26-cell/Nexcoinpr/main/data/packages.json',
  ];

  static const List<String> _liveNewsUrls = [
    'https://www.nexcoinpr.agency/data/live_news.json',
    'https://raw.githubusercontent.com/newskryptowahrung26-cell/Nexcoinpr/main/data/live_news.json',
  ];

  // In-memory live state initialized with built-in canonical defaults from today
  static List<NexcoinPackage> packages = List.from(kOfficialPackages);
  static List<NexcoinSingleOutlet> singleOutlets = List.from(kOfficialSingleOutlets);
  static List<Map<String, String>> newsArticles = [
    {
      'title': "Indian Rupee: Policy support and yield reversal, Societe Generale",
      'source': 'FXStreet',
      'date': '16 Oct 2026',
      'category': 'Forex • FX Desk',
      'url': 'https://www.nexcoinpr.agency/news/indian-rupee-policy-support-and-yield-reversal-societe-generale',
      'excerpt': 'Indian Rupee: Policy support and yield reversal, Societe Generale. Comprehensive institutional analysis, technical price levels, and market order flow.',
    },
    {
      'title': 'Traders will soon have U.S. binary options on whether COIN, HOOD, MARA can hit their targets: Crypto Daily',
      'source': 'CoinDesk',
      'date': '16 Oct 2026',
      'category': 'Markets • Crypto',
      'url': 'https://www.nexcoinpr.agency/news/traders-will-soon-have-us-binary-options-on-whether-coin-hood-mara-can-hit',
      'excerpt': 'Traders will soon have U.S. binary options on whether COIN, HOOD, MARA can hit their targets: Crypto Daily. Comprehensive institutional market intelligence.',
    },
    {
      'title': 'Asia FX subdued, dollar weakens after bond rally; rupee set for 2% weekly jump',
      'source': 'Investing.com',
      'date': '16 Oct 2026',
      'category': 'Forex • FX Desk',
      'url': 'https://www.nexcoinpr.agency/news/asia-fx-subdued-dollar-weakens-after-bond-rally-rupee-set-for-2-weekly-jump',
      'excerpt': 'Asia FX subdued, dollar weakens after bond rally; rupee set for 2% weekly jump. Comprehensive institutional analysis, technical price action.',
    },
    {
      'title': 'XRP has failed to make holders rich like bitcoin and ether. Here’s why',
      'source': 'CoinDesk',
      'date': '16 Oct 2026',
      'category': 'Markets • Crypto',
      'url': 'https://www.nexcoinpr.agency/news/xrp-has-failed-to-make-holders-rich-like-bitcoin-and-ether-heres-why',
      'excerpt': 'XRP has failed to make holders rich like bitcoin and ether. Here’s why. Comprehensive institutional analysis and technical price levels.',
    },
    {
      'title': 'Dollar slips despite hot U.S. CPI; yen firms on intervention warnings',
      'source': 'Investing.com',
      'date': '15 Oct 2026',
      'category': 'Forex • FX Desk',
      'url': 'https://www.nexcoinpr.agency/news/dollar-slips-despite-hot-us-cpi-yen-firms-on-intervention-warnings',
      'excerpt': 'Dollar slips despite hot U.S. CPI; yen firms on intervention warnings. Comprehensive institutional analysis and FX macro trends.',
    },
  ];

  static bool isSyncing = false;
  static DateTime? lastSyncTime;
  static final ValueNotifier<int> syncNotifier = ValueNotifier(0);

  /// Helper to fetch string with fallback URLs
  static Future<String?> _fetchWithFallback(HttpClient client, List<String> urls, int timestamp) async {
    for (final baseUrl in urls) {
      try {
        final uri = Uri.parse('$baseUrl?_t=$timestamp');
        final req = await client.getUrl(uri);
        final res = await req.close();
        if (res.statusCode == 200) {
          final body = await res.transform(utf8.decoder).join();
          if (body.trim().isNotEmpty) {
            return body;
          }
        }
      } catch (_) {
        // Continue to fallback URL
      }
    }
    return null;
  }

  /// Synchronize all remote data feeds with cache-busting
  static Future<bool> syncAll() async {
    if (isSyncing) return false;
    isSyncing = true;
    syncNotifier.value++;

    bool anySuccess = false;
    final client = HttpClient();
    client.connectionTimeout = const Duration(seconds: 7);

    final timestamp = DateTime.now().millisecondsSinceEpoch;

    // 1. Sync Live News Articles (Top Priority)
    try {
      final body = await _fetchWithFallback(client, _liveNewsUrls, timestamp);
      if (body != null) {
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

    // 2. Sync Single Placements
    try {
      final body = await _fetchWithFallback(client, _singleOutletsUrls, timestamp);
      if (body != null) {
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

    // 3. Sync Bundled Packages
    try {
      final body = await _fetchWithFallback(client, _packagesUrls, timestamp);
      if (body != null) {
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

    isSyncing = false;
    if (anySuccess) {
      lastSyncTime = DateTime.now();
    }
    syncNotifier.value++;
    return anySuccess;
  }
}

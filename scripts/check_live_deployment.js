const https = require('https');

function checkLive(pathName, label) {
  https.get('https://www.nexcoinpr.agency' + pathName + '?t=' + Date.now(), (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      console.log('=== Live ' + label + ' (HTTP ' + res.statusCode + ') ===');
      const dates = [...data.matchAll(/<span class=["'](?:pr-card-date|news-card-date)["']>([^<]+)<\/span>/g)].map(m => m[1]);
      dates.slice(0, 6).forEach((d, i) => console.log('  Top ' + (i+1) + ': ' + d));
    });
  });
}

checkLive('/press-releases', 'Press Releases');
checkLive('/news', 'News');
checkLive('/news/forex', 'Forex News');

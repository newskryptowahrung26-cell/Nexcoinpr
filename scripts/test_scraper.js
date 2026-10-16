const https = require('https');
const http = require('http');
const { URL } = require('url');

function fetchPage(targetUrl) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(targetUrl);
      const client = parsed.protocol === 'https:' ? https : http;
      const req = client.get(targetUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' },
        timeout: 3500
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          let nextUrl = res.headers.location;
          if (!nextUrl.startsWith('http')) {
            nextUrl = new URL(nextUrl, targetUrl).href;
          }
          return resolve(fetchPage(nextUrl));
        }
        let body = '';
        res.on('data', chunk => {
          body += chunk;
          if (body.length > 300000) req.destroy();
        });
        res.on('end', () => resolve(body));
      });
      req.on('error', () => resolve(''));
      req.on('timeout', () => { req.destroy(); resolve(''); });
    } catch(e) { resolve(''); }
  });
}

function extractEmails(html) {
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const matches = html.match(emailRegex) || [];
  const valid = [];
  for (const email of matches) {
    const lower = email.toLowerCase();
    if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.svg') || lower.endsWith('.webp') || lower.endsWith('.gif')) continue;
    if (lower.includes('sentry') || lower.includes('cloudflare') || lower.includes('wix') || lower.includes('webpack') || lower.includes('example') || lower.includes('github') || lower.includes('git') || lower.includes('npm')) continue;
    if (lower.length > 50) continue;
    valid.push(lower);
  }
  return [...new Set(valid)];
}

https.get('https://api.llama.fi/protocols', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', async () => {
    const protocols = JSON.parse(data);
    console.log('Total protocols loaded:', protocols.length);
    let found = 0;
    for (let i = 20; i < 70; i++) {
      const p = protocols[i];
      if (!p.url) continue;
      const html = await fetchPage(p.url);
      const emails = extractEmails(html);
      if (emails.length > 0) {
        found++;
        console.log(`[${found}] ${p.name} (${p.url}): ${emails.join(', ')}`);
      }
    }
    console.log(`Finished test. Found ${found} protocols with emails in batch.`);
  });
});

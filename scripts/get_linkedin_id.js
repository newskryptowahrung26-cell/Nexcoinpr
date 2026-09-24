const https = require('https');
const options = {
  hostname: 'www.linkedin.com',
  path: '/company/nexcoinpr-agency',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
};
https.get(options, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const m = d.match(/urn:li:organization:(\d+)/) || d.match(/objectUrn[":\\]+urn:li:organization:(\d+)/i) || d.match(/fs_normalized_company:(\d+)/);
    if (m) console.log('Found Org ID:', m[1]);
    else {
      // Look for any 7 to 10 digit number near organization
      const match2 = d.match(/organization\/(\d+)/);
      if (match2) console.log('Found Org ID 2:', match2[1]);
      else console.log('HTML length:', d.length);
    }
  });
}).on('error', err => console.error(err));

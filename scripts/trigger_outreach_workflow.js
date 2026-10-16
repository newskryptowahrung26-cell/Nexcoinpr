const https = require('https');

const postData = JSON.stringify({
  ref: 'main',
  inputs: {
    batch_size: '15',
    test_mode: 'false'
  }
});

const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';
if (!token) {
  console.error('[Error] Please set GH_TOKEN or GITHUB_TOKEN environment variable to trigger workflows.');
  process.exit(1);
}

const options = {
  hostname: 'api.github.com',
  path: '/repos/newskryptowahrung26-cell/Nexcoinpr/actions/workflows/386570719/dispatches',
  method: 'POST',
  headers: {
    'User-Agent': 'NodeJS-Client',
    'Authorization': `token ${token}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    if (res.statusCode === 204) {
      console.log('🎉 Successfully triggered Automated B2B Outbound Pitches on GitHub Actions!');
      console.log('GitHub is now running the batch in the cloud...');
    } else {
      console.log(`HTTP ${res.statusCode}:`, body);
    }
  });
});

req.on('error', err => {
  console.error('Error triggering workflow:', err.message);
});

req.write(postData);
req.end();

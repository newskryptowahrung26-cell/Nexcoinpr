const https = require('https');

const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';
const options = {
  hostname: 'api.github.com',
  path: '/repos/newskryptowahrung26-cell/Nexcoinpr/actions/runs?per_page=6',
  headers: {
    'User-Agent': 'NodeJS-Client',
    ...(token ? { 'Authorization': `token ${token}` } : {})
  }
};

https.get(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.workflow_runs) {
        console.log('=== Recent GitHub Actions Workflow Runs ===');
        json.workflow_runs.forEach(r => {
          console.log(`- [${r.name}] Status: ${r.status} | Conclusion: ${r.conclusion || 'running'} | Event: ${r.event} | ID: ${r.id}`);
        });
      } else {
        console.log('API Response:', data);
      }
    } catch(e) {
      console.log('Parse error:', e.message);
    }
  });
}).on('error', err => {
  console.error('Request error:', err.message);
});

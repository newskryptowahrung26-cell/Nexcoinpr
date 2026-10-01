const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const verificationTag = '  <meta name="google-site-verification" content="b3araSpCOqJxZeRQR4TPfqRXcBONS62tDqkGA0er9o8">';

if (!html.includes('b3araSpCOqJxZeRQR4TPfqRXcBONS62tDqkGA0er9o8')) {
  // Insert right after msvalidate
  html = html.replace(/(<meta name="msvalidate\.01"[^>]*>)/i, '$1\r\n' + verificationTag);
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('Successfully added Google verification tag to index.html');
} else {
  console.log('Tag already present');
}

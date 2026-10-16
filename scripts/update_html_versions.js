const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

content = content.replace(/NexcoinPR-v1\.4\.2-API36\.apk/g, 'NexcoinPR-v1.4.3-API36.apk');
content = content.replace(/Download APK \(v1\.4\.2\)/g, 'Download APK (v1.4.3)');
content = content.replace(/Version: <strong style="color:#fff;">v1\.4\.2<\/strong>/g, 'Version: <strong style="color:#fff;">v1.4.3</strong>');
content = content.replace(/File Size: <strong style="color:#fff;">50\.8 MB<\/strong>/g, 'File Size: <strong style="color:#fff;">51.2 MB</strong>');

fs.writeFileSync(indexPath, content, 'utf8');
console.log('Successfully updated index.html to v1.4.3!');

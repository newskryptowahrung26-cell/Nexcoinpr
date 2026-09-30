const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'scratch') {
        getHtmlFiles(filePath, fileList);
      }
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const htmlFiles = getHtmlFiles('.');
let updated = 0;
const waUrl = 'https://wa.me/971582021752';
const waNumber = '+971-582021752';

htmlFiles.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;

  if (!content.includes(waUrl)) {
    // 1. Try matching Telegram
    const teleRegex = /(\s*)(<li>\s*<a\s+href="https:\/\/t\.me\/Nexcoinpr"[^>]*>[\s\S]*?<\/a>\s*<\/li>)/i;
    if (teleRegex.test(content)) {
      content = content.replace(teleRegex, (match, indent, teleLi) => {
        return `${indent}<li><a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="color: #25D366; font-weight: 600;">WhatsApp (${waNumber})</a></li>${indent}${teleLi}`;
      });
      changed = true;
    } else {
      // 2. Try matching /contact or /contact.html
      const contactRegex = /(\s*)(<li>\s*<a\s+href="\/contact(\.html)?"[^>]*>[\s\S]*?<\/a>\s*<\/li>)/i;
      if (contactRegex.test(content)) {
        content = content.replace(contactRegex, (match, indent, contactLi) => {
          return `${match}${indent}<li><a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="color: #25D366; font-weight: 600;">WhatsApp (${waNumber})</a></li>`;
        });
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(f, content, 'utf8');
    updated++;
  }
});

console.log(`Updated footer links in ${updated} additional HTML files.`);

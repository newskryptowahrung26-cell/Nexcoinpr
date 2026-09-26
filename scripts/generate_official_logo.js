const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const ROOT = path.resolve(__dirname, '..');
const faviconB64 = fs.readFileSync(path.join(ROOT, 'assets', 'images', 'nexcoinpr-favicon.jpg')).toString('base64');

const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 1200px;
      height: 1200px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    canvas { display: block; }
  </style>
</head>
<body>
  <canvas id="c" width="1200" height="1200"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = 'data:image/jpeg;base64,${faviconB64}';

    img.onload = () => {
      ctx.clearRect(0, 0, 1200, 1200);

      const cx = 600;
      const cy = 470;
      const targetR = 350;

      // Source emblem bounds in nexcoinpr-favicon.jpg: cx=511.5, cy=511, r=409
      const sx = 511.5;
      const sy = 511;
      const sr = 409;

      // 1. Soft radial gold/blue aura glow behind the emblem
      const glow = ctx.createRadialGradient(cx, cy, targetR * 0.4, cx, cy, targetR * 1.35);
      glow.addColorStop(0, 'rgba(43, 117, 255, 0.45)');
      glow.addColorStop(0.45, 'rgba(212, 175, 55, 0.25)');
      glow.addColorStop(0.8, 'rgba(43, 117, 255, 0.08)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, targetR * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw 3D Globe Emblem clipped precisely to its outer circular ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, targetR, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, sx - sr, sy - sr, sr * 2, sr * 2, cx - targetR, cy - targetR, targetR * 2, targetR * 2);
      ctx.restore();

      // 3. Subtle metallic gold rim edge stroke
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.55)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, targetR, 0, Math.PI * 2);
      ctx.stroke();

      // 4. "NEXCOINPR" Typography directly beneath emblem
      const textY = 960;
      ctx.font = '900 114px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '5px';

      // 3D Deep drop shadow layers
      ctx.fillStyle = 'rgba(2, 6, 15, 0.95)';
      ctx.fillText('NEXCOINPR', cx + 7, textY + 9);
      ctx.fillStyle = 'rgba(5, 18, 38, 0.9)';
      ctx.fillText('NEXCOINPR', cx + 4, textY + 5);

      // Blue ambient glow behind text
      ctx.shadowColor = 'rgba(37, 99, 235, 0.8)';
      ctx.shadowBlur = 32;

      // 3D Metallic Blue Gradient
      const grad = ctx.createLinearGradient(cx, textY - 100, cx, textY + 20);
      grad.addColorStop(0, '#93C5FD');    // light cyan/blue highlight
      grad.addColorStop(0.2, '#60A5FA'); // bright sky blue
      grad.addColorStop(0.45, '#2563EB'); // royal sapphire blue
      grad.addColorStop(0.8, '#1D4ED8');  // deep cobalt
      grad.addColorStop(1, '#0F2C69');    // dark navy base

      ctx.fillStyle = grad;
      ctx.fillText('NEXCOINPR', cx, textY);
      ctx.shadowBlur = 0;

      // Crisp outer hairline stroke
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.strokeText('NEXCOINPR', cx, textY);

      window.done = true;
    };
  </script>
</body>
</html>`;

const tmpHtml = path.join(__dirname, 'render_logo.html');
fs.writeFileSync(tmpHtml, html, 'utf8');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1200 });
  await page.goto('file:///' + tmpHtml.replace(/\\/g, '/'), { waitUntil: 'load' });
  await page.waitForFunction('window.done === true');

  const outPath = path.join(ROOT, 'assets', 'images', 'nexcoinpr-official-logo.png');
  await page.screenshot({ path: outPath, type: 'png', omitBackground: true });
  console.log('Saved transparent official logo:', outPath);
  await browser.close();
  if (fs.existsSync(tmpHtml)) fs.unlinkSync(tmpHtml);
})();

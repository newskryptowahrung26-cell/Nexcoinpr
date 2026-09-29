const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const officialLogoB64 = fs.readFileSync(path.join(ROOT, 'assets', 'images', 'nexcoinpr-official-logo.png')).toString('base64');
const appIconB64 = fs.readFileSync(path.join(ROOT, 'assets', 'images', 'app-icon-512.png')).toString('base64');
const screenshotHeroB64 = fs.readFileSync(path.join(ROOT, 'assets', 'images', 'app-screenshot-hero.png')).toString('base64');
const screenshotMediaB64 = fs.readFileSync(path.join(ROOT, 'assets', 'images', 'app-screenshot-media.png')).toString('base64');
const screenshotPackagesB64 = fs.readFileSync(path.join(ROOT, 'assets', 'images', 'app-screenshot-packages.png')).toString('base64');
const screenshotInsightsB64 = fs.readFileSync(path.join(ROOT, 'assets', 'images', 'app-screenshot-insights.png')).toString('base64');
const qrB64 = fs.readFileSync(path.join(ROOT, 'assets', 'images', 'app-download-qr.png')).toString('base64');

const templateHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NexcoinPR Mobile App LinkedIn Promo Video</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #000;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100vw;
      height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    #canvas { display: block; }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>

  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Preload all high-res assets
    const officialLogoImg = new Image(); officialLogoImg.src = 'data:image/png;base64,${officialLogoB64}';
    const appIconImg = new Image(); appIconImg.src = 'data:image/png;base64,${appIconB64}';
    const screenHeroImg = new Image(); screenHeroImg.src = 'data:image/png;base64,${screenshotHeroB64}';
    const screenMediaImg = new Image(); screenMediaImg.src = 'data:image/png;base64,${screenshotMediaB64}';
    const screenPackagesImg = new Image(); screenPackagesImg.src = 'data:image/png;base64,${screenshotPackagesB64}';
    const screenInsightsImg = new Image(); screenInsightsImg.src = 'data:image/png;base64,${screenshotInsightsB64}';
    const qrImg = new Image(); qrImg.src = 'data:image/png;base64,${qrB64}';

    let currentW = 1920;
    let currentH = 1080;
    const FPS = 30;
    const TOTAL_FRAMES = 600; // 20s at 30fps

    // Static ambient stars & floating tech nodes
    const stars = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2.2 + 0.6,
        alpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.002 + 0.001
      });
    }

    const techGridNodes = [];
    for (let i = 0; i < 30; i++) {
      techGridNodes.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0012,
        vy: (Math.random() - 0.5) * 0.0012,
        radius: Math.random() * 2.5 + 1.5,
        color: Math.random() > 0.4 ? '#C9A84C' : '#00F2FE'
      });
    }

    function initCanvas(w, h) {
      currentW = w;
      currentH = h;
      canvas.width = w;
      canvas.height = h;
    }

    // Helper: Rounded Rectangle
    function roundRect(c, x, y, width, height, radius, fill, stroke) {
      if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
      }
      c.beginPath();
      c.moveTo(x + radius.tl, y);
      c.lineTo(x + width - radius.tr, y);
      c.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
      c.lineTo(x + width, y + height - radius.br);
      c.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
      c.lineTo(x + radius.bl, y + height);
      c.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
      c.lineTo(x, y + radius.tl);
      c.quadraticCurveTo(x, y, x + radius.tl, y);
      c.closePath();
      if (fill) c.fill();
      if (stroke) c.stroke();
    }

    // Helper: Realistic 3D Smartphone Renderer
    function drawPhoneMockup(c, x, y, width, height, image, scale, rotation = 0, glowColor = 'rgba(201, 168, 76, 0.4)') {
      c.save();
      c.translate(x, y);
      if (rotation !== 0) c.rotate(rotation);

      const r = 24 * scale;

      // 1. Dual-Layer Outer Glow & Shadow
      c.shadowColor = glowColor;
      c.shadowBlur = 40 * scale;
      c.shadowOffsetY = 15 * scale;
      c.fillStyle = '#060B13';
      roundRect(c, -width / 2, -height / 2, width, height, r, true, false);

      // 2. Titanium Frame with Metallic Gold Edge
      c.shadowBlur = 0;
      c.shadowOffsetY = 0;
      const frameGrad = c.createLinearGradient(-width / 2, -height / 2, width / 2, height / 2);
      frameGrad.addColorStop(0, '#D4AF37');
      frameGrad.addColorStop(0.3, '#1B2A40');
      frameGrad.addColorStop(0.7, '#0D1A2D');
      frameGrad.addColorStop(1, '#AA822A');
      c.fillStyle = frameGrad;
      roundRect(c, -width / 2, -height / 2, width, height, r, true, false);

      // 3. Inner Bezel (Black Glass)
      const bezel = 7 * scale;
      const screenW = width - bezel * 2;
      const screenH = height - bezel * 2;
      const screenR = r - 4 * scale;
      c.fillStyle = '#070D18';
      roundRect(c, -screenW / 2, -screenH / 2, screenW, screenH, screenR, true, false);

      // 4. Clip & Draw App Screen Image
      c.save();
      roundRect(c, -screenW / 2, -screenH / 2, screenW, screenH, screenR, false, false);
      c.clip();
      if (image && image.complete && image.naturalWidth > 0) {
        c.drawImage(image, -screenW / 2, -screenH / 2, screenW, screenH);
      } else {
        c.fillStyle = '#0A1628';
        c.fillRect(-screenW / 2, -screenH / 2, screenW, screenH);
      }

      // 5. Dynamic Glass Sheen Reflection
      const sheenGrad = c.createLinearGradient(-screenW / 2, -screenH / 2, screenW / 2, screenH / 2);
      sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
      sheenGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.05)');
      sheenGrad.addColorStop(0.5, 'transparent');
      sheenGrad.addColorStop(1, 'transparent');
      c.fillStyle = sheenGrad;
      c.fillRect(-screenW / 2, -screenH / 2, screenW, screenH);

      c.restore(); // end screen clip

      // 6. Camera Dynamic Island / Speaker Notch
      const notchW = 70 * scale;
      const notchH = 14 * scale;
      c.fillStyle = '#000000';
      roundRect(c, -notchW / 2, -screenH / 2 + 5 * scale, notchW, notchH, 7 * scale, true, false);

      // Camera lens dot
      c.fillStyle = '#112233';
      c.beginPath();
      c.arc(-notchW / 2 + 18 * scale, -screenH / 2 + 12 * scale, 3.5 * scale, 0, Math.PI * 2);
      c.fill();

      // Outer Stroke Border
      c.strokeStyle = 'rgba(201, 168, 76, 0.45)';
      c.lineWidth = 1.5 * scale;
      roundRect(c, -width / 2, -height / 2, width, height, r, false, true);

      c.restore();
    }

    // ============================================================
    // MAIN MASTER FRAME RENDERER
    // ============================================================
    function renderFrame(frame) {
      const w = currentW;
      const h = currentH;
      const t = frame / FPS; // 0 to 20 seconds
      const scale = w / 1920;
      const isSquare = (w === h);

      ctx.clearRect(0, 0, w, h);

      // 1. Dynamic Space Gradient
      const grad = ctx.createRadialGradient(
        w / 2 + Math.sin(t * 0.7) * 90 * scale,
        h / 2 + Math.cos(t * 0.5) * 70 * scale,
        60 * scale,
        w / 2, h / 2, Math.max(w, h) * 0.85
      );
      grad.addColorStop(0, '#0E223D');
      grad.addColorStop(0.4, '#081324');
      grad.addColorStop(1, '#03070E');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // 2. Animated Starfield
      ctx.save();
      stars.forEach(st => {
        const sx = (st.x * w + Math.sin(t * 0.5 + st.x * 10) * 15 * scale + w) % w;
        const sy = (st.y * h + t * st.speed * h + h) % h;
        const alpha = st.alpha * (0.6 + 0.4 * Math.sin(t * 3 + st.x * 20));
        ctx.fillStyle = \`rgba(255, 255, 255, \${alpha})\`;
        ctx.beginPath();
        ctx.arc(sx, sy, st.size * scale, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 3. Floating Tech Constellation Grid
      ctx.save();
      for (let i = 0; i < techGridNodes.length; i++) {
        for (let j = i + 1; j < techGridNodes.length; j++) {
          const n1 = techGridNodes[i];
          const n2 = techGridNodes[j];
          const dx = (n1.x - n2.x) * w;
          const dy = (n1.y - n2.y) * h;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180 * scale) {
            ctx.strokeStyle = \`rgba(201, 168, 76, \${(1 - dist / (180 * scale)) * 0.15})\`;
            ctx.lineWidth = 1 * scale;
            ctx.beginPath();
            ctx.moveTo(n1.x * w, n1.y * h);
            ctx.lineTo(n2.x * w, n2.y * h);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // 4. Subtle Hexagonal Ambient Glow Rings
      ctx.save();
      ctx.strokeStyle = 'rgba(201, 168, 76, 0.06)';
      ctx.lineWidth = 1.5 * scale;
      const ringR = (250 + Math.sin(t * 1.2) * 20) * scale;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, ringR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, ringR * 1.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 5. Tech Corner Brackets
      ctx.strokeStyle = 'rgba(201, 168, 76, 0.35)';
      ctx.lineWidth = 2 * scale;
      const cornerSize = 28 * scale;
      const margin = 24 * scale;
      // Top-Left
      ctx.beginPath(); ctx.moveTo(margin, margin + cornerSize); ctx.lineTo(margin, margin); ctx.lineTo(margin + cornerSize, margin); ctx.stroke();
      // Top-Right
      ctx.beginPath(); ctx.moveTo(w - margin - cornerSize, margin); ctx.lineTo(w - margin, margin); ctx.lineTo(w - margin, margin + cornerSize); ctx.stroke();
      // Bottom-Left
      ctx.beginPath(); ctx.moveTo(margin, h - margin - cornerSize); ctx.lineTo(margin, h - margin); ctx.lineTo(margin + cornerSize, h - margin); ctx.stroke();
      // Bottom-Right
      ctx.beginPath(); ctx.moveTo(w - margin - cornerSize, h - margin); ctx.lineTo(w - margin, h - margin); ctx.lineTo(w - margin, h - margin - cornerSize); ctx.stroke();

      // 6. Top Brand Header Bar
      ctx.save();
      const topLogoSize = 34 * scale;
      const topMarginX = 54 * scale;
      const topMarginY = 56 * scale;

      // Draw official logo circular icon
      ctx.drawImage(appIconImg, topMarginX, topMarginY - topLogoSize / 2, topLogoSize, topLogoSize);

      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = \`800 \${20 * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('Nexcoin', topMarginX + topLogoSize + 12 * scale, topMarginY);
      const nw = ctx.measureText('Nexcoin').width;
      ctx.fillStyle = '#C9A84C';
      ctx.fillText('PR', topMarginX + topLogoSize + 12 * scale + nw, topMarginY);

      // Top Tag Badge
      const pillX = topMarginX + topLogoSize + 12 * scale + nw + 40 * scale;
      ctx.fillStyle = 'rgba(201, 168, 76, 0.16)';
      ctx.strokeStyle = 'rgba(201, 168, 76, 0.4)';
      ctx.lineWidth = 1 * scale;
      roundRect(ctx, pillX, topMarginY - 14 * scale, 210 * scale, 28 * scale, 14 * scale, true, true);
      ctx.fillStyle = '#F3D785';
      ctx.font = \`700 \${11.5 * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
      ctx.textAlign = 'center';
      ctx.fillText('📱 OFFICIAL ANDROID APP', pillX + 105 * scale, topMarginY);

      // Website URL Right
      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = \`700 \${15 * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
      ctx.fillText('WWW.NEXCOINPR.AGENCY', w - topMarginX, topMarginY);
      ctx.restore();

      // 7. SCENE SWITCHER (5 Scenes, 4.0s each)
      if (t < 4.0) {
        renderScene1(t, w, h, scale, isSquare);
      } else if (t < 8.0) {
        renderScene2(t - 4.0, w, h, scale, isSquare);
      } else if (t < 12.0) {
        renderScene3(t - 8.0, w, h, scale, isSquare);
      } else if (t < 16.0) {
        renderScene4(t - 12.0, w, h, scale, isSquare);
      } else {
        renderScene5(t - 16.0, w, h, scale, isSquare);
      }

      // 8. Global Smooth Transitions (Fade-in at start, Fade-out at end)
      if (t < 0.4) {
        ctx.fillStyle = \`rgba(0, 0, 0, \${1 - t / 0.4})\`;
        ctx.fillRect(0, 0, w, h);
      } else if (t > 19.3) {
        ctx.fillStyle = \`rgba(0, 0, 0, \${(t - 19.3) / 0.7})\`;
        ctx.fillRect(0, 0, w, h);
      }
    }

    // ============================================================
    // SCENE 1: App Launch & Brand Reveal (0.0s to 4.0s)
    // ============================================================
    function renderScene1(st, w, h, scale, isSquare) {
      const alpha = Math.min(1, st / 0.45);
      const outAlpha = st > 3.4 ? Math.max(0, (4.0 - st) / 0.6) : 1;
      const combinedAlpha = alpha * outAlpha;

      ctx.save();
      ctx.globalAlpha = combinedAlpha;

      // Phone Position & Entrance Animation
      const phoneEntrance = Math.min(1, st / 0.8);
      const ease = 1 - Math.pow(1 - phoneEntrance, 3);
      const floatY = Math.sin(st * 2.5) * 8 * scale;

      const phoneW = (isSquare ? 320 : 340) * scale;
      const phoneH = phoneW * 2.05;
      const phoneX = isSquare ? w / 2 : w * 0.72;
      const phoneY = (isSquare ? h * 0.58 : h * 0.54) + (1 - ease) * 120 * scale + floatY;

      // Draw Phone displaying Hero Dashboard
      drawPhoneMockup(ctx, phoneX, phoneY, phoneW, phoneH, screenHeroImg, scale, 0.02 * Math.sin(st * 1.5));

      // Left Column Content (or Top on Square)
      const textX = isSquare ? w / 2 : w * 0.08;
      const textY = isSquare ? h * 0.20 : h * 0.38;

      ctx.textAlign = isSquare ? 'center' : 'left';

      // Eyebrow Pill
      ctx.fillStyle = 'rgba(201, 168, 76, 0.18)';
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 1.5 * scale;
      const pillW = 380 * scale;
      const pillH = 38 * scale;
      const pillXPos = isSquare ? w / 2 - pillW / 2 : textX;
      roundRect(ctx, pillXPos, textY - 48 * scale, pillW, pillH, 19 * scale, true, true);

      ctx.fillStyle = '#F3D785';
      ctx.font = \`800 \${13.5 * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
      ctx.textAlign = 'center';
      ctx.fillText('⚡ OFFICIAL RELEASE • ANDROID v1.4.2', pillXPos + pillW / 2, textY - 24 * scale);

      ctx.textAlign = isSquare ? 'center' : 'left';

      // Headline
      ctx.fillStyle = '#FFFFFF';
      ctx.font = \`900 \${(isSquare ? 42 : 54) * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
      ctx.fillText('THE ALL-NEW', textX, textY + 20 * scale);

      // Gold Gradient Subheadline
      const goldGrad = ctx.createLinearGradient(textX, textY + 40 * scale, textX + 450 * scale, textY + 90 * scale);
      goldGrad.addColorStop(0, '#FFFFFF');
      goldGrad.addColorStop(0.4, '#F3D785');
      goldGrad.addColorStop(1, '#C9A84C');
      ctx.fillStyle = goldGrad;
      ctx.fillText('NEXCOINPR APP', textX, textY + (isSquare ? 68 : 82) * scale);

      // Description
      ctx.fillStyle = '#CBD5E1';
      ctx.font = \`500 \${(isSquare ? 17 : 21) * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
      ctx.fillText('Transparent Crypto, Web3 & Forex PR Wire', textX, textY + (isSquare ? 104 : 130) * scale);
      ctx.fillText('Media Intelligence — Now Live On Android.', textX, textY + (isSquare ? 128 : 160) * scale);

      // Feature tags row
      if (!isSquare) {
        const tagY = textY + 220 * scale;
        const tags = ['📊 144+ Outlets Live', '📦 13 Bundled Tiers', '⚡ Real-Time Cloud Sync'];
        let curX = textX;
        tags.forEach(tag => {
          ctx.font = \`700 \${14 * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
          const tw = ctx.measureText(tag).width;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.strokeStyle = 'rgba(201, 168, 76, 0.35)';
          ctx.lineWidth = 1 * scale;
          roundRect(ctx, curX, tagY, tw + 28 * scale, 36 * scale, 18 * scale, true, true);

          ctx.fillStyle = '#F8F9FA';
          ctx.textAlign = 'left';
          ctx.fillText(tag, curX + 14 * scale, tagY + 22 * scale);
          curX += tw + 40 * scale;
        });
      }

      ctx.restore();
    }

    // ============================================================
    // SCENE 2: 144+ Single Media Outlets & Prices (4.0s to 8.0s)
    // ============================================================
    function renderScene2(st, w, h, scale, isSquare) {
      const alpha = Math.min(1, st / 0.45);
      const outAlpha = st > 3.4 ? Math.max(0, (4.0 - st) / 0.6) : 1;
      const combinedAlpha = alpha * outAlpha;

      ctx.save();
      ctx.globalAlpha = combinedAlpha;

      const floatY = Math.sin(st * 2.8) * 7 * scale;

      // Phone in center-left displaying 144+ single media
      const phoneW = (isSquare ? 300 : 340) * scale;
      const phoneH = phoneW * 2.05;
      const phoneX = isSquare ? w * 0.28 : w * 0.32;
      const phoneY = (isSquare ? h * 0.58 : h * 0.54) + floatY;

      drawPhoneMockup(ctx, phoneX, phoneY, phoneW, phoneH, screenMediaImg, scale, -0.015);

      // Right Column: Title and Floating Price Cards
      const textX = isSquare ? w * 0.54 : w * 0.50;
      const textY = isSquare ? h * 0.16 : h * 0.22;

      ctx.textAlign = 'left';

      // Eyebrow
      ctx.fillStyle = '#F3D785';
      ctx.font = \`800 \${15 * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
      ctx.fillText('✦ UNMATCHED MEDIA NETWORK', textX, textY);

      // Headline
      ctx.fillStyle = '#FFFFFF';
      ctx.font = \`900 \${(isSquare ? 32 : 46) * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
      ctx.fillText('144+ VERIFIED OUTLETS', textX, textY + (isSquare ? 38 : 50) * scale);

      ctx.fillStyle = '#CBD5E1';
      ctx.font = \`500 \${(isSquare ? 15 : 18) * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
      ctx.fillText('Direct editorial desks with 100% transparent rates.', textX, textY + (isSquare ? 66 : 84) * scale);

      // Animated Rate Cards
      const outlets = [
        { name: 'FORBES', tier: 'Top Tier Global', price: '$3,500', delay: 0.1, color: '#C9A84C' },
        { name: 'BLOOMBERG', tier: 'Global Financial', price: '$8,500', delay: 0.3, color: '#00F2FE' },
        { name: 'COINTELEGRAPH', tier: 'Crypto Authority', price: '$2,999', delay: 0.5, color: '#F3D785' },
        { name: 'DECRYPT', tier: 'Web3 & DeFi Desk', price: '$2,400', delay: 0.7, color: '#10B981' },
        { name: 'COINDESK', tier: 'Crypto Institution', price: '$4,200', delay: 0.9, color: '#E2E8F0' }
      ];

      const startCardY = textY + (isSquare ? 95 : 125) * scale;
      const cardH = (isSquare ? 50 : 60) * scale;
      const cardW = (isSquare ? 420 : 540) * scale;

      outlets.forEach((item, idx) => {
        const itemProg = Math.max(0, Math.min(1, (st - item.delay) / 0.4));
        const itemEase = 1 - Math.pow(1 - itemProg, 3);
        const cardY = startCardY + idx * (cardH + 12 * scale);
        const cardX = textX + (1 - itemEase) * 60 * scale;

        ctx.save();
        ctx.globalAlpha = combinedAlpha * itemProg;

        // Card Background
        ctx.fillStyle = 'rgba(13, 31, 60, 0.85)';
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 1.5 * scale;
        roundRect(ctx, cardX, cardY, cardW, cardH, 12 * scale, true, true);

        // Publication Name
        ctx.fillStyle = '#FFFFFF';
        ctx.font = \`800 \${(isSquare ? 16 : 20) * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
        ctx.textAlign = 'left';
        ctx.fillText(item.name, cardX + 20 * scale, cardY + cardH * 0.42);

        // Sub Tier
        ctx.fillStyle = '#94A3B8';
        ctx.font = \`600 \${(isSquare ? 11 : 13) * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
        ctx.fillText(item.tier, cardX + 20 * scale, cardY + cardH * 0.76);

        // Price Badge on Right
        ctx.fillStyle = 'rgba(201, 168, 76, 0.2)';
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 1 * scale;
        const priceW = (isSquare ? 90 : 110) * scale;
        const priceH = (isSquare ? 30 : 36) * scale;
        roundRect(ctx, cardX + cardW - priceW - 14 * scale, cardY + (cardH - priceH) / 2, priceW, priceH, 8 * scale, true, true);

        ctx.fillStyle = '#F3D785';
        ctx.font = \`900 \${(isSquare ? 15 : 18) * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
        ctx.textAlign = 'center';
        ctx.fillText(item.price, cardX + cardW - priceW / 2 - 14 * scale, cardY + cardH / 2 + 1 * scale);

        ctx.restore();
      });

      ctx.restore();
    }

    // ============================================================
    // SCENE 3: 13 PR Bundled Packages (8.0s to 12.0s)
    // ============================================================
    function renderScene3(st, w, h, scale, isSquare) {
      const alpha = Math.min(1, st / 0.45);
      const outAlpha = st > 3.4 ? Math.max(0, (4.0 - st) / 0.6) : 1;
      const combinedAlpha = alpha * outAlpha;

      ctx.save();
      ctx.globalAlpha = combinedAlpha;

      const floatY = Math.sin(st * 2.6) * 7 * scale;

      // Phone in center-right displaying 13 Packages
      const phoneW = (isSquare ? 300 : 340) * scale;
      const phoneH = phoneW * 2.05;
      const phoneX = isSquare ? w * 0.72 : w * 0.70;
      const phoneY = (isSquare ? h * 0.58 : h * 0.54) + floatY;

      drawPhoneMockup(ctx, phoneX, phoneY, phoneW, phoneH, screenPackagesImg, scale, 0.018);

      // Left Column: 13 Packages Showcase
      const textX = isSquare ? w * 0.06 : w * 0.08;
      const textY = isSquare ? h * 0.16 : h * 0.22;

      ctx.textAlign = 'left';

      // Eyebrow
      ctx.fillStyle = '#F3D785';
      ctx.font = \`800 \${15 * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
      ctx.fillText('📦 COMPLETE SYNDICATION BUNDLES', textX, textY);

      // Headline
      ctx.fillStyle = '#FFFFFF';
      ctx.font = \`900 \${(isSquare ? 32 : 46) * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
      ctx.fillText('13 TURNKEY PR PACKAGES', textX, textY + (isSquare ? 38 : 50) * scale);

      ctx.fillStyle = '#CBD5E1';
      ctx.font = \`500 \${(isSquare ? 15 : 18) * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
      ctx.fillText('Guaranteed editorial syndication tailored for Web3 & Finance.', textX, textY + (isSquare ? 66 : 84) * scale);

      // Package Highlights
      const packages = [
        { title: 'DeFi & Token Launch', desc: 'DEX/CEX listings, presales, and token generation events', icon: '🚀', tag: 'Fast-Track' },
        { title: 'Tier-1 Crypto Wire', desc: 'Guaranteed syndication across CoinDesk, Cointelegraph & Decrypt', icon: '💎', tag: 'Authority' },
        { title: 'Forex & Broker Elite', desc: 'Capital markets syndication on Bloomberg, Yahoo & Benzinga', icon: '📈', tag: 'Global Reach' },
        { title: '60-Media Mega Package', desc: 'Massive full-spectrum media blast across 60 global publications', icon: '⚡', tag: 'Maximum Impact' }
      ];

      const startY = textY + (isSquare ? 95 : 125) * scale;
      const blockH = (isSquare ? 65 : 78) * scale;
      const blockW = (isSquare ? 420 : 540) * scale;

      packages.forEach((pkg, idx) => {
        const prog = Math.max(0, Math.min(1, (st - idx * 0.2) / 0.4));
        const ease = 1 - Math.pow(1 - prog, 3);
        const curY = startY + idx * (blockH + 14 * scale);
        const curX = textX + (1 - ease) * -50 * scale;

        ctx.save();
        ctx.globalAlpha = combinedAlpha * prog;

        // Container Box
        ctx.fillStyle = 'rgba(10, 26, 48, 0.88)';
        ctx.strokeStyle = 'rgba(201, 168, 76, 0.4)';
        ctx.lineWidth = 1.5 * scale;
        roundRect(ctx, curX, curY, blockW, blockH, 14 * scale, true, true);

        // Icon Box
        ctx.fillStyle = 'rgba(201, 168, 76, 0.15)';
        roundRect(ctx, curX + 14 * scale, curY + (blockH - 46 * scale) / 2, 46 * scale, 46 * scale, 10 * scale, true, false);
        ctx.font = \`\${22 * scale}px sans-serif\`;
        ctx.textAlign = 'center';
        ctx.fillText(pkg.icon, curX + 14 * scale + 23 * scale, curY + blockH / 2 + 1 * scale);

        // Title
        ctx.textAlign = 'left';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = \`800 \${(isSquare ? 16 : 19) * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
        ctx.fillText(pkg.title, curX + 72 * scale, curY + blockH * 0.40);

        // Desc
        ctx.fillStyle = '#94A3B8';
        ctx.font = \`500 \${(isSquare ? 11.5 : 13.5) * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
        ctx.fillText(pkg.desc, curX + 72 * scale, curY + blockH * 0.74);

        // Tag pill
        ctx.fillStyle = 'rgba(243, 215, 133, 0.15)';
        ctx.strokeStyle = '#F3D785';
        ctx.lineWidth = 1 * scale;
        const tw = ctx.measureText(pkg.tag).width;
        roundRect(ctx, curX + blockW - tw - 34 * scale, curY + 12 * scale, tw + 20 * scale, 24 * scale, 6 * scale, true, true);
        ctx.fillStyle = '#F3D785';
        ctx.font = \`700 \${11 * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
        ctx.textAlign = 'center';
        ctx.fillText(pkg.tag, curX + blockW - tw / 2 - 24 * scale, curY + 24 * scale);

        ctx.restore();
      });

      ctx.restore();
    }

    // ============================================================
    // SCENE 4: Real-Time Cloud Sync & News Feed (12.0s to 16.0s)
    // ============================================================
    function renderScene4(st, w, h, scale, isSquare) {
      const alpha = Math.min(1, st / 0.45);
      const outAlpha = st > 3.4 ? Math.max(0, (4.0 - st) / 0.6) : 1;
      const combinedAlpha = alpha * outAlpha;

      ctx.save();
      ctx.globalAlpha = combinedAlpha;

      const floatY = Math.sin(st * 2.8) * 8 * scale;

      // Phone in center displaying Live News & Insights
      const phoneW = (isSquare ? 300 : 340) * scale;
      const phoneH = phoneW * 2.05;
      const phoneX = isSquare ? w * 0.30 : w * 0.34;
      const phoneY = (isSquare ? h * 0.58 : h * 0.54) + floatY;

      // Pulsing Wi-Fi / Cloud Waves radiating from Phone
      ctx.save();
      for (let r = 1; r <= 3; r++) {
        const waveProgress = (st * 1.5 + r * 0.33) % 1;
        const waveRadius = phoneW * 0.6 + waveProgress * 140 * scale;
        ctx.strokeStyle = \`rgba(0, 242, 254, \${(1 - waveProgress) * 0.35})\`;
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.arc(phoneX, phoneY, waveRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      drawPhoneMockup(ctx, phoneX, phoneY, phoneW, phoneH, screenInsightsImg, scale, -0.015, 'rgba(0, 242, 254, 0.4)');

      // Right Column Content
      const textX = isSquare ? w * 0.54 : w * 0.52;
      const textY = isSquare ? h * 0.16 : h * 0.22;

      ctx.textAlign = 'left';

      // Eyebrow
      ctx.fillStyle = '#00F2FE';
      ctx.font = \`800 \${15 * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
      ctx.fillText('⚡ NEXT-GEN SYNC ENGINE', textX, textY);

      // Headline
      ctx.fillStyle = '#FFFFFF';
      ctx.font = \`900 \${(isSquare ? 32 : 46) * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
      ctx.fillText('LIVE CLOUD SYNC', textX, textY + (isSquare ? 38 : 50) * scale);

      ctx.fillStyle = '#CBD5E1';
      ctx.font = \`500 \${(isSquare ? 15 : 18) * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
      ctx.fillText('Prices and market news auto-sync without app updates.', textX, textY + (isSquare ? 66 : 84) * scale);

      // Feature Bullet Points
      const features = [
        { title: 'Automatic Live Data Sync', desc: 'Outlet prices & discounts refresh automatically from live website.', icon: '🔄' },
        { title: 'Real-Time News Hub', desc: 'Up-to-the-minute crypto, forex & Web3 editorial coverage on mobile.', icon: '📰' },
        { title: '1-Tap Direct Ordering', desc: 'Tap any publication or package to open Telegram (@Nexcoinpr) directly.', icon: '💬' },
        { title: 'Ultra-Fast & Offline Cached', desc: 'Instant access even on slow networks with smart background caching.', icon: '⚡' }
      ];

      const startY = textY + (isSquare ? 95 : 125) * scale;
      const boxH = (isSquare ? 60 : 72) * scale;
      const boxW = (isSquare ? 420 : 540) * scale;

      features.forEach((feat, idx) => {
        const prog = Math.max(0, Math.min(1, (st - idx * 0.2) / 0.4));
        const ease = 1 - Math.pow(1 - prog, 3);
        const curY = startY + idx * (boxH + 12 * scale);
        const curX = textX + (1 - ease) * 50 * scale;

        ctx.save();
        ctx.globalAlpha = combinedAlpha * prog;

        ctx.fillStyle = 'rgba(10, 28, 54, 0.85)';
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.35)';
        ctx.lineWidth = 1.5 * scale;
        roundRect(ctx, curX, curY, boxW, boxH, 12 * scale, true, true);

        // Icon
        ctx.font = \`\${20 * scale}px sans-serif\`;
        ctx.textAlign = 'center';
        ctx.fillText(feat.icon, curX + 28 * scale, curY + boxH / 2 + 1 * scale);

        // Text
        ctx.textAlign = 'left';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = \`800 \${(isSquare ? 15 : 18) * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
        ctx.fillText(feat.title, curX + 54 * scale, curY + boxH * 0.40);

        ctx.fillStyle = '#94A3B8';
        ctx.font = \`500 \${(isSquare ? 11 : 13) * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
        ctx.fillText(feat.desc, curX + 54 * scale, curY + boxH * 0.74);

        ctx.restore();
      });

      ctx.restore();
    }

    // ============================================================
    // SCENE 5: Grand Finale & Call To Action (16.0s to 20.0s)
    // ============================================================
    function renderScene5(st, w, h, scale, isSquare) {
      const alpha = Math.min(1, st / 0.4);
      ctx.save();
      ctx.globalAlpha = alpha;

      const floatY = Math.sin(st * 2.5) * 6 * scale;

      // Phone in center-left
      const phoneW = (isSquare ? 280 : 330) * scale;
      const phoneH = phoneW * 2.05;
      const phoneX = isSquare ? w * 0.28 : w * 0.32;
      const phoneY = (isSquare ? h * 0.60 : h * 0.54) + floatY;

      drawPhoneMockup(ctx, phoneX, phoneY, phoneW, phoneH, screenHeroImg, scale, 0.015, 'rgba(201, 168, 76, 0.5)');

      // Right Column Content (CTA & QR)
      const textX = isSquare ? w * 0.52 : w * 0.48;
      const textY = isSquare ? h * 0.14 : h * 0.20;

      ctx.textAlign = 'left';

      // Eyebrow
      ctx.fillStyle = '#F3D785';
      ctx.font = \`800 \${15 * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
      ctx.fillText('🚀 READY TO GET YOUR STORY SEEN?', textX, textY);

      // Headline
      ctx.fillStyle = '#FFFFFF';
      ctx.font = \`900 \${(isSquare ? 30 : 44) * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
      ctx.fillText('DOWNLOAD NEXCOINPR', textX, textY + (isSquare ? 36 : 48) * scale);
      ctx.fillStyle = '#F3D785';
      ctx.fillText('FOR ANDROID TODAY', textX, textY + (isSquare ? 68 : 94) * scale);

      // QR Code Box + Download CTA
      const ctaY = textY + (isSquare ? 100 : 135) * scale;

      // QR Box Card
      const qrBoxSize = (isSquare ? 150 : 180) * scale;
      ctx.fillStyle = '#FFFFFF';
      roundRect(ctx, textX, ctaY, qrBoxSize, qrBoxSize, 16 * scale, true, false);

      // Draw QR image
      const qrMargin = 12 * scale;
      ctx.drawImage(qrImg, textX + qrMargin, ctaY + qrMargin, qrBoxSize - qrMargin * 2, qrBoxSize - qrMargin * 2);

      // Laser scan line effect on QR
      const scanY = ctaY + qrMargin + ((st * 0.8) % 1) * (qrBoxSize - qrMargin * 2);
      ctx.strokeStyle = '#00F2FE';
      ctx.lineWidth = 2 * scale;
      ctx.shadowColor = '#00F2FE';
      ctx.shadowBlur = 10 * scale;
      ctx.beginPath();
      ctx.moveTo(textX + qrMargin, scanY);
      ctx.lineTo(textX + qrBoxSize - qrMargin, scanY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Beside QR: Details & Actions
      const rightX = textX + qrBoxSize + 24 * scale;

      ctx.textAlign = 'left';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = \`800 \${(isSquare ? 17 : 22) * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
      ctx.fillText('Scan with Camera', rightX, ctaY + 28 * scale);

      ctx.fillStyle = '#94A3B8';
      ctx.font = \`600 \${(isSquare ? 12 : 14.5) * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
      ctx.fillText('Instant mobile download on any Android phone', rightX, ctaY + 54 * scale);

      // Direct Link Box
      const linkBoxW = (isSquare ? 260 : 340) * scale;
      const linkBoxH = (isSquare ? 42 : 50) * scale;
      const linkGrad = ctx.createLinearGradient(rightX, ctaY + 74 * scale, rightX + linkBoxW, ctaY + 74 * scale + linkBoxH);
      linkGrad.addColorStop(0, '#C9A84C');
      linkGrad.addColorStop(1, '#997A15');
      ctx.fillStyle = linkGrad;
      ctx.shadowColor = 'rgba(201, 168, 76, 0.4)';
      ctx.shadowBlur = 15 * scale;
      roundRect(ctx, rightX, ctaY + 74 * scale, linkBoxW, linkBoxH, 10 * scale, true, false);
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#070D18';
      ctx.font = \`800 \${(isSquare ? 13 : 16) * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
      ctx.textAlign = 'center';
      ctx.fillText('📥 nexcoinpr.agency/app', rightX + linkBoxW / 2, ctaY + 74 * scale + linkBoxH / 2 + 1 * scale);

      // Telegram Desk Tag
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = \`700 \${(isSquare ? 13 : 15.5) * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
      ctx.fillText('💬 24/7 Editorial Desk: Telegram @Nexcoinpr', textX, ctaY + qrBoxSize + 36 * scale);

      // Trust Footnote
      ctx.fillStyle = '#64748B';
      ctx.font = \`500 \${(isSquare ? 11 : 13) * scale}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\`;
      ctx.fillText('Verified SHA-256 Release • Target Android 16 (API 36) • 100% Safe', textX, ctaY + qrBoxSize + 60 * scale);

      ctx.restore();
    }

    // Expose initCanvas and renderFrame to Puppeteer
    window.initCanvas = initCanvas;
    window.renderFrame = renderFrame;
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'app_video_render_template.html'), templateHtml);
console.log('Template created successfully: app_video_render_template.html (' + (templateHtml.length / 1024).toFixed(1) + ' KB)');

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer-core');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const { generateAppPromoAudio } = require('./generate_app_promo_audio');

const ROOT = path.resolve(__dirname, '..');
const VIDEOS_DIR = path.join(ROOT, 'assets', 'videos');
const ARTIFACT_DIR = 'C:\\Users\\NDCOM\\.gemini\\antigravity\\brain\\45d74118-1c97-4e28-8316-86cea5814901';

if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const FFMPEG_PATH = ffmpegInstaller.path;

async function renderVideo(config) {
  const { name, width, height, outputFile } = config;
  console.log(`\n======================================================`);
  console.log(`Starting Render: ${name} (${width}x${height})`);
  console.log(`Output: ${outputFile}`);
  console.log(`======================================================`);

  const audioPath = path.join(__dirname, 'app_promo_theme.wav');
  if (!fs.existsSync(audioPath)) {
    console.log('Generating 20s cinematic audio track...');
    generateAppPromoAudio(audioPath, 20);
  }

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      `--window-size=${width},${height}`
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });

  const templatePath = 'file:///' + path.join(__dirname, 'app_video_render_template.html').replace(/\\/g, '/');
  await page.goto(templatePath, { waitUntil: 'load' });

  await page.evaluate((w, h) => {
    window.initCanvas(w, h);
  }, width, height);

  // FFmpeg H.264 MP4 pipe setup
  const ffmpegArgs = [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'mjpeg',
    '-r', '30',
    '-i', '-',
    '-i', audioPath,
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'medium',
    '-crf', '18',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    '-movflags', '+faststart',
    outputFile
  ];

  const ffmpegProcess = spawn(FFMPEG_PATH, ffmpegArgs, {
    stdio: ['pipe', 'ignore', 'pipe']
  });

  let ffmpegStderr = '';
  ffmpegProcess.stderr.on('data', d => { ffmpegStderr += d.toString(); });

  const totalFrames = 600; // 20s * 30fps
  console.log(`Rendering ${totalFrames} frames...`);

  const startTime = Date.now();

  for (let f = 0; f < totalFrames; f++) {
    const base64Data = await page.evaluate((frameIdx) => {
      window.renderFrame(frameIdx);
      return document.getElementById('canvas').toDataURL('image/jpeg', 0.94);
    }, f);

    const base64Image = base64Data.replace(/^data:image\/jpeg;base64,/, '');
    const buffer = Buffer.from(base64Image, 'base64');

    const canWrite = ffmpegProcess.stdin.write(buffer);
    if (!canWrite) {
      await new Promise(resolve => ffmpegProcess.stdin.once('drain', resolve));
    }

    if (f % 60 === 0 || f === totalFrames - 1) {
      const pct = Math.round(((f + 1) / totalFrames) * 100);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      process.stdout.write(`\r  -> Progress: ${pct}% (${f + 1}/${totalFrames} frames in ${elapsed}s)`);
    }
  }

  console.log('\n  Finishing video encoding...');
  ffmpegProcess.stdin.end();

  await new Promise((resolve, reject) => {
    ffmpegProcess.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}\n${ffmpegStderr}`));
    });
  });

  await browser.close();

  const stats = fs.statSync(outputFile);
  console.log(`SUCCESS: Video saved to ${outputFile} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

  // Copy to Artifacts directory if it exists
  if (fs.existsSync(ARTIFACT_DIR)) {
    const artifactDest = path.join(ARTIFACT_DIR, path.basename(outputFile));
    fs.copyFileSync(outputFile, artifactDest);
    console.log(`Copied video to Artifacts: ${artifactDest}`);
  }
}

async function main() {
  // 1. Render 16:9 Landscape Widescreen (1920x1080 Full HD)
  const out16x9 = path.join(VIDEOS_DIR, 'nexcoinpr-app-promo-16x9.mp4');
  await renderVideo({
    name: 'NexcoinPR Mobile App Promo (16:9 Full HD Landscape)',
    width: 1920,
    height: 1080,
    outputFile: out16x9
  });

  // 2. Render 1:1 Square Feed (1080x1080 Mobile LinkedIn Feed)
  const outSquare = path.join(VIDEOS_DIR, 'nexcoinpr-app-promo-square.mp4');
  await renderVideo({
    name: 'NexcoinPR Mobile App Promo (1:1 Square LinkedIn Mobile Feed)',
    width: 1080,
    height: 1080,
    outputFile: outSquare
  });

  console.log('\n======================================================');
  console.log('ALL PROMO VIDEOS SUCCESSFULLY GENERATED & READY!');
  console.log('======================================================\n');
}

main().catch(err => {
  console.error('Fatal error during video generation:', err);
  process.exit(1);
});

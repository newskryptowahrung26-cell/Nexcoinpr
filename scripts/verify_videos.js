const { execSync } = require('child_process');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const v1 = path.join(ROOT, 'assets', 'videos', 'nexcoinpr-announcement-16x9.mp4');
const v2 = path.join(ROOT, 'assets', 'videos', 'nexcoinpr-announcement-square.mp4');

try {
  const out1 = execSync(`"${ffmpeg.path}" -i "${v1}"`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
} catch (e) {
  const lines = e.stderr.split('\n');
  console.log('=== 16:9 Video Specs ===');
  lines.filter(l => l.includes('Duration') || l.includes('Stream')).forEach(l => console.log(l.trim()));
}

try {
  const out2 = execSync(`"${ffmpeg.path}" -i "${v2}"`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
} catch (e) {
  const lines = e.stderr.split('\n');
  console.log('\n=== Square Video Specs ===');
  lines.filter(l => l.includes('Duration') || l.includes('Stream')).forEach(l => console.log(l.trim()));
}

const { execSync } = require('child_process');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const out = execSync(`"${ffmpeg.path}" -codecs`, { encoding: 'utf8' });
console.log('libx264 support:', out.includes('libx264'));
console.log('aac support:', out.includes('aac'));

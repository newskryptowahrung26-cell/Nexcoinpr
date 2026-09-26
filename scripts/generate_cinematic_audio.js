const fs = require('fs');
const path = require('path');

// Generate 16 seconds of 44100Hz 16-bit stereo PCM audio
function generateCinematicAudio(outputPath, durationSeconds = 16) {
  const sampleRate = 44100;
  const numChannels = 2;
  const bytesPerSample = 2; // 16-bit
  const totalSamples = Math.floor(sampleRate * durationSeconds);
  const dataSize = totalSamples * numChannels * bytesPerSample;

  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1 size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // PCM format
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28); // byte rate
  buffer.writeUInt16LE(numChannels * bytesPerSample, 32); // block align
  buffer.writeUInt16LE(16, 34); // bits per sample

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Audio synthesis parameters
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate; // time in seconds

    // 1. Deep cinematic sub-bass drone (55Hz to 75Hz)
    const bassFreq = 55 + Math.sin(t * 0.5) * 5;
    let bass = Math.sin(2 * Math.PI * bassFreq * t) * 0.28;
    // Add sub-octave warmth
    bass += Math.sin(2 * Math.PI * (bassFreq / 2) * t) * 0.15;

    // 2. Chime impacts at scene transitions (0.2s, 3.8s, 7.8s, 11.8s)
    let chimeL = 0;
    let chimeR = 0;
    const transitionTimes = [0.1, 3.8, 7.8, 11.8];
    const chimeFreqs = [587.33, 659.25, 880.00, 1046.50]; // D5, E5, A5, C6

    transitionTimes.forEach((trTime, idx) => {
      if (t >= trTime && t < trTime + 3.2) {
        const dt = t - trTime;
        const decay = Math.exp(-dt * 2.2);
        const f0 = chimeFreqs[idx];
        const tone = (
          Math.sin(2 * Math.PI * f0 * dt) * 0.5 +
          Math.sin(2 * Math.PI * f0 * 1.5 * dt) * 0.25 +
          Math.sin(2 * Math.PI * f0 * 2.0 * dt) * 0.15
        ) * decay * 0.35;
        chimeL += tone * (idx % 2 === 0 ? 0.9 : 0.6);
        chimeR += tone * (idx % 2 === 0 ? 0.6 : 0.9);
      }
    });

    // 3. Ambient atmospheric synth pad (chords in D minor: D - F - A - C)
    const padFreqs = [146.83, 174.61, 220.00, 261.63];
    let pad = 0;
    padFreqs.forEach((pf, pidx) => {
      // gentle tremolo
      const trem = 0.8 + 0.2 * Math.sin(2 * Math.PI * 0.8 * t + pidx);
      pad += Math.sin(2 * Math.PI * pf * t) * trem * 0.04;
    });

    // 4. Subtle electronic pulse (techno rhythm: 120 BPM = 0.5s per beat, starts at 3.5s)
    let pulse = 0;
    if (t >= 3.5 && t < 15.0) {
      const beat = (t - 3.5) % 0.5;
      const beatDecay = Math.exp(-beat * 12);
      // Soft electro kick/pulse
      pulse = Math.sin(2 * Math.PI * 90 * Math.exp(-beat * 25) * beat) * beatDecay * 0.18;
    }

    // 5. Whoosh sound before transitions (at 3.4s, 7.4s, 11.4s)
    let whoosh = 0;
    [3.3, 7.3, 11.3].forEach(wt => {
      if (t >= wt && t < wt + 0.6) {
        const wtProgress = (t - wt) / 0.6;
        // filtered noise
        const noise = (Math.random() * 2 - 1);
        const envelope = Math.sin(wtProgress * Math.PI);
        whoosh += noise * envelope * 0.12;
      }
    });

    // Master fade in (0 - 0.5s) and fade out (14.5 - 16s)
    let masterEnv = 1;
    if (t < 0.5) masterEnv = t / 0.5;
    if (t > 14.5) masterEnv = Math.max(0, (16 - t) / 1.5);

    let left = (bass + chimeL + pad + pulse + whoosh) * masterEnv;
    let right = (bass + chimeR + pad + pulse + whoosh) * masterEnv;

    // Soft limiter / clipping prevention
    left = Math.max(-0.95, Math.min(0.95, left));
    right = Math.max(-0.95, Math.min(0.95, right));

    const offset = 44 + i * 4;
    buffer.writeInt16LE(Math.floor(left * 32767), offset);
    buffer.writeInt16LE(Math.floor(right * 32767), offset + 2);
  }

  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated cinematic audio: ${outputPath} (${durationSeconds}s, ${buffer.length} bytes)`);
}

module.exports = { generateCinematicAudio };

if (require.main === module) {
  const out = path.join(__dirname, 'cinematic_theme.wav');
  generateCinematicAudio(out, 16);
}

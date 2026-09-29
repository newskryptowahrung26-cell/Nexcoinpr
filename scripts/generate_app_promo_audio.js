const fs = require('fs');
const path = require('path');

// Generate 20 seconds of 44100Hz 16-bit stereo PCM audio with cinematic modern tech sound design
function generateAppPromoAudio(outputPath, durationSeconds = 20) {
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
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28);
  buffer.writeUInt16LE(numChannels * bytesPerSample, 32);
  buffer.writeUInt16LE(16, 34);

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Transition hit times: Scene 1 (0.1s), Scene 2 (4.0s), Scene 3 (8.0s), Scene 4 (12.0s), Scene 5 (16.0s)
  const transitions = [0.1, 4.0, 8.0, 12.0, 16.0];
  const chimeChords = [
    [523.25, 659.25, 783.99, 1046.50], // C5, E5, G5, C6 (Inspiring C Maj)
    [587.33, 739.99, 880.00, 1174.66], // D5, F#5, A5, D6 (Bright D Maj)
    [659.25, 783.99, 987.77, 1318.51], // E5, G5, B5, E6 (Driving E Min)
    [698.46, 880.00, 1046.50, 1396.91], // F5, A5, C6, F6 (Expansive F Maj)
    [523.25, 659.25, 783.99, 1046.50, 1318.51] // Grand C Maj 9 Climax
  ];

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    // 1. Deep Sub-Bass Pulse (50Hz - 65Hz) with subtle movement
    const bassFreq = 55 + Math.sin(t * 0.8) * 6;
    let bass = Math.sin(2 * Math.PI * bassFreq * t) * 0.28;
    bass += Math.sin(2 * Math.PI * (bassFreq / 2) * t) * 0.16;

    // 2. High-Tech Arpeggio / Rhythmic Pulse (120 BPM = 2 beats/sec = 8th note every 0.25s)
    const beatIndex = Math.floor(t * 4);
    const beatPhase = (t * 4) % 1;
    const arpFreqs = [440, 523.25, 659.25, 783.99, 880, 1046.5];
    const arpFreq = arpFreqs[beatIndex % arpFreqs.length];
    const arpEnv = Math.exp(-beatPhase * 6.0);
    const techPulse = Math.sin(2 * Math.PI * arpFreq * t) * arpEnv * 0.08;

    // 3. Shimmering Ambient Pad (Rich Stereo Saw/Sine layer)
    const pad1 = Math.sin(2 * Math.PI * 220 * t + Math.sin(t * 2) * 0.2) * 0.07;
    const pad2 = Math.sin(2 * Math.PI * 329.63 * t) * 0.06;
    const pad3 = Math.sin(2 * Math.PI * 440 * t) * 0.05;

    // 4. Scene Transition Impacts & Chimes
    let transL = 0;
    let transR = 0;
    transitions.forEach((trTime, idx) => {
      if (t >= trTime && t < trTime + 3.8) {
        const dt = t - trTime;
        const decay = Math.exp(-dt * 2.0);
        const chord = chimeChords[idx];
        chord.forEach((freq, fIdx) => {
          const tone = Math.sin(2 * Math.PI * freq * dt) * (0.35 / chord.length) * decay;
          // Stereo panning spread
          const pan = (fIdx % 2 === 0) ? 0.75 : 0.25;
          transL += tone * pan;
          transR += tone * (1 - pan);
        });

        // Add subtle low-end impact boom
        const subBoom = Math.sin(2 * Math.PI * 45 * dt) * Math.exp(-dt * 4.5) * 0.22;
        transL += subBoom;
        transR += subBoom;
      }
    });

    // 5. Build-up riser before the finale (from 14.5s to 16.0s)
    let riser = 0;
    if (t >= 14.2 && t < 16.0) {
      const riserProgress = (t - 14.2) / 1.8;
      const riserFreq = 200 + Math.pow(riserProgress, 2) * 800;
      riser = (Math.sin(2 * Math.PI * riserFreq * t) + (Math.random() - 0.5) * 0.2) * riserProgress * 0.15;
    }

    // Combine Left and Right channels
    let left = bass + pad1 + pad2 + techPulse + transL + riser * 0.7;
    let right = bass + pad1 + pad3 + techPulse + transR + riser * 0.7;

    // Master fade out in last 0.8s
    if (t > durationSeconds - 0.8) {
      const fade = Math.max(0, (durationSeconds - t) / 0.8);
      left *= fade;
      right *= fade;
    }

    // Soft clip limiter to prevent digital distortion
    left = Math.max(-0.95, Math.min(0.95, left));
    right = Math.max(-0.95, Math.min(0.95, right));

    const leftInt = Math.floor(left * 32767);
    const rightInt = Math.floor(right * 32767);

    const offset = 44 + i * 4;
    buffer.writeInt16LE(leftInt, offset);
    buffer.writeInt16LE(rightInt, offset + 2);
  }

  fs.writeFileSync(outputPath, buffer);
  console.log(`Audio generated successfully: ${outputPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

module.exports = { generateAppPromoAudio };

if (require.main === module) {
  const out = path.join(__dirname, 'app_promo_theme.wav');
  generateAppPromoAudio(out, 20);
}

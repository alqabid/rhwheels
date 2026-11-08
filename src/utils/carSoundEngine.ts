/**
 * Realistic Automotive Sound Engine (Web Audio API Multi-Layer Synthesis)
 * Produces:
 * 1. "gas"   — Throaty V8 exhaust idle-to-redline rev with double throttle blip & exhaust crackle/burble
 * 2. "drift" — High-RPM engine limiter roar + realistic rubber tire screech/skid across asphalt
 */

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

function makeDistortionCurve(amount = 65): Float32Array<ArrayBuffer> {
  const k = amount;
  const nSamples = 44100;
  const curve = new Float32Array(new ArrayBuffer(nSamples * 4));
  const deg = Math.PI / 180;
  for (let i = 0; i < nSamples; ++i) {
    const x = (i * 2) / nSamples - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

function createNoiseBuffer(ctx: AudioContext, durationSec: number): AudioBuffer {
  const bufferSize = Math.floor(ctx.sampleRate * durationSec);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    // Pink/brownish weighting for fuller mechanical texture
    data[i] = (lastOut + 0.08 * white) / 1.08;
    lastOut = data[i];
    data[i] *= 2.5;
  }
  return buffer;
}

/**
 * Plays a realistic V8 Gas Engine Rev with throttle blips and exhaust burble
 */
export function playCarGasRevSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 1.65;

    // Master output gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, now);
    masterGain.gain.linearRampToValueAtTime(0.28, now + 0.08);
    masterGain.gain.setValueAtTime(0.26, now + 0.85);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    masterGain.connect(ctx.destination);

    // Exhaust Waveshaper Distortion for raspy metallic V8 growl
    const shaper = ctx.createWaveShaper();
    shaper.curve = makeDistortionCurve(85);
    shaper.oversample = '4x';

    // Resonant Exhaust Lowpass Filter (opens up as throttle increases)
    const exhaustFilter = ctx.createBiquadFilter();
    exhaustFilter.type = 'lowpass';
    exhaustFilter.Q.setValueAtTime(4.2, now);
    exhaustFilter.frequency.setValueAtTime(180, now);
    exhaustFilter.frequency.exponentialRampToValueAtTime(980, now + 0.38);
    exhaustFilter.frequency.exponentialRampToValueAtTime(520, now + 0.58);
    exhaustFilter.frequency.exponentialRampToValueAtTime(1350, now + 0.92);
    exhaustFilter.frequency.exponentialRampToValueAtTime(160, now + duration);

    shaper.connect(exhaustFilter);
    exhaustFilter.connect(masterGain);

    // V8 Cylinder Harmonics (Cross-plane crank ratios: 1x, 1.5x, 2x, 3x)
    const harmonics = [
      { ratio: 1.0, type: 'sawtooth' as OscillatorType, gainVal: 0.45 },
      { ratio: 1.5, type: 'sawtooth' as OscillatorType, gainVal: 0.32 },
      { ratio: 2.0, type: 'square' as OscillatorType, gainVal: 0.22 },
      { ratio: 0.5, type: 'triangle' as OscillatorType, gainVal: 0.5 },
    ];

    harmonics.forEach((h) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = h.type;

      // RPM curve: Idle (48Hz) -> Blip 1 (155Hz) -> Drop (105Hz) -> Redline Rev (215Hz) -> Decel (52Hz)
      osc.frequency.setValueAtTime(48 * h.ratio, now);
      osc.frequency.exponentialRampToValueAtTime(155 * h.ratio, now + 0.36);
      osc.frequency.exponentialRampToValueAtTime(102 * h.ratio, now + 0.55);
      osc.frequency.exponentialRampToValueAtTime(215 * h.ratio, now + 0.9);
      osc.frequency.exponentialRampToValueAtTime(52 * h.ratio, now + duration);

      oscGain.gain.setValueAtTime(h.gainVal, now);
      osc.connect(oscGain);
      oscGain.connect(shaper);

      osc.start(now);
      osc.stop(now + duration);
    });

    // Exhaust Air Rush & Deceleration Crackle/Pops
    const noiseBuffer = createNoiseBuffer(ctx, duration);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(320, now);
    bandpass.frequency.exponentialRampToValueAtTime(1100, now + 0.9);
    bandpass.frequency.exponentialRampToValueAtTime(280, now + duration);
    bandpass.Q.setValueAtTime(2.0, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.02, now);
    noiseGain.gain.linearRampToValueAtTime(0.16, now + 0.35);
    noiseGain.gain.linearRampToValueAtTime(0.22, now + 0.9);
    noiseGain.gain.exponentialRampToValueAtTime(0.005, now + duration);

    noiseSource.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(masterGain);

    noiseSource.start(now);
    noiseSource.stop(now + duration);

    // Exhaust Backfire Pop / Burble on throttle lift (at 0.98s, 1.12s, 1.25s)
    [0.98, 1.12, 1.24].forEach((popTime, i) => {
      const popOsc = ctx.createOscillator();
      const popGain = ctx.createGain();
      popOsc.type = 'sawtooth';
      popOsc.frequency.setValueAtTime(110 - i * 15, now + popTime);
      popOsc.frequency.exponentialRampToValueAtTime(32, now + popTime + 0.08);

      popGain.gain.setValueAtTime(0.001, now + popTime);
      popGain.gain.linearRampToValueAtTime(0.24, now + popTime + 0.01);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + popTime + 0.085);

      popOsc.connect(popGain);
      popGain.connect(masterGain);
      popOsc.start(now + popTime);
      popOsc.stop(now + popTime + 0.09);
    });
  } catch {
    // Ignore if blocked by browser policy
  }
}

/**
 * Plays a realistic Drift Sound (High-RPM Engine Roar + Asphalt Tire Screech/Skid)
 */
export function playCarDriftSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 1.85;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, now);
    masterGain.gain.linearRampToValueAtTime(0.28, now + 0.08);
    masterGain.gain.setValueAtTime(0.26, now + 1.25);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    masterGain.connect(ctx.destination);

    // --- LAYER 1: High-RPM Engine Limiter Roar ---
    const engineShaper = ctx.createWaveShaper();
    engineShaper.curve = makeDistortionCurve(95);

    const engineFilter = ctx.createBiquadFilter();
    engineFilter.type = 'lowpass';
    engineFilter.frequency.setValueAtTime(450, now);
    engineFilter.frequency.exponentialRampToValueAtTime(1400, now + 0.3);
    engineFilter.frequency.setValueAtTime(1350, now + 1.3);
    engineFilter.frequency.exponentialRampToValueAtTime(220, now + duration);

    engineShaper.connect(engineFilter);
    engineFilter.connect(masterGain);

    [1.0, 1.5].forEach((ratio) => {
      const engOsc = ctx.createOscillator();
      const engGain = ctx.createGain();
      engOsc.type = 'sawtooth';
      engOsc.frequency.setValueAtTime(85 * ratio, now);
      engOsc.frequency.exponentialRampToValueAtTime(230 * ratio, now + 0.28);
      // Rev-limiter bounce during drift
      engOsc.frequency.setValueAtTime(240 * ratio, now + 0.45);
      engOsc.frequency.setValueAtTime(222 * ratio, now + 0.55);
      engOsc.frequency.setValueAtTime(245 * ratio, now + 0.7);
      engOsc.frequency.setValueAtTime(225 * ratio, now + 0.85);
      engOsc.frequency.setValueAtTime(242 * ratio, now + 1.05);
      engOsc.frequency.exponentialRampToValueAtTime(70 * ratio, now + duration);

      engGain.gain.setValueAtTime(0.22, now);
      engOsc.connect(engGain);
      engGain.connect(engineShaper);
      engOsc.start(now);
      engOsc.stop(now + duration);
    });

    // --- LAYER 2: Tire Screech / Rubber Skid on Asphalt ---
    const skidStart = now + 0.16;
    const skidDuration = 1.45;

    // Resonant dual-oscillator squeal + filtered friction noise
    const skidGain = ctx.createGain();
    skidGain.gain.setValueAtTime(0.001, skidStart);
    skidGain.gain.linearRampToValueAtTime(0.22, skidStart + 0.12);
    skidGain.gain.setValueAtTime(0.2, skidStart + 0.95);
    skidGain.gain.exponentialRampToValueAtTime(0.001, skidStart + skidDuration);
    skidGain.connect(masterGain);

    // High-Q Bandpass for rubber squeal formant
    const skidFilter = ctx.createBiquadFilter();
    skidFilter.type = 'bandpass';
    skidFilter.Q.setValueAtTime(8.5, skidStart);
    skidFilter.frequency.setValueAtTime(1080, skidStart);
    skidFilter.frequency.linearRampToValueAtTime(1320, skidStart + 0.45);
    skidFilter.frequency.linearRampToValueAtTime(980, skidStart + 0.95);
    skidFilter.frequency.linearRampToValueAtTime(1180, skidStart + skidDuration);
    skidFilter.connect(skidGain);

    // Tire squeal harmonic pair
    [1040, 1115].forEach((baseFreq, idx) => {
      const squealOsc = ctx.createOscillator();
      const squealOscGain = ctx.createGain();
      squealOsc.type = idx === 0 ? 'sawtooth' : 'triangle';
      squealOsc.frequency.setValueAtTime(baseFreq, skidStart);
      squealOsc.frequency.linearRampToValueAtTime(baseFreq * 1.14, skidStart + 0.4);
      squealOsc.frequency.linearRampToValueAtTime(baseFreq * 0.92, skidStart + 0.9);
      squealOsc.frequency.linearRampToValueAtTime(baseFreq * 1.05, skidStart + skidDuration);

      squealOscGain.gain.setValueAtTime(0.32, skidStart);
      squealOsc.connect(squealOscGain);
      squealOscGain.connect(skidFilter);

      squealOsc.start(skidStart);
      squealOsc.stop(skidStart + skidDuration);
    });

    // Asphalt tire friction noise
    const tireNoise = ctx.createBufferSource();
    tireNoise.buffer = createNoiseBuffer(ctx, skidDuration);
    const tireNoiseFilter = ctx.createBiquadFilter();
    tireNoiseFilter.type = 'bandpass';
    tireNoiseFilter.frequency.setValueAtTime(1650, skidStart);
    tireNoiseFilter.Q.setValueAtTime(3.2, skidStart);

    const tireNoiseGain = ctx.createGain();
    tireNoiseGain.gain.setValueAtTime(0.45, skidStart);

    tireNoise.connect(tireNoiseFilter);
    tireNoiseFilter.connect(tireNoiseGain);
    tireNoiseGain.connect(skidGain);

    tireNoise.start(skidStart);
    tireNoise.stop(skidStart + skidDuration);
  } catch {
    // Ignore if blocked by browser policy
  }
}

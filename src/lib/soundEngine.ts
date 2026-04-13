'use client';

type SoundType = 'move' | 'capture' | 'check' | 'castle' | 'win' | 'lose' | 'draw' | 'select';

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(
  freq: number,
  type: OscillatorType,
  startTime: number,
  duration: number,
  gainVal: number,
  ctx: AudioContext,
  fadeOut = true
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(gainVal, startTime);
  if (fadeOut) {
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  }

  osc.start(startTime);
  osc.stop(startTime + duration + 0.01);
}

function playNoise(startTime: number, duration: number, gainVal: number, ctx: AudioContext) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 800;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(gainVal, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(startTime);
}

const SOUNDS: Record<SoundType, (ctx: AudioContext) => void> = {
  select: (ctx) => {
    const t = ctx.currentTime;
    playTone(800, 'sine', t, 0.08, 0.15, ctx);
  },

  move: (ctx) => {
    const t = ctx.currentTime;
    playTone(440, 'square', t, 0.04, 0.12, ctx);
    playTone(660, 'sine', t + 0.04, 0.08, 0.10, ctx);
  },

  capture: (ctx) => {
    const t = ctx.currentTime;
    playNoise(t, 0.12, 0.3, ctx);
    playTone(220, 'sawtooth', t, 0.15, 0.2, ctx);
    playTone(180, 'sawtooth', t + 0.08, 0.1, 0.15, ctx);
  },

  castle: (ctx) => {
    const t = ctx.currentTime;
    const notes = [523, 659, 784];
    notes.forEach((f, i) => playTone(f, 'sine', t + i * 0.08, 0.15, 0.18, ctx));
  },

  check: (ctx) => {
    const t = ctx.currentTime;
    playTone(880, 'sawtooth', t, 0.1, 0.3, ctx);
    playTone(660, 'sawtooth', t + 0.12, 0.1, 0.25, ctx);
    playTone(880, 'sawtooth', t + 0.24, 0.15, 0.3, ctx);
  },

  // Victory fanfare
  win: (ctx) => {
    const t = ctx.currentTime;
    // Main fanfare chord progression
    const fanfare = [
      { f: 523, d: 0.0, dur: 0.2 },  // C5
      { f: 659, d: 0.1, dur: 0.2 },  // E5
      { f: 784, d: 0.2, dur: 0.3 },  // G5
      { f: 1047, d: 0.3, dur: 0.5 }, // C6
      { f: 784, d: 0.5, dur: 0.2 },  // G5
      { f: 1047, d: 0.7, dur: 0.8 }, // C6 long
    ];
    fanfare.forEach(({ f, d, dur }) => playTone(f, 'sine', t + d, dur, 0.25, ctx));

    // Harmony
    const harmony = [
      { f: 330, d: 0.0, dur: 0.5 },
      { f: 415, d: 0.2, dur: 0.6 },
      { f: 494, d: 0.5, dur: 0.9 },
    ];
    harmony.forEach(({ f, d, dur }) => playTone(f, 'triangle', t + d, dur, 0.12, ctx));

    // Sparkle effects
    [0.3, 0.5, 0.7, 0.9].forEach((delay) => {
      playTone(2000 + Math.random() * 1000, 'sine', t + delay, 0.1, 0.05, ctx);
    });
  },

  // Defeat dirge
  lose: (ctx) => {
    const t = ctx.currentTime;
    // Descending sad notes
    const dirge = [
      { f: 440, d: 0.0, dur: 0.4 },  // A4
      { f: 392, d: 0.35, dur: 0.4 }, // G4
      { f: 349, d: 0.7, dur: 0.4 },  // F4
      { f: 330, d: 1.05, dur: 0.6 }, // E4
      { f: 294, d: 1.5, dur: 0.8 },  // D4
      { f: 261, d: 2.0, dur: 1.2 },  // C4 long
    ];
    dirge.forEach(({ f, d, dur }) => playTone(f, 'triangle', t + d, dur, 0.2, ctx));

    // Low bass rumble
    [0, 0.5, 1.0, 1.5].forEach((delay) => {
      playTone(80 + delay * 10, 'sawtooth', t + delay, 0.4, 0.08, ctx);
    });
  },

  // Neutral stalemate
  draw: (ctx) => {
    const t = ctx.currentTime;
    const notes = [523, 523, 494, 523];
    const delays = [0, 0.2, 0.4, 0.7];
    notes.forEach((f, i) => playTone(f, 'sine', t + delays[i], 0.25, 0.15, ctx));
  },
};

export function playSound(type: SoundType): void {
  try {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();
    SOUNDS[type]?.(ctx);
  } catch {
    // Audio not supported or blocked
  }
}

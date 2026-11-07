/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Procedural Web Audio API sound synthesizer for Diwali Dhamaka
// Generates sparklers, fountain fizz, aerial booms, whistle launches, correct/wrong chimes, crowd cheer, and festive background music

class DiwaliSoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isMusicPlaying: boolean = false;
  private musicTimer: number | null = null;

  private compressor: DynamicsCompressorNode | null = null;

  constructor() {
    // Lazily initialize on first user gesture
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      // Cinema-grade dynamic compressor to maximize festive cracker loudness without clipping
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(25, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(10, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.002, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.2, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(1.1, this.ctx.currentTime); // High-impact loud festive SFX
      this.sfxGain.connect(this.compressor);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.32, this.ctx.currentTime);
      this.musicGain.connect(this.compressor);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.initCtx();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    this.initCtx();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.8, this.ctx.currentTime);
    }
  }

  // Play button click / UI tap
  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  // Coin / Money addition sound
  public playCoin() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(987.77, t); // B5
    osc1.frequency.setValueAtTime(1318.51, t + 0.08); // E6
    osc2.frequency.setValueAtTime(1975.53, t + 0.08);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(t);
    osc2.start(t + 0.08);
    osc1.stop(t + 0.35);
    osc2.stop(t + 0.35);
  }

  // Correct maths answer chime
  public playCorrect() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const start = this.ctx!.currentTime + idx * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.25, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(start);
      osc.stop(start + 0.25);
    });
  }

  // Unsafe / Wrong action warning buzzer
  public playWarning() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(110, t + 0.3);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.35);
  }

  // Sparkler crackle generator (stochastic micro-bursts of white noise)
  public playSparklerCrackle(durationSec = 2) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const bufferSize = this.ctx.sampleRate * durationSec;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Filtered intermittent crackles
    for (let i = 0; i < bufferSize; i++) {
      if (Math.random() < 0.04) {
        data[i] = (Math.random() * 2 - 1) * 0.8;
      } else {
        data[i] = (Math.random() * 2 - 1) * 0.03;
      }
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1800;

    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + durationSec);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
    noise.stop(t + durationSec);
  }

  // Flower Pot (Anaar) Fountain whoosh + fizz
  public playFountainShower(durationSec = 3.5) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const bufferSize = this.ctx.sampleRate * durationSec;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(2400, this.ctx.currentTime + 1.0);
    filter.Q.value = 2.5;

    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.4);
    gain.gain.setValueAtTime(0.35, t + durationSec - 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, t + durationSec);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
    noise.stop(t + durationSec);
  }

  // Spinning Chakra whirring sound
  public playChakraSpin(durationSec = 3) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.linearRampToValueAtTime(650, t + 0.8);
    osc.frequency.linearRampToValueAtTime(500, t + durationSec - 0.5);
    osc.frequency.linearRampToValueAtTime(150, t + durationSec);

    // LFO for spin modulation
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(8, t);
    lfo.frequency.linearRampToValueAtTime(24, t + 1);
    lfoGain.gain.setValueAtTime(100, t);

    lfo.connect(osc.frequency);
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.28, t + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, t + durationSec);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    lfo.start(t);
    osc.start(t);
    lfo.stop(t + durationSec);
    osc.stop(t + durationSec);
  }

  // Aerial Rocket Whistle + Distant Boom
  public playAerialRocket() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;

    // 1. Ascension whistle
    const whistle = this.ctx.createOscillator();
    const whistleGain = this.ctx.createGain();
    whistle.type = 'sine';
    whistle.frequency.setValueAtTime(400, t);
    whistle.frequency.exponentialRampToValueAtTime(2200, t + 0.9);

    whistleGain.gain.setValueAtTime(0.2, t);
    whistleGain.gain.linearRampToValueAtTime(0.3, t + 0.7);
    whistleGain.gain.exponentialRampToValueAtTime(0.001, t + 0.95);

    whistle.connect(whistleGain);
    whistleGain.connect(this.sfxGain);
    whistle.start(t);
    whistle.stop(t + 0.95);

    // 2. Explosion Boom at t + 1.0
    setTimeout(() => {
      this.playCelebratoryBoom();
    }, 950);
  }

  // Big fireworks celebratory boom with low rumble & reverb-like tail
  public playCelebratoryBoom() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;

    // Low sub bass kick
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.6);

    oscGain.gain.setValueAtTime(0.7, t);
    oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.7);

    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.75);

    // Burst noise tail
    const bufferSize = this.ctx.sampleRate * 1.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 1.1);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);

    noise.start(t);
    noise.stop(t + 1.2);
  }

  // Crowd cheer fanfare
  public playCrowdExcitement() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    // Harmonious festive chord fanfare
    const chord = [440, 554.37, 659.25, 880]; // A major
    const t = this.ctx.currentTime;

    chord.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(t);
      osc.stop(t + 1.8);
    });
  }

  // Heavy Atom Bomb (Bijili / Hydrogen Bomb) thunderous explosion – loud & punchy
  public playAtomBombExplosion() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;

    // 1. Extreme low sub-bass shockwave impact (deep floor-shaking punch)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(260, t);
    subOsc.frequency.exponentialRampToValueAtTime(28, t + 0.45);

    subGain.gain.setValueAtTime(1.4, t);
    subGain.gain.exponentialRampToValueAtTime(0.005, t + 0.9);

    subOsc.connect(subGain);
    subGain.connect(this.sfxGain);
    subOsc.start(t);
    subOsc.stop(t + 0.95);

    // 2. High-speed sharp gunpowder crack transient (ear-catching attack)
    const crackOsc = this.ctx.createOscillator();
    const crackGain = this.ctx.createGain();
    crackOsc.type = 'triangle';
    crackOsc.frequency.setValueAtTime(1600, t);
    crackOsc.frequency.exponentialRampToValueAtTime(120, t + 0.06);

    crackGain.gain.setValueAtTime(1.1, t);
    crackGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    crackOsc.connect(crackGain);
    crackGain.connect(this.sfxGain);
    crackOsc.start(t);
    crackOsc.stop(t + 0.09);

    // 3. Heavy explosive pressure blast noise (saturated explosive roar)
    const bufferSize = this.ctx.sampleRate * 1.6;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const raw = Math.random() * 2 - 1;
      data[i] = Math.tanh(raw * 3.0) * Math.exp(-i / (this.ctx.sampleRate * 0.38));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.frequency.exponentialRampToValueAtTime(160, t + 1.2);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(1.2, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.005, t + 1.5);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);

    noise.start(t);
    noise.stop(t + 1.6);
  }


  // Fuse burning sizzle / hiss sound
  public playFuseBurning(durationSec = 1.8) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const bufferSize = this.ctx.sampleRate * durationSec;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Crackling sizzle
      if (Math.random() < 0.08) {
        data[i] = (Math.random() * 2 - 1) * 0.9;
      } else {
        data[i] = (Math.random() * 2 - 1) * 0.15;
      }
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2200, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(3600, this.ctx.currentTime + durationSec);

    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + durationSec);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
    noise.stop(t + durationSec);
  }

  // Water Bucket Quench / Steam Hiss (cooling hot sparklers / duds)
  public playWaterQuench() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const durationSec = 1.2;
    const bufferSize = this.ctx.sampleRate * durationSec;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.4));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(400, this.ctx.currentTime + durationSec);

    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + durationSec);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
    noise.stop(t + durationSec);
  }

  // Red Ladi (garland of 100 crackers) – ultra-fast, loud, staccato festive bursting
  public playLadiPop(pops = 36) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    // Buffer for sharp explosive snaps
    const snapLen = Math.floor(this.ctx.sampleRate * 0.05);
    const snapBuffer = this.ctx.createBuffer(1, snapLen, this.ctx.sampleRate);
    const snapData = snapBuffer.getChannelData(0);
    for (let j = 0; j < snapLen; j++) {
      snapData[j] = (Math.random() * 2 - 1) * Math.exp(-j / (this.ctx.sampleRate * 0.012));
    }

    for (let i = 0; i < pops; i++) {
      // Fast, dense cadence (~20-25 pops per second like authentic festive ladis)
      const isClimax = i >= pops - 4;
      const step = isClimax ? 0.03 : 0.048;
      const delay = i * step + (Math.random() - 0.5) * 0.012;
      const t = this.ctx.currentTime + delay;

      // 1. Sharp gunpowder crack snap (noise transient)
      const snapSource = this.ctx.createBufferSource();
      snapSource.buffer = snapBuffer;

      const snapFilter = this.ctx.createBiquadFilter();
      snapFilter.type = 'bandpass';
      snapFilter.frequency.setValueAtTime(2400 + Math.random() * 800, t);
      snapFilter.Q.value = 3.0;

      const snapGain = this.ctx.createGain();
      const snapVolume = isClimax ? 1.2 : 0.85 + Math.random() * 0.3;
      snapGain.gain.setValueAtTime(snapVolume, t);
      snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

      snapSource.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(this.sfxGain);
      snapSource.start(t);
      snapSource.stop(t + 0.05);

      // 2. Body punch oscillator
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = Math.random() > 0.4 ? 'triangle' : 'sawtooth';

      const baseFreq = isClimax ? 750 : 520 + Math.random() * 280;
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(75, t + 0.04);

      oscGain.gain.setValueAtTime(isClimax ? 0.9 : 0.65, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

      osc.connect(oscGain);
      oscGain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.05);

      // 3. Heavy rhythmic thud on every 4th pop
      if (i % 4 === 0 || isClimax) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(180, t);
        kickOsc.frequency.exponentialRampToValueAtTime(38, t + 0.07);

        kickGain.gain.setValueAtTime(isClimax ? 1.2 : 0.9, t);
        kickGain.gain.exponentialRampToValueAtTime(0.005, t + 0.08);

        kickOsc.connect(kickGain);
        kickGain.connect(this.sfxGain);
        kickOsc.start(t);
        kickOsc.stop(t + 0.085);
      }
    }
  }

  // Cascading Multi-Cracker Burst (simultaneous fast, loud pops & bangs)
  public playMultiCrackerBurst(count = 24) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    for (let i = 0; i < count; i++) {
      const delay = Math.random() * 2.8;
      setTimeout(() => {
        if (Math.random() > 0.35) {
          this.playLadiPop(6);
        } else {
          this.playCelebratoryBoom();
        }
      }, delay * 1000);
    }
  }

  // Ambient Festive Background Music (Synthesized Indian Raga Pentatonic Chimes)
  public startFestiveMusic() {
    if (this.isMusicPlaying) return;
    this.initCtx();
    this.isMusicPlaying = true;

    // Raga Mohanam / Bhupali pentatonic scale notes (Sa, Ri, Ga, Pa, Dha: C, D, E, G, A)
    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
    const phrase = [0, 2, 4, 3, 2, 0, 1, 3, 4, 5, 4, 3, 2, 0];
    let noteIdx = 0;

    const playNextNote = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGain) return;

      const pitch = scale[phrase[noteIdx % phrase.length]];
      noteIdx++;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Warm sitar/plucked bell timbre
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, t);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(t);
      osc.stop(t + 1.3);

      this.musicTimer = window.setTimeout(playNextNote, 600);
    };

    playNextNote();
  }

  public stopFestiveMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  public toggleMusic(enabled: boolean) {
    if (enabled) {
      this.startFestiveMusic();
    } else {
      this.stopFestiveMusic();
    }
  }
}

export const soundManager = new DiwaliSoundEngine();

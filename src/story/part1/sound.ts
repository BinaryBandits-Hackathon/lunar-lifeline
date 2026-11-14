// PART 1 sound. Owned by Person 1.
// Everything is synthesized with the Web Audio API: no audio files, so it
// works offline. Sounds describe the scene only; nothing ever sounds like a
// "right" or "wrong" answer. Every call is safe when audio is unavailable.

type Bed = "ship" | "orbit" | "heat" | "wind" | "surface" | "story";

interface Layer {
  gain: GainNode;
  stop: () => void;
}

class Part1Sound {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private beds = new Map<Bed, Layer>();
  private hissLayer: Layer | null = null;
  private alarmTimer: number | null = null;
  private thrustLayer: Layer | null = null;
  private enabled = true;

  /** Creates the audio graph on first use (after the player has clicked). */
  private ready(): AudioContext | null {
    if (!this.enabled) return null;
    try {
      if (!this.ctx) {
        const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AC) return null;
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.7;
        const comp = this.ctx.createDynamicsCompressor();
        this.master.connect(comp).connect(this.ctx.destination);
        const len = this.ctx.sampleRate * 2;
        this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const d = this.noise.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      }
      if (this.ctx.state === "suspended") void this.ctx.resume();
      return this.ctx;
    } catch {
      return null;
    }
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    if (!on) this.stopAll();
  }

  /** Wake the audio after a click (browsers start it suspended). */
  unlock() {
    this.ready();
  }

  // ---------- building blocks ----------

  private noiseSource(ctx: AudioContext) {
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    return src;
  }

  private env(ctx: AudioContext, peak: number, attack: number, hold: number, release: number, at = ctx.currentTime) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), at + attack);
    g.gain.setValueAtTime(Math.max(peak, 0.0002), at + attack + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, at + attack + hold + release);
    g.connect(this.master!);
    return g;
  }

  private tone(type: OscillatorType, from: number, to: number, peak: number, dur: number, delay = 0) {
    const ctx = this.ready();
    if (!ctx) return;
    const at = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(from, at);
    o.frequency.exponentialRampToValueAtTime(Math.max(to, 1), at + dur);
    o.connect(this.env(ctx, peak, 0.01, dur * 0.2, dur * 0.8, at));
    o.start(at);
    o.stop(at + dur + 0.1);
  }

  private burst(filter: BiquadFilterType, freq: number, q: number, peak: number, dur: number, delay = 0) {
    const ctx = this.ready();
    if (!ctx) return;
    const at = ctx.currentTime + delay;
    const src = this.noiseSource(ctx);
    const f = ctx.createBiquadFilter();
    f.type = filter;
    f.frequency.value = freq;
    f.Q.value = q;
    src.connect(f).connect(this.env(ctx, peak, 0.005, dur * 0.1, dur * 0.9, at));
    src.start(at);
    src.stop(at + dur + 0.1);
  }

  /** A looping layer that fades in, and fades out when stopped. */
  private layer(level: number, build: (ctx: AudioContext, out: GainNode) => (() => void) | void): Layer | null {
    const ctx = this.ready();
    if (!ctx) return null;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(level, ctx.currentTime + 1.2);
    gain.connect(this.master!);
    const cleanup = build(ctx, gain);
    return {
      gain,
      stop: () => {
        const t = ctx.currentTime;
        gain.gain.cancelScheduledValues(t);
        gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 1);
        window.setTimeout(() => {
          cleanup?.();
          gain.disconnect();
        }, 1200);
      },
    };
  }

  // ---------- background beds ----------

  /** Crossfades to the background sound for a scene. */
  bed(kind: Bed | null) {
    for (const [k, l] of this.beds) {
      if (k !== kind) {
        l.stop();
        this.beds.delete(k);
      }
    }
    if (!kind || this.beds.has(kind)) return;
    const made = this.makeBed(kind);
    if (made) this.beds.set(kind, made);
  }

  private makeBed(kind: Bed): Layer | null {
    return this.layer(kind === "heat" ? 0.5 : 0.3, (ctx, out) => {
      const nodes: AudioScheduledSourceNode[] = [];
      const osc = (type: OscillatorType, f: number, g: number) => {
        const o = ctx.createOscillator();
        o.type = type;
        o.frequency.value = f;
        const gg = ctx.createGain();
        gg.gain.value = g;
        o.connect(gg).connect(out);
        o.start();
        nodes.push(o);
        return o;
      };
      const noise = (type: BiquadFilterType, f: number, g: number, sweep?: number) => {
        const src = this.noiseSource(ctx);
        const filt = ctx.createBiquadFilter();
        filt.type = type;
        filt.frequency.value = f;
        const gg = ctx.createGain();
        gg.gain.value = g;
        src.connect(filt).connect(gg).connect(out);
        src.start();
        nodes.push(src);
        if (sweep) {
          const lfo = ctx.createOscillator();
          lfo.frequency.value = 0.08;
          const depth = ctx.createGain();
          depth.gain.value = sweep;
          lfo.connect(depth).connect(filt.frequency);
          lfo.start();
          nodes.push(lfo);
        }
      };
      if (kind === "ship") {
        // the low hum of life support and the engines
        const lowpass = ctx.createBiquadFilter();
        lowpass.type = "lowpass";
        lowpass.frequency.value = 180;
        lowpass.connect(out);
        for (const f of [55, 55.6, 110.3]) {
          const o = ctx.createOscillator();
          o.type = "sawtooth";
          o.frequency.value = f;
          const g = ctx.createGain();
          g.gain.value = f > 100 ? 0.05 : 0.12;
          o.connect(g).connect(lowpass);
          o.start();
          nodes.push(o);
        }
        noise("lowpass", 400, 0.05);
      } else if (kind === "orbit") {
        // a wide, cold space drone
        osc("sine", 65, 0.22);
        osc("sine", 97.5, 0.12);
        osc("triangle", 130.4, 0.04);
        noise("lowpass", 250, 0.06, 80);
      } else if (kind === "heat") {
        // the roar of hot air on the heat shield
        noise("lowpass", 320, 0.9, 120);
        noise("bandpass", 900, 0.18, 300);
        osc("sawtooth", 38, 0.08);
      } else if (kind === "wind") {
        // thin Mars air rushing past the parachute
        noise("bandpass", 700, 0.5, 400);
        noise("lowpass", 200, 0.3);
      } else if (kind === "story") {
        // the opening's soft music: a warm chord that slowly breathes
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 1400;
        const swell = ctx.createGain();
        swell.gain.value = 0.8;
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.07;
        const depth = ctx.createGain();
        depth.gain.value = 0.25;
        lfo.connect(depth).connect(swell.gain);
        lfo.start();
        nodes.push(lfo);
        swell.connect(lp).connect(out);
        [
          [110, "sine", 0.22],
          [110.4, "triangle", 0.08],
          [164.8, "sine", 0.14],
          [220, "sine", 0.1],
          [261.6, "triangle", 0.05],
          [329.6, "sine", 0.04],
        ].forEach(([f, type, g]) => {
          const o = ctx.createOscillator();
          o.type = type as OscillatorType;
          o.frequency.value = f as number;
          const gg = ctx.createGain();
          gg.gain.value = g as number;
          o.connect(gg).connect(swell);
          o.start();
          nodes.push(o);
        });
        // a faint shimmer high above, like distant stars
        noise("bandpass", 6000, 0.02, 1500);
      } else {
        // a calm, empty surface
        noise("bandpass", 450, 0.25, 250);
        osc("sine", 82, 0.05);
      }
      return () => nodes.forEach((n) => n.stop());
    });
  }

  /** The oxygen leak: a hiss, louder or silent depending on the story. */
  hiss(level: "off" | "soft" | "loud") {
    if (level === "off") {
      this.hissLayer?.stop();
      this.hissLayer = null;
      return;
    }
    const target = level === "loud" ? 0.32 : 0.12;
    if (!this.hissLayer) {
      this.hissLayer = this.layer(target, (ctx, out) => {
        const src = this.noiseSource(ctx);
        const f = ctx.createBiquadFilter();
        f.type = "highpass";
        f.frequency.value = 3500;
        const flutter = ctx.createGain();
        flutter.gain.value = 0.7;
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 6;
        const depth = ctx.createGain();
        depth.gain.value = 0.3;
        lfo.connect(depth).connect(flutter.gain);
        src.connect(f).connect(flutter).connect(out);
        src.start();
        lfo.start();
        return () => {
          src.stop();
          lfo.stop();
        };
      });
    } else if (this.ctx) {
      const g = this.hissLayer.gain.gain;
      g.cancelScheduledValues(this.ctx.currentTime);
      g.setValueAtTime(Math.max(g.value, 0.0001), this.ctx.currentTime);
      g.exponentialRampToValueAtTime(target, this.ctx.currentTime + 1.5);
    }
  }

  // ---------- one-shot effects ----------

  /** The meteoroid strike: a sharp crack, a deep thump and ringing glass. */
  crack() {
    this.burst("highpass", 1800, 0.7, 0.9, 0.18);
    this.tone("sine", 140, 35, 0.9, 0.7);
    this.burst("lowpass", 500, 0.8, 0.6, 0.9);
    [2400, 3100, 3900].forEach((f, i) => this.tone("sine", f, f * 0.98, 0.06, 1.6, 0.05 + i * 0.03));
  }

  /** Two-tone warning beeps for a few seconds. */
  alarm(seconds = 4) {
    this.stopAlarm();
    let n = 0;
    const beep = () => {
      this.tone("square", n % 2 ? 660 : 880, n % 2 ? 660 : 880, 0.07, 0.22);
      n += 1;
      if (n >= seconds * 2.5) this.stopAlarm();
    };
    beep();
    this.alarmTimer = window.setInterval(beep, 400);
  }

  stopAlarm() {
    if (this.alarmTimer !== null) window.clearInterval(this.alarmTimer);
    this.alarmTimer = null;
  }

  /** Pip's little robot chirp before it speaks. */
  blip() {
    this.tone("sine", 880, 1320, 0.12, 0.09);
    this.tone("sine", 1180, 1760, 0.1, 0.09, 0.1);
  }

  /** A soft airy whoosh between the opening shots. */
  whoosh() {
    const ctx = this.ready();
    if (!ctx) return;
    const at = ctx.currentTime;
    const src = this.noiseSource(ctx);
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.Q.value = 1.2;
    f.frequency.setValueAtTime(300, at);
    f.frequency.exponentialRampToValueAtTime(2400, at + 0.9);
    src.connect(f).connect(this.env(ctx, 0.12, 0.45, 0.1, 0.6, at));
    src.start(at);
    src.stop(at + 1.3);
  }

  /** Building something: a few clanks of tools and a whirring motor. */
  build() {
    [0, 0.22, 0.44, 0.8, 1.02].forEach((d, i) => {
      this.tone("square", i % 2 ? 520 : 380, i % 2 ? 300 : 220, 0.06, 0.12, d);
      this.burst("bandpass", 2500, 2, 0.12, 0.08, d);
    });
    this.tone("sawtooth", 90, 180, 0.08, 1.1, 0.1);
    this.burst("lowpass", 400, 1, 0.2, 0.5, 1.2);
  }

  /** Night falling over the base: a slow, low swell. */
  night() {
    this.tone("sine", 196, 147, 0.18, 2.6);
    this.tone("sine", 247, 220, 0.1, 2.6, 0.2);
    this.tone("sine", 98, 73, 0.2, 2.8);
  }

  /** A soft tick for buttons. */
  tick() {
    this.tone("triangle", 1400, 1100, 0.05, 0.05);
  }

  /** The parachute snapping open. */
  chute() {
    this.burst("bandpass", 400, 0.9, 0.9, 0.35);
    this.tone("sine", 120, 60, 0.5, 0.4);
  }

  /** Engines firing, then the bump of touchdown. */
  touchdown(hard: boolean) {
    this.burst("lowpass", 600, 0.7, 0.5, 1.6);
    this.tone("sine", hard ? 70 : 90, 35, hard ? 1 : 0.6, 0.6, 1.2);
    if (hard) this.tone("sine", 70, 35, 0.8, 0.5, 1.6);
    this.burst("lowpass", 300, 1, hard ? 0.7 : 0.4, 1.2, 1.2);
  }

  /** The landing rockets roaring while the player holds them on. */
  thrust(on: boolean) {
    if (!on) {
      this.thrustLayer?.stop();
      this.thrustLayer = null;
      return;
    }
    if (this.thrustLayer) return;
    this.thrustLayer = this.layer(0.55, (ctx, out) => {
      const src = this.noiseSource(ctx);
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 520;
      const rumble = ctx.createOscillator();
      rumble.type = "sawtooth";
      rumble.frequency.value = 46;
      const rg = ctx.createGain();
      rg.gain.value = 0.18;
      src.connect(lp).connect(out);
      rumble.connect(rg).connect(out);
      src.start();
      rumble.start();
      return () => {
        src.stop();
        rumble.stop();
      };
    });
    // the roar starts fast, not with the slow fade used for background beds
    if (this.ctx && this.thrustLayer) {
      const g = this.thrustLayer.gain.gain;
      g.cancelScheduledValues(this.ctx.currentTime);
      g.setValueAtTime(0.0001, this.ctx.currentTime);
      g.exponentialRampToValueAtTime(0.55, this.ctx.currentTime + 0.08);
    }
  }

  /** The legs touching the ground: a soft settle, or a hard double bump. */
  thud(hard: boolean) {
    this.thrust(false);
    this.tone("sine", hard ? 75 : 95, 32, hard ? 1 : 0.5, hard ? 0.7 : 0.5);
    this.burst("lowpass", 300, 1, hard ? 0.8 : 0.35, hard ? 1.2 : 0.9);
    if (hard) {
      this.tone("sine", 70, 30, 0.7, 0.5, 0.32);
      this.burst("highpass", 2200, 0.8, 0.25, 0.3, 0.05);
    }
  }

  /** A calm, bright chime for the real NASA fact. */
  chime() {
    [523.3, 659.3, 784].forEach((f, i) => this.tone("sine", f, f, 0.08, 1.2, i * 0.12));
  }

  stopAll() {
    this.stopAlarm();
    this.thrust(false);
    this.hiss("off");
    this.bed(null);
  }
}

/** One shared sound engine for Part 1. */
export const p1Sound = new Part1Sound();

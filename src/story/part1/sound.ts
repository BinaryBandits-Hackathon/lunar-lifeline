// PART 1 sound. Owned by Person 1.
// Everything is synthesized with the Web Audio API: no audio files, so it
// works offline. Sounds describe the scene only; nothing ever sounds like a
// "right" or "wrong" answer. Every call is safe when audio is unavailable.

type Bed = "ship" | "orbit" | "heat" | "wind" | "surface";

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
  private suspense: Layer | null = null;
  private heartbeat: number | null = null;
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

  /** A soft tick for buttons. */
  tick() {
    this.tone("triangle", 1400, 1100, 0.05, 0.05);
  }

  /** Chapter title sting: a deep boom with a rising swell. */
  sting() {
    this.tone("sine", 90, 40, 0.8, 1.6);
    this.burst("lowpass", 260, 1, 0.35, 1.4);
    this.tone("sawtooth", 110, 220, 0.05, 1.2, 0.1);
  }

  /** Suspense while a decision waits: a slow rising drone and a heartbeat. */
  startSuspense() {
    if (this.suspense) return;
    this.suspense = this.layer(0.22, (ctx, out) => {
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(200, ctx.currentTime);
      lp.frequency.linearRampToValueAtTime(900, ctx.currentTime + 14);
      lp.Q.value = 6;
      lp.connect(out);
      const oscs = [73.4, 74.1, 110].map((f) => {
        const o = ctx.createOscillator();
        o.type = "sawtooth";
        o.frequency.value = f;
        o.connect(lp);
        o.start();
        return o;
      });
      return () => oscs.forEach((o) => o.stop());
    });
    const beat = () => {
      this.tone("sine", 62, 40, 0.5, 0.18);
      this.tone("sine", 58, 38, 0.35, 0.16, 0.22);
    };
    beat();
    this.heartbeat = window.setInterval(beat, 1100);
  }

  stopSuspense() {
    if (this.heartbeat !== null) window.clearInterval(this.heartbeat);
    this.heartbeat = null;
    this.suspense?.stop();
    this.suspense = null;
  }

  /** The moment a choice is locked in: one neutral low chord. */
  lockIn() {
    this.tone("sine", 196, 196, 0.25, 1.4);
    this.tone("sine", 293.7, 293.7, 0.15, 1.4);
    this.burst("lowpass", 180, 1, 0.3, 0.6);
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

  /** A calm, bright chime for the real NASA fact. */
  chime() {
    [523.3, 659.3, 784].forEach((f, i) => this.tone("sine", f, f, 0.08, 1.2, i * 0.12));
  }

  stopAll() {
    this.stopAlarm();
    this.stopSuspense();
    this.hiss("off");
    this.bed(null);
  }
}

/** One shared sound engine for Part 1. */
export const p1Sound = new Part1Sound();

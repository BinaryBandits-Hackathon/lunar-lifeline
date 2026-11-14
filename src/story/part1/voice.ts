// PART 1 voices. Owned by Person 1.
// Each character gets its own voice from the browser's speech engine: Pip is
// a bright, quick little robot; Tunde is lower; narration is calm.
// Privacy (same rule as src/services/speech.ts): only voices that run on the
// device are used, so the child's name is never sent to a cloud service.

import type { Lang } from "../types";

export type Speaker = "pip" | "tunde" | "mei" | "earth" | "narrator";

const STYLE: Record<Speaker, { pitch: number; rate: number }> = {
  pip: { pitch: 1.55, rate: 1.04 },
  tunde: { pitch: 0.75, rate: 1.02 },
  mei: { pitch: 1.2, rate: 0.98 },
  earth: { pitch: 1, rate: 0.95 },
  narrator: { pitch: 0.95, rate: 0.92 },
};

const PREFERRED = [/natural/i, /Samantha/i, /Ava/i, /Aria|Jenny|Libby|Sonia|Zira|Hazel/i];
const AVOID = /espeak|whisper|bad news|bells|bubbles|cellos|trinoids|organ|albert/i;

const can = () => typeof window !== "undefined" && "speechSynthesis" in window;

function pickVoice(lang: Lang): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices().filter((v) => v.localService && v.lang.toLowerCase().startsWith(lang) && !AVOID.test(v.name));
  if (voices.length === 0) return null;
  for (const p of PREFERRED) {
    const v = voices.find((x) => p.test(x.name));
    if (v) return v;
  }
  return voices.find((v) => v.lang === "en-US") ?? voices[0];
}

/** True when this device has a voice for the language (Bangla often has none). */
export function hasVoice(lang: Lang): boolean {
  return can() && pickVoice(lang) !== null;
}

/**
 * Speaks a line in the speaker's voice. Calls onEnd when finished (or right
 * away when no voice is available), so the screen can stop the talking animation.
 */
export function say(text: string, who: Speaker, lang: Lang, onEnd?: () => void): void {
  if (!can()) {
    onEnd?.();
    return;
  }
  try {
    const synth = window.speechSynthesis;
    synth.cancel();
    const voice = pickVoice(lang);
    if (!voice) {
      onEnd?.();
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.lang = voice.lang;
    u.pitch = STYLE[who].pitch;
    u.rate = STYLE[who].rate;
    u.onend = () => onEnd?.();
    u.onerror = () => onEnd?.();
    synth.speak(u);
  } catch {
    onEnd?.();
  }
}

export function hush(): void {
  if (!can()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // ignore
  }
}

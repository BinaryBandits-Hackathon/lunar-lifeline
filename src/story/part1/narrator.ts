// PART 1 narrator voice for the opening. Owned by Person 1.
// A calm, slow documentary voice from the browser's speech engine.
// Privacy (same rule as src/services/speech.ts): only voices that run on the
// device are used, so nothing is sent to a cloud service.
// Later, recorded narration can replace this without changing the opening.

import type { Lang } from "../types";

// Calm, deep voices first; then the most natural ones; then anything local.
const PREFERRED = [/natural/i, /David|Daniel|Mark|Guy|Alex|George|Ryan/i, /Samantha|Ava|Aria|Jenny|Zira|Hazel|Libby|Sonia/i];
const AVOID = /espeak|whisper|bad news|bells|bubbles|cellos|trinoids|organ|albert|zarvox|robot/i;

const can = () => typeof window !== "undefined" && "speechSynthesis" in window;

function pickVoice(lang: Lang): SpeechSynthesisVoice | null {
  if (!can()) return null;
  const voices = window.speechSynthesis.getVoices().filter((v) => v.localService && v.lang.toLowerCase().startsWith(lang) && !AVOID.test(v.name));
  if (voices.length === 0) return null;
  for (const p of PREFERRED) {
    const v = voices.find((x) => p.test(x.name));
    if (v) return v;
  }
  return voices[0];
}

/** True when this device can narrate in the language (Bangla often cannot). */
export function canNarrate(lang: Lang): boolean {
  return pickVoice(lang) !== null;
}

/**
 * Reads a line slowly and calmly. onEnd runs when it finishes, or straight
 * away if there is no voice, so the opening can move on by itself.
 */
export function narrate(text: string, lang: Lang, onEnd: () => void): void {
  const voice = pickVoice(lang);
  if (!voice) {
    onEnd();
    return;
  }
  try {
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = 0.84;
    u.pitch = 0.86;
    u.volume = 0.95;
    u.onend = () => onEnd();
    u.onerror = () => onEnd();
    synth.speak(u);
  } catch {
    onEnd();
  }
}

export function stopNarration(): void {
  if (!can()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // ignore
  }
}

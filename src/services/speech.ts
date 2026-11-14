// Read-aloud through the browser's built-in voices. Captions always show,
// so the game works without a voice. Read-aloud starts switched off.
//
// Privacy: only voices that run on the device are used. Online voices send
// the text (which can include the child's name) to a cloud service, so they
// are never chosen. Among on-device voices we pick the most natural one and
// avoid the robotic defaults. The real fix is recorded voice lines.

const PREFERRED = [/natural/i, /Samantha/i, /Ava/i, /Aria|Jenny|Libby|Sonia|Zira|Hazel/i];
const AVOID = /espeak|robot|whisper|zarvox|bad news|bells|bubbles|cellos|trinoids|organ|albert/i;

let chosen: SpeechSynthesisVoice | null | undefined;
let language: "en" | "bn" = "en";

/** Bangla narration needs a Bangla voice on the device; without one, captions only. */
export function setSpeechLanguage(lang: "en" | "bn"): void {
  if (lang !== language) chosen = undefined;
  language = lang;
}

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis
    .getVoices()
    .filter((v) => v.localService && v.lang.toLowerCase().startsWith(language) && !AVOID.test(v.name));
  if (voices.length === 0) return null;
  for (const pattern of PREFERRED) {
    const v = voices.find((x) => pattern.test(x.name));
    if (v) return v;
  }
  return voices.find((v) => v.lang === "en-US") ?? voices[0];
}

if (canSpeak()) {
  // Chrome loads voices late; pick again once they arrive.
  window.speechSynthesis.addEventListener?.("voiceschanged", () => {
    chosen = pickVoice();
  });
}

export function speak(text: string): void {
  if (!canSpeak()) return;
  try {
    const synth = window.speechSynthesis;
    if (chosen === undefined || chosen === null) chosen = pickVoice();
    synth.cancel();
    if (!chosen && language === "bn") return;
    const u = new SpeechSynthesisUtterance(text);
    if (chosen) {
      u.voice = chosen;
      u.lang = chosen.lang;
    }
    u.rate = 0.92;
    u.pitch = 1;
    synth.speak(u);
  } catch {
    // Some browsers throw when speech is blocked; captions still show.
  }
}

export function stopSpeaking(): void {
  if (!canSpeak()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // ignore
  }
}

/** Name of the voice in use, for the settings screen. */
export function voiceName(): string | null {
  if (!canSpeak()) return null;
  if (chosen === undefined || chosen === null) chosen = pickVoice();
  return chosen?.name ?? null;
}

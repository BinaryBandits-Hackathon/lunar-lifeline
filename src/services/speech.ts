// Read-aloud through the browser's built-in voices. Captions always show,
// so the game works without a voice. Read-aloud starts switched off.
//
// Browser voices vary a lot by device. We pick the most natural one we can
// find (Microsoft "Natural"/"Online" voices on Windows and Edge, Google voices
// in Chrome, Apple's Samantha on Mac/iPad) and avoid the robotic defaults.
// The real fix is recorded voice lines; see docs/design/01-opening-sequence.md.

const PREFERRED = [
  /natural/i,
  /online/i,
  /^Google US English$/i,
  /^Google UK English Female$/i,
  /Samantha/i,
  /Ava/i,
  /Aria|Jenny|Libby|Sonia/i,
];
const AVOID = /espeak|robot|whisper|zarvox|bad news|bells|bubbles|cellos|trinoids|organ|albert/i;

let chosen: SpeechSynthesisVoice | null | undefined;

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("en") && !AVOID.test(v.name));
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

// Read-aloud through the browser's built-in voices. Captions are always shown,
// so if the browser has no voice the game still works.

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string): void {
  if (!canSpeak()) return;
  try {
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.pitch = 1.1;
    u.lang = "en-US";
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

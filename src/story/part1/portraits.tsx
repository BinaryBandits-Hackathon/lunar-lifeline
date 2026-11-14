// PART 1 crew portraits, drawn in code like Pip. Owned by Person 1.

/** Tunde, the engineer, in his helmet. */
export function TundeFace() {
  return (
    <svg className="story-p1-face" viewBox="0 0 64 64" role="img" aria-label="Tunde">
      <circle cx="32" cy="32" r="30" fill="#1b2433" stroke="#f5c04a" strokeWidth="2" />
      <circle cx="32" cy="30" r="18" fill="#e9ecf2" />
      <path d="M18 30 A14 12 0 0 1 46 30 L46 33 A14 9 0 0 1 18 33 Z" fill="#c98a1f" />
      <path d="M22 28 A10 8 0 0 1 32 22" fill="none" stroke="#ffe7a8" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 58 Q32 42 50 58" fill="#d7dbe3" />
    </svg>
  );
}

/** Mei, the doctor, in her helmet (blue visor, red cross on the suit). */
export function MeiFace() {
  return (
    <svg className="story-p1-face" viewBox="0 0 64 64" role="img" aria-label="Mei">
      <circle cx="32" cy="32" r="30" fill="#1b2433" stroke="#8fd0ff" strokeWidth="2" />
      <circle cx="32" cy="30" r="18" fill="#e9ecf2" />
      <path d="M18 30 A14 12 0 0 1 46 30 L46 33 A14 9 0 0 1 18 33 Z" fill="#4f78a8" />
      <path d="M22 28 A10 8 0 0 1 32 22" fill="none" stroke="#dff1ff" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 58 Q32 42 50 58" fill="#d7dbe3" />
      <path d="M30 49 h4 v3 h3 v4 h-3 v3 h-4 v-3 h-3 v-4 h3 Z" fill="#d84a3a" />
    </svg>
  );
}

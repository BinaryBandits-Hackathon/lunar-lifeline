import type { Mood } from "../engine/types";

// Placeholder mascot drawn in code. The "screen" form is the ship computer;
// the "rover" form is Pip after landing. Real art replaces this later.
export function Pip({ mood = "calm", form = "screen", size = 72 }: { mood?: Mood; form?: "screen" | "rover"; size?: number }) {
  const mouth =
    mood === "happy" ? "M22 40 Q32 48 42 40" : mood === "alert" ? "M25 43 Q32 38 39 43" : "M24 42 L40 42";
  const eyeH = mood === "alert" ? 7 : 5;
  const face = (
    <g>
      <rect x="8" y="12" width="48" height="38" rx="10" className={`pip-screen pip-${mood}`} />
      <rect x="20" y={27 - eyeH / 2} width="6" height={eyeH} rx="3" className="pip-eye" />
      <rect x="38" y={27 - eyeH / 2} width="6" height={eyeH} rx="3" className="pip-eye" />
      <path d={mouth} className="pip-mouth" />
      <line x1="32" y1="12" x2="32" y2="4" className="pip-antenna" />
      <circle cx="32" cy="4" r="3" className={`pip-light pip-${mood}`} />
    </g>
  );
  if (form === "screen") {
    return (
      <svg viewBox="0 0 64 56" width={size} height={(size * 56) / 64} role="img" aria-label="Pip the mascot">
        {face}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 80" width={size} height={(size * 80) / 64} role="img" aria-label="Pip the rover">
      {face}
      <rect x="6" y="52" width="52" height="12" rx="4" className="pip-body" />
      <circle cx="14" cy="68" r="7" className="pip-wheel" />
      <circle cx="32" cy="68" r="7" className="pip-wheel" />
      <circle cx="50" cy="68" r="7" className="pip-wheel" />
    </svg>
  );
}

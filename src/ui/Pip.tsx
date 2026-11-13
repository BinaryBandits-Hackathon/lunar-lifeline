import type { Mood } from "../engine/types";

// Placeholder mascot drawn in code: a ship-computer display with simple eyes.
// "screen" form in the ship, "rover" form after landing. Real art replaces this later.
export function Pip({ mood = "calm", form = "screen", size = 72 }: { mood?: Mood; form?: "screen" | "rover"; size?: number }) {
  const mouth =
    mood === "happy" ? "M24 38 Q32 43 40 38" : mood === "alert" ? "M26 40 Q32 36 38 40" : "M26 39 H38";
  const eyeH = mood === "alert" ? 9 : mood === "happy" ? 4 : 7;
  const face = (
    <g className={`pip pip-${mood}`}>
      <line x1="32" y1="12" x2="32" y2="5" className="pip-stroke" />
      <circle cx="32" cy="4" r="2.5" className="pip-signal" />
      <rect x="9" y="12" width="46" height="38" rx="7" className="pip-shell" />
      <rect x="14" y="17" width="36" height="28" rx="4" className="pip-glass" />
      <rect x="21" y={29 - eyeH / 2} width="5" height={eyeH} rx="2.5" className="pip-eye" />
      <rect x="38" y={29 - eyeH / 2} width="5" height={eyeH} rx="2.5" className="pip-eye" />
      <path d={mouth} className="pip-mouth" />
    </g>
  );
  if (form === "screen") {
    return (
      <svg viewBox="0 0 64 54" width={size} height={(size * 54) / 64} role="img" aria-label="Pip">
        {face}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 80" width={size} height={(size * 80) / 64} role="img" aria-label="Pip the rover">
      {face}
      <rect x="18" y="50" width="28" height="4" className="pip-neck" />
      <rect x="5" y="54" width="54" height="11" rx="2" className="pip-chassis" />
      {[15, 32, 49].map((x) => (
        <g key={x}>
          <circle cx={x} cy="70" r="7" className="pip-wheel" />
          <circle cx={x} cy="70" r="2" className="pip-hub" />
        </g>
      ))}
    </svg>
  );
}

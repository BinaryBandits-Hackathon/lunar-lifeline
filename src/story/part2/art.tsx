// PART 2 pictures: dustStorm, solarStorm. Owned by Person 2.
// Simple placeholders; replace with the real scenes (inline SVG, 1600×900, no words).
// You may copy shapes from src/ui/SimScene.tsx into this folder (don't edit SimScene.tsx).

const Base = () => (
  <g>
    <rect y="640" width="1600" height="260" fill="#7a3a1c" />
    <rect x="620" y="500" width="360" height="160" rx="70" fill="#d9dee6" />
    <rect x="1040" y="590" width="220" height="16" fill="#2a3446" />
  </g>
);

export const PART2_ART = {
  dustStorm: () => (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <rect width="1600" height="900" fill="#a7653a" />
      <Base />
      <rect width="1600" height="900" fill="#c98a55" opacity="0.45" />
    </svg>
  ),
  solarStorm: () => (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <rect width="1600" height="900" fill="#0a0d1a" />
      <g stroke="#ffd27a" strokeWidth="2" opacity="0.35">
        {Array.from({ length: 24 }, (_, i) => (
          <line key={i} x1={i * 70} y1={0} x2={i * 70 + 220} y2={600} />
        ))}
      </g>
      <Base />
    </svg>
  ),
};

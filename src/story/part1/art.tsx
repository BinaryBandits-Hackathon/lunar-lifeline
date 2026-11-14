// PART 1 pictures: ship, orbit, descent. Owned by Person 1.
// These are simple placeholders; replace them with the real scenes
// (inline SVG, viewBox 0 0 1600 900, no words inside pictures).

const Stars = () => (
  <g fill="#fff" opacity="0.7">
    {Array.from({ length: 60 }, (_, i) => (
      <circle key={i} cx={(i * 263) % 1600} cy={(i * 137) % 900} r={(i % 3) * 0.6 + 0.6} />
    ))}
  </g>
);

export const PART1_ART = {
  ship: () => (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <rect width="1600" height="900" fill="#0b1018" />
      <rect x="300" y="120" width="1000" height="420" rx="60" fill="#02040a" stroke="#2a3446" strokeWidth="12" />
      <Stars />
      <circle cx="800" cy="620" r="320" fill="#b4532a" />
      <rect y="600" width="1600" height="300" fill="#141a24" />
    </svg>
  ),
  orbit: () => (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <rect width="1600" height="900" fill="#02040a" />
      <Stars />
      <circle cx="800" cy="1500" r="900" fill="#b4532a" />
      <rect x="720" y="300" width="160" height="60" rx="12" fill="#cfd6e2" />
    </svg>
  ),
  descent: () => (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <rect width="1600" height="900" fill="#e0a77a" />
      <rect y="700" width="1600" height="200" fill="#9a4a24" />
      <circle cx="800" cy="400" r="70" fill="#ff8a3d" opacity="0.8" />
    </svg>
  ),
};

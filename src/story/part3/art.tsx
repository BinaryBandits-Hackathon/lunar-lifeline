// PART 3 pictures: launch, home, stranded. Owned by Person 3.
// Simple placeholders; replace with the real scenes (inline SVG, 1600×900, no words).

const Rocket = ({ y = 360 }: { y?: number }) => (
  <g transform={`translate(760 ${y})`}>
    <rect x="0" y="40" width="80" height="260" rx="20" fill="#e8ecf2" />
    <path d="M0 60 L40 0 L80 60 Z" fill="#c8321f" />
  </g>
);

export const PART3_ART = {
  launch: () => (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <rect width="1600" height="900" fill="#d9a47c" />
      <rect y="660" width="1600" height="240" fill="#8a4122" />
      <Rocket />
    </svg>
  ),
  home: () => (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <rect width="1600" height="900" fill="#e6b1a0" />
      <circle cx="1300" cy="160" r="10" fill="#6fb4ff" />
      <Rocket y={120} />
    </svg>
  ),
  stranded: () => (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <rect width="1600" height="900" fill="#2c3a5c" />
      <circle cx="800" cy="640" r="40" fill="#9fd0ff" />
      <rect y="660" width="1600" height="240" fill="#4a2414" />
      <Rocket />
    </svg>
  ),
};

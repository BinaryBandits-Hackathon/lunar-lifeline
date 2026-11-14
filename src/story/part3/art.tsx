// PART 3 pictures: launch, home, stranded. Owned by Person 3.
// Inline SVG, 1600×900, no words inside pictures. Motion uses CSS classes
// (story-p3-*) that part3.css switches off when Reduce motion is on.

/** Rolling Mars ground with a few rocks. `tint` darkens it for dusk. */
function Ground({ tint = 0 }: { tint?: number }) {
  return (
    <g>
      <path d="M0 640 C 260 610 420 660 640 630 S 1060 600 1260 640 S 1520 650 1600 630 L1600 900 L0 900 Z" fill="url(#p3-ground)" />
      <path d="M0 720 C 300 700 520 740 860 712 S 1380 700 1600 724 L1600 900 L0 900 Z" fill="#000" opacity={0.18 + tint} />
      {[
        [180, 760, 34], [420, 812, 22], [1180, 790, 40], [1420, 742, 18], [980, 840, 26], [90, 850, 20],
      ].map(([x, y, r]) => (
        <g key={`${x}-${y}`}>
          <ellipse cx={x} cy={y + r * 0.45} rx={r * 1.25} ry={r * 0.28} fill="#000" opacity="0.28" />
          <path d={`M${x - r} ${y + r * 0.4} Q ${x - r * 0.6} ${y - r * 0.6} ${x} ${y - r * 0.5} Q ${x + r * 0.8} ${y - r * 0.3} ${x + r} ${y + r * 0.4} Z`} fill="#5c2a16" />
          <path d={`M${x - r * 0.5} ${y - r * 0.2} Q ${x} ${y - r * 0.6} ${x + r * 0.5} ${y - r * 0.1}`} stroke="#a2593a" strokeWidth="3" fill="none" opacity="0.6" />
        </g>
      ))}
    </g>
  );
}

/** The return rocket. `x`, `y` = base of the rocket. */
function Rocket({ x, y, scale = 1, lit = true }: { x: number; y: number; scale?: number; lit?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* body */}
      <rect x="-42" y="-420" width="84" height="380" rx="14" fill="url(#p3-hull)" />
      <rect x="-42" y="-300" width="84" height="14" fill="#2a3446" opacity="0.5" />
      <rect x="-42" y="-160" width="84" height="10" fill="#2a3446" opacity="0.5" />
      {/* nose */}
      <path d="M-42 -418 Q 0 -540 42 -418 Z" fill="#d9dee6" />
      <path d="M-14 -470 Q 0 -520 14 -470 Z" fill="#c4521f" />
      {/* window */}
      <circle cx="0" cy="-360" r="16" fill="#0e1626" stroke="#8a95a8" strokeWidth="4" />
      {lit && <circle cx="-4" cy="-364" r="6" fill="#ffd27a" opacity="0.8" />}
      {/* fins */}
      <path d="M-42 -110 L-92 -10 L-92 30 L-42 -30 Z" fill="#b0402a" />
      <path d="M42 -110 L92 -10 L92 30 L42 -30 Z" fill="#8f3320" />
      {/* engine bell */}
      <path d="M-30 -40 L-40 0 L40 0 L30 -40 Z" fill="#3a3f4a" />
    </g>
  );
}

/** Launch tower and fuel hose beside the rocket. */
function Tower({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke="#4a5262" strokeWidth="6" fill="none">
      <line x1="0" y1="0" x2="0" y2="-470" />
      <line x1="60" y1="0" x2="60" y2="-470" />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1="0" y1={-i * 52} x2="60" y2={-(i + 1) * 52} strokeWidth="3" />
      ))}
      <line x1="60" y1="-340" x2="118" y2="-340" strokeWidth="8" />
    </g>
  );
}

/** The crew's small habitat dome with a lit window. */
function Habitat({ x, y, night = false }: { x: number; y: number; night?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="8" rx="190" ry="20" fill="#000" opacity="0.3" />
      <path d="M-170 0 Q -170 -150 0 -150 Q 170 -150 170 0 Z" fill={night ? "#7d8696" : "#d6dbe3"} />
      <path d="M-170 0 Q -170 -150 0 -150" stroke="#ffffff" strokeWidth="4" fill="none" opacity={night ? 0.15 : 0.5} />
      <rect x="-40" y="-70" width="80" height="34" rx="8" fill={night ? "#ffcf7a" : "#1a2333"} opacity={night ? 0.95 : 1} />
      {night && <ellipse cx="0" cy="-40" rx="140" ry="50" fill="#ffb347" opacity="0.08" />}
    </g>
  );
}

function Defs() {
  return (
    <defs>
      <linearGradient id="p3-ground" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#a85a33" />
        <stop offset="1" stopColor="#5a2914" />
      </linearGradient>
      <linearGradient id="p3-hull" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#9aa3b2" />
        <stop offset="0.45" stopColor="#f2f4f8" />
        <stop offset="1" stopColor="#a8b0bd" />
      </linearGradient>
      <linearGradient id="p3-day" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c9935f" />
        <stop offset="0.7" stopColor="#e2b58a" />
        <stop offset="1" stopColor="#ecc9a3" />
      </linearGradient>
      <linearGradient id="p3-dusk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0b1020" />
        <stop offset="0.55" stopColor="#2b3550" />
        <stop offset="0.8" stopColor="#6d6f7a" />
        <stop offset="1" stopColor="#8a7466" />
      </linearGradient>
      <radialGradient id="p3-blue-sun" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#e9f5ff" />
        <stop offset="0.25" stopColor="#9fcfff" stopOpacity="0.9" />
        <stop offset="1" stopColor="#4a7cc0" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="p3-flame" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff6d6" />
        <stop offset="0.35" stopColor="#ffc24a" />
        <stop offset="1" stopColor="#ff5a1f" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="p3-earth" cx="0.4" cy="0.4" r="0.6">
        <stop offset="0" stopColor="#bfe3ff" />
        <stop offset="1" stopColor="#3a7bd5" />
      </radialGradient>
    </defs>
  );
}

const Stars = ({ n = 70, opacity = 0.8 }: { n?: number; opacity?: number }) => (
  <g fill="#fff" opacity={opacity}>
    {Array.from({ length: n }, (_, i) => (
      <circle key={i} cx={(i * 263 + 41) % 1600} cy={(i * 131 + 17) % 520} r={(i % 3) * 0.55 + 0.6} />
    ))}
  </g>
);

export const PART3_ART = {
  /** Launch day: the rocket on the pad beside the habitat, fuel hose attached. */
  launch: () => (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <Defs />
      <rect width="1600" height="900" fill="url(#p3-day)" />
      <circle cx="1270" cy="170" r="34" fill="#fff4e0" opacity="0.85" />
      <path d="M0 600 C 300 560 520 590 760 570 S 1250 540 1600 580 L1600 680 L0 680 Z" fill="#b97a52" opacity="0.6" />
      <Ground />
      <Habitat x={360} y={668} />
      <rect x="690" y="650" width="240" height="22" fill="#3a3f4a" />
      <Tower x={890} y={652} />
      <Rocket x={810} y={650} />
      {/* fuel hose from the habitat to the rocket */}
      <path d="M520 650 C 620 690 700 690 770 640" stroke="#2a3446" strokeWidth="10" fill="none" />
      <path d="M520 650 C 620 690 700 690 770 640" stroke="#c4521f" strokeWidth="3" fill="none" strokeDasharray="12 18" className="story-p3-fuelflow" />
    </svg>
  ),

  /** Success: the rocket climbing, Earth a small blue dot. */
  home: () => (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <Defs />
      <rect width="1600" height="900" fill="#2a1d2b" />
      <rect width="1600" height="900" fill="url(#p3-day)" opacity="0.55" />
      <Stars n={40} opacity={0.5} />
      <circle cx="1310" cy="150" r="12" fill="url(#p3-earth)" />
      <circle cx="1310" cy="150" r="24" fill="#6fb4ff" opacity="0.15" />
      <Ground />
      <Habitat x={300} y={700} />
      <Tower x={860} y={690} />
      {/* smoke column */}
      <path d="M790 690 C 760 560 840 470 800 330 L 830 330 C 870 470 790 560 840 690 Z" fill="#e8ddd2" opacity="0.55" className="story-p3-smoke" />
      <g className="story-p3-rise">
        <path d="M774 300 Q 800 470 826 300 Z" fill="url(#p3-flame)" className="story-p3-flame" />
        <Rocket x={800} y={300} scale={0.6} />
      </g>
    </svg>
  ),

  /** Fail: the rocket still on the pad at dusk, under a blue Mars sunset. */
  stranded: () => (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <Defs />
      <rect width="1600" height="900" fill="url(#p3-dusk)" />
      <Stars n={60} opacity={0.6} />
      <circle cx="560" cy="610" r="150" fill="url(#p3-blue-sun)" />
      <circle cx="560" cy="610" r="16" fill="#eef8ff" />
      <Ground tint={0.25} />
      <Habitat x={1180} y={680} night />
      <rect x="690" y="650" width="240" height="22" fill="#1d212a" />
      <Tower x={890} y={652} />
      <Rocket x={810} y={650} lit={false} />
      <rect width="1600" height="900" fill="#0b1020" opacity="0.18" />
    </svg>
  ),
};

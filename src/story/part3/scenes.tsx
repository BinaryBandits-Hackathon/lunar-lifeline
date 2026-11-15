// PART 3 scenes by Tijul: launch day (reacts to decisions 11 and 12), home and stranded.
// Inline SVG, 1600×900, no words inside pictures (master story, section 10).
// Moving parts use story-p3-anim-* classes; part3.css stops them with Reduce motion.
// The launch scene reacts to the story so far (rock boxes, night, ignition),
// but never hints whether a choice was good or bad.

import type { Choice } from "../types";

/** What the launch scene shows, from the choices made so far. */
export interface LaunchState {
  /** Decision 11 made: "A" = boxes left on the ground, "B" = boxes loaded. */
  rocks: Choice | null;
  /** Decision 12 made: "A" = launch now, "B" = waited one more night. */
  launch: Choice | null;
}

const FAR = "#7d3c22";
const MID = "#93492a";

/** Shared gradients and filters. IDs start with p3- so they never clash with other parts. */
function Defs() {
  return (
    <defs>
      <linearGradient id="p3-sky-day" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8c5a3c" />
        <stop offset="0.55" stopColor="#c88d61" />
        <stop offset="1" stopColor="#e3b48a" />
      </linearGradient>
      <linearGradient id="p3-sky-night" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#05070f" />
        <stop offset="0.6" stopColor="#141a2e" />
        <stop offset="1" stopColor="#3a2e34" />
      </linearGradient>
      <linearGradient id="p3-sky-dusk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#070a16" />
        <stop offset="0.5" stopColor="#1e2944" />
        <stop offset="0.78" stopColor="#4f5f7c" />
        <stop offset="1" stopColor="#8b7a6e" />
      </linearGradient>
      <linearGradient id="p3-ground" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#a65a34" />
        <stop offset="1" stopColor="#4a2312" />
      </linearGradient>
      <linearGradient id="p3-hull" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#7f8898" />
        <stop offset="0.35" stopColor="#e9edf3" />
        <stop offset="0.6" stopColor="#c9cfd9" />
        <stop offset="1" stopColor="#6d7585" />
      </linearGradient>
      <linearGradient id="p3-dome" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e6eaf0" />
        <stop offset="1" stopColor="#9aa2b0" />
      </linearGradient>
      <linearGradient id="p3-flame" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.25" stopColor="#ffe08a" />
        <stop offset="0.6" stopColor="#ff8a3d" />
        <stop offset="1" stopColor="#ff4a1f" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="p3-glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#ffd27a" stopOpacity="0.9" />
        <stop offset="1" stopColor="#ff8a3d" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="p3-blue-sun" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#f2fbff" />
        <stop offset="0.18" stopColor="#bfe2ff" stopOpacity="0.95" />
        <stop offset="0.55" stopColor="#6a9fd8" stopOpacity="0.35" />
        <stop offset="1" stopColor="#3b5f99" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="p3-earth" cx="0.35" cy="0.35" r="0.7">
        <stop offset="0" stopColor="#d6efff" />
        <stop offset="0.5" stopColor="#5aa2ee" />
        <stop offset="1" stopColor="#1d4f9a" />
      </radialGradient>
      <radialGradient id="p3-window" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#ffe3a3" />
        <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
      </radialGradient>
      {/* Fine grain so the ground reads as rock and dust, not flat colour. */}
      <filter id="p3-grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
        <feComposite in2="SourceGraphic" operator="in" />
      </filter>
      <filter id="p3-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" />
      </filter>
    </defs>
  );
}

function Stars({ n = 80, twinkle = false }: { n?: number; twinkle?: boolean }) {
  return (
    <g fill="#fff">
      {Array.from({ length: n }, (_, i) => (
        <circle
          key={i}
          cx={(i * 263 + 41) % 1600}
          cy={(i * 131 + 17) % 470}
          r={(i % 4) * 0.45 + 0.5}
          opacity={0.35 + (i % 5) * 0.12}
          className={twinkle && i % 3 === 0 ? "story-p3-anim-twinkle" : undefined}
          style={twinkle ? { animationDelay: `${(i % 7) * 0.6}s` } : undefined}
        />
      ))}
    </g>
  );
}

/** Three layers of hills and ground, with texture, rocks and a few footprints. */
function Land({ dark = 0 }: { dark?: number }) {
  return (
    <g>
      <path d="M0 560 L120 520 L260 548 L380 500 L520 540 L700 515 L880 548 L1040 505 L1200 536 L1360 498 L1500 530 L1600 512 L1600 640 L0 640 Z" fill={FAR} opacity="0.75" />
      <path d="M0 600 C 200 570 360 610 560 588 S 980 560 1180 596 S 1480 600 1600 580 L1600 700 L0 700 Z" fill={MID} />
      <path d="M0 650 C 260 620 420 668 640 640 S 1060 612 1260 652 S 1520 660 1600 640 L1600 900 L0 900 Z" fill="url(#p3-ground)" />
      <rect y="620" width="1600" height="280" filter="url(#p3-grain)" fill="#000" opacity="0.9" />
      {/* footprints from the base to the rocket */}
      <g fill="#3a1a0c" opacity="0.55">
        {Array.from({ length: 9 }, (_, i) => (
          <ellipse key={i} cx={540 + i * 26} cy={710 + (i % 2) * 8} rx="6" ry="3" />
        ))}
      </g>
      {[
        [170, 770, 34], [420, 820, 22], [1190, 800, 40], [1430, 752, 18], [1000, 850, 26], [80, 860, 20], [1310, 860, 30],
      ].map(([x, y, r]) => (
        <g key={`${x}-${y}`}>
          <ellipse cx={x + r * 0.5} cy={y + r * 0.45} rx={r * 1.4} ry={r * 0.28} fill="#000" opacity="0.32" />
          <path d={`M${x - r} ${y + r * 0.4} Q ${x - r * 0.6} ${y - r * 0.7} ${x} ${y - r * 0.55} Q ${x + r * 0.85} ${y - r * 0.3} ${x + r} ${y + r * 0.4} Z`} fill="#5c2a16" />
          <path d={`M${x - r * 0.55} ${y - r * 0.25} Q ${x - r * 0.1} ${y - r * 0.62} ${x + r * 0.45} ${y - r * 0.15}`} stroke="#b0633f" strokeWidth="3" fill="none" opacity="0.55" />
        </g>
      ))}
      {dark > 0 && <rect width="1600" height="900" fill="#05070f" opacity={dark} />}
    </g>
  );
}

/** The crew habitat: dome, airlock, solar panels and a lit window. */
function Habitat({ x, y, night = false }: { x: number; y: number; night?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="20" cy="10" rx="230" ry="22" fill="#000" opacity="0.35" />
      {/* solar panels */}
      <g transform="translate(-300 -40)">
        <line x1="40" y1="40" x2="40" y2="0" stroke="#3a3f4a" strokeWidth="5" />
        <path d="M-10 -6 L95 -24 L110 6 L5 24 Z" fill="#1d2b4a" stroke="#4b5d84" strokeWidth="2" />
        <path d="M18 -11 L33 19 M48 -16 L63 14 M78 -21 L93 9" stroke="#4b5d84" strokeWidth="1.5" />
      </g>
      {/* airlock */}
      <rect x="150" y="-60" width="70" height="60" rx="10" fill="#b8bfca" />
      <rect x="170" y="-48" width="30" height="48" rx="6" fill="#4a5262" />
      {/* dome */}
      <path d="M-170 0 Q -170 -160 0 -160 Q 170 -160 170 0 Z" fill="url(#p3-dome)" />
      <path d="M-120 -112 Q 0 -168 120 -112" stroke="#ffffff" strokeWidth="4" fill="none" opacity="0.35" />
      <path d="M-170 0 L170 0" stroke="#6d7585" strokeWidth="4" />
      {/* window */}
      <rect x="-46" y="-78" width="92" height="36" rx="10" fill={night ? "#ffcf7a" : "#141b2a"} />
      {night && <circle cx="0" cy="-60" r="120" fill="url(#p3-window)" opacity="0.35" className="story-p3-anim-flicker-soft" />}
      {/* antenna with a red beacon */}
      <line x1="90" y1="-130" x2="110" y2="-210" stroke="#8a93a3" strokeWidth="4" />
      <circle cx="110" cy="-214" r="6" fill="#ff5a3d" className="story-p3-anim-beacon" />
    </g>
  );
}

/** The return rocket. (x, y) is the base of the engine. */
function Rocket({ x, y, scale = 1, cabinLit = true, hatchOpen = false }: { x: number; y: number; scale?: number; cabinLit?: boolean; hatchOpen?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* landing legs */}
      <path d="M-40 -60 L-96 6 M40 -60 L96 6" stroke="#4a5262" strokeWidth="9" />
      <path d="M-110 6 L-82 6 M82 6 L110 6" stroke="#2a3040" strokeWidth="8" />
      {/* body */}
      <rect x="-44" y="-430" width="88" height="390" rx="14" fill="url(#p3-hull)" />
      {[-360, -280, -200, -120].map((yy) => (
        <line key={yy} x1="-44" y1={yy} x2="44" y2={yy} stroke="#5d6576" strokeWidth="2" opacity="0.7" />
      ))}
      <line x1="0" y1="-430" x2="0" y2="-40" stroke="#5d6576" strokeWidth="1.5" opacity="0.35" />
      {/* Mars-orange stripe, the one accent */}
      <rect x="-44" y="-250" width="88" height="16" fill="#c4521f" />
      {/* cargo hatch (rock boxes go here) */}
      <rect x="-26" y="-190" width="52" height="46" rx="4" fill={hatchOpen ? "#141b2a" : "#aeb5c2"} stroke="#5d6576" strokeWidth="2" />
      {/* nose and cabin window */}
      <path d="M-44 -428 Q 0 -560 44 -428 Z" fill="url(#p3-hull)" />
      <circle cx="0" cy="-372" r="17" fill="#0e1626" stroke="#8a95a8" strokeWidth="4" />
      {cabinLit && <circle cx="-5" cy="-377" r="6" fill="#ffd27a" opacity="0.85" />}
      {/* RCS thrusters */}
      <rect x="-52" y="-410" width="8" height="18" fill="#3a3f4a" />
      <rect x="44" y="-410" width="8" height="18" fill="#3a3f4a" />
      {/* fins */}
      <path d="M-44 -120 L-98 -20 L-98 18 L-44 -36 Z" fill="#a33b24" />
      <path d="M44 -120 L98 -20 L98 18 L44 -36 Z" fill="#7d2c1b" />
      {/* engine bell */}
      <path d="M-30 -44 L-42 0 L42 0 L30 -44 Z" fill="#2f3440" />
      <path d="M-30 -44 L30 -44" stroke="#8a93a3" strokeWidth="3" />
    </g>
  );
}

/** Launch tower with a fuel arm and a blinking light on top. */
function Tower({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g stroke="#454d5d" strokeWidth="6" fill="none">
        <line x1="0" y1="0" x2="0" y2="-500" />
        <line x1="60" y1="0" x2="60" y2="-500" />
        {Array.from({ length: 10 }, (_, i) => (
          <line key={i} x1="0" y1={-i * 50} x2="60" y2={-(i + 1) * 50} strokeWidth="3" />
        ))}
      </g>
      <rect x="-60" y="-350" width="120" height="10" fill="#454d5d" />
      <circle cx="30" cy="-510" r="6" fill="#ff5a3d" className="story-p3-anim-beacon" style={{ animationDelay: "0.7s" }} />
    </g>
  );
}

/** Rock sample boxes. */
function Boxes({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="50" cy="6" rx="80" ry="10" fill="#000" opacity="0.35" />
      {[
        [0, -34], [52, -34], [26, -66],
      ].map(([bx, by]) => (
        <g key={`${bx}-${by}`} transform={`translate(${bx} ${by})`}>
          <rect width="48" height="34" rx="3" fill="#cfd5de" stroke="#6d7585" strokeWidth="2" />
          <rect x="18" y="12" width="12" height="8" fill="#c4521f" />
        </g>
      ))}
    </g>
  );
}

/** Launch day. Reacts to decisions 11 and 12 without judging them. */
export function LaunchScene({ rocks, launch }: LaunchState) {
  const night = launch === "B";
  const igniting = launch !== null;
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <Defs />
      <rect width="1600" height="900" fill={night ? "url(#p3-sky-night)" : "url(#p3-sky-day)"} />
      {night ? <Stars n={90} twinkle /> : <circle cx="1280" cy="170" r="30" fill="#fff4e0" opacity="0.8" />}
      <rect y="380" width="1600" height="260" fill="#e7b48b" opacity={night ? 0.05 : 0.25} filter="url(#p3-blur)" />
      <Land dark={night ? 0.45 : 0} />
      <Habitat x={360} y={672} night={night} />
      <rect x="690" y="654" width="250" height="22" fill="#2f3440" />
      <Tower x={900} y={656} />
      {/* fuel line from the base to the rocket, with fuel moving through it */}
      <path d="M560 668 C 640 712 720 712 780 652" stroke="#252b38" strokeWidth="12" fill="none" />
      {!igniting && <path d="M560 668 C 640 712 720 712 780 652" stroke="#c4521f" strokeWidth="3" fill="none" strokeDasharray="12 18" className="story-p3-anim-fuelflow" />}
      <Rocket x={815} y={654} hatchOpen={rocks === null} cabinLit />
      {/* boxes: by the rocket until decision 11; left on the ground for 11A; loaded (gone) for 11B */}
      {rocks === null && <Boxes x={985} y={654} />}
      {rocks === "A" && <Boxes x={1120} y={640} />}
      {/* venting gas before launch */}
      {!igniting && (
        <g fill="#f4ede6">
          <circle cx="760" cy="420" r="14" className="story-p3-anim-vent" />
          <circle cx="760" cy="420" r="10" className="story-p3-anim-vent" style={{ animationDelay: "1.1s" }} />
        </g>
      )}
      {/* ignition: engine glow and a cloud of dust at the base */}
      {igniting && (
        <g>
          <circle cx="815" cy="680" r="160" fill="url(#p3-glow)" className="story-p3-anim-flicker" />
          <path d="M790 654 Q 815 760 840 654 Z" fill="url(#p3-flame)" className="story-p3-anim-flame" />
          <ellipse cx="815" cy="690" rx="260" ry="46" fill="#e8d6c4" opacity="0.6" className="story-p3-anim-dust" />
        </g>
      )}
    </svg>
  );
}

/** Success: the rocket climbing toward a tiny blue Earth. */
export function HomeScene() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <Defs />
      <rect width="1600" height="900" fill="url(#p3-sky-night)" />
      <rect width="1600" height="900" fill="url(#p3-sky-day)" opacity="0.45" />
      <Stars n={60} twinkle />
      <g transform="translate(1320 140)">
        <circle r="34" fill="#6fb4ff" opacity="0.12" />
        <circle r="13" fill="url(#p3-earth)" />
      </g>
      <Land dark={0.15} />
      <Habitat x={300} y={712} />
      <Tower x={880} y={700} />
      {/* expanding smoke column from the pad */}
      <g className="story-p3-anim-smoke" fill="#e9dfd4">
        <ellipse cx="830" cy="690" rx="260" ry="50" opacity="0.55" />
        <ellipse cx="820" cy="600" rx="90" ry="140" opacity="0.4" />
        <ellipse cx="810" cy="430" rx="50" ry="130" opacity="0.3" />
      </g>
      <g className="story-p3-anim-rise">
        <circle cx="815" cy="300" r="120" fill="url(#p3-glow)" className="story-p3-anim-flicker" />
        <path d="M790 296 Q 815 470 840 296 Z" fill="url(#p3-flame)" className="story-p3-anim-flame" />
        <Rocket x={815} y={300} scale={0.62} />
      </g>
    </svg>
  );
}

/** Fail: the rocket still on the pad as a blue sun sets behind the hills. */
export function StrandedScene() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <Defs />
      <rect width="1600" height="900" fill="url(#p3-sky-dusk)" />
      <Stars n={70} twinkle />
      <g className="story-p3-anim-sunset">
        <circle cx="560" cy="560" r="200" fill="url(#p3-blue-sun)" />
        <circle cx="560" cy="560" r="17" fill="#f2fbff" />
      </g>
      <Land dark={0.38} />
      {/* dust drifting slowly across the ground */}
      <ellipse cx="300" cy="700" rx="320" ry="26" fill="#8b7a6e" opacity="0.25" className="story-p3-anim-drift" />
      <Habitat x={1190} y={688} night />
      <rect x="690" y="654" width="250" height="22" fill="#171b24" />
      <Tower x={900} y={656} />
      <Rocket x={815} y={654} cabinLit={false} />
      <rect width="1600" height="900" fill="#070a16" opacity="0.15" />
    </svg>
  );
}

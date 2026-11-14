// PART 1 pictures. Owned by Person 1.
// Inline SVG, viewBox 0 0 1600 900, dark and realistic, Mars orange as the
// one accent, no words inside pictures. Anything that moves carries a
// story-p1-anim-* class, which part1.css switches off for reduce motion.

import type { ReactNode } from "react";
import type { Part1ArtKey } from "./content";

/** Deterministic star field so the sky never jumps between renders. */
function Stars({ n = 90, seed = 7, maxY = 900 }: { n?: number; seed?: number; maxY?: number }) {
  let s = seed;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  return (
    <g className="story-p1-stars">
      {Array.from({ length: n }, (_, i) => {
        const r = rnd() < 0.12 ? 1.9 : rnd() * 0.9 + 0.5;
        return <circle key={i} cx={rnd() * 1600} cy={rnd() * maxY} r={r} fill="#fff" opacity={0.35 + rnd() * 0.6} className={i % 9 === 0 ? "story-p1-anim-twinkle" : undefined} />;
      })}
    </g>
  );
}

/** Mars as a lit globe: surface, dark regions, polar cap, night side and air glow. */
function MarsGlobe({ cx, cy, r, id }: { cx: number; cy: number; r: number; id: string }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${id}-face`} cx="0.6" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#f0a26f" />
          <stop offset="0.45" stopColor="#c8642f" />
          <stop offset="0.8" stopColor="#8e3a17" />
          <stop offset="1" stopColor="#4a1a08" />
        </radialGradient>
        <radialGradient id={`${id}-night`} cx="0.75" cy="0.15" r="1">
          <stop offset="0.45" stopColor="#02040a" stopOpacity="0" />
          <stop offset="0.85" stopColor="#02040a" stopOpacity="0.75" />
          <stop offset="1" stopColor="#02040a" stopOpacity="0.95" />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <filter id={`${id}-blur`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={r * 0.012} />
        </filter>
      </defs>
      <circle cx={cx} cy={cy} r={r + r * 0.03} fill="#ff8a4a" opacity="0.18" filter={`url(#${id}-blur)`} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-face)`} />
      <g clipPath={`url(#${id}-clip)`}>
        <g filter={`url(#${id}-blur)`}>
          <ellipse cx={cx - r * 0.35} cy={cy - r * 0.55} rx={r * 0.28} ry={r * 0.07} fill="#5a200b" opacity="0.55" />
          <ellipse cx={cx + r * 0.2} cy={cy - r * 0.4} rx={r * 0.36} ry={r * 0.05} fill="#5a200b" opacity="0.45" />
          <ellipse cx={cx - r * 0.05} cy={cy - r * 0.7} rx={r * 0.2} ry={r * 0.06} fill="#6b2a10" opacity="0.4" />
          <ellipse cx={cx + r * 0.45} cy={cy - r * 0.62} rx={r * 0.12} ry={r * 0.05} fill="#ffcfa6" opacity="0.25" />
          <ellipse cx={cx - r * 0.55} cy={cy - r * 0.25} rx={r * 0.16} ry={r * 0.09} fill="#4a1a08" opacity="0.5" />
          <ellipse cx={cx + r * 0.1} cy={cy - r * 0.985} rx={r * 0.16} ry={r * 0.035} fill="#fff4ea" opacity="0.6" />
        </g>
        <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-night)`} />
      </g>
    </g>
  );
}

/** The crew capsule: a blunt cone with a heat shield underneath. */
function Capsule({ shield = true }: { shield?: boolean }) {
  return (
    <g>
      <path d="M-46 30 L-28 -44 Q0 -58 28 -44 L46 30 Z" fill="#d5d9e0" stroke="#7b828e" strokeWidth="3" />
      <path d="M-46 30 L-28 -44 Q-14 -50 -6 -51 L-18 30 Z" fill="#fff" opacity="0.35" />
      <rect x="-10" y="-30" width="20" height="16" rx="4" fill="#1f2633" />
      {shield && <path d="M-56 30 Q0 58 56 30 L50 40 Q0 64 -50 40 Z" fill="#5a3a26" stroke="#2a1a10" strokeWidth="2" />}
    </g>
  );
}

const CRACKS = [
  "1185,215 1120,170 1080,160",
  "1185,215 1250,150 1290,138",
  "1185,215 1270,240 1330,232",
  "1185,215 1220,300 1212,360",
  "1185,215 1130,270 1070,300",
  "1185,215 1160,140",
  "1120,170 1110,120",
  "1270,240 1300,290",
];

function ShipInterior({ hit }: { hit: boolean }) {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="p1-cabin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d1420" />
          <stop offset="1" stopColor="#05080e" />
        </linearGradient>
        <linearGradient id="p1-console" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b2433" />
          <stop offset="1" stopColor="#0a0e15" />
        </linearGradient>
        <linearGradient id="p1-glare" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="p1-marslight" cx="0.5" cy="1" r="0.8">
          <stop offset="0" stopColor="#ff8a4a" stopOpacity="0.28" />
          <stop offset="1" stopColor="#ff8a4a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="p1-redlight" cx="0.5" cy="0" r="0.9">
          <stop offset="0" stopColor="#ff2a1a" stopOpacity="0.4" />
          <stop offset="1" stopColor="#ff2a1a" stopOpacity="0" />
        </radialGradient>
        <clipPath id="p1-window">
          <rect x="230" y="110" width="1140" height="450" rx="80" />
        </clipPath>
      </defs>

      <g className={hit ? "story-p1-anim-shake" : undefined}>
        {/* cabin walls and ceiling panels */}
        <rect width="1600" height="900" fill="url(#p1-cabin)" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
          <rect key={n} x={n * 200 + 8} y="14" width="184" height="70" rx="6" fill="none" stroke="#1d2738" strokeWidth="2" />
        ))}
        <path d="M0 110 L180 150 L180 640 L0 700 Z M1600 110 L1420 150 L1420 640 L1600 700 Z" fill="#0a0f18" stroke="#1d2738" strokeWidth="2" />
        {[230, 330, 430, 530].map((y) => (
          <g key={y}>
            <line x1="20" y1={y} x2="160" y2={y + 12} stroke="#1d2738" strokeWidth="2" />
            <line x1="1580" y1={y} x2="1440" y2={y + 12} stroke="#1d2738" strokeWidth="2" />
          </g>
        ))}

        {/* the big window: space and Mars */}
        <g clipPath="url(#p1-window)">
          <rect x="230" y="110" width="1140" height="450" fill="#02040a" />
          <Stars n={70} seed={11} maxY={560} />
          <MarsGlobe cx={800} cy={1060} r={640} id="p1-shipmars" />
          <rect x="230" y="110" width="1140" height="450" fill="url(#p1-glare)" />
        </g>
        <rect x="230" y="110" width="1140" height="450" rx="80" fill="none" stroke="#2c3749" strokeWidth="22" />
        <rect x="230" y="110" width="1140" height="450" rx="80" fill="none" stroke="#56627a" strokeWidth="2" />
        <line x1="610" y1="112" x2="610" y2="558" stroke="#2c3749" strokeWidth="12" />
        <line x1="990" y1="112" x2="990" y2="558" stroke="#2c3749" strokeWidth="12" />

        {/* Mars light spilling into the cabin */}
        <rect y="480" width="1600" height="420" fill="url(#p1-marslight)" />

        {/* crew seen from behind: Mei (left) and Tunde (right) */}
        {[540, 1060].map((x) => (
          <g key={x}>
            <rect x={x - 70} y="660" width="140" height="140" rx="30" fill="#141b27" />
            <circle cx={x} cy="640" r="56" fill="#1a2230" />
            <path d={`M${x - 52} 622 A56 56 0 0 1 ${x + 52} 622`} fill="none" stroke="#ff8a4a" strokeWidth="4" opacity="0.55" />
          </g>
        ))}

        {/* control console */}
        <path d="M0 720 L260 650 L1340 650 L1600 720 L1600 900 L0 900 Z" fill="url(#p1-console)" stroke="#2c3749" strokeWidth="2" />
        <path d="M260 650 L1340 650" stroke="#56627a" strokeWidth="2" />
        {[330, 700, 1070].map((x, n) => (
          <g key={x}>
            <rect x={x} y="690" width="200" height="90" rx="6" fill="#070b12" stroke="#2c3749" strokeWidth="2" />
            <polyline
              points={Array.from({ length: 9 }, (_, j) => `${x + 14 + j * 21},${750 - ((j * (n + 3) * 7) % 34)}`).join(" ")}
              fill="none"
              stroke={hit && n === 1 ? "#ff3b30" : "#ff8a4a"}
              strokeWidth="2.5"
              opacity="0.8"
            />
            <line x1={x + 14} y1="762" x2={x + 186} y2="762" stroke="#2c3749" strokeWidth="2" />
          </g>
        ))}
        {Array.from({ length: 22 }, (_, n) => (
          <rect key={n} x={300 + n * 46} y="808" width="30" height="14" rx="3" fill={n % 5 === 2 ? "#ff8a4a" : "#2a3446"} opacity={n % 5 === 2 ? 0.9 : 1} />
        ))}

        {hit && (
          <>
            {/* the meteoroid strike: a star of cracks in the glass */}
            <g stroke="#e9f2ff" strokeLinecap="round" fill="none" opacity="0.9">
              <circle cx="1185" cy="215" r="6" fill="#e9f2ff" stroke="none" />
              {CRACKS.map((p) => (
                <polyline key={p} points={p} strokeWidth="2.2" />
              ))}
              <path d="M1150 185 Q1185 175 1215 190 Q1225 225 1200 248 Q1165 255 1150 232 Z" strokeWidth="1.4" opacity="0.6" />
            </g>
            {/* red warning beacon over the window and its light */}
            <rect width="1600" height="900" fill="url(#p1-redlight)" className="story-p1-anim-alarm" />
            <g className="story-p1-anim-alarm">
              <rect x="770" y="90" width="60" height="18" rx="4" fill="#2c3749" />
              <circle cx="800" cy="84" r="16" fill="#ff3b30" />
              <circle cx="800" cy="84" r="34" fill="#ff3b30" opacity="0.25" />
            </g>
            {/* tiny bits of debris drifting past */}
            <g fill="#c9d2e0">
              <rect x="1240" y="300" width="5" height="3" transform="rotate(30 1240 300)" />
              <rect x="1310" y="270" width="4" height="4" />
              <rect x="1160" y="330" width="3" height="6" />
            </g>
          </>
        )}
      </g>
    </svg>
  );
}

function Orbit() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="p1-hull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2f4f7" />
          <stop offset="0.5" stopColor="#b9bfc9" />
          <stop offset="1" stopColor="#5d6470" />
        </linearGradient>
        <radialGradient id="p1-gas">
          <stop offset="0" stopColor="#e9f2ff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#e9f2ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="p1-sun" cx="0.08" cy="0.1" r="0.5">
          <stop offset="0" stopColor="#fff3dc" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff3dc" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="#02040a" />
      <rect width="1600" height="900" fill="url(#p1-sun)" />
      <Stars n={120} seed={23} />
      <MarsGlobe cx={800} cy={1720} r={1180} id="p1-orbitmars" />

      {/* the damaged ship */}
      <g transform="translate(780 330) rotate(-9)">
        {[-470, 250].map((wx) => (
          <g key={wx}>
            <rect x={wx} y="-26" width="220" height="52" fill="#131b2a" stroke="#56627a" strokeWidth="2" />
            {[1, 2, 3, 4, 5].map((n) => (
              <line key={n} x1={wx + n * 36.7} y1="-26" x2={wx + n * 36.7} y2="26" stroke="#2c3749" strokeWidth="2" />
            ))}
          </g>
        ))}
        <line x1="-250" y1="0" x2="-160" y2="0" stroke="#7b828e" strokeWidth="6" />
        <line x1="160" y1="0" x2="250" y2="0" stroke="#7b828e" strokeWidth="6" />
        {/* hull, crew module and dead engine */}
        <rect x="-160" y="-46" width="320" height="92" rx="20" fill="url(#p1-hull)" stroke="#5d6470" strokeWidth="2" />
        <path d="M160 -40 L230 -22 L230 22 L160 40 Z" fill="url(#p1-hull)" stroke="#5d6470" strokeWidth="2" />
        <rect x="186" y="-10" width="22" height="20" rx="4" fill="#1f2633" />
        <path d="M-160 -30 L-210 -46 L-210 46 L-160 30 Z" fill="#4a505a" stroke="#2c3036" strokeWidth="2" />
        <ellipse cx="-212" cy="0" rx="8" ry="46" fill="#1a1d22" />
        {[-90, -10, 70].map((x) => (
          <line key={x} x1={x} y1="-46" x2={x} y2="46" stroke="#7b828e" strokeWidth="2" opacity="0.6" />
        ))}
        {/* scorch where the engine died */}
        <ellipse cx="-150" cy="-10" rx="26" ry="18" fill="#1a1d22" opacity="0.6" />
        {/* oxygen tank with the meteoroid hole */}
        <circle cx="-40" cy="58" r="34" fill="url(#p1-hull)" stroke="#5d6470" strokeWidth="2" />
        <circle cx="-30" cy="78" r="6" fill="#0b0d12" />
        <path d="M-36 72 L-48 66 M-24 74 L-14 70 M-30 84 L-28 94" stroke="#2c3036" strokeWidth="2" />
      </g>

      {/* oxygen escaping in a thin stream */}
      <g className="story-p1-anim-gas">
        {[
          [762, 422, 16],
          [752, 452, 24],
          [740, 488, 32],
          [722, 528, 42],
          [700, 574, 54],
        ].map(([x, y, r], n) => (
          <circle key={n} cx={x} cy={y} r={r} fill="url(#p1-gas)" opacity={0.9 - n * 0.15} />
        ))}
      </g>
      <g fill="#c9d2e0">
        <rect x="900" y="470" width="6" height="3" transform="rotate(20 900 470)" />
        <rect x="620" y="250" width="4" height="4" />
        <rect x="1010" y="230" width="3" height="5" />
      </g>
    </svg>
  );
}

function DescentHeat() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="p1-upper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#05060c" />
          <stop offset="0.55" stopColor="#2a1208" />
          <stop offset="1" stopColor="#8a3a16" />
        </linearGradient>
        <radialGradient id="p1-plasma">
          <stop offset="0" stopColor="#fff3c4" stopOpacity="0.95" />
          <stop offset="0.3" stopColor="#ffb347" stopOpacity="0.75" />
          <stop offset="0.7" stopColor="#ff6a1f" stopOpacity="0.3" />
          <stop offset="1" stopColor="#ff6a1f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="p1-trail" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#ffb347" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ff6a1f" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#p1-upper)" />
      <Stars n={50} seed={5} maxY={360} />
      <path d="M0 760 Q800 600 1600 760 L1600 900 L0 900 Z" fill="#6b2a10" />
      <path d="M0 760 Q800 600 1600 760" fill="none" stroke="#ff8a4a" strokeWidth="6" opacity="0.4" />

      {/* plasma trail behind the falling capsule */}
      <g className="story-p1-anim-flicker">
        {[0, 1, 2, 3, 4].map((n) => (
          <path key={n} d={`M${760 + n * 8} ${470 - n * 6} L${1300 - n * 40} ${80 + n * 30}`} stroke="url(#p1-trail)" strokeWidth={26 - n * 4} strokeLinecap="round" opacity={0.7 - n * 0.1} />
        ))}
        <ellipse cx="760" cy="490" rx="170" ry="120" fill="url(#p1-plasma)" transform="rotate(-35 760 490)" />
      </g>
      <g transform="translate(790 450) rotate(35) scale(1.6)">
        <Capsule />
      </g>
    </svg>
  );
}

function DescentChute() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="p1-day" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6e4a3c" />
          <stop offset="0.6" stopColor="#c98a62" />
          <stop offset="1" stopColor="#e2b089" />
        </linearGradient>
        <linearGradient id="p1-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a35d36" />
          <stop offset="1" stopColor="#6b3519" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#p1-day)" />
      {/* ground far below, with craters */}
      <path d="M0 700 L1600 680 L1600 900 L0 900 Z" fill="url(#p1-ground)" />
      {[
        [300, 760, 70],
        [980, 740, 40],
        [1350, 800, 90],
        [640, 840, 55],
      ].map(([x, y, r]) => (
        <g key={x}>
          <ellipse cx={x} cy={y} rx={r} ry={r * 0.22} fill="#5a2a12" opacity="0.55" />
          <ellipse cx={x + r * 0.1} cy={y - r * 0.05} rx={r * 0.8} ry={r * 0.14} fill="#c47a4c" opacity="0.4" />
        </g>
      ))}

      {/* parachute, lines and capsule swaying together */}
      <g className="story-p1-anim-sway">
        <g transform="translate(800 0)">
          <defs>
            <clipPath id="p1-canopy">
              <path d="M-260 230 Q0 20 260 230 Q130 200 0 214 Q-130 200 -260 230 Z" />
            </clipPath>
          </defs>
          <path d="M-260 230 Q0 20 260 230 Q130 200 0 214 Q-130 200 -260 230 Z" fill="#f2efe8" />
          {/* orange and white gores, fanning out from the top of the canopy */}
          <g clipPath="url(#p1-canopy)">
            {[-3, -1, 1, 3].map((g) => (
              <path key={g} d={`M0 60 L${g * 75 - 37} 260 L${g * 75 + 37} 260 Z`} fill="#c8642f" opacity="0.92" />
            ))}
            <path d="M-260 230 Q0 20 260 230" fill="none" stroke="#fff" strokeWidth="18" opacity="0.18" />
          </g>
          <path d="M-260 230 Q0 20 260 230 Q130 200 0 214 Q-130 200 -260 230 Z" fill="none" stroke="#8a7a6a" strokeWidth="2" />
          {[-250, -130, 0, 130, 250].map((x) => (
            <line key={x} x1={x} y1="222" x2={x * 0.08} y2="520" stroke="#3a2c22" strokeWidth="1.6" opacity="0.8" />
          ))}
          <g transform="translate(0 560) scale(1.3)">
            <Capsule shield={false} />
          </g>
        </g>
      </g>
      {/* the heat shield falling away below */}
      <g transform="translate(860 760) rotate(18)">
        <path d="M-50 0 Q0 22 50 0 L44 9 Q0 30 -44 9 Z" fill="#5a3a26" stroke="#2a1a10" strokeWidth="2" />
      </g>
    </svg>
  );
}

function DescentLand() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="p1-landsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5e4034" />
          <stop offset="1" stopColor="#d9a27e" />
        </linearGradient>
        <linearGradient id="p1-landground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b8734a" />
          <stop offset="1" stopColor="#6b3519" />
        </linearGradient>
        <radialGradient id="p1-thrust">
          <stop offset="0" stopColor="#fff3c4" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#ffb347" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ff6a1f" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="p1-dust">
          <stop offset="0" stopColor="#d8a27a" stopOpacity="0.85" />
          <stop offset="1" stopColor="#d8a27a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#p1-landsky)" />
      {/* distant mesas */}
      <path d="M0 520 L120 480 L260 500 L380 450 L520 480 L700 470 L860 430 L1020 470 L1180 450 L1340 490 L1480 460 L1600 480 L1600 560 L0 560 Z" fill="#9a5a3a" opacity="0.7" />
      <rect y="540" width="1600" height="360" fill="url(#p1-landground)" />

      {/* small rocks on the plain; the same picture for either landing choice */}
      {[
        [220, 640, 18],
        [420, 720, 12],
        [1060, 700, 16],
        [1260, 640, 22],
        [900, 820, 14],
      ].map(([x, y, r]) => (
        <path key={x} d={`M${x - r} ${y} Q${x - r * 0.4} ${y - r * 1.1} ${x + r * 0.3} ${y - r * 0.8} Q${x + r} ${y - r * 0.4} ${x + r} ${y} Z`} fill="#4a2410" opacity="0.85" />
      ))}

      {/* our capsule on its landing legs, rockets still firing */}
      <g transform="translate(640 590) scale(1.25)">
        <ellipse cx="0" cy="56" rx="260" ry="46" fill="url(#p1-dust)" className="story-p1-anim-flicker" />
        <ellipse cx="0" cy="40" rx="40" ry="60" fill="url(#p1-thrust)" className="story-p1-anim-flicker" />
        <line x1="-50" y1="10" x2="-90" y2="58" stroke="#9aa1ad" strokeWidth="6" strokeLinecap="round" />
        <line x1="50" y1="10" x2="90" y2="58" stroke="#9aa1ad" strokeWidth="6" strokeLinecap="round" />
        <g transform="translate(0 -30) scale(1.5)">
          <Capsule shield={false} />
        </g>
      </g>
    </svg>
  );
}

/** Draws the Part 1 scene for an art key. */
export function Part1Art({ k }: { k: Part1ArtKey }): ReactNode {
  switch (k) {
    case "ship":
      return <ShipInterior hit={false} />;
    case "shipHit":
      return <ShipInterior hit />;
    case "orbit":
      return <Orbit />;
    case "descentHeat":
      return <DescentHeat />;
    case "descentChute":
      return <DescentChute />;
    case "descentLand":
      return <DescentLand />;
  }
}

// PART 2 pictures: dustStorm, solarStorm. Owned by Person 2.
// Inline SVG, viewBox 1600×900, no words. Mars orange is the one accent.
// The scenes show what the crew did (frost, a tank wall, someone outside),
// never whether it was a good idea. Moving layers use the story-p2-move class,
// which part2.css stills when reduce motion is on.

import type { ReactNode } from "react";
import type { Choice } from "../types";

/** What the pictures need to know: the player's choices so far (index 0 is decision 1). */
export interface Part2Scene {
  choices: Choice[];
}

const pick = (choices: Choice[], decision: number) => choices[decision - 1];

// ---------- shared pieces ----------

const Defs = () => (
  <defs>
    <linearGradient id="p2-metal" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#c9d0db" />
      <stop offset="1" stopColor="#6d7686" />
    </linearGradient>
    <linearGradient id="p2-metal-night" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#5a6478" />
      <stop offset="1" stopColor="#262d3b" />
    </linearGradient>
    <linearGradient id="p2-panel" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stopColor="#1c2c4a" />
      <stop offset="1" stopColor="#0d1526" />
    </linearGradient>
    <radialGradient id="p2-warm" r="0.6">
      <stop offset="0" stopColor="#ffb469" stopOpacity="0.55" />
      <stop offset="1" stopColor="#ffb469" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="p2-cold" r="0.6">
      <stop offset="0" stopColor="#9fd3ff" stopOpacity="0.35" />
      <stop offset="1" stopColor="#9fd3ff" stopOpacity="0" />
    </radialGradient>
  </defs>
);

/** The habitat: a long module with a dome. Windows warm, frosted or dark. */
function Habitat({ x, y, night, windows }: { x: number; y: number; night?: boolean; windows: "warm" | "frost" }) {
  const metal = night ? "url(#p2-metal-night)" : "url(#p2-metal)";
  const glass = windows === "warm" ? "#ffc27a" : "#bfe3ff";
  return (
    <g>
      <ellipse cx={x + 190} cy={y + 168} rx="250" ry="22" fill="#000" opacity="0.35" />
      <circle cx={x + 300} cy={y + 60} r="96" fill={metal} />
      <rect x={x} y={y + 40} width="380" height="124" rx="56" fill={metal} />
      <rect x={x + 16} y={y + 150} width="348" height="12" rx="4" fill="#1a1f2a" opacity="0.6" />
      {[60, 130, 200].map((dx) => (
        <g key={dx}>
          <rect x={x + dx} y={y + 78} width="44" height="30" rx="8" fill={glass} opacity={night ? 0.95 : 0.85} />
          {windows === "frost" && (
            <path d={`M${x + dx + 4} ${y + 104} l8 -8 l4 6 l8 -12 l6 9 l6 -5 l6 10 Z`} fill="#ffffff" opacity="0.8" />
          )}
        </g>
      ))}
      <rect x={x + 270} y={y + 90} width="40" height="60" rx="6" fill="#2a3446" />
      <circle cx={x + 300} cy={y + 20} r="5" fill="#ff8a3d" />
    </g>
  );
}

/** A row of solar panels; dust from 0 (clean) to 1 (buried). */
function Panels({ x, y, dust, night }: { x: number; y: number; dust: number; night?: boolean }) {
  return (
    <g>
      {[0, 1, 2, 3].map((i) => {
        const px = x + i * 120;
        return (
          <g key={i}>
            <line x1={px + 50} y1={y + 40} x2={px + 50} y2={y + 92} stroke="#3a4252" strokeWidth="6" />
            <path d={`M${px} ${y + 44} L${px + 20} ${y} L${px + 110} ${y} L${px + 96} ${y + 44} Z`} fill="url(#p2-panel)" stroke="#4a5670" strokeWidth="2" />
            <path d={`M${px + 36} ${y + 44} L${px + 50} ${y} M${px + 70} ${y + 44} L${px + 80} ${y} M${px + 8} ${y + 22} L${px + 104} ${y + 22}`} stroke="#33466b" strokeWidth="2" />
            {dust > 0 && (
              <path d={`M${px} ${y + 44} L${px + 20} ${y} L${px + 110} ${y} L${px + 96} ${y + 44} Z`} fill={night ? "#5a3622" : "#b0703f"} opacity={dust * 0.92} />
            )}
          </g>
        );
      })}
    </g>
  );
}

/** The fuel plant: a box with a stack and a light that is on or off. */
function FuelPlant({ x, y, on, night }: { x: number; y: number; on: boolean; night?: boolean }) {
  const metal = night ? "url(#p2-metal-night)" : "url(#p2-metal)";
  return (
    <g>
      <ellipse cx={x + 90} cy={y + 132} rx="120" ry="14" fill="#000" opacity="0.35" />
      <rect x={x + 20} y={y} width="40" height="80" rx="8" fill={metal} />
      <rect x={x} y={y + 50} width="180" height="80" rx="10" fill={metal} />
      <rect x={x + 120} y={y + 22} width="24" height="30" fill="#4a5262" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={x + 20 + i * 44} y={y + 74} width="30" height="10" rx="3" fill={on ? "#ff8a3d" : "#2a2f3a"} />
      ))}
      {on && <circle cx={x + 90} cy={y + 90} r="80" fill="url(#p2-warm)" className="story-p2-move story-p2-pulse" />}
    </g>
  );
}

/** One upright water tank. */
const WaterTank = ({ x, y, night }: { x: number; y: number; night?: boolean }) => (
  <g>
    <rect x={x} y={y} width="46" height="70" rx="16" fill={night ? "#3d5a7a" : "#6f8fb0"} stroke="#1a2333" strokeWidth="2" />
    <rect x={x + 7} y={y + 8} width="7" height="54" rx="3" fill="#fff" opacity="0.25" />
  </g>
);

/** The return rocket far off on its pad. */
const Rocket = ({ x, y, night }: { x: number; y: number; night?: boolean }) => (
  <g opacity={night ? 0.9 : 0.75}>
    <path d={`M${x - 20} ${y} L${x - 20} ${y - 150} Q${x} ${y - 210} ${x + 20} ${y - 150} L${x + 20} ${y} Z`} fill={night ? "#3a4252" : "#9aa2b0"} />
    <path d={`M${x - 20} ${y - 30} L${x - 40} ${y} L${x - 20} ${y} Z M${x + 20} ${y - 30} L${x + 40} ${y} L${x + 20} ${y} Z`} fill="#4a5262" />
    <circle cx={x} cy={y - 170} r="4" fill="#ff8a3d" />
  </g>
);

/** A suited crew member at (x, y), about 110 units tall. */
const Astronaut = ({ x, y, brush, lean = 0 }: { x: number; y: number; brush?: boolean; lean?: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${lean})`}>
    <ellipse cx="0" cy="2" rx="30" ry="6" fill="#000" opacity="0.35" />
    <rect x="-22" y="-80" width="20" height="44" rx="6" fill="#8a919e" />
    <path d="M-14 0 L-12 -36 L12 -36 L14 0 Z" fill="#d9dee6" />
    <rect x="-18" y="-84" width="36" height="50" rx="14" fill="#eef1f5" />
    <circle cx="2" cy="-100" r="20" fill="#eef1f5" />
    <path d="M-6 -108 A14 14 0 0 1 20 -98 L20 -92 A14 12 0 0 1 -6 -94 Z" fill="#ff8a3d" opacity="0.85" />
    {brush ? (
      <g>
        <path d="M16 -72 Q40 -82 58 -104" stroke="#eef1f5" strokeWidth="10" strokeLinecap="round" fill="none" />
        <line x1="58" y1="-104" x2="92" y2="-130" stroke="#5a4636" strokeWidth="5" />
        <rect x="88" y="-142" width="26" height="12" rx="3" transform="rotate(-38 101 -136)" fill="#c9a26a" />
      </g>
    ) : (
      <path d="M16 -72 Q30 -60 26 -44" stroke="#eef1f5" strokeWidth="10" strokeLinecap="round" fill="none" />
    )}
  </g>
);

const stars = (n: number): ReactNode =>
  Array.from({ length: n }, (_, i) => (
    <circle key={i} cx={(i * 263 + 41) % 1600} cy={(i * 137 + 17) % 520} r={(i % 3) * 0.6 + 0.6} fill="#fff" opacity={0.35 + (i % 4) * 0.12} />
  ));

// ---------- crisis 2: the dust storm ----------

function DustStorm({ choices }: Part2Scene) {
  const power = pick(choices, 3); // A heaters, B fuel plant
  const panels = pick(choices, 4); // A wipe in the storm, B wait it out
  const wiping = panels === "A";
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <Defs />
      <defs>
        <linearGradient id="p2-dust-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#3b1f12" />
          <stop offset="0.55" stopColor="#8a4a26" />
          <stop offset="1" stopColor="#b8703f" />
        </linearGradient>
        <linearGradient id="p2-dust-ground" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#7a3f20" />
          <stop offset="1" stopColor="#2e160b" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#p2-dust-sky)" />
      {/* the sun, barely through the dust */}
      <circle cx="1220" cy="190" r="46" fill="#f0c28a" opacity="0.28" />
      <circle cx="1220" cy="190" r="120" fill="#f0c28a" opacity="0.08" />
      {/* far ridges */}
      <path d="M0 560 L180 500 L340 530 L520 470 L700 520 L900 480 L1080 530 L1280 470 L1460 510 L1600 490 L1600 620 L0 620 Z" fill="#6d3a1e" opacity="0.8" />
      <rect y="600" width="1600" height="300" fill="url(#p2-dust-ground)" />
      <Rocket x={1420} y={620} />
      <FuelPlant x={1060} y={500} on={power === "B"} />
      <Panels x={120} y={600} dust={wiping ? 0.45 : 1} />
      <Habitat x={560} y={470} windows={power === "B" ? "frost" : "warm"} />
      {power !== "B" && <circle cx="750" cy="560" r="220" fill="url(#p2-warm)" />}
      {wiping && <Astronaut x={380} y={760} brush lean={-8} />}
      {/* rolling dust: back layer, front layer, then haze */}
      <g className="story-p2-move story-p2-drift-slow" opacity="0.35">
        <path d="M-200 520 C 100 440, 300 600, 600 520 S 1100 440, 1400 540 S 1900 460, 2000 520 L2000 760 L-200 760 Z" fill="#c4834f" />
      </g>
      <g className="story-p2-move story-p2-drift" opacity="0.4">
        <path d="M-300 700 C 0 640, 260 780, 560 700 S 1080 620, 1380 720 S 1900 640, 2100 700 L2100 900 L-300 900 Z" fill="#a86338" />
        {Array.from({ length: 26 }, (_, i) => (
          <line key={i} x1={(i * 97) % 1800 - 100} y1={300 + ((i * 53) % 480)} x2={(i * 97) % 1800 + 60} y2={290 + ((i * 53) % 480)} stroke="#e0a26a" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        ))}
      </g>
      <rect width="1600" height="900" fill="#c98a55" opacity="0.18" />
    </svg>
  );
}

// ---------- crisis 3: the solar storm ----------

function SolarStorm({ choices }: Part2Scene) {
  const power = pick(choices, 3);
  const panels = pick(choices, 4);
  const shelter = pick(choices, 5); // A everyone inside, B finish the fuel line
  const wall = pick(choices, 6); // A stack the tanks, B keep the water
  const outside = shelter === "B" && !wall;
  const lineDone = shelter === "B";
  // The tanks sit by the fuel plant until the crew stacks them as a wall.
  const wallTanks: [number, number][] = [[300, 610], [350, 610], [400, 610], [450, 610], [325, 545], [375, 545], [425, 545], [520, 610], [570, 610]];
  const plantTanks: [number, number][] = [[1260, 640], [1310, 640], [1360, 640]];
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <Defs />
      <defs>
        <linearGradient id="p2-night-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#02040a" />
          <stop offset="1" stopColor="#141b2e" />
        </linearGradient>
        <linearGradient id="p2-night-ground" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#3a2014" />
          <stop offset="1" stopColor="#0c0705" />
        </linearGradient>
        <radialGradient id="p2-shelter-glow" r="0.55">
          <stop offset="0" stopColor="#ff9a4d" stopOpacity="0.6" />
          <stop offset="1" stopColor="#ff9a4d" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#p2-night-sky)" />
      {stars(90)}
      {/* faint streaks of fast particles */}
      <g className="story-p2-move story-p2-rain" stroke="#ffe0a8" strokeLinecap="round">
        {Array.from({ length: 34 }, (_, i) => {
          const sx = (i * 151) % 1900 - 150;
          const sy = (i * 89) % 520 - 120;
          return <line key={i} x1={sx} y1={sy} x2={sx + 120} y2={sy + 170} strokeWidth={1 + (i % 3) * 0.6} opacity={0.07 + (i % 5) * 0.035} />;
        })}
      </g>
      <path d="M0 590 L200 540 L380 570 L600 520 L820 560 L1040 520 L1260 560 L1440 530 L1600 550 L1600 640 L0 640 Z" fill="#1e120c" />
      <rect y="620" width="1600" height="280" fill="url(#p2-night-ground)" />
      <Rocket x={1480} y={640} night />
      <FuelPlant x={1080} y={520} on={power === "B" || lineDone} night />
      <Panels x={60} y={690} dust={panels === "A" ? 0.25 : 0.5} night />
      {/* the fuel line from the plant toward the rocket */}
      <path d="M1250 640 Q1350 680 1440 640" stroke="#6d7686" strokeWidth="8" fill="none" strokeLinecap="round" />
      {lineDone ? (
        <path d="M1440 640 L1462 630" stroke="#6d7686" strokeWidth="8" strokeLinecap="round" />
      ) : (
        <path d="M1380 668 q16 18 4 34" stroke="#6d7686" strokeWidth="8" fill="none" strokeLinecap="round" />
      )}
      {/* the shelter, lit from inside */}
      <circle cx="430" cy="560" r="260" fill="url(#p2-shelter-glow)" />
      <path d="M300 660 L300 560 Q430 440 560 560 L560 660 Z" fill="url(#p2-metal-night)" stroke="#111622" strokeWidth="3" />
      <rect x="400" y="580" width="60" height="80" rx="8" fill={shelter === "A" ? "#2a3446" : "#ffb469"} />
      <rect x="330" y="580" width="40" height="26" rx="6" fill="#ffc27a" />
      <rect x="490" y="580" width="40" height="26" rx="6" fill="#ffc27a" />
      {wall === "A" ? wallTanks.map(([x, y], i) => <WaterTank key={i} x={x - 10} y={y} night />) : plantTanks.map(([x, y], i) => <WaterTank key={i} x={x - 30} y={y - 10} night />)}
      <Habitat x={700} y={500} night windows={power === "B" ? "frost" : "warm"} />
      {outside && <Astronaut x={1420} y={720} lean={4} />}
      {outside && <circle cx="1406" cy="640" r="7" fill="#ff8a3d" className="story-p2-move story-p2-blink" />}
    </svg>
  );
}

export function part2Art(scene: Part2Scene): Record<string, () => ReactNode> {
  return {
    dustStorm: () => <DustStorm {...scene} />,
    solarStorm: () => <SolarStorm {...scene} />,
  };
}

/** The scenes before any Part 2 choice, kept under the original name. */
export const PART2_ART = part2Art({ choices: [] });

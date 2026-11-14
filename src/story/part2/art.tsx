// PART 2 pictures, sols 4-8. Inline SVG, 1600x900, no words inside pictures.
// The outdoor scenes reuse the base the kid built in Part 1, so the world
// stays the same; weather and light are layered on top. Anything that moves
// carries a story-p1-anim-* or story-p2-anim-* class (off for reduce motion).

import type { ReactNode } from "react";
import { Particles } from "../part1/art";
import { FinishedBase } from "../part1/build";
import type { Part2ArtKey } from "./content";

const Overlay = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="story-p2-overlay" aria-hidden="true">
    {children}
  </svg>
);

/** Sol 4: the global dust storm. The sun is a dim disk, dust races past. */
function DustStorm() {
  return (
    <>
      <FinishedBase />
      <Overlay>
        <defs>
          <linearGradient id="p2-dust" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7a3f22" stopOpacity="0.85" />
            <stop offset="0.6" stopColor="#b8703f" stopOpacity="0.62" />
            <stop offset="1" stopColor="#c98a55" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#p2-dust)" />
        {/* the Sun is only a dim disk behind the dust */}
        <circle cx="1180" cy="170" r="34" fill="#f3d2a8" opacity="0.35" />
        <circle cx="1180" cy="170" r="90" fill="#f3d2a8" opacity="0.08" />
        <g opacity="0.8">
          <Particles n={60} seed={71} box={[-200, 100, 1600, 860]} dx={[500, 900]} dy={[-40, 40]} r={[1.4, 3]} color="#f0c49a" dur={[1.2, 2.6]} kind="streak" />
        </g>
        <g className="story-p2-anim-gust" opacity="0.35">
          {[220, 420, 620, 780].map((y, i) => (
            <path key={y} d={`M-100 ${y} Q400 ${y - 40 + i * 10} 900 ${y} T1900 ${y}`} fill="none" stroke="#f0c49a" strokeWidth={18 - i * 3} strokeLinecap="round" />
          ))}
        </g>
      </Overlay>
    </>
  );
}

/** After the storm: the sky clears, a gust sweeps the panels clean. */
function DustClear() {
  return (
    <>
      <FinishedBase />
      <Overlay>
        <rect width="1600" height="900" fill="#c98a55" opacity="0.18" />
        {/* a swirl of wind crossing the panels */}
        <g className="story-p2-anim-swirl">
          {[0, 1, 2, 3, 4].map((i) => (
            <ellipse key={i} cx="1240" cy={600 - i * 34} rx={40 + i * 16} ry="10" fill="none" stroke="#f0d2b4" strokeWidth="5" opacity={0.55 - i * 0.08} />
          ))}
        </g>
        <Particles n={24} seed={83} box={[1100, 520, 1380, 660]} dx={[60, 200]} dy={[-160, -60]} r={[1.4, 2.6]} color="#f0d2b4" dur={[1.4, 2.6]} />
      </Overlay>
    </>
  );
}

/** Sol 6: inside the habitat. Stuffy air, a clogged CO2 cleaner, red dust on the floor. */
function BadAir() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="p2-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a3346" />
          <stop offset="1" stopColor="#141a26" />
        </linearGradient>
        <radialGradient id="p2-lamp" cx="0.5" cy="0" r="0.9">
          <stop offset="0" stopColor="#ffe2b0" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffe2b0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="p2-redlight" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ff3b30" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ff3b30" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="p2-window" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#e3a07a" />
          <stop offset="1" stopColor="#9a5230" />
        </radialGradient>
      </defs>
      {/* the curved inside of the habitat tube */}
      <rect width="1600" height="900" fill="#0d121c" />
      <path d="M0 120 Q800 -60 1600 120 L1600 760 Q800 900 0 760 Z" fill="url(#p2-wall)" />
      {[200, 460, 800, 1140, 1400].map((x) => (
        <path key={x} d={`M${x} ${x === 800 ? 30 : 70} Q${x + (x < 800 ? -30 : x > 800 ? 30 : 0)} 450 ${x} ${x === 800 ? 860 : 810}`} fill="none" stroke="#3a4560" strokeWidth="6" />
      ))}
      <rect width="1600" height="900" fill="url(#p2-lamp)" />
      {/* floor with a film of red dust near the airlock */}
      <path d="M0 760 Q800 900 1600 760 L1600 900 L0 900 Z" fill="#1d2330" />
      <ellipse cx="300" cy="830" rx="240" ry="36" fill="#a35d36" opacity="0.4" />
      <ellipse cx="520" cy="850" rx="160" ry="22" fill="#a35d36" opacity="0.3" />
      {/* round window with Mars outside */}
      <circle cx="800" cy="300" r="96" fill="#3a4560" />
      <circle cx="800" cy="300" r="80" fill="url(#p2-window)" />
      <path d="M720 330 Q800 300 880 336 L880 380 L720 380 Z" fill="#7a3a1c" opacity="0.7" />
      {/* airlock door with suits hanging, red with dust */}
      <rect x="90" y="300" width="160" height="440" rx="30" fill="#2f394d" stroke="#56627a" strokeWidth="4" />
      <rect x="120" y="340" width="100" height="360" rx="20" fill="#1c2333" />
      {[300, 380].map((x) => (
        <g key={x}>
          <circle cx={x} cy="360" r="28" fill="#d7dbe3" />
          <rect x={x - 34} y="388" width="68" height="150" rx="20" fill="#d7dbe3" />
          <rect x={x - 34} y="460" width="68" height="78" rx="12" fill="#b8703f" opacity="0.55" />
        </g>
      ))}
      {/* the CO2 cleaner on the wall: clogged filter, fan, warning light */}
      <g transform="translate(1180 250)">
        <rect x="0" y="0" width="240" height="260" rx="14" fill="#c9ced6" stroke="#56627a" strokeWidth="4" />
        <rect x="24" y="24" width="192" height="130" rx="8" fill="#3a3d44" />
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} x1={36 + i * 28} y1="34" x2={36 + i * 28} y2="144" stroke="#5d6470" strokeWidth="4" />
        ))}
        {/* dust clogging the filter */}
        <path d="M24 154 L24 100 Q60 90 90 110 Q130 80 170 104 Q200 92 216 100 L216 154 Z" fill="#a35d36" opacity="0.85" />
        <circle cx="70" cy="206" r="30" fill="#3a3d44" />
        <g className="story-p2-anim-slowfan" style={{ transformOrigin: "70px 206px" }}>
          <path d="M70 206 L70 182 M70 206 L91 218 M70 206 L49 218" stroke="#9aa1ad" strokeWidth="6" strokeLinecap="round" />
        </g>
        <circle cx="190" cy="200" r="14" fill="#ff3b30" className="story-p1-anim-alarm" />
        <circle cx="190" cy="200" r="60" fill="url(#p2-redlight)" className="story-p1-anim-alarm" />
      </g>
      {/* Mei and Tunde at the table, tired */}
      <rect x="540" y="560" width="520" height="24" rx="8" fill="#56627a" />
      <rect x="560" y="584" width="20" height="140" fill="#3a4560" />
      <rect x="1020" y="584" width="20" height="140" fill="#3a4560" />
      {[
        [640, "#4f78a8"],
        [960, "#c98a1f"],
      ].map(([x, c]) => (
        <g key={x as number} transform={`translate(${x} 0)`}>
          <rect x="-56" y="470" width="112" height="120" rx="40" fill="#e9ecf2" />
          <circle cx="0" cy="440" r="40" fill="#e9ecf2" />
          <path d="M-30 436 A30 22 0 0 1 30 436 L30 446 A30 16 0 0 1 -30 446 Z" fill={c as string} opacity="0.85" />
          {/* a hand to the head: a headache */}
          <path d="M40 520 Q70 470 36 430" fill="none" stroke="#e9ecf2" strokeWidth="22" strokeLinecap="round" />
        </g>
      ))}
      {/* stuffy, hazy air drifting slowly */}
      <rect width="1600" height="900" fill="#9fb0a0" opacity="0.12" className="story-p2-anim-haze" />
    </svg>
  );
}

/** Sol 7: a calm day, but the Sun flares. The warning arrives by radio. */
function Warning() {
  return (
    <>
      <FinishedBase />
      <Overlay>
        <defs>
          <radialGradient id="p2-flare">
            <stop offset="0" stopColor="#fffbe8" stopOpacity="1" />
            <stop offset="0.25" stopColor="#ffe7a8" stopOpacity="0.8" />
            <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* the Sun with a bright flash on its edge */}
        <circle cx="1220" cy="150" r="140" fill="url(#p2-flare)" className="story-p2-anim-flare" />
        <circle cx="1220" cy="150" r="22" fill="#fffbe8" />
        <g stroke="#fff3c4" strokeWidth="3" strokeLinecap="round" className="story-p2-anim-flare">
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <line key={i} x1={1220 + Math.cos(a) * 34} y1={150 + Math.sin(a) * 34} x2={1220 + Math.cos(a) * (70 + (i % 3) * 30)} y2={150 + Math.sin(a) * (70 + (i % 3) * 30)} opacity="0.7" />;
          })}
        </g>
        {/* radio waves arriving from Earth, above the habitat */}
        <g fill="none" stroke="#8fd0ff" strokeWidth="5" strokeLinecap="round" className="story-p2-anim-radio">
          <path d="M930 500 Q960 470 990 500" />
          <path d="M910 480 Q960 430 1010 480" />
          <path d="M890 460 Q960 390 1030 460" />
        </g>
      </Overlay>
    </>
  );
}

/** Particle streaks for the solar storm: [x, y, seconds, start offset, width, opacity]. */
const STREAKS: [number, number, number, number, number, number][] = (() => {
  let s = 29;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  return Array.from({ length: 46 }, () => {
    const dur = 0.9 + rnd() * 1.4;
    return [rnd() * 1900, -120 + rnd() * 500, dur, rnd() * dur, rnd() < 0.2 ? 2.6 : 1.4, 0.35 + rnd() * 0.5] as [number, number, number, number, number, number];
  });
})();

/** Sol 8: the particles arrive at night; the shelter glows, streaks fill the sky. */
function SolarStorm() {
  return (
    <>
      <FinishedBase night />
      <Overlay>
        {/* fast particles streaking down: each one falls at its own speed, from its
            own start time, so the sky never repeats in step */}
        <g stroke="#ffe7a8" strokeLinecap="round">
          {STREAKS.map(([x, y, dur, delay, w, o], i) => (
            <line
              key={i}
              x1={x}
              y1={y}
              x2={x - 70}
              y2={y + 110}
              strokeWidth={w}
              opacity={o}
              className="story-p2-anim-streak"
              style={{ animationDuration: `${dur}s`, animationDelay: `${-delay}s` }}
            />
          ))}
        </g>
        {/* the shelter glows: everyone is inside */}
        <ellipse cx="960" cy="610" rx="230" ry="70" fill="#ffd98a" opacity="0.12" />
      </Overlay>
    </>
  );
}

export function Part2Art({ k }: { k: Part2ArtKey }): ReactNode {
  switch (k) {
    case "dustStorm":
      return <DustStorm />;
    case "dustClear":
      return <DustClear />;
    case "badAir":
      return <BadAir />;
    case "warning":
      return <Warning />;
    case "solarStorm":
      return <SolarStorm />;
  }
}

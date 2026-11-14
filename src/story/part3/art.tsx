// PART 3 pictures: the marsquake, launch day and both endings.
// Inline SVG, 1600x900, no words inside pictures. Outdoor scenes reuse the
// base built in Part 1. Anything that moves carries a story-p3-anim-* or
// story-p1-anim-* class (off for reduce motion).

import type { ReactNode } from "react";
import { Particles, Stars } from "../part1/art";
import { FinishedBase } from "../part1/build";
import type { Part3ArtKey } from "./content";

const Overlay = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="story-p3-overlay" aria-hidden="true">
    {children}
  </svg>
);

/** The return rocket that takes the crew home: white, with orange fins. */
function Rocket({ x, y, s = 1, flame = false }: { x: number; y: number; s?: number; flame?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {flame && (
        <g className="story-p1-anim-flicker">
          <path d="M-26 -10 Q0 260 26 -10 Z" fill="#ffb347" opacity="0.85" />
          <path d="M-14 -10 Q0 150 14 -10 Z" fill="#fff3c4" />
        </g>
      )}
      <path d="M-40 -30 L-70 0 M40 -30 L70 0" stroke="#9aa1ad" strokeWidth="8" strokeLinecap="round" />
      <path d="M0 -380 Q42 -320 42 -220 L42 -26 L-42 -26 L-42 -220 Q-42 -320 0 -380 Z" fill="#eef0f3" stroke="#8a919c" strokeWidth="4" />
      <path d="M0 -380 Q42 -320 42 -220 L42 -26 L18 -26 L18 -220 Q18 -310 0 -380 Z" fill="#000" opacity="0.14" />
      <circle cx="0" cy="-270" r="16" fill="#1f2633" stroke="#8a919c" strokeWidth="4" />
      <rect x="-42" y="-150" width="84" height="12" fill="#c8642f" />
      <path d="M-42 -90 L-76 -16 L-42 -30 Z M42 -90 L76 -16 L42 -30 Z" fill="#c8642f" />
      <rect x="-30" y="-26" width="60" height="16" rx="4" fill="#5d6470" />
    </g>
  );
}

/** Sol 11: the ground shakes; dust falls, the ground cracks, fuel hisses out. */
function Quake() {
  return (
    <div className="story-p3-anim-quake story-p3-fill">
      <FinishedBase />
      <Overlay>
        {/* a fresh crack across the ground */}
        <path d="M120 760 L260 742 L330 770 L470 748 L560 776 L700 754 L820 780 L960 760 L1080 786 L1240 764 L1420 790" fill="none" stroke="#2a1208" strokeWidth="5" strokeLinejoin="round" opacity="0.8" />
        <path d="M330 770 L360 800 M700 754 L690 790 M1080 786 L1110 816" stroke="#2a1208" strokeWidth="3" opacity="0.6" />
        {/* dust shaken loose, falling and drifting */}
        <Particles n={40} seed={91} box={[0, 0, 1600, 520]} dx={[-30, 30]} dy={[120, 260]} r={[1.4, 3.2]} color="#e2b08a" dur={[1.2, 2.6]} />
        {/* fuel hissing from the cracked seal at the fuel plant */}
        <Particles n={18} seed={44} box={[332, 532, 342, 544]} dx={[-90, -20]} dy={[-90, -30]} r={[3, 8]} color="#e9f2ff" dur={[0.9, 1.8]} />
        <g stroke="#ffd08a" strokeWidth="3" strokeLinecap="round" className="story-p1-anim-blink">
          <path d="M344 536 L360 526 M346 540 L366 542 M344 546 L358 558" />
        </g>
        {/* a few rocks bouncing loose */}
        {[
          [520, 690, 9],
          [1180, 700, 7],
          [860, 720, 6],
        ].map(([x, y, r]) => (
          <g key={x} className="story-p3-anim-hop" style={{ animationDelay: `${(x % 7) / 10}s` }}>
            <circle cx={x} cy={y} r={r} fill="#4a2410" />
          </g>
        ))}
      </Overlay>
    </div>
  );
}

/** Sol 13: the return rocket on its pad beside the base, fuel hose attached. */
function Launch() {
  return (
    <>
      <FinishedBase />
      <Overlay>
        {/* the pad and a service tower, on the rocket s spot behind the base */}
        <ellipse cx="1330" cy="566" rx="90" ry="11" fill="#2a1208" opacity="0.4" />
        <rect x="1262" y="558" width="136" height="10" rx="4" fill="#6b7280" />
        <g stroke="#7b828e" strokeWidth="3.5">
          <line x1="1376" y1="562" x2="1376" y2="330" />
          <line x1="1398" y1="562" x2="1398" y2="330" />
          {[540, 490, 440, 390, 340].map((y) => (
            <line key={y} x1="1376" y1={y} x2="1398" y2={y - 24} />
          ))}
          <line x1="1376" y1="400" x2="1352" y2="400" />
        </g>
        <Rocket x={1330} y={558} s={0.6} />
        {/* cold fuel venting a little vapour */}
        <Particles n={16} seed={12} box={[1300, 500, 1360, 540]} dx={[-50, 50]} dy={[-50, -15]} r={[3, 8]} color="#f4f6fa" dur={[1.6, 3]} />
      </Overlay>
    </>
  );
}

/** Success: the rocket climbs through the pink sky; Earth is a small blue dot. */
function Home() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="p3-pink" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2a3e" />
          <stop offset="0.55" stopColor="#b9787a" />
          <stop offset="1" stopColor="#e6b391" />
        </linearGradient>
        <radialGradient id="p3-earth" cx="0.35" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#9fd4ff" />
          <stop offset="1" stopColor="#2a6fc2" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#p3-pink)" />
      <Stars n={40} seed={3} maxY={300} />
      {/* Earth, a tiny blue dot */}
      <circle cx="300" cy="170" r="9" fill="url(#p3-earth)" />
      <circle cx="300" cy="170" r="22" fill="#9fd4ff" opacity="0.18" />
      {/* the ground far below and the base, small */}
      <path d="M0 780 L160 760 L340 776 L520 750 L700 772 L880 748 L1060 770 L1240 752 L1420 774 L1600 760 L1600 900 L0 900 Z" fill="#9a5230" />
      <rect x="760" y="770" width="80" height="14" rx="6" fill="#eef0f3" opacity="0.8" />
      {/* the exhaust trail and the climbing rocket */}
      <path d="M800 780 Q820 600 860 420" fill="none" stroke="#f6e3c8" strokeWidth="26" strokeLinecap="round" opacity="0.55" />
      <g className="story-p3-anim-climb">
        <Rocket x={860} y={420} s={0.55} flame />
      </g>
    </svg>
  );
}

/** Fail: the rocket stays on its pad under a blue Mars sunset. */
function Stranded() {
  return (
    <>
      <FinishedBase night />
      <Overlay>
        <defs>
          <radialGradient id="p3-bluesun" cx="0.5" cy="1" r="0.8">
            <stop offset="0" stopColor="#9fc8ff" stopOpacity="0.7" />
            <stop offset="0.4" stopColor="#5d86c8" stopOpacity="0.3" />
            <stop offset="1" stopColor="#5d86c8" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* the Sun setting with Mars' blue glow around it */}
        <ellipse cx="420" cy="560" rx="520" ry="300" fill="url(#p3-bluesun)" />
        <circle cx="420" cy="540" r="16" fill="#e6f0ff" />
        <ellipse cx="1330" cy="566" rx="90" ry="11" fill="#000" opacity="0.4" />
        <rect x="1262" y="558" width="136" height="10" rx="4" fill="#4a4d54" />
        <Rocket x={1330} y={558} s={0.6} />
      </Overlay>
    </>
  );
}

export function Part3Art({ k }: { k: Part3ArtKey | "home" | "stranded" }): ReactNode {
  switch (k) {
    case "quake":
      return <Quake />;
    case "launch":
      return <Launch />;
    case "home":
      return <Home />;
    case "stranded":
      return <Stranded />;
  }
}
